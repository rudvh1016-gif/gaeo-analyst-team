#!/usr/bin/env python3
"""GAEO 순환매 분석의 순수 계산 모듈.

파일 입출력과 네트워크를 사용하지 않는다. 모든 as-of 계산은 전달된 날짜까지의
행만 사용해 미래 데이터 누출을 막는다.
"""

from __future__ import annotations

import math
import statistics
from collections import defaultdict
from datetime import datetime

from krx_calendar import future_trading_period


HORIZONS = (1, 3, 5, 20, 60, 120, 200)
PUBLIC_HORIZONS = (1, 3, 5, 20)
MODEL_COMPONENTS = (
    "momentum", "relativeStrength", "flow", "breadth",
    "leadLag", "similarity", "regimeMatch", "taro",
)

COMPONENT_LABELS = {
    "momentum": "상승 탄력",
    "relativeStrength": "시장 대비 강도",
    "flow": "거래량 흐름",
    "breadth": "상승 종목 확산",
    "leadLag": "선행 흐름",
    "similarity": "과거 유사 국면",
    "regimeMatch": "시장 국면 적합도",
    "taro": "TARO 기술 신호",
}
COMPONENT_DESCRIPTIONS = {
    "momentum": "업종 구성 종목의 해당 기간 수익 흐름",
    "relativeStrength": "각 종목 시장지수보다 강했던 정도의 중앙값",
    "flow": "최근 거래량이 평소보다 늘었는지 보는 대용 지표",
    "breadth": "상승이 일부 종목이 아닌 업종 전반으로 퍼진 정도",
    "leadLag": "과거 자료에서 다른 업종보다 먼저 움직인 패턴",
    "similarity": "현재와 비슷했던 과거 시장 국면의 업종 결과",
    "regimeMatch": "현재 시장 방향과 업종 흐름이 맞는 정도",
    "taro": "기존 TARO 이동평균·MACD·거래량 기술 신호",
}


def _number(value):
    if value is None or isinstance(value, bool):
        return None
    try:
        result = float(value)
    except (TypeError, ValueError):
        return None
    return result if math.isfinite(result) else None


def _round(value, digits=2):
    return None if value is None else round(float(value), digits)


def explain_score(components, weights=None):
    """Return a transparent weighted score; it is a percentile composite, not probability."""
    clean = {
        name: max(0.0, min(100.0, _number(value) or 0.0))
        for name, value in (components or {}).items()
    }
    raw_weights = {
        name: max(0.0, _number((weights or {}).get(name)) or 0.0)
        for name in clean
    }
    if not any(raw_weights.values()):
        equal = 1 / len(clean) if clean else 0.0
        normalized = {name: equal for name in clean}
    else:
        total = sum(raw_weights.values())
        normalized = {name: value / total for name, value in raw_weights.items()}
    contributions = {
        name: round(clean[name] * normalized[name], 6)
        for name in clean
    }
    positive = sum(value >= 55 for value in clean.values())
    negative = sum(value <= 45 for value in clean.values())
    return {
        "score": round(sum(contributions.values()), 1),
        "weights": {name: round(value, 6) for name, value in normalized.items()},
        "contributions": contributions,
        "agreement": {
            "positive": positive,
            "negative": negative,
            "total": len(clean),
            "label": "다수 지표 동의" if positive >= max(1, len(clean) * 0.625) else "지표 혼재",
        },
        "meaning": "24개 업종 안에서 현재 상대 위치를 0~100으로 환산한 종합점수이며 확률이 아닙니다.",
    }


def normalize_rows(rows, as_of=None):
    """Return unique, ascending, valid price rows no later than as_of."""
    by_date = {}
    for row in rows or []:
        date = str((row or {}).get("date") or "")[:10]
        close = _number((row or {}).get("close"))
        if not date or close is None or close <= 0 or (as_of and date > as_of):
            continue
        by_date[date] = {
            "date": date,
            "close": close,
            "volume": max(0.0, _number((row or {}).get("volume")) or 0.0),
        }
    return [by_date[date] for date in sorted(by_date)]


def period_return(values, horizon):
    """Percent return from exactly horizon observations ago."""
    clean = [_number(value) for value in values]
    if horizon <= 0 or len(clean) <= horizon or any(value is None or value <= 0 for value in clean[-horizon - 1:]):
        return None
    return round((clean[-1] / clean[-horizon - 1] - 1) * 100, 6)


