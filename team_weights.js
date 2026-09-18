// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-18 16:09",
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
   "taro": 0.3082,
   "diana": 0.1247,
   "nova": 0.2655,
   "flow": 0.3016
  },
  "acc": {
   "taro": {
    "n": 7664,
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
    "absoluteAcc": 47.7,
    "absoluteN": 7926,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.1,
    "alwaysBearAcc": 50.9,
    "bestFixedDirectionAcc": 50.9,
    "liftVsFixedPp": -0.0,
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
     "records": 14980,
     "neutralPct": 21.0,
     "bullPct": 47.7,
     "bearPct": 31.3,
     "meanAbsDeviation": 18.71,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.77,
     "medianPushPoints": 5.24
    }
   },
   "diana": {
    "n": 1627,
    "acc": 54.1,
    "adjustedAcc": 50.8,
    "adjustedAccUsedInWeights": 50.8,
    "rowBasedAdjustedAcc": 53.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 5,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 51.7,
    "absoluteN": 1626,
    "uniqueDecisionDays": 5,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.5,
    "alwaysBearAcc": 50.5,
    "bestFixedDirectionAcc": 50.5,
    "liftVsFixedPp": 3.6,
    "acc95": null,
    "lift95": null,
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 20,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 14980,
     "neutralPct": 24.8,
     "bullPct": 61.1,
     "bearPct": 14.2,
     "meanAbsDeviation": 17.76,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.21,
     "medianPushPoints": 2.0
    }
   },
   "nova": {
    "n": 1679,
    "acc": 45.5,
    "adjustedAcc": 47.8,
    "adjustedAccUsedInWeights": 47.8,
    "rowBasedAdjustedAcc": 45.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.0,
    "absoluteN": 1746,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.6,
    "alwaysBearAcc": 53.4,
    "bestFixedDirectionAcc": 53.4,
    "liftVsFixedPp": -7.9,
    "acc95": [
     44.5,
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
     "records": 14980,
     "neutralPct": 81.5,
     "bullPct": 9.7,
     "bearPct": 8.9,
     "meanAbsDeviation": 4.48,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.19,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1277,
    "acc": 49.4,
    "adjustedAcc": 49.7,
    "adjustedAccUsedInWeights": 49.7,
    "rowBasedAdjustedAcc": 49.5,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.0,
    "absoluteN": 1312,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.5,
    "alwaysBearAcc": 52.5,
    "bestFixedDirectionAcc": 52.5,
    "liftVsFixedPp": -3.1,
    "acc95": [
     41.6,
     55.9
    ],
    "lift95": [
     -12.0,
     2.6
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 14980,
     "neutralPct": 87.5,
     "bullPct": 4.1,
     "bearPct": 8.4,
     "meanAbsDeviation": 3.04,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.92,
     "medianPushPoints": 0.3
    }
   }
  },
  "graded": 12247,
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
     "diana": 50.8,
     "nova": 47.8,
     "flow": 49.7
    },
    "weights": {
     "taro": 0.3082,
     "diana": 0.1247,
     "nova": 0.2655,
     "flow": 0.3016
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
     "taro": 0.3024,
     "diana": 0.1211,
     "nova": 0.2759,
     "flow": 0.3006
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.8,
     "diana": 53.8,
     "nova": 45.8,
     "flow": 49.5
    },
    "weights": {
     "taro": 0.3125,
     "diana": 0.1367,
     "nova": 0.2508,
     "flow": 0.2999
    },
    "note": "2026-09-05 이전 실제 산식(채점 건수 단위, 가상표본 120건). 비교용 기록이다."
   },
   "maturityGate": {
    "enabled": false,
    "weights": {
     "taro": 0.3089,
     "diana": 0.1221,
     "nova": 0.2666,
     "flow": 0.3024
    },
    "note": "판단일이 기준 미만인 분석가를 통째로 역할 사전비중으로 되돌리는 거친 장치. 절벽을 20일째로 옮기기만 하므로 켜지 않는다. 판단일 단위 축소가 2026-09-14 DIANA 채점 시작의 하루치 급변을 대신 막는다."
   }
  },
  "team": {
   "basis": "absolute_return",
   "hit": 7352,
   "miss": 4134,
   "n": 11486,
   "uniqueDecisionDays": 20,
   "minDaysForConclusion": 20,
   "acc": 64.0,
   "holdBaselineAcc": 64.8,
   "holdBaselineN": 11486,
   "liftVsHoldPp": -0.8,
   "byCall": {
    "BUY": {
     "n": 669,
     "acc": 38.6,
     "band": "±1%",
     "excludedMid": 124,
     "excludedPct": 15.6
    },
    "HOLD": {
     "n": 8776,
     "acc": 68.0,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 2041,
     "acc": 55.1,
     "band": "±1%",
     "excludedMid": 353,
     "excludedPct": 14.7
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
     "graded": 1254,
     "hit": 501,
     "miss": 753,
     "excluded": 224,
     "acc": 40.0,
     "positivePct": 40.7,
     "crashPct": 23.9,
     "meanRet": -0.52,
     "uniqueDecisionDays": 41,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-11"
    },
    "currentVersion": {
     "n": 793,
     "graded": 669,
     "hit": 258,
     "miss": 411,
     "excluded": 124,
     "acc": 38.6,
     "positivePct": 39.3,
     "crashPct": 20.7,
     "meanRet": -0.55,
     "uniqueDecisionDays": 20,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-11"
    },
    "legacyMixed": {
     "n": 1951,
     "graded": 1668,
     "hit": 641,
     "miss": 1027,
     "excluded": 283,
     "acc": 38.4,
     "positivePct": 39.5,
     "crashPct": 26.1,
     "meanRet": -1.03,
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
     "acc": 43.2,
     "positivePct": 43.0,
     "crashPct": 23.6,
     "meanRet": 0.1,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 11963,
     "weightedDecisionN": 793,
     "uniqueDecisionDays": 20,
     "acc": 39.4,
     "positivePct": 39.8,
     "crashPct": 20.0,
     "meanRet": -0.54,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 917,
      "graded": 754,
      "hit": 318,
      "miss": 436,
      "excluded": 163,
      "acc": 42.2,
      "positivePct": 42.5,
      "crashPct": 18.0,
      "meanRet": -0.11,
      "uniqueDecisionDays": 41,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "caution": {
      "n": 561,
      "graded": 500,
      "hit": 183,
      "miss": 317,
      "excluded": 61,
      "acc": 36.6,
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
      "hit": 183,
      "miss": 317,
      "excluded": 61,
      "acc": 36.6,
      "positivePct": 37.8,
      "crashPct": 33.5,
      "meanRet": -1.2,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "calm": {
      "n": 917,
      "graded": 754,
      "hit": 318,
      "miss": 436,
      "excluded": 163,
      "acc": 42.2,
      "positivePct": 42.5,
      "crashPct": 18.0,
      "meanRet": -0.11,
      "uniqueDecisionDays": 41,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "crashGapPp": 15.5,
     "crashGapCi95": [
      10.5,
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
      "hit": 112,
      "miss": 160,
      "excluded": 36,
      "acc": 41.2,
      "positivePct": 42.5,
      "crashPct": 28.2,
      "meanRet": -0.47,
      "uniqueDecisionDays": 20,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-11"
     },
     "calm": {
      "n": 485,
      "graded": 397,
      "hit": 146,
      "miss": 251,
      "excluded": 88,
      "acc": 36.8,
      "positivePct": 37.3,
      "crashPct": 15.9,
      "meanRet": -0.6,
      "uniqueDecisionDays": 20,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-11"
     },
     "crashGapPp": 12.3,
     "crashGapCi95": [
      3.8,
      16.3
     ],
     "warnSharePct": 38.8
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.8,
      "otherPct": 10.5,
      "gapPp": 1.3
     },
     "volatility": {
      "flagPct": 6.8,
      "otherPct": 13.2,
      "gapPp": -6.4
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
    "taro": 0.2931,
    "diana": 0.1252,
    "nova": 0.2927,
    "flow": 0.289
   },
   "acc": {
    "taro": {
     "n": 784,
     "acc": 46.0,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 150,
     "acc": 57.3,
     "adjustedAcc": 51.5,
     "adjustedAccUsedInWeights": 51.5,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 125,
     "acc": 56.8,
     "adjustedAcc": 53.4,
     "adjustedAccUsedInWeights": 53.4,
     "rowBasedAdjustedAcc": 53.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 154,
     "acc": 45.5,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 47.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1213,
   "globalBlend": 0.397
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3153,
    "diana": 0.1206,
    "nova": 0.2571,
    "flow": 0.3071
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 50.9,
     "adjustedAcc": 50.5,
     "adjustedAccUsedInWeights": 50.5,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 67,
     "acc": 32.8,
     "adjustedAcc": 46.6,
     "adjustedAccUsedInWeights": 46.6,
     "rowBasedAdjustedAcc": 43.9,
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
    "taro": 0.3038,
    "diana": 0.126,
    "nova": 0.2734,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 406,
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
     "n": 67,
     "acc": 50.7,
     "adjustedAcc": 50.1,
     "adjustedAccUsedInWeights": 50.1,
     "rowBasedAdjustedAcc": 50.3,
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
     "n": 93,
     "acc": 44.1,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 47.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 632,
   "globalBlend": 0.559
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1086,
    "nova": 0.287,
    "flow": 0.3112
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
     "n": 98,
     "acc": 11.2,
     "adjustedAcc": 42.2,
     "adjustedAccUsedInWeights": 42.2,
     "rowBasedAdjustedAcc": 32.6,
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
   "graded": 499,
   "globalBlend": 0.616
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1195,
    "nova": 0.2611,
    "flow": 0.3166
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 55.2,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "rowBasedAdjustedAcc": 53.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 52.2,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.8,
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
    "taro": 0.3189,
    "diana": 0.1284,
    "nova": 0.2573,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 402,
     "acc": 55.5,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 54.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 116,
     "acc": 63.8,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 56.8,
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
     "n": 92,
     "acc": 45.7,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 617,
   "globalBlend": 0.565
  },
  "2차전지": {
   "weights": {
    "taro": 0.3002,
    "diana": 0.1287,
    "nova": 0.2906,
    "flow": 0.2805
   },
   "acc": {
    "taro": {
     "n": 374,
     "acc": 45.5,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 64.5,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 51,
     "acc": 58.8,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 52.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 33.3,
     "adjustedAcc": 42.9,
     "adjustedAccUsedInWeights": 42.9,
     "rowBasedAdjustedAcc": 45.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 538,
   "globalBlend": 0.598
  },
  "보험": {
   "weights": {
    "taro": 0.2994,
    "diana": 0.1258,
    "nova": 0.2555,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "adjustedAccUsedInWeights": 50.2,
     "rowBasedAdjustedAcc": 50.2,
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
     "n": 108,
     "acc": 42.6,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 46.5,
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
   "graded": 311,
   "globalBlend": 0.72
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3134,
    "diana": 0.1218,
    "nova": 0.2304,
    "flow": 0.3344
   },
   "acc": {
    "taro": {
     "n": 966,
     "acc": 55.7,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 55.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 209,
     "acc": 56.5,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 477,
     "acc": 34.6,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 37.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 141,
     "acc": 62.4,
     "adjustedAcc": 56.2,
     "adjustedAccUsedInWeights": 56.2,
     "rowBasedAdjustedAcc": 56.7,
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
    "taro": 0.3243,
    "diana": 0.1269,
    "nova": 0.2589,
    "flow": 0.2899
   },
   "acc": {
    "taro": {
     "n": 495,
     "acc": 57.2,
     "adjustedAcc": 53.6,
     "adjustedAccUsedInWeights": 53.6,
     "rowBasedAdjustedAcc": 55.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 59.2,
     "adjustedAcc": 51.8,
     "adjustedAccUsedInWeights": 51.8,
     "rowBasedAdjustedAcc": 54.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 134,
     "acc": 41.8,
     "adjustedAcc": 45.9,
     "adjustedAccUsedInWeights": 45.9,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
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
   "graded": 798,
   "globalBlend": 0.501
  },
  "조선": {
   "weights": {
    "taro": 0.3044,
    "diana": 0.1227,
    "nova": 0.265,
    "flow": 0.308
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
     "n": 62,
     "acc": 33.9,
     "adjustedAcc": 46.8,
     "adjustedAccUsedInWeights": 46.8,
     "rowBasedAdjustedAcc": 44.5,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3097,
    "diana": 0.1315,
    "nova": 0.2643,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 53.3,
     "adjustedAcc": 51.6,
     "adjustedAccUsedInWeights": 51.6,
     "rowBasedAdjustedAcc": 52.0,
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
    "taro": 0.3006,
    "diana": 0.128,
    "nova": 0.2904,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 617,
     "acc": 48.1,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 48.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 103,
     "acc": 64.1,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 56.5,
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
    "taro": 0.3124,
    "diana": 0.1242,
    "nova": 0.2662,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 53.7,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 52.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 48.4,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.7,
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
     "n": 66,
     "acc": 43.9,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 47.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 232,
   "globalBlend": 0.775
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3161,
    "diana": 0.1307,
    "nova": 0.285,
    "flow": 0.2682
   },
   "acc": {
    "taro": {
     "n": 351,
     "acc": 48.1,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 86,
     "acc": 55.8,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 52.4,
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
   "graded": 522,
   "globalBlend": 0.605
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1253,
    "nova": 0.2711,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 49.2,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 62.5,
     "adjustedAcc": 52.5,
     "adjustedAccUsedInWeights": 52.5,
     "rowBasedAdjustedAcc": 52.6,
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
     "n": 42,
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
   "graded": 285,
   "globalBlend": 0.737
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3194,
    "diana": 0.1365,
    "nova": 0.2676,
    "flow": 0.2765
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 56.3,
     "adjustedAcc": 53.1,
     "adjustedAccUsedInWeights": 53.1,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 90.4,
     "adjustedAcc": 58.1,
     "adjustedAccUsedInWeights": 58.1,
     "rowBasedAdjustedAcc": 62.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 87,
     "acc": 46.0,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 48.3,
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
   "graded": 454,
   "globalBlend": 0.638
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3082,
    "diana": 0.114,
    "nova": 0.2599,
    "flow": 0.318
   },
   "acc": {
    "taro": {
     "n": 237,
     "acc": 61.2,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 57.4,
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
     "n": 190,
     "acc": 52.1,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 51.3,
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
   "graded": 503,
   "globalBlend": 0.614
  },
  "기계": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.1202,
    "nova": 0.2592,
    "flow": 0.3153
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 53.2,
     "adjustedAcc": 51.6,
     "adjustedAccUsedInWeights": 51.6,
     "rowBasedAdjustedAcc": 51.7,
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
   "graded": 209,
   "globalBlend": 0.793
  },
  "로봇": {
   "weights": {
    "taro": 0.2875,
    "diana": 0.1279,
    "nova": 0.2625,
    "flow": 0.3221
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 41.1,
     "adjustedAcc": 45.6,
     "adjustedAccUsedInWeights": 45.6,
     "rowBasedAdjustedAcc": 45.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 85.4,
     "adjustedAcc": 57.1,
     "adjustedAccUsedInWeights": 57.1,
     "rowBasedAdjustedAcc": 59.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 112,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
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
   "graded": 345,
   "globalBlend": 0.699
  },
  "식음료": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1206,
    "nova": 0.2662,
    "flow": 0.309
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 51.4,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 51.0,
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
   "graded": 305,
   "globalBlend": 0.724
  },
  "여행레저": {
   "weights": {
    "taro": 0.31,
    "diana": 0.1247,
    "nova": 0.2838,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 47.9,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 19,
     "acc": 42.1,
     "adjustedAcc": 48.4,
     "adjustedAccUsedInWeights": 48.4,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 55,
     "acc": 60.0,
     "adjustedAcc": 54.9,
     "adjustedAccUsedInWeights": 54.9,
     "rowBasedAdjustedAcc": 53.1,
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
   "graded": 210,
   "globalBlend": 0.792
  }
 }
};
