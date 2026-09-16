// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-16 11:27",
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
   "taro": 0.3073,
   "diana": 0.1246,
   "nova": 0.2649,
   "flow": 0.3032
  },
  "acc": {
   "taro": {
    "n": 6952,
    "acc": 50.9,
    "adjustedAcc": 50.4,
    "adjustedAccUsedInWeights": 50.4,
    "rowBasedAdjustedAcc": 50.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 18,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 7168,
    "uniqueDecisionDays": 18,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.3,
    "alwaysBearAcc": 50.7,
    "bestFixedDirectionAcc": 50.7,
    "liftVsFixedPp": 0.2,
    "acc95": [
     47.9,
     53.1
    ],
    "lift95": [
     -2.9,
     2.3
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 13780,
     "neutralPct": 20.9,
     "bullPct": 48.8,
     "bearPct": 30.3,
     "meanAbsDeviation": 18.8,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.78,
     "medianPushPoints": 5.22
    }
   },
   "diana": {
    "n": 965,
    "acc": 56.9,
    "adjustedAcc": 50.9,
    "adjustedAccUsedInWeights": 50.9,
    "rowBasedAdjustedAcc": 56.1,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 3,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 49.0,
    "absoluteN": 973,
    "uniqueDecisionDays": 3,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 50.5,
    "alwaysBearAcc": 49.5,
    "bestFixedDirectionAcc": 50.5,
    "liftVsFixedPp": 6.4,
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
     "meanAbsDeviation": 17.73,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.21,
     "medianPushPoints": 1.99
    }
   },
   "nova": {
    "n": 1506,
    "acc": 45.4,
    "adjustedAcc": 47.8,
    "adjustedAccUsedInWeights": 47.8,
    "rowBasedAdjustedAcc": 45.7,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 18,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 1572,
    "uniqueDecisionDays": 18,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.5,
    "alwaysBearAcc": 53.5,
    "bestFixedDirectionAcc": 53.5,
    "liftVsFixedPp": -8.2,
    "acc95": [
     44.5,
     47.8
    ],
    "lift95": [
     -10.7,
     -7.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 13780,
     "neutralPct": 82.0,
     "bullPct": 9.5,
     "bearPct": 8.5,
     "meanAbsDeviation": 4.41,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.17,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1150,
    "acc": 50.0,
    "adjustedAcc": 50.0,
    "adjustedAccUsedInWeights": 50.0,
    "rowBasedAdjustedAcc": 50.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 18,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.2,
    "absoluteN": 1187,
    "uniqueDecisionDays": 18,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 48.1,
    "alwaysBearAcc": 51.9,
    "bestFixedDirectionAcc": 51.9,
    "liftVsFixedPp": -1.9,
    "acc95": [
     42.3,
     56.6
    ],
    "lift95": [
     -13.0,
     3.3
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
     "meanPushPoints": 0.93,
     "medianPushPoints": 0.3
    }
   }
  },
  "graded": 10573,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 18,
    "diana": 3,
    "nova": 18,
    "flow": 18
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.4,
     "diana": 50.9,
     "nova": 47.8,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3073,
     "diana": 0.1246,
     "nova": 0.2649,
     "flow": 0.3032
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
     "taro": 0.3021,
     "diana": 0.121,
     "nova": 0.2759,
     "flow": 0.301
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.9,
     "diana": 56.1,
     "nova": 45.7,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3088,
     "diana": 0.1444,
     "nova": 0.2464,
     "flow": 0.3004
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
   "hit": 6543,
   "miss": 3800,
   "n": 10343,
   "uniqueDecisionDays": 18,
   "minDaysForConclusion": 20,
   "acc": 63.3,
   "holdBaselineAcc": 63.9,
   "holdBaselineN": 10343,
   "liftVsHoldPp": -0.6,
   "byCall": {
    "BUY": {
     "n": 589,
     "acc": 39.9,
     "band": "±1%",
     "excludedMid": 116,
     "excludedPct": 16.5
    },
    "HOLD": {
     "n": 7888,
     "acc": 67.2,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1866,
     "acc": 53.9,
     "band": "±1%",
     "excludedMid": 308,
     "excludedPct": 14.2
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
     "n": 1390,
     "graded": 1174,
     "hit": 478,
     "miss": 696,
     "excluded": 216,
     "acc": 40.7,
     "positivePct": 41.6,
     "crashPct": 23.8,
     "meanRet": -0.47,
     "uniqueDecisionDays": 39,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-09"
    },
    "currentVersion": {
     "n": 705,
     "graded": 589,
     "hit": 235,
     "miss": 354,
     "excluded": 116,
     "acc": 39.9,
     "positivePct": 40.9,
     "crashPct": 20.1,
     "meanRet": -0.45,
     "uniqueDecisionDays": 18,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-09"
    },
    "legacyMixed": {
     "n": 1863,
     "graded": 1588,
     "hit": 618,
     "miss": 970,
     "excluded": 275,
     "acc": 38.9,
     "positivePct": 40.0,
     "crashPct": 26.2,
     "meanRet": -1.02,
     "uniqueDecisionDays": 51,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-09"
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
     "n": 21264,
     "weightedDecisionN": 1390,
     "uniqueDecisionDays": 39,
     "acc": 43.8,
     "positivePct": 43.6,
     "crashPct": 24.2,
     "meanRet": 0.12,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 10767,
     "weightedDecisionN": 705,
     "uniqueDecisionDays": 18,
     "acc": 40.1,
     "positivePct": 40.5,
     "crashPct": 20.7,
     "meanRet": -0.56,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 866,
      "graded": 709,
      "hit": 306,
      "miss": 403,
      "excluded": 157,
      "acc": 43.2,
      "positivePct": 43.6,
      "crashPct": 17.6,
      "meanRet": -0.05,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "caution": {
      "n": 524,
      "graded": 465,
      "hit": 172,
      "miss": 293,
      "excluded": 59,
      "acc": 37.0,
      "positivePct": 38.2,
      "crashPct": 34.2,
      "meanRet": -1.18,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 524,
     "calmN": 866,
     "unknownN": 0,
     "warn": {
      "n": 524,
      "graded": 465,
      "hit": 172,
      "miss": 293,
      "excluded": 59,
      "acc": 37.0,
      "positivePct": 38.2,
      "crashPct": 34.2,
      "meanRet": -1.18,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "calm": {
      "n": 866,
      "graded": 709,
      "hit": 306,
      "miss": 403,
      "excluded": 157,
      "acc": 43.2,
      "positivePct": 43.6,
      "crashPct": 17.6,
      "meanRet": -0.05,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "crashGapPp": 16.6,
     "crashGapCi95": [
      10.4,
      26.3
     ],
     "warnSharePct": 37.7
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 271,
     "calmN": 434,
     "unknownN": 0,
     "warn": {
      "n": 271,
      "graded": 237,
      "hit": 101,
      "miss": 136,
      "excluded": 34,
      "acc": 42.6,
      "positivePct": 43.9,
      "crashPct": 28.8,
      "meanRet": -0.33,
      "uniqueDecisionDays": 18,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-09"
     },
     "calm": {
      "n": 434,
      "graded": 352,
      "hit": 134,
      "miss": 218,
      "excluded": 82,
      "acc": 38.1,
      "positivePct": 38.9,
      "crashPct": 14.7,
      "meanRet": -0.52,
      "uniqueDecisionDays": 18,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-09"
     },
     "crashGapPp": 14.1,
     "crashGapCi95": [
      2.6,
      17.3
     ],
     "warnSharePct": 38.4
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.6,
      "otherPct": 10.2,
      "gapPp": 1.5
     },
     "volatility": {
      "flagPct": 7.0,
      "otherPct": 12.7,
      "gapPp": -5.8
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1285,
      "recorded": 105
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
    "taro": 0.2908,
    "diana": 0.1219,
    "nova": 0.2969,
    "flow": 0.2904
   },
   "acc": {
    "taro": {
     "n": 699,
     "acc": 44.8,
     "adjustedAcc": 47.5,
     "adjustedAccUsedInWeights": 47.5,
     "rowBasedAdjustedAcc": 45.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 117,
     "acc": 59.8,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 130,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1038,
   "globalBlend": 0.435
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3112,
    "diana": 0.1209,
    "nova": 0.2604,
    "flow": 0.3075
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 50.7,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 38,
     "acc": 28.9,
     "adjustedAcc": 47.3,
     "adjustedAccUsedInWeights": 47.3,
     "rowBasedAdjustedAcc": 44.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 58,
     "acc": 39.7,
     "adjustedAcc": 45.2,
     "adjustedAccUsedInWeights": 45.2,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 110,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 551,
   "globalBlend": 0.592
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3089,
    "diana": 0.1273,
    "nova": 0.2653,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "adjustedAccUsedInWeights": 48.6,
     "rowBasedAdjustedAcc": 47.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 54,
     "acc": 40.7,
     "adjustedAcc": 45.6,
     "adjustedAccUsedInWeights": 45.6,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 85,
     "acc": 42.4,
     "adjustedAcc": 46.4,
     "adjustedAccUsedInWeights": 46.4,
     "rowBasedAdjustedAcc": 46.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 543,
   "globalBlend": 0.596
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2914,
    "diana": 0.1123,
    "nova": 0.2849,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 61,
     "acc": 11.5,
     "adjustedAcc": 45.0,
     "adjustedAccUsedInWeights": 45.0,
     "rowBasedAdjustedAcc": 37.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 37,
     "acc": 78.4,
     "adjustedAcc": 59.5,
     "adjustedAccUsedInWeights": 59.5,
     "rowBasedAdjustedAcc": 56.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 66.1,
     "adjustedAcc": 57.6,
     "adjustedAccUsedInWeights": 57.6,
     "rowBasedAdjustedAcc": 55.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 431,
   "globalBlend": 0.65
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.304,
    "diana": 0.1219,
    "nova": 0.2621,
    "flow": 0.312
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 55.6,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 53.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 64.1,
     "adjustedAcc": 51.8,
     "adjustedAccUsedInWeights": 51.8,
     "rowBasedAdjustedAcc": 53.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
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
     "n": 37,
     "acc": 64.9,
     "adjustedAcc": 56.4,
     "adjustedAccUsedInWeights": 56.4,
     "rowBasedAdjustedAcc": 53.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 359,
   "globalBlend": 0.69
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3157,
    "diana": 0.128,
    "nova": 0.2555,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 367,
     "acc": 56.4,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 76.8,
     "adjustedAcc": 53.5,
     "adjustedAccUsedInWeights": 53.5,
     "rowBasedAdjustedAcc": 59.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
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
     "n": 81,
     "acc": 49.4,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 524,
   "globalBlend": 0.604
  },
  "2차전지": {
   "weights": {
    "taro": 0.3011,
    "diana": 0.1275,
    "nova": 0.2901,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 339,
     "acc": 46.0,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 69.4,
     "adjustedAcc": 52.5,
     "adjustedAccUsedInWeights": 52.5,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 46,
     "acc": 60.9,
     "adjustedAcc": 55.0,
     "adjustedAccUsedInWeights": 55.0,
     "rowBasedAdjustedAcc": 53.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 30.4,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 44.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 467,
   "globalBlend": 0.631
  },
  "보험": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.1262,
    "nova": 0.2549,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 52.0,
     "adjustedAcc": 51.0,
     "adjustedAccUsedInWeights": 51.0,
     "rowBasedAdjustedAcc": 51.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 14,
     "acc": 92.9,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 103,
     "acc": 40.8,
     "adjustedAcc": 45.6,
     "adjustedAccUsedInWeights": 45.6,
     "rowBasedAdjustedAcc": 45.7,
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
   "graded": 278,
   "globalBlend": 0.742
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3083,
    "diana": 0.1214,
    "nova": 0.2314,
    "flow": 0.3389
   },
   "acc": {
    "taro": {
     "n": 869,
     "acc": 54.8,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 54.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 128,
     "acc": 59.4,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 414,
     "acc": 33.8,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 37.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 126,
     "acc": 65.1,
     "adjustedAcc": 57.1,
     "adjustedAccUsedInWeights": 57.1,
     "rowBasedAdjustedAcc": 57.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1537,
   "globalBlend": 0.342
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3227,
    "diana": 0.1265,
    "nova": 0.2583,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 454,
     "acc": 57.0,
     "adjustedAcc": 53.3,
     "adjustedAccUsedInWeights": 53.3,
     "rowBasedAdjustedAcc": 55.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 60.8,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 119,
     "acc": 40.3,
     "adjustedAcc": 45.4,
     "adjustedAccUsedInWeights": 45.4,
     "rowBasedAdjustedAcc": 45.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 42,
     "acc": 42.9,
     "adjustedAcc": 46.8,
     "adjustedAccUsedInWeights": 46.8,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 689,
   "globalBlend": 0.537
  },
  "조선": {
   "weights": {
    "taro": 0.3069,
    "diana": 0.1241,
    "nova": 0.2668,
    "flow": 0.3022
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 43.8,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 46.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 28.2,
     "adjustedAcc": 47.2,
     "adjustedAccUsedInWeights": 47.2,
     "rowBasedAdjustedAcc": 44.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
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
     "n": 29,
     "acc": 41.4,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 278,
   "globalBlend": 0.742
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3109,
    "diana": 0.1273,
    "nova": 0.2636,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 56.0,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 53.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 23,
     "acc": 87.0,
     "adjustedAcc": 54.8,
     "adjustedAccUsedInWeights": 54.8,
     "rowBasedAdjustedAcc": 55.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
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
     "n": 3,
     "acc": 33.3,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 209,
   "globalBlend": 0.793
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3026,
    "diana": 0.1267,
    "nova": 0.286,
    "flow": 0.2846
   },
   "acc": {
    "taro": {
     "n": 571,
     "acc": 48.7,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 66.2,
     "adjustedAcc": 52.1,
     "adjustedAccUsedInWeights": 52.1,
     "rowBasedAdjustedAcc": 55.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 23,
     "acc": 56.5,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 51.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 60,
     "acc": 40.0,
     "adjustedAcc": 45.4,
     "adjustedAccUsedInWeights": 45.4,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 719,
   "globalBlend": 0.527
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3139,
    "diana": 0.1301,
    "nova": 0.2821,
    "flow": 0.2739
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 48.0,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 60.9,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 53.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 62,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 15.0,
     "adjustedAcc": 36.2,
     "adjustedAccUsedInWeights": 36.2,
     "rowBasedAdjustedAcc": 45.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 449,
   "globalBlend": 0.641
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3037,
    "diana": 0.1245,
    "nova": 0.2678,
    "flow": 0.304
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 50.3,
     "adjustedAcc": 50.1,
     "adjustedAccUsedInWeights": 50.1,
     "rowBasedAdjustedAcc": 50.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 21,
     "acc": 66.7,
     "adjustedAcc": 52.2,
     "adjustedAccUsedInWeights": 52.2,
     "rowBasedAdjustedAcc": 52.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
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
     "n": 37,
     "acc": 54.1,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 51.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 250,
   "globalBlend": 0.762
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.32,
    "diana": 0.1323,
    "nova": 0.2656,
    "flow": 0.282
   },
   "acc": {
    "taro": {
     "n": 236,
     "acc": 58.1,
     "adjustedAcc": 53.8,
     "adjustedAccUsedInWeights": 53.8,
     "rowBasedAdjustedAcc": 55.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 96.6,
     "adjustedAcc": 56.1,
     "adjustedAccUsedInWeights": 56.1,
     "rowBasedAdjustedAcc": 59.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 74,
     "acc": 44.6,
     "adjustedAcc": 47.5,
     "adjustedAccUsedInWeights": 47.5,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 32.1,
     "adjustedAcc": 41.5,
     "adjustedAccUsedInWeights": 41.5,
     "rowBasedAdjustedAcc": 44.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 395,
   "globalBlend": 0.669
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3077,
    "diana": 0.1159,
    "nova": 0.2591,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 62.2,
     "adjustedAcc": 55.8,
     "adjustedAccUsedInWeights": 55.8,
     "rowBasedAdjustedAcc": 57.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 41.9,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 183,
     "acc": 51.9,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 51.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
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
   "graded": 449,
   "globalBlend": 0.641
  },
  "로봇": {
   "weights": {
    "taro": 0.2884,
    "diana": 0.1254,
    "nova": 0.2592,
    "flow": 0.327
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 38.7,
     "adjustedAcc": 44.7,
     "adjustedAccUsedInWeights": 44.7,
     "rowBasedAdjustedAcc": 43.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 85.2,
     "adjustedAcc": 54.6,
     "adjustedAccUsedInWeights": 54.6,
     "rowBasedAdjustedAcc": 56.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 92,
     "acc": 45.7,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 32,
     "acc": 75.0,
     "adjustedAcc": 61.5,
     "adjustedAccUsedInWeights": 61.5,
     "rowBasedAdjustedAcc": 55.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 293,
   "globalBlend": 0.732
  },
  "식음료": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.1241,
    "nova": 0.2649,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 51.1,
     "adjustedAcc": 50.5,
     "adjustedAccUsedInWeights": 50.5,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 23,
     "acc": 69.6,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "rowBasedAdjustedAcc": 53.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
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
   "graded": 259,
   "globalBlend": 0.755
  }
 }
};
