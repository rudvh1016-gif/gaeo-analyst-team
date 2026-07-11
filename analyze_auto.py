#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 자동분석 엔진 (GitHub Actions용 · Claude 토큰 0)

핵심 아이디어: 5인 애널리스트 중 TARO(기술)·DIANA(재무)·FLOW(수급)·CHIEF(종합)는
"이미 수집·계산된 숫자를 규칙에 따라 해석"하는 일이라 사람(Claude)의 판단 없이
심부름꾼(무료 러너)이 그대로 만들 수 있다. NOVA(뉴스)만 진짜 웹검색·판단이 필요하나,
자동분석 티어에서는 '개별 뉴스 미반영 + 모멘텀 기반' 축약본으로 대체한다.

→ 이렇게 하면 종목을 수백 개로 늘려도 자동분석분은 토큰이 전혀 들지 않는다.
   Claude가 직접 쓴 정밀분석(analysis.js)이 있는 종목은 건드리지 않는다(정밀분석 우선).

입력 : indicators.json (compute_indicators.py 산출) · analysis.js (정밀분석 목록 확인)
출력 : auto_analysis.js  →  const LIVE_AUTO = { "CODE": {tier:"auto", taro/diana/nova/flow/chief}, ... }
실행 : python3 analyze_auto.py   (워크플로우에서 compute_indicators.py 다음에 실행)
"""
import json, re, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))


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
        f.append(f"증권사 평균 목표주가 {won(e.get('targetMean'))} · 현재가 대비 {tgap:+.1f}% 여력")
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
    f.append("외국인·기관 동반 매수 우위" if combo == 2 else ("외국인·기관 매수/매도 엇갈림" if combo == 1 else "외국인·기관 동반 매도 우위"))
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


# ── NOVA(뉴스·심리): 자동 티어 — 개별 뉴스 미반영, 모멘텀 기반 축약 ──────────
def nova_eval(e, t):
    s = 50.0
    rate = e.get("rate")
    if rate is not None:
        s += max(-8, min(8, rate * 1.2))
    if t:
        lo, hi, close = t.get("low3m"), t.get("high3m"), t.get("close")
        if lo is not None and hi is not None and hi > lo and close is not None:
            pos = (close - lo) / (hi - lo)             # 3개월 밴드 내 위치(0~1)
            s += (pos - 0.5) * 16
        last5 = t.get("last5") or []
        if len(last5) >= 2 and last5[0]["c"]:
            trend = (last5[-1]["c"] - last5[0]["c"]) / last5[0]["c"] * 100
            s += max(-6, min(6, trend * 0.5))
    score = clamp(s, 20, 80)                            # 뉴스 없는 자동판단이라 극단값 자제
    band = ""
    if t and t.get("low3m") and t.get("high3m"):
        band = f"3개월 밴드({won(t['low3m'])}~{won(t['high3m'])}) 내 {'상단' if score >= 55 else ('중단' if score >= 45 else '하단')}권"
    f = [
        "🤖 자동분석 — 개별 뉴스·공시는 미반영, 가격 모멘텀만으로 심리를 추정합니다",
        f"전일 대비 {rate:+.2f}% · 최근 흐름 {'우호적' if score >= 55 else ('중립' if score >= 45 else '경계')}" if rate is not None else "등락 데이터 대기",
        band or "가격 위치 데이터 대기",
        "정밀 뉴스 분석이 필요하면 정밀분석(Claude)으로 전환하세요",
    ]
    return {"score": score, "stance": stance_of(score), "findings": f[:4]}


# ── CHIEF(종합): 4인 중 TARO·DIANA·NOVA 평균 75% + FLOW 25% ─────────────────
def chief_eval(e, taro, diana, nova, flow):
    base3 = (taro["score"] + diana["score"] + nova["score"]) / 3
    total = clamp(base3 * 0.75 + flow["score"] * 0.25)
    call = "BUY" if total >= 63 else ("HOLD" if total >= 47 else "SELL")
    scores = [taro["score"], diana["score"], nova["score"], flow["score"]]
    spread = max(scores) - min(scores)
    conf = clamp(max(40, 88 - spread), 30, 90)
    tgap = e.get("targetGap")
    tgt = (f"증권사 평균 목표주가 {won(e.get('targetMean'))} (현재가 대비 {tgap:+.1f}% 상승여력)"
           if tgap is not None else "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고")
    label = {"BUY": "매수 우위", "HOLD": "중립", "SELL": "비중 축소"}[call]
    reason = (f"자동분석 종합 {total}점({label}). 기술 {taro['score']}·재무 {diana['score']}·"
              f"뉴스(자동) {nova['score']}·수급 {flow['score']} 점을 규칙 기반으로 합산했습니다. "
              + ("분석축 간 편차가 커 신중한 접근이 필요합니다." if spread >= 30 else "분석축 간 시각이 대체로 일치합니다."))
    report = (f"이 종목은 심부름꾼(자동 엔진)이 수집된 지표만으로 판단한 자동분석 결과입니다. "
              f"기술적으로는 {taro['findings'][0]}, 수급 측면에서는 {flow['findings'][0]}. "
              f"개별 뉴스·공시는 반영되지 않았으므로, 중요한 판단에는 정밀분석(Claude 5인)으로 재확인을 권장합니다. "
              f"종합 {total}점 · {call} · 신뢰도 {conf}%.")
    return {"call": call, "total": total, "confidence": conf,
            "reason": reason, "target": tgt, "report": report}


def main():
    ind = load_js_object(os.path.join(HERE, "indicators.json"), None) if False else None
    # indicators.json은 순수 JSON
    ipath = os.path.join(HERE, "indicators.json")
    if not os.path.exists(ipath):
        print("indicators.json 없음 — 자동분석 중단"); return
    ind = json.load(open(ipath, encoding="utf-8"))
    deep = load_js_object(os.path.join(HERE, "analysis.js"), "LIVE_ANALYSIS") or {}
    deep_codes = {c for c in deep if re.match(r"^\d{6}$", str(c))}

    price_label = ind.get("priceLabel", "")
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    out = {"generatedAt": now, "priceLabel": price_label, "stocks": {}}
    n_auto = 0
    for code, e in ind.get("stocks", {}).items():
        if code in deep_codes:
            continue                      # 정밀분석(Claude)이 있으면 그대로 둔다
        t = e.get("tech")
        if not t or not e.get("price"):
            continue                      # 지표가 없으면 자동분석 생략
        taro = taro_eval(t)
        diana = diana_eval(e)
        nova = nova_eval(e, t)
        flow = flow_eval(e.get("flow"))
        chief = chief_eval(e, taro, diana, nova, flow)
        out["stocks"][code] = {
            "tier": "auto",
            "updated": now,
            "base": e["price"],
            "baseAt": price_label,
            "events": [],
            "taro": taro, "diana": diana, "nova": nova, "flow": flow, "chief": chief,
        }
        n_auto += 1

    body = json.dumps(out, ensure_ascii=False, indent=1)
    js = ("// 자동 생성: analyze_auto.py · 심부름꾼(러너) 규칙 기반 자동분석 (Claude 토큰 0)\n"
          "// 정밀분석(analysis.js)이 없는 종목만 채운다. index.html은 정밀분석 우선, 없으면 이 파일을 쓴다.\n"
          "const LIVE_AUTO = " + body + ";\n")
    with open(os.path.join(HERE, "auto_analysis.js"), "w", encoding="utf-8") as f:
        f.write(js)
    print(f"auto_analysis.js 저장 완료 — 자동분석 {n_auto}종목 (정밀분석 {len(deep_codes)}종목 제외)")


if __name__ == "__main__":
    main()
