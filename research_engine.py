#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Research Shadow Engine (PHASE C)

⚠️ 이 모듈은 Legacy Production 판단을 절대 바꾸지 않는다.
   analyze_auto.py가 만드는 chief / shadowChief는 손대지 않고,
   researchShadow 라는 별도 필드만 추가한다.

목적은 "Research가 더 좋다"를 증명하는 것이 아니다.
Research Candidate를 고정(VERSION FREEZE)해서 앞으로 진짜 미래 데이터를 모으는 것이다.

핵심 규칙 (docs/gaeo_phaseB_revisions.md)
- 결과를 본 뒤 v1.0의 Feature/Weight/Threshold/Action Boundary를 고치지 않는다.
  바꾸려면 research_v1.1 / v2.0으로 새 버전을 만든다.
- 데이터 없음을 0점이나 중립으로 만들지 않는다(NOT_AVAILABLE).
- EVENT는 미구현이므로 CHIEF 합산에서 아예 제외한다(중립 50점 금지).
- QUANT는 점수를 내지 않는다. 통계 심판(Metadata/Validation Layer)이다.
- QUANT가 비운 Legacy 29% 지분을 다른 분석가에게 임의 재배분하지 않는다.
- 60D는 산출·기록만 하고 성능은 언급하지 않는다(PERFORMANCE_NOT_YET_MATURED).
"""
import hashlib
import json

# ── VERSION FREEZE ───────────────────────────────────────────────────────────
RESEARCH_MODEL_VERSION = "research_v1.0"
FEATURE_VERSION = "features_v1.0"
LABEL_VERSION = "label_v1.0"   # 시장 초과수익 기준. 평가 시점에 적용한다.

HORIZONS = (5, 20, 60)

# 사전 선언(pre-declared) 가중치. 데이터를 보고 맞춘 값이 아니라
# LOCKED PAPER PACK의 역할 우선순위로 미리 정한 값이다.
# ⚠️ 결과를 보고 이 숫자를 고치면 v1.0의 OOS 자격이 사라진다.
MODEL_C_WEIGHTS = {
    "taro": 0.45,      # 가격·추세 (Brock/Sullivan, Jegadeesh, George&Hwang)
    "flow": 0.35,      # 수급 (Sias, Coval&Stafford, Lou)
    "diana": 0.20,     # 재무 — 현재 Value 축만 가능해 낮게 선언
    # rotation은 점수 투표가 아니라 맥락 레이어라 가중치를 주지 않는다.
    # event는 미구현이라 아예 없다(중립 50점으로 넣지 않는다).
}

# Horizon별로 어느 시간축 신호를 쓰는지 사전 선언한다.
# 단기 반전과 중기 모멘텀을 한 점수에서 상쇄시키지 않기 위한 분리다.
HORIZON_TARO_SPEC = {
    5:  ("ma5Gap", "ret5", "rsi14", "macdHist", "volRatio"),
    20: ("ma20Gap", "ma60Gap", "cross20_60", "pos52w", "macdHist"),
    60: ("ma120Gap", "ma200Gap", "pos52w"),
}

ACTION_BOUNDARY = {"buy": 0.58, "sell": 0.42}   # 사전 선언. 튜닝 금지.
ABSTAIN_BAND = 0.04    # 경계에서 이만큼 이내면 확신 부족으로 관망 쪽으로 보낸다.


def config_hash():
    """v1.0 설정이 바뀌었는지 외부에서 검증할 수 있게 해시를 남긴다."""
    payload = json.dumps({
        "model": RESEARCH_MODEL_VERSION, "features": FEATURE_VERSION,
        "label": LABEL_VERSION, "weights": MODEL_C_WEIGHTS,
        "taroSpec": {str(k): v for k, v in HORIZON_TARO_SPEC.items()},
        "boundary": ACTION_BOUNDARY, "abstain": ABSTAIN_BAND,
    }, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


# ── Point-in-Time QUANT 통계 ─────────────────────────────────────────────────
def build_pit_quant_stats(analysis_data, asof_date, horizon=5):
    """각 Prediction 시점 기준으로 '이미 결과가 끝난' 표본만 모은다.

    ⚠️ 미래정보 차단의 핵심. 전체 역사로 한 번 만든 표를 과거 판단에 쓰면 Look-Ahead다.
    asof_date(판단일) 이전에 horizon이 이미 종료된 구간만 센다.
    즉 시작일 i와 종료일 i+horizon이 모두 asof_date보다 앞서야 한다.

    반환: {"n","w","asof","horizon"} — 승률과 표본수. 점수가 아니다.
    """
    n = w = 0
    last_used = None
    for stock in (analysis_data.get("stocks") or {}).values():
        rows = sorted(
            (r for r in (stock.get("daily") or [])
             if r.get("date") and isinstance(r.get("close"), (int, float))),
            key=lambda r: r["date"])
        for i in range(len(rows) - horizon):
            end = rows[i + horizon]
            # 결과가 asof 이전에 이미 확정된 것만 사용
            if end["date"] >= asof_date:
                break
            if not rows[i]["close"]:
                continue
            n += 1
            if end["close"] > rows[i]["close"]:
                w += 1
            if last_used is None or end["date"] > last_used:
                last_used = end["date"]
    return {"n": n, "w": w, "baseRate": (w / n) if n else None,
            "asof": asof_date, "lastOutcomeDate": last_used, "horizon": horizon}


# ── 분석가 (예측 근거 생산) ───────────────────────────────────────────────────
def _num(value):
    return value if isinstance(value, (int, float)) else None


def _squash(value, scale):
    """값을 -1~+1로 부드럽게 누른다. 극단값이 한 Feature를 지배하지 않게 한다."""
    if value is None:
        return None
    x = value / scale
    return max(-1.0, min(1.0, x))


def taro_research(tech, relative, horizon):
    """가격·추세. Horizon마다 쓰는 신호가 다르다. 없는 값은 NOT_AVAILABLE."""
    tech = tech or {}
    relative = relative or {}
    spec = HORIZON_TARO_SPEC[horizon]
    parts, missing = {}, []

    def put(key, value):
        if value is None:
            missing.append(key)
        else:
            parts[key] = value

    for key in spec:
        if key == "ma5Gap":
            put(key, _squash(_num(tech.get("ma5Gap")), 8.0))
        elif key == "ma20Gap":
            put(key, _squash(_num(tech.get("ma20Gap")), 12.0))
        elif key == "ma60Gap":
            put(key, _squash(_num(tech.get("ma60Gap")), 20.0))
        elif key == "ma120Gap":
            put(key, _squash(_num(tech.get("ma120Gap")), 30.0))
        elif key == "ma200Gap":
            put(key, _squash(_num(tech.get("ma200Gap")), 40.0))
        elif key == "ret5":
            # 단기 반전: 최근 5일 급등은 5D 지평에서 역방향으로 본다(Jegadeesh 2025)
            r5 = _num(relative.get("ret5"))
            put(key, None if r5 is None else -_squash(r5, 15.0))
        elif key == "rsi14":
            rsi = _num(tech.get("rsi14"))
            put(key, None if rsi is None else _squash(rsi - 50.0, 25.0))
        elif key == "macdHist":
            macd, sig = _num(tech.get("macd")), _num(tech.get("macdSignal"))
            close = _num(tech.get("close"))
            if macd is None or sig is None or not close:
                missing.append(key)
            else:
                parts[key] = _squash((macd - sig) / close * 100.0, 3.0)
        elif key == "volRatio":
            vr = _num(tech.get("volRatio"))
            put(key, None if vr is None else _squash(vr - 1.0, 1.5))
        elif key == "pos52w":
            pos = _num((tech.get("_risk") or {}).get("pos52w"))
            put(key, None if pos is None else _squash(pos - 50.0, 40.0))
        elif key == "cross20_60":
            cross = tech.get("cross20_60") or {}
            ev, days = cross.get("event"), _num(cross.get("daysAgo"))
            if ev not in ("golden", "dead") or days is None:
                missing.append(key)
            else:
                decay = max(0.0, 1.0 - days / 60.0)
                parts[key] = (1.0 if ev == "golden" else -1.0) * decay

    if not parts:
        return {"status": "NOT_AVAILABLE", "score": None,
                "used": [], "missing": missing}
    return {"status": "OK", "score": sum(parts.values()) / len(parts),
            "used": sorted(parts), "missing": missing, "parts": parts}


def diana_research(entry):
    """재무. ⚠️ 현재 Value 축(PER/PBR/ROE)만 가능하다.
    Profitability / Investment / Quality 축은 데이터가 없어 NOT_AVAILABLE이다.
    없는 축을 0점으로 채우지 않는다."""
    per, pbr, roe = _num(entry.get("per")), _num(entry.get("pbr")), _num(entry.get("roe"))
    parts, missing = {}, []
    # 저PER·저PBR을 양(+)으로. 음수 PER은 적자라 판단 불가로 둔다.
    if per is not None and per > 0:
        parts["earningsYield"] = _squash(1.0 / per - 0.05, 0.10)
    else:
        missing.append("per")
    if pbr is not None and pbr > 0:
        parts["bookToMarket"] = _squash(1.0 / pbr - 1.0, 1.5)
    else:
        missing.append("pbr")
    if roe is not None:
        parts["roe"] = _squash(roe - 8.0, 20.0)
    else:
        missing.append("roe")
    missing += ["grossProfitability", "operatingProfitability",
                "assetGrowth", "accruals", "leverage"]   # 원천 자체가 없음
    if not parts:
        return {"status": "NOT_AVAILABLE", "score": None, "coverage": "VALUE_ONLY_DIANA",
                "used": [], "missing": missing}
    return {"status": "DIANA_RESEARCH_PARTIAL", "score": sum(parts.values()) / len(parts),
            "coverage": "VALUE_ONLY_DIANA", "used": sorted(parts), "missing": missing}


def flow_research(flow):
    """수급. 정보매매인지 강제매매인지는 판별하지 않는다(데이터 한계)."""
    flow = flow or {}
    parts, missing = {}, []
    ratio = _num(flow.get("flowRatioPct"))
    if ratio is None:
        missing.append("flowRatioPct")
    else:
        parts["flowRatio"] = _squash(ratio, 5.0)
    fbd, obd, days = _num(flow.get("foreignBuyDays")), _num(flow.get("organBuyDays")), _num(flow.get("days"))
    if fbd is None or obd is None or not days:
        missing.append("persistence")
    else:
        parts["persistence"] = _squash((fbd + obd) / (2.0 * days) - 0.5, 0.5)
    div = flow.get("divergence")
    if div in ("accumulation", "distribution"):
        parts["divergence"] = 1.0 if div == "accumulation" else -1.0
    else:
        missing.append("divergence")
    missing.append("netBuy20D")   # 현재 5D까지만 집계됨
    if not parts:
        return {"status": "NOT_AVAILABLE", "score": None, "used": [], "missing": missing}
    return {"status": "OK", "score": sum(parts.values()) / len(parts),
            "used": sorted(parts), "missing": missing}


def rotation_context(relative):
    """업종 맥락 레이어. ⚠️ 독립 BUY 엔진이 아니다. 점수 투표를 하지 않는다."""
    relative = relative or {}
    pct = _num(relative.get("sectorPercentile"))
    vs = _num(relative.get("vsSector"))
    if pct is None and vs is None:
        return {"status": "NOT_AVAILABLE", "sectorPercentile": None, "vsSector": None}
    return {"status": "OK", "sectorPercentile": pct, "vsSector": vs,
            "role": "INDUSTRY_CONTEXT_LAYER"}


def event_state():
    """DART/SEC 미구현. ⚠️ 중립 50점으로 만들지 않는다. CHIEF 합산에서 제외한다."""
    return {"status": "EVENT_NOT_IMPLEMENTED",
            "note": "정보 없음은 중립 정보가 아니다. 합산에서 제외한다.",
            "officialEvent": "NOT_AVAILABLE",
            "generalNews": "GENERAL_NEWS_NOT_COVERED",
            "consensus": "CONSENSUS_DATA_UNAVAILABLE"}


# ── QUANT: 통계 심판 (점수 생산자가 아님) ─────────────────────────────────────
def quant_referee(analyst_outputs, pit_stats, market_regime):
    """CHIEF에게 '이 증거를 얼마나 믿을 수 있는지'만 알려준다.
    ⚠️ 방향 점수를 내지 않는다. Legacy의 29% 지분을 대체하지 않는다."""
    available = [k for k, v in analyst_outputs.items()
                 if isinstance(v, dict) and v.get("score") is not None]
    missing_total = sum(len(v.get("missing") or []) for v in analyst_outputs.values()
                        if isinstance(v, dict))
    n = (pit_stats or {}).get("n") or 0
    if n >= 20000:
        sample_quality = "HIGH"
    elif n >= 5000:
        sample_quality = "MEDIUM"
    elif n > 0:
        sample_quality = "LOW"
    else:
        sample_quality = "NONE"
    return {
        "role": "STATISTICAL_REFEREE",
        "producesScore": False,
        "availableAnalysts": sorted(available),
        "availableCount": len(available),
        "missingFeatureCount": missing_total,
        "sampleQuality": sample_quality,
        "pitSampleN": n,
        "pitBaseRate": (pit_stats or {}).get("baseRate"),
        "quantStatsAsof": (pit_stats or {}).get("asof"),
        "regimeKey": (market_regime or {}).get("key"),
        "incrementalEvidence": "NOT_EVALUATED",   # PHASE D에서 Ablation으로 측정
        "regimeStability": "NOT_EVALUATED",
    }


# ── RISK: Safety Gate ────────────────────────────────────────────────────────
def risk_gate(entry, market_regime):
    """계산 가능한 위험만 판정하고, 불가능한 축은 NOT_AVAILABLE로 남긴다.
    ⚠️ 없는 위험정보를 '위험 없음'으로 취급하지 않는다."""
    risk = entry.get("risk") or {}
    reasons, state = [], "NORMAL"
    hard = False

    # F. 데이터 위험 — Hard Gate 대상
    if entry.get("stale") is True:
        hard = True
        reasons.append("STALE_PRICE")
    if not _num(entry.get("price")):
        hard = True
        reasons.append("NO_PRICE")
    tech = entry.get("tech") or {}
    if not tech:
        hard = True
        reasons.append("NO_INDICATORS")

    # B/C. 변동성·하방
    vol, mdd = _num(risk.get("vol20")), _num(risk.get("mdd3m"))
    grade = risk.get("grade")
    if grade == "high":
        state = "HIGH_RISK"
        reasons.append("HIGH_VOLATILITY_GRADE")
    elif grade == "mid":
        state = "ELEVATED_RISK"
    if vol is not None and vol >= 8.0:
        state = "HIGH_RISK"
        reasons.append("VOL20_EXTREME")
    if mdd is not None and mdd <= -50.0:
        if state == "NORMAL":
            state = "ELEVATED_RISK"
        reasons.append("DEEP_DRAWDOWN_3M")

    # A. 시장 국면
    if (market_regime or {}).get("vol") == "high":
        reasons.append("MARKET_HIGH_VOL")

    if hard:
        state = "JUDGMENT_WITHHELD"

    return {
        "state": state,
        "hardGate": hard,
        "reasons": reasons,
        "dimensions": {
            "marketRegime": "OK" if market_regime else "NOT_AVAILABLE",
            "volatility": "OK" if vol is not None else "NOT_AVAILABLE",
            "drawdown": "OK" if mdd is not None else "NOT_AVAILABLE",
            "liquidity": "PARTIAL",             # 거래대금만. Spread 없음
            "financialDistress": "NOT_AVAILABLE",   # 재무제표 없음
            "eventRisk": "NOT_AVAILABLE",           # DART/SEC 미구현
            "dataRisk": "OK",
        },
    }


# ── CHIEF: 최종 의사결정 (Candidate 병렬) ────────────────────────────────────
def _to_probability(score):
    """사전 선언한 고정 변환. ⚠️ Calibration되지 않았다(PHASE E 과제)."""
    if score is None:
        return None
    return max(0.02, min(0.98, 0.5 + 0.5 * max(-1.0, min(1.0, score)) * 0.6))


def _action_from(prob, risk_state):
    if risk_state == "JUDGMENT_WITHHELD":
        return "JUDGMENT_WITHHELD", ["RISK_HARD_GATE"]
    if prob is None:
        return "ABSTAIN", ["NO_PREDICTIVE_INPUT"]
    codes = []
    if abs(prob - ACTION_BOUNDARY["buy"]) < ABSTAIN_BAND or \
       abs(prob - ACTION_BOUNDARY["sell"]) < ABSTAIN_BAND:
        codes.append("NEAR_BOUNDARY")
    if prob >= ACTION_BOUNDARY["buy"]:
        return ("BUY_CONSIDER" if "NEAR_BOUNDARY" not in codes else "WATCH"), codes
    if prob <= ACTION_BOUNDARY["sell"]:
        return ("SELL_CONSIDER" if "NEAR_BOUNDARY" not in codes else "WATCH"), codes
    return "HOLD_WATCH", codes


def _reliability(quant, analysts):
    """확률과 분리된 '데이터·모델 신뢰등급'. 확률과 한 숫자로 합치지 않는다."""
    avail = quant["availableCount"]
    if avail >= 3 and quant["sampleQuality"] in ("HIGH", "MEDIUM"):
        grade = "B"      # 현재 구조상 A는 없다. EVENT·재무가 통째로 비어 있기 때문.
    elif avail >= 2:
        grade = "C"
    elif avail >= 1:
        grade = "D"
    else:
        grade = "F"
    return {"grade": grade,
            "cap": "A_NOT_REACHABLE_WITHOUT_EVENT_AND_FINANCIALS",
            "availableAnalysts": avail,
            "sampleQuality": quant["sampleQuality"]}


def chief_candidates(analysts, risk_state):
    """MODEL B(균등) / MODEL C(사전 선언 고정)를 병렬 산출한다.
    ⚠️ Legacy 29% 공백을 다른 분석가에게 재배분하지 않는다.
    ⚠️ MODEL D(메타 모델)는 데이터가 충분해질 때까지 만들지 않는다."""
    usable = {k: v["score"] for k, v in analysts.items()
              if isinstance(v, dict) and v.get("score") is not None}
    if not usable:
        return {
            "MODEL_B_equalWeight": {"score": None, "probability": None,
                                    "action": "ABSTAIN", "reasonCodes": ["NO_PREDICTIVE_INPUT"]},
            "MODEL_C_preDeclared": {"score": None, "probability": None,
                                    "action": "ABSTAIN", "reasonCodes": ["NO_PREDICTIVE_INPUT"]},
            "MODEL_D_metaModel": {"status": "NOT_BUILT_INSUFFICIENT_DATA"},
        }
    b_score = sum(usable.values()) / len(usable)
    wsum = sum(MODEL_C_WEIGHTS.get(k, 0.0) for k in usable)
    c_score = (sum(MODEL_C_WEIGHTS.get(k, 0.0) * v for k, v in usable.items()) / wsum) if wsum else None
    out = {}
    for name, sc in (("MODEL_B_equalWeight", b_score), ("MODEL_C_preDeclared", c_score)):
        prob = _to_probability(sc)
        action, codes = _action_from(prob, risk_state)
        out[name] = {"score": None if sc is None else round(sc, 4),
                     "probability": None if prob is None else round(prob, 4),
                     "probabilityCalibrated": False,
                     "action": action, "reasonCodes": codes,
                     "usedAnalysts": sorted(usable)}
    out["MODEL_D_metaModel"] = {"status": "NOT_BUILT_INSUFFICIENT_DATA"}
    return out


# ── 진입점 ───────────────────────────────────────────────────────────────────
def predict(entry, market_regime, pit_stats, created_at, input_timestamp,
            matured_horizons=()):
    """한 종목의 Research Shadow 판단. Legacy 결과는 건드리지 않는다.

    matured_horizons: 이 시점에서 이미 평가 가능한 지평(보통 비어 있다).
    """
    tech = dict(entry.get("tech") or {})
    tech["_risk"] = entry.get("risk") or {}
    relative = entry.get("relative") or {}

    diana = diana_research(entry)
    flow = flow_research(entry.get("flow"))
    rotation = rotation_context(relative)
    event = event_state()
    risk = risk_gate(entry, market_regime)

    horizons = {}
    quant_snapshot = None
    for h in HORIZONS:
        taro = taro_research(tech, relative, h)
        analysts = {"taro": taro, "diana": diana, "flow": flow}
        quant = quant_referee(analysts, pit_stats, market_regime)
        quant_snapshot = quant
        cands = chief_candidates(analysts, risk["state"])
        primary = cands["MODEL_C_preDeclared"]
        matured = h in matured_horizons
        horizons[str(h)] = {
            "primaryAction": primary["action"],
            "probability": primary["probability"],
            "probabilityCalibrated": False,
            "candidates": cands,
            "taro": {"status": taro["status"], "used": taro["used"], "missing": taro["missing"]},
            "maturity": "MATURED" if matured else "PENDING_NOT_MATURED",
            "performanceStatus": "EVALUATED" if matured else "PERFORMANCE_NOT_YET_MATURED",
            "reasonCodes": primary["reasonCodes"],
        }

    return {
        "researchModelVersion": RESEARCH_MODEL_VERSION,
        "featureVersion": FEATURE_VERSION,
        "labelVersion": LABEL_VERSION,
        "configHash": config_hash(),
        "createdAt": created_at,
        "inputTimestamp": input_timestamp,
        "quantStatsAsof": (pit_stats or {}).get("asof"),
        "horizons": horizons,
        "analysts": {
            "diana": {"status": diana["status"], "coverage": diana.get("coverage"),
                      "used": diana["used"], "missing": diana["missing"]},
            "flow": {"status": flow["status"], "used": flow["used"], "missing": flow["missing"]},
            "rotation": rotation,
            "event": event,
        },
        "quant": quant_snapshot,
        "risk": risk,
        "reliability": _reliability(quant_snapshot,
                                    {"taro": None, "diana": diana, "flow": flow}),
        "usValidation": "US_VALIDATION_NOT_AVAILABLE",
        "note": "Shadow 전용. 화면에 노출되지 않으며 Legacy 판단을 대체하지 않는다.",
    }
