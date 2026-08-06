// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-06 16:05",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 795,
    "up": 266,
    "raw": 0.3346,
    "uncalibratedPUp": 0.3339,
    "base": 0.315,
    "pUp": 0.3392
   },
   "20": {
    "n": 533,
    "up": 178,
    "raw": 0.334,
    "uncalibratedPUp": 0.3329,
    "base": 0.315,
    "pUp": 0.3012
   },
   "40": {
    "n": 1015,
    "up": 381,
    "raw": 0.3754,
    "uncalibratedPUp": 0.3736,
    "base": 0.315,
    "pUp": 0.3392
   },
   "30": {
    "n": 1206,
    "up": 345,
    "raw": 0.2861,
    "uncalibratedPUp": 0.2868,
    "base": 0.315,
    "pUp": 0.3012
   },
   "70": {
    "n": 257,
    "up": 81,
    "raw": 0.3152,
    "uncalibratedPUp": 0.3152,
    "base": 0.315,
    "pUp": 0.3392
   },
   "80": {
    "n": 242,
    "up": 67,
    "raw": 0.2769,
    "uncalibratedPUp": 0.2811,
    "base": 0.315,
    "pUp": 0.3392
   },
   "60": {
    "n": 569,
    "up": 193,
    "raw": 0.3392,
    "uncalibratedPUp": 0.338,
    "base": 0.315,
    "pUp": 0.3392
   },
   "10": {
    "n": 1814,
    "up": 520,
    "raw": 0.2867,
    "uncalibratedPUp": 0.2871,
    "base": 0.315,
    "pUp": 0.2876
   },
   "90": {
    "n": 99,
    "up": 26,
    "raw": 0.2626,
    "uncalibratedPUp": 0.2748,
    "base": 0.315,
    "pUp": 0.3392
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.2876
   }
  },
  "diana": {
   "40": {
    "n": 458,
    "up": 98,
    "raw": 0.214,
    "uncalibratedPUp": 0.2194,
    "base": 0.3028,
    "pUp": 0.2438
   },
   "70": {
    "n": 481,
    "up": 152,
    "raw": 0.316,
    "uncalibratedPUp": 0.3152,
    "base": 0.3028,
    "pUp": 0.3155
   },
   "50": {
    "n": 602,
    "up": 154,
    "raw": 0.2558,
    "uncalibratedPUp": 0.258,
    "base": 0.3028,
    "pUp": 0.258
   },
   "80": {
    "n": 539,
    "up": 237,
    "raw": 0.4397,
    "uncalibratedPUp": 0.4325,
    "base": 0.3028,
    "pUp": 0.4008
   },
   "30": {
    "n": 325,
    "up": 84,
    "raw": 0.2585,
    "uncalibratedPUp": 0.2622,
    "base": 0.3028,
    "pUp": 0.2438
   },
   "90": {
    "n": 120,
    "up": 33,
    "raw": 0.275,
    "uncalibratedPUp": 0.2806,
    "base": 0.3028,
    "pUp": 0.4008
   },
   "60": {
    "n": 477,
    "up": 151,
    "raw": 0.3166,
    "uncalibratedPUp": 0.3157,
    "base": 0.3028,
    "pUp": 0.3155
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3028,
    "base": 0.3028,
    "pUp": 0.2438
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3028,
    "base": 0.3028,
    "pUp": 0.2438
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3028,
    "base": 0.3028,
    "pUp": 0.2438
   }
  },
  "nova": {
   "50": {
    "n": 1283,
    "up": 372,
    "raw": 0.2899,
    "uncalibratedPUp": 0.2905,
    "base": 0.315,
    "pUp": 0.315
   },
   "40": {
    "n": 2577,
    "up": 864,
    "raw": 0.3353,
    "uncalibratedPUp": 0.335,
    "base": 0.315,
    "pUp": 0.315
   },
   "30": {
    "n": 2018,
    "up": 599,
    "raw": 0.2968,
    "uncalibratedPUp": 0.2971,
    "base": 0.315,
    "pUp": 0.315
   },
   "70": {
    "n": 50,
    "up": 6,
    "raw": 0.12,
    "uncalibratedPUp": 0.1931,
    "base": 0.315,
    "pUp": 0.315
   },
   "60": {
    "n": 334,
    "up": 85,
    "raw": 0.2545,
    "uncalibratedPUp": 0.2595,
    "base": 0.315,
    "pUp": 0.315
   },
   "20": {
    "n": 264,
    "up": 131,
    "raw": 0.4962,
    "uncalibratedPUp": 0.4777,
    "base": 0.315,
    "pUp": 0.315
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3048,
    "base": 0.315,
    "pUp": 0.315
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2864,
    "base": 0.315,
    "pUp": 0.315
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.315
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.315
   }
  },
  "flow": {
   "50": {
    "n": 4021,
    "up": 1289,
    "raw": 0.3206,
    "uncalibratedPUp": 0.3205,
    "base": 0.315,
    "pUp": 0.3205
   },
   "70": {
    "n": 78,
    "up": 41,
    "raw": 0.5256,
    "uncalibratedPUp": 0.4671,
    "base": 0.315,
    "pUp": 0.4128
   },
   "40": {
    "n": 1854,
    "up": 535,
    "raw": 0.2886,
    "uncalibratedPUp": 0.289,
    "base": 0.315,
    "pUp": 0.2903
   },
   "30": {
    "n": 244,
    "up": 72,
    "raw": 0.2951,
    "uncalibratedPUp": 0.2973,
    "base": 0.315,
    "pUp": 0.2903
   },
   "60": {
    "n": 293,
    "up": 110,
    "raw": 0.3754,
    "uncalibratedPUp": 0.3698,
    "base": 0.315,
    "pUp": 0.3698
   },
   "20": {
    "n": 40,
    "up": 10,
    "raw": 0.25,
    "uncalibratedPUp": 0.2779,
    "base": 0.315,
    "pUp": 0.2903
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.2903
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.2903
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.4128
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.4128
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 1394,
   "errorCorr": -0.066
  },
  "taro:nova": {
   "n": 3024,
   "errorCorr": 0.902
  },
  "taro:flow": {
   "n": 762,
   "errorCorr": 0.178
  },
  "diana:nova": {
   "n": 941,
   "errorCorr": -0.081
  },
  "diana:flow": {
   "n": 232,
   "errorCorr": 0.107
  },
  "nova:flow": {
   "n": 534,
   "errorCorr": 0.136
  }
 },
 "redundancyFactor": {
  "taro": 0.9532,
  "diana": 1,
  "nova": 0.9549,
  "flow": 0.9983
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.3078,
    "diana": 0.0654,
    "nova": 0.3286,
    "flow": 0.2981
   },
   "acc": {
    "taro": {
     "n": 403,
     "adjustedAcc": 63.1
    },
    "diana": {
     "n": 334,
     "adjustedAcc": 39.8
    },
    "nova": {
     "n": 192,
     "adjustedAcc": 52.4
    },
    "flow": {
     "n": 67,
     "adjustedAcc": 60.6
    }
   }
  },
  "side_high": {
   "n": 2273,
   "blend": 0.6,
   "weights": {
    "taro": 0.2948,
    "diana": 0.0644,
    "nova": 0.3581,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 1094,
     "adjustedAcc": 61.3
    },
    "diana": {
     "n": 302,
     "adjustedAcc": 42.0
    },
    "nova": {
     "n": 684,
     "adjustedAcc": 62.1
    },
    "flow": {
     "n": 193,
     "adjustedAcc": 58.1
    }
   }
  },
  "up_low": {
   "n": 926,
   "blend": 0.537,
   "weights": {
    "taro": 0.307,
    "diana": 0.0621,
    "nova": 0.3675,
    "flow": 0.2634
   },
   "acc": {
    "taro": {
     "n": 347,
     "adjustedAcc": 67.8
    },
    "diana": {
     "n": 308,
     "adjustedAcc": 37.8
    },
    "nova": {
     "n": 210,
     "adjustedAcc": 67.4
    },
    "flow": {
     "n": 61,
     "adjustedAcc": 53.7
    }
   }
  },
  "down_high": {
   "n": 5958,
   "blend": 0.6,
   "weights": {
    "taro": 0.3001,
    "diana": 0.0682,
    "nova": 0.3641,
    "flow": 0.2676
   },
   "acc": {
    "taro": {
     "n": 2638,
     "adjustedAcc": 60.5
    },
    "diana": {
     "n": 853,
     "adjustedAcc": 45.2
    },
    "nova": {
     "n": 1990,
     "adjustedAcc": 61.3
    },
    "flow": {
     "n": 477,
     "adjustedAcc": 51.2
    }
   }
  }
 },
 "currentRegime": {
  "key": "up_high",
  "trend": "up",
  "vol": "high",
  "median5": 15.6,
  "medianAbs1": 2.13
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2000,
  "errors": 1297,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1145
   },
   {
    "label": "고변동성 국면",
    "count": 1126
   },
   {
    "label": "분석가 의견충돌",
    "count": 1033
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 99
   }
  ],
  "analystErrors": {
   "taro": 1018,
   "diana": 0,
   "nova": 213,
   "flow": 119
  },
  "regimeErrors": {
   "down_high": 1126,
   "up_low": 171
  }
 },
 "shadow": {
  "n": 2000,
  "baselineActionN": 678,
  "baselineActionPrecision": 29.1,
  "candidateActionN": 1844,
  "candidateActionPrecision": 26.0,
  "candidateCoverage": 92.2,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 1,
   "SELL": 1999
  },
  "testDays": 4,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 24.0,
  "brier": 0.3667,
  "rawBrier": 0.2562
 },
 "prospective": {
  "n": 0,
  "baselineActionN": 0,
  "baselineActionPrecision": null,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 0
  },
  "testDays": 0,
  "testRegimes": 0,
  "brier": null,
  "rawBrier": null
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
   "실제 그림자 누적 표본 500건 미만",
   "실제 그림자 BUY·SELL 표본 100건 미만",
   "실제 그림자 행동 정밀도 개선폭 1.5%p 미만",
   "실제 그림자 확률오차(Brier) 개선폭 0.005 미만",
   "실제 그림자 BUY·SELL 커버리지 15% 미만",
   "실제 그림자 검증일 40거래일 미만",
   "실제 그림자 시장국면 3개 미만",
   "BUY·SELL 양방향 검증 표본 각각 50건 미만"
  ],
  "minimums": {
   "n": 500,
   "actionN": 100,
   "precisionGainPp": 1.5,
   "brierGain": 0.005,
   "coveragePct": 15,
   "testDays": 40,
   "testRegimes": 3,
   "buyN": 50,
   "sellN": 50,
   "maxDirectionSharePct": 80
  }
 }
};
