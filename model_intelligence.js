// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-04 14:19",
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
    "up": 36,
    "raw": 0.1184,
    "uncalibratedPUp": 0.1272,
    "base": 0.2159,
    "pUp": 0.1424
   },
   "70": {
    "n": 320,
    "up": 74,
    "raw": 0.2313,
    "uncalibratedPUp": 0.2299,
    "base": 0.2159,
    "pUp": 0.2299
   },
   "50": {
    "n": 400,
    "up": 71,
    "raw": 0.1775,
    "uncalibratedPUp": 0.1802,
    "base": 0.2159,
    "pUp": 0.1802
   },
   "80": {
    "n": 360,
    "up": 134,
    "raw": 0.3722,
    "uncalibratedPUp": 0.3602,
    "base": 0.2159,
    "pUp": 0.3319
   },
   "30": {
    "n": 216,
    "up": 27,
    "raw": 0.125,
    "uncalibratedPUp": 0.1361,
    "base": 0.2159,
    "pUp": 0.1424
   },
   "90": {
    "n": 80,
    "up": 19,
    "raw": 0.2375,
    "uncalibratedPUp": 0.2316,
    "base": 0.2159,
    "pUp": 0.3319
   },
   "60": {
    "n": 316,
    "up": 70,
    "raw": 0.2215,
    "uncalibratedPUp": 0.221,
    "base": 0.2159,
    "pUp": 0.221
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2159,
    "base": 0.2159,
    "pUp": 0.1424
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2159,
    "base": 0.2159,
    "pUp": 0.1424
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2159,
    "base": 0.2159,
    "pUp": 0.1424
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
   "n": 948,
   "errorCorr": -0.069
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
   "n": 573,
   "errorCorr": -0.032
  },
  "diana:flow": {
   "n": 151,
   "errorCorr": 0.183
  },
  "nova:flow": {
   "n": 489,
   "errorCorr": 0.121
  }
 },
 "redundancyFactor": {
  "taro": 0.9539,
  "diana": 0.998,
  "nova": 0.9553,
  "flow": 0.9967
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.3539,
    "diana": 0.0558,
    "nova": 0.3095,
    "flow": 0.2807
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
    "taro": 0.3449,
    "diana": 0.0591,
    "nova": 0.3138,
    "flow": 0.2821
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
   "n": 3254,
   "blend": 0.6,
   "weights": {
    "taro": 0.3464,
    "diana": 0.0594,
    "nova": 0.3292,
    "flow": 0.265
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 288,
     "adjustedAcc": 40.8
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
    "taro": 0.3458,
    "diana": 0.0674,
    "nova": 0.3161,
    "flow": 0.2707
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
    "taro": 0.3313,
    "diana": 0.0677,
    "nova": 0.3221,
    "flow": 0.2789
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
  "median5": 5.02,
  "medianAbs1": 2.8
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 1500,
  "errors": 604,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 526
   },
   {
    "label": "분석가 의견충돌",
    "count": 457
   },
   {
    "label": "고변동성 국면",
    "count": 434
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 55
   }
  ],
  "analystErrors": {
   "taro": 369,
   "diana": 0,
   "nova": 176,
   "flow": 69
  },
  "regimeErrors": {
   "down_high": 289,
   "up_low": 170,
   "side_high": 145
  }
 },
 "shadow": {
  "n": 1500,
  "baselineActionN": 523,
  "baselineActionPrecision": 62.3,
  "candidateActionN": 1322,
  "candidateActionPrecision": 60.9,
  "candidateCoverage": 88.1,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 2,
   "SELL": 1498
  },
  "testDays": 3,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 53.7,
  "brier": 0.2482,
  "rawBrier": 0.2419
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
