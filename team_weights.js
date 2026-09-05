// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을
// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-05 03:46",
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
 "method": "role-prior-bayesian-shrinkage-v3-market-relative",
 "scoring": {
  "basis": "market_relative_excess",
  "benchmark": "cross_sectional_median_of_covered_universe",
  "benchmarkMinCodes": 30,
  "fallbackToAbsoluteN": 0,
  "since": "2026-08-31",
  "note": "분석가 채점만 시장 대비로 바꿨다. 팀 적중률(team.acc)은 사용자에게 계속 같은 뜻으로 보여야 하므로 절대 기준을 유지한다."
 },
 "global": {
  "version": "tw-2026-08-31-market-relative",
  "weights": {
   "taro": 0.3101,
   "diana": 0.1167,
   "nova": 0.2385,
   "flow": 0.3347
  },
  "acc": {
   "taro": {
    "n": 3912,
    "acc": 52.1,
    "adjustedAcc": 52.0,
    "adjustedAccUsedInWeights": 52.0,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 4021,
    "uniqueDecisionDays": 10,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 49.4,
    "alwaysBearAcc": 50.6,
    "bestFixedDirectionAcc": 50.6,
    "liftVsFixedPp": 1.5,
    "acc95": [
     50.3,
     54.6
    ],
    "lift95": [
     -0.2,
     4.1
    ],
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 8980,
     "neutralPct": 19.5,
     "bullPct": 54.3,
     "bearPct": 26.2,
     "meanAbsDeviation": 19.28,
     "medianAbsDeviation": 17.0,
     "meanPushPoints": 5.98,
     "medianPushPoints": 5.27
    }
   },
   "diana": {
    "n": 0,
    "acc": null,
    "adjustedAcc": null,
    "adjustedAccUsedInWeights": 50.0,
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
    "skillStatus": "NOT_GRADED_YET",
    "voice": {
     "records": 8980,
     "neutralPct": 24.9,
     "bullPct": 61.0,
     "bearPct": 14.1,
     "meanAbsDeviation": 17.52,
     "medianAbsDeviation": 16.0,
     "meanPushPoints": 2.04,
     "medianPushPoints": 1.87
    }
   },
   "nova": {
    "n": 863,
    "acc": 45.0,
    "adjustedAcc": 45.6,
    "adjustedAccUsedInWeights": 45.6,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 904,
    "uniqueDecisionDays": 10,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 47.9,
    "alwaysBearAcc": 52.1,
    "bestFixedDirectionAcc": 52.1,
    "liftVsFixedPp": -7.1,
    "acc95": [
     41.5,
     48.6
    ],
    "lift95": [
     -11.9,
     -3.1
    ],
    "skillStatus": "BELOW_FIXED_BASELINE",
    "voice": {
     "records": 8980,
     "neutralPct": 82.5,
     "bullPct": 8.7,
     "bearPct": 8.8,
     "meanAbsDeviation": 4.32,
     "medianAbsDeviation": 4.0,
     "meanPushPoints": 1.03,
     "medianPushPoints": 0.95
    }
   },
   "flow": {
    "n": 688,
    "acc": 55.4,
    "adjustedAcc": 54.6,
    "adjustedAccUsedInWeights": 54.6,
    "gatedToPrior": false,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 701,
    "uniqueDecisionDays": 10,
    "minDaysForConclusion": 20,
    "alwaysBullAcc": 44.3,
    "alwaysBearAcc": 55.7,
    "bestFixedDirectionAcc": 55.7,
    "liftVsFixedPp": -0.3,
    "acc95": [
     52.5,
     59.6
    ],
    "lift95": [
     -2.9,
     3.2
    ],
    "skillStatus": "NOT_PROVEN",
    "voice": {
     "records": 8980,
     "neutralPct": 86.9,
     "bullPct": 3.9,
     "bearPct": 9.2,
     "meanAbsDeviation": 3.15,
     "medianAbsDeviation": 1.0,
     "meanPushPoints": 1.05,
     "medianPushPoints": 0.33
    }
   }
  },
  "graded": 5463,
  "dayBasedShadow": {
   "applied": false,
   "appliedNote": "기록 전용이다. 실제 판단은 global.weights로만 이뤄진다. 적용하려면 WEIGHT_MATURITY_GATE를 사람이 켜야 하고, 그 전에 사전등록 검증을 통과해야 한다.",
   "reason": "현재 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.",
   "nEffective": {
    "taro": 10,
    "diana": 0,
    "nova": 10,
    "flow": 10
   },
   "minDaysForConclusion": 20,
   "priorDays20": {
    "adjustedAcc": {
     "taro": 50.7,
     "diana": 50.0,
     "nova": 48.3,
     "flow": 51.8
    },
    "weights": {
     "taro": 0.3035,
     "diana": 0.1189,
     "nova": 0.2639,
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
     "taro": 0.3009,
     "diana": 0.1198,
     "nova": 0.2762,
     "flow": 0.3032
    }
   },
   "maturityGate": {
    "enabled": false,
    "weights": {
     "taro": 0.3,
     "diana": 0.12,
     "nova": 0.28,
     "flow": 0.3
    },
    "note": "판단일이 기준 미만인 분석가는 역할 사전비중을 그대로 쓴다. 2026-09-14부터 DIANA 채점이 시작되는데, 지금 구조에서는 하루치 결과만으로 DIANA 발언권이 크게 흔들릴 수 있다."
   }
  },
  "team": {
   "basis": "absolute_return",
   "hit": 3606,
   "miss": 2172,
   "n": 5778,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.4,
   "holdBaselineAcc": 61.2,
   "holdBaselineN": 5778,
   "liftVsHoldPp": 1.2,
   "byCall": {
    "BUY": {
     "n": 258,
     "acc": 46.9,
     "band": "±1%",
     "excludedMid": 58,
     "excludedPct": 18.4
    },
    "HOLD": {
     "n": 4683,
     "acc": 64.1,
     "band": "±5%",
     "excludedMid": 0,
     "excludedPct": 0.0
    },
    "SELL": {
     "n": 837,
     "acc": 57.9,
     "band": "±1%",
     "excludedMid": 139,
     "excludedPct": 14.2
    }
   },
   "buyOutcome": {
    "basis": "call_hit_5d_pm1pct",
    "crashThresholdPct": -5.0,
    "overheatThresholds": {
     "ret5": 10.0,
     "ret20": 25.0,
     "vol20": 4.0
    },
    "currentVersion": {
     "n": 316,
     "graded": 258,
     "acc": 46.9,
     "crashPct": 19.0,
     "meanRet": -0.0,
     "uniqueDecisionDays": 10
    },
    "allTime": {
     "n": 1474,
     "graded": 1257,
     "acc": 40.1,
     "crashPct": 27.5,
     "meanRet": -1.07,
     "uniqueDecisionDays": 43
    },
    "randomBaseline": {
     "n": 22551,
     "acc": 46.4,
     "crashPct": 27.2,
     "meanRet": -0.16,
     "uniqueDecisionDays": 44,
     "note": "판단 종류를 가리지 않고 같은 날 추적 중이던 모든 종목을 같은 규칙으로 채점한 값이다. '아무 종목이나 골랐다면'에 해당한다."
    },
    "cautionMatrix": {
     "none": {
      "n": 677,
      "graded": 541,
      "acc": 44.2,
      "crashPct": 17.9,
      "meanRet": -0.22,
      "uniqueDecisionDays": 43
     },
     "caution": {
      "n": 407,
      "graded": 363,
      "acc": 39.1,
      "crashPct": 30.0,
      "meanRet": -0.76,
      "uniqueDecisionDays": 41
     },
     "strong": {
      "n": 390,
      "graded": 353,
      "acc": 34.8,
      "crashPct": 41.8,
      "meanRet": -2.88,
      "uniqueDecisionDays": 39
     }
    },
    "overheatCurrent": {
     "enoughSample": true,
     "warn": {
      "n": 185,
      "graded": 166,
      "acc": 47.6,
      "crashPct": 24.3,
      "meanRet": 0.13,
      "uniqueDecisionDays": 10
     },
     "calm": {
      "n": 131,
      "graded": 92,
      "acc": 45.7,
      "crashPct": 11.5,
      "meanRet": -0.19,
      "uniqueDecisionDays": 10
     },
     "crashGapPp": 12.9,
     "crashGapCi95": [
      6.8,
      18.2
     ],
     "warnSharePct": 58.5
    },
    "overheatAllTime": {
     "enoughSample": true,
     "warn": {
      "n": 797,
      "graded": 716,
      "acc": 37.0,
      "crashPct": 35.8,
      "meanRet": -1.8,
      "uniqueDecisionDays": 43
     },
     "calm": {
      "n": 677,
      "graded": 541,
      "acc": 44.2,
      "crashPct": 17.9,
      "meanRet": -0.22,
      "uniqueDecisionDays": 43
     },
     "crashGapPp": 17.9,
     "crashGapCi95": [
      13.5,
      22.7
     ],
     "warnSharePct": 54.1
    },
    "worst": [
     {
      "code": "122640",
      "name": "예스티",
      "date": "2026-07-01",
      "ret5": -37.1
     },
     {
      "code": "002990",
      "name": "금호건설",
      "date": "2026-07-09",
      "ret5": -37.0
     },
     {
      "code": "002990",
      "name": "금호건설",
      "date": "2026-07-10",
      "ret5": -35.4
     }
    ],
    "note": "BUY 판단이 5거래일 뒤 어떻게 끝났는지 그대로 센 값이다. 적중률은 ±1% 기준이고, 폭락률은 기준가 대비 5% 넘게 빠진 비율이다."
   },
   "bandNote": "BUY·SELL은 ±1%, HOLD는 ±5% 기준으로 채점한다. 또 BUY·SELL만 ±1% 안쪽이 '애매'로 채점에서 빠진다(HOLD는 빠지는 게 없다). 잣대와 제외율이 모두 다르므로 합친 적중률 하나만 보고 판단하면 안 된다."
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.1179,
    "nova": 0.2788,
    "flow": 0.3162
   },
   "acc": {
    "taro": {
     "n": 397,
     "acc": 43.1,
     "adjustedAcc": 44.7,
     "adjustedAccUsedInWeights": 44.7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 94,
     "acc": 63.8,
     "adjustedAcc": 56.1,
     "adjustedAccUsedInWeights": 56.1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 82,
     "acc": 47.6,
     "adjustedAcc": 49.0,
     "adjustedAccUsedInWeights": 49.0,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 573,
   "globalBlend": 0.583
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3053,
    "diana": 0.1187,
    "nova": 0.2432,
    "flow": 0.3328
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 46.8,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 39,
     "acc": 33.3,
     "adjustedAcc": 45.9,
     "adjustedAccUsedInWeights": 45.9,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 55.1,
     "adjustedAcc": 51.9,
     "adjustedAccUsedInWeights": 51.9,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 296,
   "globalBlend": 0.73
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3045,
    "diana": 0.1182,
    "nova": 0.2468,
    "flow": 0.3305
   },
   "acc": {
    "taro": {
     "n": 206,
     "acc": 47.1,
     "adjustedAcc": 48.2,
     "adjustedAccUsedInWeights": 48.2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 34,
     "acc": 41.2,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 54.4,
     "adjustedAcc": 51.4,
     "adjustedAccUsedInWeights": 51.4,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 297,
   "globalBlend": 0.729
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2973,
    "diana": 0.116,
    "nova": 0.2559,
    "flow": 0.3308
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 42.6,
     "adjustedAcc": 45.8,
     "adjustedAccUsedInWeights": 45.8,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 33,
     "acc": 78.8,
     "adjustedAcc": 56.2,
     "adjustedAccUsedInWeights": 56.2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 31,
     "acc": 67.7,
     "adjustedAcc": 53.6,
     "adjustedAccUsedInWeights": 53.6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3106,
    "diana": 0.1166,
    "nova": 0.2441,
    "flow": 0.3287
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 53.7,
     "adjustedAcc": 52.3,
     "adjustedAccUsedInWeights": 52.3,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 5,
     "acc": 20.0,
     "adjustedAcc": 48.8,
     "adjustedAccUsedInWeights": 48.8,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 57.4,
     "adjustedAcc": 52.1,
     "adjustedAccUsedInWeights": 52.1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 253,
   "globalBlend": 0.76
  },
  "2차전지": {
   "weights": {
    "taro": 0.3167,
    "diana": 0.1157,
    "nova": 0.2484,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 60.5,
     "adjustedAcc": 56.4,
     "adjustedAccUsedInWeights": 56.4,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 34,
     "acc": 61.8,
     "adjustedAcc": 52.6,
     "adjustedAccUsedInWeights": 52.6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 9,
     "acc": 22.2,
     "adjustedAcc": 48.1,
     "adjustedAccUsedInWeights": 48.1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 228,
   "globalBlend": 0.778
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1174,
    "nova": 0.2239,
    "flow": 0.3451
   },
   "acc": {
    "taro": {
     "n": 487,
     "acc": 53.0,
     "adjustedAcc": 52.4,
     "adjustedAccUsedInWeights": 52.4,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 185,
     "acc": 34.6,
     "adjustedAcc": 40.7,
     "adjustedAccUsedInWeights": 40.7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 72,
     "acc": 66.7,
     "adjustedAcc": 56.2,
     "adjustedAccUsedInWeights": 56.2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 744,
   "globalBlend": 0.518
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3209,
    "diana": 0.1178,
    "nova": 0.2358,
    "flow": 0.3255
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 56.8,
     "adjustedAcc": 54.6,
     "adjustedAccUsedInWeights": 54.6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 65,
     "acc": 30.8,
     "adjustedAcc": 43.2,
     "adjustedAccUsedInWeights": 43.2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 23,
     "acc": 52.2,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 347,
   "globalBlend": 0.697
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3141,
    "diana": 0.118,
    "nova": 0.2509,
    "flow": 0.317
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 53.1,
     "adjustedAcc": 52.2,
     "adjustedAccUsedInWeights": 52.2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 13,
     "acc": 46.2,
     "adjustedAcc": 49.6,
     "adjustedAccUsedInWeights": 49.6,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 35,
     "acc": 37.1,
     "adjustedAcc": 47.1,
     "adjustedAccUsedInWeights": 47.1,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 355,
   "globalBlend": 0.693
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3105,
    "diana": 0.1183,
    "nova": 0.2489,
    "flow": 0.3224
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "adjustedAccUsedInWeights": 50.3,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 46,
     "acc": 47.8,
     "adjustedAcc": 49.4,
     "adjustedAccUsedInWeights": 49.4,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 12,
     "acc": 16.7,
     "adjustedAcc": 47.0,
     "adjustedAccUsedInWeights": 47.0,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 244,
   "globalBlend": 0.766
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3232,
    "diana": 0.1166,
    "nova": 0.2388,
    "flow": 0.3213
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 65.5,
     "adjustedAcc": 58.3,
     "adjustedAccUsedInWeights": 58.3,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 46.0,
     "adjustedAccUsedInWeights": 46.0,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 39.4,
     "adjustedAcc": 47.7,
     "adjustedAccUsedInWeights": 47.7,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 213,
   "globalBlend": 0.79
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3133,
    "diana": 0.1154,
    "nova": 0.2431,
    "flow": 0.3282
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 60.9,
     "adjustedAcc": 55.2,
     "adjustedAccUsedInWeights": 55.2,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": null,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 106,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "adjustedAccUsedInWeights": 50.0,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 76.5,
     "adjustedAcc": 53.3,
     "adjustedAccUsedInWeights": 53.3,
     "gatedToPrior": false,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 233,
   "globalBlend": 0.774
  }
 }
};
