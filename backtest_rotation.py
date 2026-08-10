#!/usr/bin/env python3
"""Build the shadow rotation model using only past-known observations."""

from __future__ import annotations

import argparse
import json
import statistics
from collections import Counter, defaultdict
from pathlib import Path

from compute_rotation import HERE, atomic_write, default_model, load_inputs
from rotation_backtest import compute_lead_lag, find_similar_periods, walk_forward_calibration


def _median(values):
    clean = [value for value in values if value is not None]
    return statistics.median(clean) if clean else 0.0


def _rank_vector(values):
    ordered = sorted(range(len(values)), key=lambda index: (values[index], index))
    ranks = [0.5] * len(values)
    denominator = max(1, len(values) - 1)
    for rank, index in enumerate(ordered):
        ranks[index] = rank / denominator
    return ranks


def build_sector_series(inputs):
    daily = defaultdict(lambda: defaultdict(list))
    for code, rows in inputs["stocks"].items():
        sector = inputs["sectors"][code]
        previous = None
        for row in rows:
            close = row.get("close")
            if previous not in (None, 0) and close is not None:
                daily[sector][row["date"]].append(float(close) / float(previous) - 1)
            if close is not None:
                previous = close
    dates = sorted({day for sector in daily.values() for day in sector})
    sectors = sorted(set(inputs["sectors"].values()))
    return dates, sectors, {
        sector: [_median(daily[sector].get(day, [])) for day in dates]
        for sector in sectors
    }


def _window_return(series, end, horizon):
    start = end - horizon + 1
    if start < 0:
        return None
    value = 1.0
    for change in series[start:end + 1]:
        value *= 1 + change
    return value - 1


def _percent(value):
    return round(float(value) * 100, 2)


