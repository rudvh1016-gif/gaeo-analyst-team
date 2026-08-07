// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-07 12:56",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 823,
    "up": 287,
    "raw": 0.3487,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.361
   },
   "20": {
    "n": 590,
    "up": 220,
    "raw": 0.3729,
    "uncalibratedPUp": 0.3717,
    "base": 0.3487,
    "pUp": 0.3433
   },
   "40": {
    "n": 1089,
    "up": 447,
    "raw": 0.4105,
    "uncalibratedPUp": 0.4088,
    "base": 0.3487,
    "pUp": 0.361
   },
   "30": {
    "n": 1310,
    "up": 432,
    "raw": 0.3298,
    "uncalibratedPUp": 0.3302,
    "base": 0.3487,
    "pUp": 0.3433
   },
   "70": {
    "n": 267,
    "up": 87,
    "raw": 0.3258,
    "uncalibratedPUp": 0.3282,
    "base": 0.3487,
    "pUp": 0.361
   },
   "80": {
    "n": 251,
    "up": 72,
    "raw": 0.2869,
    "uncalibratedPUp": 0.2935,
    "base": 0.3487,
    "pUp": 0.361
   },
   "60": {
    "n": 600,
    "up": 213,
    "raw": 0.355,
    "uncalibratedPUp": 0.3547,
    "base": 0.3487,
    "pUp": 0.361
   },
   "10": {
    "n": 1997,
    "up": 666,
    "raw": 0.3335,
    "uncalibratedPUp": 0.3337,
    "base": 0.3487,
    "pUp": 0.3339
   },
   "90": {
    "n": 102,
    "up": 27,
    "raw": 0.2647,
    "uncalibratedPUp": 0.2838,
    "base": 0.3487,
    "pUp": 0.361
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.3339
   }
  },
  "diana": {
   "40": {
    "n": 535,
    "up": 136,
    "raw": 0.2542,
    "uncalibratedPUp": 0.2589,
    "base": 0.3425,
    "pUp": 0.2832
   },
   "70": {
    "n": 564,
    "up": 206,
    "raw": 0.3652,
    "uncalibratedPUp": 0.3641,
    "base": 0.3425,
    "pUp": 0.3641
   },
   "50": {
    "n": 701,
    "up": 205,
    "raw": 0.2924,
    "uncalibratedPUp": 0.2945,
    "base": 0.3425,
    "pUp": 0.2945
   },
   "80": {
    "n": 627,
    "up": 300,
    "raw": 0.4785,
    "uncalibratedPUp": 0.4723,
    "base": 0.3425,
    "pUp": 0.4372
   },
   "30": {
    "n": 379,
    "up": 114,
    "raw": 0.3008,
    "uncalibratedPUp": 0.3038,
    "base": 0.3425,
    "pUp": 0.2832
   },
   "90": {
    "n": 140,
    "up": 41,
    "raw": 0.2929,
    "uncalibratedPUp": 0.3016,
    "base": 0.3425,
    "pUp": 0.4372
   },
   "60": {
    "n": 564,
    "up": 200,
    "raw": 0.3546,
    "uncalibratedPUp": 0.354,
    "base": 0.3425,
    "pUp": 0.354
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3425,
    "base": 0.3425,
    "pUp": 0.2832
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3425,
    "base": 0.3425,
    "pUp": 0.2832
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3425,
    "base": 0.3425,
    "pUp": 0.2832
   }
  },
  "nova": {
   "50": {
    "n": 1307,
    "up": 388,
    "raw": 0.2969,
    "uncalibratedPUp": 0.298,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "40": {
    "n": 2706,
    "up": 957,
    "raw": 0.3537,
    "uncalibratedPUp": 0.3536,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "30": {
    "n": 2306,
    "up": 842,
    "raw": 0.3651,
    "uncalibratedPUp": 0.3649,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "70": {
    "n": 51,
    "up": 7,
    "raw": 0.1373,
    "uncalibratedPUp": 0.2156,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "60": {
    "n": 340,
    "up": 88,
    "raw": 0.2588,
    "uncalibratedPUp": 0.2661,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "20": {
    "n": 315,
    "up": 169,
    "raw": 0.5365,
    "uncalibratedPUp": 0.5202,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3374,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.317,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.3487
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.3487
   }
  },
  "flow": {
   "50": {
    "n": 4310,
    "up": 1534,
    "raw": 0.3559,
    "uncalibratedPUp": 0.3559,
    "base": 0.3487,
    "pUp": 0.3559
   },
   "70": {
    "n": 82,
    "up": 44,
    "raw": 0.5366,
    "uncalibratedPUp": 0.4863,
    "base": 0.3487,
    "pUp": 0.4383
   },
   "40": {
    "n": 2026,
    "up": 665,
    "raw": 0.3282,
    "uncalibratedPUp": 0.3285,
    "base": 0.3487,
    "pUp": 0.3285
   },
   "30": {
    "n": 267,
    "up": 81,
    "raw": 0.3034,
    "uncalibratedPUp": 0.3079,
    "base": 0.3487,
    "pUp": 0.3127
   },
   "60": {
    "n": 303,
    "up": 116,
    "raw": 0.3828,
    "uncalibratedPUp": 0.3798,
    "base": 0.3487,
    "pUp": 0.3798
   },
   "20": {
    "n": 41,
    "up": 11,
    "raw": 0.2683,
    "uncalibratedPUp": 0.3023,
    "base": 0.3487,
    "pUp": 0.3127
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.3127
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.3127
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.4383
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3487,
    "base": 0.3487,
    "pUp": 0.4383
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 1613,
   "errorCorr": -0.105
  },
  "taro:nova": {
   "n": 3379,
   "errorCorr": 0.914
  },
  "taro:flow": {
   "n": 812,
   "errorCorr": 0.195
  },
  "diana:nova": {
   "n": 1130,
   "errorCorr": -0.143
  },
  "diana:flow": {
   "n": 278,
   "errorCorr": 0.113
  },
  "nova:flow": {
   "n": 580,
   "errorCorr": 0.162
  }
 },
 "redundancyFactor": {
  "taro": 0.9515,
  "diana": 1,
  "nova": 0.9535,
  "flow": 0.9966
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2979,
    "diana": 0.0706,
    "nova": 0.3327,
    "flow": 0.2989
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
    "taro": 0.285,
    "diana": 0.0694,
    "nova": 0.3624,
    "flow": 0.2832
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
    "taro": 0.2971,
    "diana": 0.0669,
    "nova": 0.3721,
    "flow": 0.264
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
   "n": 7111,
   "blend": 0.6,
   "weights": {
    "taro": 0.2857,
    "diana": 0.0798,
    "nova": 0.353,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 1152,
     "adjustedAcc": 49.0
    },
    "nova": {
     "n": 2384,
     "adjustedAcc": 54.2
    },
    "flow": {
     "n": 532,
     "adjustedAcc": 51.9
    }
   }
  }
 },
 "currentRegime": {
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 5.91,
  "medianAbs1": 1.91
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2000,
  "errors": 1438,
  "patterns": [
   {
    "label": "고변동성 국면",
    "count": 1438
   },
   {
    "label": "경계점수 판단",
    "count": 1270
   },
   {
    "label": "분석가 의견충돌",
    "count": 1117
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 101
   }
  ],
  "analystErrors": {
   "taro": 1178,
   "diana": 0,
   "nova": 211,
   "flow": 128
  },
  "regimeErrors": {
   "down_high": 1438
  }
 },
 "shadow": {
  "n": 2000,
  "baselineActionN": 674,
  "baselineActionPrecision": 15.7,
  "candidateActionN": 1852,
  "candidateActionPrecision": 8.2,
  "candidateCoverage": 92.6,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 8,
   "SELL": 1992
  },
  "testDays": 4,
  "testRegimes": 1,
  "candidateAllCallAccuracy": 7.8,
  "brier": 0.3909,
  "rawBrier": 0.2583
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
