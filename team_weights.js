// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-08 15:36",
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
   "taro": 0.3036,
   "diana": 0.1194,
   "nova": 0.2636,
   "flow": 0.3134
  },
  "acc": {
   "taro": {
    "n": 4669,
    "acc": 51.5,
    "adjustedAcc": 50.6,
    "adjustedAccUsedInWeights": 50.6,
    "rowBasedAdjustedAcc": 51.5,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 12,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.7,
    "absoluteN": 4824,
    "uniqueDecisionDays": 12,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.5,
    "alwaysBearAcc": 50.5,
    "bestFixedDirectionAcc": 50.5,
    "liftVsFixedPp": 1.0,
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
     "bullPct": 52.8,
     "bearPct": 27.4,
     "meanAbsDeviation": 19.17,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.82,
     "medianPushPoints": 5.16
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
    "n": 1000,
    "acc": 45.1,
    "adjustedAcc": 48.2,
    "adjustedAccUsedInWeights": 48.2,
    "rowBasedAdjustedAcc": 45.6,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 12,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.0,
    "absoluteN": 1054,
    "uniqueDecisionDays": 12,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.8,
    "alwaysBearAcc": 53.2,
    "bestFixedDirectionAcc": 53.2,
    "liftVsFixedPp": -8.1,
    "acc95": [
     43.7,
     46.7
    ],
    "lift95": [
     -9.9,
     -6.8
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 10180,
     "neutralPct": 82.3,
     "bullPct": 9.0,
     "bearPct": 8.7,
     "meanAbsDeviation": 4.31,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.14,
     "medianPushPoints": 1.05
    }
   },
   "flow": {
    "n": 808,
    "acc": 54.3,
    "adjustedAcc": 51.6,
    "adjustedAccUsedInWeights": 51.6,
    "rowBasedAdjustedAcc": 53.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 12,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 835,
    "uniqueDecisionDays": 12,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 46.0,
    "alwaysBearAcc": 54.0,
    "bestFixedDirectionAcc": 54.0,
    "liftVsFixedPp": 0.4,
    "acc95": [
     52.7,
     59.2
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
  "graded": 6477,
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
     "taro": 50.6,
     "diana": 50.0,
     "nova": 48.2,
     "flow": 51.6
    },
    "weights": {
     "taro": 0.3036,
     "diana": 0.1194,
     "nova": 0.2636,
     "flow": 0.3134
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
     "taro": 0.3009,
     "diana": 0.1199,
     "nova": 0.276,
     "flow": 0.3032
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 51.5,
     "diana": null,
     "nova": 45.6,
     "flow": 53.8
    },
    "weights": {
     "taro": 0.3089,
     "diana": 0.1182,
     "nova": 0.2419,
     "flow": 0.331
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
   "hit": 4316,
   "miss": 2601,
   "n": 6917,
   "uniqueDecisionDays": 12,
   "minDaysForConclusion": 20,
   "acc": 62.4,
   "holdBaselineAcc": 62.1,
   "holdBaselineN": 6917,
   "liftVsHoldPp": 0.3,
   "byCall": {
    "BUY": {
     "n": 401,
     "acc": 40.9,
     "band": "±1%",
     "excludedMid": 78,
     "excludedPct": 16.3
    },
    "HOLD": {
     "n": 5499,
     "acc": 64.6,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1017,
     "acc": 59.0,
     "band": "±1%",
     "excludedMid": 178,
     "excludedPct": 14.9
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
     "graded": 986,
     "hit": 407,
     "miss": 579,
     "excluded": 178,
     "acc": 41.3,
     "positivePct": 42.3,
     "crashPct": 24.7,
     "meanRet": -0.51,
     "uniqueDecisionDays": 33,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-01"
    },
    "currentVersion": {
     "n": 479,
     "graded": 401,
     "hit": 164,
     "miss": 237,
     "excluded": 78,
     "acc": 40.9,
     "positivePct": 42.2,
     "crashPct": 20.7,
     "meanRet": -0.52,
     "uniqueDecisionDays": 12,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-01"
    },
    "legacyMixed": {
     "n": 1637,
     "graded": 1400,
     "hit": 547,
     "miss": 853,
     "excluded": 237,
     "acc": 39.1,
     "positivePct": 40.3,
     "crashPct": 27.2,
     "meanRet": -1.12,
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
     "acc": 43.2,
     "positivePct": 43.1,
     "crashPct": 26.2,
     "meanRet": 0.03,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 7173,
     "weightedDecisionN": 479,
     "uniqueDecisionDays": 12,
     "acc": 36.9,
     "positivePct": 37.8,
     "crashPct": 24.0,
     "meanRet": -1.12,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 711,
      "graded": 579,
      "hit": 258,
      "miss": 321,
      "excluded": 132,
      "acc": 44.6,
      "positivePct": 45.0,
      "crashPct": 18.4,
      "meanRet": 0.02,
      "uniqueDecisionDays": 33,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "caution": {
      "n": 453,
      "graded": 407,
      "hit": 149,
      "miss": 258,
      "excluded": 46,
      "acc": 36.6,
      "positivePct": 38.0,
      "crashPct": 34.7,
      "meanRet": -1.34,
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
      "graded": 407,
      "hit": 149,
      "miss": 258,
      "excluded": 46,
      "acc": 36.6,
      "positivePct": 38.0,
      "crashPct": 34.7,
      "meanRet": -1.34,
      "uniqueDecisionDays": 32,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "calm": {
      "n": 711,
      "graded": 579,
      "hit": 258,
      "miss": 321,
      "excluded": 132,
      "acc": 44.6,
      "positivePct": 45.0,
      "crashPct": 18.4,
      "meanRet": 0.02,
      "uniqueDecisionDays": 33,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-01"
     },
     "crashGapPp": 16.3,
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
      "graded": 179,
      "hit": 78,
      "miss": 101,
      "excluded": 21,
      "acc": 43.6,
      "positivePct": 45.5,
      "crashPct": 28.0,
      "meanRet": -0.39,
      "uniqueDecisionDays": 12,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-01"
     },
     "calm": {
      "n": 279,
      "graded": 222,
      "hit": 86,
      "miss": 136,
      "excluded": 57,
      "acc": 38.7,
      "positivePct": 39.8,
      "crashPct": 15.4,
      "meanRet": -0.61,
      "uniqueDecisionDays": 12,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-01"
     },
     "crashGapPp": 12.6,
     "crashGapCi95": [
      -8.5,
      17.7
     ],
     "warnSharePct": 41.8
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.7,
      "otherPct": 10.8,
      "gapPp": 0.9
     },
     "volatility": {
      "flagPct": 7.9,
      "otherPct": 13.1,
      "gapPp": -5.3
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
    "taro": 0.2918,
    "diana": 0.1186,
    "nova": 0.2908,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 464,
     "acc": 44.8,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "rowBasedAdjustedAcc": 45.9,
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
    "taro": 0.3037,
    "diana": 0.1214,
    "nova": 0.2583,
    "flow": 0.3166
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 46.7,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 47.9,
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
     "n": 82,
     "acc": 52.4,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 51.0,
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
  "전력·에너지": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.121,
    "nova": 0.2612,
    "flow": 0.3121
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
    "taro": 0.2897,
    "diana": 0.1159,
    "nova": 0.2771,
    "flow": 0.3172
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 44.3,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 46.5,
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
   "graded": 253,
   "globalBlend": 0.76
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.1175,
    "nova": 0.2624,
    "flow": 0.3153
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 59.8,
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
     "n": 33,
     "acc": 63.6,
     "adjustedAcc": 55.1,
     "adjustedAccUsedInWeights": 55.1,
     "rowBasedAdjustedAcc": 52.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 12,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 218,
   "globalBlend": 0.786
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3066,
    "diana": 0.1184,
    "nova": 0.2551,
    "flow": 0.32
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 57.4,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 54.9,
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
   "graded": 306,
   "globalBlend": 0.723
  },
  "2차전지": {
   "weights": {
    "taro": 0.3069,
    "diana": 0.1205,
    "nova": 0.2775,
    "flow": 0.2951
   },
   "acc": {
    "taro": {
     "n": 227,
     "acc": 52.0,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 51.3,
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
    "taro": 0.3006,
    "diana": 0.119,
    "nova": 0.2471,
    "flow": 0.3333
   },
   "acc": {
    "taro": {
     "n": 581,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "adjustedAccUsedInWeights": 50.2,
     "rowBasedAdjustedAcc": 50.4,
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
     "n": 229,
     "acc": 34.5,
     "adjustedAcc": 44.2,
     "adjustedAccUsedInWeights": 44.2,
     "rowBasedAdjustedAcc": 39.8,
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
   "graded": 893,
   "globalBlend": 0.473
  },
  "지주·상사": {
   "weights": {
    "taro": 0.313,
    "diana": 0.1204,
    "nova": 0.2558,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 57.2,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 55.2,
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
   "graded": 404,
   "globalBlend": 0.664
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.1218,
    "nova": 0.2708,
    "flow": 0.2991
   },
   "acc": {
    "taro": {
     "n": 378,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "adjustedAccUsedInWeights": 50.2,
     "rowBasedAdjustedAcc": 50.4,
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
   "graded": 436,
   "globalBlend": 0.647
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3092,
    "diana": 0.1224,
    "nova": 0.2729,
    "flow": 0.2955
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 49.5,
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
   "graded": 286,
   "globalBlend": 0.737
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.318,
    "diana": 0.1204,
    "nova": 0.2603,
    "flow": 0.3013
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 64.8,
     "adjustedAcc": 55.6,
     "adjustedAccUsedInWeights": 55.6,
     "rowBasedAdjustedAcc": 58.5,
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
   "graded": 243,
   "globalBlend": 0.767
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1159,
    "nova": 0.2588,
    "flow": 0.3225
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 61.4,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 56.0,
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
     "n": 124,
     "acc": 49.2,
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
   "graded": 274,
   "globalBlend": 0.745
  }
 }
};
