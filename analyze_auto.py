#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 자동분석 엔진 (GitHub Actions용 · Claude 토큰 0)

핵심 아이디어: 5인 애널리스트 모두 "이미 수집·계산된 숫자를 규칙·통계로 해석"하는
일이라 사람(Claude)의 판단 없이 심부름꾼(무료 러너)이 그대로 만들 수 있다.
- TARO(기술)·DIANA(재무)·FLOW(수급): 지표 규칙 기반 해석
- QUANT(확률·통계, 내부 id 'nova' 유지): "지금과 비슷한 상태였던 과거 사례가
  5거래일 뒤 실제로 올랐는가"를 500종목 누적 일봉에서 세어 실측 승률로 점수화
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

HERE = os.path.dirname(os.path.abspath(__file__))


def schedule_safety_handoff():
    """장시간 러너가 강제 종료되기 전에 다음 분석 작업을 미리 예약한다.

    GitHub Actions의 update-analysis 작업은 한 번 시작하면 장중에 30분 주기로
    반복한다. 500종목 처리가 길어진 날에는 작업 제한시간 직전에 마지막 회차가
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


# ── TARO(기술): 이동평균 위치 + RSI + MACD + 거래량 ─────────────────────────
def taro_eval(t):
    s = 50.0
    g20, g60 = t.get("ma20Gap"), t.get("ma60Gap")
    if g20 is not None:
        s += max(-14, min(14, g20 * 1.1))
    if g60 is not None:
        s += max(-10, min(10, g60 * 0.7))
    rsi = t.get("rsi14")
    if rsi is not None:
        if rsi >= 70:   s += 3      # 과매수(강하나 과열 주의)
        elif rsi >= 55: s += 9
        elif rsi >= 45: s += 2
        elif rsi >= 30: s -= 4
        else:           s -= 1      # 과매도(반등 여지)
    macd, sig = t.get("macd"), t.get("macdSignal")
    golden = macd is not None and sig is not None and macd >= sig
    s += 9 if golden else -8
    vr = t.get("volRatio")
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
    if vr is not None:
        vzone = "활발" if vr >= 1.3 else ("보통" if vr >= 0.7 else "한산")
        f.append(f"거래량은 20일 평균의 {vr:.2f}배 — 거래 강도 {vzone}")
    while len(f) < 4:
        f.append("추가 지표는 다음 수집에서 보강됩니다")
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


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
        s += max(-6, min(12, tgap * 0.25))
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
        f.append(f"목표주가 {won(e.get('targetMean'))} → 현재가 대비 {tgap:+.1f}%")
    else:
        f.append(f"52주 밴드 {e.get('w52') or '—'} 참고 · 목표주가 컨센 미제공")
    while len(f) < 4:
        f.append("재무 지표는 다음 수집에서 보강됩니다")
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


# ── FLOW(수급): 외국인·기관 순매매 + 보유율 추이 ────────────────────────────
def flow_eval(fl):
    if not fl:
        return {"score": 50, "stance": "neu",
                "findings": ["수급(외국인·기관 순매매) 데이터가 아직 수집되지 않았습니다",
                             "다음 자동 수집에서 dealTrends가 채워지면 반영됩니다",
                             "현재는 중립으로 처리 — 채점에서 제외", "—"]}
    s = 50.0
    fr, org = fl.get("frgnSum", 0), fl.get("orgSum", 0)
    hn, hb = fl.get("holdNow"), fl.get("holdBefore")
    s += max(-16, min(16, (1 if fr > 0 else -1) * min(16, abs(fr) / 50000)))
    s += max(-10, min(10, (1 if org > 0 else -1) * min(10, abs(org) / 50000)))
    if hn is not None and hb is not None:
        s += max(-6, min(6, (hn - hb) * 3))
    quality = fl.get("qualityScore")
    score = clamp(s)
    n = fl.get("days", 0)
    f = [
        f"최근 {n}거래일 외국인 {'순매수' if fr >= 0 else '순매도'} {abs(fr):,}주 · 기관 {'순매수' if org >= 0 else '순매도'} {abs(org):,}주",
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
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


# ── QUANT(확률·통계, 내부 id는 호환성 위해 'nova' 유지): 경험적 승률 ─────────
#    "지금 이 종목과 비슷한 상태(RSI 구간 × 20일선 위/아래 × 최근 5일 추세)였던
#     과거 사례들이 5거래일 뒤 실제로 올랐는가"를 500종목 누적 일봉에서 세어,
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


def build_quant_stats(analysis_data):
    """전 종목 일봉에서 (상태 버킷 → 5거래일 뒤 상승 확률) 통계표 생성.
    반환: {key: {"n":표본수, "w":상승횟수, "sum":수익률합}}  (넓은 키일수록 표본이 큼)
    키 계층: z{rsi}m{ma}t{tr} → z{rsi}m{ma} → z{rsi} → "all"  (표본 부족 시 상위로 폴백)"""
    stats = {}

    def bump(key, win, ret):
        b = stats.setdefault(key, {"n": 0, "w": 0, "sum": 0.0})
        b["n"] += 1; b["w"] += win; b["sum"] += ret

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
            past = closes[: i + 1]
            gains, losses = [], []
            for j in range(max(1, i - 14), i + 1):
                ch = closes[j] - closes[j - 1]
                gains.append(max(ch, 0)); losses.append(max(-ch, 0))
            al = sum(losses) / len(losses) if losses else 0
            ag = sum(gains) / len(gains) if gains else 0
            rsi = 100 - 100 / (1 + ag / al) if al else 100.0
            ma20 = sum(past[-20:]) / 20
            if not closes[i - 5]:
                continue
            tr5 = (closes[i] - closes[i - 5]) / closes[i - 5] * 100
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
    return stats


def quant_eval(e, t, qstats):
    rsi = t.get("rsi14")
    g20 = t.get("ma20Gap")
    last5 = t.get("last5") or []
    tr5 = None
    if len(last5) >= 2 and last5[0].get("c"):
        tr5 = (last5[-1]["c"] - last5[0]["c"]) / last5[0]["c"] * 100
    if rsi is None or g20 is None or tr5 is None or not qstats:
        return {"score": 50, "stance": "neu", "findings": [
            "📊 QUANT — 과거 통계 조회에 필요한 지표가 아직 부족합니다",
            "다음 자동 수집에서 RSI·이동평균·최근 추세가 채워지면 승률이 계산됩니다",
            "현재는 중립(50점)으로 처리 — 채점에서 제외", "—"]}
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
        return {"score": 50, "stance": "neu", "findings": [
            "📊 QUANT — 아직 통계 표본이 없습니다", "데이터가 쌓이면 승률이 계산됩니다",
            "현재는 중립(50점) 처리", "—"]}
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
    base_wr = (allb["w"] / allb["n"] * 100) if allb.get("n") else 50.0
    rel = wr - base_wr
    score = clamp(round(50 + rel * 1.8), 20, 80)   # k=1.8: 기저 대비 ±편차를 점수로
    relword = "높아 상대적 양호" if rel >= 1 else ("낮아 상대적 부진" if rel <= -1 else "비슷한 중립 수준")
    f = [
        "📊 QUANT — 지금과 비슷한 상태였던 과거 사례의 실제 결과(500종목 누적 일봉)로 승률을 계산합니다",
        f"현재 상태: RSI {rsi:.0f}({zname}) · 20일선 {'위' if m else '아래'} · 최근 5일 {tname}({tr5:+.1f}%)",
        f"과거에 이런 상태({used})였던 적이 {b['n']}건 있었는데, 그중 {b['w']}건이 5거래일 뒤 올랐어요 → 경험적 승률 {wr:.0f}% (시장 평균 {base_wr:.0f}%보다 {rel:+.0f}%p {relword})",
        f"그 {b['n']}건의 5거래일 뒤 등락률 평균은 {avg:+.1f}%예요(오른 경우·내린 경우 전부 포함 — 승률과는 다른 숫자) · 과거 통계일 뿐 미래를 보장하진 않아요",
    ]
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


# ── CHIEF(종합): 자가 학습 가중치(team_weights.js) 기반 합산 ─────────────────
#    compute_team_weights.py가 "판단 후 5거래일 뒤 종가" 채점 기록으로 계산한
#    분석가별 적중률 비례 가중치를 쓴다. 파일이 없으면 균등(25%씩)으로 동작.

BASE_W = {"taro": 0.30, "diana": 0.12, "nova": 0.28, "flow": 0.30}


def load_team_weights():
    tw = load_js_object(os.path.join(HERE, "team_weights.js"), "TEAM_WEIGHTS")
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


def candidate_chief_eval(e, taro, diana, nova, flow, weights, model):
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
    confidence_penalty = 10 if grade == "high" else (3 if grade == "mid" else 0)
    return {"score": score, "grade": grade, "penalty": penalty,
            "confidencePenalty": confidence_penalty}


def chief_eval(e, taro, diana, nova, flow, weights=BASE_W, learned=False):
    w = {k: weights.get(k, BASE_W[k]) for k in ("taro", "diana", "nova", "flow")}
    tot_w = sum(w.values()) or 1.0
    raw_total = clamp((taro["score"] * w["taro"] + diana["score"] * w["diana"]
                       + nova["score"] * w["nova"] + flow["score"] * w["flow"]) / tot_w)
    risk = risk_overlay(e.get("risk"))
    total = clamp(raw_total - risk["penalty"])
    call = "BUY" if total >= 63 else ("HOLD" if total >= 47 else "SELL")
    scores = [taro["score"], diana["score"], nova["score"], flow["score"]]
    spread = max(scores) - min(scores)
    conf = clamp(max(40, 88 - spread) - risk["confidencePenalty"], 30, 90)
    tgap = e.get("targetGap")
    tgt = (f"증권사 평균 목표주가 {won(e.get('targetMean'))} (현재가 대비 {tgap:+.1f}% 상승여력)"
           if tgap is not None else "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고")
    label = {"BUY": "매수 우위", "HOLD": "중립", "SELL": "비중 축소"}[call]
    wtxt = f"기술 {w['taro']*100:.0f}%·재무 {w['diana']*100:.0f}%·퀀트 {w['nova']*100:.0f}%·수급 {w['flow']*100:.0f}%"
    risk_text = (f" RISK 안정도 {risk['score']}점으로 원점수 {raw_total}점에서 "
                 f"{risk['penalty']}점을 감점했습니다." if risk["score"] is not None
                 else " RISK 데이터가 없어 감점 없이 계산했습니다.")
    reason = (f"자동분석 종합 {total}점({label}). 기술 {taro['score']}·재무 {diana['score']}·"
              f"퀀트(확률) {nova['score']}·수급 {flow['score']} 점을 "
              + (f"자가 학습 가중치({wtxt} — 최근 적중률 기반 자동 조정)로 합산했습니다. " if learned
                 else "균등 가중치로 합산했습니다. ")
              + risk_text
              + (" 분석축 간 편차가 커 신중한 접근이 필요합니다." if spread >= 30 else " 분석축 간 시각이 대체로 일치합니다."))
    report = (f"이 종목은 GAEO 자동 분석이 수집된 지표만으로 판단한 결과입니다. "
              f"기술적으로는 {taro['findings'][0]}, 수급 측면에서는 {flow['findings'][0]}. "
              f"퀀트(과거 통계) 분석은 {nova['findings'][2] if len(nova['findings'])>2 else '표본 수집 중'}. "
              f"방향 원점수 {raw_total}점에서 리스크 {risk['penalty']}점을 반영해 종합 {total}점 · {call} · 신뢰도 {conf}%.")
    return {"call": call, "total": total, "confidence": conf,
            "rawTotal": raw_total, "riskPenalty": risk["penalty"],
            "riskScore": risk["score"], "riskGrade": risk["grade"], "riskApplied": True,
            "reason": reason, "target": tgt, "report": report}


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


def main():
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
    qstats = build_quant_stats(adata)
    tw = load_team_weights()
    model = load_model_intelligence()
    sectors = load_sectors()
    if qstats.get("all"):
        a = qstats["all"]
        print(f"QUANT 통계표 — 전체 표본 {a['n']:,}건 · 기저 승률 {a['w']/a['n']*100:.1f}% · 버킷 {len(qstats)}개")
    print(f"CHIEF 가중치 — {'자가 학습(team_weights.js)' if tw['learned'] else '균등(파일 없음)'} · 업종 오버라이드 {len(tw['sectors'])}개")

    price_label = ind.get("priceLabel", "")
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    out = {"generatedAt": now, "priceLabel": price_label, "stocks": {}}
    n_auto = 0
    skipped = []
    for code, e in ind.get("stocks", {}).items():
        # 정밀분석(analysis.js) 보유 종목도 자동분석을 생성한다. index.html이
        # "정밀분석이 신선할 때만 우선, 오래되면 자동분석 표시"로 고르므로, 모든
        # 종목에 최신 자동분석이 항상 준비돼 있어야 한다.
        t = e.get("tech")
        if not t or not e.get("price"):
            continue                      # 지표가 없으면 자동분석 생략
        try:                              # 종목 하나가 죽어도 전체(500종목)는 이어서 생성
            taro = taro_eval(t)
            diana = diana_eval(e)
            nova = quant_eval(e, t, qstats)   # QUANT (내부 키는 'nova' 유지 — 호환성)
            flow = flow_eval(e.get("flow"))
            wsec = tw["sectors"].get(sectors.get(code, ""), None) or tw["global"]
            baseline_chief = chief_eval(e, taro, diana, nova, flow, weights=wsec, learned=tw["learned"])
            candidate_context = dict(e)
            candidate_context["marketRegime"] = ind.get("marketRegime") or {}
            shadow_chief = candidate_chief_eval(candidate_context, taro, diana, nova, flow, wsec, model) if model else None
            promoted = bool((model.get("promotion") or {}).get("qualified")) and shadow_chief is not None
            chief = shadow_chief if promoted else baseline_chief
            if promoted:
                chief["promoted"] = True
                chief["baselineCall"] = baseline_chief.get("call")
                chief["baselineTotal"] = baseline_chief.get("total")
            out["stocks"][code] = {
                "tier": "auto",
                "updated": now,
                "base": e["price"],
                "baseAt": price_label,
                "events": [],
                "taro": taro, "diana": diana, "nova": nova, "flow": flow, "chief": chief,
                "shadowChief": shadow_chief,
            }
            n_auto += 1
        except Exception as ex:
            skipped.append(f"{code}({ex})")
            continue
    if skipped:
        print(f"[경고] 자동분석 건너뜀 {len(skipped)}종목: {skipped[:10]}{' …' if len(skipped)>10 else ''}")

    out["marketInsight"] = build_market_insight(out, ind)
    body = json.dumps(out, ensure_ascii=False, indent=1)
    js = ("// 자동 생성: analyze_auto.py · GAEO 자동 분석(러너) 규칙 기반 (Claude 토큰 0)\n"
          "// 모든 종목을 채운다(정밀분석 보유 종목 포함). index.html은 정밀분석이 신선할 때만\n"
          "// 정밀을 우선하고, 오래되면(기준가 대비 시세가 벌어지면) 이 자동분석을 표시한다.\n"
          "const LIVE_AUTO = " + body + ";\n")
    with open(os.path.join(HERE, "auto_analysis.js"), "w", encoding="utf-8") as f:
        f.write(js)
    print(f"auto_analysis.js 저장 완료 — 자동분석 {n_auto}종목 (정밀분석 보유 {len(deep_codes)}종목 포함)")
    schedule_safety_handoff()


if __name__ == "__main__":
    main()
