#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""종합판단 v3 학습·감사·그림자 평가 데이터 생성.

외부 API 없이 history.js와 analysis_data.json만 사용한다.
실제 서비스 판단을 바로 교체하지 않고, 시간순 홀드아웃에서 기준을 통과한 경우에만
promotion.qualified=True를 내보낸다. analyze_auto.py는 이 값이 참일 때만 v3를 승격한다.
"""
import datetime
import json
import math
import os
import re
import statistics

HERE = os.path.dirname(os.path.abspath(__file__))
ANALYSTS = ("taro", "diana", "nova", "flow")
RULES = {
    "taro": {"days": 5, "deadband": 1.0},
    "diana": {"days": 20, "deadband": 3.0},
    "nova": {"days": 5, "deadband": 1.0},
    "flow": {"days": 5, "deadband": 1.0},
}
BASE_WEIGHTS = {"taro": .30, "diana": .12, "nova": .28, "flow": .30}
CAL_PRIOR_N = 30
MIN_CAL_N = 20
MIN_REGIME_N = 80


def load_js(path, varname):
    if not os.path.exists(path):
        return None
    text = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
    match = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", text, re.S)
    return json.loads(match.group(1)) if match else None


def load_sectors():
    text = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
    match = re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", text, re.S)
    rows = json.loads(match.group(1)) if match else []
    return {row["code"]: row.get("sector") or "기타" for row in rows}


def clamp(value, low, high):
    return max(low, min(high, value))


def score_bin(score):
    value = int(clamp(float(50 if score is None else score), 0, 100))
    return str(min(90, value // 10 * 10))


def stance_hit(stance, ret, deadband):
    if stance == "bull":
        return 1 if ret > deadband else (0 if ret < -deadband else None)
    if stance == "bear":
        return 1 if ret < -deadband else (0 if ret > deadband else None)
    return None


def call_hit(call, ret):
    if call == "BUY":
        return 1 if ret > 1 else (0 if ret < -1 else None)
    if call == "SELL":
        return 1 if ret < -1 else (0 if ret > 1 else None)
    return 1 if abs(ret) <= 5 else 0


def build_market_regimes(closes):
    """500종목 단면 중앙값으로 날짜별 시장 추세·변동성 국면을 만든다."""
    by_date = {}
    abs_daily = {}
    daily_returns = {}
    for rows in closes.values():
        for i, row in enumerate(rows):
            day = row["date"]
            if i >= 5 and rows[i - 5]["close"]:
                by_date.setdefault(day, []).append((row["close"] / rows[i - 5]["close"] - 1) * 100)
            if i >= 1 and rows[i - 1]["close"]:
                ret1 = (row["close"] / rows[i - 1]["close"] - 1) * 100
                abs_daily.setdefault(day, []).append(abs(ret1))
                daily_returns.setdefault(day, []).append(ret1)
    daily_vols = [statistics.median(values) for values in abs_daily.values() if values]
    vol_cut = statistics.median(daily_vols) if daily_vols else 2.0
    regimes = {}
    for day, values in by_date.items():
        trend_value = statistics.median(values)
        trend = "up" if trend_value > 1 else ("down" if trend_value < -1 else "side")
        vol_value = statistics.median(abs_daily.get(day) or [0])
        vol = "high" if vol_value > vol_cut else "low"
        values1 = daily_returns.get(day) or []
        regimes[day] = {"key": f"{trend}_{vol}", "trend": trend, "vol": vol,
                        "median5": round(trend_value, 2), "medianAbs1": round(vol_value, 2),
                        "advanceRatio5": round(sum(value > 0 for value in values) / len(values) * 100, 1),
                        "medianRet1": round(statistics.median(values1), 2) if values1 else 0.0,
                        "advanceRatio1": round(sum(value > 0 for value in values1) / len(values1) * 100, 1) if values1 else 0.0}
    return regimes


def rebound_guard_eligible(row, regime):
    """Only pause a SELL when the same-day market data confirms a broad rebound.

    All fields are available on the decision day; the forward return is used only
    for evaluation, so this remains a walk-forward test without look-ahead.
    """
    taro = row.get("taro") or {}
    nova = row.get("nova") or {}
    return (
        row.get("call") == "SELL"
        and taro.get("stance") == "bear"
        and nova.get("stance") == "bear"
        and regime.get("trend") == "up"
        and regime.get("vol") == "high"
        and float(regime.get("median5") or 0) >= 2.0
        and float(regime.get("advanceRatio5") or 0) >= 60.0
        and float(regime.get("medianRet1") or 0) >= 0.5
        and float(regime.get("advanceRatio1") or 0) >= 55.0
    )


def evaluate_rebound_guard(rows, regimes):
    """Evaluate the baseline and the SELL→HOLD guard over every matured row."""
    baseline = {"hit": 0, "miss": 0, "mid": 0}
    guarded = {"hit": 0, "miss": 0, "mid": 0}
    guarded_n = 0
    days = set()
    for row in rows:
        ret = row.get("ret5")
        if ret is None:
            continue
        days.add(row.get("day"))
        base_verdict = call_hit(row.get("call"), ret)
        if base_verdict == 1:
            baseline["hit"] += 1
        elif base_verdict == 0:
            baseline["miss"] += 1
        else:
            baseline["mid"] += 1
        changed = rebound_guard_eligible(row, regimes.get(row.get("day")) or {})
        call = "HOLD" if changed else row.get("call")
        if changed:
            guarded_n += 1
        verdict = call_hit(call, ret)
        if verdict == 1:
            guarded["hit"] += 1
        elif verdict == 0:
            guarded["miss"] += 1
        else:
            guarded["mid"] += 1

    def with_accuracy(stats):
        decided = stats["hit"] + stats["miss"]
        return {**stats, "accuracy": round(stats["hit"] / decided * 100, 1) if decided else None}

    return {"n": sum(baseline.values()), "days": len(days), "guardedN": guarded_n,
            "baseline": with_accuracy(baseline), "guarded": with_accuracy(guarded)}


def calibration_from(rows):
    out = {a: {} for a in ANALYSTS}
    global_counts = {a: [0, 0] for a in ANALYSTS}
    for row in rows:
        for analyst in ANALYSTS:
            item = row.get(analyst)
            if not isinstance(item, dict) or item.get("target") is None:
                continue
            key = score_bin(item.get("score"))
            bucket = out[analyst].setdefault(key, {"n": 0, "up": 0})
            bucket["n"] += 1
            bucket["up"] += int(item["target"] > 0)
            global_counts[analyst][0] += 1
            global_counts[analyst][1] += int(item["target"] > 0)
    for analyst in ANALYSTS:
        n_all, up_all = global_counts[analyst]
        base = up_all / n_all if n_all else .5
        ordered = []
        for key in map(str, range(0, 100, 10)):
            bucket = out[analyst].setdefault(key, {"n": 0, "up": 0})
            raw = bucket["up"] / bucket["n"] if bucket["n"] else None
            probability = (bucket["up"] + CAL_PRIOR_N * base) / (bucket["n"] + CAL_PRIOR_N)
            bucket.update({"raw": round(raw, 4) if raw is not None else None,
                           "uncalibratedPUp": round(probability, 4), "base": round(base, 4)})
            ordered.append({"keys": [key], "weight": bucket["n"] + CAL_PRIOR_N,
                            "value": probability})
        # Merge probability inversions with weighted PAVA so higher scores never
        # imply a lower calibrated up probability merely due to sample noise.
        blocks = []
        for block in ordered:
            blocks.append(block)
            while len(blocks) >= 2 and blocks[-2]["value"] > blocks[-1]["value"]:
                right = blocks.pop()
                left = blocks.pop()
                weight = left["weight"] + right["weight"]
                blocks.append({"keys": left["keys"] + right["keys"], "weight": weight,
                               "value": (left["value"] * left["weight"] +
                                         right["value"] * right["weight"]) / weight})
        for block in blocks:
            for key in block["keys"]:
                out[analyst][key]["pUp"] = round(block["value"], 4)
    return out


def calibrated_p(calibration, analyst, score):
    bucket = (calibration.get(analyst) or {}).get(score_bin(score)) or {}
    if bucket.get("n", 0) < MIN_CAL_N:
        return .5 + (float(50 if score is None else score) - 50) / 250
    return float(bucket.get("pUp", .5))


CONF_PRIOR_N = 20
MIN_CONF_CAL_N = 15


def confidence_bin(total):
    value = int(clamp(float(50 if total is None else total), 0, 100))
    return str(value // 5 * 5)


def confidence_calibration_from(rows):
    """판단 종류(BUY/SELL)·종합점수 구간별 실제 5거래일 뒤 적중률을 그대로 잰다.
    「신뢰도」를 분석가 의견 일치도(spread)가 아니라 실측 성적으로 정의하는 대안 후보.
    PAVA로 "점수가 더 극단적인데 실측 적중률은 오히려 더 낮다"는 표본 노이즈성 역전을
    눌러, 더 강한 판단일수록 최소한 같거나 더 잘 맞아야 한다는 단조성을 강제한다."""
    out = {"BUY": {}, "SELL": {}}
    global_counts = {"BUY": [0, 0], "SELL": [0, 0]}
    for row in rows:
        call = row.get("call")
        if call not in ("BUY", "SELL"):
            continue
        ret = row.get("ret5")
        if ret is None:
            continue
        verdict = call_hit(call, ret)
        if verdict is None:
            continue
        bucket = out[call].setdefault(confidence_bin(row.get("total")), {"n": 0, "hit": 0})
        bucket["n"] += 1
        bucket["hit"] += verdict
        global_counts[call][0] += 1
        global_counts[call][1] += verdict
    for call in ("BUY", "SELL"):
        n_all, hit_all = global_counts[call]
        base = hit_all / n_all if n_all else .5
        # BUY는 점수가 높을수록, SELL은 점수가 낮을수록 "더 강한 판단"이므로
        # 그 방향을 앞쪽에 두고 정렬해야 PAVA가 올바른 방향으로 단조성을 강제한다.
        keys_sorted = sorted(out[call].keys(), key=lambda k: int(k), reverse=(call == "BUY"))
        blocks = []
        for key in keys_sorted:
            bucket = out[call].setdefault(key, {"n": 0, "hit": 0})
            raw = bucket["hit"] / bucket["n"] if bucket["n"] else None
            prob = (bucket["hit"] + CONF_PRIOR_N * base) / (bucket["n"] + CONF_PRIOR_N)
            bucket.update({"raw": round(raw, 4) if raw is not None else None,
                           "uncalibratedAcc": round(prob, 4), "base": round(base, 4)})
            blocks.append({"keys": [key], "weight": bucket["n"] + CONF_PRIOR_N, "value": prob})
        merged = []
        for block in blocks:
            merged.append(block)
            while len(merged) >= 2 and merged[-2]["value"] < merged[-1]["value"]:
                right = merged.pop()
                left = merged.pop()
                weight = left["weight"] + right["weight"]
                merged.append({"keys": left["keys"] + right["keys"], "weight": weight,
                               "value": (left["value"] * left["weight"] + right["value"] * right["weight"]) / weight})
        for block in merged:
            for key in block["keys"]:
                out[call][key]["calibratedAcc"] = round(block["value"], 4)
    return out


def confidence_candidate(calibration, call, total):
    """confidence_calibration_from 학습 결과로 특정 판단의 실측 기반 신뢰도 후보값을
    계산한다. 표본이 모자란 구간은 None을 돌려줘 호출부가 기존(의견 일치도) 신뢰도로
    폴백하게 한다."""
    if call not in ("BUY", "SELL"):
        return None
    bucket = (calibration.get(call) or {}).get(confidence_bin(total)) or {}
    if bucket.get("n", 0) < MIN_CONF_CAL_N:
        return None
    acc = bucket.get("calibratedAcc")
    if acc is None:
        return None
    return int(clamp(round(25 + acc * 65), 25, 90))


def pearson(xs, ys):
    n = len(xs)
    if n < 2:
        return 0.0
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx2 = sum((x - mx) ** 2 for x in xs)
    dy2 = sum((y - my) ** 2 for y in ys)
    return num / math.sqrt(dx2 * dy2) if dx2 and dy2 else 0.0


def evaluate_confidence_model(test_rows, calibration, regimes):
    """검증(test) 구간에서 "실측 신뢰도 후보"가 기존(의견 일치도) 신뢰도보다 실제
    적중 여부를 더 잘 가르는지 정직하게 확인한다. 계산 자체에 쓰지 않은 구간에서만
    판단해야 과최적화(overfitting)를 스스로 속이지 않는다."""
    pairs = []
    for row in test_rows:
        call = row.get("call")
        if call not in ("BUY", "SELL"):
            continue
        ret = row.get("ret5")
        if ret is None:
            continue
        verdict = call_hit(call, ret)
        if verdict is None:
            continue
        pairs.append({"call": call, "hit": verdict, "day": row.get("day"),
                      "candidate": confidence_candidate(calibration, call, row.get("total")),
                      "baseline": row.get("confidence")})

    def tier_spread(key):
        vals = [(p[key], p["hit"]) for p in pairs if p[key] is not None]
        if len(vals) < 20:
            return {"n": len(vals), "tierSpreadPp": None, "corr": None}
        vals.sort(key=lambda x: x[0])
        third = max(1, len(vals) // 3)
        low, high = vals[:third], vals[-third:]
        low_acc = sum(v[1] for v in low) / len(low) * 100
        high_acc = sum(v[1] for v in high) / len(high) * 100
        corr = pearson([v[0] for v in vals], [v[1] for v in vals])
        return {"n": len(vals), "tierSpreadPp": round(high_acc - low_acc, 1), "corr": round(corr, 4)}

    buy_n = sum(1 for p in pairs if p["call"] == "BUY")
    sell_n = sum(1 for p in pairs if p["call"] == "SELL")
    test_days = len({p["day"] for p in pairs})
    test_regimes = len({(regimes.get(p["day"]) or {}).get("key") for p in pairs if regimes.get(p["day"])})
    return {
        "n": len(pairs), "buyN": buy_n, "sellN": sell_n,
        "testDays": test_days, "testRegimes": test_regimes,
        "candidate": tier_spread("candidate"), "baseline": tier_spread("baseline"),
    }


def error_correlations(rows):
    pairs = {}
    penalties = {a: 1.0 for a in ANALYSTS}
    for i, left in enumerate(ANALYSTS):
        for right in ANALYSTS[i + 1:]:
            xy = []
            for row in rows:
                a, b = row.get(left), row.get(right)
                if isinstance(a, dict) and isinstance(b, dict) and a.get("hit") is not None and b.get("hit") is not None:
                    xy.append((1 - a["hit"], 1 - b["hit"]))
            corr = 0.0
            if len(xy) >= 30:
                xs, ys = zip(*xy)
                mx, my = statistics.mean(xs), statistics.mean(ys)
                vx = sum((x - mx) ** 2 for x in xs)
                vy = sum((y - my) ** 2 for y in ys)
                if vx and vy:
                    corr = sum((x - mx) * (y - my) for x, y in xy) / math.sqrt(vx * vy)
            pairs[f"{left}:{right}"] = {"n": len(xy), "errorCorr": round(corr, 3)}
            if corr > .15:
                reduction = min(.10, (corr - .15) * .12)
                penalties[left] -= reduction / 2
                penalties[right] -= reduction / 2
    return pairs, {a: round(clamp(v, .82, 1), 4) for a, v in penalties.items()}


def regime_weights(rows, regimes, global_weights):
    counts = {}
    for row in rows:
        regime = (regimes.get(row["day"]) or {}).get("key")
        if not regime:
            continue
        table = counts.setdefault(regime, {a: [0, 0] for a in ANALYSTS})
        for analyst in ANALYSTS:
            hit = (row.get(analyst) or {}).get("hit")
            if hit is not None:
                table[analyst][0] += 1
                table[analyst][1] += hit
    result = {}
    for regime, table in counts.items():
        raw = {}
        stats = {}
        for analyst in ANALYSTS:
            n, hits = table[analyst]
            adj = (hits + 60 * .5) / (n + 60)
            raw[analyst] = global_weights[analyst] * math.exp(2 * (adj - .5))
            stats[analyst] = {"n": n, "adjustedAcc": round(adj * 100, 1)}
        total_n = sum(v[0] for v in table.values())
        total = sum(raw.values()) or 1
        local = {a: raw[a] / total for a in ANALYSTS}
        blend = min(.6, total_n / (total_n + 800)) if total_n >= MIN_REGIME_N else 0
        weights = {a: global_weights[a] * (1 - blend) + local[a] * blend for a in ANALYSTS}
        norm = sum(weights.values()) or 1
        result[regime] = {"n": total_n, "blend": round(blend, 3),
                          "weights": {a: round(weights[a] / norm, 4) for a in ANALYSTS}, "acc": stats}
    return result


def ensemble_probability(row, calibration, weights, redundancy, regime_table, regimes):
    regime = (regimes.get(row["day"]) or {}).get("key")
    use_weights = (regime_table.get(regime) or {}).get("weights") or weights
    adjusted = {a: use_weights.get(a, BASE_WEIGHTS[a]) * redundancy.get(a, 1) for a in ANALYSTS}
    total = sum(adjusted.values()) or 1
    probability = 0.0
    for analyst in ANALYSTS:
        score = (row.get(analyst) or {}).get("score", 50)
        probability += calibrated_p(calibration, analyst, score) * adjusted[analyst] / total
    return clamp(probability, .05, .95)


def evaluate(rows, calibration, weights, redundancy, regime_table, regimes):
    baseline_actions = [0, 0]
    candidate_actions = [0, 0]
    candidate_all = [0, 0]
    brier = 0.0
    raw_brier = 0.0
    evaluated = 0
    candidate_calls = {"BUY": 0, "HOLD": 0, "SELL": 0}
    evaluated_days = set()
    evaluated_regimes = set()
    for row in rows:
        ret = row.get("ret5")
        if ret is None:
            continue
        target = 1 if ret > 0 else 0
        p = ensemble_probability(row, calibration, weights, redundancy, regime_table, regimes)
        raw_p = sum(float((row.get(a) or {}).get("score", 50)) * weights.get(a, BASE_WEIGHTS[a]) for a in ANALYSTS) / 100
        raw_p /= sum(weights.values()) or 1
        brier += (p - target) ** 2
        raw_brier += (raw_p - target) ** 2
        evaluated += 1
        evaluated_days.add(row["day"])
        regime_key = (regimes.get(row["day"]) or {}).get("key")
        if regime_key: evaluated_regimes.add(regime_key)
        base_call = row.get("call")
        if base_call in ("BUY", "SELL") and abs(ret) > 1:
            baseline_actions[1] += 1
            baseline_actions[0] += int((base_call == "BUY" and ret > 1) or (base_call == "SELL" and ret < -1))
        candidate_call = "BUY" if p >= .62 else ("SELL" if p <= .38 else "HOLD")
        candidate_calls[candidate_call] += 1
        candidate_all[1] += 1
        candidate_all[0] += int(call_hit(candidate_call, ret) == 1)
        if candidate_call in ("BUY", "SELL") and abs(ret) > 1:
            candidate_actions[1] += 1
            candidate_actions[0] += int((candidate_call == "BUY" and ret > 1) or (candidate_call == "SELL" and ret < -1))
    def ratio(pair):
        return round(pair[0] / pair[1] * 100, 1) if pair[1] else None
    return {
        "n": evaluated,
        "baselineActionN": baseline_actions[1], "baselineActionPrecision": ratio(baseline_actions),
        "candidateActionN": candidate_actions[1], "candidateActionPrecision": ratio(candidate_actions),
        "candidateCoverage": round(candidate_actions[1] / evaluated * 100, 1) if evaluated else 0,
        "candidateCalls": candidate_calls,
        "testDays": len(evaluated_days), "testRegimes": len(evaluated_regimes),
        "candidateAllCallAccuracy": ratio(candidate_all),
        "brier": round(brier / evaluated, 4) if evaluated else None,
        "rawBrier": round(raw_brier / evaluated, 4) if evaluated else None,
    }


def evaluate_archived_shadow(rows, regimes):
    """Forward-test only v3 decisions saved by the real daily pipeline."""
    baseline_actions = [0, 0]
    candidate_actions = [0, 0]
    calls = {"BUY": 0, "HOLD": 0, "SELL": 0}
    evaluated = 0
    brier = 0.0
    raw_brier = 0.0
    probability_n = 0
    days = set()
    regime_keys = set()
    for row in rows:
        ret = row.get("ret5")
        shadow = row.get("archivedShadow")
        if ret is None or not isinstance(shadow, dict):
            continue
        call = shadow.get("call")
        if call not in calls:
            continue
        evaluated += 1
        calls[call] += 1
        days.add(row["day"])
        regime = shadow.get("regime") or (regimes.get(row["day"]) or {}).get("key")
        if regime:
            regime_keys.add(regime)
        if row.get("call") in ("BUY", "SELL") and abs(ret) > 1:
            baseline_actions[1] += 1
            baseline_actions[0] += int((row["call"] == "BUY" and ret > 1) or
                                       (row["call"] == "SELL" and ret < -1))
        if call in ("BUY", "SELL") and abs(ret) > 1:
            candidate_actions[1] += 1
            candidate_actions[0] += int((call == "BUY" and ret > 1) or
                                        (call == "SELL" and ret < -1))
        probability = shadow.get("probabilityUp")
        if probability is not None:
            p = float(probability)
            if p > 1:
                p /= 100
            p = clamp(p, 0, 1)
            target = 1 if ret > 0 else 0
            brier += (p - target) ** 2
            raw_p = clamp(float(row.get("total") or 50) / 100, 0, 1)
            raw_brier += (raw_p - target) ** 2
            probability_n += 1

    def ratio(pair):
        return round(pair[0] / pair[1] * 100, 1) if pair[1] else None

    return {
        "n": evaluated,
        "baselineActionN": baseline_actions[1],
        "baselineActionPrecision": ratio(baseline_actions),
        "candidateActionN": candidate_actions[1],
        "candidateActionPrecision": ratio(candidate_actions),
        "candidateCoverage": round(candidate_actions[1] / evaluated * 100, 1) if evaluated else 0,
        "candidateCalls": calls,
        "testDays": len(days),
        "testRegimes": len(regime_keys),
        "brier": round(brier / probability_n, 4) if probability_n else None,
        "rawBrier": round(raw_brier / probability_n, 4) if probability_n else None,
    }


def audit(rows, regimes):
    errors = []
    analyst_errors = {a: 0 for a in ANALYSTS}
    regime_errors = {}
    patterns = {"경계점수 판단": 0, "분석가 의견충돌": 0, "3인 이상 같은 방향 오판": 0,
                "고변동성 국면": 0}
    for row in rows:
        ret = row.get("ret5")
        verdict = call_hit(row.get("call"), ret) if ret is not None else None
        if verdict != 0:
            continue
        errors.append(row)
        total = float(row.get("total") or 50)
        if 43 <= total <= 67:
            patterns["경계점수 판단"] += 1
        scores = [float((row.get(a) or {}).get("score", 50)) for a in ANALYSTS]
        if max(scores) - min(scores) >= 30:
            patterns["분석가 의견충돌"] += 1
        stances = [(row.get(a) or {}).get("stance") for a in ANALYSTS]
        if max(stances.count("bull"), stances.count("bear")) >= 3:
            patterns["3인 이상 같은 방향 오판"] += 1
        regime = (regimes.get(row["day"]) or {}).get("key", "unknown")
        regime_errors[regime] = regime_errors.get(regime, 0) + 1
        if regime.endswith("_high"):
            patterns["고변동성 국면"] += 1
        for analyst in ANALYSTS:
            if (row.get(analyst) or {}).get("hit") == 0:
                analyst_errors[analyst] += 1
    ordered = sorted(patterns.items(), key=lambda item: item[1], reverse=True)
    return {"matured": sum(row.get("ret5") is not None for row in rows), "errors": len(errors),
            "patterns": [{"label": label, "count": count} for label, count in ordered],
            "analystErrors": analyst_errors,
            "regimeErrors": dict(sorted(regime_errors.items(), key=lambda item: item[1], reverse=True))}


def main():
    history = load_js(os.path.join(HERE, "history.js"), "LIVE_HISTORY") or {}
    weights_doc = load_js(os.path.join(HERE, "team_weights.js"), "TEAM_WEIGHTS") or {}
    raw = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
    global_weights = ((weights_doc.get("global") or {}).get("weights") or BASE_WEIGHTS)
    closes = {}
    for code, stock in (raw.get("stocks") or {}).items():
        rows = sorted((row for row in (stock.get("daily") or []) if row.get("date") and row.get("close")),
                      key=lambda row: row["date"])
        closes[code] = rows
    regimes = build_market_regimes(closes)

    def forward_return(code, day, base, days):
        after = [row for row in closes.get(code, []) if row["date"] > day]
        if not base or len(after) < days:
            return None
        return (after[days - 1]["close"] / base - 1) * 100

    rows = []
    for code, entries in history.items():
        if not isinstance(entries, list):
            continue
        for entry in entries:
            day = str(entry.get("date", ""))[:10]
            base = entry.get("base")
            if not day or not base:
                continue
            row = {"code": code, "day": day, "call": entry.get("call"),
                   "total": entry.get("total"), "confidence": entry.get("confidence"),
                   "ret5": forward_return(code, day, base, 5),
                   "archivedShadow": entry.get("shadow")}
            for analyst in ANALYSTS:
                item = entry.get(analyst) or {}
                ret = forward_return(code, day, base, RULES[analyst]["days"])
                row[analyst] = {"score": item.get("score", 50), "stance": item.get("stance"),
                                "target": ret, "hit": stance_hit(item.get("stance"), ret, RULES[analyst]["deadband"]) if ret is not None else None}
            rows.append(row)
    rows.sort(key=lambda row: (row["day"], row["code"]))
    # 같은 날짜 종목이 학습·검증 양쪽에 갈라지지 않게 날짜 단위로 자른다.
    # 5거래일 예측 결과가 검증 시작 구간에 겹치지 않도록 날짜 5개를 embargo로 비운다.
    unique_days = sorted({row["day"] for row in rows})
    split_at = max(1, int(len(unique_days) * .7))
    train_days = set(unique_days[:max(1, split_at - 5)])
    test_days = set(unique_days[split_at:])
    train = [row for row in rows if row["day"] in train_days]
    test = [row for row in rows if row["day"] in test_days]
    calibration = calibration_from(train)
    correlations, redundancy = error_correlations(train)
    regimes_table = regime_weights(train, regimes, global_weights)
    metrics = evaluate(test, calibration, global_weights, redundancy, regimes_table, regimes)
    prospective = evaluate_archived_shadow(rows, regimes)
    rebound_guard = evaluate_rebound_guard(rows, regimes)
    guard_baseline = rebound_guard["baseline"].get("accuracy")
    guard_result = rebound_guard["guarded"].get("accuracy")
    # A fixed safety rule is allowed into the live baseline only after the full
    # archived walk-forward set shows no loss of decision accuracy and enough
    # affected observations to make the comparison meaningful.
    rebound_guard["active"] = bool(
        rebound_guard["guardedN"] >= 30 and guard_baseline is not None and
        guard_result is not None and guard_result >= guard_baseline
    )
    rebound_guard["policy"] = {
        "sellThreshold": 40,
        "minAffectedN": 30,
        "conditions": "high-volatility broad rebound + TARO/QUANT both bear",
    }
    base_precision = prospective.get("baselineActionPrecision")
    candidate_precision = prospective.get("candidateActionPrecision")
    reasons = []
    if prospective["n"] < 500: reasons.append("실제 그림자 누적 표본 500건 미만")
    if prospective["candidateActionN"] < 100: reasons.append("실제 그림자 BUY·SELL 표본 100건 미만")
    if base_precision is None or candidate_precision is None or candidate_precision < base_precision + 1.5:
        reasons.append("실제 그림자 행동 정밀도 개선폭 1.5%p 미만")
    if (prospective.get("brier") is None or prospective.get("rawBrier") is None or
            prospective["brier"] > prospective["rawBrier"] - .005):
        reasons.append("실제 그림자 확률오차(Brier) 개선폭 0.005 미만")
    if prospective.get("candidateCoverage", 0) < 15: reasons.append("실제 그림자 BUY·SELL 커버리지 15% 미만")
    if prospective.get("testDays", 0) < 40: reasons.append("실제 그림자 검증일 40거래일 미만")
    if prospective.get("testRegimes", 0) < 3: reasons.append("실제 그림자 시장국면 3개 미만")
    call_counts = prospective.get("candidateCalls") or {}
    if call_counts.get("BUY", 0) < 50 or call_counts.get("SELL", 0) < 50:
        reasons.append("BUY·SELL 양방향 검증 표본 각각 50건 미만")
    action_total = call_counts.get("BUY", 0) + call_counts.get("SELL", 0)
    if action_total and max(call_counts.get("BUY", 0), call_counts.get("SELL", 0)) / action_total > .8:
        reasons.append("후보 판단이 한 방향에 80% 초과 편중")
    qualified = not reasons
    current_regime = regimes[max(regimes)] if regimes else {"key": "unknown"}

    # ⭐ 2026-08-14: 표시되는 "신뢰도"가 사실 분석가 4인의 의견 일치도(spread)만 재는
    # 식이라 BUY 판단에서는 실제 적중률과 거의 무관하다는 게 드러났다(상관계수 0.10
    # 안팎). 대안으로 "판단 종류·종합점수 구간별 실측 적중률"을 신뢰도로 쓰는 후보를
    # 학습(train)에서만 만들고, 학습에 전혀 쓰지 않은 검증(test) 구간에서 기존 신뢰도와
    # 어느 쪽이 적중 여부를 더 잘 가르는지(구간별 적중률 스프레드·상관계수) 비교한다.
    # v3·reboundGuard·순환매와 동일한 원칙 — 검증을 통과하기 전에는 화면에 보이는
    # 신뢰도를 바꾸지 않는다. 표본이 이 정도(20여 거래일)로는 어떤 공식이든 신뢰도
    # 있게 승격 판정을 내리기엔 부족하므로, 최소 표본 기준 미달이면 절대 승격하지 않는다.
    confidence_calibration = confidence_calibration_from(train)
    confidence_eval = evaluate_confidence_model(test, confidence_calibration, regimes)
    conf_reasons = []
    if confidence_eval["testDays"] < 40:
        conf_reasons.append("검증일 40거래일 미만")
    if confidence_eval["buyN"] < 50:
        conf_reasons.append("검증 BUY 표본 50건 미만")
    if confidence_eval["sellN"] < 50:
        conf_reasons.append("검증 SELL 표본 50건 미만")
    cand_stat, base_stat = confidence_eval["candidate"], confidence_eval["baseline"]
    if cand_stat["tierSpreadPp"] is None or base_stat["tierSpreadPp"] is None:
        conf_reasons.append("구간별 비교에 표본이 모자람")
    elif cand_stat["tierSpreadPp"] < max(5.0, base_stat["tierSpreadPp"]):
        conf_reasons.append("후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족"
                             f"(후보 {cand_stat['tierSpreadPp']}pp vs 기존 {base_stat['tierSpreadPp']}pp)")
    confidence_qualified = not conf_reasons
    confidence_model = {
        "version": "calibrated-accuracy-v1",
        "calibration": confidence_calibration,
        "evaluation": confidence_eval,
        "promotion": {"qualified": confidence_qualified,
                      "status": "qualified" if confidence_qualified else "shadow",
                      "reasons": conf_reasons,
                      "minimums": {"testDays": 40, "buyN": 50, "sellN": 50, "minTierSpreadLiftPp": 5.0}},
    }

    payload = {
        "generatedAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "version": "calibrated-ensemble-v3",
        "calibration": calibration,
        "errorCorrelation": correlations,
        "redundancyFactor": redundancy,
        "regimes": regimes_table,
        "currentRegime": current_regime,
        "holdPolicy": {"buyProbability": .62, "sellProbability": .38},
        "reboundGuard": rebound_guard,
        "audit": audit(test, regimes),
        "shadow": metrics,
        "prospective": prospective,
        "promotion": {"qualified": qualified, "status": "qualified" if qualified else "shadow",
                      "reasons": reasons, "minimums": {"n": 500, "actionN": 100,
                      "precisionGainPp": 1.5, "brierGain": .005, "coveragePct": 15,
                      "testDays": 40, "testRegimes": 3, "buyN": 50, "sellN": 50,
                      "maxDirectionSharePct": 80}},
        "confidenceModel": confidence_model,
    }
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    header = ("// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가\n"
              "// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.\n")
    with open(os.path.join(HERE, "model_intelligence.js"), "w", encoding="utf-8") as handle:
        handle.write(header + "const MODEL_INTELLIGENCE = " + body + ";\n")
    print(f"model_intelligence.js 저장 · train {len(train):,} · test {len(test):,} · "
          f"상태 {payload['promotion']['status']} · 후보 정밀도 {candidate_precision} · "
          f"신뢰도모델 {confidence_model['promotion']['status']}"
          + (f" ({'; '.join(conf_reasons)})" if conf_reasons else ""))


if __name__ == "__main__":
    main()
