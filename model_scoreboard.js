// 자동 생성: build_model_scoreboard.py · 모델 대시보드용 집계
// ⚠️ 집계 숫자만 담는다. 개별 종목 Research Prediction 원본은 들어가지 않는다.
const MODEL_SCOREBOARD = {
 "autoPromotionPolicy": "NONE_MANUAL_APPROVAL_REQUIRED",
 "coverage": {
  "current": "GAEO_COVERAGE_V2_600",
  "note": "500종목 시절(~2026-08-14)과 600종목 구간(2026-08-15~)을 섞지 않고 나눠 집계합니다."
 },
 "generatedAt": "2026-08-20T00:14:19.846171+00:00",
 "gradingNote": "채점: 판단일 다음 N번째 거래일 종가 기준, 적중 정의는 기존 성적표(scoreCall)와 동일. 시장 대비 = 같은 날 분석 종목 전체 수익률 중앙값 차감.",
 "gradingPolicyVersion": "grading_v1_2026-08-16",
 "independenceNote": "같은 날 여러 종목 판단은 서로 독립이 아닙니다. 행 수와 함께 판단일 수를 같이 봐야 합니다.",
 "models": [
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "byCoverage": {
    "GAEO_COVERAGE_V1_500": {
     "accuracy": 51.5,
     "accuracyCI95": [
      45.0,
      57.6
     ],
     "actionDistribution": {
      "BUY": 1011,
      "HOLD": 8412,
      "SELL": 5957
     },
     "buy": {
      "count": 1011,
      "marketRelativeMeanReturn": -0.46,
      "meanReturn": -1.22,
      "medianReturn": -1.41,
      "precision": 39.3
     },
     "directionalAccuracy": 51.4,
     "directionalCI95": [
      41.8,
      62.7
     ],
     "directionalCount": 6968,
     "hold": {
      "count": 8412,
      "marketRelativeMeanReturn": 0.02,
      "meanReturn": 0.2,
      "medianReturn": 0.0,
      "precision": 51.6
     },
     "matured": 15380,
     "overallAccuracy": 51.5,
     "pending": 0,
     "sell": {
      "count": 5957,
      "marketRelativeMeanReturn": 0.62,
      "meanReturn": 0.57,
      "medianReturn": -0.78,
      "precision": 53.3
     },
     "status": "OK",
     "uniqueDates": 31
    }
   },
   "byModelVersion": {
    "PRE_HOTFIX_BASE": {
     "accuracy": 51.5,
     "accuracyCI95": [
      45.0,
      57.6
     ],
     "actionDistribution": {
      "BUY": 1011,
      "HOLD": 8412,
      "SELL": 5957
     },
     "buy": {
      "count": 1011,
      "marketRelativeMeanReturn": -0.46,
      "meanReturn": -1.22,
      "medianReturn": -1.41,
      "precision": 39.3
     },
     "directionalAccuracy": 51.4,
     "directionalCI95": [
      41.8,
      62.7
     ],
     "directionalCount": 6968,
     "hold": {
      "count": 8412,
      "marketRelativeMeanReturn": 0.02,
      "meanReturn": 0.2,
      "medianReturn": 0.0,
      "precision": 51.6
     },
     "matured": 15380,
     "overallAccuracy": 51.5,
     "pending": 1085,
     "sell": {
      "count": 5957,
      "marketRelativeMeanReturn": 0.62,
      "meanReturn": 0.57,
      "medianReturn": -0.78,
      "precision": 53.3
     },
     "status": "OK",
     "uniqueDates": 31
    },
    "base-2026-08-15-parity-hotfix": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 1794,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    }
   },
   "candidates": [],
   "configHash": null,
   "coverageNote": "현재 서비스는 600종목 기준입니다. 2026-08-14까지의 500종목 기록은 별도 구간으로 보존합니다.",
   "currentModelVersion": "base-2026-08-15-parity-hotfix",
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
     "note": "현재 버전(2026-08-15 hotfix 이후) 기록을 축적하는 중입니다",
     "pending": 1794,
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
   "maturedCount": 15380,
   "note": "현재 사이트에 실제로 보이는 판단입니다.",
   "pendingCount": 2879,
   "primarySelection": null,
   "probabilityMetrics": {
    "status": "NOT_APPLICABLE"
   },
   "producesProbability": false,
   "recordCount": 18259,
   "status": "LIVE_PRODUCTION",
   "statusLabel": "실제 서비스",
   "uniquePredictionDates": 31,
   "usesDart": true,
   "withheldCount": 0
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
     "actionDistribution": {},
     "matured": 0,
     "pending": 1794,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "5": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 1794,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    },
    "60": {
     "actionDistribution": {},
     "matured": 0,
     "pending": 1794,
     "status": "PENDING_NOT_MATURED",
     "uniqueDates": 0
    }
   },
   "icon": "🧪",
   "id": "research_a",
   "internalVersion": "research_v1.0",
   "note": "화면에 나오지 않는 시험용 판단입니다. 수정하지 않습니다.",
   "primarySelection": null,
   "probabilityMetrics": {
    "note": "예측 확률이 실제 빈도와 맞는지 아직 검증되지 않았습니다",
    "status": "CALIBRATION_NOT_VALIDATED"
   },
   "producesProbability": true,
   "recordCount": 1794,
   "status": "SHADOW_TESTING",
   "statusLabel": "그림자 시험",
   "uniquePredictionDates": 3,
   "usesDart": false
  },
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "candidates": [
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    },
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_MOMENTUM_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_REVERSAL_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    }
   ],
   "configHash": "0d8ff5f0909e7b7b",
   "dartUsage": "사용 안 함 (완전 동결)",
   "displayName": "GAEO 연구모델 B",
   "failureReasons": null,
   "horizons": {
    "20": {
     "matured": 0,
     "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요",
     "pending": 7176,
     "status": "CANDIDATES_UNDER_TEST",
     "uniqueDates": 3
    },
    "5": {
     "matured": 0,
     "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요",
     "pending": 7176,
     "status": "CANDIDATES_UNDER_TEST",
     "uniqueDates": 3
    },
    "60": {
     "matured": 0,
     "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요",
     "pending": 7176,
     "status": "CANDIDATES_UNDER_TEST",
     "uniqueDates": 3
    }
   },
   "icon": "🧪",
   "id": "research_b",
   "internalVersion": "research_v1.1",
   "note": "후보 4개를 동시에 시험 중이며 대표 후보를 고르지 않았습니다.",
   "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
   "probabilityMetrics": {
    "note": "예측 확률이 실제 빈도와 맞는지 아직 검증되지 않았습니다",
    "status": "CALIBRATION_NOT_VALIDATED"
   },
   "producesProbability": true,
   "recordCount": 1794,
   "status": "SHADOW_TESTING",
   "statusLabel": "그림자 시험",
   "uniquePredictionDates": 3,
   "usesDart": false
  },
  {
   "autoPromotion": "NONE_MANUAL_APPROVAL_REQUIRED",
   "candidates": [
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    },
    {
     "candidateModelId": "MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_MOMENTUM_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    },
    {
     "candidateModelId": "PREDECLARED_CANDIDATE_45_35_20__SHORT_REVERSAL_CANDIDATE",
     "horizons": {
      "20": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "5": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      },
      "60": {
       "actionDistribution": {},
       "matured": 0,
       "pending": 1794,
       "status": "PENDING_NOT_MATURED",
       "uniqueDates": 0
      }
     }
    }
   ],
   "configHash": null,
   "dartUsage": "공시 존재·탐지시각·정정·커버리지 (Point-in-Time)",
   "displayName": "GAEO 연구모델 C",
   "failureReasons": null,
   "horizons": {
    "20": {
     "matured": 0,
     "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요",
     "pending": 7176,
     "status": "CANDIDATES_UNDER_TEST",
     "uniqueDates": 3
    },
    "5": {
     "matured": 0,
     "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요",
     "pending": 7176,
     "status": "CANDIDATES_UNDER_TEST",
     "uniqueDates": 3
    },
    "60": {
     "matured": 0,
     "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요",
     "pending": 7176,
     "status": "CANDIDATES_UNDER_TEST",
     "uniqueDates": 3
    }
   },
   "icon": "🧪",
   "id": "research_c",
   "internalVersion": "research_v2.0",
   "note": "연구모델 B와 같은 조건에 공시 정보만 더한 짝을 만들어 비교합니다.",
   "primarySelection": "NO_PRIMARY_CANDIDATE_SELECTED",
   "probabilityMetrics": {
    "note": "예측 확률이 실제 빈도와 맞는지 아직 검증되지 않았습니다",
    "status": "CALIBRATION_NOT_VALIDATED"
   },
   "producesProbability": true,
   "recordCount": 1794,
   "status": "SHADOW_STARTING",
   "statusLabel": "준비중",
   "uniquePredictionDates": 3,
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
   "primarySelection": null,
   "probabilityMetrics": {
    "note": "예측 확률이 실제 빈도와 맞는지 아직 검증되지 않았습니다",
    "status": "CALIBRATION_NOT_VALIDATED"
   },
   "producesProbability": true,
   "recordCount": 0,
   "status": "ARCHIVED_FAILED_EXPERIMENT",
   "statusLabel": "보관 (실패 사례)",
   "uniquePredictionDates": 0,
   "usesDart": false
  }
 ],
 "pairedComparisons": [],
 "policyNote": "어떤 모델도 스스로 실제 서비스 판단을 바꾸지 않습니다. 기준을 충족하면 '승격 검토 가능' 표시만 나오고, 실제 적용은 사람이 따로 승인해야 합니다.",
 "ranking": {
  "reason": "같은 Horizon·같은 표본·충분한 판단일이 갖춰지기 전에는 순위를 매기지 않습니다.",
  "status": "RANKING_ON_HOLD"
 },
 "regimeSplit": {
  "note": "판단 당시 알 수 있었던 정보로만 장세를 나누려면 성숙한 기록이 더 필요합니다.",
  "status": "REGIME_DATA_INSUFFICIENT"
 },
 "researchKeyAvailable": true,
 "researchRecordDays": 3,
 "schemaVersion": "gaeo_model_registry_v1"
};
