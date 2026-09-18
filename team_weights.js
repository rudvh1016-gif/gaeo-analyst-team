// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-18 09:54",
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
   "taro": 0.3086,
   "diana": 0.1249,
   "nova": 0.2648,
   "flow": 0.3017
  },
  "acc": {
   "taro": {
    "n": 7648,
    "acc": 50.9,
    "adjustedAcc": 50.4,
    "adjustedAccUsedInWeights": 50.4,
    "rowBasedAdjustedAcc": 50.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.6,
    "absoluteN": 7911,
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
     "neutralPct": 21.1,
     "bullPct": 47.9,
     "bearPct": 31.1,
     "meanAbsDeviation": 18.68,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 5.76,
     "medianPushPoints": 4.94
    }
   },
   "diana": {
    "n": 1614,
    "acc": 54.2,
    "adjustedAcc": 50.8,
    "adjustedAccUsedInWeights": 50.8,
    "rowBasedAdjustedAcc": 53.9,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 5,
    "gatedToPrior": false,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": 52.7,
    "absoluteN": 1624,
    "uniqueDecisionDays": 5,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": 3.7,
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
     "meanPushPoints": 2.22,
     "medianPushPoints": 2.0
    }
   },
   "nova": {
    "n": 1672,
    "acc": 45.3,
    "adjustedAcc": 47.6,
    "adjustedAccUsedInWeights": 47.6,
    "rowBasedAdjustedAcc": 45.6,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.0,
    "absoluteN": 1741,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.7,
    "alwaysBearAcc": 53.3,
    "bestFixedDirectionAcc": 53.3,
    "liftVsFixedPp": -8.0,
    "acc95": [
     44.4,
     47.3
    ],
    "lift95": [
     -10.5,
     -7.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 14980,
     "neutralPct": 81.5,
     "bullPct": 9.6,
     "bearPct": 8.9,
     "meanAbsDeviation": 4.46,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.18,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 1276,
    "acc": 49.4,
    "adjustedAcc": 49.7,
    "adjustedAccUsedInWeights": 49.7,
    "rowBasedAdjustedAcc": 49.4,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 20,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.9,
    "absoluteN": 1312,
    "uniqueDecisionDays": 20,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.7,
    "alwaysBearAcc": 52.3,
    "bestFixedDirectionAcc": 52.3,
    "liftVsFixedPp": -2.9,
    "acc95": [
     41.6,
     55.9
    ],
    "lift95": [
     -12.2,
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
  "graded": 12210,
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
     "nova": 47.6,
     "flow": 49.7
    },
    "weights": {
     "taro": 0.3086,
     "diana": 0.1249,
     "nova": 0.2648,
     "flow": 0.3017
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
     "taro": 0.3026,
     "diana": 0.1212,
     "nova": 0.2757,
     "flow": 0.3006
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.9,
     "diana": 53.9,
     "nova": 45.6,
     "flow": 49.4
    },
    "weights": {
     "taro": 0.3133,
     "diana": 0.1373,
     "nova": 0.2495,
     "flow": 0.2999
    },
    "note": "2026-09-05 이전 실제 산식(채점 건수 단위, 가상표본 120건). 비교용 기록이다."
   },
   "maturityGate": {
    "enabled": false,
    "weights": {
     "taro": 0.3094,
     "diana": 0.1223,
     "nova": 0.2655,
     "flow": 0.3029
    },
    "note": "판단일이 기준 미만인 분석가를 통째로 역할 사전비중으로 되돌리는 거친 장치. 절벽을 20일째로 옮기기만 하므로 켜지 않는다. 판단일 단위 축소가 2026-09-14 DIANA 채점 시작의 하루치 급변을 대신 막는다."
   }
  },
  "team": {
   "basis": "absolute_return",
   "hit": 7368,
   "miss": 4121,
   "n": 11489,
   "uniqueDecisionDays": 20,
   "minDaysForConclusion": 20,
   "acc": 64.1,
   "holdBaselineAcc": 65.0,
   "holdBaselineN": 11489,
   "liftVsHoldPp": -0.9,
   "byCall": {
    "BUY": {
     "n": 668,
     "acc": 38.6,
     "band": "±1%",
     "excludedMid": 125,
     "excludedPct": 15.8
    },
    "HOLD": {
     "n": 8776,
     "acc": 68.2,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 2045,
     "acc": 54.8,
     "band": "±1%",
     "excludedMid": 349,
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
     "n": 1478,
     "graded": 1253,
     "hit": 501,
     "miss": 752,
     "excluded": 225,
     "acc": 40.0,
     "positivePct": 40.8,
     "crashPct": 23.9,
     "meanRet": -0.5,
     "uniqueDecisionDays": 41,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-11"
    },
    "currentVersion": {
     "n": 793,
     "graded": 668,
     "hit": 258,
     "miss": 410,
     "excluded": 125,
     "acc": 38.6,
     "positivePct": 39.5,
     "crashPct": 20.7,
     "meanRet": -0.5,
     "uniqueDecisionDays": 20,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-11"
    },
    "legacyMixed": {
     "n": 1951,
     "graded": 1667,
     "hit": 641,
     "miss": 1026,
     "excluded": 284,
     "acc": 38.5,
     "positivePct": 39.5,
     "crashPct": 26.1,
     "meanRet": -1.01,
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
     "acc": 43.3,
     "positivePct": 43.1,
     "crashPct": 23.5,
     "meanRet": 0.1,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 11963,
     "weightedDecisionN": 793,
     "uniqueDecisionDays": 20,
     "acc": 39.5,
     "positivePct": 39.9,
     "crashPct": 19.8,
     "meanRet": -0.53,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 917,
      "graded": 755,
      "hit": 318,
      "miss": 437,
      "excluded": 162,
      "acc": 42.1,
      "positivePct": 42.5,
      "crashPct": 18.0,
      "meanRet": -0.09,
      "uniqueDecisionDays": 41,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "caution": {
      "n": 561,
      "graded": 498,
      "hit": 183,
      "miss": 315,
      "excluded": 63,
      "acc": 36.7,
      "positivePct": 38.0,
      "crashPct": 33.5,
      "meanRet": -1.17,
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
      "graded": 498,
      "hit": 183,
      "miss": 315,
      "excluded": 63,
      "acc": 36.7,
      "positivePct": 38.0,
      "crashPct": 33.5,
      "meanRet": -1.17,
      "uniqueDecisionDays": 40,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-11"
     },
     "calm": {
      "n": 917,
      "graded": 755,
      "hit": 318,
      "miss": 437,
      "excluded": 162,
      "acc": 42.1,
      "positivePct": 42.5,
      "crashPct": 18.0,
      "meanRet": -0.09,
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
      "graded": 270,
      "hit": 112,
      "miss": 158,
      "excluded": 38,
      "acc": 41.5,
      "positivePct": 42.9,
      "crashPct": 28.2,
      "meanRet": -0.41,
      "uniqueDecisionDays": 20,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-11"
     },
     "calm": {
      "n": 485,
      "graded": 398,
      "hit": 146,
      "miss": 252,
      "excluded": 87,
      "acc": 36.7,
      "positivePct": 37.3,
      "crashPct": 15.9,
      "meanRet": -0.57,
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
      "flagPct": 11.6,
      "otherPct": 10.0,
      "gapPp": 1.6
     },
     "volatility": {
      "flagPct": 6.8,
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
    "taro": 0.2934,
    "diana": 0.1248,
    "nova": 0.293,
    "flow": 0.2888
   },
   "acc": {
    "taro": {
     "n": 783,
     "acc": 45.8,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 46.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 147,
     "acc": 55.8,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 53.2,
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
     "n": 155,
     "acc": 45.2,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 47.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1210,
   "globalBlend": 0.398
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3151,
    "diana": 0.1207,
    "nova": 0.2568,
    "flow": 0.3073
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 50.6,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "rowBasedAdjustedAcc": 50.5,
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
    "taro": 0.3043,
    "diana": 0.1265,
    "nova": 0.2727,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 46.1,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 47.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 67,
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
    "taro": 0.2935,
    "diana": 0.1087,
    "nova": 0.2865,
    "flow": 0.3113
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
     "n": 97,
     "acc": 11.3,
     "adjustedAcc": 42.3,
     "adjustedAccUsedInWeights": 42.3,
     "rowBasedAdjustedAcc": 32.7,
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
   "graded": 498,
   "globalBlend": 0.616
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3029,
    "diana": 0.1198,
    "nova": 0.2606,
    "flow": 0.3167
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 55.1,
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
   "graded": 430,
   "globalBlend": 0.65
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3194,
    "diana": 0.1289,
    "nova": 0.2571,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 400,
     "acc": 55.5,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
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
     "acc": 64.7,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 57.2,
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
    "taro": 0.3007,
    "diana": 0.1293,
    "nova": 0.2907,
    "flow": 0.2793
   },
   "acc": {
    "taro": {
     "n": 373,
     "acc": 45.3,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 46.5,
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
   "graded": 537,
   "globalBlend": 0.598
  },
  "보험": {
   "weights": {
    "taro": 0.2998,
    "diana": 0.1265,
    "nova": 0.2543,
    "flow": 0.3193
   },
   "acc": {
    "taro": {
     "n": 133,
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
     "n": 28,
     "acc": 78.6,
     "adjustedAcc": 55.7,
     "adjustedAccUsedInWeights": 55.7,
     "rowBasedAdjustedAcc": 55.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 41.7,
     "adjustedAcc": 45.8,
     "adjustedAccUsedInWeights": 45.8,
     "rowBasedAdjustedAcc": 46.1,
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
   "graded": 308,
   "globalBlend": 0.722
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3131,
    "diana": 0.1217,
    "nova": 0.2301,
    "flow": 0.335
   },
   "acc": {
    "taro": {
     "n": 964,
     "acc": 55.6,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 55.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 208,
     "acc": 56.2,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 54.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 474,
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
   "graded": 1785,
   "globalBlend": 0.309
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3264,
    "diana": 0.1275,
    "nova": 0.2564,
    "flow": 0.2897
   },
   "acc": {
    "taro": {
     "n": 491,
     "acc": 57.0,
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
     "n": 124,
     "acc": 58.1,
     "adjustedAcc": 51.6,
     "adjustedAccUsedInWeights": 51.6,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 131,
     "acc": 39.7,
     "adjustedAcc": 44.8,
     "adjustedAccUsedInWeights": 44.8,
     "rowBasedAdjustedAcc": 44.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 42.2,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 47.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 791,
   "globalBlend": 0.503
  },
  "조선": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.1231,
    "nova": 0.2643,
    "flow": 0.3079
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 43.9,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "rowBasedAdjustedAcc": 46.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 35.5,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "rowBasedAdjustedAcc": 45.1,
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
   "graded": 323,
   "globalBlend": 0.712
  },
  "철강·금속": {
   "weights": {
    "taro": 0.31,
    "diana": 0.1316,
    "nova": 0.2638,
    "flow": 0.2946
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 53.3,
     "adjustedAcc": 51.6,
     "adjustedAccUsedInWeights": 51.6,
     "rowBasedAdjustedAcc": 52.1,
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
   "graded": 241,
   "globalBlend": 0.768
  },
  "화학·소재": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1282,
    "nova": 0.2899,
    "flow": 0.2809
   },
   "acc": {
    "taro": {
     "n": 616,
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
     "n": 101,
     "acc": 64.4,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 56.6,
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
   "graded": 808,
   "globalBlend": 0.498
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3122,
    "diana": 0.1249,
    "nova": 0.2656,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 53.3,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 51.8,
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
   "graded": 231,
   "globalBlend": 0.776
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3175,
    "diana": 0.1313,
    "nova": 0.2844,
    "flow": 0.2668
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
     "n": 65,
     "acc": 49.2,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.7,
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
   "graded": 524,
   "globalBlend": 0.604
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1249,
    "nova": 0.2697,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 49.7,
     "adjustedAcc": 49.9,
     "adjustedAccUsedInWeights": 49.9,
     "rowBasedAdjustedAcc": 49.8,
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
     "n": 42,
     "acc": 52.4,
     "adjustedAcc": 51.1,
     "adjustedAccUsedInWeights": 51.1,
     "rowBasedAdjustedAcc": 50.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 18,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 284,
   "globalBlend": 0.738
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3178,
    "diana": 0.1356,
    "nova": 0.2691,
    "flow": 0.2775
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
     "n": 50,
     "acc": 90.0,
     "adjustedAcc": 58.0,
     "adjustedAccUsedInWeights": 58.0,
     "rowBasedAdjustedAcc": 61.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 87,
     "acc": 48.3,
     "adjustedAcc": 49.2,
     "adjustedAccUsedInWeights": 49.2,
     "rowBasedAdjustedAcc": 49.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 19,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 32.8,
     "adjustedAcc": 41.4,
     "adjustedAccUsedInWeights": 41.4,
     "rowBasedAdjustedAcc": 44.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 452,
   "globalBlend": 0.639
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3094,
    "diana": 0.1141,
    "nova": 0.2586,
    "flow": 0.318
   },
   "acc": {
    "taro": {
     "n": 238,
     "acc": 61.8,
     "adjustedAcc": 55.9,
     "adjustedAccUsedInWeights": 55.9,
     "rowBasedAdjustedAcc": 57.8,
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
     "n": 192,
     "acc": 51.6,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.0,
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
   "graded": 506,
   "globalBlend": 0.613
  },
  "기계": {
   "weights": {
    "taro": 0.3059,
    "diana": 0.1203,
    "nova": 0.2585,
    "flow": 0.3153
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 53.6,
     "adjustedAcc": 51.8,
     "adjustedAccUsedInWeights": 51.8,
     "rowBasedAdjustedAcc": 51.9,
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
   "graded": 210,
   "globalBlend": 0.792
  },
  "로봇": {
   "weights": {
    "taro": 0.2882,
    "diana": 0.1283,
    "nova": 0.2608,
    "flow": 0.3226
   },
   "acc": {
    "taro": {
     "n": 156,
     "acc": 41.0,
     "adjustedAcc": 45.5,
     "adjustedAccUsedInWeights": 45.5,
     "rowBasedAdjustedAcc": 44.9,
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
     "n": 109,
     "acc": 48.6,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 49.3,
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
   "graded": 341,
   "globalBlend": 0.701
  },
  "식음료": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.1209,
    "nova": 0.2656,
    "flow": 0.3088
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 51.7,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 20,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 43.5,
     "adjustedAcc": 48.7,
     "adjustedAccUsedInWeights": 48.7,
     "rowBasedAdjustedAcc": 48.2,
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
   "graded": 301,
   "globalBlend": 0.727
  },
  "여행레저": {
   "weights": {
    "taro": 0.3106,
    "diana": 0.1249,
    "nova": 0.2832,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 49.1,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.6,
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
   "graded": 207,
   "globalBlend": 0.794
  }
 }
};
