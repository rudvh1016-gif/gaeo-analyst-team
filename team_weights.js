// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-17 16:28",
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
   "taro": 0.3076,
   "diana": 0.1251,
   "nova": 0.2658,
   "flow": 0.3015
  },
  "acc": {
   "taro": {
    "n": 7308,
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
    "absoluteN": 7549,
    "uniqueDecisionDays": 19,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.1,
    "alwaysBearAcc": 50.9,
    "bestFixedDirectionAcc": 50.9,
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
     "records": 14380,
     "neutralPct": 21.0,
     "bullPct": 48.2,
     "bearPct": 30.8,
     "meanAbsDeviation": 18.74,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.76,
     "medianPushPoints": 5.23
    }
   },
   "diana": {
    "n": 1288,
    "acc": 55.8,
    "adjustedAcc": 51.0,
    "adjustedAccUsedInWeights": 51.0,
    "rowBasedAdjustedAcc": 55.3,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 4,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 50.2,
    "absoluteN": 1298,
    "uniqueDecisionDays": 4,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.8,
    "alwaysBearAcc": 50.2,
    "bestFixedDirectionAcc": 50.2,
    "liftVsFixedPp": 5.7,
    "acc95": null,
    "lift95": null,
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 20,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 14380,
     "neutralPct": 24.8,
     "bullPct": 61.0,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.74,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.22,
     "medianPushPoints": 2.0
    }
   },
   "nova": {
    "n": 1580,
    "acc": 45.6,
    "adjustedAcc": 47.8,
    "adjustedAccUsedInWeights": 47.8,
    "rowBasedAdjustedAcc": 45.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 19,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 1649,
    "uniqueDecisionDays": 19,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.4,
    "alwaysBearAcc": 53.6,
    "bestFixedDirectionAcc": 53.6,
    "liftVsFixedPp": -8.0,
    "acc95": [
     44.3,
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
     "records": 14380,
     "neutralPct": 81.8,
     "bullPct": 9.5,
     "bearPct": 8.7,
     "meanAbsDeviation": 4.44,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.18,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1213,
    "acc": 49.5,
    "adjustedAcc": 49.7,
    "adjustedAccUsedInWeights": 49.7,
    "rowBasedAdjustedAcc": 49.5,
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
    "alwaysBullAcc": 47.2,
    "alwaysBearAcc": 52.8,
    "bestFixedDirectionAcc": 52.8,
    "liftVsFixedPp": -3.3,
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
     "records": 14380,
     "neutralPct": 87.4,
     "bullPct": 4.2,
     "bearPct": 8.4,
     "meanAbsDeviation": 3.05,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.92,
     "medianPushPoints": 0.3
    }
   }
  },
  "graded": 11389,
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
     "flow": 49.7
    },
    "weights": {
     "taro": 0.3076,
     "diana": 0.1251,
     "nova": 0.2658,
     "flow": 0.3015
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.2,
     "nova": 49.4,
     "flow": 49.9
    },
    "weights": {
     "taro": 0.3022,
     "diana": 0.1212,
     "nova": 0.2761,
     "flow": 0.3005
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.8,
     "diana": 55.3,
     "nova": 45.9,
     "flow": 49.5
    },
    "weights": {
     "taro": 0.3102,
     "diana": 0.142,
     "nova": 0.2496,
     "flow": 0.2982
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
   "hit": 6940,
   "miss": 3975,
   "n": 10915,
   "uniqueDecisionDays": 19,
   "minDaysForConclusion": 20,
   "acc": 63.6,
   "holdBaselineAcc": 64.2,
   "holdBaselineN": 10915,
   "liftVsHoldPp": -0.7,
   "byCall": {
    "BUY": {
     "n": 629,
     "acc": 38.8,
     "band": "±1%",
     "excludedMid": 123,
     "excludedPct": 16.4
    },
    "HOLD": {
     "n": 8330,
     "acc": 67.5,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1956,
     "acc": 54.8,
     "band": "±1%",
     "excludedMid": 327,
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
     "n": 1437,
     "graded": 1214,
     "hit": 487,
     "miss": 727,
     "excluded": 223,
     "acc": 40.1,
     "positivePct": 41.1,
     "crashPct": 24.3,
     "meanRet": -0.53,
     "uniqueDecisionDays": 40,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-10"
    },
    "currentVersion": {
     "n": 752,
     "graded": 629,
     "hit": 244,
     "miss": 385,
     "excluded": 123,
     "acc": 38.8,
     "positivePct": 40.0,
     "crashPct": 21.3,
     "meanRet": -0.55,
     "uniqueDecisionDays": 19,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-10"
    },
    "legacyMixed": {
     "n": 1910,
     "graded": 1628,
     "hit": 627,
     "miss": 1001,
     "excluded": 282,
     "acc": 38.5,
     "positivePct": 39.7,
     "crashPct": 26.5,
     "meanRet": -1.05,
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
     "acc": 43.4,
     "positivePct": 43.2,
     "crashPct": 24.0,
     "meanRet": 0.09,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 11365,
     "weightedDecisionN": 752,
     "uniqueDecisionDays": 19,
     "acc": 39.5,
     "positivePct": 40.0,
     "crashPct": 20.6,
     "meanRet": -0.58,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 890,
      "graded": 729,
      "hit": 311,
      "miss": 418,
      "excluded": 161,
      "acc": 42.7,
      "positivePct": 43.1,
      "crashPct": 18.1,
      "meanRet": -0.08,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "caution": {
      "n": 547,
      "graded": 485,
      "hit": 176,
      "miss": 309,
      "excluded": 62,
      "acc": 36.3,
      "positivePct": 37.8,
      "crashPct": 34.4,
      "meanRet": -1.25,
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
      "graded": 485,
      "hit": 176,
      "miss": 309,
      "excluded": 62,
      "acc": 36.3,
      "positivePct": 37.8,
      "crashPct": 34.4,
      "meanRet": -1.25,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "calm": {
      "n": 890,
      "graded": 729,
      "hit": 311,
      "miss": 418,
      "excluded": 161,
      "acc": 42.7,
      "positivePct": 43.1,
      "crashPct": 18.1,
      "meanRet": -0.08,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-10"
     },
     "crashGapPp": 16.3,
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
      "graded": 257,
      "hit": 105,
      "miss": 152,
      "excluded": 37,
      "acc": 40.9,
      "positivePct": 42.9,
      "crashPct": 29.6,
      "meanRet": -0.53,
      "uniqueDecisionDays": 19,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-10"
     },
     "calm": {
      "n": 458,
      "graded": 372,
      "hit": 139,
      "miss": 233,
      "excluded": 86,
      "acc": 37.4,
      "positivePct": 38.2,
      "crashPct": 15.9,
      "meanRet": -0.57,
      "uniqueDecisionDays": 19,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-10"
     },
     "crashGapPp": 13.7,
     "crashGapCi95": [
      3.4,
      16.6
     ],
     "warnSharePct": 39.1
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.9,
      "otherPct": 10.3,
      "gapPp": 1.5
     },
     "volatility": {
      "flagPct": 6.9,
      "otherPct": 13.1,
      "gapPp": -6.1
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
    "nova": 0.2964,
    "flow": 0.2882
   },
   "acc": {
    "taro": {
     "n": 744,
     "acc": 45.0,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 118,
     "acc": 52.5,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 51.3,
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
     "n": 137,
     "acc": 44.5,
     "adjustedAcc": 47.3,
     "adjustedAccUsedInWeights": 47.3,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1119,
   "globalBlend": 0.417
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1211,
    "nova": 0.2595,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 368,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 31.4,
     "adjustedAcc": 46.9,
     "adjustedAccUsedInWeights": 46.9,
     "rowBasedAdjustedAcc": 44.4,
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
     "n": 117,
     "acc": 48.7,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 49.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 596,
   "globalBlend": 0.573
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.306,
    "diana": 0.1271,
    "nova": 0.2714,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 46.1,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "rowBasedAdjustedAcc": 47.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 51.9,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 60,
     "acc": 45.0,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 42.2,
     "adjustedAcc": 46.2,
     "adjustedAccUsedInWeights": 46.2,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 586,
   "globalBlend": 0.577
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2927,
    "diana": 0.1105,
    "nova": 0.286,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 51.7,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 10.3,
     "adjustedAcc": 43.4,
     "adjustedAccUsedInWeights": 43.4,
     "rowBasedAdjustedAcc": 34.3,
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
   "graded": 464,
   "globalBlend": 0.633
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.302,
    "diana": 0.1207,
    "nova": 0.2651,
    "flow": 0.3121
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 55.7,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 54.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 58.9,
     "adjustedAcc": 51.5,
     "adjustedAccUsedInWeights": 51.5,
     "rowBasedAdjustedAcc": 52.8,
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
   "graded": 391,
   "globalBlend": 0.672
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3186,
    "diana": 0.1294,
    "nova": 0.2564,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 383,
     "acc": 56.9,
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
   "graded": 566,
   "globalBlend": 0.586
  },
  "2차전지": {
   "weights": {
    "taro": 0.2999,
    "diana": 0.1286,
    "nova": 0.2921,
    "flow": 0.2795
   },
   "acc": {
    "taro": {
     "n": 358,
     "acc": 45.3,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 46.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 66.7,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 48,
     "acc": 60.4,
     "adjustedAcc": 54.9,
     "adjustedAccUsedInWeights": 54.9,
     "rowBasedAdjustedAcc": 53.0,
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
    "taro": 0.3008,
    "diana": 0.1271,
    "nova": 0.2554,
    "flow": 0.3167
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 51.6,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 50.8,
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
     "n": 104,
     "acc": 41.3,
     "adjustedAcc": 45.8,
     "adjustedAccUsedInWeights": 45.8,
     "rowBasedAdjustedAcc": 46.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
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
   "graded": 292,
   "globalBlend": 0.733
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3097,
    "diana": 0.1215,
    "nova": 0.2314,
    "flow": 0.3375
   },
   "acc": {
    "taro": {
     "n": 915,
     "acc": 55.1,
     "adjustedAcc": 52.5,
     "adjustedAccUsedInWeights": 52.5,
     "rowBasedAdjustedAcc": 54.5,
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
     "n": 440,
     "acc": 34.5,
     "adjustedAcc": 42.5,
     "adjustedAccUsedInWeights": 42.5,
     "rowBasedAdjustedAcc": 37.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 134,
     "acc": 64.2,
     "adjustedAcc": 56.9,
     "adjustedAccUsedInWeights": 56.9,
     "rowBasedAdjustedAcc": 57.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1660,
   "globalBlend": 0.325
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3235,
    "diana": 0.1273,
    "nova": 0.2579,
    "flow": 0.2913
   },
   "acc": {
    "taro": {
     "n": 476,
     "acc": 56.9,
     "adjustedAcc": 53.4,
     "adjustedAccUsedInWeights": 53.4,
     "rowBasedAdjustedAcc": 55.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 60.2,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 54.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 124,
     "acc": 40.3,
     "adjustedAcc": 45.3,
     "adjustedAccUsedInWeights": 45.3,
     "rowBasedAdjustedAcc": 45.1,
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
   "graded": 742,
   "globalBlend": 0.519
  },
  "조선": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.1238,
    "nova": 0.2663,
    "flow": 0.3036
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 44.4,
     "adjustedAcc": 47.3,
     "adjustedAccUsedInWeights": 47.3,
     "rowBasedAdjustedAcc": 46.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 32.1,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 44.5,
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
     "n": 33,
     "acc": 45.5,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 49.0,
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
    "taro": 0.309,
    "diana": 0.1295,
    "nova": 0.2642,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 53.7,
     "adjustedAcc": 51.8,
     "adjustedAccUsedInWeights": 51.8,
     "rowBasedAdjustedAcc": 52.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 89.7,
     "adjustedAcc": 56.6,
     "adjustedAccUsedInWeights": 56.6,
     "rowBasedAdjustedAcc": 57.7,
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
   "graded": 225,
   "globalBlend": 0.78
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2988,
    "diana": 0.1269,
    "nova": 0.293,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 597,
     "acc": 47.9,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 86,
     "acc": 65.1,
     "adjustedAcc": 52.5,
     "adjustedAccUsedInWeights": 52.5,
     "rowBasedAdjustedAcc": 56.3,
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
   "graded": 770,
   "globalBlend": 0.51
  },
  "물류·운송": {
   "weights": {
    "taro": 0.312,
    "diana": 0.1253,
    "nova": 0.2663,
    "flow": 0.2963
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 54.3,
     "adjustedAcc": 52.1,
     "adjustedAccUsedInWeights": 52.1,
     "rowBasedAdjustedAcc": 52.2,
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
   "graded": 215,
   "globalBlend": 0.788
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3146,
    "diana": 0.131,
    "nova": 0.2853,
    "flow": 0.2692
   },
   "acc": {
    "taro": {
     "n": 338,
     "acc": 47.9,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 66,
     "acc": 59.1,
     "adjustedAcc": 51.5,
     "adjustedAccUsedInWeights": 51.5,
     "rowBasedAdjustedAcc": 53.2,
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
   "graded": 488,
   "globalBlend": 0.621
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3041,
    "diana": 0.125,
    "nova": 0.269,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 50.3,
     "adjustedAcc": 50.1,
     "adjustedAccUsedInWeights": 50.1,
     "rowBasedAdjustedAcc": 50.2,
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
     "acc": 52.5,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 267,
   "globalBlend": 0.75
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3187,
    "diana": 0.135,
    "nova": 0.268,
    "flow": 0.2783
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 56.9,
     "adjustedAcc": 53.4,
     "adjustedAccUsedInWeights": 53.4,
     "rowBasedAdjustedAcc": 54.6,
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
    "taro": 0.3083,
    "diana": 0.1154,
    "nova": 0.2592,
    "flow": 0.317
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 62.0,
     "adjustedAcc": 55.9,
     "adjustedAccUsedInWeights": 55.9,
     "rowBasedAdjustedAcc": 57.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 40.9,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 47.6,
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
    "diana": 0.1272,
    "nova": 0.26,
    "flow": 0.3244
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 40.1,
     "adjustedAcc": 45.2,
     "adjustedAccUsedInWeights": 45.2,
     "rowBasedAdjustedAcc": 44.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 86.1,
     "adjustedAcc": 56.0,
     "adjustedAccUsedInWeights": 56.0,
     "rowBasedAdjustedAcc": 58.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 4,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 101,
     "acc": 46.5,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 48.4,
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
   "graded": 317,
   "globalBlend": 0.716
  },
  "식음료": {
   "weights": {
    "taro": 0.3031,
    "diana": 0.1234,
    "nova": 0.2658,
    "flow": 0.3077
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 51.3,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 57.6,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 51.6,
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
   "graded": 280,
   "globalBlend": 0.741
  }
 }
};