def evaluate_horizons(dates, sectors, series, horizons=(1, 3, 5, 20), minimum_samples=40):
    """Walk forward each public horizon separately without borrowing future data."""
    performance = {}
    for horizon in horizons:
        cases = []
        for end in range(horizon - 1, len(dates) - horizon):
            past = [_window_return(series[sector], end, horizon) for sector in sectors]
            future = [_window_return(series[sector], end + horizon, horizon) for sector in sectors]
            if any(value is None for value in past + future):
                continue
            chosen = max(range(len(sectors)), key=lambda index: (past[index], -index))
            benchmark = _median(future)
            excess = future[chosen] - benchmark
            ordered_future = sorted(range(len(sectors)), key=lambda index: future[index], reverse=True)
            adverse = 0.0
            for step in range(1, horizon + 1):
                partial = [_window_return(series[sector], end + step, step) for sector in sectors]
                if all(value is not None for value in partial):
                    adverse = min(adverse, partial[chosen] - _median(partial))
            cases.append({
                "date": dates[end],
                "excess": excess,
                "hit": excess > 0,
                "top3": chosen in ordered_future[:3],
                "adverse": adverse,
            })
        count = len(cases)
        split = max(1, count // 2)
        first = cases[:split]
        second = cases[split:]
        rate = lambda rows: (sum(case["hit"] for case in rows) / len(rows) * 100) if rows else 0.0
        hit_rate = rate(cases)
        stability = max(0.0, 100.0 - abs(rate(first) - rate(second))) if cases else 0.0
        recent = cases[-min(20, count):]
        performance[str(horizon)] = {
            "horizon": horizon,
            "status": "ready" if count >= minimum_samples else "accumulating",
            "sampleCount": count,
            "periodStart": cases[0]["date"] if cases else None,
            "periodEnd": cases[-1]["date"] if cases else None,
            "hitRate": round(hit_rate, 1),
            "top3Rate": round(sum(case["top3"] for case in cases) / count * 100, 1) if count else None,
            "averageExcessReturn": _percent(sum(case["excess"] for case in cases) / count) if count else None,
            "medianExcessReturn": _percent(statistics.median(case["excess"] for case in cases)) if count else None,
            "maximumAdverseExcursion": _percent(min((case["adverse"] for case in cases), default=0.0)),
            "stability": round(stability, 1),
            "recentReproduction": round(rate(recent), 1) if recent else None,
            "benchmark": "500종목 업종 중앙값",
            "definition": f"직전 {horizon}거래일 1위 업종이 이후 {horizon}거래일 업종 중앙값을 초과하면 적중",
            "warning": "일별 신호가 겹치는 중첩 표본이므로 독립 시행 확률로 해석하지 않습니다.",
        }
    return performance


def select_recommended_horizon(performance):
    eligible = [
        dict(row, horizon=int(row.get("horizon") or horizon))
        for horizon, row in (performance or {}).items()
        if row.get("status") == "ready" and (row.get("stability") or 0) >= 60
    ]
    if not eligible:
        return {
            "status": "accumulating", "horizon": None,
            "reason": "표본 수와 구간 안정성이 기준에 도달할 때까지 추천을 보류합니다.",
        }
    best = max(
        eligible,
        key=lambda row: (
            (row.get("hitRate") or 0) + (row.get("averageExcessReturn") or 0) * 2 + (row.get("stability") or 0) * 0.1,
            -(row.get("horizon") or 0),
        ),
    )
    return {
        "status": "ready", "horizon": best["horizon"],
        "reason": f"표본 {best['sampleCount']}회에서 적중률·초과수익·구간 안정성을 함께 비교한 결과입니다.",
    }


def build_walk_forward_cases(dates, sectors, series, lookback=20, outcome_horizon=5):
    history = []
    calibration_records = []
    for end in range(lookback - 1, len(dates) - outcome_horizon):
        past_values = [_window_return(series[sector], end, lookback) for sector in sectors]
        vector = _rank_vector(past_values)
        future_values = [
            _window_return(series[sector], end + outcome_horizon, outcome_horizon)
            for sector in sectors
        ]
        leader_index = max(range(len(sectors)), key=lambda index: past_values[index])
        future_median = _median(future_values)
        success = future_values[leader_index] > future_median
        spread = max(past_values) - _median(past_values)
        confidence = "high" if spread >= 0.08 else "moderate"
        winner_index = max(range(len(sectors)), key=lambda index: future_values[index])
        history.append({
            "date": dates[end],
            "vector": vector,
            "outcome": {
                "leader": sectors[winner_index],
                "return": round(future_values[winner_index] * 100, 2),
                "days": outcome_horizon,
            },
        })
        calibration_records.append({
            "date": dates[end],
            "confidence": confidence,
            "success": success,
        })
    current_values = [_window_return(series[sector], len(dates) - 1, lookback) for sector in sectors]
    current_vector = _rank_vector(current_values)
    return history, calibration_records, current_vector


def build_shadow_model(root=HERE):
    inputs = load_inputs(root)
    dates, sectors, series = build_sector_series(inputs)
    model = default_model()
    if len(dates) < 80:
        model["warnings"] = ["과거 거래일이 부족해 교정 자료를 더 모으고 있습니다."]
        return model

    edges = compute_lead_lag(series, max_lag=20, min_pairs=60)
    history, records, current_vector = build_walk_forward_cases(dates, sectors, series)
    similar = find_similar_periods(history, current_vector, dates[-1], embargo_days=30, top_n=5)
    calibration = walk_forward_calibration(records, minimum_per_group=60)
    horizon_performance = evaluate_horizons(dates, sectors, series, minimum_samples=40)
    recommended_horizon = select_recommended_horizon(horizon_performance)

    lead_strength = Counter()
    for edge in edges:
        lead_strength[edge["leader"]] += edge["correlation"]
        lead_strength[edge["lagger"]] -= edge["correlation"] * 0.5
    strengths = [lead_strength[sector] for sector in sectors]
    ranked_strength = _rank_vector(strengths)
    lead_lag_scores = {
        sector: {str(horizon): round(35 + ranked_strength[index] * 30, 1) for horizon in (1, 3, 5, 20)}
        for index, sector in enumerate(sectors)
    }

    winners = Counter(case["outcome"]["leader"] for case in similar)
    similarity_scores = {
        sector: {str(horizon): round(45 + min(3, winners[sector]) * 6, 1) for horizon in (1, 3, 5, 20)}
        for sector in sectors
    }
    model.update({
        "calibratedThrough": dates[-1],
        "calibration": calibration,
        "leadLagScores": lead_lag_scores,
        "similarityScores": similarity_scores,
        "leadLagEdges": edges,
        "similarMarkets": {
            "status": "ready" if len(similar) >= 3 else "accumulating",
            "cases": similar,
            "embargoDays": 30,
        },
        "horizonPerformance": horizon_performance,
        "recommendedHorizon": recommended_horizon,
        "metrics": {
            "historyStart": dates[0],
            "historyEnd": dates[-1],
            "tradingDays": len(dates),
            "walkForwardEvaluations": calibration["evaluations"],
        },
        "warnings": [
            "Lead-Lag는 인과관계가 아닌 탐색 참고 정보입니다.",
            "높은 신뢰도는 과거 검증에서 중간 신뢰도를 앞설 때만 열립니다.",
        ],
    })
    return model


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=str(HERE))
    args = parser.parse_args(argv)
    root = Path(args.root)
    model = build_shadow_model(root)
    atomic_write(root / "rotation_model.json", json.dumps(model, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    metrics = model.get("metrics") or {}
    print(
        f"rotation backtest: {metrics.get('tradingDays', 0)}일, "
        f"{metrics.get('walkForwardEvaluations', 0)}회, "
        f"high={'open' if model['calibration'].get('highOutperformsModerate') else 'locked'}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
