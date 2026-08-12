// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-12 14:58",
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
    "n": 772,
    "up": 296,
    "raw": 0.3834,
    "uncalibratedPUp": 0.386,
    "base": 0.4512,
    "pUp": 0.4039
   },
   "70": {
    "n": 812,
    "up": 381,
    "raw": 0.4692,
    "uncalibratedPUp": 0.4686,
    "base": 0.4512,
    "pUp": 0.4713
   },
   "50": {
    "n": 997,
    "up": 398,
    "raw": 0.3992,
    "uncalibratedPUp": 0.4007,
    "base": 0.4512,
    "pUp": 0.4039
   },
   "80": {
    "n": 895,
    "up": 500,
    "raw": 0.5587,
    "uncalibratedPUp": 0.5552,
    "base": 0.4512,
    "pUp": 0.5239
   },
   "30": {
    "n": 542,
    "up": 231,
    "raw": 0.4262,
    "uncalibratedPUp": 0.4275,
    "base": 0.4512,
    "pUp": 0.4039
   },
   "90": {
    "n": 200,
    "up": 78,
    "raw": 0.39,
    "uncalibratedPUp": 0.398,
    "base": 0.4512,
    "pUp": 0.5239
   },
   "60": {
    "n": 815,
    "up": 387,
    "raw": 0.4748,
    "uncalibratedPUp": 0.474,
    "base": 0.4512,
    "pUp": 0.4713
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4512,
    "base": 0.4512,
    "pUp": 0.4039
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4512,
    "base": 0.4512,
    "pUp": 0.4039
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4512,
    "base": 0.4512,
    "pUp": 0.4039
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
   "n": 2318,
   "errorCorr": -0.114
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
   "n": 1640,
   "errorCorr": -0.129
  },
  "diana:flow": {
   "n": 406,
   "errorCorr": 0.089
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
    "taro": 0.2996,
    "diana": 0.0867,
    "nova": 0.2799,
    "flow": 0.3338
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
    "taro": 0.2887,
    "diana": 0.0858,
    "nova": 0.307,
    "flow": 0.3185
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
    "taro": 0.3024,
    "diana": 0.083,
    "nova": 0.3167,
    "flow": 0.2979
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
   "n": 8067,
   "blend": 0.6,
   "weights": {
    "taro": 0.2859,
    "diana": 0.1059,
    "nova": 0.2954,
    "flow": 0.3128
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 2108,
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
    "taro": 0.3269,
    "diana": 0.0927,
    "nova": 0.2744,
    "flow": 0.3061
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
  "median5": 3.76,
  "medianAbs1": 1.84
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2500,
  "errors": 1794,
  "patterns": [
   {
    "label": "분석가 의견충돌",
    "count": 1445
   },
   {
    "label": "고변동성 국면",
    "count": 1400
   },
   {
    "label": "경계점수 판단",
    "count": 1252
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 152
   }
  ],
  "analystErrors": {
   "taro": 1042,
   "diana": 0,
   "nova": 1048,
   "flow": 99
  },
  "regimeErrors": {
   "down_high": 752,
   "up_high": 648,
   "down_low": 394
  }
 },
 "shadow": {
  "n": 2500,
  "baselineActionN": 1099,
  "baselineActionPrecision": 13.6,
  "candidateActionN": 2307,
  "candidateActionPrecision": 7.6,
  "candidateCoverage": 92.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 8,
   "SELL": 2492
  },
  "testDays": 5,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 7.2,
  "brier": 0.3891,
  "rawBrier": 0.2701
 },
 "prospective": {
  "n": 1000,
  "baselineActionN": 521,
  "baselineActionPrecision": 12.9,
  "candidateActionN": 887,
  "candidateActionPrecision": 10.6,
  "candidateCoverage": 88.7,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 7,
   "SELL": 993
  },
  "testDays": 2,
  "testRegimes": 1,
  "brier": 0.4162,
  "rawBrier": 0.3018
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
