// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-13 09:12",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 952,
    "up": 325,
    "raw": 0.3414,
    "uncalibratedPUp": 0.3412,
    "base": 0.3357,
    "pUp": 0.3544
   },
   "20": {
    "n": 700,
    "up": 250,
    "raw": 0.3571,
    "uncalibratedPUp": 0.3563,
    "base": 0.3357,
    "pUp": 0.3233
   },
   "40": {
    "n": 1304,
    "up": 509,
    "raw": 0.3903,
    "uncalibratedPUp": 0.3891,
    "base": 0.3357,
    "pUp": 0.3544
   },
   "30": {
    "n": 1545,
    "up": 475,
    "raw": 0.3074,
    "uncalibratedPUp": 0.308,
    "base": 0.3357,
    "pUp": 0.3233
   },
   "70": {
    "n": 303,
    "up": 105,
    "raw": 0.3465,
    "uncalibratedPUp": 0.3456,
    "base": 0.3357,
    "pUp": 0.3544
   },
   "80": {
    "n": 272,
    "up": 77,
    "raw": 0.2831,
    "uncalibratedPUp": 0.2883,
    "base": 0.3357,
    "pUp": 0.3544
   },
   "60": {
    "n": 686,
    "up": 245,
    "raw": 0.3571,
    "uncalibratedPUp": 0.3562,
    "base": 0.3357,
    "pUp": 0.3544
   },
   "10": {
    "n": 2171,
    "up": 686,
    "raw": 0.316,
    "uncalibratedPUp": 0.3163,
    "base": 0.3357,
    "pUp": 0.3165
   },
   "90": {
    "n": 108,
    "up": 27,
    "raw": 0.25,
    "uncalibratedPUp": 0.2686,
    "base": 0.3357,
    "pUp": 0.3544
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3357,
    "base": 0.3357,
    "pUp": 0.3165
   }
  },
  "diana": {
   "40": {
    "n": 848,
    "up": 351,
    "raw": 0.4139,
    "uncalibratedPUp": 0.416,
    "base": 0.4743,
    "pUp": 0.4265
   },
   "70": {
    "n": 892,
    "up": 441,
    "raw": 0.4944,
    "uncalibratedPUp": 0.4937,
    "base": 0.4743,
    "pUp": 0.4965
   },
   "50": {
    "n": 1097,
    "up": 460,
    "raw": 0.4193,
    "uncalibratedPUp": 0.4208,
    "base": 0.4743,
    "pUp": 0.4265
   },
   "80": {
    "n": 985,
    "up": 570,
    "raw": 0.5787,
    "uncalibratedPUp": 0.5756,
    "base": 0.4743,
    "pUp": 0.545
   },
   "30": {
    "n": 596,
    "up": 264,
    "raw": 0.443,
    "uncalibratedPUp": 0.4445,
    "base": 0.4743,
    "pUp": 0.4265
   },
   "90": {
    "n": 220,
    "up": 91,
    "raw": 0.4136,
    "uncalibratedPUp": 0.4209,
    "base": 0.4743,
    "pUp": 0.545
   },
   "60": {
    "n": 894,
    "up": 447,
    "raw": 0.5,
    "uncalibratedPUp": 0.4992,
    "base": 0.4743,
    "pUp": 0.4965
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4265
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4265
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4265
   }
  },
  "nova": {
   "50": {
    "n": 1327,
    "up": 393,
    "raw": 0.2962,
    "uncalibratedPUp": 0.297,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "40": {
    "n": 3097,
    "up": 1044,
    "raw": 0.3371,
    "uncalibratedPUp": 0.3371,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "30": {
    "n": 2507,
    "up": 921,
    "raw": 0.3674,
    "uncalibratedPUp": 0.367,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2057,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "60": {
    "n": 581,
    "up": 114,
    "raw": 0.1962,
    "uncalibratedPUp": 0.2031,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "20": {
    "n": 471,
    "up": 220,
    "raw": 0.4671,
    "uncalibratedPUp": 0.4592,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3248,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2962,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3357,
    "base": 0.3357,
    "pUp": 0.3357
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3357,
    "base": 0.3357,
    "pUp": 0.3357
   }
  },
  "flow": {
   "50": {
    "n": 4939,
    "up": 1721,
    "raw": 0.3485,
    "uncalibratedPUp": 0.3484,
    "base": 0.3357,
    "pUp": 0.3484
   },
   "70": {
    "n": 92,
    "up": 44,
    "raw": 0.4783,
    "uncalibratedPUp": 0.4432,
    "base": 0.3357,
    "pUp": 0.4055
   },
   "40": {
    "n": 2342,
    "up": 720,
    "raw": 0.3074,
    "uncalibratedPUp": 0.3078,
    "base": 0.3357,
    "pUp": 0.3078
   },
   "30": {
    "n": 293,
    "up": 81,
    "raw": 0.2765,
    "uncalibratedPUp": 0.2819,
    "base": 0.3357,
    "pUp": 0.2904
   },
   "60": {
    "n": 328,
    "up": 121,
    "raw": 0.3689,
    "uncalibratedPUp": 0.3661,
    "base": 0.3357,
    "pUp": 0.3661
   },
   "20": {
    "n": 46,
    "up": 12,
    "raw": 0.2609,
    "uncalibratedPUp": 0.2904,
    "base": 0.3357,
    "pUp": 0.2904
   },
   "80": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3248,
    "base": 0.3357,
    "pUp": 0.4055
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3357,
    "base": 0.3357,
    "pUp": 0.2904
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3357,
    "base": 0.3357,
    "pUp": 0.2904
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3357,
    "base": 0.3357,
    "pUp": 0.4055
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 2529,
   "errorCorr": -0.137
  },
  "taro:nova": {
   "n": 4022,
   "errorCorr": 0.76
  },
  "taro:flow": {
   "n": 903,
   "errorCorr": 0.186
  },
  "diana:nova": {
   "n": 1728,
   "errorCorr": -0.144
  },
  "diana:flow": {
   "n": 444,
   "errorCorr": 0.1
  },
  "nova:flow": {
   "n": 679,
   "errorCorr": 0.126
  }
 },
 "redundancyFactor": {
  "taro": 0.9612,
  "diana": 1,
  "nova": 0.9634,
  "flow": 0.9978
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.3019,
    "diana": 0.0907,
    "nova": 0.2789,
    "flow": 0.3286
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
   "n": 2579,
   "blend": 0.6,
   "weights": {
    "taro": 0.2875,
    "diana": 0.1004,
    "nova": 0.3023,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 1094,
     "adjustedAcc": 61.3
    },
    "diana": {
     "n": 608,
     "adjustedAcc": 53.3
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
    "taro": 0.3046,
    "diana": 0.0867,
    "nova": 0.3155,
    "flow": 0.2932
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
   "n": 8069,
   "blend": 0.6,
   "weights": {
    "taro": 0.2878,
    "diana": 0.1106,
    "nova": 0.2941,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 2110,
     "adjustedAcc": 55.9
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
  },
  "down_low": {
   "n": 1618,
   "blend": 0.6,
   "weights": {
    "taro": 0.3291,
    "diana": 0.0968,
    "nova": 0.2731,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 767,
     "adjustedAcc": 53.4
    },
    "flow": {
     "n": 111,
     "adjustedAcc": 55.6
    }
   }
  }
 },
 "currentRegime": {
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 4.17,
  "medianAbs1": 1.08
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 3000,
  "errors": 2049,
  "patterns": [
   {
    "label": "고변동성 국면",
    "count": 1655
   },
   {
    "label": "분석가 의견충돌",
    "count": 1533
   },
   {
    "label": "경계점수 판단",
    "count": 1439
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 173
   }
  ],
  "analystErrors": {
   "taro": 1130,
   "diana": 0,
   "nova": 1075,
   "flow": 138
  },
  "regimeErrors": {
   "up_high": 903,
   "down_high": 752,
   "down_low": 394
  }
 },
 "shadow": {
  "n": 3000,
  "baselineActionN": 1264,
  "baselineActionPrecision": 14.5,
  "candidateActionN": 2727,
  "candidateActionPrecision": 9.5,
  "candidateCoverage": 90.9,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 16,
   "SELL": 2984
  },
  "testDays": 6,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 9.0,
  "brier": 0.3785,
  "rawBrier": 0.2663
 },
 "prospective": {
  "n": 1500,
  "baselineActionN": 686,
  "baselineActionPrecision": 14.7,
  "candidateActionN": 1304,
  "candidateActionPrecision": 13.6,
  "candidateCoverage": 86.9,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 20,
   "SELL": 1480
  },
  "testDays": 3,
  "testRegimes": 1,
  "brier": 0.3971,
  "rawBrier": 0.2921
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
   "실제 그림자 행동 정밀도 개선폭 1.5%p 미만",
   "실제 그림자 확률오차(Brier) 개선폭 0.005 미만",
   "실제 그림자 검증일 40거래일 미만",
   "실제 그림자 시장국면 3개 미만",
   "BUY·SELL 양방향 검증 표본 각각 50건 미만",
   "후보 판단이 한 방향에 80% 초과 편중"
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
