#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Research Shadow Engine — research_v1.1 (PHASE C FINAL HARDENING)

⚠️ research_v1.0(research_engine.py)은 이 파일에서 절대 수정하지 않는다.
   v1.0은 이미 배포된 Candidate이므로 그대로 두고, 방법론 교정은 새 버전으로 만든다.
   두 버전은 앞으로 각각 별도로 성능을 측정한다.

v1.0 대비 바뀐 것 (설계 오류/불명확성 교정. 결과를 보고 한 튜닝이 아니다)

1. 5D 단기신호를 확정 정의로 쓰지 않는다.
   v1.0은 ret5 부호를 뒤집어(-ret5) SHORT REVERSAL 하나로 확정했다.
   "단기 반전이 존재할 수 있다"와 "모든 종목에서 5일 수익률 부호를 뒤집으면
   다음 5일 예측력이 높다"는 전혀 다른 주장이다. v1.1은 둘을 분리해서
   SHORT_REVERSAL_CANDIDATE / SHORT_MOMENTUM_CANDIDATE를 동시에 기록한다.
   유동성 조건부 신호(CONDITIONAL_SHORT_LIQUIDITY)는 후보로 등록만 하고 미구현이다.

2. 45/35/20을 검증된 가중치라고 부르지 않는다.
   이름을 PREDECLARED_CANDIDATE_45_35_20으로 바꾸고 대표모델 지정을 없앴다.
   v1.1에는 primaryAction이 아예 없다(NO_PRIMARY_CANDIDATE_SELECTED).

3. Candidate를 전부 같은 Prediction timestamp에 함께 저장한다.
   나중에 과거 입력으로 다시 계산해서 성적을 만드는 일을 막기 위해서다.

4. Reliability는 종목을 구분하지 못하므로 RELIABILITY_NOT_DIFFERENTIATED다.
   UI 노출 금지 상태로 명시한다.

5. QUANT PIT 통계를 Horizon별로 따로 만든다.
   v1.0은 5D 표를 20D/60D 판단의 메타데이터에도 그대로 붙였다.
   (QUANT는 점수를 내지 않으므로 v1.0의 점수 자체에는 영향이 없었다.)
