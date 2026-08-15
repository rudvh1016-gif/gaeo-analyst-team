#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 연구모델 C — research_v2.0 (DART Point-in-Time 활용 차세대 그림자 모델).

⚠️ research_v1.0 / research_v1.1은 이 파일에서 절대 수정하지 않는다.
   read-only로 import해서 같은 조건을 그대로 쓰고, DART 맥락만 더한다.

⚠️ Production 사용 금지. 화면에 나가지 않는다. 자동승격 없다.

설계의 핵심 — 공정한 비교
    연구 B의 각 Candidate에 대해, **같은 prediction timestamp·같은 입력·같은
    non-DART feature**를 가진 C counterpart를 만든다.
    그래야 나중에 "DART가 실제로 추가 가치가 있었는가"를 직접 비교할 수 있다.

    공시가 없고 DART 추가 정보가 없으면 B와 같은 판단이 나온다. 그게 정상이고,
    그 자체가 DART incremental test의 control이다.
    "DART를 넣었으니 점수가 달라져야 한다"고 억지로 만들지 않는다.

DART 사용 범위 (지금 단계)
    - EVENT 존재 여부 / 탐지 시각 / 정정 여부 / coverage 상태
    - 공식 재무 자료의 존재·신선도
    - 검증된 안전 게이트

    ⚠️ 재무 Feature로 방향점수를 만들지 않는다. DIANA v2 Registry 기준으로
       PAPER_EXACT가 아직 0개이기 때문이다(docs/gaeo_diana_v2_feature_registry.md).
       DIANA_DART_PARTIAL로 남기고 없는 값을 0/50으로 채우지 않는다.

Point-in-Time
    event.detected_at <= prediction_timestamp 인 공시만 쓴다.
    문자열이 아니라 UTC Instant로 비교한다(dart_time.instant_le).
    과거 공시를 backfill해서 그날 아침 Prediction이 알고 있었던 것처럼 만들지 않는다.
