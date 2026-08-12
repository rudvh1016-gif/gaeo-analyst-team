#!/usr/bin/env python3
"""Leakage-safe historical checks for the GAEO rotation model."""

from __future__ import annotations

import math
from datetime import date


def _pearson(left, right):
    pairs = [(float(a), float(b)) for a, b in zip(left, right) if a is not None and b is not None]
    if len(pairs) < 3:
        return 0.0
    xs, ys = zip(*pairs)
    x_mean = sum(xs) / len(xs)
    y_mean = sum(ys) / len(ys)
    numerator = sum((x - x_mean) * (y - y_mean) for x, y in pairs)
    x_scale = math.sqrt(sum((x - x_mean) ** 2 for x in xs))
    y_scale = math.sqrt(sum((y - y_mean) ** 2 for y in ys))
    return numerator / (x_scale * y_scale) if x_scale and y_scale else 0.0


def compute_lead_lag(series_by_sector, max_lag=20, min_pairs=60, min_correlation=0.25):
    """Return stable exploratory links where the leader moves before the lagger."""
    names = sorted(series_by_sector)
    candidates = []
    for leader in names:
        for lagger in names:
            if leader == lagger:
                continue
            left = list(series_by_sector[leader])
            right = list(series_by_sector[lagger])
            best = None
            for lag in range(1, max_lag + 1):
                count = min(len(left), len(right)) - lag
                if count < min_pairs:
                    continue
                x = left[:count]
                y = right[lag:lag + count]
                correlation = _pearson(x, y)
                midpoint = count // 2
                first = _pearson(x[:midpoint], y[:midpoint])
                second = _pearson(x[midpoint:], y[midpoint:])
                stable = first * second > 0 and min(abs(first), abs(second)) >= min_correlation * 0.6
                candidate = (abs(correlation), correlation, lag, stable, count)
                if best is None or candidate[0] > best[0]:
                    best = candidate
            if best and best[1] >= min_correlation and best[3]:
                candidates.append({
                    "leader": leader,
                    "lagger": lagger,
                    "lagDays": best[2],
                    "correlation": round(best[1], 3),
                    "observations": best[4],
                    "status": "exploratory",
                })
    candidates.sort(key=lambda item: (-item["correlation"], item["lagDays"], item["leader"], item["lagger"]))
    selected = []
    used_pairs = set()
    for item in candidates:
        pair = frozenset((item["leader"], item["lagger"]))
        if pair in used_pairs:
            continue
        used_pairs.add(pair)
        selected.append(item)
    return selected[:12]


def find_similar_periods(history, current_vector, current_date, embargo_days=30, top_n=5):
    """Find prior states with known outcomes, excluding the recent embargo window."""
    cutoff = date.fromisoformat(current_date)
    ranked = []
    for row in history:
        if row.get("outcome") is None or not row.get("vector"):
            continue
        row_date = date.fromisoformat(row["date"])
        if (cutoff - row_date).days < embargo_days:
            continue
        vector = row["vector"]
        if len(vector) != len(current_vector):
            continue
        distance = math.sqrt(sum((float(a) - float(b)) ** 2 for a, b in zip(vector, current_vector)))
        ranked.append({
            "date": row["date"],
            "distance": round(distance, 4),
            "outcome": row["outcome"],
            "sectorOutcomes": row.get("sectorOutcomes") or {},
            "benchmarkReturn": row.get("benchmarkReturn"),
        })
    ranked.sort(key=lambda item: (item["distance"], item["date"]))
    return ranked[:top_n]


def walk_forward_calibration(records, minimum_per_group=30, minimum_gap=0.05):
    """Unlock high confidence only after it beats moderate out of sample."""
    groups = {"high": [], "moderate": []}
    for record in sorted(records, key=lambda item: item.get("date", "")):
        confidence = record.get("confidence")
        if confidence in groups and record.get("success") is not None:
            groups[confidence].append(bool(record["success"]))
    rates = {
        name: (sum(values) / len(values) if values else None)
        for name, values in groups.items()
    }
    enough = all(len(groups[name]) >= minimum_per_group for name in groups)
    unlocked = bool(enough and rates["high"] >= rates["moderate"] + minimum_gap)
    return {
        "evaluations": sum(len(values) for values in groups.values()),
        "groups": {
            name: {"count": len(values), "successRate": round(rates[name], 4) if rates[name] is not None else None}
            for name, values in groups.items()
        },
        "highOutperformsModerate": unlocked,
        "status": "calibrated" if enough else "accumulating",
        "minimumPerGroup": minimum_per_group,
        "minimumGap": minimum_gap,
    }