def period_metadata(rows, horizon):
    """Describe the exact close-to-close window used for a horizon return."""
    clean = normalize_rows(rows)
    if horizon <= 0 or len(clean) <= horizon:
        return {"periodStart": None, "periodEnd": clean[-1]["date"] if clean else None, "tradingDays": horizon}
    return {
        "periodStart": clean[-horizon - 1]["date"],
        "periodEnd": clean[-1]["date"],
        "tradingDays": horizon,
    }


def winsorized_mean(values, proportion=0.1):
    clean = sorted(value for value in (_number(item) for item in values) if value is not None)
    if not clean:
        return None
    count = int(len(clean) * max(0.0, min(0.49, proportion)))
    if count:
        lower, upper = clean[count], clean[-count - 1]
        clean = [max(lower, min(upper, value)) for value in clean]
    return sum(clean) / len(clean)


def beta_binomial_rate(successes, total, market_rate, prior_strength):
    if total < 0 or successes < 0 or successes > total:
        raise ValueError("successes must be between zero and total")
    prior = max(0.0, float(prior_strength))
    rate = max(0.0, min(1.0, float(market_rate)))
    denominator = total + prior
    return rate if denominator == 0 else (successes + prior * rate) / denominator


def shrink_value(value, center, sample_size, strength):
    value, center = _number(value), _number(center)
    if value is None or center is None:
        return None
    sample, prior = max(0.0, float(sample_size)), max(0.0, float(strength))
    reliability = sample / (sample + prior) if sample + prior else 0.0
    return reliability * value + (1 - reliability) * center


def concentration(contributions, top_n):
    positives = sorted((value for value in (_number(item) for item in contributions) if value and value > 0), reverse=True)
    total = sum(positives)
    if not total:
        return 0.0
    return round(sum(positives[:max(0, int(top_n))]) / total * 100, 2)


def _median(values, default=None):
    clean = [value for value in (_number(item) for item in values) if value is not None]
    return statistics.median(clean) if clean else default


def _mean(values, default=None):
    clean = [value for value in (_number(item) for item in values) if value is not None]
    return sum(clean) / len(clean) if clean else default


def _mad(values):
    center = _median(values)
    return _median([abs(value - center) for value in values], 0.0) if center is not None else None


def _ema(values, period):
    if not values:
        return []
    factor = 2 / (period + 1)
    output = [float(values[0])]
    for value in values[1:]:
        output.append(float(value) * factor + output[-1] * (1 - factor))
    return output


def _relative_volume(rows):
    if len(rows) < 3:
        return None
    current = rows[-1]["volume"]
    previous = [row["volume"] for row in rows[max(0, len(rows) - 21):-1] if row["volume"] > 0]
    average = _mean(previous)
    return current / average if average and current >= 0 else None


def _stock_taro(rows):
    closes = [row["close"] for row in rows]
    available = 0
    earned = 0.0
    details = {"aboveMa": {}, "maSlopeImproving": False, "macdImproving": False}
    for period, weight in ((5, 15), (20, 15), (60, 15), (120, 5), (200, 5)):
        if len(closes) >= period:
            available += weight
            ma = _mean(closes[-period:])
            above = closes[-1] > ma
            details["aboveMa"][str(period)] = above
            if above:
                earned += weight
    if len(closes) >= 25:
        available += 15
        current_ma = _mean(closes[-20:])
        previous_ma = _mean(closes[-25:-5])
        details["maSlopeImproving"] = current_ma > previous_ma
        if details["maSlopeImproving"]:
            earned += 15
    if len(closes) >= 27:
        available += 20
        ema12, ema26 = _ema(closes, 12), _ema(closes, 26)
        macd = [left - right for left, right in zip(ema12, ema26)]
        details["macdImproving"] = macd[-1] > macd[-2]
        if details["macdImproving"]:
            earned += 20
    volume_ratio = _relative_volume(rows)
    if volume_ratio is not None:
        available += 10
        if volume_ratio >= 1:
            earned += 10
    details["score"] = round(earned / available * 100, 1) if available else 50.0
    details["volumeConfirmed"] = bool(volume_ratio is not None and volume_ratio >= 1)
    return details


