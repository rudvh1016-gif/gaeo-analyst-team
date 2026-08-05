// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-05 09:42",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 751,
    "up": 246,
    "raw": 0.3276,
    "uncalibratedPUp": 0.3267,
    "base": 0.3049,
    "pUp": 0.325
   },
   "20": {
    "n": 488,
    "up": 159,
    "raw": 0.3258,
    "uncalibratedPUp": 0.3246,
    "base": 0.3049,
    "pUp": 0.2884
   },
   "40": {
    "n": 921,
    "up": 321,
    "raw": 0.3485,
    "uncalibratedPUp": 0.3472,
    "base": 0.3049,
    "pUp": 0.325
   },
   "30": {
    "n": 1093,
    "up": 296,
    "raw": 0.2708,
    "uncalibratedPUp": 0.2717,
    "base": 0.3049,
    "pUp": 0.2884
   },
   "70": {
    "n": 247,
    "up": 76,
    "raw": 0.3077,
    "uncalibratedPUp": 0.3074,
    "base": 0.3049,
    "pUp": 0.325
   },
   "80": {
    "n": 227,
    "up": 62,
    "raw": 0.2731,
    "uncalibratedPUp": 0.2768,
    "base": 0.3049,
    "pUp": 0.325
   },
   "60": {
    "n": 529,
    "up": 175,
    "raw": 0.3308,
    "uncalibratedPUp": 0.3294,
    "base": 0.3049,
    "pUp": 0.325
   },
   "10": {
    "n": 1680,
    "up": 480,
    "raw": 0.2857,
    "uncalibratedPUp": 0.2861,
    "base": 0.3049,
    "pUp": 0.2864
   },
   "90": {
    "n": 95,
    "up": 24,
    "raw": 0.2526,
    "uncalibratedPUp": 0.2652,
    "base": 0.3049,
    "pUp": 0.325
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2864
   }
  },
  "diana": {
   "40": {
    "n": 380,
    "up": 63,
    "raw": 0.1658,
    "uncalibratedPUp": 0.1719,
    "base": 0.2489,
    "pUp": 0.1842
   },
   "70": {
    "n": 400,
    "up": 101,
    "raw": 0.2525,
    "uncalibratedPUp": 0.2522,
    "base": 0.2489,
    "pUp": 0.2522
   },
   "50": {
    "n": 500,
    "up": 106,
    "raw": 0.212,
    "uncalibratedPUp": 0.2141,
    "base": 0.2489,
    "pUp": 0.2141
   },
   "80": {
    "n": 450,
    "up": 181,
    "raw": 0.4022,
    "uncalibratedPUp": 0.3926,
    "base": 0.2489,
    "pUp": 0.3622
   },
   "30": {
    "n": 270,
    "up": 47,
    "raw": 0.1741,
    "uncalibratedPUp": 0.1816,
    "base": 0.2489,
    "pUp": 0.1842
   },
   "90": {
    "n": 100,
    "up": 25,
    "raw": 0.25,
    "uncalibratedPUp": 0.2497,
    "base": 0.2489,
    "pUp": 0.3622
   },
   "60": {
    "n": 395,
    "up": 98,
    "raw": 0.2481,
    "uncalibratedPUp": 0.2482,
    "base": 0.2489,
    "pUp": 0.2482
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2489,
    "base": 0.2489,
    "pUp": 0.1842
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2489,
    "base": 0.2489,
    "pUp": 0.1842
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2489,
    "base": 0.2489,
    "pUp": 0.1842
   }
  },
  "nova": {
   "50": {
    "n": 1228,
    "up": 347,
    "raw": 0.2826,
    "uncalibratedPUp": 0.2831,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "40": {
    "n": 2380,
    "up": 750,
    "raw": 0.3151,
    "uncalibratedPUp": 0.315,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "30": {
    "n": 1800,
    "up": 531,
    "raw": 0.295,
    "uncalibratedPUp": 0.2952,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "70": {
    "n": 49,
    "up": 5,
    "raw": 0.102,
    "uncalibratedPUp": 0.1791,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "60": {
    "n": 326,
    "up": 82,
    "raw": 0.2515,
    "uncalibratedPUp": 0.256,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "20": {
    "n": 244,
    "up": 124,
    "raw": 0.5082,
    "uncalibratedPUp": 0.4859,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2951,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2772,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3049
   }
  },
  "flow": {
   "50": {
    "n": 3716,
    "up": 1145,
    "raw": 0.3081,
    "uncalibratedPUp": 0.3081,
    "base": 0.3049,
    "pUp": 0.3081
   },
   "70": {
    "n": 72,
    "up": 37,
    "raw": 0.5139,
    "uncalibratedPUp": 0.4524,
    "base": 0.3049,
    "pUp": 0.3978
   },
   "40": {
    "n": 1712,
    "up": 478,
    "raw": 0.2792,
    "uncalibratedPUp": 0.2796,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "30": {
    "n": 223,
    "up": 68,
    "raw": 0.3049,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "60": {
    "n": 271,
    "up": 102,
    "raw": 0.3764,
    "uncalibratedPUp": 0.3693,
    "base": 0.3049,
    "pUp": 0.3693
   },
   "20": {
    "n": 37,
    "up": 9,
    "raw": 0.2432,
    "uncalibratedPUp": 0.2709,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3978
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3978
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 1163,
   "errorCorr": -0.058
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
   "n": 743,
   "errorCorr": -0.044
  },
  "diana:flow": {
   "n": 193,
   "errorCorr": 0.132
  },
  "nova:flow": {
   "n": 489,
   "errorCorr": 0.121
  }
 },
 "redundancyFactor": {
  "taro": 0.954,
  "diana": 1,
  "nova": 0.9553,
  "flow": 0.9986
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.3297,
    "diana": 0.057,
    "nova": 0.3305,
    "flow": 0.2828
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
    "taro": 0.3213,
    "diana": 0.0603,
    "nova": 0.3347,
    "flow": 0.2838
   },
   "acc": {
    "taro": {
     "n": 734,
     "adjustedAcc": 62.8
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
   "n": 3510,
   "blend": 0.6,
   "weights": {
    "taro": 0.3219,
    "diana": 0.0609,
    "nova": 0.3508,
    "flow": 0.2664
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 544,
     "adjustedAcc": 41.4
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
    "taro": 0.3217,
    "diana": 0.0688,
    "nova": 0.3372,
    "flow": 0.2724
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
    "taro": 0.3079,
    "diana": 0.0688,
    "nova": 0.3435,
    "flow": 0.2798
   },
   "acc": {
    "taro": {
     "n": 360,
     "adjustedAcc": 56.7
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 290,
     "adjustedAcc": 61.4
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
  "median5": 15.58,
  "medianAbs1": 2.44
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2000,
  "errors": 1033,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 898
   },
   {
    "label": "고변동성 국면",
    "count": 862
   },
   {
    "label": "분석가 의견충돌",
    "count": 808
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 85
   }
  ],
  "analystErrors": {
   "taro": 737,
   "diana": 0,
   "nova": 228,
   "flow": 104
  },
  "regimeErrors": {
   "down_high": 716,
   "up_low": 171,
   "side_high": 146
  }
 },
 "shadow": {
  "n": 2000,
  "baselineActionN": 712,
  "baselineActionPrecision": 48.2,
  "candidateActionN": 1811,
  "candidateActionPrecision": 44.7,
  "candidateCoverage": 90.5,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 2,
   "SELL": 1998
  },
  "testDays": 4,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 40.5,
  "brier": 0.3091,
  "rawBrier": 0.2484
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
