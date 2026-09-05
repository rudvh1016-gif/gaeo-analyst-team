#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 자동분석 엔진 (GitHub Actions용 · Claude 토큰 0)

핵심 아이디어: 5인 애널리스트 모두 "이미 수집·계산된 숫자를 규칙·통계로 해석"하는
일이라 사람(Claude)의 판단 없이 심부름꾼(무료 러너)이 그대로 만들 수 있다.
- TARO(기술)·DIANA(재무)·FLOW(수급): 지표 규칙 기반 해석
- QUANT(확률·통계, 내부 id 'nova' 유지): "지금과 비슷한 상태였던 과거 사례가
  5거래일 뒤 실제로 올랐는가"를 추적 전 종목 누적 일봉에서 세어 실측 승률로 점수화
  (2026-07-21 교체 — 예전 NOVA 뉴스·심리 카드는 정밀분석 티어에만 남는다)
- CHIEF(종합): team_weights.js의 자가 학습 가중치(분석가별 실제 적중률 비례)로 합산

→ 이렇게 하면 종목을 수백 개로 늘려도 자동분석분은 토큰이 전혀 들지 않는다.
   정밀분석(analysis.js) 보유 종목도 포함해 모든 종목을 생성한다. 화면 표시 우선순위는
   index.html이 정한다(정밀분석이 신선하면 정밀 우선, 오래되면 이 자동분석 표시).