def _indicator_taro(indicator, rows):
    """Reuse the site's already-generated TARO inputs, with history as a safe fallback."""
    tech = (indicator or {}).get("tech") or {}
    close = _number(tech.get("close")) or _number((indicator or {}).get("price"))
    if not tech or close is None:
        fallback = _stock_taro(rows)
        fallback["source"] = "price-history-fallback"
        return fallback
    available = earned = 0.0
    above = {}
    for period, weight in ((5, 15), (20, 15), (60, 15), (120, 5), (200, 5)):
        ma = _number(tech.get(f"ma{period}"))
        if ma is None:
            continue
        available += weight
        above[str(period)] = close > ma
        if above[str(period)]:
            earned += weight
    slope = _number(tech.get("ma20Slope"))
    if slope is not None:
        available += 15
        if slope > 0:
            earned += 15
    macd, signal = _number(tech.get("macd")), _number(tech.get("macdSignal"))
    if macd is not None and signal is not None:
        available += 20
        if macd > signal:
            earned += 20
    volume_ratio = _number(tech.get("volRatio"))
    if volume_ratio is not None:
        available += 10
        if volume_ratio >= 1:
            earned += 10
    return {
        "score": round(earned / available * 100, 1) if available else 50.0,
        "aboveMa": above,
        "maSlopeImproving": bool(slope is not None and slope > 0),
        "macdImproving": bool(macd is not None and signal is not None and macd > signal),
        "volumeConfirmed": bool(volume_ratio is not None and volume_ratio >= 1),
        "source": "existing-indicators",
    }


def _candidate_profile(code, name, indicator, rows, auto_entry=None):
    tech = (indicator or {}).get("tech") or {}
    technical_filter = _indicator_taro(indicator, rows)
    actual_taro = _number(((auto_entry or {}).get("taro") or {}).get("score"))
    taro_score = actual_taro if actual_taro is not None else technical_filter["score"]
    rsi = _number(tech.get("rsi14"))
    pct_b = _number((tech.get("bb") or {}).get("pctB"))
    overheat = bool((rsi is not None and rsi >= 70) or (pct_b is not None and pct_b > 1))
    reasons = []
    if technical_filter["maSlopeImproving"]:
        reasons.append("20일 추세 개선")
    if technical_filter["macdImproving"]:
        reasons.append("MACD 우위")
    if technical_filter["volumeConfirmed"]:
        reasons.append("거래량 확인")
    percentile = _number(((indicator or {}).get("relative") or {}).get("sectorPercentile"))
    if percentile is not None and percentile >= 70:
        reasons.append("업종 내 상대강도 상위")
    if not reasons:
        reasons.append("기술 신호 관찰")
    price = _number(tech.get("close")) or _number((indicator or {}).get("price"))
    moving_averages = {
        str(period): _number(tech.get(f"ma{period}"))
        for period in (5, 20, 60, 120, 200)
    }
    volume_ratio = _number(tech.get("volRatio"))
    liquidity_score = max(0.0, min(100.0, (volume_ratio or 0.0) * 50.0))
    rank_score = (
        (taro_score or 0.0) * 0.50
        + (percentile or 0.0) * 0.25
        + liquidity_score * 0.25
        - (10.0 if overheat else 0.0)
    )
    rank_reasons = []
    if taro_score is not None:
        rank_reasons.append("TARO 기술 확인")
    if volume_ratio is not None and volume_ratio >= 1:
        rank_reasons.append("거래량 증가")
    if percentile is not None and percentile >= 70:
        rank_reasons.append("업종 내 상대강도 상위")
    if overheat:
        rank_reasons.append("과열 감점 반영")
    return {
        "code": code,
        "name": name or code,
        "price": price,
        "taroScore": taro_score,
        "taroSource": "auto-analysis" if actual_taro is not None else "rotation-technical-filter",
        "movingAverages": moving_averages,
        "maStatus": {
            str(period): (
                f"{period}일선 위" if price is not None and value is not None and price >= value
                else f"{period}일선 아래" if price is not None and value is not None
                else f"{period}일선 확인 중"
            )
            for period, value in ((period, moving_averages[str(period)]) for period in (20, 60, 120, 200))
        },
        "volumeRatio": volume_ratio,
        "volumeBaseline": {
            "label": "직전 20거래일 일평균 대비",
            "periodStart": rows[-21]["date"] if len(rows) >= 21 else None,
            "periodEnd": rows[-2]["date"] if len(rows) >= 2 else None,
            "tradingDays": 20,
        },
        "sectorPercentile": percentile,
        "overheat": overheat,
        "riskGrade": ((indicator or {}).get("risk") or {}).get("grade"),
        "reasons": reasons[:3],
        "rotationRankScore": round(max(0.0, min(100.0, rank_score)), 1),
        "rotationRankReasons": rank_reasons[:3] or ["기술 신호 관찰"],
        "source": technical_filter["source"],
    }


