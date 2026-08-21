# -*- coding: utf-8 -*-
"""통합 평가 — 기존 채점 의미를 '재사용'하고 새 의미를 만들지 않는다.

재사용(복제 금지):
  · call_hit / stance_hit / build_market_regimes  ← compute_model_intelligence.py
  · 날짜 단위 block bootstrap                      ← build_model_scoreboard.py
  · 업종 매핑                                      ← compute_model_intelligence.load_sectors

통계 원칙(Constitution statisticalPolicy):
  같은 날 600종목은 독립이 아니다. raw N과 함께 unique decision days ·
  시장국면 수를 항상 기록하고, 불확실성은 날짜 단위 block bootstrap으로 잰다.

후보 시뮬레이션은 "offline_approximation_v1"이다:
  chief_eval의 BUY 경계(total>=63)와 행별 sellThreshold, 저장된 riskPenalty를
  그대로 쓰되, JUDGMENT_WITHHELD·반등가드 등 실전 분기 전부를 재현하지는 않는다.
  그래서 이 평가는 '싼 선별'까지만 쓰고, 승격 근거는 실전 Shadow 기록만 인정한다.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from compute_model_intelligence import (            # noqa: E402 — 의미 재사용
    build_market_regimes, call_hit, load_js, load_sectors)
from build_model_scoreboard import _block_bootstrap_ci  # noqa: E402 — 날짜 블록 부트스트랩 재사용

from gaeo_evolution import leakage                  # noqa: E402

OFFLINE_SEMANTICS = "offline_approximation_v1"
ANALYSTS = ("taro", "diana", "nova", "flow")
BUY_CUT_BASELINE = 63          # analyze_auto.chief_eval 실측 경계
SELL_CUT_FALLBACK = 47         # reboundCheck.sellThreshold의 관측 기본값
LARGE_ERROR_PCT = 10.0         # 행동 판단이 10%p 넘게 반대로 간 경우


def load_market_data(root=ROOT):
    import json
    history = load_js(os.path.join(root, "history.js"), "LIVE_HISTORY") or {}
    with open(os.path.join(root, "analysis_data.json"), encoding="utf-8") as f:
        raw = json.load(f)
    closes = {}
    for code, stock in (raw.get("stocks") or {}).items():
        rows = sorted((r for r in (stock.get("daily") or []) if r.get("date") and r.get("close")),
                      key=lambda r: r["date"])
        closes[code] = rows
    return history, closes


def build_rows(history, closes, horizon=5):
    """평가 행 생성 — 결과값에는 반드시 outcomeDate를 함께 기록한다(누출 검증용)."""
    rows = []
    for code, entries in history.items():
        if not isinstance(entries, list):
            continue
        series = closes.get(code) or []
        for entry in entries:
            day = str(entry.get("date", ""))[:10]
            base = entry.get("base")
            if not day or not base:
                continue
            after = [r for r in series if r["date"] > day]
            ret = out_date = None
            if len(after) >= horizon:
                ret = (after[horizon - 1]["close"] / base - 1) * 100
                out_date = after[horizon - 1]["date"]
            rebound = entry.get("reboundCheck") or {}
            row = {"code": code, "day": day, "call": entry.get("call"),
                   "total": entry.get("total"), "confidence": entry.get("confidence"),
                   "base": base, "baseAt": entry.get("baseAt"),
                   "rawTotal": entry.get("rawTotal"), "riskPenalty": entry.get("riskPenalty"),
                   "sellThreshold": rebound.get("sellThreshold"),
                   "ret5": ret, "outcomeDate": out_date}
            for analyst in ANALYSTS:
                item = entry.get(analyst) or {}
                row[analyst] = {"score": item.get("score"), "stance": item.get("stance")}
            rows.append(row)
    rows.sort(key=lambda r: (r["day"], r["code"]))
    usable, excluded_n, excluded_why = leakage.cutoff_report(rows)
    leakage.assert_outcomes_after_decision(usable)
    return usable, {"excludedN": excluded_n, "excludedWhy": excluded_why}


def _by_date(rows):
    grouped = {}
    for row in rows:
        grouped.setdefault(row["day"], []).append(row)
    return grouped


def _action_precision_stat(day_rows):
    hit = n = 0
    for row in day_rows:
        if row.get("ret5") is None or row.get("call") not in ("BUY", "SELL"):
            continue
        verdict = call_hit(row["call"], row["ret5"])
        if verdict is None:
            continue
        n += 1
        hit += verdict
    return (hit / n * 100) if n else None


def report(rows, root=ROOT, closes=None):
    """현재 판단 기록의 성적표. '전체 적중률 하나'가 아니라 다면 지표를 낸다."""
    matured = [r for r in rows if r.get("ret5") is not None]
    regimes = build_market_regimes(closes) if closes else {}
    sectors = load_sectors()
    days = sorted({r["day"] for r in matured})
    calls = {"BUY": [0, 0], "HOLD": [0, 0], "SELL": [0, 0]}   # [hit, n]
    direction = {"BUY": 0, "SELL": 0}
    brier_sum = brier_n = 0
    large_errors = 0
    action_hit = action_n = 0
    sector_err = {}
    regime_keys = set()
    for row in matured:
        call = row.get("call")
        verdict = call_hit(call, row["ret5"])
        if call in calls and verdict is not None:
            calls[call][1] += 1
            calls[call][0] += verdict
        if call in direction:
            direction[call] += 1
            if verdict is not None:
                action_n += 1
                action_hit += verdict
                if verdict == 0 and abs(row["ret5"]) >= LARGE_ERROR_PCT:
                    large_errors += 1
                if verdict == 0:
                    sec = sectors.get(row["code"], "기타")
                    sector_err[sec] = sector_err.get(sec, 0) + 1
        total = row.get("total")
        if total is not None:
            p = max(0.0, min(1.0, float(total) / 100))
            target = 1 if row["ret5"] > 0 else 0
            brier_sum += (p - target) ** 2
            brier_n += 1
        regime = (regimes.get(row["day"]) or {}).get("key")
        if regime:
            regime_keys.add(regime)

    def pct(pair):
        return round(pair[0] / pair[1] * 100, 1) if pair[1] else None

    action_total = direction["BUY"] + direction["SELL"]
    by_date = {d: [r for r in matured if r["day"] == d] for d in days}
    ci = _block_bootstrap_ci(by_date, _action_precision_stat) if len(days) >= 5 else None
    return {
        "semantics": "production_call_hit(deadband=1)",
        "n": len(matured), "uniqueDays": len(days), "regimeCount": len(regime_keys),
        "buy": {"n": calls["BUY"][1], "precisionPct": pct(calls["BUY"])},
        "sell": {"n": calls["SELL"][1], "precisionPct": pct(calls["SELL"])},
        "hold": {"n": calls["HOLD"][1], "hitPct": pct(calls["HOLD"])},
        "actionable": {"n": action_n,
                       "precisionPct": round(action_hit / action_n * 100, 1) if action_n else None,
                       "precisionCi95": ci},
        "coveragePct": round(action_total / len(matured) * 100, 1) if matured else None,
        "directionSharePct": (round(max(direction.values()) / action_total * 100, 1)
                              if action_total else None),
        "brier": round(brier_sum / brier_n, 4) if brier_n else None,
        "largeErrorPct": round(large_errors / action_n * 100, 1) if action_n else None,
        "topErrorSectors": sorted(sector_err.items(), key=lambda kv: -kv[1])[:5],
    }


def simulate_candidate(rows, weights=None, buy_cut=BUY_CUT_BASELINE):
    """가중치/경계 후보를 판단시점 정보만으로 다시 판정한 행을 만든다.

    ⚠️ leakage.decision_view로 결과 필드를 물리적으로 떼고 계산한다.
    """
    out = []
    for row in rows:
        d = leakage.decision_view(row)
        scores = {}
        for analyst in ANALYSTS:
            score = (d.get(analyst) or {}).get("score")
            if score is None:
                break
            scores[analyst] = float(score)
        else:
            w = weights or {a: 0.25 for a in ANALYSTS}
            tot_w = sum(w.values())
            raw = sum(scores[a] * w[a] for a in ANALYSTS) / tot_w
            # 그날 실전이 적용한 위험감점을 그대로 쓴다(재추정 금지).
            penalty = 0.0
            if d.get("rawTotal") is not None and d.get("total") is not None:
                penalty = float(d["rawTotal"]) - float(d["total"])
            total = max(5, min(95, raw - penalty))
            sell_cut = d.get("sellThreshold")
            sell_cut = float(sell_cut) if sell_cut is not None else SELL_CUT_FALLBACK
            call = "BUY" if total >= buy_cut else ("HOLD" if total >= sell_cut else "SELL")
            sim = dict(row)
            sim["call"] = call
            sim["total"] = round(total, 1)
            sim["simulatedBy"] = OFFLINE_SEMANTICS
            out.append(sim)
    return out


def compare(baseline_rows, candidate_rows):
    """같은 데이터·같은 의미로 기준 vs 후보를 비교하고 날짜 블록 CI를 계산한다."""
    base = report(baseline_rows)
    cand = report(candidate_rows)
    base_by_day = _by_date([r for r in baseline_rows if r.get("ret5") is not None])
    cand_by_day = _by_date([r for r in candidate_rows if r.get("ret5") is not None])
    shared_days = sorted(set(base_by_day) & set(cand_by_day))

    def _delta_over_days(day_list):
        # _block_bootstrap_ci가 블록을 평탄화해 넘기므로, 블록 항목을 '날짜'로 두면
        # 재추출된 날짜 목록(중복 포함)이 그대로 들어온다.
        deltas = []
        for day in day_list:
            b = _action_precision_stat(base_by_day[day])
            c = _action_precision_stat(cand_by_day[day])
            if b is not None and c is not None:
                deltas.append(c - b)
        return sum(deltas) / len(deltas) if deltas else None

    ci = (_block_bootstrap_ci({d: [d] for d in shared_days}, _delta_over_days)
          if len(shared_days) >= 5 else None)
    return {"baseline": base, "candidate": cand,
            "sharedDays": len(shared_days),
            "actionPrecisionDeltaPp": (round(cand["actionable"]["precisionPct"] -
                                             base["actionable"]["precisionPct"], 2)
                                       if (cand["actionable"]["precisionPct"] is not None and
                                           base["actionable"]["precisionPct"] is not None) else None),
            "actionPrecisionDeltaCi95": ci,
            "semantics": OFFLINE_SEMANTICS}
