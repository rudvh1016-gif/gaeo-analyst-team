// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-18 09:17",
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
   "taro": 0.3085,
   "diana": 0.1252,
   "nova": 0.2656,
   "flow": 0.3007
  },
  "acc": {
   "taro": {
    "n": 7647,
    "acc": 50.8,
    "adjustedAcc": 50.4,
    "adjustedAccUsedInWeights": 50.4,
    "rowBasedAdjustedAcc": 50.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.6,
    "absoluteN": 7889,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.1,
    "alwaysBearAcc": 50.9,
    "bestFixedDirectionAcc": 50.9,
    "liftVsFixedPp": -0.1,
    "acc95": [
     48.4,
     53.3
    ],
    "lift95": [
     -2.5,
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
     "meanPushPoints": 5.78,
     "medianPushPoints": 5.24
    }
   },
   "diana": {
    "n": 1612,
    "acc": 54.3,
    "adjustedAcc": 50.9,
    "adjustedAccUsedInWeights": 50.9,
    "rowBasedAdjustedAcc": 54.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 5,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 52.9,
    "absoluteN": 1625,
    "uniqueDecisionDays": 5,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": 3.8,
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
    "n": 1673,
    "acc": 45.4,
    "adjustedAcc": 47.7,
    "adjustedAccUsedInWeights": 47.7,
    "rowBasedAdjustedAcc": 45.7,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.9,
    "absoluteN": 1734,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.7,
    "alwaysBearAcc": 53.3,
    "bestFixedDirectionAcc": 53.3,
    "liftVsFixedPp": -7.9,
    "acc95": [
     44.4,
     47.3
    ],
    "lift95": [
     -10.5,
     -6.8
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
    "n": 1275,
    "acc": 49.1,
    "adjustedAcc": 49.5,
    "adjustedAccUsedInWeights": 49.5,
    "rowBasedAdjustedAcc": 49.2,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.9,
    "absoluteN": 1309,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.6,
    "alwaysBearAcc": 52.4,
    "bestFixedDirectionAcc": 52.4,
    "liftVsFixedPp": -3.3,
    "acc95": [
     41.5,
     55.9
    ],
    "lift95": [
     -12.4,
     2.6
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
  "graded": 12207,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 20,
    "diana": 5,
    "nova": 20,
    "flow": 20
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.4,
     "diana": 50.9,
     "nova": 47.7,
     "flow": 49.5
    },
    "weights": {
     "taro": 0.3085,
     "diana": 0.1252,
     "nova": 0.2656,
     "flow": 0.3007
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.2,
     "nova": 49.3,
     "flow": 49.9
    },
    "weights": {
     "taro": 0.3025,
     "diana": 0.1212,
     "nova": 0.2759,
     "flow": 0.3003
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.8,
     "diana": 54.0,
     "nova": 45.7,
     "flow": 49.2
    },
    "weights": {
     "taro": 0.3129,
     "diana": 0.138,
     "nova": 0.251,
     "flow": 0.2982
    },
    "note": "2026-09-05 이전 실제 산식(채점 건수 단위, 가상표본 120건). 비교용 기록이다."
   },
   "maturityGate": {
    "enabled": false,
    "weights": {
     "taro": 0.3097,
     "diana": 0.1224,
     "nova": 0.2665,
     "flow": 0.3014
    },
    "note": "판단일이 기준 미만인 분석가를 통째로 역할 사전비중으로 되돌리는 거친 장치. 절벽을 20일째로 옮기기만 하므로 켜지 않는다. 판단일 단위 축소가 2026-09-14 DIANA 채점 시작의 하루치 급변을 대신 막는다."
   }
  },
  "team": {
   "basis": "absolute_return",
   "hit": 7369,
   "miss": 4114,
   "n": 11483,
   "uniqueDecisionDays": 20,
   "minDaysForConclusion": 20,
   "acc": 64.2,
   "holdBaselineAcc": 65.1,
   "holdBaselineN": 11483,
   "liftVsHoldPp": -0.9,
   "byCall": {
    "BUY": {
     "n": 667,
     "acc": 38.4,
     "band": "±1%",
     "excludedMid": 126,
     "excludedPct": 15.9
    },
    "HOLD": {
     "n": 8776,
     "acc": 68.3,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 2040,
     "acc": 54.7,
     "band": "±1%",
     "excludedMid": 354,
     "excludedPct": 14.8
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
     "n": 1478,
     "graded": 1252,
     "hit": 499,
     "miss": 753,
     "excluded": 226,
     "acc": 39.9,
     "positivePct": 40.7,
     "crashPct": 23.7,
     "meanRet": -0.51,
     "uniqueDecisionDays": 41,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-11"
    },
    "currentVersion": {
     "n": 793,
     "graded": 667,
     "hit": 256,
     "miss": 411,
     "excluded": 126,
     "acc": 38.4,
     "positivePct": 39.3,
     "crashPct": 20.4,
     "meanRet": -0.51,
     "uniqueDecisionDays": 20,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-11"
    },
    "legacyMixed": {
     "n": 1951,
     "graded": 1666,
     "hit": 639,
     "miss": 1027,
     "excluded": 285,
     "acc": 38.4,
     "positivePct": 39.5,
     "crashPct": 26.0,
     "meanRet": -1.02,
     "uniqueDecisionDays": 53,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-11"
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
     "n": 22460,
     "weightedDecisionN": 1478,
     "uniqueDecisionDays": 41,
     "acc": 43.4,
     "positivePct": 43.2,
     "crashPct": 23.4,
     "meanRet": 0.11,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 11963,
     "weightedDecisionN": 793,
     "uniqueDecisionDays": 20,
     "acc": 39.7,
     "positivePct": 40.1,
     "crashPct": 19.7,
     "meanRet": -0.52,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 917,
      "graded": 752,
      "hit": 317,
      "miss": 435,
      "excluded": 165,
      "acc": 42.2,
      "positivePct": 42.5,
      "crashPct": 17.8,
      "meanRet": -0.08,
      "uniqueDecisionDays": 41,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "caution": {
      "n": 561,
      "graded": 500,
      "hit": 182,
      "miss": 318,
      "excluded": 61,
      "acc": 36.4,
      "positivePct": 37.8,
      "crashPct": 33.5,
      "meanRet": -1.2,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 561,
     "calmN": 917,
     "unknownN": 0,
     "warn": {
      "n": 561,
      "graded": 500,
      "hit": 182,
      "miss": 318,
      "excluded": 61,
      "acc": 36.4,
      "positivePct": 37.8,
      "crashPct": 33.5,
      "meanRet": -1.2,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "calm": {
      "n": 917,
      "graded": 752,
      "hit": 317,
      "miss": 435,
      "excluded": 165,
      "acc": 42.2,
      "positivePct": 42.5,
      "crashPct": 17.8,
      "meanRet": -0.08,
      "uniqueDecisionDays": 41,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "crashGapPp": 15.7,
     "crashGapCi95": [
      10.6,
      23.9
     ],
     "warnSharePct": 38.0
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 308,
     "calmN": 485,
     "unknownN": 0,
     "warn": {
      "n": 308,
      "graded": 272,
      "hit": 111,
      "miss": 161,
      "excluded": 36,
      "acc": 40.8,
      "positivePct": 42.5,
      "crashPct": 28.2,
      "meanRet": -0.46,
      "uniqueDecisionDays": 20,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-11"
     },
     "calm": {
      "n": 485,
      "graded": 395,
      "hit": 145,
      "miss": 250,
      "excluded": 90,
      "acc": 36.7,
      "positivePct": 37.3,
      "crashPct": 15.5,
      "meanRet": -0.55,
      "uniqueDecisionDays": 20,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-11"
     },
     "crashGapPp": 12.7,
     "crashGapCi95": [
      4.1,
      16.3
     ],
     "warnSharePct": 38.8
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.6,
      "otherPct": 9.9,
      "gapPp": 1.7
     },
     "volatility": {
      "flagPct": 6.8,
      "otherPct": 12.6,
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
      "recorded": 193
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
    "taro": 0.2937,
    "diana": 0.1251,
    "nova": 0.2929,
    "flow": 0.2883
   },
   "acc": {
    "taro": {
     "n": 782,
     "acc": 45.8,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 146,
     "acc": 55.5,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 53.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 124,
     "acc": 56.5,
     "adjustedAcc": 53.2,
     "adjustedAccUsedInWeights": 53.2,
     "rowBasedAdjustedAcc": 53.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 156,
     "acc": 44.9,
     "adjustedAcc": 47.4,
     "adjustedAccUsedInWeights": 47.4,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1208,
   "globalBlend": 0.398
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3149,
    "diana": 0.1211,
    "nova": 0.2573,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 66,
     "acc": 33.3,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 44.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 65,
     "acc": 36.9,
     "adjustedAcc": 43.6,
     "adjustedAccUsedInWeights": 43.6,
     "rowBasedAdjustedAcc": 45.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 48.8,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 49.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 640,
   "globalBlend": 0.556
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1271,
    "nova": 0.2736,
    "flow": 0.2951
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 45.8,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 46.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 68,
     "acc": 52.9,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 51.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 66,
     "acc": 47.0,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 43.3,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 628,
   "globalBlend": 0.56
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.109,
    "nova": 0.2869,
    "flow": 0.3106
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 52.1,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 51.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 96,
     "acc": 11.5,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 32.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
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
     "n": 60,
     "acc": 65.0,
     "adjustedAcc": 57.5,
     "adjustedAccUsedInWeights": 57.5,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 497,
   "globalBlend": 0.617
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3031,
    "diana": 0.1199,
    "nova": 0.261,
    "flow": 0.3159
   },
   "acc": {
    "taro": {
     "n": 309,
     "acc": 55.3,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 53.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 52.9,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 51.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 8,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 67.5,
     "adjustedAcc": 58.0,
     "adjustedAccUsedInWeights": 58.0,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 427,
   "globalBlend": 0.652
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3202,
    "diana": 0.1291,
    "nova": 0.2572,
    "flow": 0.2935
   },
   "acc": {
    "taro": {
     "n": 401,
     "acc": 56.1,
     "adjustedAcc": 53.1,
     "adjustedAccUsedInWeights": 53.1,
     "rowBasedAdjustedAcc": 54.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 115,
     "acc": 65.2,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 57.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
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
     "n": 91,
     "acc": 45.1,
     "adjustedAcc": 47.5,
     "adjustedAccUsedInWeights": 47.5,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 614,
   "globalBlend": 0.566
  },
  "2차전지": {
   "weights": {
    "taro": 0.2995,
    "diana": 0.1292,
    "nova": 0.2929,
    "flow": 0.2784
   },
   "acc": {
    "taro": {
     "n": 372,
     "acc": 44.9,
     "adjustedAcc": 47.4,
     "adjustedAccUsedInWeights": 47.4,
     "rowBasedAdjustedAcc": 46.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 65.1,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 55.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 50,
     "acc": 60.0,
     "adjustedAcc": 54.9,
     "adjustedAccUsedInWeights": 54.9,
     "rowBasedAdjustedAcc": 52.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 32.0,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 44.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 535,
   "globalBlend": 0.599
  },
  "보험": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.1263,
    "nova": 0.2545,
    "flow": 0.3188
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 75.9,
     "adjustedAcc": 55.2,
     "adjustedAccUsedInWeights": 55.2,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 107,
     "acc": 41.1,
     "adjustedAcc": 45.6,
     "adjustedAccUsedInWeights": 45.6,
     "rowBasedAdjustedAcc": 45.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 69.2,
     "adjustedAcc": 59.4,
     "adjustedAccUsedInWeights": 59.4,
     "rowBasedAdjustedAcc": 54.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 307,
   "globalBlend": 0.723
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3124,
    "diana": 0.1221,
    "nova": 0.2307,
    "flow": 0.3349
   },
   "acc": {
    "taro": {
     "n": 968,
     "acc": 55.4,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 208,
     "acc": 56.7,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 478,
     "acc": 34.7,
     "adjustedAcc": 42.4,
     "adjustedAccUsedInWeights": 42.4,
     "rowBasedAdjustedAcc": 37.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 139,
     "acc": 62.6,
     "adjustedAcc": 56.3,
     "adjustedAccUsedInWeights": 56.3,
     "rowBasedAdjustedAcc": 56.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1793,
   "globalBlend": 0.309
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3263,
    "diana": 0.1282,
    "nova": 0.2578,
    "flow": 0.2876
   },
   "acc": {
    "taro": {
     "n": 492,
     "acc": 56.9,
     "adjustedAcc": 53.5,
     "adjustedAccUsedInWeights": 53.5,
     "rowBasedAdjustedAcc": 55.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 59.3,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 54.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 132,
     "acc": 40.2,
     "adjustedAcc": 45.1,
     "adjustedAccUsedInWeights": 45.1,
     "rowBasedAdjustedAcc": 44.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 41.3,
     "adjustedAcc": 45.9,
     "adjustedAccUsedInWeights": 45.9,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 793,
   "globalBlend": 0.502
  },
  "조선": {
   "weights": {
    "taro": 0.3045,
    "diana": 0.1232,
    "nova": 0.265,
    "flow": 0.3073
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 43.8,
     "adjustedAcc": 46.9,
     "adjustedAccUsedInWeights": 46.9,
     "rowBasedAdjustedAcc": 45.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 34.9,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 44.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
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
     "n": 36,
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
    }
   },
   "graded": 325,
   "globalBlend": 0.711
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3095,
    "diana": 0.132,
    "nova": 0.2645,
    "flow": 0.2939
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 52.8,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 51.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 91.9,
     "adjustedAcc": 58.4,
     "adjustedAccUsedInWeights": 58.4,
     "rowBasedAdjustedAcc": 59.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
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
     "n": 6,
     "acc": 33.3,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 49.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 243,
   "globalBlend": 0.767
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1284,
    "nova": 0.2903,
    "flow": 0.2804
   },
   "acc": {
    "taro": {
     "n": 618,
     "acc": 48.2,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 102,
     "acc": 64.7,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 56.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 26,
     "acc": 57.7,
     "adjustedAcc": 53.7,
     "adjustedAccUsedInWeights": 53.7,
     "rowBasedAdjustedAcc": 51.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 40.0,
     "adjustedAcc": 45.1,
     "adjustedAccUsedInWeights": 45.1,
     "rowBasedAdjustedAcc": 46.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 811,
   "globalBlend": 0.497
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3129,
    "diana": 0.1251,
    "nova": 0.2662,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 54.1,
     "adjustedAcc": 52.1,
     "adjustedAccUsedInWeights": 52.1,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 51.7,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
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
     "n": 65,
     "acc": 43.1,
     "adjustedAcc": 46.5,
     "adjustedAccUsedInWeights": 46.5,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 228,
   "globalBlend": 0.778
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3174,
    "diana": 0.131,
    "nova": 0.2856,
    "flow": 0.2659
   },
   "acc": {
    "taro": {
     "n": 349,
     "acc": 48.4,
     "adjustedAcc": 49.2,
     "adjustedAccUsedInWeights": 49.2,
     "rowBasedAdjustedAcc": 48.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 85,
     "acc": 55.3,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 64,
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
    },
    "flow": {
     "n": 22,
     "acc": 13.6,
     "adjustedAcc": 34.4,
     "adjustedAccUsedInWeights": 34.4,
     "rowBasedAdjustedAcc": 44.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 520,
   "globalBlend": 0.606
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.1253,
    "nova": 0.2708,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 49.5,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 61.3,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 52.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 26,
     "acc": 53.8,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 286,
   "globalBlend": 0.737
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3174,
    "diana": 0.1358,
    "nova": 0.2715,
    "flow": 0.2753
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 56.0,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 54.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 49,
     "acc": 89.8,
     "adjustedAcc": 58.0,
     "adjustedAccUsedInWeights": 58.0,
     "rowBasedAdjustedAcc": 61.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 85,
     "acc": 49.4,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 31.1,
     "adjustedAcc": 40.6,
     "adjustedAccUsedInWeights": 40.6,
     "rowBasedAdjustedAcc": 43.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 447,
   "globalBlend": 0.642
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3086,
    "diana": 0.1142,
    "nova": 0.2596,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 61.3,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 57.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 58,
     "acc": 37.9,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 46.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 193,
     "acc": 51.8,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 51.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
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
   "graded": 509,
   "globalBlend": 0.611
  },
  "기계": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.1206,
    "nova": 0.2593,
    "flow": 0.3144
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 53.3,
     "adjustedAcc": 51.6,
     "adjustedAccUsedInWeights": 51.6,
     "rowBasedAdjustedAcc": 51.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 35.5,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "rowBasedAdjustedAcc": 47.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 26,
     "acc": 42.3,
     "adjustedAcc": 46.4,
     "adjustedAccUsedInWeights": 46.4,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 13,
     "acc": 84.6,
     "adjustedAcc": 59.0,
     "adjustedAccUsedInWeights": 59.0,
     "rowBasedAdjustedAcc": 53.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 207,
   "globalBlend": 0.794
  },
  "로봇": {
   "weights": {
    "taro": 0.2877,
    "diana": 0.1285,
    "nova": 0.2618,
    "flow": 0.3219
   },
   "acc": {
    "taro": {
     "n": 157,
     "acc": 40.8,
     "adjustedAcc": 45.4,
     "adjustedAccUsedInWeights": 45.4,
     "rowBasedAdjustedAcc": 44.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 85.7,
     "adjustedAcc": 57.1,
     "adjustedAccUsedInWeights": 57.1,
     "rowBasedAdjustedAcc": 59.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 110,
     "acc": 49.1,
     "adjustedAcc": 49.5,
     "adjustedAccUsedInWeights": 49.5,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 70.6,
     "adjustedAcc": 60.0,
     "adjustedAccUsedInWeights": 60.0,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 343,
   "globalBlend": 0.7
  },
  "식음료": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.121,
    "nova": 0.2664,
    "flow": 0.3084
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 42.6,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
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
   "graded": 304,
   "globalBlend": 0.725
  },
  "여행레저": {
   "weights": {
    "taro": 0.3103,
    "diana": 0.1252,
    "nova": 0.2839,
    "flow": 0.2807
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 48.7,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 49.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 18,
     "acc": 44.4,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 49.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 54,
     "acc": 61.1,
     "adjustedAcc": 55.4,
     "adjustedAccUsedInWeights": 55.4,
     "rowBasedAdjustedAcc": 53.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 19,
     "acc": 10.5,
     "adjustedAcc": 34.4,
     "adjustedAccUsedInWeights": 34.4,
     "rowBasedAdjustedAcc": 44.6,
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
  }
 }
};
