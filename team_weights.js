// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-11 14:43",
 "evalDays": 5,
 "horizons": {
  "taro": {
   "days": 5,
   "deadband": 1.0
  },
  "diana": {
   "days": 20,
   "deadband": 3.0
  },
  "nova": {
   "days": 5,
   "deadband": 1.0
  },
  "flow": {
   "days": 5,
   "deadband": 1.0
  }
 },
 "method": "role-prior-bayesian-shrinkage-v4-decision-day-market-relative",
 "scoring": {
  "basis": "market_relative_excess",
  "benchmark": "cross_sectional_median_of_covered_universe",
  "benchmarkMinCodes": 30,
  "fallbackToAbsoluteN": 0,
  "since": "2026-08-31",
  "note": "분석가 채점만 시장 대비로 바꿨다. 팀 적중률(team.acc)은 사용자에게 계속 같은 뜻으로 보여야 하므로 절대 기준을 유지한다."
 },
 "global": {
  "version": "tw-2026-09-05-day-shrinkage-market-relative",
  "weights": {
   "taro": 0.305,
   "diana": 0.1217,
   "nova": 0.2681,
   "flow": 0.3052
  },
  "acc": {
   "taro": {
    "n": 5858,
    "acc": 50.2,
    "adjustedAcc": 50.1,
    "adjustedAccUsedInWeights": 50.1,
    "rowBasedAdjustedAcc": 50.2,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 15,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.4,
    "absoluteN": 6010,
    "uniqueDecisionDays": 15,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.5,
    "alwaysBearAcc": 50.5,
    "bestFixedDirectionAcc": 50.5,
    "liftVsFixedPp": -0.3,
    "acc95": [
     47.5,
     53.7
    ],
    "lift95": [
     -3.2,
     2.7
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 11980,
     "neutralPct": 20.4,
     "bullPct": 51.1,
     "bearPct": 28.5,
     "meanAbsDeviation": 18.97,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.79,
     "medianPushPoints": 5.18
    }
   },
   "diana": {
    "n": 0,
    "acc": null,
    "adjustedAcc": null,
    "adjustedAccUsedInWeights": 50.0,
    "rowBasedAdjustedAcc": null,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 0,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": null,
    "absoluteN": 0,
    "uniqueDecisionDays": 0,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": null,
    "alwaysBearAcc": null,
    "bestFixedDirectionAcc": null,
    "liftVsFixedPp": null,
    "acc95": null,
    "lift95": null,
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 20,
    "skillStatus": "NOT_GRADED_YET",
    "voice": {
     "records": 11980,
     "neutralPct": 25.0,
     "bullPct": 60.9,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.66,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.15,
     "medianPushPoints": 1.95
    }
   },
   "nova": {
    "n": 1250,
    "acc": 45.5,
    "adjustedAcc": 48.1,
    "adjustedAccUsedInWeights": 48.1,
    "rowBasedAdjustedAcc": 45.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 15,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 1293,
    "uniqueDecisionDays": 15,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 45.8,
    "alwaysBearAcc": 54.2,
    "bestFixedDirectionAcc": 54.2,
    "liftVsFixedPp": -8.7,
    "acc95": [
     44.5,
     48.2
    ],
    "lift95": [
     -10.3,
     -7.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 11980,
     "neutralPct": 82.2,
     "bullPct": 9.1,
     "bearPct": 8.7,
     "meanAbsDeviation": 4.35,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.17,
     "medianPushPoints": 1.07
    }
   },
   "flow": {
    "n": 993,
    "acc": 50.3,
    "adjustedAcc": 50.1,
    "adjustedAccUsedInWeights": 50.1,
    "rowBasedAdjustedAcc": 50.2,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 15,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.1,
    "absoluteN": 1016,
    "uniqueDecisionDays": 15,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": -0.3,
    "acc95": [
     44.7,
     57.6
    ],
    "lift95": [
     -11.4,
     4.1
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 11980,
     "neutralPct": 87.4,
     "bullPct": 4.1,
     "bearPct": 8.4,
     "meanAbsDeviation": 3.08,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.94,
     "medianPushPoints": 0.31
    }
   }
  },
  "graded": 8101,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 15,
    "diana": 0,
    "nova": 15,
    "flow": 15
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.0,
     "nova": 48.1,
     "flow": 50.1
    },
    "weights": {
     "taro": 0.305,
     "diana": 0.1217,
     "nova": 0.2681,
     "flow": 0.3052
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.0,
     "diana": 50.0,
     "nova": 49.5,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3013,
     "diana": 0.1204,
     "nova": 0.2769,
     "flow": 0.3014
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.2,
     "diana": null,
     "nova": 45.9,
     "flow": 50.2
    },
    "weights": {
     "taro": 0.3106,
     "diana": 0.1235,
     "nova": 0.255,
     "flow": 0.3109
    },
    "note": "2026-09-05 이전 실제 산식(채점 건수 단위, 가상표본 120건). 비교용 기록이다."
   },
   "maturityGate": {
    "enabled": false,
    "weights": {
     "taro": 0.3,
     "diana": 0.12,
     "nova": 0.28,
     "flow": 0.3
    },
    "note": "판단일이 기준 미만인 분석가를 통째로 역할 사전비중으로 되돌리는 거친 장치. 절벽을 20일째로 옮기기만 하므로 켜지 않는다. 판단일 단위 축소가 2026-09-14 DIANA 채점 시작의 하루치 급변을 대신 막는다."
   }
  },
  "team": {
   "basis": "absolute_return",
   "hit": 5305,
   "miss": 3310,
   "n": 8615,
   "uniqueDecisionDays": 15,
   "minDaysForConclusion": 20,
   "acc": 61.6,
   "holdBaselineAcc": 62.8,
   "holdBaselineN": 8615,
   "liftVsHoldPp": -1.3,
   "byCall": {
    "BUY": {
     "n": 500,
     "acc": 41.0,
     "band": "±1%",
     "excludedMid": 100,
     "excludedPct": 16.7
    },
    "HOLD": {
     "n": 6625,
     "acc": 65.9,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1490,
     "acc": 49.1,
     "band": "±1%",
     "excludedMid": 255,
     "excludedPct": 14.6
    }
   },
   "buyOutcome": {
    "basis": "call_hit_5d_pm1pct",
    "schemaVersion": 2,
    "warningVersion": "surge-only-2026-09-05c",
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "crashBasis": "fifth_session_close_return",
    "crashThresholdPct": -5.0,
    "overheatThresholds": {
     "ret5": 10.0,
     "ret20": 25.0
    },
    "allTime": {
     "n": 1285,
     "graded": 1085,
     "hit": 448,
     "miss": 637,
     "excluded": 200,
     "acc": 41.3,
     "positivePct": 42.2,
     "crashPct": 23.3,
     "meanRet": -0.44,
     "uniqueDecisionDays": 36,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-04"
    },
    "currentVersion": {
     "n": 600,
     "graded": 500,
     "hit": 205,
     "miss": 295,
     "excluded": 100,
     "acc": 41.0,
     "positivePct": 42.0,
     "crashPct": 18.5,
     "meanRet": -0.36,
     "uniqueDecisionDays": 15,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-04"
    },
    "legacyMixed": {
     "n": 1758,
     "graded": 1499,
     "hit": 588,
     "miss": 911,
     "excluded": 259,
     "acc": 39.2,
     "positivePct": 40.4,
     "crashPct": 26.0,
     "meanRet": -1.02,
     "uniqueDecisionDays": 48,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-04"
    },
    "reconstructed": {
     "n": 462,
     "graded": 403,
     "hit": 134,
     "miss": 269,
     "excluded": 59,
     "acc": 33.3,
     "positivePct": 35.1,
     "crashPct": 33.5,
     "meanRet": -2.6,
     "uniqueDecisionDays": 12,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-07-16"
    },
    "nonAuto": {
     "n": 11,
     "graded": 11,
     "hit": 6,
     "miss": 5,
     "excluded": 0,
     "acc": 54.5,
     "positivePct": 54.5,
     "crashPct": 18.2,
     "meanRet": -3.46,
     "uniqueDecisionDays": 6,
     "firstDecisionDate": "2026-07-10",
     "lastDecisionDate": "2026-08-27"
    },
    "randomBaseline": {
     "n": 19467,
     "weightedDecisionN": 1285,
     "uniqueDecisionDays": 36,
     "acc": 44.8,
     "positivePct": 44.4,
     "crashPct": 24.5,
     "meanRet": 0.24,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 8970,
     "weightedDecisionN": 600,
     "uniqueDecisionDays": 15,
     "acc": 41.5,
     "positivePct": 41.7,
     "crashPct": 20.7,
     "meanRet": -0.44,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 801,
      "graded": 653,
      "hit": 288,
      "miss": 365,
      "excluded": 148,
      "acc": 44.1,
      "positivePct": 44.7,
      "crashPct": 17.1,
      "meanRet": 0.03,
      "uniqueDecisionDays": 36,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "caution": {
      "n": 484,
      "graded": 432,
      "hit": 160,
      "miss": 272,
      "excluded": 52,
      "acc": 37.0,
      "positivePct": 38.0,
      "crashPct": 33.7,
      "meanRet": -1.21,
      "uniqueDecisionDays": 35,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 484,
     "calmN": 801,
     "unknownN": 0,
     "warn": {
      "n": 484,
      "graded": 432,
      "hit": 160,
      "miss": 272,
      "excluded": 52,
      "acc": 37.0,
      "positivePct": 38.0,
      "crashPct": 33.7,
      "meanRet": -1.21,
      "uniqueDecisionDays": 35,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "calm": {
      "n": 801,
      "graded": 653,
      "hit": 288,
      "miss": 365,
      "excluded": 148,
      "acc": 44.1,
      "positivePct": 44.7,
      "crashPct": 17.1,
      "meanRet": 0.03,
      "uniqueDecisionDays": 36,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "crashGapPp": 16.6,
     "crashGapCi95": [
      10.0,
      26.6
     ],
     "warnSharePct": 37.7
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 231,
     "calmN": 369,
     "unknownN": 0,
     "warn": {
      "n": 231,
      "graded": 204,
      "hit": 89,
      "miss": 115,
      "excluded": 27,
      "acc": 43.6,
      "positivePct": 44.6,
      "crashPct": 26.8,
      "meanRet": -0.24,
      "uniqueDecisionDays": 15,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-04"
     },
     "calm": {
      "n": 369,
      "graded": 296,
      "hit": 116,
      "miss": 180,
      "excluded": 73,
      "acc": 39.2,
      "positivePct": 40.4,
      "crashPct": 13.3,
      "meanRet": -0.44,
      "uniqueDecisionDays": 15,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-04"
     },
     "crashGapPp": 13.5,
     "crashGapCi95": [
      -1.4,
      16.5
     ],
     "warnSharePct": 38.5
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.4,
      "otherPct": 10.4,
      "gapPp": 1.0
     },
     "volatility": {
      "flagPct": 7.3,
      "otherPct": 12.7,
      "gapPp": -5.4
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1285
     },
     "noDecisionCandleBuyN": 93
    },
    "intervalMethod": "moving_block_5_decision_dates_percentile_2000_unadjusted_exploratory",
    "worst": [
     {
      "code": "006360",
      "name": "GS건설",
      "date": "2026-07-23",
      "ret5": -35.3
     },
     {
      "code": "475150",
      "name": "SK이터닉스",
      "date": "2026-07-22",
      "ret5": -29.9
     },
     {
      "code": "298000",
      "name": "효성화학",
      "date": "2026-08-20",
      "ret5": -21.8
     }
    ],
    "note": "사후 재구성과 정밀분석을 제외한 실제 자동판단 기록입니다. 적중률은 ±1% 안쪽을 제외합니다. 손실 비율은 5번째 거래일 종가 기준이며 기간 중 최대 손실이나 거래비용을 반영하지 않습니다."
   },
   "bandNote": "BUY·SELL은 ±1%, HOLD는 ±5% 기준으로 채점한다. 또 BUY·SELL만 ±1% 안쪽이 '애매'로 채점에서 빠진다(HOLD는 빠지는 게 없다). 잣대와 제외율이 모두 다르므로 합친 적중률 하나만 보고 판단하면 안 된다."
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.1206,
    "nova": 0.2927,
    "flow": 0.2944
   },
   "acc": {
    "taro": {
     "n": 586,
     "acc": 44.9,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 45.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 110,
     "acc": 60.0,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 113,
     "acc": 46.0,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 809,
   "globalBlend": 0.497
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3087,
    "diana": 0.1236,
    "nova": 0.2617,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 287,
     "acc": 49.5,
     "adjustedAcc": 49.8,
     "adjustedAccUsedInWeights": 49.8,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 47,
     "acc": 36.2,
     "adjustedAcc": 44.3,
     "adjustedAccUsedInWeights": 44.3,
     "rowBasedAdjustedAcc": 46.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 101,
     "acc": 47.5,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 435,
   "globalBlend": 0.648
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3064,
    "diana": 0.1246,
    "nova": 0.2691,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 46.1,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 47.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 46,
     "acc": 41.3,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 80,
     "acc": 41.2,
     "adjustedAcc": 46.2,
     "adjustedAccUsedInWeights": 46.2,
     "rowBasedAdjustedAcc": 46.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 436,
   "globalBlend": 0.647
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2902,
    "diana": 0.1171,
    "nova": 0.2827,
    "flow": 0.31
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 46.7,
     "adjustedAcc": 48.6,
     "adjustedAccUsedInWeights": 48.6,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 33,
     "acc": 78.8,
     "adjustedAcc": 58.9,
     "adjustedAccUsedInWeights": 58.9,
     "rowBasedAdjustedAcc": 56.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 9,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 66.0,
     "adjustedAcc": 56.8,
     "adjustedAccUsedInWeights": 56.8,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 309,
   "globalBlend": 0.721
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.1189,
    "nova": 0.2655,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 225,
     "acc": 57.3,
     "adjustedAcc": 53.1,
     "adjustedAccUsedInWeights": 53.1,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 6,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 63.9,
     "adjustedAcc": 55.7,
     "adjustedAccUsedInWeights": 55.7,
     "rowBasedAdjustedAcc": 53.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 267,
   "globalBlend": 0.75
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.1211,
    "nova": 0.2593,
    "flow": 0.3112
   },
   "acc": {
    "taro": {
     "n": 309,
     "acc": 54.0,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 52.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 7,
     "acc": 28.6,
     "adjustedAcc": 45.1,
     "adjustedAccUsedInWeights": 45.1,
     "rowBasedAdjustedAcc": 48.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 56.1,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 382,
   "globalBlend": 0.677
  },
  "2차전지": {
   "weights": {
    "taro": 0.3064,
    "diana": 0.1237,
    "nova": 0.2902,
    "flow": 0.2797
   },
   "acc": {
    "taro": {
     "n": 285,
     "acc": 47.4,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 38,
     "acc": 60.5,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 52.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 30,
     "acc": 13.3,
     "adjustedAcc": 37.8,
     "adjustedAccUsedInWeights": 37.8,
     "rowBasedAdjustedAcc": 42.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 353,
   "globalBlend": 0.694
  },
  "보험": {
   "weights": {
    "taro": 0.2986,
    "diana": 0.1195,
    "nova": 0.2638,
    "flow": 0.3181
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 49.1,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 84,
     "acc": 46.4,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 70.6,
     "adjustedAcc": 58.8,
     "adjustedAccUsedInWeights": 58.8,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 226,
   "globalBlend": 0.78
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.119,
    "nova": 0.241,
    "flow": 0.3384
   },
   "acc": {
    "taro": {
     "n": 731,
     "acc": 51.7,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 51.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 324,
     "acc": 34.0,
     "adjustedAcc": 43.1,
     "adjustedAccUsedInWeights": 43.1,
     "rowBasedAdjustedAcc": 38.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 104,
     "acc": 66.3,
     "adjustedAcc": 57.0,
     "adjustedAccUsedInWeights": 57.0,
     "rowBasedAdjustedAcc": 57.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1159,
   "globalBlend": 0.408
  },
  "지주·상사": {
   "weights": {
    "taro": 0.319,
    "diana": 0.123,
    "nova": 0.2612,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 375,
     "acc": 56.8,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 55.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 92,
     "acc": 38.0,
     "adjustedAcc": 44.9,
     "adjustedAccUsedInWeights": 44.9,
     "rowBasedAdjustedAcc": 44.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 503,
   "globalBlend": 0.614
  },
  "조선": {
   "weights": {
    "taro": 0.3044,
    "diana": 0.1242,
    "nova": 0.269,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 42.1,
     "adjustedAcc": 46.6,
     "adjustedAccUsedInWeights": 46.6,
     "rowBasedAdjustedAcc": 45.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 2,
     "acc": 0.0,
     "adjustedAcc": 45.5,
     "adjustedAccUsedInWeights": 45.5,
     "rowBasedAdjustedAcc": 49.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 26,
     "acc": 38.5,
     "adjustedAcc": 45.5,
     "adjustedAccUsedInWeights": 45.5,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 206,
   "globalBlend": 0.795
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3043,
    "diana": 0.1225,
    "nova": 0.2847,
    "flow": 0.2885
   },
   "acc": {
    "taro": {
     "n": 476,
     "acc": 48.5,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 48.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 18,
     "acc": 55.6,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 37.3,
     "adjustedAcc": 44.8,
     "adjustedAccUsedInWeights": 44.8,
     "rowBasedAdjustedAcc": 46.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 545,
   "globalBlend": 0.595
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3111,
    "diana": 0.1251,
    "nova": 0.2808,
    "flow": 0.283
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 48.4,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 60,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 14.3,
     "adjustedAcc": 38.1,
     "adjustedAccUsedInWeights": 38.1,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 351,
   "globalBlend": 0.695
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3029,
    "diana": 0.1206,
    "nova": 0.2699,
    "flow": 0.3066
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 51.0,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 25,
     "acc": 52.0,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 55.9,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 51.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 206,
   "globalBlend": 0.795
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3216,
    "diana": 0.1231,
    "nova": 0.2671,
    "flow": 0.2882
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 61.0,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 56.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 61,
     "acc": 41.0,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 47.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 29.8,
     "adjustedAcc": 41.3,
     "adjustedAccUsedInWeights": 41.3,
     "rowBasedAdjustedAcc": 44.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 308,
   "globalBlend": 0.722
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3068,
    "diana": 0.1168,
    "nova": 0.2586,
    "flow": 0.3178
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 63.0,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 57.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 151,
     "acc": 47.0,
     "adjustedAcc": 48.7,
     "adjustedAccUsedInWeights": 48.7,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 18,
     "acc": 77.8,
     "adjustedAcc": 59.3,
     "adjustedAccUsedInWeights": 59.3,
     "rowBasedAdjustedAcc": 53.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 342,
   "globalBlend": 0.701
  },
  "로봇": {
   "weights": {
    "taro": 0.2906,
    "diana": 0.1206,
    "nova": 0.2649,
    "flow": 0.3239
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 34.5,
     "adjustedAcc": 43.3,
     "adjustedAccUsedInWeights": 43.3,
     "rowBasedAdjustedAcc": 42.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 74,
     "acc": 44.6,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 27,
     "acc": 74.1,
     "adjustedAcc": 59.9,
     "adjustedAccUsedInWeights": 59.9,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 220,
   "globalBlend": 0.784
  },
  "식음료": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1203,
    "nova": 0.268,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 50.8,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": null,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 0,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 13,
     "acc": 69.2,
     "adjustedAcc": 54.4,
     "adjustedAccUsedInWeights": 54.4,
     "rowBasedAdjustedAcc": 51.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 210,
   "globalBlend": 0.792
  }
 }
};
