// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-16 09:17",
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
   "diana": 0.1244,
   "nova": 0.2656,
   "flow": 0.3027
  },
  "acc": {
   "taro": {
    "n": 6940,
    "acc": 51.0,
    "adjustedAcc": 50.5,
    "adjustedAccUsedInWeights": 50.5,
    "rowBasedAdjustedAcc": 51.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 18,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 7167,
    "uniqueDecisionDays": 18,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": 0.4,
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
     "records": 13180,
     "neutralPct": 20.7,
     "bullPct": 49.9,
     "bearPct": 29.4,
     "meanAbsDeviation": 18.84,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.79,
     "medianPushPoints": 5.22
    }
   },
   "diana": {
    "n": 965,
    "acc": 56.8,
    "adjustedAcc": 50.9,
    "adjustedAccUsedInWeights": 50.9,
    "rowBasedAdjustedAcc": 56.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 3,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 49.1,
    "absoluteN": 971,
    "uniqueDecisionDays": 3,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 50.6,
    "alwaysBearAcc": 49.4,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": 6.2,
    "acc95": null,
    "lift95": null,
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 20,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 13180,
     "neutralPct": 24.9,
     "bullPct": 61.0,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.7,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.2,
     "medianPushPoints": 1.99
    }
   },
   "nova": {
    "n": 1508,
    "acc": 45.6,
    "adjustedAcc": 47.9,
    "adjustedAccUsedInWeights": 47.9,
    "rowBasedAdjustedAcc": 45.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 18,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 1568,
    "uniqueDecisionDays": 18,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.6,
    "alwaysBearAcc": 53.4,
    "bestFixedDirectionAcc": 53.4,
    "liftVsFixedPp": -7.8,
    "acc95": [
     44.6,
     47.8
    ],
    "lift95": [
     -10.7,
     -6.9
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 13180,
     "neutralPct": 82.1,
     "bullPct": 9.2,
     "bearPct": 8.6,
     "meanAbsDeviation": 4.37,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.16,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1151,
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
    "absoluteAcc": 45.4,
    "absoluteN": 1186,
    "uniqueDecisionDays": 18,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 48.0,
    "alwaysBearAcc": 52.0,
    "bestFixedDirectionAcc": 52.0,
    "liftVsFixedPp": -2.0,
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
     "records": 13180,
     "neutralPct": 87.4,
     "bullPct": 4.2,
     "bearPct": 8.4,
     "meanAbsDeviation": 3.06,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.93,
     "medianPushPoints": 0.3
    }
   }
  },
  "graded": 10564,
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
     "taro": 50.5,
     "diana": 50.9,
     "nova": 47.9,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3073,
     "diana": 0.1244,
     "nova": 0.2656,
     "flow": 0.3027
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
     "nova": 0.2761,
     "flow": 0.3009
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 51.0,
     "diana": 56.0,
     "nova": 45.9,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3089,
     "diana": 0.1438,
     "nova": 0.2478,
     "flow": 0.2995
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
   "hit": 6546,
   "miss": 3798,
   "n": 10344,
   "uniqueDecisionDays": 18,
   "minDaysForConclusion": 20,
   "acc": 63.3,
   "holdBaselineAcc": 63.9,
   "holdBaselineN": 10344,
   "liftVsHoldPp": -0.6,
   "byCall": {
    "BUY": {
     "n": 587,
     "acc": 40.2,
     "band": "±1%",
     "excludedMid": 118,
     "excludedPct": 16.7
    },
    "HOLD": {
     "n": 7888,
     "acc": 67.2,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1869,
     "acc": 53.8,
     "band": "±1%",
     "excludedMid": 305,
     "excludedPct": 14.0
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
     "graded": 1172,
     "hit": 479,
     "miss": 693,
     "excluded": 218,
     "acc": 40.9,
     "positivePct": 41.6,
     "crashPct": 23.6,
     "meanRet": -0.46,
     "uniqueDecisionDays": 39,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-09"
    },
    "currentVersion": {
     "n": 705,
     "graded": 587,
     "hit": 236,
     "miss": 351,
     "excluded": 118,
     "acc": 40.2,
     "positivePct": 40.9,
     "crashPct": 19.7,
     "meanRet": -0.42,
     "uniqueDecisionDays": 18,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-09"
    },
    "legacyMixed": {
     "n": 1863,
     "graded": 1586,
     "hit": 619,
     "miss": 967,
     "excluded": 277,
     "acc": 39.0,
     "positivePct": 40.0,
     "crashPct": 26.0,
     "meanRet": -1.01,
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
     "meanRet": 0.13,
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
     "meanRet": -0.55,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 866,
      "graded": 708,
      "hit": 306,
      "miss": 402,
      "excluded": 158,
      "acc": 43.2,
      "positivePct": 43.5,
      "crashPct": 17.4,
      "meanRet": -0.04,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "caution": {
      "n": 524,
      "graded": 464,
      "hit": 173,
      "miss": 291,
      "excluded": 60,
      "acc": 37.3,
      "positivePct": 38.4,
      "crashPct": 33.8,
      "meanRet": -1.16,
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
      "graded": 464,
      "hit": 173,
      "miss": 291,
      "excluded": 60,
      "acc": 37.3,
      "positivePct": 38.4,
      "crashPct": 33.8,
      "meanRet": -1.16,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "calm": {
      "n": 866,
      "graded": 708,
      "hit": 306,
      "miss": 402,
      "excluded": 158,
      "acc": 43.2,
      "positivePct": 43.5,
      "crashPct": 17.4,
      "meanRet": -0.04,
      "uniqueDecisionDays": 39,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-09"
     },
     "crashGapPp": 16.4,
     "crashGapCi95": [
      10.4,
      26.1
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
      "graded": 236,
      "hit": 102,
      "miss": 134,
      "excluded": 35,
      "acc": 43.2,
      "positivePct": 44.3,
      "crashPct": 28.0,
      "meanRet": -0.28,
      "uniqueDecisionDays": 18,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-09"
     },
     "calm": {
      "n": 434,
      "graded": 351,
      "hit": 134,
      "miss": 217,
      "excluded": 83,
      "acc": 38.2,
      "positivePct": 38.7,
      "crashPct": 14.5,
      "meanRet": -0.51,
      "uniqueDecisionDays": 18,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-09"
     },
     "crashGapPp": 13.5,
     "crashGapCi95": [
      2.5,
      17.1
     ],
     "warnSharePct": 38.4
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.6,
      "otherPct": 10.3,
      "gapPp": 1.4
     },
     "volatility": {
      "flagPct": 7.0,
      "otherPct": 12.9,
      "gapPp": -5.9
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
    "taro": 0.2905,
    "diana": 0.1217,
    "nova": 0.2978,
    "flow": 0.29
   },
   "acc": {
    "taro": {
     "n": 702,
     "acc": 44.7,
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
     "n": 118,
     "acc": 60.2,
     "adjustedAcc": 54.8,
     "adjustedAccUsedInWeights": 54.8,
     "rowBasedAdjustedAcc": 55.0,
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
   "graded": 1042,
   "globalBlend": 0.434
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3115,
    "diana": 0.1204,
    "nova": 0.2608,
    "flow": 0.3072
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 50.9,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 27.0,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 44.6,
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
    "taro": 0.3108,
    "diana": 0.1279,
    "nova": 0.2621,
    "flow": 0.2992
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 47.4,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 48.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 53.7,
     "adjustedAcc": 50.5,
     "adjustedAccUsedInWeights": 50.5,
     "rowBasedAdjustedAcc": 50.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 53,
     "acc": 37.7,
     "adjustedAcc": 44.2,
     "adjustedAccUsedInWeights": 44.2,
     "rowBasedAdjustedAcc": 46.2,
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
   "graded": 542,
   "globalBlend": 0.596
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2915,
    "diana": 0.1122,
    "nova": 0.2853,
    "flow": 0.311
   },
   "acc": {
    "taro": {
     "n": 275,
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
   "graded": 429,
   "globalBlend": 0.651
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3035,
    "diana": 0.1223,
    "nova": 0.2626,
    "flow": 0.3117
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 55.1,
     "adjustedAcc": 52.4,
     "adjustedAccUsedInWeights": 52.4,
     "rowBasedAdjustedAcc": 53.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 67.6,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 54.1,
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
   "graded": 354,
   "globalBlend": 0.693
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3163,
    "diana": 0.1279,
    "nova": 0.2556,
    "flow": 0.3002
   },
   "acc": {
    "taro": {
     "n": 367,
     "acc": 56.9,
     "adjustedAcc": 53.3,
     "adjustedAccUsedInWeights": 53.3,
     "rowBasedAdjustedAcc": 55.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 71,
     "acc": 77.5,
     "adjustedAcc": 53.6,
     "adjustedAccUsedInWeights": 53.6,
     "rowBasedAdjustedAcc": 60.2,
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
   "graded": 526,
   "globalBlend": 0.603
  },
  "2차전지": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1268,
    "nova": 0.2906,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 341,
     "acc": 46.3,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 47.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 35,
     "acc": 65.7,
     "adjustedAcc": 52.0,
     "adjustedAccUsedInWeights": 52.0,
     "rowBasedAdjustedAcc": 53.5,
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
   "graded": 468,
   "globalBlend": 0.631
  },
  "보험": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.126,
    "nova": 0.2554,
    "flow": 0.3172
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
    "taro": 0.3089,
    "diana": 0.1214,
    "nova": 0.2326,
    "flow": 0.3371
   },
   "acc": {
    "taro": {
     "n": 867,
     "acc": 54.9,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 59.5,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 54.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 415,
     "acc": 34.2,
     "adjustedAcc": 42.5,
     "adjustedAccUsedInWeights": 42.5,
     "rowBasedAdjustedAcc": 37.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 124,
     "acc": 64.5,
     "adjustedAcc": 56.9,
     "adjustedAccUsedInWeights": 56.9,
     "rowBasedAdjustedAcc": 57.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1532,
   "globalBlend": 0.343
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3227,
    "diana": 0.1261,
    "nova": 0.2595,
    "flow": 0.2918
   },
   "acc": {
    "taro": {
     "n": 452,
     "acc": 57.3,
     "adjustedAcc": 53.5,
     "adjustedAccUsedInWeights": 53.5,
     "rowBasedAdjustedAcc": 55.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 76,
     "acc": 60.5,
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
     "n": 117,
     "acc": 41.0,
     "adjustedAcc": 45.7,
     "adjustedAccUsedInWeights": 45.7,
     "rowBasedAdjustedAcc": 45.6,
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
   "graded": 687,
   "globalBlend": 0.538
  },
  "조선": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.1241,
    "nova": 0.267,
    "flow": 0.3015
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 44.4,
     "adjustedAcc": 47.4,
     "adjustedAccUsedInWeights": 47.4,
     "rowBasedAdjustedAcc": 46.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 40,
     "acc": 30.0,
     "adjustedAcc": 47.4,
     "adjustedAccUsedInWeights": 47.4,
     "rowBasedAdjustedAcc": 45.0,
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
    "taro": 0.311,
    "diana": 0.1272,
    "nova": 0.2641,
    "flow": 0.2977
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 56.4,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 53.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 87.5,
     "adjustedAcc": 54.9,
     "adjustedAccUsedInWeights": 54.9,
     "rowBasedAdjustedAcc": 56.2,
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
    "taro": 0.3016,
    "diana": 0.1256,
    "nova": 0.2891,
    "flow": 0.2837
   },
   "acc": {
    "taro": {
     "n": 568,
     "acc": 48.6,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 48.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 60,
     "acc": 63.3,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 24,
     "acc": 58.3,
     "adjustedAcc": 53.8,
     "adjustedAccUsedInWeights": 53.8,
     "rowBasedAdjustedAcc": 51.4,
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
   "graded": 712,
   "globalBlend": 0.529
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3111,
    "diana": 0.1241,
    "nova": 0.2693,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 54.8,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 52.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 19,
     "acc": 52.6,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.4,
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
     "n": 59,
     "acc": 40.7,
     "adjustedAcc": 45.6,
     "adjustedAccUsedInWeights": 45.6,
     "rowBasedAdjustedAcc": 46.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 202,
   "globalBlend": 0.798
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3121,
    "diana": 0.129,
    "nova": 0.2814,
    "flow": 0.2775
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 47.7,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 58.7,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 52.4,
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
     "acc": 20.0,
     "adjustedAcc": 38.2,
     "adjustedAccUsedInWeights": 38.2,
     "rowBasedAdjustedAcc": 45.7,
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
    "taro": 0.3043,
    "diana": 0.1245,
    "nova": 0.2686,
    "flow": 0.3027
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 50.6,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.3,
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
     "n": 38,
     "acc": 52.6,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 252,
   "globalBlend": 0.76
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3202,
    "diana": 0.1319,
    "nova": 0.2648,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 237,
     "acc": 58.6,
     "adjustedAcc": 54.1,
     "adjustedAccUsedInWeights": 54.1,
     "rowBasedAdjustedAcc": 55.7,
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
     "n": 75,
     "acc": 44.0,
     "adjustedAcc": 47.2,
     "adjustedAccUsedInWeights": 47.2,
     "rowBasedAdjustedAcc": 47.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 33.9,
     "adjustedAcc": 42.4,
     "adjustedAccUsedInWeights": 42.4,
     "rowBasedAdjustedAcc": 44.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 397,
   "globalBlend": 0.668
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.116,
    "nova": 0.2606,
    "flow": 0.3171
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 61.2,
     "adjustedAcc": 55.3,
     "adjustedAccUsedInWeights": 55.3,
     "rowBasedAdjustedAcc": 57.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 43.3,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 48.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 3,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 184,
     "acc": 52.7,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 51.6,
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
   "graded": 451,
   "globalBlend": 0.639
  },
  "로봇": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.1253,
    "nova": 0.2598,
    "flow": 0.3266
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 38.6,
     "adjustedAcc": 44.6,
     "adjustedAccUsedInWeights": 44.6,
     "rowBasedAdjustedAcc": 43.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 85.7,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 56.8,
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
   "graded": 292,
   "globalBlend": 0.733
  },
  "식음료": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.1239,
    "nova": 0.2654,
    "flow": 0.3079
   },
   "acc": {
    "taro": {
     "n": 221,
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
   "graded": 257,
   "globalBlend": 0.757
  }
 }
};
