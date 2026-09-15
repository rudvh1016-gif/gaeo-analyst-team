// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-15 14:02",
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
   "taro": 0.3075,
   "diana": 0.1236,
   "nova": 0.2653,
   "flow": 0.3036
  },
  "acc": {
   "taro": {
    "n": 6611,
    "acc": 51.0,
    "adjustedAcc": 50.5,
    "adjustedAccUsedInWeights": 50.5,
    "rowBasedAdjustedAcc": 51.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 17,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.3,
    "absoluteN": 6785,
    "uniqueDecisionDays": 17,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.3,
    "alwaysBearAcc": 50.7,
    "bestFixedDirectionAcc": 50.7,
    "liftVsFixedPp": 0.2,
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
     "neutralPct": 20.7,
     "bullPct": 49.9,
     "bearPct": 29.3,
     "meanAbsDeviation": 18.83,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.79,
     "medianPushPoints": 5.23
    }
   },
   "diana": {
    "n": 655,
    "acc": 56.6,
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
    "alwaysBullAcc": 49.6,
    "alwaysBearAcc": 50.4,
    "bestFixedDirectionAcc": 50.4,
    "liftVsFixedPp": 6.3,
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
     "meanPushPoints": 2.19,
     "medianPushPoints": 1.98
    }
   },
   "nova": {
    "n": 1433,
    "acc": 45.3,
    "adjustedAcc": 47.8,
    "adjustedAccUsedInWeights": 47.8,
    "rowBasedAdjustedAcc": 45.7,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 17,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.0,
    "absoluteN": 1480,
    "uniqueDecisionDays": 17,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.1,
    "alwaysBearAcc": 53.9,
    "bestFixedDirectionAcc": 53.9,
    "liftVsFixedPp": -8.6,
    "acc95": [
     44.7,
     47.9
    ],
    "lift95": [
     -10.8,
     -7.0
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
    "n": 1099,
    "acc": 50.0,
    "adjustedAcc": 50.0,
    "adjustedAccUsedInWeights": 50.0,
    "rowBasedAdjustedAcc": 50.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 17,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.9,
    "absoluteN": 1127,
    "uniqueDecisionDays": 17,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 48.6,
    "alwaysBearAcc": 51.4,
    "bestFixedDirectionAcc": 51.4,
    "liftVsFixedPp": -1.4,
    "acc95": [
     41.9,
     57.2
    ],
    "lift95": [
     -13.8,
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
  "graded": 9798,
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
     "taro": 50.5,
     "diana": 50.6,
     "nova": 47.8,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3075,
     "diana": 0.1236,
     "nova": 0.2653,
     "flow": 0.3036
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
     "taro": 0.3021,
     "diana": 0.1208,
     "nova": 0.276,
     "flow": 0.301
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 51.0,
     "diana": 55.6,
     "nova": 45.7,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3098,
     "diana": 0.1424,
     "nova": 0.2465,
     "flow": 0.3013
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
   "hit": 6144,
   "miss": 3620,
   "n": 9764,
   "uniqueDecisionDays": 17,
   "minDaysForConclusion": 20,
   "acc": 62.9,
   "holdBaselineAcc": 63.9,
   "holdBaselineN": 9764,
   "liftVsHoldPp": -0.9,
   "byCall": {
    "BUY": {
     "n": 554,
     "acc": 40.8,
     "band": "±1%",
     "excludedMid": 111,
     "excludedPct": 16.7
    },
    "HOLD": {
     "n": 7460,
     "acc": 67.1,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1750,
     "acc": 52.2,
     "band": "±1%",
     "excludedMid": 293,
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
     "n": 1350,
     "graded": 1139,
     "hit": 469,
     "miss": 670,
     "excluded": 211,
     "acc": 41.2,
     "positivePct": 42.0,
     "crashPct": 23.2,
     "meanRet": -0.43,
     "uniqueDecisionDays": 38,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-08"
    },
    "currentVersion": {
     "n": 665,
     "graded": 554,
     "hit": 226,
     "miss": 328,
     "excluded": 111,
     "acc": 40.8,
     "positivePct": 41.7,
     "crashPct": 18.6,
     "meanRet": -0.36,
     "uniqueDecisionDays": 17,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-08"
    },
    "legacyMixed": {
     "n": 1823,
     "graded": 1553,
     "hit": 609,
     "miss": 944,
     "excluded": 270,
     "acc": 39.2,
     "positivePct": 40.3,
     "crashPct": 25.8,
     "meanRet": -1.0,
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
     "acc": 44.3,
     "positivePct": 44.0,
     "crashPct": 24.1,
     "meanRet": 0.19,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 10168,
     "weightedDecisionN": 665,
     "uniqueDecisionDays": 17,
     "acc": 40.9,
     "positivePct": 41.2,
     "crashPct": 20.4,
     "meanRet": -0.48,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 847,
      "graded": 692,
      "hit": 303,
      "miss": 389,
      "excluded": 155,
      "acc": 43.8,
      "positivePct": 44.4,
      "crashPct": 17.1,
      "meanRet": 0.02,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "caution": {
      "n": 503,
      "graded": 447,
      "hit": 166,
      "miss": 281,
      "excluded": 56,
      "acc": 37.1,
      "positivePct": 38.0,
      "crashPct": 33.4,
      "meanRet": -1.19,
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
      "graded": 447,
      "hit": 166,
      "miss": 281,
      "excluded": 56,
      "acc": 37.1,
      "positivePct": 38.0,
      "crashPct": 33.4,
      "meanRet": -1.19,
      "uniqueDecisionDays": 37,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "calm": {
      "n": 847,
      "graded": 692,
      "hit": 303,
      "miss": 389,
      "excluded": 155,
      "acc": 43.8,
      "positivePct": 44.4,
      "crashPct": 17.1,
      "meanRet": 0.02,
      "uniqueDecisionDays": 38,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-08"
     },
     "crashGapPp": 16.3,
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
      "graded": 219,
      "hit": 95,
      "miss": 124,
      "excluded": 31,
      "acc": 43.4,
      "positivePct": 44.0,
      "crashPct": 26.8,
      "meanRet": -0.28,
      "uniqueDecisionDays": 17,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-08"
     },
     "calm": {
      "n": 415,
      "graded": 335,
      "hit": 131,
      "miss": 204,
      "excluded": 80,
      "acc": 39.1,
      "positivePct": 40.2,
      "crashPct": 13.7,
      "meanRet": -0.41,
      "uniqueDecisionDays": 17,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-08"
     },
     "crashGapPp": 13.1,
     "crashGapCi95": [
      1.3,
      16.9
     ],
     "warnSharePct": 37.6
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.7,
      "otherPct": 9.9,
      "gapPp": 1.8
     },
     "volatility": {
      "flagPct": 7.1,
      "otherPct": 12.5,
      "gapPp": -5.4
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
    "taro": 0.2922,
    "diana": 0.1212,
    "nova": 0.2934,
    "flow": 0.2932
   },
   "acc": {
    "taro": {
     "n": 663,
     "acc": 45.1,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 45.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 48.4,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.5,
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
     "n": 123,
     "acc": 46.3,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 965,
   "globalBlend": 0.453
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3127,
    "diana": 0.1213,
    "nova": 0.2603,
    "flow": 0.3056
   },
   "acc": {
    "taro": {
     "n": 330,
     "acc": 50.9,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 23.1,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 45.2,
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
   "graded": 519,
   "globalBlend": 0.607
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3089,
    "diana": 0.1264,
    "nova": 0.2646,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 47.4,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 55.2,
     "adjustedAcc": 50.5,
     "adjustedAccUsedInWeights": 50.5,
     "rowBasedAdjustedAcc": 51.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 52,
     "acc": 40.4,
     "adjustedAcc": 45.6,
     "adjustedAccUsedInWeights": 45.6,
     "rowBasedAdjustedAcc": 47.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 85,
     "acc": 43.5,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 47.3,
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
  "자동차·부품": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.1142,
    "nova": 0.2831,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.9,
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
     "n": 52,
     "acc": 65.4,
     "adjustedAcc": 57.1,
     "adjustedAccUsedInWeights": 57.1,
     "rowBasedAdjustedAcc": 54.7,
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
    "taro": 0.3041,
    "diana": 0.1212,
    "nova": 0.2627,
    "flow": 0.3119
   },
   "acc": {
    "taro": {
     "n": 258,
     "acc": 55.4,
     "adjustedAcc": 52.5,
     "adjustedAccUsedInWeights": 52.5,
     "rowBasedAdjustedAcc": 53.7,
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
    "taro": 0.3136,
    "diana": 0.1253,
    "nova": 0.2561,
    "flow": 0.305
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 55.8,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 75.0,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 57.1,
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
   "graded": 476,
   "globalBlend": 0.627
  },
  "2차전지": {
   "weights": {
    "taro": 0.3045,
    "diana": 0.1264,
    "nova": 0.2895,
    "flow": 0.2796
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 46.6,
     "adjustedAcc": 48.4,
     "adjustedAccUsedInWeights": 48.4,
     "rowBasedAdjustedAcc": 47.5,
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
     "n": 45,
     "acc": 60.0,
     "adjustedAcc": 54.4,
     "adjustedAccUsedInWeights": 54.4,
     "rowBasedAdjustedAcc": 52.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 16,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 24.4,
     "adjustedAcc": 40.4,
     "adjustedAccUsedInWeights": 40.4,
     "rowBasedAdjustedAcc": 43.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 431,
   "globalBlend": 0.65
  },
  "보험": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1238,
    "nova": 0.2582,
    "flow": 0.3162
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 51.7,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 50.8,
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
     "n": 97,
     "acc": 43.3,
     "adjustedAcc": 46.9,
     "adjustedAccUsedInWeights": 46.9,
     "rowBasedAdjustedAcc": 47.0,
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
   "graded": 265,
   "globalBlend": 0.751
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.1207,
    "nova": 0.2344,
    "flow": 0.3376
   },
   "acc": {
    "taro": {
     "n": 827,
     "acc": 54.2,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 53.6,
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
     "n": 389,
     "acc": 33.9,
     "adjustedAcc": 42.6,
     "adjustedAccUsedInWeights": 42.6,
     "rowBasedAdjustedAcc": 37.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 120,
     "acc": 65.0,
     "adjustedAcc": 56.9,
     "adjustedAccUsedInWeights": 56.9,
     "rowBasedAdjustedAcc": 57.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1422,
   "globalBlend": 0.36
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3229,
    "diana": 0.1254,
    "nova": 0.2588,
    "flow": 0.2928
   },
   "acc": {
    "taro": {
     "n": 427,
     "acc": 57.8,
     "adjustedAcc": 53.6,
     "adjustedAccUsedInWeights": 53.6,
     "rowBasedAdjustedAcc": 56.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 64.0,
     "adjustedAcc": 51.3,
     "adjustedAccUsedInWeights": 51.3,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 112,
     "acc": 40.2,
     "adjustedAcc": 45.5,
     "adjustedAccUsedInWeights": 45.5,
     "rowBasedAdjustedAcc": 45.3,
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
   "graded": 629,
   "globalBlend": 0.56
  },
  "조선": {
   "weights": {
    "taro": 0.3056,
    "diana": 0.1242,
    "nova": 0.2665,
    "flow": 0.3037
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 42.5,
     "adjustedAcc": 46.6,
     "adjustedAccUsedInWeights": 46.6,
     "rowBasedAdjustedAcc": 45.3,
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
   "graded": 256,
   "globalBlend": 0.758
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.1256,
    "nova": 0.2845,
    "flow": 0.2844
   },
   "acc": {
    "taro": {
     "n": 542,
     "acc": 48.7,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 63.6,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 53.7,
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
   "graded": 662,
   "globalBlend": 0.547
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3147,
    "diana": 0.1282,
    "nova": 0.2827,
    "flow": 0.2743
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
     "n": 31,
     "acc": 58.1,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 51.7,
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
   "graded": 416,
   "globalBlend": 0.658
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3048,
    "diana": 0.1233,
    "nova": 0.2678,
    "flow": 0.3041
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
    "taro": 0.3216,
    "diana": 0.129,
    "nova": 0.2668,
    "flow": 0.2826
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
    "taro": 0.3083,
    "diana": 0.1164,
    "nova": 0.2582,
    "flow": 0.3172
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
     "acc": 45.5,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.3,
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
    "taro": 0.2904,
    "diana": 0.1234,
    "nova": 0.2584,
    "flow": 0.3278
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 38.8,
     "adjustedAcc": 44.9,
     "adjustedAccUsedInWeights": 44.9,
     "rowBasedAdjustedAcc": 44.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 18,
     "acc": 83.3,
     "adjustedAcc": 53.0,
     "adjustedAccUsedInWeights": 53.0,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 2,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 88,
     "acc": 43.2,
     "adjustedAcc": 46.9,
     "adjustedAccUsedInWeights": 46.9,
     "rowBasedAdjustedAcc": 47.1,
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
    "taro": 0.3037,
    "diana": 0.1228,
    "nova": 0.2652,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 51.9,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 51.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 17,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 14,
     "acc": 71.4,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "rowBasedAdjustedAcc": 52.2,
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
   "graded": 241,
   "globalBlend": 0.768
  }
 }
};