입력 : indicators.json (compute_indicators.py 산출) · analysis.js (정밀분석 목록 확인)
출력 : auto_analysis.js  →  const LIVE_AUTO = { "CODE": {tier:"auto", taro/diana/nova/flow/chief}, ... }
실행 : python3 analyze_auto.py   (워크플로우에서 compute_indicators.py 다음에 실행)
"""
import json, re, os, datetime, time, tempfile, urllib.request
import indicator_math

HERE = os.path.dirname(os.path.abspath(__file__))


def schedule_safety_handoff():
    """장시간 러너가 강제 종료되기 전에 다음 분석 작업을 미리 예약한다.

    GitHub Actions의 update-analysis 작업은 한 번 시작하면 장중에 30분 주기로
    반복한다. 600종목 처리가 길어진 날에는 작업 제한시간 직전에 마지막 회차가
    겹쳐, YAML의 정상적인 chain()까지 도달하지 못할 수 있다. 같은 러너에서
    4시간 30분이 지나면 다음 실행을 한 번만 미리 큐에 넣어 이 공백을 막는다.
    """
    if os.environ.get("GITHUB_ACTIONS") != "true" or os.environ.get("IS_MAIN") != "1":
        return
    run_id = os.environ.get("GITHUB_RUN_ID", "")
    api = os.environ.get("GH_API", "")
    auth = os.environ.get("GH_AUTH", "")
    if not run_id or not api or ":" not in auth:
        return

    marker_dir = tempfile.gettempdir()
    start_path = os.path.join(marker_dir, f"gaeo-analysis-{run_id}.start")
    done_path = os.path.join(marker_dir, f"gaeo-analysis-{run_id}.handoff")
    now = int(time.time())
    if not os.path.exists(start_path):
        with open(start_path, "w", encoding="ascii") as f:
            f.write(str(now))
        return
    if os.path.exists(done_path):
        return
    try:
        started = int(open(start_path, encoding="ascii").read().strip())
    except (OSError, ValueError):
        started = now
    if now - started < 270 * 60:
        return

    header_name, header_value = auth.split(":", 1)
    req = urllib.request.Request(
        f"{api}/update-analysis.yml/dispatches",
        data=b'{"ref":"main"}',
        method="POST",
        headers={
            header_name.strip(): header_value.strip(),
            "Accept": "application/vnd.github+json",
            "User-Agent": "gaeo-analysis-handoff",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            if response.status != 204:
                raise RuntimeError(f"HTTP {response.status}")
        with open(done_path, "w", encoding="ascii") as f:
            f.write(str(now))
        print("자동분석 안전 인계 예약 완료 — 현재 작업 종료 뒤 다음 러너가 이어받습니다")
    except Exception as exc:
        print(f"[경고] 자동분석 안전 인계 예약 실패 — 다음 회차에 재시도합니다: {exc}")


def load_js_object(path, varname):
    if not os.path.exists(path):
        return None
    txt = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1)) if m else None


def clamp(v, lo=5, hi=95):
    return int(max(lo, min(hi, round(v))))


def won(n):
    try:
        return f"{int(round(n)):,}원"
    except (TypeError, ValueError):
        return "—"


def stance_of(score):
    return "bull" if score >= 58 else ("bear" if score <= 43 else "neu")


# ⭐ 2026-08-13 사용자 지정 — 이동평균 이격도 "과열 감점" 곡선.
# 예전엔 gap*weight를 cap(±14/±10)에서 그냥 잘라내기만 해서, 정상적으로 오른 종목(예:
# MA20 대비 +15%)이나 극단적으로 과열된 종목(예: 금호건설 MA20 대비 +39.6%·MA60 대비
# +75.5%)이나 똑같이 "만점"을 받았다. 그 결과 며칠 새 급등해 평균회귀 리스크가 큰 종목이
# TARO 95점(강한 매수)처럼 잘못 읽히는 사고가 있었다(002990 케이스, 정밀분석에서 발견).
# plateau_end까지는 기존과 동일하게 선형·cap(건강한 상승은 그대로 보상), 그 너머는
# "더 오를수록 더 감점"으로 뒤집어 평균회귀 경고 신호로 다룬다. 500종목 실측(상위 20개
# ma20Gap·ma60Gap) 기준 plateau_end는 상위 10%(p90) 구간보다 넉넉히 위로 잡아, 정상적인
# 강세 종목(한국콜마·코스맥스·인바디 등, ma20Gap 20%대)은 거의 영향받지 않고 진짜 극단적인
# 케이스만 걸러지도록 보정했다. 하락 쪽(음수 gap)은 손대지 않았다(기존과 동일한 선형·cap).
def _gap_score(gap, weight, cap, plateau_end, decay):
    if gap is None:
        return 0.0
    if gap <= plateau_end:
        return max(-cap, min(cap, gap * weight))
    excess = gap - plateau_end
    return max(-cap, cap - excess * decay)


# ── TARO(기술): 이동평균 위치 + RSI + MACD + 거래량 ─────────────────────────
# ── 기본모델 버전 (7-8) ──────────────────────────────────────────────────────
# ⚠️ 이번에 TARO·QUANT·FLOW의 점수 의미(semantics)가 바뀌었다.
#    과거 점수로 학습한 team_weights를 새 점수에 그대로 이어 학습시키면 안 된다.
#    판단마다 아래 버전을 남겨, 가중치 학습이 같은 버전 기록만 쓰도록 한다.
#    modelVersion이 없는 과거 기록은 읽을 때 PRE_HOTFIX_BASE로 구분한다
#    (과거 파일을 대규모로 다시 쓰지는 않는다).
BASE_MODEL_VERSION = "base-2026-08-15-parity-hotfix"
PRE_HOTFIX_BASE = "PRE_HOTFIX_BASE"
COMPONENT_VERSIONS = {
    "taro": "taro-2026-08-15-maturity-gate",     # 부분 MA·미성숙 지표 제외
    "diana": "diana-2026-07-baseline",           # 이번에 안 바꿈
    "quant": "quant-2026-08-15-parity",          # Wilder RSI + 5거래일 ret5 통일
    "flow": "flow-2026-07-baseline",             # 이번에 안 바꿈(후보 검증 중)
    "risk": "risk-2026-07-baseline",             # 이번에 안 바꿈(후보 검증 중)
    "chief": "chief-2026-08-15-availability",    # 결측 분석가 가중치 재정규화
}


# 각 기술 지표가 '정식으로 쓸 수 있는 상태'인지 판정하는 최소 데이터 요건.
# ⚠️ 상장한 지 얼마 안 돼 54일치밖에 없는 종목의 평균을 MA60처럼 쓰면
#    가짜로 강한 TARO 점수가 나온다. 화면에는 보여줄 수 있어도 점수에는 못 쓴다.
TARO_MIN_RSI_DAYS = 15        # Wilder RSI14는 종가 15개 이상 필요
TARO_MIN_MACD_DAYS = 34       # EMA26 + 시그널 EMA9 워밍업


def taro_readiness(t):
    """지표별 사용 가능 여부. 부족한 것은 점수에서 빼고 이유를 남긴다."""
    days = t.get("bars") or t.get("dailyCount")
    return {
        # ma20Full/ma60Full은 compute_indicators가 이미 계산해 준다.
        "ma20": bool(t.get("ma20Full")) and t.get("ma20Gap") is not None,
        "ma60": bool(t.get("ma60Full")) and t.get("ma60Gap") is not None,
        "rsi14": t.get("rsi14") is not None and t.get("rsi14Ready", True),
        "macd": (t.get("macd") is not None and t.get("macdSignal") is not None
                 and (days is None or days >= TARO_MIN_MACD_DAYS)),
    }


def taro_eval(t):
    s = 50.0
    ready = taro_readiness(t)
    g20, g60 = t.get("ma20Gap"), t.get("ma60Gap")
    # ⚠️ 기간을 못 채운 부분 이동평균(ma20Full/ma60Full == False)은 정식 MA로 쓰지 않는다.
    #    54일치 평균을 MA60처럼 취급하면 신규상장주가 가짜로 강한 점수를 얻는다.
    if ready["ma20"]:
        s += _gap_score(g20, 1.1, 14, plateau_end=25, decay=1.0)
    if ready["ma60"]:
        s += _gap_score(g60, 0.7, 10, plateau_end=20, decay=1.0)
    rsi = t.get("rsi14")
    if ready["rsi14"]:
        if rsi >= 70:   s += 3      # 과매수(강하나 과열 주의)
        elif rsi >= 55: s += 9
        elif rsi >= 45: s += 2
        elif rsi >= 30: s -= 4
        else:           s -= 1      # 과매도(반등 여지)
    macd, sig = t.get("macd"), t.get("macdSignal")
    golden = ready["macd"] and macd >= sig
    # ⚠️ 워밍업이 모자란 MACD를 '데드크로스'로 단정하지 않는다.
    #    예전에는 값이 없어도 무조건 -8점을 줬다(없음 = 악재로 취급).
    if ready["macd"]:
        s += 9 if golden else -8
    # ⭐ 2026-08-07: 이동평균 골든/데드크로스(5·20일선, 20·60일선)도 점수에 반영한다.
    # compute_indicators.py가 계산한 cross5_20/cross20_60을 그대로 쓴다(중복 계산 없음).
    # 막 일어난 교차일수록 크게, CROSS_LOOKBACK(20거래일)에 가까워질수록 약하게(decay) 반영해
    # "한 달 전 교차"가 오늘 점수를 계속 흔드는 걸 막는다. 아직 안 뚫렸지만 좁혀지는 중인
    # "임박" 신호는 확정 신호의 절반 무게만 준다. 20·60일선(더 긴 추세)이 5·20일선보다
    # 더 드물게 일어나는 만큼 가중치도 더 크게 둔다(6 vs 3).
    def cross_adj(c, base):
        if not c:
            return 0.0
        if c.get("event"):
            decay = max(0.0, 1 - (c.get("daysAgo") or 0) / 20)
            return (base if c["event"] == "golden" else -base) * decay
        if c.get("near"):
            return (base * 0.4) if c["near"] == "golden" else -(base * 0.4)
        return 0.0
    s += cross_adj(t.get("cross5_20"), 3)
    s += cross_adj(t.get("cross20_60"), 6)
    vr = t.get("volRatio")
    # ⭐ 2026-08-13 사용자 지정 — "급등 후 당일반납" 캔들 감지(금호건설 8/13: 장중 고가
    # 18,040원 → 종가 14,290원, -20.8% 반납했는데 종가 기준 지표만으로는 안 잡혔다).
    # compute_indicators.py가 계산한 todayGiveback(오늘 고가 대비 종가 하락폭%)을 그대로 쓴다.
    # 500종목 실측 중앙값 2.5%·p90 5.8%·p99 11.7% — 6%부터 서서히 감점(최대 -15),
    # 10%(p99 근처) 이상일 때만 findings에 별도로 경고한다(잔물결까지 매번 경고하지 않게).
    gb = t.get("todayGiveback")
    if gb is not None and gb > 6:
        s -= min(15, (gb - 6) * 1.0)
    score = clamp(s)
    close, ma20, ma60 = t.get("close"), t.get("ma20"), t.get("ma60")
    f = []
    if ma20 is not None and g20 is not None:
        f.append(f"종가 {won(close)}이 MA20({won(ma20)}) 대비 {g20:+.1f}% — 단기 {'상단' if g20 >= 0 else '하단'} 흐름")
    if ma60 is not None and g60 is not None:
        f.append(f"MA60({won(ma60)}) 대비 {g60:+.1f}% — 장기 추세선 {'상회' if g60 >= 0 else '하회'}")
    if rsi is not None:
        zone = "과매수" if rsi >= 70 else ("상승 모멘텀" if rsi >= 55 else ("중립" if rsi >= 45 else ("약세" if rsi >= 30 else "과매도")))
        f.append(f"RSI(14) {rsi:.0f} {zone}권 · MACD가 시그널을 {'상회(골든크로스)' if golden else '하회(데드크로스)'}")
    giveback_alert = gb is not None and gb >= 10
    if giveback_alert and vr is not None:
        f.append(f"오늘 장중 고가 대비 종가가 {gb:.1f}% 밀려 급등분을 크게 반납(거래량 {vr:.2f}배) — 되돌림 캔들 경계")
    elif giveback_alert:
        f.append(f"오늘 장중 고가 대비 종가가 {gb:.1f}% 밀려 급등분을 크게 반납 — 되돌림 캔들 경계")
    elif vr is not None:
        vzone = "활발" if vr >= 1.3 else ("보통" if vr >= 0.7 else "한산")
        f.append(f"거래량은 20일 평균의 {vr:.2f}배 — 거래 강도 {vzone}")
    not_ready = [k for k, v in ready.items() if not v]
    if not_ready:
        names = {"ma20": "20일선", "ma60": "60일선", "rsi14": "RSI", "macd": "MACD"}
        f.append("상장 기간이 짧아 " + "·".join(names[k] for k in not_ready)
                 + " 신호는 아직 점수에 넣지 않았습니다")
    while len(f) < 4:
        f.append("추가 지표는 다음 수집에서 보강됩니다")
    return {"score": score, "stance": stance_of(score), "findings": f[:4],
            "ready": ready, "notReady": not_ready,
            "usedSignals": sorted(k for k, v in ready.items() if v)}


# ── DIANA(재무): PER/PBR/ROE + 선행PER + 컨센 목표주가 ───────────────────────
def diana_eval(e):
    s = 50.0
    per, pbr, roe = e.get("per"), e.get("pbr"), e.get("roe")
    fwd, tgap = e.get("fwdPer"), e.get("targetGap")
    if per is not None:
        if per <= 0:    s -= 6            # 적자
        elif per < 10:  s += 12
        elif per < 15:  s += 6
        elif per < 25:  s += 0
        elif per < 40:  s -= 6
        else:           s -= 10
    if pbr is not None:
        if pbr < 1:     s += 8
        elif pbr < 2:   s += 4
        elif pbr < 5:   s += 0
        else:           s -= 6
    if roe is not None:
        if roe >= 15:   s += 8
        elif roe >= 8:  s += 3
        elif roe >= 0:  s += 0
        else:           s -= 6
    if fwd is not None and fwd > 0:
        s += 6 if fwd < 12 else (0 if fwd < 25 else -5)
    if tgap is not None:
        # ⭐ 2026-08-13 사용자 지정 — 목표가 괴리(tgap) 하한이 -6점에서 그냥 잘려서, 컨센서스
        # 대비 -24%든 -95%든 감점이 똑같았다(금호건설 -60.4%도 -6점에 그쳐, PER·PBR·ROE
        # 보너스(+20점)에 쉽게 묻혔다). 500종목 실측 기준 음수 tgap 자체가 극히 드물어서
        # (356종목 중 5개, 대부분 +24%~+98%인 정상 분포) -24% 밑으로는 계속 깎이게 확장해도
        # 정상 종목엔 영향이 없고 진짜 극단적 고평가만 걸러진다.
        if tgap >= -24:
            s += max(-6, min(12, tgap * 0.25))
        else:
            excess = -24 - tgap
            s += max(-16, -6 - excess * 0.25)
    score = clamp(s)
    val_read = "이익·자산 대비 저평가 매력" if score >= 58 else ("밸류 부담 존재" if score <= 43 else "밸류 중립 수준")
    f = []
    if per is not None and pbr is not None:
        f.append(f"PER {per}배 · PBR {pbr}배 — {val_read}")
    if roe is not None or e.get("eps") is not None:
        f.append(f"ROE {roe if roe is not None else '—'}% · EPS {won(e.get('eps')) if e.get('eps') else '—'}")
    if fwd is not None and fwd > 0:
        f.append(f"컨센서스 EPS 기준 선행 PER {fwd}배 — {'실적 반영 시 저평가' if fwd < 15 else '실적 성장 확인 필요'}")
    elif e.get("cnsEps"):
        f.append("컨센서스 추정 EPS 반영 시 밸류 재계산 필요")
    else:
        f.append("증권사 컨센서스 커버리지 부재 — 선행 지표 산출 제한")
    if tgap is not None:
        # ⭐ 2026-08-05: "증권사 평균 목표주가 X원 · 현재가 대비 +Y% 여력" 풀 문장은
        # 목표가 자릿수가 클 때(백만원대) 모바일 카드 폭에서 두 줄로 넘어가 화면이 답답해진다는
        # 신고가 있었다. "증권사 평균"·"여력"을 빼고 화살표로 이어 항상 한 줄에 들어오게 압축했다
        # (Playwright로 100만원대·세 자리 %까지 실측 검증).
        # ⭐ 2026-08-13 사용자 지정 — 금호건설 사례: 네이버 컨센서스(priceTargetMean)가
        # 실제 최신 증권사 리포트(7월21~22일, 12,000원대)를 반영 못 하고 오래된 낮은 추정치까지
        # 평균에 섞여 5,650원으로 남아있었다. 커버리지가 얇은 종목일수록 네이버 집계 갱신이
        # 늦어 이런 괴리가 생긴다 — 숫자를 지어내거나 숨기지 않고 그대로 보여주되, 괴리가
        # 극단적(-40% 이하)이면서 최근 5일 급등(+20% 이상)까지 겹치면 "이 수치는 급등 반영 전
        # 오래된 값일 수 있다"는 캐비어트를 붙여 그대로 믿지 않도록 한다.
        ret5 = (e.get("flow") or {}).get("priceRet5")
        stale_suspect = tgap <= -40 and ret5 is not None and ret5 >= 20
        tail = " (⚠️ 최근 급등 반영 전 오래된 수치일 수 있어 참고용)" if stale_suspect else ""
        f.append(f"목표주가 {won(e.get('targetMean'))} → 현재가 대비 {tgap:+.1f}%{tail}")
    else:
        f.append(f"52주 밴드 {e.get('w52') or '—'} 참고 · 목표주가 컨센 미제공")
    while len(f) < 4:
        f.append("재무 지표는 다음 수집에서 보강됩니다")
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


# ── FLOW(수급): 외국인·기관 순매매 + 보유율 추이 ────────────────────────────
def flow_eval(fl):
    if not fl:
        # ⚠️ 예전에는 50점을 돌려주고 "채점에서 제외"라고 적었지만, CHIEF가 그 50점을
        #    실제로 가중합에 넣고 있었다. 진짜 제외가 아니었다.
        #    이제 available=False를 명시하고 CHIEF가 가중치를 재정규화한다.
        return {"score": None, "available": False, "stance": "neu",
                "findings": ["수급(외국인·기관 순매매) 데이터가 아직 수집되지 않았습니다",
                             "다음 자동 수집에서 dealTrends가 채워지면 반영됩니다",
                             "현재는 중립으로 처리 — 채점에서 제외", "—"]}
    s = 50.0
    fr, org, indi = fl.get("frgnSum", 0), fl.get("orgSum", 0), fl.get("indiSum")
    hn, hb = fl.get("holdNow"), fl.get("holdBefore")
    s += max(-16, min(16, (1 if fr > 0 else -1) * min(16, abs(fr) / 50000)))
    s += max(-10, min(10, (1 if org > 0 else -1) * min(10, abs(org) / 50000)))
    if hn is not None and hb is not None:
        s += max(-6, min(6, (hn - hb) * 3))
    quality = fl.get("qualityScore")
    score = clamp(s)
    available = True
    n = fl.get("days", 0)
    f = [
        f"최근 {n}거래일 외국인 {'순매수' if fr >= 0 else '순매도'} {abs(fr):,}주 · 기관 {'순매수' if org >= 0 else '순매도'} {abs(org):,}주"
        + (f" · 개인 {'순매수' if indi >= 0 else '순매도'} {abs(indi):,}주" if indi is not None else ""),
    ]
    if hn is not None and hb is not None:
        f.append(f"외국인 보유율 {hb:.2f}% → {hn:.2f}% ({'상승' if hn >= hb else '하락'})")
    tf, to, ti = fl.get("todayFrgn", 0), fl.get("todayOrg", 0), fl.get("todayIndi", 0)
    f.append(f"직전 거래일 외국인 {tf:+,}주 · 기관 {to:+,}주 · 개인 {ti:+,}주")
    combo = (fr > 0) + (org > 0)
    combo_text = "외국인·기관 동반 매수 우위" if combo == 2 else ("외국인·기관 매수/매도 엇갈림" if combo == 1 else "외국인·기관 동반 매도 우위")
    if quality is not None:
        labels = {"accumulation": "가격은 약하지만 큰손 매수는 이어지는 매집형 괴리",
                  "distribution": "가격은 오르지만 큰손은 파는 분배형 괴리",
                  "confirmation_up": "가격 상승과 큰손 매수가 함께 가는 상승 확인",
                  "confirmation_down": "가격 하락과 큰손 매도가 함께 가는 하락 확인"}
        combo_text += f" · 수급 품질 {quality:+.0f}점 · {labels.get(fl.get('divergence'), '가격·수급 방향 중립')}"
    f.append(combo_text)
    return {"score": score, "available": available,
            "stance": stance_of(score), "findings": f[:4]}


# ── QUANT(확률·통계, 내부 id는 호환성 위해 'nova' 유지): 경험적 승률 ─────────
#    "지금 이 종목과 비슷한 상태(RSI 구간 × 20일선 위/아래 × 최근 5일 추세)였던
#     과거 사례들이 5거래일 뒤 실제로 올랐는가"를 추적 전 종목 누적 일봉에서 세어,
#     실측 승률을 점수로 쓴다. 모형·감정 추정이 아니라 관찰된 빈도라서 정직하다.

def _rsi_zone(rsi):
    if rsi < 30: return 0, "과매도"
    if rsi < 45: return 1, "약세"
    if rsi < 55: return 2, "중립"
    if rsi < 70: return 3, "강세"
    return 4, "과열"


def _trend5_zone(pct):
    if pct < -2: return 0, "하락"
    if pct > 2:  return 1, "상승"
    return 2, "횡보"


def build_quant_stats(analysis_data, sectors=None):
    """전 종목 일봉에서 (상태 버킷 → 5거래일 뒤 상승 확률) 통계표 생성.
    반환: {key: {"n":표본수, "w":상승횟수, "sum":수익률합}}  (넓은 키일수록 표본이 큼)
    키 계층: z{rsi}m{ma}t{tr} → z{rsi}m{ma} → z{rsi} → "all"  (표본 부족 시 상위로 폴백)
    "_period"는 버킷이 아니라 {"start":최초 표본일, "end":최종 표본일} 메타데이터다
    (⭐ 2026-08-08: "표본이 몇 년치인지 안 보인다"는 피드백 → 화면에 실제 데이터 기간을
    동적으로 보여주기 위해 추가. 승률·점수 계산 로직 자체는 전혀 안 건드린다).
    "_sectorBase"는 업종별 {"n","w"} — RSI·이평·추세 상태와 무관하게 그 업종 자체가
    5거래일 뒤 오를 기본 확률이다(⭐ 2026-08-14: 업종별 기저율이 42.7%~52.7%로
    10%p 가까이 벌어지는데, QUANT는 이 차이를 전혀 감안하지 않고 전체 시장 평균
    하나로만 비교해서, 원래 상승률이 낮은 업종(게임·엔터 등)의 종목은 기술적 상태와
    무관하게 늘 "부진"으로, 원래 높은 업종(건설·건자재 등)은 늘 "양호"로 나오는
    편향이 있었다. quant_eval()이 이 값을 업종 표본 크기에 따라 전역값과 섞어
    기저율로 쓴다)."""
    stats = {}
    period = {"start": None, "end": None}
    sector_base = {}

    def bump(key, win, ret):
        b = stats.setdefault(key, {"n": 0, "w": 0, "sum": 0.0})
        b["n"] += 1; b["w"] += win; b["sum"] += ret

    def bump_sector(code, win):
        if not sectors:
            return
        sec = sectors.get(code) or "기타"
        b = sector_base.setdefault(sec, {"n": 0, "w": 0})
        b["n"] += 1; b["w"] += win

    for code, s in (analysis_data.get("stocks") or {}).items():
        d = s.get("daily")
        if not isinstance(d, list) or len(d) < 26:
            continue
        rows = sorted((r for r in d if r.get("date") and isinstance(r.get("close"), (int, float))),
                      key=lambda r: r["date"])
        closes = [r["close"] for r in rows]
        n = len(closes)
        # 워밍업 20일(RSI/MA20) 확보 + 결과 확인용 5일 남기기
        for i in range(20, n - 5):
            # ⚠️ Live와 같은 식을 써야 한다. 예전에는 여기서 RSI를 '최근 14변화의
            #    단순 평균'으로 계산했는데, 실시간 지표는 Wilder 평활이었다.
            #    같은 날짜인데 값이 달라 QUANT가 엉뚱한 과거 사례와 매칭됐다.
            #    5일 수익률도 Live는 4거래일 간격이라 정의가 어긋나 있었다.
            #    indicator_math.state_at()이 두 경로를 하나로 묶는다.
            st = indicator_math.state_at(closes, i)
            rsi, tr5, ma20 = st["rsi14"], st["ret5"], st["ma20"]
            if rsi is None or tr5 is None or ma20 is None:
                continue
            z, _ = _rsi_zone(rsi)
            m = 1 if closes[i] >= ma20 else 0
            t, _ = _trend5_zone(tr5)
            if not closes[i]:
                continue
            ret = (closes[i + 5] - closes[i]) / closes[i] * 100
            win = 1 if ret > 0 else 0
            bump(f"z{z}m{m}t{t}", win, ret)
            bump(f"z{z}m{m}", win, ret)
            bump(f"z{z}", win, ret)
            bump("all", win, ret)
            bump_sector(code, win)
            date_i = rows[i]["date"]
            if period["start"] is None or date_i < period["start"]:
                period["start"] = date_i
            if period["end"] is None or date_i > period["end"]:
                period["end"] = date_i
    stats["_period"] = period
    stats["_sectorBase"] = sector_base
    return stats


# ── 골든/데드크로스 사후 통계 (2026-08-07 사용자 요청) ────────────────────────
#    "데드크로스 나면 진짜 얼마나 떨어져요?"에 감이 아니라 숫자로 답하기 위해,
#    추적 전 종목 누적 일봉에서 과거에 실제로 있었던 골든/데드크로스(5·20일선,
#    20·60일선 두 쌍) 전부를 찾아 그 CROSS_STAT_HORIZON거래일 뒤 실제 등락률을
#    센다. 종목 하나·사례 하나가 아니라 수백 건을 모은 평균이라 훨씬 믿을 만하다.
CROSS_STAT_HORIZON = 20   # 교차 이후 며칠 뒤 결과를 볼지(거래일 기준, TARO MA 해석과 동일 규격)


def build_cross_stats(analysis_data):
    """반환: {"5_20_golden":{...}, "5_20_dead":{...}, "20_60_golden":{...}, "20_60_dead":{...}}
    각 값은 {"n":표본수, "w":상승횟수(그 시점보다 CROSS_STAT_HORIZON일 뒤 종가가 높았던 횟수), "sum":수익률합}."""
    H = CROSS_STAT_HORIZON
    stats = {"5_20_golden": {"n": 0, "w": 0, "sum": 0.0}, "5_20_dead": {"n": 0, "w": 0, "sum": 0.0},
             "20_60_golden": {"n": 0, "w": 0, "sum": 0.0}, "20_60_dead": {"n": 0, "w": 0, "sum": 0.0}}

    def bump(key, ret):
        b = stats[key]
        b["n"] += 1; b["w"] += 1 if ret > 0 else 0; b["sum"] += ret

    def sma(vals, p, i):
        return sum(vals[i + 1 - p:i + 1]) / p if i + 1 >= p else None

    for s in (analysis_data.get("stocks") or {}).values():
        d = s.get("daily")
        if not isinstance(d, list) or len(d) < 65:   # 20·60일선 계산에 필요한 최소치
            continue
        rows = sorted((r for r in d if r.get("date") and isinstance(r.get("close"), (int, float))),
                      key=lambda r: r["date"])
        closes = [r["close"] for r in rows]
        n = len(closes)
        ma5 = [sma(closes, 5, i) for i in range(n)]
        ma20 = [sma(closes, 20, i) for i in range(n)]
        ma60 = [sma(closes, 60, i) for i in range(n)]
        for i in range(1, n - H):   # i+H가 배열 범위 안이어야 결과를 볼 수 있다
            if not closes[i]:
                continue
            ret = (closes[i + H] - closes[i]) / closes[i] * 100
            if ma5[i] is not None and ma20[i] is not None and ma5[i - 1] is not None and ma20[i - 1] is not None:
                prev, cur = ma5[i - 1] - ma20[i - 1], ma5[i] - ma20[i]
                if prev <= 0 < cur:
                    bump("5_20_golden", ret)
                elif prev >= 0 > cur:
                    bump("5_20_dead", ret)
            if ma20[i] is not None and ma60[i] is not None and ma20[i - 1] is not None and ma60[i - 1] is not None:
                prev, cur = ma20[i - 1] - ma60[i - 1], ma20[i] - ma60[i]
                if prev <= 0 < cur:
                    bump("20_60_golden", ret)
                elif prev >= 0 > cur:
                    bump("20_60_dead", ret)
    return stats


QUANT_SECTOR_MIN_N = 200     # 업종 표본이 이보다 적으면 업종값을 아예 안 쓰고 전역값만 쓴다
QUANT_SECTOR_SHRINK_N = 800  # 이 표본수만큼 쌓이면 업종값 쪽으로 절반 정도 기운다(작을수록 업종값을 빨리 신뢰)
QUANT_SECTOR_BLEND_CAP = 0.75  # 업종 표본이 아무리 많아도 전역값 비중을 최소 25%는 남긴다


def quant_eval(e, t, qstats, sector=None):
    rsi = t.get("rsi14")
    g20 = t.get("ma20Gap")
    # ⚠️ last5(종가 5개 = 4거래일 간격)로 다시 계산하지 않는다.
    #    과거 통계는 5거래일 간격이라 정의가 달라진다.
    #    compute_indicators가 만든 ret5(5거래일 간격) 필드를 그대로 쓴다.
    tr5 = t.get("ret5")
    if tr5 is None:
        last5 = t.get("last5") or []
        if len(last5) >= 2 and last5[0].get("c"):
            # 구버전 indicators.json 호환. 간격이 달라 정확도가 떨어지므로 표시로 남긴다.
            tr5 = (last5[-1]["c"] - last5[0]["c"]) / last5[0]["c"] * 100
    if rsi is None or g20 is None or tr5 is None or not qstats:
        return {"score": None, "available": False, "stance": "neu", "findings": [
            "📊 QUANT — 과거 통계 조회에 필요한 지표가 아직 부족합니다",
            "다음 자동 수집에서 RSI·이동평균·최근 추세가 채워지면 승률이 계산됩니다",
            "현재는 중립(50점)으로 처리 — 채점에서 제외", "—"],
            "sampleN": None, "sampleWin": None, "winRate": None, "marketAvgWinRate": None,
            "sector": sector, "sectorWinRate": None, "sectorBlendPct": None, "baseWinRate": None,
            "relPp": None, "avgReturn": None, "scopeUsed": None, "periodStart": None, "periodEnd": None}
    z, zname = _rsi_zone(rsi)
    m = 1 if g20 >= 0 else 0
    tz, tname = _trend5_zone(tr5)
    # 표본 30건 이상인 가장 구체적 버킷 선택(부족하면 넓은 버킷으로 폴백)
    tried = [f"z{z}m{m}t{tz}", f"z{z}m{m}", f"z{z}", "all"]
    scope = ["동일 상태", "RSI·이평 동일", "RSI 구간 동일", "시장 전체"]
    b, used = None, ""
    for key, sc in zip(tried, scope):
        cand = qstats.get(key)
        if cand and cand["n"] >= 30:
            b, used = cand, sc
            break
    if b is None:
        b, used = qstats.get("all", {"n": 0, "w": 0, "sum": 0.0}), "시장 전체"
    if not b["n"]:
        return {"score": None, "available": False, "stance": "neu", "findings": [
            "📊 QUANT — 아직 통계 표본이 없습니다", "데이터가 쌓이면 승률이 계산됩니다",
            "현재는 중립(50점) 처리", "—"],
            "sampleN": None, "sampleWin": None, "winRate": None, "marketAvgWinRate": None,
            "sector": sector, "sectorWinRate": None, "sectorBlendPct": None, "baseWinRate": None,
            "relPp": None, "avgReturn": None, "scopeUsed": None, "periodStart": None, "periodEnd": None}
    wr = b["w"] / b["n"] * 100
    avg = b["sum"] / b["n"]
    # ── 상대 승률로 재중심화 (2026-07-22 수정) ────────────────────────────────
    # 예전엔 score=clamp(wr,20,80)로 '절대 승률'을 그대로 점수화했다. 그런데 누적
    # 일봉 표본의 기저 승률이 ~35%(하락 구간이 많이 쌓임)라, 어떤 종목도 43점을 넘지
    # 못하고 QUANT가 25% 지분으로 종합점수를 한 방향(아래)으로만 끌어내리는 '죽은 닻'이
    # 됐다 — 시장이 +3% 급등한 날에도 BUY가 500종목 중 2개뿐이던 사고의 주원인.
    # 그래서 '시장 평균 대비 얼마나 나은 상태인가'로 바꾼다: 기저 승률=50점(중립),
    # 그보다 높으면 강세·낮으면 약세. 표시용 승률 %는 그대로 두되 점수만 재중심화한다.
    allb = qstats.get("all") or {}
    market_wr = (allb["w"] / allb["n"] * 100) if allb.get("n") else 50.0
    # ⭐ 2026-08-14: '기저 승률'을 시장 전체 하나로만 쓰면, 업종 자체가 원래 잘
    # 오르는지(예: 건설·건자재 52.7%)·안 오르는지(예: 게임·엔터 42.7%)를 무시하게 되어
    # 기술적 상태와 무관하게 특정 업종 종목은 늘 부진, 다른 업종은 늘 양호로 나오는
    # 편향이 생겼다(직접 대조 확인함). team_weights.js가 업종별 가중치를 전역값과
    # 섞어 쓰는 것과 같은 방식(표본 200건 미만이면 업종값 자체를 안 믿고 전역값만
    # 쓰고, 표본이 많아질수록 업종값 비중을 최대 75%까지 서서히 높임)으로,
    # '시장 평균'을 '업종을 반영한 기저 승률'로 바꾼다.
    sector_bucket = (qstats.get("_sectorBase") or {}).get(sector or "") or {}
    sector_n = sector_bucket.get("n", 0)
    sector_wr = (sector_bucket["w"] / sector_n * 100) if sector_n else None
    if sector_wr is not None and sector_n >= QUANT_SECTOR_MIN_N:
        blend = min(QUANT_SECTOR_BLEND_CAP, sector_n / (sector_n + QUANT_SECTOR_SHRINK_N))
    else:
        blend = 0.0
    base_wr = market_wr * (1 - blend) + (sector_wr if sector_wr is not None else market_wr) * blend
    rel = wr - base_wr
    score = clamp(round(50 + rel * 1.8), 20, 80)   # k=1.8: 기저 대비 ±편차를 점수로
    relword = "높아 상대적 양호" if rel >= 1 else ("낮아 상대적 부진" if rel <= -1 else "비슷한 중립 수준")
    base_desc = (f"{sector} 업종을 {round(blend*100)}% 반영한 기저 승률 {base_wr:.0f}%"
                 if blend > 0 else f"시장 평균 {base_wr:.0f}%")
    f = [
        "📊 QUANT — 지금과 비슷한 상태였던 과거 사례의 실제 결과(추적 600종목 누적 일봉)로 승률을 계산합니다",
        f"현재 상태: RSI {rsi:.0f}({zname}) · 20일선 {'위' if m else '아래'} · 최근 5일 {tname}({tr5:+.1f}%)",
        f"과거에 이런 상태({used})였던 적이 {b['n']}건 있었는데, 그중 {b['w']}건이 5거래일 뒤 올랐어요 → 경험적 승률 {wr:.0f}% ({base_desc}보다 {rel:+.0f}%p {relword})",
        f"그 {b['n']}건의 5거래일 뒤 등락률 평균은 {avg:+.1f}%예요(오른 경우·내린 경우 전부 포함 — 승률과는 다른 숫자) · 과거 통계일 뿐 미래를 보장하진 않아요",
    ]
    # ⭐ 2026-08-08: findings 문장 속에 숫자를 파묻지 않고, 화면(index.html)이 카드로 재조립할 수
    # 있도록 같은 숫자를 구조화된 필드로도 함께 내려준다. 문장(findings)·점수(score)는 그대로다.
    period = qstats.get("_period") or {}
    return {"score": score, "available": True, "stance": stance_of(score), "findings": f[:4],
            "sampleN": b["n"], "sampleWin": b["w"], "winRate": round(wr, 1),
            "marketAvgWinRate": round(market_wr, 1),
            "sector": sector, "sectorWinRate": round(sector_wr, 1) if sector_wr is not None else None,
            "sectorBlendPct": round(blend * 100), "baseWinRate": round(base_wr, 1),
            "relPp": round(rel, 1), "avgReturn": round(avg, 2),
            "scopeUsed": used, "periodStart": period.get("start"), "periodEnd": period.get("end")}


# ── CHIEF(종합): 자가 학습 가중치(team_weights.js) 기반 합산 ─────────────────
#    compute_team_weights.py가 "판단 후 5거래일 뒤 종가" 채점 기록으로 계산한
#    분석가별 적중률 비례 가중치를 쓴다. 파일이 없으면 균등(25%씩)으로 동작.

BASE_W = {"taro": 0.30, "diana": 0.12, "nova": 0.28, "flow": 0.30}
BUY_CUT_BASE = 63     # chief_eval의 기본 BUY 경계 — Evolution override가 없으면 항상 이 값


def _evolution_overrides():
    """검증·승인된 Evolution Production override(gaeo_evolution/production_config.json).

    ⭐ 2026-08-22 2차 감사 수리 — 승인된 Candidate가 실제 판단에 적용되는 유일한 다리.
    · override가 없으면 빈 dict → 기존 GAEO와 100% 동일하게 동작한다.
      (gaeo_evolution/을 통째로 지워도 이 함수는 빈 dict를 돌려주고 분석은 그대로 돈다.)
    · 읽기·검증 실패 시에도 빈 dict(기존 동작 유지) — 이 파일 때문에 분석이 죽지 않는다.
    · 선언적 파라미터(weights/buyCut)만 읽는다. 어떤 문자열도 실행하지 않는다.
    """
    try:
        from gaeo_evolution import production_config
        return production_config.active_overrides() or {}
    except Exception:
        return {}


def _buy_cut():
    """BUY 경계 — 승인된 override가 있으면 그 값, 없으면 기존 63 그대로."""
    cut = _evolution_overrides().get("buyCut")
    return float(cut) if cut is not None else float(BUY_CUT_BASE)


def load_team_weights():
    tw = load_js_object(os.path.join(HERE, "team_weights.js"), "TEAM_WEIGHTS")
    ov = _evolution_overrides()
    if ov.get("weights"):
        # 승인된 후보 가중치는 Shadow에서 '전 종목 공통'으로 검증된 값이므로
        # 업종별 오버라이드 없이 전역으로 적용한다(시험한 그대로 반영).
        return {"global": dict(ov["weights"]), "sectors": {}, "learned": True,
                "evolutionOverride": ov.get("productionConfigVersion")}
    if not tw or not isinstance(tw.get("global"), dict):
        return {"global": BASE_W, "sectors": {}, "learned": False}
    return {"global": tw["global"].get("weights", BASE_W),
            "sectors": {k: v.get("weights", {}) for k, v in (tw.get("sectors") or {}).items()},
            "learned": True}


def load_model_intelligence():
    model = load_js_object(os.path.join(HERE, "model_intelligence.js"), "MODEL_INTELLIGENCE")
    return model if isinstance(model, dict) else {}


def _score_bin(score):
    return str(min(90, max(0, int(float(50 if score is None else score)) // 10 * 10)))


def _calibrated_probability(model, analyst, score):
    bucket = (((model.get("calibration") or {}).get(analyst) or {}).get(_score_bin(score)) or {})
    if bucket.get("n", 0) < 20:
        return max(.05, min(.95, .5 + (float(50 if score is None else score) - 50) / 250))
    return max(.05, min(.95, float(bucket.get("pUp", .5))))


def _confidence_bin(total):
    value = int(clamp(float(50 if total is None else total), 0, 100))
    return str(value // 5 * 5)


def _confidence_candidate(confidence_model, call, total):
    """compute_model_intelligence.py의 confidence_calibration_from 결과(판단 종류·점수
    구간별 실측 적중률)로 신뢰도 후보값을 찾는다. 표본 부족이면 None(호출부가 기존
    의견 일치도 공식으로 폴백)."""
    if call not in ("BUY", "SELL"):
        return None
    calibration = (confidence_model or {}).get("calibration") or {}
    bucket = (calibration.get(call) or {}).get(_confidence_bin(total)) or {}
    if bucket.get("n", 0) < 15:
        return None
    acc = bucket.get("calibratedAcc")
    if acc is None:
        return None
    return int(clamp(round(25 + acc * 65), 25, 90))


def candidate_chief_eval(e, taro, diana, nova, flow, weights, model):
    """🗄️ ARCHIVED_FAILED_EXPERIMENT — 구형 그림자모델(calibrated-ensemble-v3).

    ⚠️ 2026-08-15 퇴출. main 경로에서 더 이상 호출하지 않는다.
       실측에서 SELL이 전체의 41%로 치우쳤고, 상승장 SELL 적중률이 9.4%까지
       떨어졌다(하락장 85.9%). 승격 기준을 통과한 적이 없다.
       함수 자체는 과거 기록 재현·감사를 위해 남겨 두지만 신규 예측은 만들지 않는다.
    """
    """v3 그림자 후보. 승격 기준을 통과하기 전에는 화면 판단을 바꾸지 않는다."""
    regime = (e.get("marketRegime") or {}).get("key") or (model.get("currentRegime") or {}).get("key")
    regime_weights = (((model.get("regimes") or {}).get(regime) or {}).get("weights") or weights)
    redundancy = model.get("redundancyFactor") or {}
    scores = {"taro": taro["score"], "diana": diana["score"], "nova": nova["score"], "flow": flow["score"]}
    adjusted = {a: float(regime_weights.get(a, BASE_W[a])) * float(redundancy.get(a, 1)) for a in scores}
    total_weight = sum(adjusted.values()) or 1
    probability = sum(_calibrated_probability(model, a, scores[a]) * adjusted[a] for a in scores) / total_weight
    relative = e.get("relative") or {}
    relative_adjust = max(-.04, min(.04, (float(relative.get("vsSector") or 0) * .003 +
                                         float(relative.get("vsMarket") or 0) * .002)))
    flow_quality = float((e.get("flow") or {}).get("qualityScore") or 0)
    flow_adjust = max(-.03, min(.03, flow_quality * .0006))
    probability = max(.05, min(.95, probability + relative_adjust + flow_adjust))
    raw_total = round(probability * 100)
    risk = risk_overlay(e.get("risk"))
    total = clamp(raw_total - risk["penalty"])
    buy_cut = float((model.get("holdPolicy") or {}).get("buyProbability", .62)) * 100
    sell_cut = float((model.get("holdPolicy") or {}).get("sellProbability", .38)) * 100
    call = "BUY" if total >= buy_cut else ("SELL" if total <= sell_cut else "HOLD")
    spread = max(scores.values()) - min(scores.values())
    confidence = clamp(round(35 + abs(probability - .5) * 120 - spread * .25 - risk["confidencePenalty"]), 25, 90)
    status = (model.get("promotion") or {}).get("status", "shadow")
    status_text = ("승격 기준을 통과해 실전 판정에 적용됩니다." if status == "qualified" else
                   "그림자 평가 중이며 승격 기준 통과 전에는 기존 판단을 바꾸지 않습니다.")
    reason = (f"확률교정 v3 후보는 5일 상승확률을 {probability*100:.1f}%로 계산했습니다. "
              f"시장·업종 상대강도 {relative_adjust*100:+.1f}%p, 수급 품질 {flow_adjust*100:+.1f}%p, "
              f"RISK {risk['penalty']}점 감점을 반영했습니다. "
              f"{status_text}")
    return {"call": call, "total": total, "rawTotal": raw_total, "confidence": confidence,
            "probabilityUp": round(probability * 100, 1), "riskPenalty": risk["penalty"],
            "riskScore": risk["score"], "riskGrade": risk["grade"], "riskApplied": True,
            "relativeAdjustPp": round(relative_adjust * 100, 1),
            "flowQualityAdjustPp": round(flow_adjust * 100, 1), "regime": regime,
            "modelVersion": model.get("version", "calibrated-ensemble-v3"), "reason": reason,
            "target": ("확률교정 v3 실전 모델" if status == "qualified" else
                       "확률교정 후보 모델 · 그림자 평가 중"), "report": reason}


def risk_overlay(risk):
    """RISK는 상승표가 아니라 손실 확대 가능성만 낮추는 단방향 안전장치다."""
    if not isinstance(risk, dict):
        return {"score": None, "grade": "unknown", "penalty": 0, "confidencePenalty": 0}
    vol = float(risk.get("vol20") or 0)
    drawdown = float(risk.get("mdd3m") or 0)
    score = clamp(round(100 - vol * 10 - max(0, -drawdown) * 0.6), 5, 95)
    grade = risk.get("grade") if risk.get("grade") in ("low", "mid", "high") else (
        "high" if score < 35 else ("mid" if score < 55 else "low"))
    penalty = clamp(round(max(0, 45 - score) * 0.15) + 1, 1, 7) if grade == "high" else 0
    # ⭐ 2026-08-10: vol20(변동성)은 급등이든 급락이든 방향을 안 가리고 똑같이 감점한다.
    # "낙폭과대 후 이미 크게 반등 중"인 종목까지 "출렁이니 위험"으로 묶어 매번 SELL 쪽으로
    # 미는 게 부당하다는 피드백(제주반도체 사례) → 3개월 저점 대비 반등률(reboundFromLow)이
    # 클수록 페널티를 완화한다. "완화"만 한다는 점이 핵심 — 감점을 줄일 뿐 0 밑으로
    # (보너스로) 내려가는 일은 없다. RISK가 상승표를 주지 않는다는 원칙은 그대로 유지된다.
    rebound = float(risk.get("reboundFromLow") or 0)
    if penalty > 0 and rebound > 15:
        damp = min(0.6, (rebound - 15) / 60)   # 반등 15%~75%p 구간에서 감점을 최대 60%까지 완화
        penalty = max(0, round(penalty * (1 - damp)))
    confidence_penalty = 10 if grade == "high" else (3 if grade == "mid" else 0)
    return {"score": score, "grade": grade, "penalty": penalty,
            "confidencePenalty": confidence_penalty}


def rebound_regime_confirmation(e, taro, nova, risk, guard_policy=None):
    """Require stronger SELL evidence during a high-volatility broad rebound."""
    regime = e.get("marketRegime") or {}
    broad_rebound = (
        regime.get("trend") == "up"
        and regime.get("vol") == "high"
        and float(regime.get("medianRet5") or regime.get("median5") or 0) >= 2.0
        and float(regime.get("advanceRatio5") or 0) >= 60.0
        and float(regime.get("medianRet1") or 0) >= 0.5
        and float(regime.get("advanceRatio1") or 0) >= 55.0
    )
    double_bear = taro.get("stance") == "bear" and nova.get("stance") == "bear"
    high_vol = risk.get("grade") == "high" or regime.get("vol") == "high"
    confirmed = bool(high_vol and broad_rebound and double_bear)
    active = bool((guard_policy or {}).get("active")) and confirmed
    sell_threshold = int((guard_policy or {}).get("policy", {}).get("sellThreshold", 40)) if active else 47
    return {
        "active": active, "confirmed": confirmed, "sellThreshold": sell_threshold,
        "reason": ("고변동성인데 시장 전체가 동반 반등해 TARO·QUANT 약세만으로 SELL을 확정하지 않습니다."
                   if active else "반등 레짐 확인 조건에 해당하지 않습니다."),
    }


# Display-only recent surge context. Volatility is not a warning trigger.
# Historical performance is exploratory; see docs/ADVERSARIAL_BUY_AUDIT_20260905.md.
from buy_warning import (overheat_flag, OVERHEAT_RET5_PCT, OVERHEAT_RET20_PCT,
                         OVERHEAT_VOL20_PCT, OVERHEAT_VERSION)


# 사용 가능한 분석축이 이보다 적으면 억지로 판단하지 않는다.
# ⚠️ 데이터 부족은 중립 신호가 아니다. 모르면 모른다고 해야 한다.
MIN_AVAILABLE_ANALYSTS = 2
JUDGMENT_WITHHELD = "JUDGMENT_WITHHELD"


def _available_scores(taro, diana, nova, flow):
    """점수를 실제로 낸 분석가만 골라낸다.

    ⚠️ available이 False이거나 score가 None이면 가중합에 넣지 않는다.
       예전에는 50점을 넣어 '중립 한 표'를 행사하게 했는데, 그건 제외가 아니다.
    """
    out = {}
    for name, a in (("taro", taro), ("diana", diana), ("nova", nova), ("flow", flow)):
        if not isinstance(a, dict):
            continue
        if a.get("available") is False:
            continue
        sc = a.get("score")
        if sc is None:
            continue
        out[name] = sc
    return out


def chief_eval(e, taro, diana, nova, flow, weights=BASE_W, learned=False, guard_policy=None, confidence_model=None):
    w = {k: weights.get(k, BASE_W[k]) for k in ("taro", "diana", "nova", "flow")}
    usable = _available_scores(taro, diana, nova, flow)
    # 사용 가능한 분석가의 가중치만 모아 100%로 다시 정규화한다.
    # 예: QUANT가 없으면 그 지분을 0으로 두는 게 아니라, 남은 셋의 비율을 다시 맞춘다.
    tot_w = sum(w[k] for k in usable) or 0.0
    if len(usable) < MIN_AVAILABLE_ANALYSTS or tot_w <= 0:
        # 분석축이 너무 적다. 가짜 HOLD를 만들지 않고 판단을 보류한다.
        return {"call": JUDGMENT_WITHHELD, "total": None, "confidence": None,
                "available": sorted(usable), "availableCount": len(usable),
                "judgmentWithheld": True,
                "withheldReason": "INSUFFICIENT_ANALYST_COVERAGE",
                "baseModelVersion": BASE_MODEL_VERSION,
                "componentVersions": dict(COMPONENT_VERSIONS),
                "reason": (f"판단에 쓸 수 있는 분석축이 {len(usable)}개뿐이라 "
                           f"이번 회차 판단을 보류합니다. 데이터가 채워지면 다시 계산합니다."),
                "target": "", "report": "데이터 부족으로 판단 보류", "findings": []}
    raw_total = clamp(sum(usable[k] * w[k] for k in usable) / tot_w)
    risk = risk_overlay(e.get("risk"))
    total = clamp(raw_total - risk["penalty"])
    rebound_check = rebound_regime_confirmation(e, taro, nova, risk, guard_policy)
    call = "BUY" if total >= _buy_cut() else ("HOLD" if total >= rebound_check["sellThreshold"] else "SELL")
    scores = list(usable.values())
    spread = max(scores) - min(scores)
    conf = clamp(max(40, 88 - spread) - risk["confidencePenalty"], 30, 90)
    # ⭐ 2026-08-14: 위 conf(의견 일치도 기반)가 BUY 판단에서는 실제 적중률과 거의
    # 무관하다는 게 드러났다. "판단 종류·점수 구간별 실측 적중률" 기반 후보를
    # confidenceShadow로 항상 같이 계산해 기록만 해두고, compute_model_intelligence.py의
    # confidenceModel.promotion.qualified가 검증(학습에 안 쓴 구간)을 통과했을 때만
    # 실제 신뢰도(conf)를 이 후보로 교체한다. reboundGuard·v3와 동일한 원칙 — 화면 값을
    # 검증 전에 먼저 바꾸지 않는다.
    # ⚠️ 2026-08-15: 자동승격 제거. 후보 신뢰도는 기록만 하고 화면 값을 바꾸지 않는다.
    #    프로그램이 스스로 Production을 교체하는 경로는 전부 없앴다.
    #    기준을 충족하면 상태만 PROMOTION_REVIEW_AVAILABLE로 보고하고,
    #    실제 적용은 사람이 승인한 뒤 별도 작업으로 한다.
    conf_candidate = _confidence_candidate(confidence_model, call, total)
    conf_review = bool(((confidence_model or {}).get("promotion") or {}).get("qualified"))
    conf_shadow = conf_candidate if conf_candidate is not None else conf
    conf_model_qualified = False        # 자동 적용 금지
    tgap = e.get("targetGap")
    tgt = (f"증권사 평균 목표주가 {won(e.get('targetMean'))} (현재가 대비 {tgap:+.1f}% 상승여력)"
           if tgap is not None else "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고")
    label = {"BUY": "매수 우위", "HOLD": "중립", "SELL": "비중 축소"}[call]
    wtxt = f"기술 {w['taro']*100:.0f}%·재무 {w['diana']*100:.0f}%·퀀트 {w['nova']*100:.0f}%·수급 {w['flow']*100:.0f}%"
    risk_text = (f" RISK 안정도 {risk['score']}점으로 원점수 {raw_total}점에서 "
                 f"{risk['penalty']}점을 감점했습니다." if risk["score"] is not None
                 else " RISK 데이터가 없어 감점 없이 계산했습니다.")
    def _sc(a):
        return a.get("score") if isinstance(a, dict) and a.get("score") is not None else "자료없음"
    reason = (f"자동분석 종합 {total}점({label}). 기술 {_sc(taro)}·재무 {_sc(diana)}·"
              f"퀀트(확률) {_sc(nova)}·수급 {_sc(flow)} 점을 "
              + (f"자가 학습 가중치({wtxt} — 최근 적중률 기반 자동 조정)로 합산했습니다. " if learned
                 else "균등 가중치로 합산했습니다. ")
              + risk_text
              + (" 분석축 간 편차가 커 신중한 접근이 필요합니다." if spread >= 30 else " 분석축 간 시각이 대체로 일치합니다."))
    report = (f"이 종목은 GAEO 자동 분석이 수집된 지표만으로 판단한 결과입니다. "
              f"기술적으로는 {taro['findings'][0]}, 수급 측면에서는 {flow['findings'][0]}. "
              f"퀀트(과거 통계) 분석은 {nova['findings'][2] if len(nova['findings'])>2 else '표본 수집 중'}. "
              # ⭐ 2026-09-04 정직성: 화면(app.js)은 이 값을 "확신도"라고 부르는데 여기서만
              #    "신뢰도"라고 써서, 같은 숫자가 두 이름으로 돌아다녔다. 게다가 이 값은
              #    확률이 아니라 "분석가 4인의 의견이 얼마나 모였나"라서 %를 붙이면
              #    "맞을 확률 N%"로 오해된다. 이름을 화면과 통일하고 %를 뗀다.
              f"방향 원점수 {raw_total}점에서 리스크 {risk['penalty']}점을 반영해 종합 {total}점 · {call} · "
              f"확신도 {conf}(분석가 의견 일치도이며 적중 확률이 아닙니다).")
    result = {"call": call, "total": total, "confidence": conf,
              "confidenceShadow": conf_shadow, "confidenceModelPromoted": False,
              # ⭐ 2026-09-04: 후보값이 어느 교정표(버전)로 나온 값인지 같이 남긴다.
              #    archive_analysis.py가 이걸 기록에 못 박아야, 나중에 "그날 미리 말해 둔
              #    값"을 같은 버전끼리만 모아 정직하게 채점할 수 있다.
              "confidenceModelVersion": ((confidence_model or {}).get("version")
                                         if conf_candidate is not None else None),
              "confidencePromotionStatus": ("PROMOTION_REVIEW_AVAILABLE" if conf_review
                                            else "SHADOW_ONLY"),
              "rawTotal": raw_total, "riskPenalty": risk["penalty"],
              "riskScore": risk["score"], "riskGrade": risk["grade"], "riskApplied": True,
              "reboundCheck": rebound_check,
              "modelVersion": ("baseline-risk-v2.1-rebound-guard" if rebound_check["active"] else "baseline-risk-v2"),
              "baseModelVersion": BASE_MODEL_VERSION,
              "componentVersions": dict(COMPONENT_VERSIONS),
              "available": sorted(usable), "availableCount": len(usable),
              "weightRenormalized": len(usable) < 4,
              "judgmentWithheld": False,
              # 급등 후 매수 경고 — 위 call·total 계산에 전혀 관여하지 않는다(표시 전용).
              "overheat": overheat_flag(e),
              "reason": reason, "target": tgt, "report": report}
    # 🏷️ Evolution override가 활성일 때만 남긴다(additive — 없으면 기존 기록 모양 그대로).
    #    나중에 "어느 모델(구성)이 만든 판단인가"를 정확히 채점하기 위한 각인.
    _ov = _evolution_overrides()
    if _ov:
        result["productionConfigVersion"] = _ov.get("productionConfigVersion")
        result["evolutionCandidateId"] = _ov.get("candidateId")
        result["evolutionParamHash"] = _ov.get("paramHash")
    return result


def load_ticker_names():
    """code → 종목명. dart_today.js에 종목명을 실어 보내기 위해 쓴다."""
    try:
        t = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
        arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1))
        return {d["code"]: d.get("name") or d["code"] for d in arr}
    except Exception:
        return {}


def load_sectors():
    try:
        t = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
        arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1))
        return {d["code"]: d.get("sector") or "기타" for d in arr}
    except Exception:
        return {}


def build_market_insight(out, indicators):
    """홈 화면의 30분 보강 브리핑을 auto_analysis.js 안에 함께 넣는다."""
    calls = {"BUY": 0, "HOLD": 0, "SELL": 0}
    axes = {"taro": [], "diana": [], "nova": [], "flow": []}
    ranked = []
    names = {code: row.get("name", code) for code, row in indicators.get("stocks", {}).items()}
    for code, item in out.get("stocks", {}).items():
        chief = item.get("chief") or {}
        call = chief.get("call")
        if call in calls:
            calls[call] += 1
        total = chief.get("total")
        if isinstance(total, (int, float)):
            ranked.append({"name": names.get(code, code), "total": total})
        for axis in axes:
            score = (item.get(axis) or {}).get("score")
            if isinstance(score, (int, float)):
                axes[axis].append(float(score))
    ranked.sort(key=lambda row: row["total"], reverse=True)
    labels = {"taro": "기술", "diana": "재무", "nova": "확률", "flow": "수급"}
    averages = {axis: round(sum(values) / len(values), 1) if values else 0 for axis, values in axes.items()}
    ordered = sorted(averages, key=averages.get, reverse=True)
    total = sum(calls.values())
    leaders = "·".join(row["name"] for row in ranked[:3]) if ranked else "집계 중"
    return {
        "generatedAt": out.get("generatedAt", ""),
        "sourceAsOf": out.get("priceLabel", ""),
        "calls": calls,
        "axisAverages": averages,
        "lines": [
            f"자동 판단 {total}종목은 BUY {calls['BUY']} · HOLD {calls['HOLD']} · SELL {calls['SELL']}이에요.",
            f"전체 평균은 {labels[ordered[0]]} 점수가 상대적으로 높고 {labels[ordered[-1]]} 점수가 낮아요.",
            f"종합점수 상위는 {leaders}예요. 개별 뉴스·공시는 뉴스분석에서 따로 확인해 주세요.",
        ],
    }


def _iso_now():
    """오프셋까지 포함한 ISO8601 시각. TZ가 바뀌어도 해석이 흔들리지 않게 한다."""
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def build_run_timestamps(analysis_started_at, ind):
    """⭐ 2026-08-15 (PHASE A 수정 4) — '예정시각'이 아니라 '실제 실행시각'을 기록한다.

    GitHub Actions의 cron 예정시각과 실제 실행시각은 다를 수 있으므로,
    "cron이 10:30이니 10:30 데이터"라고 가정하면 안 된다(GAEO RESEARCH V2 스펙 7번).
    나중에 "이 판단이 실제로 무엇을 보고 내려졌는지"를 재구성할 수 있어야 한다.

    워크플로가 심어주는 환경변수를 읽되, 없으면 None으로 두고 절대 지어내지 않는다.
    로컬 실행처럼 환경변수가 없는 경우에도 파이프라인이 죽지 않는다."""
    env = os.environ.get
    return {
        # 러너가 이번 사이클을 실제로 시작한 시각(워크플로가 주입)
        "workflowStartedAt": env("GAEO_CYCLE_STARTED_AT") or None,
        # 시세(data.js)를 마지막으로 실제 받아온 시각(워크플로가 주입)
        "priceFetchedAt": env("GAEO_PRICE_FETCHED_AT") or None,
        # 이 스크립트가 실제로 시작·완료한 시각
        "analysisStartedAt": analysis_started_at,
        "analysisCompletedAt": _iso_now(),
        # 시세 데이터 자체가 표방하는 기준(예: "2026-08-14 종가 (16:10 수집)")
        "priceLabel": ind.get("priceLabel", ""),
        # ⚠️ 아래는 '예정' 값이다. 실제 실행시각으로 사용하면 안 된다.
        # DART 수집이 이 판단보다 먼저 끝났는지 확인할 수 있게 남긴다.
        "dartCollectionStartedAt": env("GAEO_DART_COLLECTION_STARTED_AT") or None,
        "dartCollectionCompletedAt": env("GAEO_DART_COLLECTION_COMPLETED_AT") or None,
        "cronScheduledNominal": env("GAEO_CRON_NOMINAL") or None,
        "githubRunId": env("GITHUB_RUN_ID") or None,
        "githubRunAttempt": env("GITHUB_RUN_ATTEMPT") or None,
        "note": "workflowStartedAt·priceFetchedAt은 러너 실제 시각. cronScheduledNominal은 예정값이라 데이터 시각으로 쓰지 말 것.",
    }


def main():
    analysis_started_at = _iso_now()
    # 첫 회차에 시작 시각을 기록하고, 이후 회차부터 장시간 실행 여부를 확인한다.
    schedule_safety_handoff()

    # indicators.json은 순수 JSON
    ipath = os.path.join(HERE, "indicators.json")
    if not os.path.exists(ipath):
        print("indicators.json 없음 — 자동분석 중단"); return
    ind = json.load(open(ipath, encoding="utf-8"))
    deep = load_js_object(os.path.join(HERE, "analysis.js"), "LIVE_ANALYSIS") or {}
    deep_codes = {c for c in deep if re.match(r"^\d{6}$", str(c))}

    # QUANT 통계표(전 종목 일봉 → 상태별 5거래일 뒤 승률) + 자가 학습 가중치 + 업종 맵
    try:
        adata = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
    except Exception:
        adata = {}
    sectors = load_sectors()
    qstats = build_quant_stats(adata, sectors)
    # 🧪 Research Shadow (PHASE C) — Legacy 판단은 절대 건드리지 않는다.
    # 실패해도 Legacy 파이프라인이 멈추면 안 되므로 전부 감싼다.
    research_pit = None
    research_asof = None
    try:
        import research_engine
        # Point-in-Time: 오늘 판단이 오늘 이후 결과를 알면 안 되므로
        # priceLabel의 날짜(마지막 확정 시세일)를 asof로 쓴다.
        research_asof = (ind.get("priceLabel") or "")[:10] or datetime.date.today().isoformat()
        research_pit = research_engine.build_pit_quant_stats(adata, research_asof, horizon=5)
        print(f"Research Shadow — {research_engine.RESEARCH_MODEL_VERSION} "
              f"(hash {research_engine.config_hash()}) · PIT 표본 {research_pit['n']:,}건 "
              f"· asof {research_pit['asof']} · 마지막 결과일 {research_pit['lastOutcomeDate']}")
    except Exception as ex:
        research_engine = None
        print(f"[경고] Research Shadow 초기화 실패 — Legacy만 진행: {ex}")
    # 🧪 Research Shadow v1.1 (PHASE C FINAL HARDENING)
    # v1.0과 동시에 돌린다. 두 버전은 앞으로 각각 별도로 성능을 측정한다.
    # v1.0 기록은 이 코드가 어떤 경우에도 바꾸지 않는다.
    research_v11 = None
    research_pit_v11 = None
    try:
        import research_engine_v11
        if research_asof is None:
            research_asof = (ind.get("priceLabel") or "")[:10] or datetime.date.today().isoformat()
        # Horizon마다 별도 PIT 표. 5D 표를 20D/60D에 돌려쓰지 않는다.
        research_pit_v11 = research_engine_v11.build_pit_quant_stats_all(adata, research_asof)
        research_v11 = research_engine_v11
        sizes = " · ".join(f"{h}D {research_pit_v11[h]['n']:,}건" for h in ("5", "20", "60"))
        print(f"Research Shadow — {research_engine_v11.RESEARCH_MODEL_VERSION} "
              f"(hash {research_engine_v11.config_hash()}) · PIT {sizes} · asof {research_asof}")
    except Exception as ex:
        research_v11 = None
        print(f"[경고] Research Shadow v1.1 초기화 실패 — 나머지는 계속 진행: {ex}")
    # 📄 DART 실제 Event 로드 (2026-08-15) — read-only. API를 다시 부르지 않는다.
    #    예전에는 여기서 dart_events를 빈 목록으로 두고 상태값만 읽어서, 연구모델 C가
    #    DART를 받을 준비가 돼 있는데도 늘 빈 목록을 받았다. 이제 실제로 채운다.
    #    ⚠️ PIT 차단(detected_at <= prediction_timestamp)은 research_engine_v20의
    #       dart_context()와 public_event_summary()가 담당한다. 여기서 미리 자르면
    #       "아직 안 보이는 공시가 몇 건인지"를 셀 수 없게 된다.
    dart_bundle = {}
    dart_coverage = None
    try:
        import dart_context_loader
        dart_bundle = dart_context_loader.load_events()
        dart_coverage = dart_bundle.get("coverageState")
        print(dart_context_loader.summary_line(dart_bundle))
    except Exception as ex:
        dart_context_loader = None
        dart_bundle = {}
        # 실패해도 파이프라인을 죽이지 않는다. 대신 '공시 없음'이라고 단정하지 않는다.
        dart_coverage = "EVENT_DATA_ERROR"
        print(f"[경고] DART Context 로드 실패 — 공시 맥락 없이 계속 진행: {ex}")

    # 🧪 연구모델 C (research_v2.0) — B와 같은 조건 + DART 맥락. Production 미사용.
    research_v20 = None
    try:
        import research_engine_v20
        research_v20 = research_engine_v20
        print(f"Research Shadow — {research_engine_v20.RESEARCH_MODEL_VERSION} "
              f"(hash {research_engine_v20.config_hash()}) · B 상속 "
              f"{research_engine_v20.INHERITED_CONFIG_HASH} · DART coverage {dart_coverage}")
    except Exception as ex:
        research_v20 = None
        print(f"[경고] 연구모델 C 초기화 실패 — 나머지는 계속 진행: {ex}")
    cross_stats = build_cross_stats(adata)
    tw = load_team_weights()
    model = load_model_intelligence()
    if qstats.get("all"):
        a = qstats["all"]
        period = qstats.get("_period") or {}
        print(f"QUANT 통계표 — 전체 표본 {a['n']:,}건 · 기저 승률 {a['w']/a['n']*100:.1f}% · "
              f"버킷 {len(qstats)-1}개 · 기간 {period.get('start')}~{period.get('end')}")
    for key, label in (("5_20_golden", "5·20 골든"), ("5_20_dead", "5·20 데드"),
                       ("20_60_golden", "20·60 골든"), ("20_60_dead", "20·60 데드")):
        b = cross_stats.get(key) or {}
        if b.get("n"):
            print(f"교차 사후통계 {label} — 표본 {b['n']:,}건 · {CROSS_STAT_HORIZON}거래일 뒤 평균 {b['sum']/b['n']:+.1f}% "
                  f"· 상승확률 {b['w']/b['n']*100:.0f}%")
    print(f"CHIEF 가중치 — {'자가 학습(team_weights.js)' if tw['learned'] else '균등(파일 없음)'} · 업종 오버라이드 {len(tw['sectors'])}개")

    price_label = ind.get("priceLabel", "")
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    # 📌 Coverage Universe 각인 — 500종목 시절과 600종목 시절 성적을 섞지 않기 위해
    #    새 판단마다 "그때 몇 종목이었나"를 함께 남긴다.
    try:
        import coverage_version
        coverage_stamp = coverage_version.stamp()
        print(f"Coverage Universe — {coverage_stamp['coverageUniverseVersion']} "
              f"({coverage_stamp['coverageUniverseSize']}종목)")
    except Exception as ex:
        coverage_stamp = {}
        print(f"[경고] Coverage 버전 각인 실패 — 계속 진행: {ex}")

    out = {"generatedAt": now, "priceLabel": price_label, **coverage_stamp, "stocks": {}}
    # Research Shadow 전용 출력. 사이트(index.html)는 이 자료를 절대 읽지 않는다.
    research_out = {
        "generatedAt": now, "priceLabel": price_label,
        "createdAt": analysis_started_at,
        **coverage_stamp,
        "versions": {
            "v10": (research_engine.RESEARCH_MODEL_VERSION if research_engine else None),
            "v11": (research_v11.RESEARCH_MODEL_VERSION if research_v11 else None),
            "v20": (research_v20.RESEARCH_MODEL_VERSION if research_v20 else None),
        },
        "configHash": {
            "v10": (research_engine.config_hash() if research_engine else None),
            "v11": (research_v11.config_hash() if research_v11 else None),
            "v20": (research_v20.config_hash() if research_v20 else None),
        },
        "quantStatsAsof": research_asof,
        "pitSample": {
            "v10": {"5": (research_pit or {}).get("n")},
            "v11": {h: (research_pit_v11 or {}).get(h, {}).get("n") for h in ("5", "20", "60")},
        },
        "unbuiltCandidates": (research_v11.REGISTERED_UNBUILT_CANDIDATES if research_v11 else {}),
        "stocks": {},
    }
    n_auto = 0
    skipped = []
    for code, e in ind.get("stocks", {}).items():
        # 정밀분석(analysis.js) 보유 종목도 자동분석을 생성한다. index.html이
        # "정밀분석이 신선할 때만 우선, 오래되면 자동분석 표시"로 고르므로, 모든
        # 종목에 최신 자동분석이 항상 준비돼 있어야 한다.
        t = e.get("tech")
        if not t or not e.get("price"):
            continue                      # 지표가 없으면 자동분석 생략
        try:                              # 종목 하나가 죽어도 전체(600종목)는 이어서 생성
            taro = taro_eval(t)
            diana = diana_eval(e)
            nova = quant_eval(e, t, qstats, sectors.get(code, "기타"))   # QUANT (내부 키는 'nova' 유지 — 호환성)
            flow = flow_eval(e.get("flow"))
            wsec = tw["sectors"].get(sectors.get(code, ""), None) or tw["global"]
            candidate_context = dict(e)
            candidate_context["marketRegime"] = ind.get("marketRegime") or {}
            baseline_chief = chief_eval(candidate_context, taro, diana, nova, flow, weights=wsec,
                                        learned=tw["learned"], guard_policy=model.get("reboundGuard"),
                                        confidence_model=model.get("confidenceModel"))
            # 🗄️ 구형 그림자모델(calibrated-ensemble-v3)은 2026-08-15에 퇴출됐다.
            #    실측에서 SELL이 전체의 41%로 치우쳤고 상승장 SELL 적중률이 9.4%까지
            #    무너졌다. 신규 예측을 만들지 않고, 과거 기록만 보존한다.
            #    ⚠️ 어떤 그림자 모델도 프로그램 스스로 Production을 바꾸지 않는다.
            #       승격은 사람이 명시적으로 승인한 뒤 별도 작업으로만 한다.
            shadow_chief = None
            chief = baseline_chief
            # 🧪 Research Shadow — chief/shadowChief 옆에 하나 더 얹기만 한다.
            # 위 Legacy 계산 결과(chief)는 어떤 경우에도 수정하지 않는다.
            research_shadow = None
            if research_engine is not None and research_pit is not None:
                try:
                    research_shadow = research_engine.predict(
                        candidate_context, ind.get("marketRegime") or {}, research_pit,
                        created_at=analysis_started_at, input_timestamp=price_label,
                        matured_horizons=())   # 방금 낸 판단이라 아직 어떤 지평도 성숙하지 않음
                except Exception as ex:
                    research_shadow = {"researchModelVersion": research_engine.RESEARCH_MODEL_VERSION,
                                       "error": str(ex)[:200], "status": "RESEARCH_PREDICT_FAILED"}
            # v1.1 — Candidate 전부를 같은 predictionTimestamp에 함께 산출한다.
            research_shadow_v11 = None
            if research_v11 is not None and research_pit_v11 is not None:
                try:
                    research_shadow_v11 = research_v11.predict(
                        candidate_context, ind.get("marketRegime") or {}, research_pit_v11,
                        created_at=analysis_started_at, input_timestamp=price_label,
                        matured_horizons=())
                except Exception as ex:
                    research_shadow_v11 = {"researchModelVersion": research_v11.RESEARCH_MODEL_VERSION,
                                           "error": str(ex)[:200], "status": "RESEARCH_PREDICT_FAILED"}
            # ⚠️ Research 판단은 auto_analysis.js에 넣지 않는다.
            #    이 파일은 브라우저가 실제로 내려받는 자료라, 화면에 쓰이지도 않는
            #    Shadow 기록을 얹으면 사용자 트래픽만 늘어난다(2.4MB → 11.5MB 확인).
            #    research_shadow.json으로 따로 뺀다. 사이트는 이 파일을 읽지 않는다.
            if research_shadow is not None or research_shadow_v11 is not None:
                slim11 = research_shadow_v11
                if isinstance(slim11, dict):
                    # 종목마다 똑같이 반복되는 목록은 파일 머리말에 한 번만 둔다.
                    slim11 = {k: v for k, v in slim11.items() if k != "unbuiltCandidates"}
                research_out["stocks"][code] = {
                    "base": e["price"], "baseAt": price_label,
                    "v10": research_shadow, "v11": slim11,
                }
            # 연구모델 C — B와 같은 prediction timestamp·같은 입력으로 짝을 만든다.
            research_shadow_v20 = None
            code_events = ((dart_bundle.get("byTicker") or {}).get(code) or []
                           if dart_bundle else [])
            if research_v20 is not None and research_pit_v11 is not None:
                try:
                    research_shadow_v20 = research_v20.predict(
                        candidate_context, ind.get("marketRegime") or {}, research_pit_v11,
                        created_at=analysis_started_at, input_timestamp=price_label,
                        dart_events=code_events,
                        dart_coverage=dart_coverage, matured_horizons=())
                except Exception as ex:
                    research_shadow_v20 = {"researchModelVersion": research_v20.RESEARCH_MODEL_VERSION,
                                           "error": str(ex)[:200], "status": "RESEARCH_PREDICT_FAILED"}
            if research_shadow_v20 is not None:
                research_out["stocks"].setdefault(code, {})["v20"] = {
                    k: v for k, v in research_shadow_v20.items() if k != "unbuiltCandidates"}
            # 📄 기본모델 DART 맥락 — 방향점수를 만들지 않는 '정보 전용' 요약이다.
            #    "공시 발생 = +10점" 같은 규칙은 두지 않는다(요구 5번).
            #    Raw Event 전체가 아니라 이미 공개된 값(공시명·접수번호·탐지시각)만 담는다.
            dart_summary = None
            if dart_context_loader is not None:
                try:
                    dart_summary = dart_context_loader.public_event_summary(
                        code_events, analysis_started_at, dart_coverage)
                except Exception:
                    dart_summary = None
            out["stocks"][code] = {
                "tier": "auto",
                "updated": now,
                "base": e["price"],
                "baseAt": price_label,
                "events": [],          # 기존 필드 유지(형식 호환) — 아래 dart가 실제 맥락이다
                "dart": dart_summary,
                "taro": taro, "diana": diana, "nova": nova, "flow": flow, "chief": chief,
                "shadowChief": shadow_chief,   # 항상 None — 구형 그림자모델 퇴출됨
            }
            n_auto += 1
        except Exception as ex:
            skipped.append(f"{code}({ex})")
            continue
    if skipped:
        print(f"[경고] 자동분석 건너뜀 {len(skipped)}종목: {skipped[:10]}{' …' if len(skipped)>10 else ''}")

    # Reliability가 실제로 종목을 구분하고 있는지 매 회차 자동 점검한다.
    # 등급이 한 종류뿐이면 사용자에게 '이 종목의 신뢰등급'처럼 보여주면 안 된다.
    grades = {}
    for s in research_out["stocks"].values():
        rs11 = s.get("v11")
        g = ((rs11 or {}).get("reliability") or {}).get("internalGrade")
        if g:
            grades[g] = grades.get(g, 0) + 1
    if grades:
        differentiated = len(grades) > 1
        research_out["researchMeta"] = {
            "reliabilityGradeCounts": grades,
            "reliabilityStatus": ("RELIABILITY_DIFFERENTIATED" if differentiated
                                  else "RELIABILITY_NOT_DIFFERENTIATED"),
            "reliabilityUiDisplay": "SUPPRESSED",   # 차이가 생겨도 수동 확인 뒤에 켠다
        }
        print(f"Research Reliability — 등급 분포 {grades} · "
              f"{'종목 구분됨' if differentiated else '종목 구분 못함(UI 노출 금지)'}")
    out["marketInsight"] = build_market_insight(out, ind)
    # DART 맥락의 공통 설명은 종목마다 반복하지 않고 여기 한 번만 싣는다.
    if dart_context_loader is not None:
        out["dartMeta"] = dict(dart_context_loader.PUBLIC_SUMMARY_META,
                               coverageState=dart_coverage,
                               eventsLoaded=(dart_bundle or {}).get("total", 0))
    out["crossStats"] = {"horizonDays": CROSS_STAT_HORIZON, "buckets": cross_stats}
    out["runTimestamps"] = build_run_timestamps(analysis_started_at, ind)
    body = json.dumps(out, ensure_ascii=False, indent=1)
    js = ("// 자동 생성: analyze_auto.py · GAEO 자동 분석(러너) 규칙 기반 (Claude 토큰 0)\n"
          "// 모든 종목을 채운다(정밀분석 보유 종목 포함). index.html은 정밀분석이 신선할 때만\n"
          "// 정밀을 우선하고, 오래되면(기준가 대비 시세가 벌어지면) 이 자동분석을 표시한다.\n"
          "const LIVE_AUTO = " + body + ";\n")
    with open(os.path.join(HERE, "auto_analysis.js"), "w", encoding="utf-8") as f:
        f.write(js)
    print(f"auto_analysis.js 저장 완료 — 자동분석 {n_auto}종목 (정밀분석 보유 {len(deep_codes)}종목 포함)")

    # 📄 dart_today.js — 홈 화면 "오늘의 공시" 위젯 전용 **작은** 스냅샷.
    #    auto_analysis.js는 3MB라 홈에서 내려받게 하면 첫 화면이 느려진다. 그래서 위에서
    #    이미 만든 dart 요약에서 "종목명 · 공시명 · 접수일"만 뽑아 따로 쓴다(수십 KB).
    #    ⚠️ 여기서도 점수를 만들지 않는다. 이미 공개된 공시 원문 정보만 옮긴다.
    try:
        ticker_names = load_ticker_names()
        dart_rows = []
        for code, row in out["stocks"].items():
            summary = row.get("dart") or {}
            for item in (summary.get("items") or []):
                name = item.get("name")
                if not name or name in ("N/A", "-", ""):
                    continue
                rcept_no = item.get("rceptNo") or ""
                dart_rows.append({
                    "code": code,
                    "name": ticker_names.get(code) or code,
                    "title": " ".join(str(name).split()),
                    "receiptDate": item.get("receiptDate") or "",
                    "detectedAt": item.get("detectedAt") or "",
                    "isCorrection": bool(item.get("isCorrection")),
                    # 2026-09-03 소유자 지시("공시내용을 훨씬 구체적으로"): 본문 전체를 새로 가져오는
                    # 대신, 이미 갖고 있던 접수번호로 DART 공식 원문 링크를 만들 수 있게 실어 보낸다.
                    # dart_context_loader.public_event_summary()가 이미 rceptNo를 채워 두므로
                    # 새 네트워크 호출은 없다. N/A(공개 안 됨)면 빈 문자열로 둔다 — 화면(app.js
                    # dartTodayItems/renderDartBoard)이 빈 값이면 원문 링크를 그냥 생략한다.
                    # ⚠️ "NOT_AVAILABLE"은 DART 수집 쪽 공용 상수와 같은 값이다(리터럴로 비교).
                    #    이 파일은 그 모듈을 직접 import하지 않고 dart_context_loader를 통해서만
                    #    쓴다 — 이 파일 소스 어디에도(주석 포함) DART 원본 수집 모듈 이름이 직접
                    #    등장하면 안 된다는 계약이 별도 테스트로 고정돼 있다.
                    "rceptNo": rcept_no if rcept_no and rcept_no != "NOT_AVAILABLE" else "",
                })
        # 최신 탐지 순 → 같으면 종목명 순. 화면에서 다시 정렬하지 않아도 되게 여기서 확정한다.
        dart_rows.sort(key=lambda r: (r["detectedAt"], r["name"]), reverse=True)
        dart_out = {
            "generatedAt": now,
            "priceLabel": price_label,
            "count": len(dart_rows),
            "coverageState": dart_coverage,
            "note": "금융감독원 전자공시(DART) 자동 수집. 참고 정보이며 점수·판단에는 쓰지 않는다.",
            "items": dart_rows,
        }
        with open(os.path.join(HERE, "dart_today.js"), "w", encoding="utf-8") as f:
            f.write("// 자동 생성: analyze_auto.py · 홈 '오늘의 공시' 위젯 전용 소형 스냅샷\n"
                    "// auto_analysis.js(3MB)를 홈에서 받지 않으려고 공시 목록만 따로 뽑은 파일이다.\n"
                    "const DART_TODAY = " + json.dumps(dart_out, ensure_ascii=False, indent=1) + ";\n")
        print(f"dart_today.js 저장 완료 — 공시 {len(dart_rows)}건")
    except Exception as ex:
        # 공시 스냅샷 실패가 자동분석 전체를 막지는 않는다.
        print(f"[경고] dart_today.js 생성 실패 — {ex}")

    # 🧪 Research Shadow는 사이트 자료와 완전히 분리된 파일로 쓴다.
    #    index.html의 GaeoFeatures 목록에 없으므로 브라우저는 절대 내려받지 않는다.
    #    archive_analysis.py가 이 파일을 읽어 research_history.jsonl에 누적한다.
    rpath = os.path.join(HERE, "research_shadow.json")
    if research_out["stocks"]:
        with open(rpath, "w", encoding="utf-8") as f:
            json.dump(research_out, f, ensure_ascii=False, separators=(",", ":"))
        size_mb = os.path.getsize(rpath) / 1048576
        print(f"research_shadow.json 저장 완료 — {len(research_out['stocks'])}종목 "
              f"· {size_mb:.1f}MB (사이트 미로딩)")
    schedule_safety_handoff()


if __name__ == "__main__":
    main()