"""
import hashlib
import json

import dart_time
import research_engine as v10        # read-only
import research_engine_v11 as v11    # read-only

# ── VERSION FREEZE ───────────────────────────────────────────────────────────
RESEARCH_MODEL_VERSION = "research_v2.0"
FEATURE_VERSION = "features_v2.0"
LABEL_VERSION = "label_v1.0"          # B와 같은 라벨. 비교 가능해야 한다.

HORIZONS = v11.HORIZONS

# B의 설정을 그대로 snapshot한다. B 파일을 수정하지 않고 값만 복사해 동결한다.
INHERITED_FROM = v11.RESEARCH_MODEL_VERSION
INHERITED_CONFIG_HASH = v11.config_hash()
CHIEF_SCHEMES = dict(v11.CHIEF_SCHEMES)
SHORT_SIGNAL_MODES = dict(v11.SHORT_SIGNAL_MODES)
HORIZON_TARO_SPEC = dict(v11.HORIZON_TARO_SPEC)
ACTION_BOUNDARY = dict(v11.ACTION_BOUNDARY)
ABSTAIN_BAND = v11.ABSTAIN_BAND

# DART 맥락 상태값
DART_CONTEXT_NONE = "NO_DART_CONTEXT"
DIANA_DART_PARTIAL = "DIANA_DART_PARTIAL"
DART_EVENT_NOT_VISIBLE_YET = "EVENT_NOT_VISIBLE_AT_PREDICTION_TIME"

REGISTERED_UNBUILT = dict(v11.REGISTERED_UNBUILT_CANDIDATES)
REGISTERED_UNBUILT["DART_FINANCIAL_DIRECTIONAL_FEATURES"] = {
    "status": "NOT_BUILT_PAPER_FORMULA_NOT_READY",
    "blocker": ("DIANA v2 Registry 기준 PAPER_EXACT 0개. "
                "operatingProfitability는 NOT_READY, accruals는 CASH_FLOW_PROXY다."),
}


def config_hash():
    payload = json.dumps({
        "model": RESEARCH_MODEL_VERSION, "features": FEATURE_VERSION,
        "label": LABEL_VERSION, "inherited": INHERITED_CONFIG_HASH,
        "schemes": CHIEF_SCHEMES, "shortModes": SHORT_SIGNAL_MODES,
        "taroSpec": {str(k): v for k, v in HORIZON_TARO_SPEC.items()},
        "boundary": ACTION_BOUNDARY, "abstain": ABSTAIN_BAND,
        "dartUsage": "context_only_no_directional_score",
    }, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


# ── DART 맥락 (방향점수가 아니다) ─────────────────────────────────────────────
def dart_context(events, prediction_timestamp, coverage_state=None,
                 financial=None):
    """그 시점에 우리가 알 수 있었던 공시 맥락만 정리한다.

    ⚠️ 점수를 만들지 않는다. "공시가 있으니 +10점" 같은 짓을 하지 않는다.
    ⚠️ detected_at이 prediction_timestamp보다 늦은 공시는 아예 보이지 않는다.
    """
    events = events or []
    visible = [e for e in events
               if dart_time.instant_le(e.get("detected_at"), prediction_timestamp)]
    hidden = len(events) - len(visible)
    corrections = [e for e in visible if e.get("is_correction")]
    return {
        "role": "OFFICIAL_FILING_CONTEXT",
        "producesScore": False,
        "predictionTimestamp": prediction_timestamp,
        "visibleEventCount": len(visible),
        "hiddenNotYetDetected": hidden,
        "hiddenNote": DART_EVENT_NOT_VISIBLE_YET if hidden else None,
        "hasOfficialEvent": bool(visible),
        "correctionCount": len(corrections),
        "latestReportName": (visible[-1].get("report_name") if visible else None),
        "latestDetectedAt": (visible[-1].get("detected_at") if visible else None),
        # ⚠️ '공시 없음'은 '악재 없음'이 아니다. DART는 일반 뉴스 커버리지가 아니다.
        "coverageState": coverage_state or DART_CONTEXT_NONE,
        "coverageNote": ("공식 공시만 본 결과다. 일반 언론뉴스는 포함되지 않는다."),
        # 재무는 존재·신선도만. 방향점수를 만들지 않는다.
        "financial": financial or {"status": DIANA_DART_PARTIAL,
                                   "available": False,
                                   "note": "PAPER_EXACT Feature가 없어 점수화하지 않는다"},
    }


def reliability_with_dart(base_reliability, context):
    """DART 맥락이 '데이터가 얼마나 갖춰졌나'에만 영향을 준다.

    방향(BUY/SELL)에는 손대지 않는다. 신뢰등급은 여전히 종목을 구분하지 못하므로
    RELIABILITY_NOT_DIFFERENTIATED 상태와 UI 노출 금지를 그대로 유지한다.
    """
    out = dict(base_reliability)
    out["dartCoverage"] = context.get("coverageState")
    out["dartVisibleEvents"] = context.get("visibleEventCount")
    out["financialStatus"] = (context.get("financial") or {}).get("status")
    return out


# ── 진입점 ───────────────────────────────────────────────────────────────────
def predict(entry, market_regime, pit_stats_by_horizon, created_at, input_timestamp,
            dart_events=None, dart_coverage=None, dart_financial=None,
            matured_horizons=()):
    """연구모델 C의 한 종목 판단.

    non-DART 부분은 연구 B와 **완전히 같은 계산**을 쓴다(v11 함수를 그대로 호출).
    그 위에 DART 맥락을 별도 블록으로 얹는다. 방향점수는 바뀌지 않는다.
    → B candidate X 와 C candidate X 가 같은 조건의 짝(pair)이 된다.
    """
    # B와 동일한 계산. B 코드를 고치지 않고 그대로 호출한다.
    base = v11.predict(entry, market_regime, pit_stats_by_horizon,
                       created_at=created_at, input_timestamp=input_timestamp,
                       matured_horizons=matured_horizons)

    context = dart_context(dart_events, created_at, dart_coverage, dart_financial)

    candidates = {}
    for cid, cv in (base.get("candidates") or {}).items():
        pair = dict(cv)
        pair["candidateModelId"] = cid
        pair["modelVersion"] = RESEARCH_MODEL_VERSION
        pair["featureVersion"] = FEATURE_VERSION
        pair["labelVersion"] = LABEL_VERSION
        pair["configHash"] = config_hash()
        # 짝 비교의 핵심 — 어떤 B 후보와 1:1로 대응하는지 명시한다.
        pair["pairedWith"] = {"model": INHERITED_FROM, "candidateModelId": cid,
                              "configHash": INHERITED_CONFIG_HASH}
        pair["dartContextApplied"] = context["hasOfficialEvent"]
        # ⚠️ 방향점수는 B와 동일하다. DART는 아직 방향에 개입하지 않는다.
        pair["directionIdenticalToPair"] = True
        candidates[cid] = pair

    return {
        "researchModelVersion": RESEARCH_MODEL_VERSION,
        "featureVersion": FEATURE_VERSION,
        "labelVersion": LABEL_VERSION,
        "configHash": config_hash(),
        "inheritedFrom": INHERITED_FROM,
        "inheritedConfigHash": INHERITED_CONFIG_HASH,
        "createdAt": created_at,
        "inputTimestamp": input_timestamp,
        "quantStatsAsof": base.get("quantStatsAsof"),
        "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
        "candidates": candidates,
        "unbuiltCandidates": REGISTERED_UNBUILT,
        "analysts": base.get("analysts"),
        "quant": base.get("quant"),
        "risk": base.get("risk"),
        "dart": context,
        "reliability": reliability_with_dart(base.get("reliability") or {}, context),
        "usValidation": "US_VALIDATION_NOT_AVAILABLE",
        "note": ("Shadow 전용. Production에 쓰이지 않는다. "
                 "연구모델 B와 같은 조건에 DART 맥락만 더한 짝이며, "
                 "공시가 없으면 B와 같은 판단이 나오는 것이 정상이다(대조군)."),
    }
