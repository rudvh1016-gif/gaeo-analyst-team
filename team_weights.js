// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-09 11:15",
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
   "taro": 0.3028,
   "diana": 0.1203,
   "nova": 0.2672,
   "flow": 0.3098
  },
  "acc": {
   "taro": {
    "n": 5089,
    "acc": 50.6,
    "adjustedAcc": 50.2,
    "adjustedAccUsedInWeights": 50.2,
    "rowBasedAdjustedAcc": 50.6,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 13,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.0,
    "absoluteN": 5229,
    "uniqueDecisionDays": 13,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.5,
    "alwaysBearAcc": 50.5,
    "bestFixedDirectionAcc": 50.5,
    "liftVsFixedPp": 0.1,
    "acc95": [
     49.2,
     54.4
    ],
    "lift95": [
     -1.2,
     3.4
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 10780,
     "neutralPct": 20.1,
     "bullPct": 51.9,
     "bearPct": 28.0,
     "meanAbsDeviation": 19.08,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.78,
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
     "records": 10780,
     "neutralPct": 25.0,
     "bullPct": 61.0,
     "bearPct": 14.0,
     "meanAbsDeviation": 17.61,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.12,
     "medianPushPoints": 1.92
    }
   },
   "nova": {
    "n": 1078,
    "acc": 45.8,
    "adjustedAcc": 48.4,
    "adjustedAccUsedInWeights": 48.4,
    "rowBasedAdjustedAcc": 46.2,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 13,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.1,
    "absoluteN": 1132,
    "uniqueDecisionDays": 13,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.3,
    "alwaysBearAcc": 53.7,
    "bestFixedDirectionAcc": 53.7,
    "liftVsFixedPp": -7.9,
    "acc95": [
     43.8,
     47.4
    ],
    "lift95": [
     -9.5,
     -6.5
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 10780,
     "neutralPct": 82.3,
     "bullPct": 9.0,
     "bearPct": 8.7,
     "meanAbsDeviation": 4.32,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.15,
     "medianPushPoints": 1.07
    }
   },
   "flow": {
    "n": 857,
    "acc": 52.5,
    "adjustedAcc": 51.0,
    "adjustedAccUsedInWeights": 51.0,
    "rowBasedAdjustedAcc": 52.2,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 13,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.1,
    "absoluteN": 885,
    "uniqueDecisionDays": 13,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.1,
    "alwaysBearAcc": 52.9,
    "bestFixedDirectionAcc": 52.9,
    "liftVsFixedPp": -0.4,
    "acc95": [
     51.9,
     59.0
    ],
    "lift95": [
     -2.5,
     5.4
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 10780,
     "neutralPct": 87.4,
     "bullPct": 3.8,
     "bearPct": 8.7,
     "meanAbsDeviation": 3.09,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.96,
     "medianPushPoints": 0.31
    }
   }
  },
  "graded": 7024,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 13,
    "diana": 0,
    "nova": 13,
    "flow": 13
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.2,
     "diana": 50.0,
     "nova": 48.4,
     "flow": 51.0
    },
    "weights": {
     "taro": 0.3028,
     "diana": 0.1203,
     "nova": 0.2672,
     "flow": 0.3098
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.0,
     "nova": 49.6,
     "flow": 50.2
    },
    "weights": {
     "taro": 0.3007,
     "diana": 0.1201,
     "nova": 0.2768,
     "flow": 0.3024
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.6,
     "diana": null,
     "nova": 46.2,
     "flow": 52.2
    },
    "weights": {
     "taro": 0.3064,
     "diana": 0.1205,
     "nova": 0.2512,
     "flow": 0.3218
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
   "hit": 4618,
   "miss": 2872,
   "n": 7490,
   "uniqueDecisionDays": 13,
   "minDaysForConclusion": 20,
   "acc": 61.7,
   "holdBaselineAcc": 62.1,
   "holdBaselineN": 7490,
   "liftVsHoldPp": -0.4,
   "byCall": {
    "BUY": {
     "n": 436,
     "acc": 40.4,
     "band": "±1%",
     "excludedMid": 83,
     "excludedPct": 16.0
    },
    "HOLD": {
     "n": 5887,
     "acc": 64.8,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1167,
     "acc": 53.9,
     "band": "±1%",
     "excludedMid": 199,
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
     "n": 1204,
     "graded": 1021,
     "hit": 419,
     "miss": 602,
     "excluded": 183,
     "acc": 41.0,
     "positivePct": 42.1,
     "crashPct": 24.4,
     "meanRet": -0.5,
     "uniqueDecisionDays": 34,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-02"
    },
    "currentVersion": {
     "n": 519,
     "graded": 436,
     "hit": 176,
     "miss": 260,
     "excluded": 83,
     "acc": 40.4,
     "positivePct": 41.8,
     "crashPct": 20.2,
     "meanRet": -0.51,
     "uniqueDecisionDays": 13,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-02"
    },
    "legacyMixed": {
     "n": 1677,
     "graded": 1435,
     "hit": 559,
     "miss": 876,
     "excluded": 242,
     "acc": 39.0,
     "positivePct": 40.3,
     "crashPct": 26.9,
     "meanRet": -1.1,
     "uniqueDecisionDays": 46,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-02"
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
     "n": 18269,
     "weightedDecisionN": 1204,
     "uniqueDecisionDays": 34,
     "acc": 43.8,
     "positivePct": 43.6,
     "crashPct": 25.6,
     "meanRet": 0.11,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 7772,
     "weightedDecisionN": 519,
     "uniqueDecisionDays": 13,
     "acc": 38.8,
     "positivePct": 39.4,
     "crashPct": 22.8,
     "meanRet": -0.84,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 737,
      "graded": 601,
      "hit": 265,
      "miss": 336,
      "excluded": 136,
      "acc": 44.1,
      "positivePct": 44.6,
      "crashPct": 18.0,
      "meanRet": 0.01,
      "uniqueDecisionDays": 34,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-02"
     },
     "caution": {
      "n": 467,
      "graded": 420,
      "hit": 154,
      "miss": 266,
      "excluded": 47,
      "acc": 36.7,
      "positivePct": 38.1,
      "crashPct": 34.5,
      "meanRet": -1.31,
      "uniqueDecisionDays": 33,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-02"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 467,
     "calmN": 737,
     "unknownN": 0,
     "warn": {
      "n": 467,
      "graded": 420,
      "hit": 154,
      "miss": 266,
      "excluded": 47,
      "acc": 36.7,
      "positivePct": 38.1,
      "crashPct": 34.5,
      "meanRet": -1.31,
      "uniqueDecisionDays": 33,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-02"
     },
     "calm": {
      "n": 737,
      "graded": 601,
      "hit": 265,
      "miss": 336,
      "excluded": 136,
      "acc": 44.1,
      "positivePct": 44.6,
      "crashPct": 18.0,
      "meanRet": 0.01,
      "uniqueDecisionDays": 34,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-02"
     },
     "crashGapPp": 16.5,
     "crashGapCi95": [
      9.3,
      28.1
     ],
     "warnSharePct": 38.8
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 214,
     "calmN": 305,
     "unknownN": 0,
     "warn": {
      "n": 214,
      "graded": 192,
      "hit": 83,
      "miss": 109,
      "excluded": 22,
      "acc": 43.2,
      "positivePct": 45.3,
      "crashPct": 28.0,
      "meanRet": -0.38,
      "uniqueDecisionDays": 13,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-02"
     },
     "calm": {
      "n": 305,
      "graded": 244,
      "hit": 93,
      "miss": 151,
      "excluded": 61,
      "acc": 38.1,
      "positivePct": 39.3,
      "crashPct": 14.8,
      "meanRet": -0.59,
      "uniqueDecisionDays": 13,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-02"
     },
     "crashGapPp": 13.2,
     "crashGapCi95": [
      -7.1,
      17.2
     ],
     "warnSharePct": 41.2
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.6,
      "otherPct": 10.9,
      "gapPp": 0.7
     },
     "volatility": {
      "flagPct": 7.6,
      "otherPct": 13.2,
      "gapPp": -5.6
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1204
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
    "taro": 0.2914,
    "diana": 0.1193,
    "nova": 0.294,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 504,
     "acc": 45.0,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 46.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 102,
     "acc": 63.7,
     "adjustedAcc": 55.4,
     "adjustedAccUsedInWeights": 55.4,
     "rowBasedAdjustedAcc": 56.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 102,
     "acc": 45.1,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "rowBasedAdjustedAcc": 47.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 708,
   "globalBlend": 0.531
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3052,
    "diana": 0.1226,
    "nova": 0.2597,
    "flow": 0.3126
   },
   "acc": {
    "taro": {
     "n": 251,
     "acc": 47.8,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "acc": 33.3,
     "adjustedAcc": 43.4,
     "adjustedAccUsedInWeights": 43.4,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 86,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 379,
   "globalBlend": 0.679
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.1219,
    "nova": 0.2675,
    "flow": 0.3074
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
     "nEffectiveDays": 13,
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
     "acc": 42.9,
     "adjustedAcc": 47.2,
     "adjustedAccUsedInWeights": 47.2,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 47.1,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 382,
   "globalBlend": 0.677
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2891,
    "diana": 0.1167,
    "nova": 0.2812,
    "flow": 0.3129
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 44.7,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 39,
     "acc": 66.7,
     "adjustedAcc": 56.6,
     "adjustedAccUsedInWeights": 56.6,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 269,
   "globalBlend": 0.748
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3037,
    "diana": 0.1183,
    "nova": 0.2657,
    "flow": 0.3124
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 57.9,
     "adjustedAcc": 53.1,
     "adjustedAccUsedInWeights": 53.1,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
   "graded": 237,
   "globalBlend": 0.771
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3059,
    "diana": 0.1197,
    "nova": 0.2586,
    "flow": 0.3158
   },
   "acc": {
    "taro": {
     "n": 266,
     "acc": 54.9,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 53.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 59,
     "acc": 59.3,
     "adjustedAcc": 53.7,
     "adjustedAccUsedInWeights": 53.7,
     "rowBasedAdjustedAcc": 53.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 332,
   "globalBlend": 0.707
  },
  "2차전지": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.1217,
    "nova": 0.2835,
    "flow": 0.2893
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 18,
     "acc": 16.7,
     "adjustedAcc": 40.5,
     "adjustedAccUsedInWeights": 40.5,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 8,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 302,
   "globalBlend": 0.726
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2986,
    "diana": 0.1191,
    "nova": 0.2469,
    "flow": 0.3355
   },
   "acc": {
    "taro": {
     "n": 631,
     "acc": 49.9,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 49.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 256,
     "acc": 34.8,
     "adjustedAcc": 44.0,
     "adjustedAccUsedInWeights": 44.0,
     "rowBasedAdjustedAcc": 39.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 65.9,
     "adjustedAcc": 56.3,
     "adjustedAccUsedInWeights": 56.3,
     "rowBasedAdjustedAcc": 56.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 975,
   "globalBlend": 0.451
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3129,
    "diana": 0.121,
    "nova": 0.2614,
    "flow": 0.3047
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 56.7,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 77,
     "acc": 39.0,
     "adjustedAcc": 45.7,
     "adjustedAccUsedInWeights": 45.7,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 30,
     "acc": 46.7,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 49.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 435,
   "globalBlend": 0.648
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.1221,
    "nova": 0.2764,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 414,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 16,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 37.2,
     "adjustedAcc": 45.2,
     "adjustedAccUsedInWeights": 45.2,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 473,
   "globalBlend": 0.628
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3081,
    "diana": 0.1232,
    "nova": 0.2768,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 48.8,
     "adjustedAcc": 49.5,
     "adjustedAccUsedInWeights": 49.5,
     "rowBasedAdjustedAcc": 49.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 57,
     "acc": 49.1,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 12,
     "acc": 16.7,
     "adjustedAcc": 40.5,
     "adjustedAccUsedInWeights": 40.5,
     "rowBasedAdjustedAcc": 47.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 8,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 309,
   "globalBlend": 0.721
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3194,
    "diana": 0.1212,
    "nova": 0.2627,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 64.9,
     "adjustedAcc": 55.9,
     "adjustedAccUsedInWeights": 55.9,
     "rowBasedAdjustedAcc": 58.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 49,
     "acc": 36.7,
     "adjustedAcc": 45.0,
     "adjustedAccUsedInWeights": 45.0,
     "rowBasedAdjustedAcc": 46.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 43.8,
     "adjustedAccUsedInWeights": 43.8,
     "rowBasedAdjustedAcc": 46.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 264,
   "globalBlend": 0.752
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.1165,
    "nova": 0.2599,
    "flow": 0.321
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 61.0,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 56.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
     "n": 135,
     "acc": 47.4,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
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
   "graded": 299,
   "globalBlend": 0.728
  }
 }
};
