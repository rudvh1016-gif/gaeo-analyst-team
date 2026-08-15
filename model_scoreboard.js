// 자동 생성: build_model_scoreboard.py · 모델 대시보드용 집계
// ⚠️ 집계 숫자만 담는다. 개별 종목 Research Prediction 원본은 들어가지 않는다.
const MODEL_SCOREBOARD = {
 "autoPromotionPolicy": "NONE_MANUAL_APPROVAL_REQUIRED",
 "generatedAt": "2026-08-15T14:33:10.416629+00:00",
 "independenceNote": "같은 날 500종목은 서로 독립이 아닙니다. 행 수와 함께 판단일 수를 같이 봐야 합니다.",
 "models": [
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "candidates": [],
   "configHash": null,
   "dartUsage": "공식공시 컨텍스트·재무 신선도·안전 게이트 (방향점수 아님)",
   "displayName": "GAEO 기본모델 개선판",
   "failureReasons": null,
   "horizons": {
    "20": {
     "matured": 0,
     "pending": 0,
     "status": "NOT_APPLICABLE",
     "uniqueDates": 0
    },
    "5": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "60": {
     "matured": 0,
     "pending": 0,
     "status": "NOT_APPLICABLE",
     "uniqueDates": 0
    }
   },
   "icon": "🟢",
   "id": "base_production",
   "internalVersion": null,
   "note": "현재 사이트에 실제로 보이는 판단입니다.",
   "predictionStartedAt": null,
   "primarySelection": null,
   "probabilityMetrics": {
    "status": "NOT_APPLICABLE"
   },
   "producesProbability": false,
   "recordCount": 0,
   "status": "LIVE_PRODUCTION",
   "statusLabel": "실제 서비스",
   "uniquePredictionDates": 0,
   "usesDart": true
  },
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "candidates": [],
   "configHash": "e37e6cc0cb701171",
   "dartUsage": "사용 안 함 (완전 동결)",
   "displayName": "GAEO 연구모델 A",
   "failureReasons": null,
   "horizons": {
    "20": {
     "actionDistribution": {
      "BUY_CONSIDER": 60,
      "HOLD_WATCH": 286,
      "SELL_CONSIDER": 28,
      "WATCH": 126
     },
     "matured": 0,
     "pending": 500,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "5": {
     "actionDistribution": {
      "BUY_CONSIDER": 17,
      "HOLD_WATCH": 367,
      "SELL_CONSIDER": 9,
      "WATCH": 107
     },
     "matured": 0,
     "pending": 500,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "60": {
     "actionDistribution": {
      "BUY_CONSIDER": 33,
      "HOLD_WATCH": 227,
      "SELL_CONSIDER": 144,
      "WATCH": 96
     },
     "matured": 0,
     "pending": 500,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    }
   },
   "icon": "🧪",
   "id": "research_a",
   "internalVersion": "research_v1.0",
   "note": "화면에 나오지 않는 시험용 판단입니다. 수정하지 않습니다.",
   "predictionStartedAt": "2026-08-14",
   "primarySelection": null,
   "probabilityMetrics": {
    "status": "PENDING_NOT_MATURED"
   },
   "producesProbability": true,
   "recordCount": 500,
   "status": "SHADOW_TESTING",
   "statusLabel": "그림자 시험",
   "uniquePredictionDates": 1,
   "usesDart": false
  },
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "candidates": [
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    },
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_MOMENTUM_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_REVERSAL_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    }
   ],
   "configHash": "0d8ff5f0909e7b7b",
   "dartUsage": "사용 안 함 (완전 동결)",
   "displayName": "GAEO 연구모델 B",
   "failureReasons": null,
   "horizons": {
    "20": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "5": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "60": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    }
   },
   "icon": "🧪",
   "id": "research_b",
   "internalVersion": "research_v1.1",
   "note": "후보 4개를 동시에 시험 중이며 대표 후보를 고르지 않았습니다.",
   "predictionStartedAt": "2026-08-14",
   "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
   "probabilityMetrics": {
    "status": "PENDING_NOT_MATURED"
   },
   "producesProbability": true,
   "recordCount": 500,
   "status": "SHADOW_TESTING",
   "statusLabel": "그림자 시험",
   "uniquePredictionDates": 1,
   "usesDart": false
  },
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "candidates": [
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    },
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_MOMENTUM_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_REVERSAL_CANDIDATE",
     "status": "PENDING_NOT_MATURED"
    }
   ],
   "configHash": null,
   "dartUsage": "공시 존재·탐지시각·정정·커버리지 (Point-in-Time)",
   "displayName": "GAEO 연구모델 C",
   "failureReasons": null,
   "horizons": {
    "20": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "5": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "60": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 0,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    }
   },
   "icon": "🧪",
   "id": "research_c",
   "internalVersion": "research_v2.0",
   "note": "연구모델 B와 같은 조건에 공시 정보만 더한 짝을 만들어 비교합니다.",
   "predictionStartedAt": "2026-08-14",
   "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
   "probabilityMetrics": {
    "status": "PENDING_NOT_MATURED"
   },
   "producesProbability": true,
   "recordCount": 500,
   "status": "SHADOW_STARTING",
   "statusLabel": "준비중",
   "uniquePredictionDates": 1,
   "usesDart": true
  },
  {
   "autoPromotion": "REMOVED",
   "candidates": [],
   "configHash": null,
   "dartUsage": "사용 안 함",
   "displayName": "구형 그림자모델",
   "failureReasons": [
    "SELL 판단이 전체의 41%로 극단적으로 치우쳤습니다.",
    "상승장에서 SELL 적중률이 9.4%까지 무너졌습니다(하락장 85.9%).",
    "승격 기준을 통과하지 못한 채 자동승격 경로만 남아 있었습니다."
   ],
   "horizons": {
    "20": {
     "matured": 0,
     "pending": 0,
     "status": "NOT_APPLICABLE",
     "uniqueDates": 0
    },
    "5": {
     "matured": 0,
     "pending": 0,
     "status": "ARCHIVED_NO_NEW_PREDICTIONS",
     "uniqueDates": 0
    },
    "60": {
     "matured": 0,
     "pending": 0,
     "status": "NOT_APPLICABLE",
     "uniqueDates": 0
    }
   },
   "icon": "🗄️",
   "id": "legacy_shadow_v3",
   "internalVersion": "calibrated-ensemble-v3",
   "note": "신규 예측을 중단했습니다. 과거 기록은 그대로 보존합니다.",
   "predictionStartedAt": null,
   "primarySelection": null,
   "probabilityMetrics": {
    "status": "PENDING_NOT_MATURED"
   },
   "producesProbability": true,
   "recordCount": 0,
   "status": "ARCHIVED_FAILED_EXPERIMENT",
   "statusLabel": "보관 (실패 사례)",
   "uniquePredictionDates": 0,
   "usesDart": false
  }
 ],
 "policyNote": "어떤 모델도 스스로 실제 서비스 판단을 바꾸지 않습니다. 기준을 충족하면 '승격 검토 가능' 표시만 나오고, 실제 적용은 사람이 따로 승인해야 합니다.",
 "ranking": {
  "reason": "같은 Horizon·같은 기준으로 비교할 성숙 기록이 아직 없습니다.",
  "status": "RANKING_ON_HOLD"
 },
 "regimeSplit": {
  "note": "상승·횡보·하락장을 따로 보려면 성숙한 기록이 필요합니다.",
  "status": "PENDING_NOT_MATURED"
 },
 "researchKeyAvailable": true,
 "researchRecordDays": 1,
 "schemaVersion": "gaeo_model_registry_v1"
};