def _rank_scores(values):
    indexed = [(index, _number(value)) for index, value in enumerate(values)]
    valid = sorted(value for _, value in indexed if value is not None)
    if not valid or valid[0] == valid[-1]:
        return [50.0 if value is not None else 0.0 for _, value in indexed]
    output = []
    for _, value in indexed:
        if value is None:
            output.append(0.0)
            continue
        below = sum(1 for candidate in valid if candidate < value)
        equal = sum(1 for candidate in valid if candidate == value)
        percentile = (below + (equal - 1) / 2) / max(1, len(valid) - 1)
        output.append(round(percentile * 100, 1))
    return output


def _sample_reliability(valid, configured):
    coverage = valid / configured if configured else 0.0
    if valid >= 12 and coverage >= 0.85:
        return "높음"
    if valid >= 6 and coverage >= 0.7:
        return "보통"
    return "낮음"


def _benchmark_return(index_rows, horizon, as_of=None):
    rows = normalize_rows(index_rows, as_of)
    return period_return([row["close"] for row in rows], horizon)


def classify_regime(indices, stock_series, as_of=None):
    kospi = normalize_rows(indices.get("KOSPI", []), as_of)
    kosdaq = normalize_rows(indices.get("KOSDAQ", []), as_of)
    combined = kospi if len(kospi) >= len(kosdaq) else kosdaq
    closes = [row["close"] for row in combined]
    ret20, ret60 = period_return(closes, 20), period_return(closes, 60)
    if ret20 is None:
        direction = "판단 보류"
    elif ret20 > 2 and (ret60 is None or ret60 >= 0):
        direction = "상승"
    elif ret20 < -2 and (ret60 is None or ret60 <= 0):
        direction = "하락"
    else:
        direction = "횡보"

    daily_returns = []
    for index in range(max(1, len(closes) - 20), len(closes)):
        if closes[index - 1]:
            daily_returns.append((closes[index] / closes[index - 1] - 1) * 100)
    volatility_value = statistics.pstdev(daily_returns) if len(daily_returns) >= 2 else None
    volatility = "보통"
    if volatility_value is not None and volatility_value >= 1.8:
        volatility = "확대"
    elif volatility_value is not None and volatility_value <= 0.7:
        volatility = "축소"

    kospi20 = period_return([row["close"] for row in kospi], 20)
    kosdaq20 = period_return([row["close"] for row in kosdaq], 20)
    leadership = "중립"
    if kospi20 is not None and kosdaq20 is not None:
        difference = kosdaq20 - kospi20
        leadership = "KOSDAQ" if difference > 2 else "KOSPI" if difference < -2 else "중립"

    up, valid = 0, 0
    for rows in stock_series.values():
        clean = normalize_rows(rows, as_of)
        value = period_return([row["close"] for row in clean], 5)
        if value is not None:
            valid += 1
            up += int(value > 0)
    breadth_rate = up / valid if valid else None
    breadth = "개선" if breadth_rate is not None and breadth_rate >= 0.6 else "악화" if breadth_rate is not None and breadth_rate <= 0.4 else "중립"
    return {
        "direction": direction,
        "volatility": volatility,
        "leadership": leadership,
        "breadth": breadth,
        "breadthRate": _round((breadth_rate or 0) * 100, 1) if breadth_rate is not None else None,
        "directionPeriod": period_metadata(combined, 20),
        "volatilityPeriod": period_metadata(combined, 20),
        "leadershipPeriod": period_metadata(combined, 20),
        "trendConfirmationPeriod": period_metadata(combined, 60),
        "breadthPeriod": period_metadata(combined, 5),
    }


def _model_value(model, bucket, sector, horizon, default=50.0):
    source = (model or {}).get(bucket) or {}
    value = ((source.get(sector) or {}).get(str(horizon)))
    return _number(value) if _number(value) is not None else default


