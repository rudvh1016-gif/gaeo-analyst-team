// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-07 14:03",
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
   "taro": 0.3033,
   "diana": 0.119,
   "nova": 0.264,
   "flow": 0.3137
  },
  "acc": {
   "taro": {
    "n": 4289,
    "acc": 51.8,
    "adjustedAcc": 50.6,
    "adjustedAccUsedInWeights": 50.6,
    "rowBasedAdjustedAcc": 51.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 11,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.9,
    "absoluteN": 4403,
    "uniqueDecisionDays": 11,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": 1.2,
    "acc95": [
     50.0,
     53.9
    ],
    "lift95": [
     -0.2,
     3.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 9580,
     "neutralPct": 19.7,
     "bullPct": 53.4,
     "bearPct": 26.8,
     "meanAbsDeviation": 19.21,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.83,
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
     "records": 9580,
     "neutralPct": 25.0,
     "bullPct": 61.0,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.55,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.09,
     "medianPushPoints": 1.9
    }
   },
   "nova": {
    "n": 934,
    "acc": 45.3,
    "adjustedAcc": 48.3,
    "adjustedAccUsedInWeights": 48.3,
    "rowBasedAdjustedAcc": 45.8,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 11,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.6,
    "absoluteN": 972,
    "uniqueDecisionDays": 11,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.3,
    "alwaysBearAcc": 52.7,
    "bestFixedDirectionAcc": 52.7,
    "liftVsFixedPp": -7.4,
    "acc95": [
     43.4,
     47.4
    ],
    "lift95": [
     -10.1,
     -6.1
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 9580,
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
    "n": 749,
    "acc": 55.0,
    "adjustedAcc": 51.8,
    "adjustedAccUsedInWeights": 51.8,
    "rowBasedAdjustedAcc": 54.3,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 11,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 764,
    "uniqueDecisionDays": 11,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 44.9,
    "alwaysBearAcc": 55.1,
    "bestFixedDirectionAcc": 55.1,
    "liftVsFixedPp": -0.1,
    "acc95": [
     52.5,
     58.0
    ],
    "lift95": [
     -2.9,
     3.1
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 9580,
     "neutralPct": 87.0,
     "bullPct": 3.8,
     "bearPct": 9.1,
     "meanAbsDeviation": 3.13,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.98,
     "medianPushPoints": 0.31
    }
   }
  },
  "graded": 5972,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 11,
    "diana": 0,
    "nova": 11,
    "flow": 11
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.6,
     "diana": 50.0,
     "nova": 48.3,
     "flow": 51.8
    },
    "weights": {
     "taro": 0.3033,
     "diana": 0.119,
     "nova": 0.264,
     "flow": 0.3137
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.2,
     "diana": 50.0,
     "nova": 49.6,
     "flow": 50.4
    },
    "weights": {
     "taro": 0.3008,
     "diana": 0.1198,
     "nova": 0.2762,
     "flow": 0.3032
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 51.8,
     "diana": null,
     "nova": 45.8,
     "flow": 54.3
    },
    "weights": {
     "taro": 0.3088,
     "diana": 0.1171,
     "nova": 0.241,
     "flow": 0.3331
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
   "hit": 3975,
   "miss": 2371,
   "n": 6346,
   "uniqueDecisionDays": 11,
   "minDaysForConclusion": 20,
   "acc": 62.6,
   "holdBaselineAcc": 61.9,
   "holdBaselineN": 6346,
   "liftVsHoldPp": 0.7,
   "byCall": {
    "BUY": {
     "n": 329,
     "acc": 44.1,
     "band": "±1%",
     "excludedMid": 69,
     "excludedPct": 17.3
    },
    "HOLD": {
     "n": 5101,
     "acc": 64.5,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 916,
     "acc": 58.8,
     "band": "±1%",
     "excludedMid": 159,
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
     "n": 1083,
     "graded": 914,
     "hit": 388,
     "miss": 526,
     "excluded": 169,
     "acc": 42.5,
     "positivePct": 43.1,
     "crashPct": 24.6,
     "meanRet": -0.41,
     "uniqueDecisionDays": 32,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-08-31"
    },
    "currentVersion": {
     "n": 398,
     "graded": 329,
     "hit": 145,
     "miss": 184,
     "excluded": 69,
     "acc": 44.1,
     "positivePct": 44.5,
     "crashPct": 19.3,
     "meanRet": -0.25,
     "uniqueDecisionDays": 11,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-08-31"
    },
    "legacyMixed": {
     "n": 1556,
     "graded": 1328,
     "hit": 528,
     "miss": 800,
     "excluded": 228,
     "acc": 39.8,
     "positivePct": 40.8,
     "crashPct": 27.2,
     "meanRet": -1.08,
     "uniqueDecisionDays": 44,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-08-31"
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
     "n": 17071,
     "weightedDecisionN": 1083,
     "uniqueDecisionDays": 32,
     "acc": 44.0,
     "positivePct": 43.9,
     "crashPct": 26.6,
     "meanRet": 0.11,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 6574,
     "weightedDecisionN": 398,
     "uniqueDecisionDays": 11,
     "acc": 37.9,
     "positivePct": 39.1,
     "crashPct": 24.6,
     "meanRet": -1.14,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 662,
      "graded": 539,
      "hit": 248,
      "miss": 291,
      "excluded": 123,
      "acc": 46.0,
      "positivePct": 46.1,
      "crashPct": 18.4,
      "meanRet": 0.14,
      "uniqueDecisionDays": 32,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-08-31"
     },
     "caution": {
      "n": 421,
      "graded": 375,
      "hit": 140,
      "miss": 235,
      "excluded": 46,
      "acc": 37.3,
      "positivePct": 38.5,
      "crashPct": 34.2,
      "meanRet": -1.26,
      "uniqueDecisionDays": 31,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-08-31"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 421,
     "calmN": 662,
     "unknownN": 0,
     "warn": {
      "n": 421,
      "graded": 375,
      "hit": 140,
      "miss": 235,
      "excluded": 46,
      "acc": 37.3,
      "positivePct": 38.5,
      "crashPct": 34.2,
      "meanRet": -1.26,
      "uniqueDecisionDays": 31,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-08-31"
     },
     "calm": {
      "n": 662,
      "graded": 539,
      "hit": 248,
      "miss": 291,
      "excluded": 123,
      "acc": 46.0,
      "positivePct": 46.1,
      "crashPct": 18.4,
      "meanRet": 0.14,
      "uniqueDecisionDays": 32,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-08-31"
     },
     "crashGapPp": 15.8,
     "crashGapCi95": [
      8.6,
      31.0
     ],
     "warnSharePct": 38.9
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 168,
     "calmN": 230,
     "unknownN": 0,
     "warn": {
      "n": 168,
      "graded": 147,
      "hit": 69,
      "miss": 78,
      "excluded": 21,
      "acc": 46.9,
      "positivePct": 48.2,
      "crashPct": 25.6,
      "meanRet": -0.02,
      "uniqueDecisionDays": 11,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-08-31"
     },
     "calm": {
      "n": 230,
      "graded": 182,
      "hit": 76,
      "miss": 106,
      "excluded": 48,
      "acc": 41.8,
      "positivePct": 41.7,
      "crashPct": 14.8,
      "meanRet": -0.42,
      "uniqueDecisionDays": 11,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-08-31"
     },
     "crashGapPp": 10.8,
     "crashGapCi95": [
      -10.1,
      16.3
     ],
     "warnSharePct": 42.2
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 12.1,
      "otherPct": 10.3,
      "gapPp": 1.8
     },
     "volatility": {
      "flagPct": 8.0,
      "otherPct": 12.8,
      "gapPp": -4.8
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1083
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
    "taro": 0.2917,
    "diana": 0.1183,
    "nova": 0.2883,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 44.6,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "rowBasedAdjustedAcc": 45.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 96,
     "acc": 64.6,
     "adjustedAcc": 55.2,
     "adjustedAccUsedInWeights": 55.2,
     "rowBasedAdjustedAcc": 56.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 47.8,
     "adjustedAcc": 49.2,
     "adjustedAccUsedInWeights": 49.2,
     "rowBasedAdjustedAcc": 49.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 619,
   "globalBlend": 0.564
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1207,
    "nova": 0.2594,
    "flow": 0.3178
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 46.2,
     "adjustedAcc": 48.6,
     "adjustedAccUsedInWeights": 48.6,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 40,
     "acc": 35.0,
     "adjustedAcc": 44.7,
     "adjustedAccUsedInWeights": 44.7,
     "rowBasedAdjustedAcc": 46.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 75,
     "acc": 54.7,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 51.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 323,
   "globalBlend": 0.712
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.1203,
    "nova": 0.2618,
    "flow": 0.3147
   },
   "acc": {
    "taro": {
     "n": 226,
     "acc": 48.2,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 48.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "acc": 38.9,
     "adjustedAcc": 46.1,
     "adjustedAccUsedInWeights": 46.1,
     "rowBasedAdjustedAcc": 47.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 52.5,
     "adjustedAcc": 50.9,
     "adjustedAccUsedInWeights": 50.9,
     "rowBasedAdjustedAcc": 50.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 323,
   "globalBlend": 0.712
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2906,
    "diana": 0.116,
    "nova": 0.2776,
    "flow": 0.3158
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 43.9,
     "adjustedAcc": 47.8,
     "adjustedAccUsedInWeights": 47.8,
     "rowBasedAdjustedAcc": 46.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 35,
     "acc": 68.6,
     "adjustedAcc": 56.6,
     "adjustedAccUsedInWeights": 56.6,
     "rowBasedAdjustedAcc": 54.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 239,
   "globalBlend": 0.77
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3049,
    "diana": 0.1174,
    "nova": 0.2629,
    "flow": 0.3148
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 61.0,
     "adjustedAcc": 53.9,
     "adjustedAccUsedInWeights": 53.9,
     "rowBasedAdjustedAcc": 56.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 30,
     "acc": 63.3,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 52.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 200,
   "globalBlend": 0.8
  },
  "금융·증권": {
   "weights": {
    "taro": 0.308,
    "diana": 0.1194,
    "nova": 0.2553,
    "flow": 0.3174
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 56.1,
     "adjustedAcc": 52.2,
     "adjustedAccUsedInWeights": 52.2,
     "rowBasedAdjustedAcc": 54.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "acc": 16.7,
     "adjustedAcc": 43.3,
     "adjustedAccUsedInWeights": 43.3,
     "rowBasedAdjustedAcc": 48.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 5,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 58.0,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 52.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 277,
   "globalBlend": 0.743
  },
  "2차전지": {
   "weights": {
    "taro": 0.3073,
    "diana": 0.1194,
    "nova": 0.2758,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 55.6,
     "adjustedAcc": 52.0,
     "adjustedAccUsedInWeights": 52.0,
     "rowBasedAdjustedAcc": 53.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 35,
     "acc": 60.0,
     "adjustedAcc": 53.5,
     "adjustedAccUsedInWeights": 53.5,
     "rowBasedAdjustedAcc": 52.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 21.4,
     "adjustedAcc": 43.4,
     "adjustedAccUsedInWeights": 43.4,
     "rowBasedAdjustedAcc": 47.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 256,
   "globalBlend": 0.758
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1187,
    "nova": 0.2496,
    "flow": 0.3301
   },
   "acc": {
    "taro": {
     "n": 536,
     "acc": 51.1,
     "adjustedAcc": 50.4,
     "adjustedAccUsedInWeights": 50.4,
     "rowBasedAdjustedAcc": 50.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 206,
     "acc": 35.0,
     "adjustedAcc": 44.7,
     "adjustedAccUsedInWeights": 44.7,
     "rowBasedAdjustedAcc": 40.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 64.6,
     "adjustedAcc": 55.2,
     "adjustedAccUsedInWeights": 55.2,
     "rowBasedAdjustedAcc": 55.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 821,
   "globalBlend": 0.494
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3118,
    "diana": 0.1199,
    "nova": 0.2538,
    "flow": 0.3144
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 57.6,
     "adjustedAcc": 52.7,
     "adjustedAccUsedInWeights": 52.7,
     "rowBasedAdjustedAcc": 55.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 68,
     "acc": 30.9,
     "adjustedAcc": 43.2,
     "adjustedAccUsedInWeights": 43.2,
     "rowBasedAdjustedAcc": 43.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 26,
     "acc": 53.8,
     "adjustedAcc": 51.2,
     "adjustedAccUsedInWeights": 51.2,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 9,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 372,
   "globalBlend": 0.683
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3102,
    "diana": 0.1214,
    "nova": 0.2675,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 342,
     "acc": 52.3,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 14,
     "acc": 42.9,
     "adjustedAcc": 47.6,
     "adjustedAccUsedInWeights": 47.6,
     "rowBasedAdjustedAcc": 49.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 36.8,
     "adjustedAcc": 45.3,
     "adjustedAccUsedInWeights": 45.3,
     "rowBasedAdjustedAcc": 46.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 394,
   "globalBlend": 0.67
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3085,
    "diana": 0.1217,
    "nova": 0.2736,
    "flow": 0.2963
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 52,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
   "graded": 264,
   "globalBlend": 0.752
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3149,
    "diana": 0.1198,
    "nova": 0.2613,
    "flow": 0.3041
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 64.0,
     "adjustedAcc": 55.0,
     "adjustedAccUsedInWeights": 55.0,
     "rowBasedAdjustedAcc": 57.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 43,
     "acc": 37.2,
     "adjustedAcc": 45.7,
     "adjustedAccUsedInWeights": 45.7,
     "rowBasedAdjustedAcc": 46.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 38.2,
     "adjustedAcc": 45.8,
     "adjustedAccUsedInWeights": 45.8,
     "rowBasedAdjustedAcc": 47.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 227,
   "globalBlend": 0.779
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.1159,
    "nova": 0.2597,
    "flow": 0.3224
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 61.2,
     "adjustedAcc": 54.0,
     "adjustedAccUsedInWeights": 54.0,
     "rowBasedAdjustedAcc": 55.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
     "n": 115,
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "adjustedAccUsedInWeights": 49.8,
     "rowBasedAdjustedAcc": 49.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 11,
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
   "graded": 254,
   "globalBlend": 0.759
  }
 }
};
