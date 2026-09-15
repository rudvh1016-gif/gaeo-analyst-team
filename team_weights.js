// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-15 12:31",
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
   "taro": 0.3071,
   "diana": 0.1235,
   "nova": 0.2656,
   "flow": 0.3037
  },
  "acc": {
   "taro": {
    "n": 6605,
    "acc": 50.9,
    "adjustedAcc": 50.4,
    "adjustedAccUsedInWeights": 50.4,
    "rowBasedAdjustedAcc": 50.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 17,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 6773,
    "uniqueDecisionDays": 17,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.3,
    "alwaysBearAcc": 50.7,
    "bestFixedDirectionAcc": 50.7,
    "liftVsFixedPp": 0.3,
    "acc95": [
     47.5,
     53.3
    ],
    "lift95": [
     -3.3,
     2.5
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 13180,
     "neutralPct": 20.9,
     "bullPct": 49.9,
     "bearPct": 29.2,
     "meanAbsDeviation": 18.81,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.78,
     "medianPushPoints": 5.22
    }
   },
   "diana": {
    "n": 651,
    "acc": 56.7,
    "adjustedAcc": 50.6,
    "adjustedAccUsedInWeights": 50.6,
    "rowBasedAdjustedAcc": 55.6,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 2,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 46.7,
    "absoluteN": 657,
    "uniqueDecisionDays": 2,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 50.2,
    "alwaysBearAcc": 49.8,
    "bestFixedDirectionAcc": 50.2,
    "liftVsFixedPp": 6.5,
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
     "meanAbsDeviation": 17.69,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.18,
     "medianPushPoints": 1.98
    }
   },
   "nova": {
    "n": 1432,
    "acc": 45.4,
    "adjustedAcc": 47.9,
    "adjustedAccUsedInWeights": 47.9,
    "rowBasedAdjustedAcc": 45.7,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 17,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.3,
    "absoluteN": 1475,
    "uniqueDecisionDays": 17,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.3,
    "alwaysBearAcc": 53.7,
    "bestFixedDirectionAcc": 53.7,
    "liftVsFixedPp": -8.3,
    "acc95": [
     44.7,
     47.9
    ],
    "lift95": [
     -10.7,
     -7.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 13180,
     "neutralPct": 82.1,
     "bullPct": 9.3,
     "bearPct": 8.6,
     "meanAbsDeviation": 4.37,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.16,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1096,
    "acc": 50.1,
    "adjustedAcc": 50.0,
    "adjustedAccUsedInWeights": 50.0,
    "rowBasedAdjustedAcc": 50.1,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 17,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.8,
    "absoluteN": 1127,
    "uniqueDecisionDays": 17,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 48.7,
    "alwaysBearAcc": 51.3,
    "bestFixedDirectionAcc": 51.3,
    "liftVsFixedPp": -1.2,
    "acc95": [
     41.9,
     57.2
    ],
    "lift95": [
     -13.9,
     3.8
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
  "graded": 9784,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 17,
    "diana": 2,
    "nova": 17,
    "flow": 17
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.4,
     "diana": 50.6,
     "nova": 47.9,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3071,
     "diana": 0.1235,
     "nova": 0.2656,
     "flow": 0.3037
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.1,
     "nova": 49.4,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.302,
     "diana": 0.1208,
     "nova": 0.2761,
     "flow": 0.3011
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.9,
     "diana": 55.6,
     "nova": 45.7,
     "flow": 50.1
    },
    "weights": {
     "taro": 0.309,
     "diana": 0.1425,
     "nova": 0.2471,
     "flow": 0.3015
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
   "hit": 6129,
   "miss": 3627,
   "n": 9756,
   "uniqueDecisionDays": 17,
   "minDaysForConclusion": 20,
   "acc": 62.8,
   "holdBaselineAcc": 63.9,
   "holdBaselineN": 9756,
   "liftVsHoldPp": -1.1,
   "byCall": {
    "BUY": {
     "n": 551,
     "acc": 40.8,
     "band": "±1%",
     "excludedMid": 114,
     "excludedPct": 17.1
    },
    "HOLD": {
     "n": 7460,
     "acc": 67.1,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1745,
     "acc": 51.5,
     "band": "±1%",
     "excludedMid": 298,
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
     "n": 1350,
     "graded": 1136,
     "hit": 468,
     "miss": 668,
     "excluded": 214,
     "acc": 41.2,
     "positivePct": 42.1,
     "crashPct": 23.0,
     "meanRet": -0.42,
     "uniqueDecisionDays": 38,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-08"
    },
    "currentVersion": {
     "n": 665,
     "graded": 551,
     "hit": 225,
     "miss": 326,
     "excluded": 114,
     "acc": 40.8,
     "positivePct": 42.0,
     "crashPct": 18.3,
     "meanRet": -0.33,
     "uniqueDecisionDays": 17,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-08"
    },
    "legacyMixed": {
     "n": 1823,
     "graded": 1550,
     "hit": 608,
     "miss": 942,
     "excluded": 273,
     "acc": 39.2,
     "positivePct": 40.4,
     "crashPct": 25.7,
     "meanRet": -0.99,
     "uniqueDecisionDays": 50,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-08"
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
     "n": 20665,
     "weightedDecisionN": 1350,
     "uniqueDecisionDays": 38,
     "acc": 44.5,
     "positivePct": 44.2,
     "crashPct": 24.1,
     "meanRet": 0.2,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 10168,
     "weightedDecisionN": 665,
     "uniqueDecisionDays": 17,
     "acc": 41.2,
     "positivePct": 41.5,
     "crashPct": 20.2,
     "meanRet": -0.44,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 847,
      "graded": 691,
      "hit": 303,
      "miss": 388,
      "excluded": 156,
      "acc": 43.8,
      "positivePct": 44.4,
      "crashPct": 17.0,
      "meanRet": 0.03,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "caution": {
      "n": 503,
      "graded": 445,
      "hit": 165,
      "miss": 280,
      "excluded": 58,
      "acc": 37.1,
      "positivePct": 38.4,
      "crashPct": 33.2,
      "meanRet": -1.18,
      "uniqueDecisionDays": 37,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 503,
     "calmN": 847,
     "unknownN": 0,
     "warn": {
      "n": 503,
      "graded": 445,
      "hit": 165,
      "miss": 280,
      "excluded": 58,
      "acc": 37.1,
      "positivePct": 38.4,
      "crashPct": 33.2,
      "meanRet": -1.18,
      "uniqueDecisionDays": 37,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "calm": {
      "n": 847,
      "graded": 691,
      "hit": 303,
      "miss": 388,
      "excluded": 156,
      "acc": 43.8,
      "positivePct": 44.4,
      "crashPct": 17.0,
      "meanRet": 0.03,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "crashGapPp": 16.2,
     "crashGapCi95": [
      10.4,
      25.3
     ],
     "warnSharePct": 37.3
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 250,
     "calmN": 415,
     "unknownN": 0,
     "warn": {
      "n": 250,
      "graded": 217,
      "hit": 94,
      "miss": 123,
      "excluded": 33,
      "acc": 43.3,
      "positivePct": 44.8,
      "crashPct": 26.4,
      "meanRet": -0.25,
      "uniqueDecisionDays": 17,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-08"
     },
     "calm": {
      "n": 415,
      "graded": 334,
      "hit": 131,
      "miss": 203,
      "excluded": 81,
      "acc": 39.2,
      "positivePct": 40.2,
      "crashPct": 13.5,
      "meanRet": -0.39,
      "uniqueDecisionDays": 17,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-08"
     },
     "crashGapPp": 12.9,
     "crashGapCi95": [
      1.2,
      16.8
     ],
     "warnSharePct": 37.6
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.5,
      "otherPct": 9.9,
      "gapPp": 1.6
     },
     "volatility": {
      "flagPct": 7.1,
      "otherPct": 12.4,
      "gapPp": -5.3
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1285,
      "recorded": 65
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
    "taro": 0.2916,
    "diana": 0.1212,
    "nova": 0.2933,
    "flow": 0.2939
   },
   "acc": {
    "taro": {
     "n": 659,
     "acc": 44.9,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 49.2,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 115,
     "acc": 59.1,
     "adjustedAcc": 54.2,
     "adjustedAccUsedInWeights": 54.2,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 46.7,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 961,
   "globalBlend": 0.454
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3121,
    "diana": 0.1211,
    "nova": 0.2608,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 331,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "adjustedAccUsedInWeights": 50.2,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 20.8,
     "adjustedAcc": 47.3,
     "adjustedAccUsedInWeights": 47.3,
     "rowBasedAdjustedAcc": 45.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 55,
     "acc": 38.2,
     "adjustedAcc": 44.7,
     "adjustedAccUsedInWeights": 44.7,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 108,
     "acc": 48.1,
     "adjustedAcc": 49.1,
     "adjustedAccUsedInWeights": 49.1,
     "rowBasedAdjustedAcc": 49.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 518,
   "globalBlend": 0.607
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.31,
    "diana": 0.127,
    "nova": 0.2629,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 47.6,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 56.7,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 51.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 52,
     "acc": 38.5,
     "adjustedAcc": 44.7,
     "adjustedAccUsedInWeights": 44.7,
     "rowBasedAdjustedAcc": 46.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 42.9,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 519,
   "globalBlend": 0.607
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2916,
    "diana": 0.114,
    "nova": 0.2827,
    "flow": 0.3117
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "adjustedAccUsedInWeights": 49.8,
     "rowBasedAdjustedAcc": 49.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 40,
     "acc": 12.5,
     "adjustedAcc": 46.6,
     "adjustedAccUsedInWeights": 46.6,
     "rowBasedAdjustedAcc": 40.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
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
     "n": 51,
     "acc": 66.7,
     "adjustedAcc": 57.7,
     "adjustedAccUsedInWeights": 57.7,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 386,
   "globalBlend": 0.675
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.1216,
    "nova": 0.2628,
    "flow": 0.3119
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 55.3,
     "adjustedAcc": 52.4,
     "adjustedAccUsedInWeights": 52.4,
     "rowBasedAdjustedAcc": 53.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 73.1,
     "adjustedAcc": 52.1,
     "adjustedAccUsedInWeights": 52.1,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
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
   "graded": 326,
   "globalBlend": 0.71
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1251,
    "nova": 0.2563,
    "flow": 0.305
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 55.9,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 54.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 74.5,
     "adjustedAcc": 52.2,
     "adjustedAccUsedInWeights": 52.2,
     "rowBasedAdjustedAcc": 56.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
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
     "n": 75,
     "acc": 52.0,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 50.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 474,
   "globalBlend": 0.628
  },
  "2차전지": {
   "weights": {
    "taro": 0.304,
    "diana": 0.1263,
    "nova": 0.2916,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 46.4,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 47.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 25,
     "acc": 68.0,
     "adjustedAcc": 51.6,
     "adjustedAccUsedInWeights": 51.6,
     "rowBasedAdjustedAcc": 53.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 44,
     "acc": 61.4,
     "adjustedAcc": 55.1,
     "adjustedAccUsedInWeights": 55.1,
     "rowBasedAdjustedAcc": 53.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 22.5,
     "adjustedAcc": 39.7,
     "adjustedAccUsedInWeights": 39.7,
     "rowBasedAdjustedAcc": 43.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 428,
   "globalBlend": 0.651
  },
  "보험": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1237,
    "nova": 0.2589,
    "flow": 0.3163
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 51.3,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 11,
     "acc": 90.9,
     "adjustedAcc": 53.7,
     "adjustedAccUsedInWeights": 53.7,
     "rowBasedAdjustedAcc": 53.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 96,
     "acc": 43.8,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "rowBasedAdjustedAcc": 47.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 67.6,
     "adjustedAcc": 58.1,
     "adjustedAccUsedInWeights": 58.1,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 263,
   "globalBlend": 0.753
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3071,
    "diana": 0.1206,
    "nova": 0.2339,
    "flow": 0.3384
   },
   "acc": {
    "taro": {
     "n": 830,
     "acc": 54.2,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 53.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 86,
     "acc": 59.3,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 53.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 391,
     "acc": 33.8,
     "adjustedAcc": 42.5,
     "adjustedAccUsedInWeights": 42.5,
     "rowBasedAdjustedAcc": 37.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 65.3,
     "adjustedAcc": 57.0,
     "adjustedAccUsedInWeights": 57.0,
     "rowBasedAdjustedAcc": 57.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1428,
   "globalBlend": 0.359
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3222,
    "diana": 0.1256,
    "nova": 0.259,
    "flow": 0.2932
   },
   "acc": {
    "taro": {
     "n": 426,
     "acc": 57.5,
     "adjustedAcc": 53.5,
     "adjustedAccUsedInWeights": 53.5,
     "rowBasedAdjustedAcc": 55.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 64.6,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 54.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 110,
     "acc": 40.0,
     "adjustedAcc": 45.4,
     "adjustedAccUsedInWeights": 45.4,
     "rowBasedAdjustedAcc": 45.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 42.5,
     "adjustedAcc": 46.8,
     "adjustedAccUsedInWeights": 46.8,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 624,
   "globalBlend": 0.562
  },
  "조선": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.1241,
    "nova": 0.2667,
    "flow": 0.3037
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 42.7,
     "adjustedAcc": 46.7,
     "adjustedAccUsedInWeights": 46.7,
     "rowBasedAdjustedAcc": 45.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 30.8,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
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
     "n": 28,
     "acc": 42.9,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 255,
   "globalBlend": 0.758
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.1252,
    "nova": 0.2847,
    "flow": 0.2845
   },
   "acc": {
    "taro": {
     "n": 541,
     "acc": 48.8,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 49.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 61.4,
     "adjustedAcc": 51.0,
     "adjustedAccUsedInWeights": 51.0,
     "rowBasedAdjustedAcc": 53.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 20,
     "acc": 55.0,
     "adjustedAcc": 52.2,
     "adjustedAccUsedInWeights": 52.2,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 37.5,
     "adjustedAcc": 44.4,
     "adjustedAccUsedInWeights": 44.4,
     "rowBasedAdjustedAcc": 46.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 661,
   "globalBlend": 0.548
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3143,
    "diana": 0.1284,
    "nova": 0.2828,
    "flow": 0.2744
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 48.5,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 60.0,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 52.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 61,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 11.8,
     "adjustedAcc": 35.7,
     "adjustedAccUsedInWeights": 35.7,
     "rowBasedAdjustedAcc": 45.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 415,
   "globalBlend": 0.658
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3044,
    "diana": 0.1233,
    "nova": 0.2681,
    "flow": 0.3042
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 13,
     "acc": 69.2,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 51.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
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
   "graded": 235,
   "globalBlend": 0.773
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3214,
    "diana": 0.1289,
    "nova": 0.2671,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 59.0,
     "adjustedAcc": 54.1,
     "adjustedAccUsedInWeights": 54.1,
     "rowBasedAdjustedAcc": 55.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 19,
     "acc": 94.7,
     "adjustedAcc": 54.1,
     "adjustedAccUsedInWeights": 54.1,
     "rowBasedAdjustedAcc": 56.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 74,
     "acc": 44.6,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 30.2,
     "adjustedAcc": 40.9,
     "adjustedAccUsedInWeights": 40.9,
     "rowBasedAdjustedAcc": 43.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 368,
   "globalBlend": 0.685
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3082,
    "diana": 0.1159,
    "nova": 0.2585,
    "flow": 0.3174
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 62.7,
     "adjustedAcc": 55.9,
     "adjustedAccUsedInWeights": 55.9,
     "rowBasedAdjustedAcc": 58.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 40.9,
     "adjustedAcc": 49.2,
     "adjustedAccUsedInWeights": 49.2,
     "rowBasedAdjustedAcc": 48.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 174,
     "acc": 50.6,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
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
   "graded": 418,
   "globalBlend": 0.657
  },
  "로봇": {
   "weights": {
    "taro": 0.2887,
    "diana": 0.1231,
    "nova": 0.2608,
    "flow": 0.3274
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 37.3,
     "adjustedAcc": 44.2,
     "adjustedAccUsedInWeights": 44.2,
     "rowBasedAdjustedAcc": 43.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 82.4,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 54.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 89,
     "acc": 46.1,
     "adjustedAcc": 48.2,
     "adjustedAccUsedInWeights": 48.2,
     "rowBasedAdjustedAcc": 48.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 30,
     "acc": 76.7,
     "adjustedAcc": 61.9,
     "adjustedAccUsedInWeights": 61.9,
     "rowBasedAdjustedAcc": 55.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 270,
   "globalBlend": 0.748
  },
  "식음료": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.1226,
    "nova": 0.2655,
    "flow": 0.3085
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 51.6,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 13,
     "acc": 69.2,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 51.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
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
   "graded": 239,
   "globalBlend": 0.77
  }
 }
};