def _confidence(period, sector, model):
    coverage = sector["validCount"] / sector["configuredCount"] if sector["configuredCount"] else 0
    concentration_top3 = period["concentration"]["top3"]
    agreement = sum(1 for name in MODEL_COMPONENTS if period["components"][name] >= 55)
    calibration = (model or {}).get("calibration") or {}
    high_ready = bool(
        calibration.get("highOutperformsModerate")
        and (_number(calibration.get("evaluations")) or 0) >= 60
    )
    if sector["sampleReliability"] == "낮음" or coverage < 0.7:
        return "관찰"
    if concentration_top3 >= 80 or agreement < 3:
        return "낮음"
    if high_ready and coverage >= 0.8 and agreement >= 6 and concentration_top3 < 65:
        return "높음"
    return "보통"


def _signal_for(period):
    if period["score"] >= 68 and period["relativeStrength"] > 0 and period["breadth"]["adjustedUpRate"] >= 55:
        return "주도"
    if period["score"] >= 58 and period["relativeStrength"] > 0:
        return "관찰 후보"
    return "관찰"


def build_snapshot(stocks, sectors, markets, indices, indicators=None, model=None, names=None,
                   auto_analysis=None,
                   as_of=None, generated_at=None, data_cutoff=None):
    """Build a deterministic schemaVersion 1 rotation snapshot."""
    configured_by_sector = defaultdict(list)
    for code, sector in sectors.items():
        configured_by_sector[sector or "기타"].append(code)

    clean_stocks = {code: normalize_rows(stocks.get(code, []), as_of) for code in sectors}
    indicators = indicators or {}
    auto_analysis = auto_analysis or {}
    names = names or {}
    stock_profiles = {
        code: _candidate_profile(
            code, names.get(code, code), indicators.get(code), clean_stocks[code], auto_analysis.get(code)
        )
        for code in sectors
    }
    market_benchmarks = {
        horizon: {
            market: _benchmark_return((indices or {}).get(market, []), horizon, as_of)
            for market in ("KOSPI", "KOSDAQ")
        }
        for horizon in HORIZONS
    }
    universe_returns = {
        horizon: [
            value for code, rows in clean_stocks.items()
            if (value := period_return([row["close"] for row in rows], horizon)) is not None
        ]
        for horizon in HORIZONS
    }
    market_up_rates = {
        horizon: (sum(value > 0 for value in values) / len(values)) if values else 0.5
        for horizon, values in universe_returns.items()
    }

    sector_rows = []
    for sector_name in sorted(configured_by_sector):
        codes = configured_by_sector[sector_name]
        periods = {}
        latest_valid = sum(bool(clean_stocks[code]) for code in codes)
        for horizon in HORIZONS:
            returns, relative, flows, taro_scores, contributions = [], [], [], [], []
            up = down = flat = 0
            for code in codes:
                rows = clean_stocks[code]
                value = period_return([row["close"] for row in rows], horizon)
                if value is None:
                    continue
                returns.append(value)
                contributions.append(value)
                if value > 0.05:
                    up += 1
                elif value < -0.05:
                    down += 1
                else:
                    flat += 1
                benchmark = market_benchmarks[horizon].get(markets.get(code, "KOSPI"))
                if benchmark is not None:
                    relative.append(value - benchmark)
                flow = _relative_volume(rows)
                if flow is not None:
                    flows.append(flow)
                taro_scores.append(stock_profiles[code]["taroScore"])
            valid = len(returns)
            raw_up_rate = up / valid if valid else 0.0
            adjusted_up = beta_binomial_rate(up, valid, market_up_rates[horizon], 6.0)
            median_return = _median(returns)
            center = _median(universe_returns[horizon], 0.0)
            adjusted_return = shrink_value(median_return, center, valid, 6.0) if median_return is not None else None
            periods[str(horizon)] = {
                "validCount": valid,
                "return": {
                    "equalMean": _round(_mean(returns)),
                    "median": _round(median_return),
                    "winsorized": _round(winsorized_mean(returns)),
                    "adjusted": _round(adjusted_return),
                    "dispersion": _round(_mad(returns)),
                },
                "relativeStrength": _round(_median(relative), 2) or 0.0,
                "breadth": {
                    "upRate": _round(raw_up_rate * 100, 1),
                    "adjustedUpRate": _round(adjusted_up * 100, 1),
                    "downRate": _round((down / valid * 100) if valid else 0, 1),
                    "flatRate": _round((flat / valid * 100) if valid else 0, 1),
                },
                "flow": {
                    "medianRelativeVolume": _round(_median(flows), 2),
                    "risingRate": _round((sum(value >= 1 for value in flows) / len(flows) * 100) if flows else 0, 1),
                    "label": "거래량 기반 자금 흐름",
                },
                "taro": {"score": _round(_median(taro_scores, 50.0), 1)},
                "concentration": {
                    "top1": concentration(contributions, 1),
                    "top3": concentration(contributions, 3),
                    "top5": concentration(contributions, 5),
                },
            }
        sector_rows.append({
            "name": sector_name,
            "configuredCount": len(codes),
            "validCount": latest_valid,
            "taroAnalyzedCount": sum(
                1 for code in codes
                if clean_stocks[code] and (indicators.get(code) or {}).get("tech")
            ),
            "taroConfirmationCount": sum(
                1 for code in codes
                if clean_stocks[code]
                and (indicators.get(code) or {}).get("tech")
                and stock_profiles[code]["taroScore"] >= 70
            ),
            "sampleReliability": _sample_reliability(latest_valid, len(codes)),
            "periods": periods,
            "candidateStocks": sorted(
                (
                    stock_profiles[code] for code in codes
                    if clean_stocks[code] and (indicators.get(code) or {}).get("tech")
                ),
                key=lambda item: (-(item["rotationRankScore"] or 0), -(item["taroScore"] or 0), item["name"]),
            )[:8],
            "candidateExcludedCount": sum(
                1 for code in codes
                if clean_stocks[code] and not (indicators.get(code) or {}).get("tech")
            ),
        })

    regime = classify_regime(indices or {}, clean_stocks, as_of)
    for horizon in HORIZONS:
        keys = [str(horizon)] * len(sector_rows)
        raw_sets = {
            "momentum": [sector["periods"][key]["return"]["adjusted"] for sector, key in zip(sector_rows, keys)],
            "relativeStrength": [sector["periods"][key]["relativeStrength"] for sector, key in zip(sector_rows, keys)],
            "flow": [sector["periods"][key]["flow"]["medianRelativeVolume"] for sector, key in zip(sector_rows, keys)],
            "breadth": [sector["periods"][key]["breadth"]["adjustedUpRate"] for sector, key in zip(sector_rows, keys)],
            "taro": [sector["periods"][key]["taro"]["score"] for sector, key in zip(sector_rows, keys)],
        }
        ranked = {name: _rank_scores(values) for name, values in raw_sets.items()}
        for index, sector in enumerate(sector_rows):
            period = sector["periods"][str(horizon)]
            components = {
                "momentum": ranked["momentum"][index],
                "relativeStrength": ranked["relativeStrength"][index],
                "flow": ranked["flow"][index],
                "breadth": ranked["breadth"][index],
                "taro": ranked["taro"][index],
                "leadLag": _model_value(model, "leadLagScores", sector["name"], horizon),
                "similarity": _model_value(model, "similarityScores", sector["name"], horizon),
                "regimeMatch": 60.0 if regime["direction"] == "상승" and (period["return"]["adjusted"] or 0) > 0 else 50.0,
            }
            weights = (((model or {}).get("weights") or {}).get(str(horizon)) or {})
            period["components"] = {name: _round(components[name], 1) for name in MODEL_COMPONENTS}
            explanation = explain_score(period["components"], weights)
            period["score"] = explanation["score"]
            period["scoreExplanation"] = explanation
            period["modelAgreement"] = explanation["agreement"]
            period["confidence"] = _confidence(period, sector, model)
            period["signal"] = _signal_for(period)

    recommended = (model or {}).get("recommendedHorizon") or {}
    recommended_value = int(recommended.get("horizon") or 0)
    summary_horizon = recommended_value if recommended.get("status") == "ready" and recommended_value in PUBLIC_HORIZONS else 5
    summary_period = str(summary_horizon)
    short_term_ranked = sorted(
        sector_rows,
        key=lambda sector: (-sector["periods"]["5"]["score"], sector["name"]),
    )
    sector_rows.sort(key=lambda sector: (-sector["periods"][summary_period]["score"], sector["name"]))
    leaders = [
        {"name": sector["name"], "score": sector["periods"][summary_period]["score"],
         "signal": sector["periods"][summary_period]["signal"], "confidence": sector["periods"][summary_period]["confidence"]}
        for sector in sector_rows[:5]
    ]
    active = [item for item in leaders if item["signal"] in ("주도", "관찰 후보") and item["score"] >= 58]
    candidate = active[1] if len(active) > 1 else None
    state = "active" if active else "no-signal"
    headline = f"{active[0]['name']} 중심 순환 신호 관찰" if active else "뚜렷한 순환 신호 없음"
    first = active[0] if active else leaders[0] if leaders else None
    interpretation = (
        f"현재 {first['name']} 업종에 상대적인 힘이 가장 많이 모여 있습니다."
        if first else "현재 비교할 수 있는 업종 데이터가 부족합니다."
    )
    score_meaning = (
        f"종합점수 {first['score']}점은 업종 간 상대 위치이며 확률이 아닙니다."
        if first else "종합점수는 업종 간 상대 위치이며 확률이 아닙니다."
    )
    combined_index = max(
        (normalize_rows((indices or {}).get(market, []), as_of) for market in ("KOSPI", "KOSDAQ")),
        key=len,
        default=[],
    )
    short_term = None
    if summary_horizon != 5 and short_term_ranked:
        short_sector = short_term_ranked[0]
        short_period = short_sector["periods"]["5"]
        short_term = {
            "horizon": 5,
            "name": short_sector["name"],
            "score": short_period["score"],
            "signal": short_period["signal"],
            "period": period_metadata(combined_index, 5),
        }

    valid_universe = sum(bool(rows) for rows in clean_stocks.values())
    dates = [row["date"] for rows in clean_stocks.values() for row in rows]
    generated_at = generated_at or datetime.now().strftime("%Y-%m-%d %H:%M")
    cutoff = data_cutoff or ((max(dates) if dates else as_of or "자료 없음") + " 종가")
    warnings = []
    if valid_universe < len(sectors) * 0.8:
        warnings.append("유효 종목이 전체 추적 종목의 80%보다 적습니다.")
    if not model:
        warnings.append("Walk-forward 교정 전 Shadow 모델이며 높은 신뢰도는 표시하지 않습니다.")
    if not dates or len(set(dates)) < 250:
        warnings.append("Lead-Lag와 유사 시장은 통계 축적 중입니다.")

    summary = {
        "state": state, "headline": headline, "leaders": leaders,
        "candidate": candidate,
        "horizon": summary_horizon,
        "period": period_metadata(combined_index, summary_horizon),
        "shortTerm": short_term,
        "interpretation": interpretation,
        "scoreMeaning": score_meaning,
        "disclaimer": "예측 화면이 아니라 현재 어디로 힘이 모이는지 확인하는 참고 화면입니다.",
    }
    if candidate and recommended.get("status") == "ready" and dates:
        summary["candidateObservationPeriod"] = future_trading_period(max(dates), summary_horizon)

    return {
        "schemaVersion": 1,
        "generatedAt": generated_at,
        "dataCutoff": cutoff,
        "status": "provisional" if "장중" in cutoff else "confirmed",
        "universe": {"configured": len(sectors), "valid": valid_universe},
        "marketRegime": regime,
        "model": {
            "version": (model or {}).get("version", "rotation-shadow-v2"),
            "calibratedThrough": (model or {}).get("calibratedThrough"),
            "highConfidenceUnlocked": bool(((model or {}).get("calibration") or {}).get("highOutperformsModerate")),
        },
        "summary": summary,
        "componentGuide": [
            {"key": name, "label": COMPONENT_LABELS[name], "description": COMPONENT_DESCRIPTIONS[name]}
            for name in MODEL_COMPONENTS
        ],
        "sectors": sector_rows,
        "leadLagEdges": (model or {}).get("leadLagEdges", []),
        "similarMarkets": (model or {}).get("similarMarkets", {"status": "accumulating", "cases": []}),
        "horizonPerformance": (model or {}).get("horizonPerformance", {}),
        "recommendedHorizon": recommended or {
            "status": "accumulating", "horizon": None,
            "reason": "표본 수와 구간 안정성이 기준에 도달할 때까지 추천을 보류합니다.",
        },
        "methodology": {
            "historyStart": min(dates) if dates else None,
            "historyEnd": max(dates) if dates else None,
            "tradingDays": len(set(dates)),
            "successDefinition": "업종의 지정 기간 시장대비 초과수익률이 0보다 큰 경우",
            "flowDefinition": "정확한 거래대금이 아닌 거래량 기반 자금 흐름",
            "classification": "현재 업종 분류 기준",
        },
        "warnings": warnings,
    }


def build_asof_snapshot(*args, as_of, **kwargs):
    return build_snapshot(*args, as_of=as_of, **kwargs)
