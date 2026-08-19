#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""기본모델 후보 A0~A4 시간순 검증 (요구 8번).

무엇을 재현할 수 있고 무엇을 못 하는가 — 먼저 정직하게 적는다
    재현 가능(과거 일봉에서 그대로 다시 계산됨):
        TARO(가격·이동평균·RSI) · QUANT(과거 유사국면 승률) · RISK(변동성·낙폭)
        시장 레짐(상승/횡보/하락) · 상대강도(시장대비·업종대비)
    재현 불가(과거 값이 저장돼 있지 않음):
        DIANA(재무·컨센서스)  — 과거 시점 재무 스냅샷을 보관하지 않는다
        FLOW(외국인·기관 순매매) — dealTrends는 최근 5거래일치만 들어온다

    그래서 이 검증은 **가격축 재현 모델**이다. DIANA·FLOW는 '자료 없음'으로 두고,
    Production과 똑같이 available한 분석가끼리 가중치를 재정규화한다.
    이 상태에서 A0와 각 후보의 **차이**를 측정한다.

    ⚠️ 따라서 여기 나오는 절대 적중률은 실제 서비스 성적이 아니다.
       비교해도 되는 건 오직 "같은 조건에서 A0 대비 후보가 나은가"뿐이다.
    ⚠️ A1(FLOW 정규화)은 과거 수급이 없어 이 방식으로 검증할 수 없다.
       없는 데이터를 만들어내지 않고 NOT_BACKTESTABLE로 남긴다.

규칙
    - 시간순. random shuffle 없다.
    - 결과를 보고 threshold를 고치지 않는다.
    - 특정 최근 1주일에 맞추지 않는다. 전 구간을 기간별로 나눠 함께 본다.
