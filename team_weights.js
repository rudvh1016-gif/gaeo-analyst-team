// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-08 15:06",
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
   "taro": 0.3032,
   "diana": 0.1195,
   "nova": 0.2642,
   "flow": 0.3131
  },
  "acc": {
   "taro": {
    "n": 4671,
    "acc": 51.3,
    "adjustedAcc": 50.5,
    "adjustedAccUsedInWeights": 50.5,
    "rowBasedAdjustedAcc": 51.3,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 12,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.6,
    "absoluteN": 4803,
    "uniqueDecisionDays": 12,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.6,
    "alwaysBearAcc": 50.4,
    "bestFixedDirectionAcc": 50.4,
    "liftVsFixedPp": 0.9,
    "acc95": [
     50.1,
     54.5
    ],
    "lift95": [
     -0.0,
     3.5
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 10180,
     "neutralPct": 19.8,
     "bullPct": 52.9,
     "bearPct": 27.3,
     "meanAbsDeviation": 19.16,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.81,
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
     "records": 10180,
     "neutralPct": 25.0,
     "bullPct": 60.9,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.57,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.1,
     "medianPushPoints": 1.91
    }
   },
   "nova": {
    "n": 1001,
    "acc": 45.3,
    "adjustedAcc": 48.2,
    "adjustedAccUsedInWeights": 48.2,
    "rowBasedAdjustedAcc": 45.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 12,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.1,
    "absoluteN": 1051,
    "uniqueDecisionDays": 12,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.0,
    "alwaysBearAcc": 53.0,
    "bestFixedDirectionAcc": 53.0,
    "liftVsFixedPp": -7.8,
    "acc95": [
     43.8,
     46.8
    ],
    "lift95": [
     -9.8,
     -6.8
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 10180,
     "neutralPct": 82.3,
     "bullPct": 8.9,
     "bearPct": 8.8,
     "meanAbsDeviation": 4.32,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.14,
     "medianPushPoints": 1.06
    }
   },
   "flow": {
    "n": 808,
    "acc": 54.2,
    "adjustedAcc": 51.6,
    "adjustedAccUsedInWeights": 51.6,
    "rowBasedAdjustedAcc": 53.7,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 12,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 829,
    "uniqueDecisionDays": 12,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.2,
    "alwaysBearAcc": 53.8,
    "bestFixedDirectionAcc": 53.8,
    "liftVsFixedPp": 0.4,
    "acc95": [
     52.7,
     59.0
    ],
    "lift95": [
     -2.7,
     5.2
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 10180,
     "neutralPct": 87.3,
     "bullPct": 3.8,
     "bearPct": 8.9,
     "meanAbsDeviation": 3.1,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.97,
     "medianPushPoints": 0.31
    }
   }
  },
  "graded": 6480,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 12,
    "diana": 0,
    "nova": 12,
    "flow": 12
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.5,
     "diana": 50.0,
     "nova": 48.2,
     "flow": 51.6
    },
    "weights": {
     "taro": 0.3032,
     "diana": 0.1195,
     "nova": 0.2642,
     "flow": 0.3131
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.0,
     "nova": 49.6,
     "flow": 50.4
    },
    "weights": {
     "taro": 0.3008,
     "diana": 0.1199,
     "nova": 0.2761,
     "flow": 0.3032
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 51.3,
     "diana": null,
     "nova": 45.8,
     "flow": 53.7
    },
    "weights": {
     "taro": 0.3078,
     "diana": 0.1184,
     "nova": 0.2433,
     "flow": 0.3304
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
   "hit": 4312,
   "miss": 2593,
   "n": 6905,
   "uniqueDecisionDays": 12,
   "minDaysForConclusion": 20,
   "acc": 62.4,
   "holdBaselineAcc": 62.2,
   "holdBaselineN": 6905,
   "liftVsHoldPp": 0.3,
   "byCall": {
    "BUY": {
     "n": 397,
     "acc": 41.3,
     "band": "±1%",
     "excludedMid": 82,
     "excludedPct": 17.1
    },
    "HOLD": {
     "n": 5499,
     "acc": 64.7,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1009,
     "acc": 58.3,
     "band": "±1%",
     "excludedMid": 186,
     "excludedPct": 15.6
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
     "n": 1164,
     "graded": 982,
     "hit": 407,
     "miss": 575,
     "excluded": 182,
     "acc": 41.4,
     "positivePct": 42.4,
     "crashPct": 24.4,
     "meanRet": -0.49,
     "uniqueDecisionDays": 33,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-01"
    },
    "currentVersion": {
     "n": 479,
     "graded": 397,
     "hit": 164,
     "miss": 233,
     "excluded": 82,
     "acc": 41.3,
     "positivePct": 42.6,
     "crashPct": 19.8,
     "meanRet": -0.47,
     "uniqueDecisionDays": 12,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-01"
    },
    "legacyMixed": {
     "n": 1637,
     "graded": 1396,
     "hit": 547,
     "miss": 849,
     "excluded": 241,
     "acc": 39.2,
     "positivePct": 40.4,
     "crashPct": 26.9,
     "meanRet": -1.1,
     "uniqueDecisionDays": 45,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-01"
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
     "n": 17670,
     "weightedDecisionN": 1164,
     "uniqueDecisionDays": 33,
     "acc": 43.5,
     "positivePct": 43.3,
     "crashPct": 26.0,
     "meanRet": 0.06,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 7173,
     "weightedDecisionN": 479,
     "uniqueDecisionDays": 12,
     "acc": 37.5,
     "positivePct": 38.3,
     "crashPct": 23.5,
     "meanRet": -1.04,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 711,
      "graded": 577,
      "hit": 258,
      "miss": 319,
      "excluded": 134,
      "acc": 44.7,
      "positivePct": 45.3,
      "crashPct": 18.3,
      "meanRet": 0.04,
      "uniqueDecisionDays": 33,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "caution": {
      "n": 453,
      "graded": 405,
      "hit": 149,
      "miss": 256,
      "excluded": 48,
      "acc": 36.8,
      "positivePct": 38.0,
      "crashPct": 34.0,
      "meanRet": -1.31,
      "uniqueDecisionDays": 32,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 453,
     "calmN": 711,
     "unknownN": 0,
     "warn": {
      "n": 453,
      "graded": 405,
      "hit": 149,
      "miss": 256,
      "excluded": 48,
      "acc": 36.8,
      "positivePct": 38.0,
      "crashPct": 34.0,
      "meanRet": -1.31,
      "uniqueDecisionDays": 32,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "calm": {
      "n": 711,
      "graded": 577,
      "hit": 258,
      "miss": 319,
      "excluded": 134,
      "acc": 44.7,
      "positivePct": 45.3,
      "crashPct": 18.3,
      "meanRet": 0.04,
      "uniqueDecisionDays": 33,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "crashGapPp": 15.7,
     "crashGapCi95": [
      8.9,
      29.3
     ],
     "warnSharePct": 38.9
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 200,
     "calmN": 279,
     "unknownN": 0,
     "warn": {
      "n": 200,
      "graded": 177,
      "hit": 78,
      "miss": 99,
      "excluded": 23,
      "acc": 44.1,
      "positivePct": 45.5,
      "crashPct": 26.5,
      "meanRet": -0.32,
      "uniqueDecisionDays": 12,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-01"
     },
     "calm": {
      "n": 279,
      "graded": 220,
      "hit": 86,
      "miss": 134,
      "excluded": 59,
      "acc": 39.1,
      "positivePct": 40.5,
      "crashPct": 15.1,
      "meanRet": -0.57,
      "uniqueDecisionDays": 12,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-01"
     },
     "crashGapPp": 11.4,
     "crashGapCi95": [
      -8.5,
      16.8
     ],
     "warnSharePct": 41.8
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.5,
      "otherPct": 10.4,
      "gapPp": 1.1
     },
     "volatility": {
      "flagPct": 7.6,
      "otherPct": 12.7,
      "gapPp": -5.1
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1164
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
    "diana": 0.1187,
    "nova": 0.2913,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 464,
     "acc": 44.6,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 45.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 99,
     "acc": 64.6,
     "adjustedAcc": 55.5,
     "adjustedAccUsedInWeights": 55.5,
     "rowBasedAdjustedAcc": 56.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 98,
     "acc": 45.9,
     "adjustedAcc": 48.5,
     "adjustedAccUsedInWeights": 48.5,
     "rowBasedAdjustedAcc": 48.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 661,
   "globalBlend": 0.548
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1216,
    "nova": 0.2588,
    "flow": 0.3159
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 47.0,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 44.1,
     "adjustedAccUsedInWeights": 44.1,
     "rowBasedAdjustedAcc": 46.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 51.8,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 354,
   "globalBlend": 0.693
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.1211,
    "nova": 0.2616,
    "flow": 0.3119
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "adjustedAccUsedInWeights": 49.8,
     "rowBasedAdjustedAcc": 49.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 39,
     "acc": 38.5,
     "adjustedAcc": 45.7,
     "adjustedAccUsedInWeights": 45.7,
     "rowBasedAdjustedAcc": 47.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 49.2,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 352,
   "globalBlend": 0.694
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2895,
    "diana": 0.116,
    "nova": 0.2776,
    "flow": 0.317
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 44.6,
     "adjustedAcc": 48.0,
     "adjustedAccUsedInWeights": 48.0,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 37,
     "acc": 70.3,
     "adjustedAcc": 57.6,
     "adjustedAccUsedInWeights": 57.6,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 254,
   "globalBlend": 0.759
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.1177,
    "nova": 0.2631,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 59.9,
     "adjustedAcc": 53.7,
     "adjustedAccUsedInWeights": 53.7,
     "rowBasedAdjustedAcc": 55.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 32,
     "acc": 62.5,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 52.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 215,
   "globalBlend": 0.788
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3064,
    "diana": 0.1184,
    "nova": 0.2555,
    "flow": 0.3197
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 57.6,
     "adjustedAcc": 52.9,
     "adjustedAccUsedInWeights": 52.9,
     "rowBasedAdjustedAcc": 55.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 55,
     "acc": 63.6,
     "adjustedAcc": 55.1,
     "adjustedAccUsedInWeights": 55.1,
     "rowBasedAdjustedAcc": 54.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 305,
   "globalBlend": 0.724
  },
  "2차전지": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.1207,
    "nova": 0.278,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 227,
     "acc": 51.5,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 51.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 36,
     "acc": 58.3,
     "adjustedAcc": 53.1,
     "adjustedAccUsedInWeights": 53.1,
     "rowBasedAdjustedAcc": 51.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 18.8,
     "adjustedAcc": 41.9,
     "adjustedAccUsedInWeights": 41.9,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 279,
   "globalBlend": 0.741
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2998,
    "diana": 0.119,
    "nova": 0.2481,
    "flow": 0.3331
   },
   "acc": {
    "taro": {
     "n": 582,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "adjustedAccUsedInWeights": 50.1,
     "rowBasedAdjustedAcc": 50.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 231,
     "acc": 35.1,
     "adjustedAcc": 44.4,
     "adjustedAccUsedInWeights": 44.4,
     "rowBasedAdjustedAcc": 40.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 65.1,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 56.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 896,
   "globalBlend": 0.472
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3126,
    "diana": 0.1205,
    "nova": 0.2562,
    "flow": 0.3107
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 57.0,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "rowBasedAdjustedAcc": 55.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 72,
     "acc": 34.7,
     "adjustedAcc": 44.3,
     "adjustedAccUsedInWeights": 44.3,
     "rowBasedAdjustedAcc": 44.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 405,
   "globalBlend": 0.664
  },
  "화학·소재": {
   "weights": {
    "taro": 0.308,
    "diana": 0.1218,
    "nova": 0.2712,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 379,
     "acc": 50.4,
     "adjustedAcc": 50.1,
     "adjustedAccUsedInWeights": 50.1,
     "rowBasedAdjustedAcc": 50.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 15,
     "acc": 46.7,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
   "graded": 437,
   "globalBlend": 0.647
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3088,
    "diana": 0.1225,
    "nova": 0.2734,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 49.3,
     "adjustedAcc": 49.7,
     "adjustedAccUsedInWeights": 49.7,
     "rowBasedAdjustedAcc": 49.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 56,
     "acc": 48.2,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 49.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
   "graded": 285,
   "globalBlend": 0.737
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3175,
    "diana": 0.1205,
    "nova": 0.2609,
    "flow": 0.3012
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 64.4,
     "adjustedAcc": 55.4,
     "adjustedAccUsedInWeights": 55.4,
     "rowBasedAdjustedAcc": 58.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 44,
     "acc": 36.4,
     "adjustedAcc": 45.2,
     "adjustedAccUsedInWeights": 45.2,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 35.1,
     "adjustedAcc": 44.4,
     "adjustedAccUsedInWeights": 44.4,
     "rowBasedAdjustedAcc": 46.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 244,
   "globalBlend": 0.766
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3023,
    "diana": 0.116,
    "nova": 0.2595,
    "flow": 0.3222
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 61.1,
     "adjustedAcc": 54.2,
     "adjustedAccUsedInWeights": 54.2,
     "rowBasedAdjustedAcc": 55.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
     "n": 123,
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "adjustedAccUsedInWeights": 49.8,
     "rowBasedAdjustedAcc": 49.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
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
   "graded": 272,
   "globalBlend": 0.746
  }
 }
};