"""
import hashlib
import json

import research_engine as v10   # v1.0은 읽기만 한다. 절대 수정하지 않는다.

# ── VERSION FREEZE ───────────────────────────────────────────────────────────
RESEARCH_MODEL_VERSION = "research_v1.1"
FEATURE_VERSION = "features_v1.1"   # 5D 단기신호 구조가 바뀌었으므로 올린다
LABEL_VERSION = "label_v1.0"        # 라벨 정의는 v1.0과 동일

HORIZONS = (5, 20, 60)

# ── CHIEF 가중 스킴 (둘 다 Candidate. 어느 쪽도 대표모델이 아니다) ──────────────
CHIEF_SCHEMES = {
    # 점수가 있는 분석가만 균등 평균
    "MODEL_B_EQUAL_WEIGHT": None,
    # 사전 선언 가중치. ⚠️ 최적이라는 근거는 없다. 결과를 보고 조정하지 않는다.
    "PREDECLARED_CANDIDATE_45_35_20": {"taro": 0.45, "flow": 0.35, "diana": 0.20},
}

# ── 5D 단기신호 모드 (분리 기록) ──────────────────────────────────────────────
SHORT_SIGNAL_MODES = {
    # 최근 5일 수익률이 높을수록 다음 5일에 불리하다고 보는 쪽
    "SHORT_REVERSAL_CANDIDATE": -1.0,
    # 최근 5일 수익률이 높을수록 다음 5일에 유리하다고 보는 쪽
    "SHORT_MOMENTUM_CANDIDATE": +1.0,
}

# 아직 만들지 않은 후보. 이름만 등록해 두고 구현하지 않는다.
REGISTERED_UNBUILT_CANDIDATES = {
    "CONDITIONAL_SHORT_LIQUIDITY_CANDIDATE": {
        "status": "REGISTERED_NOT_IMPLEMENTED",
        "idea": "거래대금·거래량·회전율 맥락에 따라 단기 반전과 단기 모멘텀을 나눠 쓰는 조건부 신호",
        "blocker": "회전율(turnover)·유동성 지표가 현재 파이프라인에 없다",
    },
    "MODEL_D_META_MODEL": {
        "status": "NOT_BUILT_INSUFFICIENT_DATA",
        "blocker": "성숙한 Research 표본이 0건이다",
    },
}

HORIZON_TARO_SPEC = {
    5:  ("ma5Gap", "ret5", "rsi14", "macdHist", "volRatio"),
    20: ("ma20Gap", "ma60Gap", "cross20_60", "pos52w", "macdHist"),
    60: ("ma120Gap", "ma200Gap", "pos52w"),
}

ACTION_BOUNDARY = {"buy": 0.58, "sell": 0.42}   # 사전 선언. 튜닝 금지.
ABSTAIN_BAND = 0.04


def config_hash():
    payload = json.dumps({
        "model": RESEARCH_MODEL_VERSION, "features": FEATURE_VERSION,
        "label": LABEL_VERSION, "schemes": CHIEF_SCHEMES,
        "shortModes": SHORT_SIGNAL_MODES,
        "taroSpec": {str(k): v for k, v in HORIZON_TARO_SPEC.items()},
        "boundary": ACTION_BOUNDARY, "abstain": ABSTAIN_BAND,
    }, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


# ── Point-in-Time QUANT (Outcome Maturity까지 차단) ───────────────────────────
def build_pit_quant_stats(analysis_data, asof_date, horizon):
    """asof 시점에 '결과가 이미 완전히 확정된' 구간만 센다.

    ⚠️ 조건은 "시작일 < asof"가 아니라 "종료일(결과 확정일) < asof"다.
       2026-08-15 시점의 통계가 2026-08-10에 시작된 20일 구간의 결과를
       알고 있으면 Look-Ahead다. 그 구간은 종료일이 미래이므로 제외된다.

    반환에 outcomeMaturityRule을 함께 남겨, 어떤 조건으로 걸렀는지 기록한다.
    """
    n = w = 0
    last_outcome = None
    latest_excluded_start = None
    for stock in (analysis_data.get("stocks") or {}).values():
        rows = sorted(
            (r for r in (stock.get("daily") or [])
             if r.get("date") and isinstance(r.get("close"), (int, float))),
            key=lambda r: r["date"])
        for i in range(len(rows) - horizon):
            start, end = rows[i], rows[i + horizon]
            if end["date"] >= asof_date:
                # 시작일은 과거지만 결과가 아직 안 끝난 구간 — 반드시 제외한다.
                if start["date"] < asof_date:
                    if latest_excluded_start is None or start["date"] > latest_excluded_start:
                        latest_excluded_start = start["date"]
                break
            if not start["close"]:
                continue
            n += 1
            if end["close"] > start["close"]:
                w += 1
            if last_outcome is None or end["date"] > last_outcome:
                last_outcome = end["date"]
    return {
        "n": n, "w": w, "baseRate": (w / n) if n else None,
        "asof": asof_date, "horizon": horizon,
        "lastOutcomeDate": last_outcome,
        # 아래 값이 asof보다 크거나 같으면, 시작일 기준으로만 걸렀다는 뜻이라 위반이다.
        "latestExcludedStartDate": latest_excluded_start,
        "outcomeMaturityRule": "OUTCOME_DATE_STRICTLY_BEFORE_ASOF",
    }


def build_pit_quant_stats_all(analysis_data, asof_date, horizons=HORIZONS):
    """Horizon마다 별도 표를 만든다. 5D 표를 20D/60D에 돌려쓰지 않는다."""
    return {str(h): build_pit_quant_stats(analysis_data, asof_date, h) for h in horizons}


# ── TARO (5D 단기신호 모드 분리) ──────────────────────────────────────────────
def taro_research(tech, relative, horizon, short_mode):
    """v1.0과 같은 Feature를 쓰되, 5D의 ret5 부호를 short_mode가 정한다.

    short_mode는 SHORT_SIGNAL_MODES의 키여야 한다. 기본값을 두지 않는다 —
    "어느 쪽이 맞다"를 코드가 몰래 정하지 않게 하기 위해서다.
    """
    if short_mode not in SHORT_SIGNAL_MODES:
        raise ValueError(f"알 수 없는 short_mode: {short_mode}")
    sign = SHORT_SIGNAL_MODES[short_mode]
    tech = tech or {}
    relative = relative or {}
    parts, missing = {}, []

    def put(key, value):
        if value is None:
            missing.append(key)
        else:
            parts[key] = value

    for key in HORIZON_TARO_SPEC[horizon]:
        if key == "ma5Gap":
            put(key, v10._squash(v10._num(tech.get("ma5Gap")), 8.0))
        elif key == "ma20Gap":
            put(key, v10._squash(v10._num(tech.get("ma20Gap")), 12.0))
        elif key == "ma60Gap":
            put(key, v10._squash(v10._num(tech.get("ma60Gap")), 20.0))
        elif key == "ma120Gap":
            put(key, v10._squash(v10._num(tech.get("ma120Gap")), 30.0))
        elif key == "ma200Gap":
            put(key, v10._squash(v10._num(tech.get("ma200Gap")), 40.0))
        elif key == "ret5":
            r5 = v10._num(relative.get("ret5"))
            put(key, None if r5 is None else sign * v10._squash(r5, 15.0))
        elif key == "rsi14":
            rsi = v10._num(tech.get("rsi14"))
            put(key, None if rsi is None else v10._squash(rsi - 50.0, 25.0))
        elif key == "macdHist":
            macd, sig = v10._num(tech.get("macd")), v10._num(tech.get("macdSignal"))
            close = v10._num(tech.get("close"))
            if macd is None or sig is None or not close:
                missing.append(key)
            else:
                parts[key] = v10._squash((macd - sig) / close * 100.0, 3.0)
        elif key == "volRatio":
            vr = v10._num(tech.get("volRatio"))
            put(key, None if vr is None else v10._squash(vr - 1.0, 1.5))
        elif key == "pos52w":
            pos = v10._num((tech.get("_risk") or {}).get("pos52w"))
            put(key, None if pos is None else v10._squash(pos - 50.0, 40.0))
        elif key == "cross20_60":
            cross = tech.get("cross20_60") or {}
            ev, days = cross.get("event"), v10._num(cross.get("daysAgo"))
            if ev not in ("golden", "dead") or days is None:
                missing.append(key)
            else:
                parts[key] = (1.0 if ev == "golden" else -1.0) * max(0.0, 1.0 - days / 60.0)

    if not parts:
        return {"status": "NOT_AVAILABLE", "score": None, "used": [], "missing": missing,
                "shortSignalMode": short_mode if horizon == 5 else "NOT_APPLICABLE"}
    return {"status": "OK", "score": sum(parts.values()) / len(parts),
            "used": sorted(parts), "missing": missing, "parts": parts,
            "shortSignalMode": short_mode if horizon == 5 else "NOT_APPLICABLE"}


def _combine(scheme_name, analysts):
    """가중 스킴 하나로 점수를 합친다. 점수가 없는 분석가는 아예 빼고 계산한다.
    ⚠️ 없는 분석가를 중립값으로 채워 넣지 않는다."""
    usable = {k: v["score"] for k, v in analysts.items()
              if isinstance(v, dict) and v.get("score") is not None}
    if not usable:
        return None, []
    weights = CHIEF_SCHEMES[scheme_name]
    if weights is None:      # 균등
        return sum(usable.values()) / len(usable), sorted(usable)
    wsum = sum(weights.get(k, 0.0) for k in usable)
    if not wsum:
        return None, sorted(usable)
    return sum(weights.get(k, 0.0) * v for k, v in usable.items()) / wsum, sorted(usable)


def reliability_state(quant):
    """⚠️ 현재 이 등급은 종목을 구분하지 못한다(전 종목 동일 등급).
    사용자에게 '이 종목의 신뢰등급'처럼 보여주면 안 된다."""
    internal = v10._reliability(quant, {})["grade"]
    return {
        "status": "RELIABILITY_NOT_DIFFERENTIATED",
        "internalGrade": internal,
        "uiDisplay": "SUPPRESSED",
        "reason": "DART·재무 신선도·이벤트 커버리지·결측도·표본품질이 아직 종목별로 다르지 않다",
        "activateWhen": "위 축 중 최소 하나가 종목별로 실제 차이를 만들 때 A/B/C 표시를 켠다",
    }


# ── 진입점 ───────────────────────────────────────────────────────────────────
def predict(entry, market_regime, pit_stats_by_horizon, created_at, input_timestamp,
            matured_horizons=()):
    """한 종목의 v1.1 Research Shadow 판단.

    Candidate를 전부 같은 predictionTimestamp에 산출해서 함께 반환한다.
    대표 Candidate를 고르지 않는다(NO_PRIMARY_CANDIDATE_SELECTED).
    """
    tech = dict(entry.get("tech") or {})
    tech["_risk"] = entry.get("risk") or {}
    relative = entry.get("relative") or {}

    diana = v10.diana_research(entry)
    flow = v10.flow_research(entry.get("flow"))
    rotation = v10.rotation_context(relative)
    event = v10.event_state()
    risk = v10.risk_gate(entry, market_regime)

    pit = pit_stats_by_horizon or {}
    quant_by_h = {}
    for h in HORIZONS:
        # QUANT는 Horizon별 PIT 표를 각각 본다. 5D 표를 20D에 돌려쓰지 않는다.
        # taro는 '자료가 있는지'만 세면 되고, short_mode는 부호만 바꾸므로
        # 어느 모드로 계산해도 가용성 판정이 같다(테스트로 고정).
        taro_avail = taro_research(tech, relative, h, "SHORT_REVERSAL_CANDIDATE")
        quant_by_h[str(h)] = v10.quant_referee(
            {"taro": taro_avail, "diana": diana, "flow": flow}, pit.get(str(h)), market_regime)

    candidates = {}
    for scheme in CHIEF_SCHEMES:
        for mode in SHORT_SIGNAL_MODES:
            cid = f"{scheme}__{mode}"
            horizons = {}
            for h in HORIZONS:
                taro = taro_research(tech, relative, h, mode)
                score, used = _combine(scheme, {"taro": taro, "diana": diana, "flow": flow})
                prob = v10._to_probability(score)
                action, codes = v10._action_from(prob, risk["state"])
                horizons[str(h)] = {
                    "action": action,
                    "score": None if score is None else round(score, 4),
                    "probability": None if prob is None else round(prob, 4),
                    "probabilityCalibrated": False,
                    "reasonCodes": codes,
                    "usedAnalysts": used,
                    "taroStatus": taro["status"],
                    "shortSignalMode": taro["shortSignalMode"],
                    "maturity": "MATURED" if h in matured_horizons else "PENDING_NOT_MATURED",
                    "performanceStatus": ("EVALUATED" if h in matured_horizons
                                          else "PERFORMANCE_NOT_YET_MATURED"),
                    "quantStatsAsof": (pit.get(str(h)) or {}).get("asof"),
                }
            candidates[cid] = {
                "candidateModelId": cid,
                "chiefScheme": scheme,
                "shortSignalMode": mode,
                "status": "PREDECLARED_UNVALIDATED",
                "isRepresentativeModel": False,
                "predictionTimestamp": created_at,
                "modelVersion": RESEARCH_MODEL_VERSION,
                "featureVersion": FEATURE_VERSION,
                "labelVersion": LABEL_VERSION,
                "configHash": config_hash(),
                "inputTimestamp": input_timestamp,
                "horizons": horizons,
            }

    return {
        "researchModelVersion": RESEARCH_MODEL_VERSION,
        "featureVersion": FEATURE_VERSION,
        "labelVersion": LABEL_VERSION,
        "configHash": config_hash(),
        "createdAt": created_at,
        "inputTimestamp": input_timestamp,
        "quantStatsAsof": {h: (pit.get(h) or {}).get("asof") for h in ("5", "20", "60")},
        "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
        "candidates": candidates,
        "unbuiltCandidates": REGISTERED_UNBUILT_CANDIDATES,
        "analysts": {
            "diana": {"status": diana["status"], "coverage": diana.get("coverage"),
                      "used": diana["used"], "missing": diana["missing"]},
            "flow": {"status": flow["status"], "used": flow["used"], "missing": flow["missing"]},
            "rotation": rotation,
            "event": event,
        },
        "quant": quant_by_h,
        "risk": risk,
        "reliability": reliability_state(quant_by_h["5"]),
        "usValidation": "US_VALIDATION_NOT_AVAILABLE",
        "note": "Shadow 전용. 화면에 노출되지 않으며 Legacy 판단을 대체하지 않는다. "
                "대표 Candidate를 고르지 않았고 성능 비교도 하지 않았다.",
    }
