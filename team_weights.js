// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-11 09:17",
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
   "taro": 0.3051,
   "diana": 0.1217,
   "nova": 0.2687,
   "flow": 0.3045
  },
  "acc": {
   "taro": {
    "n": 5850,
    "acc": 50.2,
    "adjustedAcc": 50.1,
    "adjustedAccUsedInWeights": 50.1,
    "rowBasedAdjustedAcc": 50.2,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 15,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.2,
    "absoluteN": 6002,
    "uniqueDecisionDays": 15,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": -0.4,
    "acc95": [
     47.5,
     53.7
    ],
    "lift95": [
     -3.2,
     2.7
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 11380,
     "neutralPct": 20.2,
     "bullPct": 51.6,
     "bearPct": 28.2,
     "meanAbsDeviation": 19.04,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.81,
     "medianPushPoints": 5.19
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
     "records": 11380,
     "neutralPct": 24.9,
     "bullPct": 60.9,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.63,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.15,
     "medianPushPoints": 1.95
    }
   },
   "nova": {
    "n": 1250,
    "acc": 45.7,
    "adjustedAcc": 48.1,
    "adjustedAccUsedInWeights": 48.1,
    "rowBasedAdjustedAcc": 46.1,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 15,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 1291,
    "uniqueDecisionDays": 15,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 45.8,
    "alwaysBearAcc": 54.2,
    "bestFixedDirectionAcc": 54.2,
    "liftVsFixedPp": -8.5,
    "acc95": [
     44.5,
     48.3
    ],
    "lift95": [
     -10.0,
     -7.0
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 11380,
     "neutralPct": 82.3,
     "bullPct": 9.0,
     "bearPct": 8.7,
     "meanAbsDeviation": 4.33,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.16,
     "medianPushPoints": 1.07
    }
   },
   "flow": {
    "n": 993,
    "acc": 50.1,
    "adjustedAcc": 50.0,
    "adjustedAccUsedInWeights": 50.0,
    "rowBasedAdjustedAcc": 50.0,
    "shrinkageUnit": "decision_day",
    "shrinkagePriorDays": 20,
    "nEffectiveDays": 15,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.0,
    "absoluteN": 1014,
    "uniqueDecisionDays": 15,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.6,
    "alwaysBearAcc": 50.4,
    "bestFixedDirectionAcc": 50.4,
    "liftVsFixedPp": -0.3,
    "acc95": [
     44.6,
     57.6
    ],
    "lift95": [
     -11.8,
     4.1
    ],
    "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
    "intervalBlockDays": 5,
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 11380,
     "neutralPct": 87.4,
     "bullPct": 4.0,
     "bearPct": 8.6,
     "meanAbsDeviation": 3.09,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 0.94,
     "medianPushPoints": 0.3
    }
   }
  },
  "graded": 8093,
  "dayBasedShadow": {
   "applied": true,
   "appliedNote": "2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. 소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다.",
   "reason": "건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 15,
    "diana": 0,
    "nova": 15,
    "flow": 15
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.1,
     "diana": 50.0,
     "nova": 48.1,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3051,
     "diana": 0.1217,
     "nova": 0.2687,
     "flow": 0.3045
    }
   },
   "priorDays120": {
    "adjustedAcc": {
     "taro": 50.0,
     "diana": 50.0,
     "nova": 49.5,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3013,
     "diana": 0.1205,
     "nova": 0.277,
     "flow": 0.3012
    }
   },
   "rowBasedLegacy": {
    "adjustedAcc": {
     "taro": 50.2,
     "diana": null,
     "nova": 46.1,
     "flow": 50.0
    },
    "weights": {
     "taro": 0.3107,
     "diana": 0.1236,
     "nova": 0.2562,
     "flow": 0.3094
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
   "hit": 5300,
   "miss": 3313,
   "n": 8613,
   "uniqueDecisionDays": 15,
   "minDaysForConclusion": 20,
   "acc": 61.5,
   "holdBaselineAcc": 62.9,
   "holdBaselineN": 8613,
   "liftVsHoldPp": -1.4,
   "byCall": {
    "BUY": {
     "n": 498,
     "acc": 40.6,
     "band": "±1%",
     "excludedMid": 102,
     "excludedPct": 17.0
    },
    "HOLD": {
     "n": 6625,
     "acc": 65.9,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 1490,
     "acc": 48.9,
     "band": "±1%",
     "excludedMid": 255,
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
     "n": 1285,
     "graded": 1083,
     "hit": 445,
     "miss": 638,
     "excluded": 202,
     "acc": 41.1,
     "positivePct": 42.0,
     "crashPct": 23.5,
     "meanRet": -0.44,
     "uniqueDecisionDays": 36,
     "firstDecisionDate": "2026-07-17",
     "lastDecisionDate": "2026-09-04"
    },
    "currentVersion": {
     "n": 600,
     "graded": 498,
     "hit": 202,
     "miss": 296,
     "excluded": 102,
     "acc": 40.6,
     "positivePct": 41.7,
     "crashPct": 18.8,
     "meanRet": -0.38,
     "uniqueDecisionDays": 15,
     "firstDecisionDate": "2026-08-17",
     "lastDecisionDate": "2026-09-04"
    },
    "legacyMixed": {
     "n": 1758,
     "graded": 1497,
     "hit": 585,
     "miss": 912,
     "excluded": 261,
     "acc": 39.1,
     "positivePct": 40.3,
     "crashPct": 26.1,
     "meanRet": -1.03,
     "uniqueDecisionDays": 48,
     "firstDecisionDate": "2026-07-01",
     "lastDecisionDate": "2026-09-04"
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
     "n": 19467,
     "weightedDecisionN": 1285,
     "uniqueDecisionDays": 36,
     "acc": 44.6,
     "positivePct": 44.4,
     "crashPct": 24.5,
     "meanRet": 0.23,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "currentRandomBaseline": {
     "n": 8970,
     "weightedDecisionN": 600,
     "uniqueDecisionDays": 15,
     "acc": 41.2,
     "positivePct": 41.6,
     "crashPct": 20.8,
     "meanRet": -0.46,
     "selection": "observed_auto_unique_code_date_buy_date_weighted",
     "note": "실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다."
    },
    "cautionMatrix": {
     "none": {
      "n": 801,
      "graded": 652,
      "hit": 286,
      "miss": 366,
      "excluded": 149,
      "acc": 43.9,
      "positivePct": 44.4,
      "crashPct": 17.2,
      "meanRet": 0.02,
      "uniqueDecisionDays": 36,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "caution": {
      "n": 484,
      "graded": 431,
      "hit": 159,
      "miss": 272,
      "excluded": 53,
      "acc": 36.9,
      "positivePct": 38.0,
      "crashPct": 33.9,
      "meanRet": -1.21,
      "uniqueDecisionDays": 35,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "unknown": null
    },
    "overheatAllTime": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 484,
     "calmN": 801,
     "unknownN": 0,
     "warn": {
      "n": 484,
      "graded": 431,
      "hit": 159,
      "miss": 272,
      "excluded": 53,
      "acc": 36.9,
      "positivePct": 38.0,
      "crashPct": 33.9,
      "meanRet": -1.21,
      "uniqueDecisionDays": 35,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "calm": {
      "n": 801,
      "graded": 652,
      "hit": 286,
      "miss": 366,
      "excluded": 149,
      "acc": 43.9,
      "positivePct": 44.4,
      "crashPct": 17.2,
      "meanRet": 0.02,
      "uniqueDecisionDays": 36,
      "firstDecisionDate": "2026-07-17",
      "lastDecisionDate": "2026-09-04"
     },
     "crashGapPp": 16.7,
     "crashGapCi95": [
      10.0,
      26.7
     ],
     "warnSharePct": 37.7
    },
    "overheatCurrent": {
     "enoughSample": true,
     "evidenceStatus": "EXPLORATORY_NOT_VALIDATED",
     "warnN": 231,
     "calmN": 369,
     "unknownN": 0,
     "warn": {
      "n": 231,
      "graded": 203,
      "hit": 88,
      "miss": 115,
      "excluded": 28,
      "acc": 43.3,
      "positivePct": 44.6,
      "crashPct": 27.3,
      "meanRet": -0.24,
      "uniqueDecisionDays": 15,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-04"
     },
     "calm": {
      "n": 369,
      "graded": 295,
      "hit": 114,
      "miss": 181,
      "excluded": 74,
      "acc": 38.6,
      "positivePct": 39.8,
      "crashPct": 13.6,
      "meanRet": -0.47,
      "uniqueDecisionDays": 15,
      "firstDecisionDate": "2026-08-17",
      "lastDecisionDate": "2026-09-04"
     },
     "crashGapPp": 13.7,
     "crashGapCi95": [
      -1.4,
      16.7
     ],
     "warnSharePct": 38.5
    },
    "normalizedRiskDiagnostic": {
     "surge": {
      "flagPct": 11.6,
      "otherPct": 10.4,
      "gapPp": 1.2
     },
     "volatility": {
      "flagPct": 7.3,
      "otherPct": 12.8,
      "gapPp": -5.5
     }
    },
    "provenance": {
     "excludedRecords": {
      "reconstructed": 5953,
      "nonAuto": 126
     },
     "featureSources": {
      "reconstructed_known_base": 1285
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
    "taro": 0.2924,
    "diana": 0.1208,
    "nova": 0.2936,
    "flow": 0.2931
   },
   "acc": {
    "taro": {
     "n": 583,
     "acc": 44.6,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "rowBasedAdjustedAcc": 45.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 110,
     "acc": 60.0,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 113,
     "acc": 45.1,
     "adjustedAcc": 47.9,
     "adjustedAccUsedInWeights": 47.9,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 806,
   "globalBlend": 0.498
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.1236,
    "nova": 0.2622,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 49.1,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "rowBasedAdjustedAcc": 49.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 47,
     "acc": 36.2,
     "adjustedAcc": 44.3,
     "adjustedAccUsedInWeights": 44.3,
     "rowBasedAdjustedAcc": 46.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 101,
     "acc": 47.5,
     "adjustedAcc": 48.9,
     "adjustedAccUsedInWeights": 48.9,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 437,
   "globalBlend": 0.647
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.1245,
    "nova": 0.2693,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 308,
     "acc": 46.1,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 47.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 46,
     "acc": 41.3,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 41.8,
     "adjustedAcc": 46.5,
     "adjustedAccUsedInWeights": 46.5,
     "rowBasedAdjustedAcc": 46.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 433,
   "globalBlend": 0.649
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2904,
    "diana": 0.1169,
    "nova": 0.2827,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 227,
     "acc": 47.1,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "rowBasedAdjustedAcc": 48.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 48,
     "acc": 66.7,
     "adjustedAcc": 57.1,
     "adjustedAccUsedInWeights": 57.1,
     "rowBasedAdjustedAcc": 54.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 308,
   "globalBlend": 0.722
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3045,
    "diana": 0.1191,
    "nova": 0.2665,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 56.5,
     "adjustedAcc": 52.8,
     "adjustedAccUsedInWeights": 52.8,
     "rowBasedAdjustedAcc": 54.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 35,
     "acc": 62.9,
     "adjustedAcc": 55.3,
     "adjustedAccUsedInWeights": 55.3,
     "rowBasedAdjustedAcc": 52.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 264,
   "globalBlend": 0.752
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3083,
    "diana": 0.1211,
    "nova": 0.2598,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 308,
     "acc": 53.9,
     "adjustedAcc": 51.7,
     "adjustedAccUsedInWeights": 51.7,
     "rowBasedAdjustedAcc": 52.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 66,
     "acc": 56.1,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "rowBasedAdjustedAcc": 52.2,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 381,
   "globalBlend": 0.677
  },
  "2차전지": {
   "weights": {
    "taro": 0.3058,
    "diana": 0.1239,
    "nova": 0.2915,
    "flow": 0.2788
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 46.4,
     "adjustedAcc": 48.4,
     "adjustedAccUsedInWeights": 48.4,
     "rowBasedAdjustedAcc": 47.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 38,
     "acc": 60.5,
     "adjustedAcc": 54.3,
     "adjustedAccUsedInWeights": 54.3,
     "rowBasedAdjustedAcc": 52.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 32,
     "acc": 12.5,
     "adjustedAcc": 37.5,
     "adjustedAccUsedInWeights": 37.5,
     "rowBasedAdjustedAcc": 42.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 359,
   "globalBlend": 0.69
  },
  "보험": {
   "weights": {
    "taro": 0.2982,
    "diana": 0.1194,
    "nova": 0.2651,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 48.6,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "rowBasedAdjustedAcc": 49.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 84,
     "acc": 47.6,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "rowBasedAdjustedAcc": 49.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 70.6,
     "adjustedAcc": 58.8,
     "adjustedAccUsedInWeights": 58.8,
     "rowBasedAdjustedAcc": 54.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 225,
   "globalBlend": 0.78
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1187,
    "nova": 0.2415,
    "flow": 0.3387
   },
   "acc": {
    "taro": {
     "n": 728,
     "acc": 51.8,
     "adjustedAcc": 50.8,
     "adjustedAccUsedInWeights": 50.8,
     "rowBasedAdjustedAcc": 51.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 322,
     "acc": 34.5,
     "adjustedAcc": 43.3,
     "adjustedAccUsedInWeights": 43.3,
     "rowBasedAdjustedAcc": 38.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 103,
     "acc": 67.0,
     "adjustedAcc": 57.3,
     "adjustedAccUsedInWeights": 57.3,
     "rowBasedAdjustedAcc": 57.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1153,
   "globalBlend": 0.41
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3203,
    "diana": 0.1232,
    "nova": 0.2611,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 378,
     "acc": 57.1,
     "adjustedAcc": 53.1,
     "adjustedAccUsedInWeights": 53.1,
     "rowBasedAdjustedAcc": 55.4,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 91,
     "acc": 37.4,
     "adjustedAcc": 44.6,
     "adjustedAccUsedInWeights": 44.6,
     "rowBasedAdjustedAcc": 44.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 40.5,
     "adjustedAcc": 46.3,
     "adjustedAccUsedInWeights": 46.3,
     "rowBasedAdjustedAcc": 47.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 506,
   "globalBlend": 0.613
  },
  "조선": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.1242,
    "nova": 0.2695,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 43.2,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "rowBasedAdjustedAcc": 45.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 27,
     "acc": 37.0,
     "adjustedAcc": 44.9,
     "adjustedAccUsedInWeights": 44.9,
     "rowBasedAdjustedAcc": 47.6,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 13,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 205,
   "globalBlend": 0.796
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3043,
    "diana": 0.1223,
    "nova": 0.2845,
    "flow": 0.2889
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 48.7,
     "adjustedAcc": 49.5,
     "adjustedAccUsedInWeights": 49.5,
     "rowBasedAdjustedAcc": 49.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 18,
     "acc": 55.6,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 38.0,
     "adjustedAcc": 45.1,
     "adjustedAccUsedInWeights": 45.1,
     "rowBasedAdjustedAcc": 46.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 538,
   "globalBlend": 0.598
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3112,
    "diana": 0.1251,
    "nova": 0.2813,
    "flow": 0.2824
   },
   "acc": {
    "taro": {
     "n": 279,
     "acc": 48.4,
     "adjustedAcc": 49.3,
     "adjustedAccUsedInWeights": 49.3,
     "rowBasedAdjustedAcc": 48.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 60,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "rowBasedAdjustedAcc": 50.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 14.3,
     "adjustedAcc": 38.1,
     "adjustedAccUsedInWeights": 38.1,
     "rowBasedAdjustedAcc": 46.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 10,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 353,
   "globalBlend": 0.694
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3031,
    "diana": 0.1206,
    "nova": 0.2703,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 51.4,
     "adjustedAcc": 50.6,
     "adjustedAccUsedInWeights": 50.6,
     "rowBasedAdjustedAcc": 50.7,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 34,
     "acc": 55.9,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "rowBasedAdjustedAcc": 51.3,
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
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3211,
    "diana": 0.1229,
    "nova": 0.2688,
    "flow": 0.2872
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 60.9,
     "adjustedAcc": 54.7,
     "adjustedAccUsedInWeights": 54.7,
     "rowBasedAdjustedAcc": 56.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 63,
     "acc": 42.9,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "rowBasedAdjustedAcc": 47.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 29.8,
     "adjustedAcc": 41.3,
     "adjustedAccUsedInWeights": 41.3,
     "rowBasedAdjustedAcc": 44.3,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 312,
   "globalBlend": 0.719
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3077,
    "diana": 0.1167,
    "nova": 0.2581,
    "flow": 0.3175
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 63.6,
     "adjustedAcc": 55.8,
     "adjustedAccUsedInWeights": 55.8,
     "rowBasedAdjustedAcc": 58.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 152,
     "acc": 46.1,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 47.8,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
   "graded": 346,
   "globalBlend": 0.698
  },
  "로봇": {
   "weights": {
    "taro": 0.2905,
    "diana": 0.1206,
    "nova": 0.2665,
    "flow": 0.3223
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 33.9,
     "adjustedAcc": 43.1,
     "adjustedAccUsedInWeights": 43.1,
     "rowBasedAdjustedAcc": 42.0,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
     "n": 74,
     "acc": 45.9,
     "adjustedAcc": 48.3,
     "adjustedAccUsedInWeights": 48.3,
     "rowBasedAdjustedAcc": 48.5,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 26,
     "acc": 73.1,
     "adjustedAcc": 59.5,
     "adjustedAccUsedInWeights": 59.5,
     "rowBasedAdjustedAcc": 54.1,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 14,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 218,
   "globalBlend": 0.786
  },
  "식음료": {
   "weights": {
    "taro": 0.3023,
    "diana": 0.1202,
    "nova": 0.2683,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 51.5,
     "adjustedAcc": 50.7,
     "adjustedAccUsedInWeights": 50.7,
     "rowBasedAdjustedAcc": 50.9,
     "shrinkageUnit": "decision_day",
     "shrinkagePriorDays": 20,
     "nEffectiveDays": 15,
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
   "graded": 209,
   "globalBlend": 0.793
  }
 }
};
