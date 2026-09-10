// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-10 13:41",
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
   "taro": 0.3027,
   "diana": 0.121,
   "nova": 0.2692,
   "flow": 0.307
  },
  "acc": {
   "taro": {
    "n": 5482,
    "acc": 50.1,
    "adjustedAcc": 50.0,
    "adjustedAccUsedInWeights": 50.0,
    "rowBasedAdjustedAcc": 50.1,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 14,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.8,
    "absoluteN": 5619,
    "uniqueDecisionDays": 14,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.5,
    "alwaysBearAcc": 50.5,
    "bestFixedDirectionAcc": 50.5,
    "liftVsFixedPp": -0.5,
    "acc95": [
     48.1,
     54.0
    ],
    "lift95": [
     -2.6,
     3.1
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 11380,
     "neutralPct": 20.3,
     "bullPct": 51.4,
     "bearPct": 28.4,
     "meanAbsDeviation": 19.05,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.77,
     "medianPushPoints": 5.15
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
     "records": 11380,
     "neutralPct": 24.9,
     "bullPct": 61.0,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.64,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.13,
     "medianPushPoints": 1.94
    }
   },
   "nova": {
    "n": 1166,
    "acc": 46.1,
    "adjustedAcc": 48.4,
    "adjustedAccUsedInWeights": 48.4,
    "rowBasedAdjustedAcc": 46.5,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 14,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.2,
    "absoluteN": 1211,
    "uniqueDecisionDays": 14,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 45.6,
    "alwaysBearAcc": 54.4,
    "bestFixedDirectionAcc": 54.4,
    "liftVsFixedPp": -8.2,
    "acc95": [
     44.0,
     48.2
    ],
    "lift95": [
     -9.5,
     -6.8
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 11380,
     "neutralPct": 82.2,
     "bullPct": 9.0,
     "bearPct": 8.7,
     "meanAbsDeviation": 4.34,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.17,
     "medianPushPoints": 1.08
    }
   },
   "flow": {
    "n": 924,
    "acc": 51.2,
    "adjustedAcc": 50.5,
    "adjustedAccUsedInWeights": 50.5,
    "rowBasedAdjustedAcc": 51.1,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 14,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.6,
    "absoluteN": 948,
    "uniqueDecisionDays": 14,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 48.5,
    "alwaysBearAcc": 51.5,
    "bestFixedDirectionAcc": 51.5,
    "liftVsFixedPp": -0.3,
    "acc95": [
     48.1,
     58.4
    ],
    "lift95": [
     -4.2,
     5.2
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 11380,
     "neutralPct": 87.4,
     "bullPct": 4.0,
     "bearPct": 8.6,
     "meanAbsDeviation": 3.09,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.95,
     "medianPushPoints": 0.31
    }
   }
  },
  "graded": 7572,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 14,
    "diana": 0,
    "nova": 14,
    "flow": 14
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.0,
     "diana": 50.0,
     "nova": 48.4,
     "flow": 50.5
    },
    "weights": {
     "taro": 0.3027,
     "diana": 0.121,
     "nova": 0.2692,
     "flow": 0.307
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.0,
     "diana": 50.0,
     "nova": 49.6,
     "flow": 50.1
    },
    "weights": {
     "taro": 0.3007,
     "diana": 0.1203,
     "nova": 0.2772,
     "flow": 0.3018
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": null,
     "nova": 46.5,
     "flow": 51.1
    },
    "weights": {
     "taro": 0.3059,
     "diana": 0.1222,
     "nova": 0.2567,
     "flow": 0.3152
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
   "hit": 4927,
   "miss": 3126,
   "n": 8053,
   "uniqueDecisionDays": 14,
   "minDaysForConclusion": 20,
   "acc": 61.2,
   "holdBaselineAcc": 62.3,
   "holdBaselineN": 8053,
   "liftVsHoldPp": -1.1,
   "byCall": {
    "BUY": {
     "n": 469,
     "acc": 39.9,
     "band": "±1%",
     "excludedMid": 93,
     "excludedPct": 16.5
    },
    "HOLD": {
     "n": 6236,
     "acc": 65.2,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1348,
     "acc": 49.9,
     "band": "±1%",
     "excludedMid": 225,
     "excludedPct": 14.3
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
     "n": 1247,
     "graded": 1054,
     "hit": 430,
     "miss": 624,
     "excluded": 193,
     "acc": 40.8,
     "positivePct": 42.2,
     "crashPct": 24.0,
     "meanRet": -0.47,
     "uniqueDecisionDays": 35,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-03"
    },
    "currentVersion": {
     "n": 562,
     "graded": 469,
     "hit": 187,
     "miss": 282,
     "excluded": 93,
     "acc": 39.9,
     "positivePct": 42.0,
     "crashPct": 19.6,
     "meanRet": -0.44,
     "uniqueDecisionDays": 14,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-03"
    },
    "legacyMixed": {
     "n": 1720,
     "graded": 1468,
     "hit": 570,
     "miss": 898,
     "excluded": 252,
     "acc": 38.8,
     "positivePct": 40.3,
     "crashPct": 26.5,
     "meanRet": -1.06,
     "uniqueDecisionDays": 47,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-03"
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
     "n": 18868,
     "weightedDecisionN": 1247,
     "uniqueDecisionDays": 35,
     "acc": 44.4,
     "positivePct": 44.1,
     "crashPct": 25.0,
     "meanRet": 0.2,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 8371,
     "weightedDecisionN": 562,
     "uniqueDecisionDays": 14,
     "acc": 40.6,
     "positivePct": 40.9,
     "crashPct": 21.6,
     "meanRet": -0.58,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 771,
      "graded": 628,
      "hit": 274,
      "miss": 354,
      "excluded": 143,
      "acc": 43.6,
      "positivePct": 44.6,
      "crashPct": 17.8,
      "meanRet": -0.01,
      "uniqueDecisionDays": 35,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-03"
     },
     "caution": {
      "n": 476,
      "graded": 426,
      "hit": 156,
      "miss": 270,
      "excluded": 50,
      "acc": 36.6,
      "positivePct": 38.2,
      "crashPct": 34.0,
      "meanRet": -1.22,
      "uniqueDecisionDays": 34,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-03"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 476,
     "calmN": 771,
     "unknownN": 0,
     "warn": {
      "n": 476,
      "graded": 426,
      "hit": 156,
      "miss": 270,
      "excluded": 50,
      "acc": 36.6,
      "positivePct": 38.2,
      "crashPct": 34.0,
      "meanRet": -1.22,
      "uniqueDecisionDays": 34,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-03"
     },
     "calm": {
      "n": 771,
      "graded": 628,
      "hit": 274,
      "miss": 354,
      "excluded": 143,
      "acc": 43.6,
      "positivePct": 44.6,
      "crashPct": 17.8,
      "meanRet": -0.01,
      "uniqueDecisionDays": 35,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-03"
     },
     "crashGapPp": 16.2,
     "crashGapCi95": [
      9.1,
      27.1
     ],
     "warnSharePct": 38.2
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 223,
     "calmN": 339,
     "unknownN": 0,
     "warn": {
      "n": 223,
      "graded": 198,
      "hit": 85,
      "miss": 113,
      "excluded": 25,
      "acc": 42.9,
      "positivePct": 45.3,
      "crashPct": 27.4,
      "meanRet": -0.23,
      "uniqueDecisionDays": 14,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-03"
     },
     "calm": {
      "n": 339,
      "graded": 271,
      "hit": 102,
      "miss": 169,
      "excluded": 68,
      "acc": 37.6,
      "positivePct": 39.8,
      "crashPct": 14.5,
      "meanRet": -0.59,
      "uniqueDecisionDays": 14,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-03"
     },
     "crashGapPp": 12.9,
     "crashGapCi95": [
      -3.8,
      16.6
     ],
     "warnSharePct": 39.7
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.6,
      "otherPct": 10.6,
      "gapPp": 0.9
     },
     "volatility": {
      "flagPct": 7.5,
      "otherPct": 13.0,
      "gapPp": -5.6
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1247
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
    "taro": 0.2905,
    "diana": 0.1199,
    "nova": 0.294,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 543,
     "acc": 44.6,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 45.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 107,
     "acc": 61.7,
     "adjustedAcc": 54.8,
     "adjustedAccUsedInWeights": 54.8,
     "rowBasedAdjustedAcc": 55.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 108,
     "acc": 46.3,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 48.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 758,
   "globalBlend": 0.513
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3051,
    "diana": 0.123,
    "nova": 0.2628,
    "flow": 0.309
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 48.1,
     "adjustedAcc": 49.2,
     "adjustedAccUsedInWeights": 49.2,
     "rowBasedAdjustedAcc": 48.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 42,
     "acc": 35.7,
     "adjustedAcc": 44.4,
     "adjustedAccUsedInWeights": 44.4,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 94,
     "acc": 48.9,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 404,
   "globalBlend": 0.664
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.123,
    "nova": 0.2702,
    "flow": 0.3035
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 46.8,
     "adjustedAcc": 48.7,
     "adjustedAccUsedInWeights": 48.7,
     "rowBasedAdjustedAcc": 47.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 44,
     "acc": 43.2,
     "adjustedAcc": 47.2,
     "adjustedAccUsedInWeights": 47.2,
     "rowBasedAdjustedAcc": 48.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 74,
     "acc": 44.6,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 411,
   "globalBlend": 0.661
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.1166,
    "nova": 0.2825,
    "flow": 0.3117
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 46.9,
     "adjustedAcc": 48.7,
     "adjustedAccUsedInWeights": 48.7,
     "rowBasedAdjustedAcc": 48.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 43,
     "acc": 67.4,
     "adjustedAcc": 57.2,
     "adjustedAccUsedInWeights": 57.2,
     "rowBasedAdjustedAcc": 54.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 289,
   "globalBlend": 0.735
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3037,
    "diana": 0.1188,
    "nova": 0.2671,
    "flow": 0.3103
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 57.7,
     "adjustedAcc": 53.2,
     "adjustedAccUsedInWeights": 53.2,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 34,
     "acc": 61.8,
     "adjustedAcc": 54.6,
     "adjustedAccUsedInWeights": 54.6,
     "rowBasedAdjustedAcc": 52.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 248,
   "globalBlend": 0.763
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.1208,
    "nova": 0.2607,
    "flow": 0.3127
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 53.1,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 62,
     "acc": 56.5,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 359,
   "globalBlend": 0.69
  },
  "2차전지": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.1231,
    "nova": 0.2884,
    "flow": 0.283
   },
   "acc": {
    "taro": {
     "n": 270,
     "acc": 47.8,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 37,
     "acc": 59.5,
     "adjustedAcc": 53.7,
     "adjustedAccUsedInWeights": 53.7,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 25,
     "acc": 12.0,
     "adjustedAcc": 38.2,
     "adjustedAccUsedInWeights": 38.2,
     "rowBasedAdjustedAcc": 43.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 9,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 332,
   "globalBlend": 0.707
  },
  "보험": {
   "weights": {
    "taro": 0.2963,
    "diana": 0.1193,
    "nova": 0.2671,
    "flow": 0.3172
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 47.1,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 78,
     "acc": 48.7,
     "adjustedAcc": 49.5,
     "adjustedAccUsedInWeights": 49.5,
     "rowBasedAdjustedAcc": 49.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 32,
     "acc": 68.8,
     "adjustedAcc": 57.7,
     "adjustedAccUsedInWeights": 57.7,
     "rowBasedAdjustedAcc": 53.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 212,
   "globalBlend": 0.791
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2998,
    "diana": 0.1193,
    "nova": 0.244,
    "flow": 0.3369
   },
   "acc": {
    "taro": {
     "n": 684,
     "acc": 50.7,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 293,
     "acc": 33.8,
     "adjustedAcc": 43.3,
     "adjustedAccUsedInWeights": 43.3,
     "rowBasedAdjustedAcc": 38.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 97,
     "acc": 66.0,
     "adjustedAcc": 56.6,
     "adjustedAccUsedInWeights": 56.6,
     "rowBasedAdjustedAcc": 57.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1074,
   "globalBlend": 0.427
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3148,
    "diana": 0.1224,
    "nova": 0.2632,
    "flow": 0.2995
   },
   "acc": {
    "taro": {
     "n": 351,
     "acc": 55.8,
     "adjustedAcc": 52.4,
     "adjustedAccUsedInWeights": 52.4,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 83,
     "acc": 38.6,
     "adjustedAcc": 45.3,
     "adjustedAccUsedInWeights": 45.3,
     "rowBasedAdjustedAcc": 45.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 42.4,
     "adjustedAcc": 47.2,
     "adjustedAccUsedInWeights": 47.2,
     "rowBasedAdjustedAcc": 48.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 467,
   "globalBlend": 0.631
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.1224,
    "nova": 0.2815,
    "flow": 0.2915
   },
   "acc": {
    "taro": {
     "n": 441,
     "acc": 49.0,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 17,
     "acc": 52.9,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 50.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 37.0,
     "adjustedAcc": 44.9,
     "adjustedAccUsedInWeights": 44.9,
     "rowBasedAdjustedAcc": 46.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 504,
   "globalBlend": 0.613
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3083,
    "diana": 0.124,
    "nova": 0.2809,
    "flow": 0.2867
   },
   "acc": {
    "taro": {
     "n": 258,
     "acc": 48.4,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 59,
     "acc": 50.8,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 13,
     "acc": 15.4,
     "adjustedAcc": 39.3,
     "adjustedAccUsedInWeights": 39.3,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 9,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 330,
   "globalBlend": 0.708
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.319,
    "diana": 0.1222,
    "nova": 0.2665,
    "flow": 0.2922
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 62.2,
     "adjustedAcc": 55.0,
     "adjustedAccUsedInWeights": 55.0,
     "rowBasedAdjustedAcc": 57.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 53,
     "acc": 39.6,
     "adjustedAcc": 45.9,
     "adjustedAccUsedInWeights": 45.9,
     "rowBasedAdjustedAcc": 46.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 31.8,
     "adjustedAcc": 42.5,
     "adjustedAccUsedInWeights": 42.5,
     "rowBasedAdjustedAcc": 45.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 285,
   "globalBlend": 0.737
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1165,
    "nova": 0.2604,
    "flow": 0.3189
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 62.6,
     "adjustedAcc": 55.2,
     "adjustedAccUsedInWeights": 55.2,
     "rowBasedAdjustedAcc": 57.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 145,
     "acc": 47.6,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "rowBasedAdjustedAcc": 48.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
   "graded": 326,
   "globalBlend": 0.71
  },
  "로봇": {
   "weights": {
    "taro": 0.2902,
    "diana": 0.1205,
    "nova": 0.2667,
    "flow": 0.3225
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 33.0,
     "adjustedAcc": 43.0,
     "adjustedAccUsedInWeights": 43.0,
     "rowBasedAdjustedAcc": 41.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
     "n": 66,
     "acc": 43.9,
     "adjustedAcc": 47.5,
     "adjustedAccUsedInWeights": 47.5,
     "rowBasedAdjustedAcc": 47.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 25,
     "acc": 72.0,
     "adjustedAcc": 58.7,
     "adjustedAccUsedInWeights": 58.7,
     "rowBasedAdjustedAcc": 53.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 200,
   "globalBlend": 0.8
  },
  "식음료": {
   "weights": {
    "taro": 0.3001,
    "diana": 0.1198,
    "nova": 0.2689,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 50.8,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
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
   "graded": 200,
   "globalBlend": 0.8
  }
 }
};