"""
import json
import os
import statistics
import sys

import base_model_candidates as CAND
import indicator_math

HERE = os.path.dirname(os.path.abspath(__file__))

WARMUP = 70            # MA60 + RSI warm-up이 끝난 뒤부터만 판단한다
HORIZONS = (5, 20)     # 60D는 표본이 너무 적어 따로 표시만 한다
NOT_BACKTESTABLE = "NOT_BACKTESTABLE"


# ── 입력 ─────────────────────────────────────────────────────────────────────
def load_bars():
    path = os.path.join(HERE, "analysis_data.json")
    data = json.load(open(path, encoding="utf-8"))
    out = {}
    for code, s in (data.get("stocks") or {}).items():
        daily = [d for d in (s.get("daily") or []) if d.get("close")]
        if len(daily) >= WARMUP + max(HORIZONS) + 5:
            out[code] = daily
    return out


def load_sectors():
    import re
    txt = open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    rows = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", txt, re.S).group(1))
    return {str(r["code"]): r.get("sector") or "기타" for r in rows}


# ── 재현 가능한 종목 상태 ────────────────────────────────────────────────────
def stock_state(closes, highs, lows, i):
    """i 시점까지의 정보만으로 만든 상태. 미래 봉을 절대 보지 않는다."""
    window = closes[:i + 1]
    st = indicator_math.state_at(window)
    price = window[-1]
    ma20 = indicator_math.sma(window, 20)
    ma60 = indicator_math.sma(window, 60)
    ma20_prev = indicator_math.sma(window[:-5], 20) if len(window) > 25 else None
    slope = None
    if ma20 and ma20_prev:
        slope = (ma20 / ma20_prev - 1) * 100
    # 변동성: 20일 일간수익률 표준편차
    rets = [(window[k] / window[k - 1] - 1) * 100 for k in range(max(1, len(window) - 20), len(window))]
    vol20 = statistics.pstdev(rets) if len(rets) > 1 else 0.0
    # 3개월 낙폭 / 저점 대비 반등
    lo_window = lows[max(0, i - 60):i + 1] or [price]
    hi_window = highs[max(0, i - 60):i + 1] or [price]
    peak = max(hi_window) or price
    trough = min(lo_window) or price
    mdd = (price / peak - 1) * 100 if peak else 0.0
    rebound = (price / trough - 1) * 100 if trough else 0.0
    return {
        "price": price, "close": price,
        "ma20": ma20, "ma60": ma60, "ma20Slope": slope,
        "ma20Full": len(window) >= 20, "ma60Full": len(window) >= 60,
        "rsi": st.get("rsi14"), "ret5": st.get("ret5"),
        "vol20": round(vol20, 3), "mdd3m": round(mdd, 2),
        "reboundFromLow": round(rebound, 2),
    }


def taro_score_from(state):
    """가격축 점수. Production taro_eval의 가격 부분과 같은 방향으로 만든다.

    ⚠️ 이 값의 절대 수준은 Production과 같지 않다. A0/후보 모두 **같은 함수**를
       쓰므로 후보 간 비교에는 문제가 없다.
    """
    rsi, ma20, ma60, price = state.get("rsi"), state.get("ma20"), state.get("ma60"), state["price"]
    if rsi is None or ma20 is None:
        return None
    s = 50.0
    s += max(-14, min(14, (50 - rsi) * 0.45))          # 과매도 우호 / 과매수 부담
    s += 8 if price >= ma20 else -8
    if ma60:
        s += 6 if price >= ma60 else -6
    ret5 = state.get("ret5")
    if ret5 is not None:
        s += max(-8, min(8, ret5 * 0.6))
    return max(0, min(100, round(s)))


def quant_score_from(stats, state):
    """과거 유사 국면(RSI 구간 × 20일선 위/아래 × 5일 추세) 실측 승률."""
    rsi, ma20, price, ret5 = state.get("rsi"), state.get("ma20"), state["price"], state.get("ret5")
    if rsi is None or ma20 is None or ret5 is None:
        return None
    key = bucket_key(rsi, price >= ma20, ret5)
    b = stats.get(key)
    if not b or b["n"] < 30:
        return None
    return max(0, min(100, round(b["w"] / b["n"] * 100)))


def bucket_key(rsi, above_ma, ret5):
    zone = 0 if rsi < 30 else (1 if rsi < 45 else (2 if rsi < 55 else (3 if rsi < 70 else 4)))
    trend = 0 if ret5 < -3 else (1 if ret5 < 3 else 2)
    return f"{zone}|{int(bool(above_ma))}|{trend}"


def stance_of(score):
    if score is None:
        return "neu"
    return "bull" if score >= 60 else ("bear" if score <= 40 else "neu")


# ── PIT 통계표 ───────────────────────────────────────────────────────────────
def build_pit_stats_at(bars, index_by_date, asof_date, all_dates, horizon):
    """asof_date까지 **결과가 이미 확정된** 사례만 세어 만든 승률표.

    ⚠️ 라벨이 확정되려면 horizon만큼 더 지나야 한다. 그래서 asof_date보다
       horizon 거래일 이상 앞선 시점만 표본에 넣는다. 안 지키면 미래를 훔쳐본다.
    """
    pos = all_dates.index(asof_date)
    cutoff_date = all_dates[max(0, pos - horizon)]
    stats = {}
    for code, closes in bars.items():
        dmap = index_by_date[code]
        cutoff_i = None
        # 그 종목 기준으로 '라벨이 확정된 마지막 시점'
        for d, k in dmap.items():
            if d <= cutoff_date and (cutoff_i is None or k > cutoff_i):
                cutoff_i = k
        if cutoff_i is None:
            continue
        limit = min(cutoff_i, len(closes) - horizon - 1)
        for i in range(WARMUP, limit):
            st = indicator_math.state_at(closes[:i + 1])
            rsi, ret5 = st.get("rsi14"), st.get("ret5")
            ma20 = indicator_math.sma(closes[:i + 1], 20)
            if rsi is None or ret5 is None or ma20 is None:
                continue
            key = bucket_key(rsi, closes[i] >= ma20, ret5)
            fwd = closes[i + horizon] / closes[i] - 1
            b = stats.setdefault(key, {"n": 0, "w": 0})
            b["n"] += 1
            b["w"] += 1 if fwd > 0 else 0
    return stats


# ── 판단 ─────────────────────────────────────────────────────────────────────
def decide(variant, state, taro_s, quant_s, regime, relative, sector_flow=None):
    """A0 / A2 / A3 / A4의 판단을 만든다.

    Production과 동일하게: 자료 없는 분석가는 빼고, 남은 분석가끼리 가중치를
    재정규화한다. 가짜 50점을 넣지 않는다.
    """
    if variant == "A4":
        taro_s, _ = CAND.apply_slope(taro_s, state)

    usable = {k: v for k, v in (("taro", taro_s), ("nova", quant_s)) if v is not None}
    if len(usable) < 2:
        return {"call": "JUDGMENT_WITHHELD", "total": None}

    raw_total = round(sum(usable.values()) / len(usable))

    # RISK
    risk = {"vol20": state["vol20"], "mdd3m": state["mdd3m"],
            "reboundFromLow": state["reboundFromLow"]}
    base_overlay = production_risk_overlay(risk)
    if variant == "A2":
        sep = CAND.risk_direction_separated(risk, base_overlay)
        penalty = sep["directionPenalty"]           # 0 — 방향에 개입하지 않는다
    else:
        penalty = base_overlay["penalty"]
    total = max(0, min(100, raw_total - penalty))

    taro_a = {"stance": stance_of(taro_s)}
    nova_a = {"stance": stance_of(quant_s)}
    # A5·A6은 BUY/SELL 문턱 자체를 바꾼 후보다(그 외 계산은 A0와 동일).
    buy_threshold, sell_threshold = CAND.thresholds_for(variant)
    if variant == "A3":
        g = CAND.expanded_uptrend_sell_guard(
            {"marketRegime": regime, "relative": relative},
            taro_a, nova_a, sector_flow, {"sellThreshold": 47})
        if g.get("expandedActive"):
            sell_threshold = g["expandedSellThreshold"]

    call = "BUY" if total >= buy_threshold else ("HOLD" if total >= sell_threshold else "SELL")
    return {"call": call, "total": total}


def production_risk_overlay(risk):
    """analyze_auto.risk_overlay와 같은 계산(A0 기준선)."""
    vol = float(risk.get("vol20") or 0)
    drawdown = float(risk.get("mdd3m") or 0)
    score = max(5, min(95, round(100 - vol * 10 - max(0, -drawdown) * 0.6)))
    grade = "high" if score < 35 else ("mid" if score < 55 else "low")
    penalty = max(1, min(7, round(max(0, 45 - score) * 0.15) + 1)) if grade == "high" else 0
    rebound = float(risk.get("reboundFromLow") or 0)
    if penalty > 0 and rebound > 15:
        damp = min(0.6, (rebound - 15) / 60)
        penalty = max(0, round(penalty * (1 - damp)))
    return {"score": score, "grade": grade, "penalty": penalty,
            "confidencePenalty": 10 if grade == "high" else (3 if grade == "mid" else 0)}


# ── 레짐 ─────────────────────────────────────────────────────────────────────
def market_regime_cross(bars, active):
    """그 날짜 단면으로 만든 시장 레짐. 미래를 안 본다."""
    rets5, adv1, n = [], 0, 0
    for code, i in active.items():
        closes = bars[code]
        if i < 6:
            continue
        r5 = (closes[i] / closes[i - 5] - 1) * 100
        rets5.append(r5)
        adv1 += 1 if closes[i] > closes[i - 1] else 0
        n += 1
    if not rets5:
        return {}
    med5 = statistics.median(rets5)
    adv5 = sum(1 for r in rets5 if r > 0) / len(rets5) * 100
    vol = statistics.pstdev(rets5)
    trend = "up" if med5 >= 1.0 else ("down" if med5 <= -1.0 else "side")
    return {"trend": trend, "vol": "high" if vol >= 6 else "low",
            "medianRet5": round(med5, 2), "advanceRatio5": round(adv5, 1),
            "medianRet1": 0.0, "advanceRatio1": round(adv1 / n * 100, 1) if n else 0.0}


def relative_cross(bars, sectors, code, active, regime_med5):
    """같은 날짜에 실제로 거래된 종목끼리만 비교한다."""
    i = active[code]
    closes = bars[code]
    if i < 6:
        return {}
    r5 = (closes[i] / closes[i - 5] - 1) * 100
    sec = sectors.get(code)
    peer_rets = [(bars[c][j] / bars[c][j - 5] - 1) * 100
                 for c, j in active.items() if sectors.get(c) == sec and j >= 6]
    sec_med = statistics.median(peer_rets) if peer_rets else regime_med5
    return {"vsMarket": round(r5 - regime_med5, 2), "vsSector": round(r5 - sec_med, 2)}


# ── 실행 ─────────────────────────────────────────────────────────────────────
def run(horizon=5, step=5, variants=("A0", "A2", "A3", "A4", "A5", "A6")):
    bars_raw = load_bars()
    sectors = load_sectors()
    closes_by = {c: [d["close"] for d in rows] for c, rows in bars_raw.items()}
    highs_by = {c: [d.get("high") or d["close"] for d in rows] for c, rows in bars_raw.items()}
    lows_by = {c: [d.get("low") or d["close"] for d in rows] for c, rows in bars_raw.items()}
    # ⚠️ 종목마다 상장일·거래정지가 달라 일봉 길이가 다르다. 가장 짧은 종목에
    #    전체를 맞추면 대부분의 과거가 통째로 버려진다(499종목 중 최단 112일).
    #    그래서 **달력 날짜**를 기준으로 맞추고, 각 종목은 그 날짜에 충분한
    #    과거가 있을 때만 참여시킨다.
    index_by_date = {}
    for code, rows in bars_raw.items():
        index_by_date[code] = {str(r["date"]): k for k, r in enumerate(rows)}
    all_dates = sorted({d for m in index_by_date.values() for d in m})
    print(f"종목 {len(closes_by)}개 · 달력일 {len(all_dates)}일 "
          f"({all_dates[0]}~{all_dates[-1]}) · horizon {horizon}D · 평가 간격 {step}거래일")

    results = {v: [] for v in variants}
    stats = None
    eval_dates = all_dates[WARMUP + 10: len(all_dates) - horizon: step]
    for n_pt, date in enumerate(eval_dates):
        # 이 날짜에 참여 가능한 종목만 모은다(그 날짜가 있고, 과거가 WARMUP 이상이고,
        # horizon 뒤 결과까지 확정된 종목).
        active = {}
        for code, closes in closes_by.items():
            i = index_by_date[code].get(date)
            if i is None or i < WARMUP or i + horizon >= len(closes):
                continue
            active[code] = i
        if len(active) < 50:
            continue
        # PIT 통계표는 비싸니 몇 지점마다 새로 만든다(그 사이엔 과거 표를 쓴다 = 보수적).
        if n_pt % 4 == 0 or stats is None:
            stats = build_pit_stats_at(closes_by, index_by_date, date, all_dates, horizon)
        regime = market_regime_cross(closes_by, active)
        market_fwd = statistics.median(
            [(closes_by[c][i + horizon] / closes_by[c][i] - 1) * 100 for c, i in active.items()])
        for code, i in active.items():
            closes = closes_by[code]
            state = stock_state(closes, highs_by[code], lows_by[code], i)
            taro_s = taro_score_from(state)
            quant_s = quant_score_from(stats, state)
            if taro_s is None or quant_s is None:
                continue
            rel = relative_cross(closes_by, sectors, code, active, regime.get("medianRet5", 0))
            fwd = (closes[i + horizon] / closes[i] - 1) * 100
            for v in variants:
                d = decide(v, state, taro_s, quant_s, regime, rel)
                if d["call"] == "JUDGMENT_WITHHELD":
                    continue
                results[v].append({
                    "date": date, "code": code, "call": d["call"], "total": d["total"],
                    "ret": fwd, "excess": fwd - market_fwd,
                    "regime": regime.get("trend", "side"),
                })
    return results, len(eval_dates)


def summarize(rows):
    """요구 8번이 지정한 항목을 전부 따로 낸다."""
    def block(sub):
        if not sub:
            return {"n": 0}
        hits = sum(1 for r in sub if (r["call"] == "BUY" and r["ret"] > 0)
                   or (r["call"] == "SELL" and r["ret"] < 0)
                   or (r["call"] == "HOLD" and abs(r["ret"]) <= 3))
        return {
            "n": len(sub),
            "적중률": round(hits / len(sub) * 100, 1),
            "median수익률": round(statistics.median([r["ret"] for r in sub]), 2),
            "median시장대비": round(statistics.median([r["excess"] for r in sub]), 2),
        }

    out = {"전체": block(rows)}
    for call in ("BUY", "HOLD", "SELL"):
        out[call] = block([r for r in rows if r["call"] == call])
    for reg, label in (("up", "상승장"), ("side", "횡보장"), ("down", "하락장")):
        out[label] = block([r for r in rows if r["regime"] == reg])
    out["상승장 SELL"] = block([r for r in rows if r["regime"] == "up" and r["call"] == "SELL"])
    out["하락장 SELL"] = block([r for r in rows if r["regime"] == "down" and r["call"] == "SELL"])
    total = len(rows) or 1
    out["판단분포"] = {c: round(sum(1 for r in rows if r["call"] == c) / total * 100, 1)
                   for c in ("BUY", "HOLD", "SELL")}
    out["실제판단일수"] = len({r["date"] for r in rows})
    return out


def main():
    horizon = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    results, n_days = run(horizon=horizon)
    report = {"horizon": f"{horizon}D", "평가시점수": n_days,
              "note": ("가격축 재현 검증. DIANA·FLOW는 과거 값이 없어 제외했다. "
                       "절대 적중률은 실제 서비스 성적이 아니며, A0 대비 차이만 의미가 있다."),
              "A1": {"status": NOT_BACKTESTABLE,
                     "reason": ("과거 일별 외국인·기관 순매매가 저장돼 있지 않다"
                                "(dealTrends는 최근 5거래일치만 수집된다). "
                                "정규화 후보는 앞으로 수집이 쌓인 뒤에야 검증할 수 있다.")},
              "variants": {}}
    for v, rows in results.items():
        report["variants"][v] = {"label": CAND.CANDIDATE_LABELS[v], **summarize(rows)}

    print(json.dumps(report, ensure_ascii=False, indent=1))
    out_path = os.path.join(HERE, f"base_candidate_report_{horizon}d.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    print(f"\n저장: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
