#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 모델 레지스트리 — 사용자에게 보여줄 이름의 단일 원천.

내부 식별자(research_v1.0 등)는 데이터 연속성을 위해 그대로 둔다.
**사용자 UI·성적표·리포트가 쓰는 이름만** 여기서 통일한다.

⚠️ 자동승격은 어떤 모델에도 없다. 승격 기준을 채우면 상태만
   PROMOTION_REVIEW_AVAILABLE로 바뀌고, 실제 Production 변경은
   사용자의 명시적 승인 후 별도 작업으로만 한다.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

# 운영 상태
LIVE_PRODUCTION = "LIVE_PRODUCTION"          # 실제 서비스 판단
SHADOW_TESTING = "SHADOW_TESTING"            # 그림자 시험(화면 미노출)
SHADOW_STARTING = "SHADOW_STARTING"          # 준비중 / 막 시작
ARCHIVED_FAILED_EXPERIMENT = "ARCHIVED_FAILED_EXPERIMENT"   # 실패 보관, 신규 예측 중단

# 승격 정책 — 전 모델 공통
AUTO_PROMOTION = "NONE_MANUAL_APPROVAL_REQUIRED"
PROMOTION_REVIEW_AVAILABLE = "PROMOTION_REVIEW_AVAILABLE"

STATUS_LABEL = {
    LIVE_PRODUCTION: "실제 서비스",
    SHADOW_TESTING: "그림자 시험",
    SHADOW_STARTING: "준비중",
    ARCHIVED_FAILED_EXPERIMENT: "보관 (실패 사례)",
}

MODELS = [
    {
        "id": "base_production",
        "displayName": "GAEO 기본모델 개선판",
        "icon": "🟢",
        "status": LIVE_PRODUCTION,
        "internalVersionKey": "baseModelVersion",
        "usesDart": True,
        "dartUsage": "공식공시 컨텍스트·재무 신선도·안전 게이트 (방향점수 아님)",
        "producesProbability": False,
        "horizons": ["5D"],
        "autoPromotion": AUTO_PROMOTION,
        "note": "현재 사이트에 실제로 보이는 판단입니다.",
    },
    {
        "id": "research_a",
        "displayName": "GAEO 연구모델 A",
        "icon": "🧪",
        "status": SHADOW_TESTING,
        "internalVersion": "research_v1.0",
        "configHash": "e37e6cc0cb701171",
        "usesDart": False,
        "dartUsage": "사용 안 함 (완전 동결)",
        "producesProbability": True,
        "probabilityCalibrated": False,
        "horizons": ["5D", "20D", "60D"],
        "autoPromotion": AUTO_PROMOTION,
        "frozen": True,
        "note": "화면에 나오지 않는 시험용 판단입니다. 수정하지 않습니다.",
    },
    {
        "id": "research_b",
        "displayName": "GAEO 연구모델 B",
        "icon": "🧪",
        "status": SHADOW_TESTING,
        "internalVersion": "research_v1.1",
        "configHash": "0d8ff5f0909e7b7b",
        "usesDart": False,
        "dartUsage": "사용 안 함 (완전 동결)",
        "producesProbability": True,
        "probabilityCalibrated": False,
        "horizons": ["5D", "20D", "60D"],
        "autoPromotion": AUTO_PROMOTION,
        "frozen": True,
        "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
        "note": "후보 4개를 동시에 시험 중이며 대표 후보를 고르지 않았습니다.",
    },
    {
        "id": "research_c",
        "displayName": "GAEO 연구모델 C",
        "icon": "🧪",
        "status": SHADOW_STARTING,
        "internalVersion": "research_v2.0",
        "usesDart": True,
        "dartUsage": "공시 존재·탐지시각·정정·커버리지 (Point-in-Time)",
        "producesProbability": True,
        "probabilityCalibrated": False,
        "horizons": ["5D", "20D", "60D"],
        "autoPromotion": AUTO_PROMOTION,
        "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
        "note": "연구모델 B와 같은 조건에 공시 정보만 더한 짝을 만들어 비교합니다.",
    },
    {
        "id": "legacy_shadow_v3",
        "displayName": "구형 그림자모델",
        "icon": "🗄️",
        "status": ARCHIVED_FAILED_EXPERIMENT,
        "internalVersion": "calibrated-ensemble-v3",
        "usesDart": False,
        "dartUsage": "사용 안 함",
        "producesProbability": True,
        "horizons": ["5D"],
        "autoPromotion": "REMOVED",
        "retiredAt": "2026-08-15",
        "failureReasons": [
            "SELL 판단이 전체의 41%로 극단적으로 치우쳤습니다.",
            "상승장에서 SELL 적중률이 9.4%까지 무너졌습니다(하락장 85.9%).",
            "승격 기준을 통과하지 못한 채 자동승격 경로만 남아 있었습니다.",
        ],
        "note": "신규 예측을 중단했습니다. 과거 기록은 그대로 보존합니다.",
    },
]

BY_ID = {m["id"]: m for m in MODELS}


def display_name(model_id):
    return (BY_ID.get(model_id) or {}).get("displayName", model_id)


def status_label(status):
    return STATUS_LABEL.get(status, status)


def registry_payload(extra=None):
    """대시보드가 읽을 형태. 개별 종목 예측은 절대 넣지 않는다."""
    payload = {
        "schemaVersion": "gaeo_model_registry_v1",
        "autoPromotionPolicy": AUTO_PROMOTION,
        "policyNote": ("어떤 모델도 스스로 실제 서비스 판단을 바꾸지 않습니다. "
                       "기준을 충족하면 '승격 검토 가능' 표시만 나오고, "
                       "실제 적용은 사람이 따로 승인해야 합니다."),
        "models": MODELS,
    }
    payload.update(extra or {})
    return payload


def write_registry(path=None):
    path = path or os.path.join(HERE, "research_archive", "model_registry.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(registry_payload(), f, ensure_ascii=False, indent=1, sort_keys=True)
    return path
