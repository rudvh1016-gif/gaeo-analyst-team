// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-04 10:14",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 751,
    "up": 246,
    "raw": 0.3276,
    "uncalibratedPUp": 0.3267,
    "base": 0.3053,
    "pUp": 0.3251
   },
   "20": {
    "n": 488,
    "up": 159,
    "raw": 0.3258,
    "uncalibratedPUp": 0.3246,
    "base": 0.3053,
    "pUp": 0.2884
   },
   "40": {
    "n": 921,
    "up": 321,
    "raw": 0.3485,
    "uncalibratedPUp": 0.3472,
    "base": 0.3053,
    "pUp": 0.3251
   },
   "30": {
    "n": 1093,
    "up": 296,
    "raw": 0.2708,
    "uncalibratedPUp": 0.2717,
    "base": 0.3053,
    "pUp": 0.2884
   },
   "70": {
    "n": 247,
    "up": 76,
    "raw": 0.3077,
    "uncalibratedPUp": 0.3074,
    "base": 0.3053,
    "pUp": 0.3251
   },
   "80": {
    "n": 227,
    "up": 62,
    "raw": 0.2731,
    "uncalibratedPUp": 0.2769,
    "base": 0.3053,
    "pUp": 0.3251
   },
   "60": {
    "n": 529,
    "up": 175,
    "raw": 0.3308,
    "uncalibratedPUp": 0.3294,
    "base": 0.3053,
    "pUp": 0.3251
   },
   "10": {
    "n": 1680,
    "up": 482,
    "raw": 0.2869,
    "uncalibratedPUp": 0.2872,
    "base": 0.3053,
    "pUp": 0.2875
   },
   "90": {
    "n": 95,
    "up": 24,
    "raw": 0.2526,
    "uncalibratedPUp": 0.2653,
    "base": 0.3053,
    "pUp": 0.3251
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.2875
   }
  },
  "diana": {
   "40": {
    "n": 304,
    "up": 34,
    "raw": 0.1118,
    "uncalibratedPUp": 0.1205,
    "base": 0.2084,
    "pUp": 0.1362
   },
   "70": {
    "n": 320,
    "up": 73,
    "raw": 0.2281,
    "uncalibratedPUp": 0.2264,
    "base": 0.2084,
    "pUp": 0.2264
   },
   "50": {
    "n": 400,
    "up": 70,
    "raw": 0.175,
    "uncalibratedPUp": 0.1773,
    "base": 0.2084,
    "pUp": 0.1773
   },
   "80": {
    "n": 360,
    "up": 127,
    "raw": 0.3528,
    "uncalibratedPUp": 0.3417,
    "base": 0.2084,
    "pUp": 0.315
   },
   "30": {
    "n": 216,
    "up": 26,
    "raw": 0.1204,
    "uncalibratedPUp": 0.1311,
    "base": 0.2084,
    "pUp": 0.1362
   },
   "90": {
    "n": 80,
    "up": 18,
    "raw": 0.225,
    "uncalibratedPUp": 0.2205,
    "base": 0.2084,
    "pUp": 0.315
   },
   "60": {
    "n": 316,
    "up": 68,
    "raw": 0.2152,
    "uncalibratedPUp": 0.2146,
    "base": 0.2084,
    "pUp": 0.2146
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2084,
    "base": 0.2084,
    "pUp": 0.1362
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2084,
    "base": 0.2084,
    "pUp": 0.1362
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2084,
    "base": 0.2084,
    "pUp": 0.1362
   }
  },
  "nova": {
   "50": {
    "n": 1228,
    "up": 347,
    "raw": 0.2826,
    "uncalibratedPUp": 0.2831,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "40": {
    "n": 2380,
    "up": 751,
    "raw": 0.3155,
    "uncalibratedPUp": 0.3154,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "30": {
    "n": 1800,
    "up": 532,
    "raw": 0.2956,
    "uncalibratedPUp": 0.2957,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "70": {
    "n": 49,
    "up": 5,
    "raw": 0.102,
    "uncalibratedPUp": 0.1792,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "60": {
    "n": 326,
    "up": 82,
    "raw": 0.2515,
    "uncalibratedPUp": 0.2561,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "20": {
    "n": 244,
    "up": 124,
    "raw": 0.5082,
    "uncalibratedPUp": 0.486,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2954,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2775,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.3053
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.3053
   }
  },
  "flow": {
   "50": {
    "n": 3716,
    "up": 1145,
    "raw": 0.3081,
    "uncalibratedPUp": 0.3081,
    "base": 0.3053,
    "pUp": 0.3081
   },
   "70": {
    "n": 72,
    "up": 37,
    "raw": 0.5139,
    "uncalibratedPUp": 0.4525,
    "base": 0.3053,
    "pUp": 0.398
   },
   "40": {
    "n": 1712,
    "up": 480,
    "raw": 0.2804,
    "uncalibratedPUp": 0.2808,
    "base": 0.3053,
    "pUp": 0.2841
   },
   "30": {
    "n": 223,
    "up": 68,
    "raw": 0.3049,
    "uncalibratedPUp": 0.305,
    "base": 0.3053,
    "pUp": 0.2841
   },
   "60": {
    "n": 271,
    "up": 102,
    "raw": 0.3764,
    "uncalibratedPUp": 0.3693,
    "base": 0.3053,
    "pUp": 0.3693
   },
   "20": {
    "n": 37,
    "up": 9,
    "raw": 0.2432,
    "uncalibratedPUp": 0.271,
    "base": 0.3053,
    "pUp": 0.2841
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.2841
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.2841
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.398
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3053,
    "base": 0.3053,
    "pUp": 0.398
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 951,
   "errorCorr": -0.07
  },
  "taro:nova": {
   "n": 2750,
   "errorCorr": 0.895
  },
  "taro:flow": {
   "n": 703,
   "errorCorr": 0.173
  },
  "diana:nova": {
   "n": 572,
   "errorCorr": -0.037
  },
  "diana:flow": {
   "n": 152,
   "errorCorr": 0.175
  },
  "nova:flow": {
   "n": 489,
   "errorCorr": 0.121
  }
 },
 "redundancyFactor": {
  "taro": 0.9539,
  "diana": 0.9985,
  "nova": 0.9553,
  "flow": 0.9972
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.3563,
    "diana": 0.0547,
    "nova": 0.3075,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 750,
     "adjustedAcc": 66.4
    },
    "diana": {
     "n": 642,
     "adjustedAcc": 37.9
    },
    "nova": {
     "n": 402,
     "adjustedAcc": 61.5
    },
    "flow": {
     "n": 128,
     "adjustedAcc": 59.6
    }
   }
  },
  "side_high": {
   "n": 1555,
   "blend": 0.6,
   "weights": {
    "taro": 0.3473,
    "diana": 0.0579,
    "nova": 0.3119,
    "flow": 0.2829
   },
   "acc": {
    "taro": {
     "n": 734,
     "adjustedAcc": 62.7
    },
    "diana": {
     "n": 302,
     "adjustedAcc": 42.0
    },
    "nova": {
     "n": 394,
     "adjustedAcc": 61.0
    },
    "flow": {
     "n": 125,
     "adjustedAcc": 58.4
    }
   }
  },
  "down_low": {
   "n": 3257,
   "blend": 0.6,
   "weights": {
    "taro": 0.3494,
    "diana": 0.0565,
    "nova": 0.3278,
    "flow": 0.2663
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 291,
     "adjustedAcc": 37.9
    },
    "nova": {
     "n": 1203,
     "adjustedAcc": 63.3
    },
    "flow": {
     "n": 267,
     "adjustedAcc": 51.4
    }
   }
  },
  "down_high": {
   "n": 2139,
   "blend": 0.6,
   "weights": {
    "taro": 0.3483,
    "diana": 0.066,
    "nova": 0.3142,
    "flow": 0.2715
   },
   "acc": {
    "taro": {
     "n": 1142,
     "adjustedAcc": 58.8
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 787,
     "adjustedAcc": 57.5
    },
    "flow": {
     "n": 210,
     "adjustedAcc": 50.7
    }
   }
  },
  "side_low": {
   "n": 718,
   "blend": 0.473,
   "weights": {
    "taro": 0.3337,
    "diana": 0.0663,
    "nova": 0.3202,
    "flow": 0.2798
   },
   "acc": {
    "taro": {
     "n": 360,
     "adjustedAcc": 56.4
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 290,
     "adjustedAcc": 61.1
    },
    "flow": {
     "n": 68,
     "adjustedAcc": 53.9
    }
   }
  }
 },
 "currentRegime": {
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 3.71,
  "medianAbs1": 1.88
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 1500,
  "errors": 567,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 491
   },
   {
    "label": "분석가 의견충돌",
    "count": 426
   },
   {
    "label": "고변동성 국면",
    "count": 397
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 52
   }
  ],
  "analystErrors": {
   "taro": 334,
   "diana": 0,
   "nova": 176,
   "flow": 67
  },
  "regimeErrors": {
   "down_high": 252,
   "up_low": 170,
   "side_high": 145
  }
 },
 "shadow": {
  "n": 1500,
  "baselineActionN": 512,
  "baselineActionPrecision": 63.7,
  "candidateActionN": 1322,
  "candidateActionPrecision": 62.6,
  "candidateCoverage": 88.1,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 2,
   "SELL": 1498
  },
  "testDays": 3,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 55.2,
  "brier": 0.2423,
  "rawBrier": 0.241
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
