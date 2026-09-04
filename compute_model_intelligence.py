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
import random
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

    def _spread_of(vals):
        """상위 1/3 적중률 - 하위 1/3 적중률 (%p). vals = [(확신도, 적중 0/1), ...]"""
        if len(vals) < 20:
            return None
        ordered = sorted(vals, key=lambda x: x[0])
        third = max(1, len(ordered) // 3)
        low, high = ordered[:third], ordered[-third:]
        return (sum(v[1] for v in high) / len(high) - sum(v[1] for v in low) / len(low)) * 100

    def _block_bootstrap_ci(rows, draws=1000, seed=20260904):
        """⭐ 2026-09-04 정직성 보강 — 스프레드 숫자 하나만 크게 내면 "확실히 더 낫다"로
        읽힌다. 같은 날 수백 종목은 서로 독립이 아니므로(같은 시장을 함께 겪는다),
        날짜 단위로 통째로 다시 뽑는 블록 부트스트랩으로 95% 범위를 구한다.
        범위가 0을 포함하면 "우연일 수도 있다"는 뜻이고, 그 사실을 반드시 함께 낸다.
        rows = [(날짜, 확신도, 적중 0/1), ...]"""
        by_day = {}
        for day, value, hit in rows:
            by_day.setdefault(day, []).append((value, hit))
        days = sorted(by_day)
        if len(days) < 5:
            return None
        rng = random.Random(seed)
        sims = []
        for _ in range(draws):
            sample = []
            for _ in range(len(days)):
                sample += by_day[days[rng.randrange(len(days))]]
            value = _spread_of(sample)
            if value is not None:
                sims.append(value)
        if len(sims) < draws * .5:
            return None
        sims.sort()
        low = round(sims[int(.025 * len(sims))], 1)
        high = round(sims[min(len(sims) - 1, int(.975 * len(sims)))], 1)
        return {"lowPp": low, "highPp": high, "includesZero": low <= 0 <= high,
                "decisionDays": len(days), "draws": len(sims)}

    def tier_spread(key):
        vals = [(p[key], p["hit"]) for p in pairs if p[key] is not None]
        if len(vals) < 20:
            return {"n": len(vals), "tierSpreadPp": None, "corr": None, "ci95": None}
        spread = _spread_of(vals)
        corr = pearson([v[0] for v in vals], [v[1] for v in vals])
        ci = _block_bootstrap_ci([(p["day"], p[key], p["hit"]) for p in pairs if p[key] is not None])
        return {"n": len(vals), "tierSpreadPp": round(spread, 1), "corr": round(corr, 4),
                "ci95": ci}

    buy_n = sum(1 for p in pairs if p["call"] == "BUY")
    sell_n = sum(1 for p in pairs if p["call"] == "SELL")
    test_days = len({p["day"] for p in pairs})
    test_regimes = len({(regimes.get(p["day"]) or {}).get("key") for p in pairs if regimes.get(p["day"])})

    # ⭐ 2026-09-04 정직성 보강 — "방향 되짚기(direction relabeling)" 검사.
    #    후보 확신도는 BUY 구간과 SELL 구간의 값 범위가 거의 겹치지 않는다. 그러면
    #    "확신도가 높은 판단"을 고르는 일이 사실은 "SELL을 고르는 일"이 되고, SELL이
    #    BUY보다 잘 맞는 구간에서는 아무 정보가 없어도 스프레드가 크게 나온다.
    #    그래서 BUY 안에서만·SELL 안에서만 다시 재본다. 방향 안에서도 여전히 잘 가르면
    #    진짜 정보이고, 방향 안에서 사라지면 그건 방향을 바꿔 말한 것뿐이다.
    def tier_spread_within(key, call):
        vals = [(p[key], p["hit"]) for p in pairs if p[key] is not None and p["call"] == call]
        if len(vals) < 20:
            return {"n": len(vals), "tierSpreadPp": None}
        vals.sort(key=lambda x: x[0])
        third = max(1, len(vals) // 3)
        low, high = vals[:third], vals[-third:]
        return {"n": len(vals), "tierSpreadPp": round(
            sum(v[1] for v in high) / len(high) * 100 - sum(v[1] for v in low) / len(low) * 100, 1)}

    def value_range(key, call):
        vals = [p[key] for p in pairs if p[key] is not None and p["call"] == call]
        return [round(min(vals), 1), round(max(vals), 1)] if vals else None

    buy_rng, sell_rng = value_range("candidate", "BUY"), value_range("candidate", "SELL")
    overlaps = bool(buy_rng and sell_rng and buy_rng[0] <= sell_rng[1] and sell_rng[0] <= buy_rng[1])
    return {
        "n": len(pairs), "buyN": buy_n, "sellN": sell_n,
        "testDays": test_days, "testRegimes": test_regimes,
        "candidate": tier_spread("candidate"), "baseline": tier_spread("baseline"),
        "directionConfound": {
            "candidateRangeBuy": buy_rng, "candidateRangeSell": sell_rng,
            "rangesOverlap": overlaps,
            "candidateWithinBuy": tier_spread_within("candidate", "BUY"),
            "candidateWithinSell": tier_spread_within("candidate", "SELL"),
            "baselineWithinBuy": tier_spread_within("baseline", "BUY"),
            "baselineWithinSell": tier_spread_within("baseline", "SELL"),
            "note": ("합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. "
                     "같은 방향 안에서 다시 잰 값이 진짜 판별력이다."),
        },
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
    # ⭐ 2026-09-04 정직성 수정: candidateAllCallAccuracy는 call_hit으로 계산하는데
    #    call_hit은 BUY·SELL을 ±1%, HOLD를 ±5%로 채점한다. 후보가 실제로는 전부 HOLD만
    #    내는 상태(candidateActionN = 0)에서도 이 값은 60%대로 나오고, 바로 옆의
    #    "BUY·SELL 정밀도"와 나란히 놓이면 같은 잣대의 점수처럼 읽힌다. 실제로는
    #    "아무 판단도 안 했다"는 뜻이므로, 실행 가능한 판단이 하나도 없으면 숫자를
    #    내지 않고(None) 이유를 함께 남긴다. 불리한 사실을 숨기는 게 아니라, 잣대가
    #    다른 숫자를 같은 줄에 세워 잘한 것처럼 보이게 하는 것을 막는 것이다.
    all_call_acc = ratio(candidate_all)
    all_call_suppressed = candidate_actions[1] == 0 and evaluated > 0
    return {
        "n": evaluated,
        "baselineActionN": baseline_actions[1], "baselineActionPrecision": ratio(baseline_actions),
        "candidateActionN": candidate_actions[1], "candidateActionPrecision": ratio(candidate_actions),
        "candidateCoverage": round(candidate_actions[1] / evaluated * 100, 1) if evaluated else 0,
        "candidateCalls": candidate_calls,
        "testDays": len(evaluated_days), "testRegimes": len(evaluated_regimes),
        "candidateAllCallAccuracy": None if all_call_suppressed else all_call_acc,
        "candidateAllCallBasis": ("BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 "
                                  "BUY·SELL 정밀도와 같은 잣대가 아니다."),
        "candidateAllCallSuppressed": all_call_suppressed,
        "candidateAllCallSuppressedReason": ("후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 "
                                             "않아, 이 값은 HOLD 판정폭(±5%)만 반영한다."
                                             if all_call_suppressed else None),
        "brier": round(brier / evaluated, 4) if evaluated else None,
        "rawBrier": round(raw_brier / evaluated, 4) if evaluated else None,
    }


def evaluate_prospective_confidence(rows):
    """⭐ 2026-09-04 — 진짜 앞을 보는(prospective) 확신도 검증.

    evaluate_confidence_model()은 매 실행마다 기록을 70:30으로 다시 잘라 뒤쪽에서
    채점한다(재적합). 그래서 "검증 40거래일"이 앞으로 차오르는 시계가 아니었다.
    이 함수는 반대로, 그날 실제 파이프라인이 미리 기록해 둔 후보값
    (archive_analysis.py가 저장한 confidenceShadow)만 쓴다. 나중에 만든 교정표를
    과거에 적용하지 않으므로, 여기서 세는 날짜는 실제로 하루씩 쌓인다.

    기록이 없으면 0일로 정직하게 보고한다 — 없는 진행률을 지어내지 않는다.
    """
    pairs = []
    for row in rows:
        call = row.get("call")
        if call not in ("BUY", "SELL"):
            continue
        value = row.get("archivedConfidenceShadow")
        ret = row.get("ret5")
        if value is None or ret is None:
            continue
        verdict = call_hit(call, ret)
        if verdict is None:
            continue
        pairs.append({"day": row["day"], "call": call, "value": float(value), "hit": verdict})

    def spread(subset):
        if len(subset) < 20:
            return None
        ordered = sorted(subset, key=lambda p: p["value"])
        third = max(1, len(ordered) // 3)
        low, high = ordered[:third], ordered[-third:]
        return round((sum(p["hit"] for p in high) / len(high)
                      - sum(p["hit"] for p in low) / len(low)) * 100, 1)

    days = sorted({p["day"] for p in pairs})
    return {
        "type": "PROSPECTIVE_ARCHIVED",
        "note": ("그날 미리 기록해 둔 확신도 후보값만으로 채점한다. 나중에 만든 교정표를 "
                 "과거에 적용하지 않으므로 검증일이 실제로 하루씩 쌓인다."),
        "n": len(pairs),
        "testDays": len(days),
        "firstDay": days[0] if days else None,
        "lastDay": days[-1] if days else None,
        "buyN": sum(1 for p in pairs if p["call"] == "BUY"),
        "sellN": sum(1 for p in pairs if p["call"] == "SELL"),
        "tierSpreadPp": spread(pairs),
        "tierSpreadWithinBuyPp": spread([p for p in pairs if p["call"] == "BUY"]),
        "tierSpreadWithinSellPp": spread([p for p in pairs if p["call"] == "SELL"]),
        "clockStarted": bool(pairs),
        "daysRemainingToGate": max(0, 40 - len(days)),
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
                   "archivedShadow": entry.get("shadow"),
                   # ⭐ 2026-09-04: 그날 미리 기록해 둔 확신도 후보값(재적합 없음).
                   "archivedConfidenceShadow": entry.get("confidenceShadow"),
                   "archivedConfidenceShadowVersion": entry.get("confidenceShadowVersion")}
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
    # ⭐ 2026-09-04: 점 추정 하나로 승격을 판정하지 않는다. 날짜 블록 부트스트랩 95%
    #    범위가 0을 포함하면 "우연으로도 이만큼 나올 수 있다"는 뜻이므로 승격 불가다.
    _ci = cand_stat.get("ci95")
    if _ci is None:
        conf_reasons.append("불확실성 구간을 계산할 표본이 모자람")
    elif _ci.get("includesZero"):
        conf_reasons.append(f"후보 판별력 95% 구간({_ci['lowPp']}~{_ci['highPp']}pp)이 0을 포함해 "
                            f"우연일 가능성을 배제하지 못함")
    # 방향(BUY/SELL)을 바꿔 말한 것만으로 스프레드가 커지는 경우를 걸러낸다.
    _dc = confidence_eval.get("directionConfound") or {}
    _wb = (_dc.get("candidateWithinBuy") or {}).get("tierSpreadPp")
    _ws = (_dc.get("candidateWithinSell") or {}).get("tierSpreadPp")
    if _dc.get("rangesOverlap") is False and (_wb is None or _ws is None):
        conf_reasons.append("BUY·SELL 확신도 범위가 겹치지 않는데 방향별 재검증 표본이 모자람")
    elif _wb is not None and _ws is not None and min(_wb, _ws) < 5.0:
        conf_reasons.append(f"같은 방향 안에서 다시 재면 판별력이 약함"
                            f"(BUY {_wb}pp · SELL {_ws}pp)")
    # ⭐ 2026-09-04 — 승격의 진짜 관문은 "그날 미리 말해 둔 값이 맞았나"다.
    #    재적합 홀드아웃(70:30 재분할)만으로는 아무리 좋아 보여도 승격시키지 않는다.
    _prosp = evaluate_prospective_confidence(rows)
    if _prosp["testDays"] < 40:
        conf_reasons.append(f"사전 기록 기반 검증일 {_prosp['testDays']}일 / 40일 "
                            f"({'기록 시작 전' if not _prosp['clockStarted'] else '누적 중'})")
    confidence_qualified = not conf_reasons
    # ⭐ 2026-09-04 정직성 보강: 화면이 testDays를 "검증 거래일 (최소 40일 필요)"로만
    #    보여주면, 매일 하루씩 쌓여 40일에 도달하는 시계처럼 읽힌다. 실제 구조는 다르다.
    #    - 매 실행마다 전체 기록을 날짜순으로 다시 70:30으로 자르고, 학습 구간에서
    #      교정표를 처음부터 다시 만든다(재적합). 어제 검증일이었던 날짜가 오늘은
    #      학습일이 될 수 있다.
    #    - 그래서 testDays는 "앞으로 쌓인 검증일 수"가 아니라 "지금 기록의 뒤쪽 30% 중
    #      BUY·SELL 채점이 가능한 날짜 수"다. 40일에 닿으려면 전체 판단일이 대략
    #      testDays / (전체 대비 검증 비율)만큼 필요하다.
    #    이 사실을 데이터에 명시해 화면이 진행률처럼 오해시키지 않게 한다.
    _total_days = len(unique_days)
    _test_share = (len(test_days) / _total_days) if _total_days else 0.0
    _eff_share = (confidence_eval["testDays"] / _total_days) if _total_days else 0.0
    confidence_model = {
        "version": "calibrated-accuracy-v1",
        "calibration": confidence_calibration,
        "evaluation": confidence_eval,
        "evaluationDesign": {
            "type": "RETROSPECTIVE_RESPLIT",
            "note": ("매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 "
                     "교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 "
                     "아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다."),
            "totalDecisionDays": _total_days,
            "trainDays": len(train_days),
            "embargoDays": 5,
            "holdoutDays": len(test_days),
            "holdoutSharePct": round(_test_share * 100, 1),
            # 40일 기준을 채우려면 전체 판단일이 대략 얼마나 필요한지(현재 비율 기준 추정).
            "estimatedTotalDaysForGate": (round(40 / _eff_share) if _eff_share > 0 else None),
            "isProspective": False,
        },
        # 진짜 앞을 보는 시계. 오늘부터 기록이 쌓이며, 여기 testDays가 40에 닿아야
        # "40거래일 검증"이라는 말을 정직하게 쓸 수 있다.
        "prospective": _prosp,
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
