// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-17 09:17",
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
   "taro": 0.3074,
   "diana": 0.125,
   "nova": 0.2654,
   "flow": 0.3022
  },
  "acc": {
   "taro": {
    "n": 7295,
    "acc": 50.8,
    "adjustedAcc": 50.4,
    "adjustedAccUsedInWeights": 50.4,
    "rowBasedAdjustedAcc": 50.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 19,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 7552,
    "uniqueDecisionDays": 19,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.0,
    "alwaysBearAcc": 51.0,
    "bestFixedDirectionAcc": 51.0,
    "liftVsFixedPp": -0.1,
    "acc95": [
     48.2,
     53.1
    ],
    "lift95": [
     -2.7,
     2.3
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 13780,
     "neutralPct": 20.9,
     "bullPct": 48.9,
     "bearPct": 30.2,
     "meanAbsDeviation": 18.79,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.78,
     "medianPushPoints": 5.23
    }
   },
   "diana": {
    "n": 1288,
    "acc": 55.7,
    "adjustedAcc": 51.0,
    "adjustedAccUsedInWeights": 51.0,
    "rowBasedAdjustedAcc": 55.3,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 4,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 50.0,
    "absoluteN": 1293,
    "uniqueDecisionDays": 4,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.8,
    "alwaysBearAcc": 50.2,
    "bestFixedDirectionAcc": 50.2,
    "liftVsFixedPp": 5.6,
    "acc95": null,
    "lift95": null,
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 20,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 13780,
     "neutralPct": 24.9,
     "bullPct": 61.0,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.72,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.21,
     "medianPushPoints": 2.0
    }
   },
   "nova": {
    "n": 1574,
    "acc": 45.5,
    "adjustedAcc": 47.8,
    "adjustedAccUsedInWeights": 47.8,
    "rowBasedAdjustedAcc": 45.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 19,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.3,
    "absoluteN": 1657,
    "uniqueDecisionDays": 19,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.3,
    "alwaysBearAcc": 53.7,
    "bestFixedDirectionAcc": 53.7,
    "liftVsFixedPp": -8.2,
    "acc95": [
     44.2,
     47.5
    ],
    "lift95": [
     -10.6,
     -7.4
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 13780,
     "neutralPct": 82.0,
     "bullPct": 9.4,
     "bearPct": 8.5,
     "meanAbsDeviation": 4.41,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.17,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1212,
    "acc": 49.7,
    "adjustedAcc": 49.8,
    "adjustedAccUsedInWeights": 49.8,
    "rowBasedAdjustedAcc": 49.7,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 19,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.0,
    "absoluteN": 1252,
    "uniqueDecisionDays": 19,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.4,
    "alwaysBearAcc": 52.6,
    "bestFixedDirectionAcc": 52.6,
    "liftVsFixedPp": -2.9,
    "acc95": [
     42.3,
     56.2
    ],
    "lift95": [
     -12.2,
     3.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 13780,
     "neutralPct": 87.4,
     "bullPct": 4.3,
     "bearPct": 8.4,
     "meanAbsDeviation": 3.06,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.92,
     "medianPushPoints": 0.3
    }
   }
  },
  "graded": 11369,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 19,
    "diana": 4,
    "nova": 19,
    "flow": 19
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.4,
     "diana": 51.0,
     "nova": 47.8,
     "flow": 49.8
    },
    "weights": {
     "taro": 0.3074,
     "diana": 0.125,
     "nova": 0.2654,
     "flow": 0.3022
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.2,
     "nova": 49.4,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3022,
     "diana": 0.1211,
     "nova": 0.2759,
     "flow": 0.3008
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.8,
     "diana": 55.3,
     "nova": 45.8,
     "flow": 49.7
    },
    "weights": {
     "taro": 0.3098,
     "diana": 0.1416,
     "nova": 0.2489,
     "flow": 0.2997
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
   "hit": 6956,
   "miss": 3959,
   "n": 10915,
   "uniqueDecisionDays": 19,
   "minDaysForConclusion": 20,
   "acc": 63.7,
   "holdBaselineAcc": 64.4,
   "holdBaselineN": 10915,
   "liftVsHoldPp": -0.7,
   "byCall": {
    "BUY": {
     "n": 633,
     "acc": 38.9,
     "band": "±1%",
     "excludedMid": 119,
     "excludedPct": 15.8
    },
    "HOLD": {
     "n": 8330,
     "acc": 67.7,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1952,
     "acc": 54.9,
     "band": "±1%",
     "excludedMid": 331,
     "excludedPct": 14.5
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
     "n": 1437,
     "graded": 1218,
     "hit": 489,
     "miss": 729,
     "excluded": 219,
     "acc": 40.1,
     "positivePct": 41.1,
     "crashPct": 24.0,
     "meanRet": -0.52,
     "uniqueDecisionDays": 40,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-10"
    },
    "currentVersion": {
     "n": 752,
     "graded": 633,
     "hit": 246,
     "miss": 387,
     "excluded": 119,
     "acc": 38.9,
     "positivePct": 39.9,
     "crashPct": 20.7,
     "meanRet": -0.53,
     "uniqueDecisionDays": 19,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-10"
    },
    "legacyMixed": {
     "n": 1910,
     "graded": 1632,
     "hit": 629,
     "miss": 1003,
     "excluded": 278,
     "acc": 38.5,
     "positivePct": 39.7,
     "crashPct": 26.3,
     "meanRet": -1.04,
     "uniqueDecisionDays": 52,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-10"
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
     "n": 21862,
     "weightedDecisionN": 1437,
     "uniqueDecisionDays": 40,
     "acc": 43.3,
     "positivePct": 43.1,
     "crashPct": 23.9,
     "meanRet": 0.09,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 11365,
     "weightedDecisionN": 752,
     "uniqueDecisionDays": 19,
     "acc": 39.2,
     "positivePct": 39.8,
     "crashPct": 20.4,
     "meanRet": -0.59,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 890,
      "graded": 730,
      "hit": 311,
      "miss": 419,
      "excluded": 160,
      "acc": 42.6,
      "positivePct": 43.1,
      "crashPct": 18.0,
      "meanRet": -0.07,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "caution": {
      "n": 547,
      "graded": 488,
      "hit": 178,
      "miss": 310,
      "excluded": 59,
      "acc": 36.5,
      "positivePct": 37.7,
      "crashPct": 33.8,
      "meanRet": -1.24,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 547,
     "calmN": 890,
     "unknownN": 0,
     "warn": {
      "n": 547,
      "graded": 488,
      "hit": 178,
      "miss": 310,
      "excluded": 59,
      "acc": 36.5,
      "positivePct": 37.7,
      "crashPct": 33.8,
      "meanRet": -1.24,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "calm": {
      "n": 890,
      "graded": 730,
      "hit": 311,
      "miss": 419,
      "excluded": 160,
      "acc": 42.6,
      "positivePct": 43.1,
      "crashPct": 18.0,
      "meanRet": -0.07,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "crashGapPp": 15.8,
     "crashGapCi95": [
      10.5,
      24.7
     ],
     "warnSharePct": 38.1
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 294,
     "calmN": 458,
     "unknownN": 0,
     "warn": {
      "n": 294,
      "graded": 260,
      "hit": 107,
      "miss": 153,
      "excluded": 34,
      "acc": 41.2,
      "positivePct": 42.5,
      "crashPct": 28.6,
      "meanRet": -0.51,
      "uniqueDecisionDays": 19,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-10"
     },
     "calm": {
      "n": 458,
      "graded": 373,
      "hit": 139,
      "miss": 234,
      "excluded": 85,
      "acc": 37.3,
      "positivePct": 38.2,
      "crashPct": 15.7,
      "meanRet": -0.55,
      "uniqueDecisionDays": 19,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-10"
     },
     "crashGapPp": 12.9,
     "crashGapCi95": [
      3.2,
      16.5
     ],
     "warnSharePct": 39.1
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 12.1,
      "otherPct": 10.1,
      "gapPp": 2.0
     },
     "volatility": {
      "flagPct": 7.1,
      "otherPct": 12.9,
      "gapPp": -5.7
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1285,
      "recorded": 152
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
    "taro": 0.2919,
    "diana": 0.1235,
    "nova": 0.2956,
    "flow": 0.2891
   },
   "acc": {
    "taro": {
     "n": 742,
     "acc": 45.3,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 45.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 53.3,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 51.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 120,
     "acc": 58.3,
     "adjustedAcc": 54.1,
     "adjustedAccUsedInWeights": 54.1,
     "rowBasedAdjustedAcc": 54.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 140,
     "acc": 45.0,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 47.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1122,
   "globalBlend": 0.416
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3132,
    "diana": 0.1204,
    "nova": 0.2586,
    "flow": 0.3078
   },
   "acc": {
    "taro": {
     "n": 367,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 30.0,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 44.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 60,
     "acc": 38.3,
     "adjustedAcc": 44.5,
     "adjustedAccUsedInWeights": 44.5,
     "rowBasedAdjustedAcc": 46.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 116,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 593,
   "globalBlend": 0.574
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3048,
    "diana": 0.1271,
    "nova": 0.272,
    "flow": 0.2961
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 45.8,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 46.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 52.8,
     "adjustedAcc": 50.5,
     "adjustedAccUsedInWeights": 50.5,
     "rowBasedAdjustedAcc": 50.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 89,
     "acc": 42.7,
     "adjustedAcc": 46.4,
     "adjustedAccUsedInWeights": 46.4,
     "rowBasedAdjustedAcc": 46.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 583,
   "globalBlend": 0.578
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2929,
    "diana": 0.1104,
    "nova": 0.2857,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 52.1,
     "adjustedAcc": 51.0,
     "adjustedAccUsedInWeights": 51.0,
     "rowBasedAdjustedAcc": 51.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 10.1,
     "adjustedAcc": 43.4,
     "adjustedAccUsedInWeights": 43.4,
     "rowBasedAdjustedAcc": 34.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 36,
     "acc": 77.8,
     "adjustedAcc": 59.3,
     "adjustedAccUsedInWeights": 59.3,
     "rowBasedAdjustedAcc": 56.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 58,
     "acc": 65.5,
     "adjustedAcc": 57.6,
     "adjustedAccUsedInWeights": 57.6,
     "rowBasedAdjustedAcc": 55.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 465,
   "globalBlend": 0.632
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1205,
    "nova": 0.2648,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 56.0,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 55,
     "acc": 58.2,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 52.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 7,
     "acc": 57.1,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 50.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 66.7,
     "adjustedAcc": 57.4,
     "adjustedAccUsedInWeights": 57.4,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 392,
   "globalBlend": 0.671
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3185,
    "diana": 0.1293,
    "nova": 0.2561,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 381,
     "acc": 57.0,
     "adjustedAcc": 53.4,
     "adjustedAccUsedInWeights": 53.4,
     "rowBasedAdjustedAcc": 55.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 72.7,
     "adjustedAcc": 53.8,
     "adjustedAccUsedInWeights": 53.8,
     "rowBasedAdjustedAcc": 59.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
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
     "n": 88,
     "acc": 46.6,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 564,
   "globalBlend": 0.587
  },
  "2차전지": {
   "weights": {
    "taro": 0.2995,
    "diana": 0.1284,
    "nova": 0.2927,
    "flow": 0.2794
   },
   "acc": {
    "taro": {
     "n": 359,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 49,
     "acc": 67.3,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 49,
     "acc": 61.2,
     "adjustedAcc": 55.3,
     "adjustedAccUsedInWeights": 55.3,
     "rowBasedAdjustedAcc": 53.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 31.2,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 44.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 505,
   "globalBlend": 0.613
  },
  "보험": {
   "weights": {
    "taro": 0.3005,
    "diana": 0.127,
    "nova": 0.2554,
    "flow": 0.3172
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 86.4,
     "adjustedAcc": 56.1,
     "adjustedAccUsedInWeights": 56.1,
     "rowBasedAdjustedAcc": 55.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 41.2,
     "adjustedAcc": 45.8,
     "adjustedAccUsedInWeights": 45.8,
     "rowBasedAdjustedAcc": 45.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 68.4,
     "adjustedAcc": 58.7,
     "adjustedAccUsedInWeights": 58.7,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 287,
   "globalBlend": 0.736
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3092,
    "diana": 0.1215,
    "nova": 0.2306,
    "flow": 0.3388
   },
   "acc": {
    "taro": {
     "n": 910,
     "acc": 54.8,
     "adjustedAcc": 52.4,
     "adjustedAccUsedInWeights": 52.4,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 171,
     "acc": 57.3,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 437,
     "acc": 34.1,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 37.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 132,
     "acc": 64.4,
     "adjustedAcc": 57.0,
     "adjustedAccUsedInWeights": 57.0,
     "rowBasedAdjustedAcc": 57.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1650,
   "globalBlend": 0.327
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3228,
    "diana": 0.1274,
    "nova": 0.2582,
    "flow": 0.2915
   },
   "acc": {
    "taro": {
     "n": 474,
     "acc": 56.8,
     "adjustedAcc": 53.3,
     "adjustedAccUsedInWeights": 53.3,
     "rowBasedAdjustedAcc": 55.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 61.2,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 123,
     "acc": 40.7,
     "adjustedAcc": 45.4,
     "adjustedAccUsedInWeights": 45.4,
     "rowBasedAdjustedAcc": 45.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 43.2,
     "adjustedAcc": 46.9,
     "adjustedAccUsedInWeights": 46.9,
     "rowBasedAdjustedAcc": 48.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 739,
   "globalBlend": 0.52
  },
  "조선": {
   "weights": {
    "taro": 0.3072,
    "diana": 0.1235,
    "nova": 0.2665,
    "flow": 0.3028
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 44.9,
     "adjustedAcc": 47.5,
     "adjustedAccUsedInWeights": 47.5,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 29.6,
     "adjustedAcc": 46.6,
     "adjustedAccUsedInWeights": 46.6,
     "rowBasedAdjustedAcc": 43.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
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
     "n": 32,
     "acc": 43.8,
     "adjustedAcc": 47.2,
     "adjustedAccUsedInWeights": 47.2,
     "rowBasedAdjustedAcc": 48.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 302,
   "globalBlend": 0.726
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3082,
    "diana": 0.1295,
    "nova": 0.2641,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 52.8,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 51.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 89.3,
     "adjustedAcc": 56.5,
     "adjustedAccUsedInWeights": 56.5,
     "rowBasedAdjustedAcc": 57.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1,
     "acc": 0.0,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 40.0,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 227,
   "globalBlend": 0.779
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2987,
    "diana": 0.1265,
    "nova": 0.2929,
    "flow": 0.2819
   },
   "acc": {
    "taro": {
     "n": 594,
     "acc": 47.8,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 85,
     "acc": 63.5,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 55.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 25,
     "acc": 60.0,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 51.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 40.3,
     "adjustedAcc": 45.4,
     "adjustedAccUsedInWeights": 45.4,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 766,
   "globalBlend": 0.511
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3116,
    "diana": 0.1253,
    "nova": 0.2661,
    "flow": 0.297
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 53.8,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 52.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 54.2,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1,
     "acc": 0.0,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 42.6,
     "adjustedAcc": 46.4,
     "adjustedAccUsedInWeights": 46.4,
     "rowBasedAdjustedAcc": 47.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 216,
   "globalBlend": 0.787
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3141,
    "diana": 0.1309,
    "nova": 0.2851,
    "flow": 0.2699
   },
   "acc": {
    "taro": {
     "n": 338,
     "acc": 47.6,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 58.7,
     "adjustedAcc": 51.5,
     "adjustedAccUsedInWeights": 51.5,
     "rowBasedAdjustedAcc": 53.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 63,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 14.3,
     "adjustedAcc": 35.3,
     "adjustedAccUsedInWeights": 35.3,
     "rowBasedAdjustedAcc": 44.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 485,
   "globalBlend": 0.623
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1247,
    "nova": 0.2681,
    "flow": 0.3044
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 49.7,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 63.0,
     "adjustedAcc": 52.2,
     "adjustedAccUsedInWeights": 52.2,
     "rowBasedAdjustedAcc": 52.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
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
     "n": 40,
     "acc": 55.0,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 51.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 269,
   "globalBlend": 0.748
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3181,
    "diana": 0.135,
    "nova": 0.2679,
    "flow": 0.2789
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 56.5,
     "adjustedAcc": 53.2,
     "adjustedAccUsedInWeights": 53.2,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 94.9,
     "adjustedAcc": 57.5,
     "adjustedAccUsedInWeights": 57.5,
     "rowBasedAdjustedAcc": 61.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 82,
     "acc": 46.3,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 31.6,
     "adjustedAcc": 41.0,
     "adjustedAccUsedInWeights": 41.0,
     "rowBasedAdjustedAcc": 44.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 424,
   "globalBlend": 0.654
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3075,
    "diana": 0.1158,
    "nova": 0.2591,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 61.5,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 57.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 42.9,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 188,
     "acc": 51.6,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
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
   "graded": 479,
   "globalBlend": 0.625
  },
  "로봇": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.1275,
    "nova": 0.2586,
    "flow": 0.3256
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 39.9,
     "adjustedAcc": 45.1,
     "adjustedAccUsedInWeights": 45.1,
     "rowBasedAdjustedAcc": 44.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 86.5,
     "adjustedAcc": 56.1,
     "adjustedAccUsedInWeights": 56.1,
     "rowBasedAdjustedAcc": 58.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 100,
     "acc": 45.0,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 47.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 72.7,
     "adjustedAcc": 60.8,
     "adjustedAccUsedInWeights": 60.8,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 318,
   "globalBlend": 0.716
  },
  "식음료": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.1233,
    "nova": 0.2654,
    "flow": 0.308
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 51.7,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 58.3,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 51.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
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
   "graded": 281,
   "globalBlend": 0.74
  }
 }
};
