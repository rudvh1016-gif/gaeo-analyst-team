// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-14 10:39",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1053,
    "up": 339,
    "raw": 0.3219,
    "uncalibratedPUp": 0.322,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "20": {
    "n": 728,
    "up": 252,
    "raw": 0.3462,
    "uncalibratedPUp": 0.3452,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "40": {
    "n": 1407,
    "up": 520,
    "raw": 0.3696,
    "uncalibratedPUp": 0.3686,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "30": {
    "n": 1655,
    "up": 477,
    "raw": 0.2882,
    "uncalibratedPUp": 0.2888,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "70": {
    "n": 342,
    "up": 114,
    "raw": 0.3333,
    "uncalibratedPUp": 0.3325,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "80": {
    "n": 300,
    "up": 84,
    "raw": 0.28,
    "uncalibratedPUp": 0.2839,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "60": {
    "n": 736,
    "up": 259,
    "raw": 0.3519,
    "uncalibratedPUp": 0.3508,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "10": {
    "n": 2224,
    "up": 689,
    "raw": 0.3098,
    "uncalibratedPUp": 0.31,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "90": {
    "n": 111,
    "up": 27,
    "raw": 0.2432,
    "uncalibratedPUp": 0.2601,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3082
   }
  },
  "diana": {
   "40": {
    "n": 1000,
    "up": 468,
    "raw": 0.468,
    "uncalibratedPUp": 0.4693,
    "base": 0.5127,
    "pUp": 0.4702
   },
   "70": {
    "n": 1052,
    "up": 551,
    "raw": 0.5238,
    "uncalibratedPUp": 0.5235,
    "base": 0.5127,
    "pUp": 0.5306
   },
   "50": {
    "n": 1296,
    "up": 599,
    "raw": 0.4622,
    "uncalibratedPUp": 0.4633,
    "base": 0.5127,
    "pUp": 0.4702
   },
   "80": {
    "n": 1165,
    "up": 707,
    "raw": 0.6069,
    "uncalibratedPUp": 0.6045,
    "base": 0.5127,
    "pUp": 0.5776
   },
   "30": {
    "n": 704,
    "up": 336,
    "raw": 0.4773,
    "uncalibratedPUp": 0.4787,
    "base": 0.5127,
    "pUp": 0.4702
   },
   "90": {
    "n": 260,
    "up": 120,
    "raw": 0.4615,
    "uncalibratedPUp": 0.4668,
    "base": 0.5127,
    "pUp": 0.5776
   },
   "60": {
    "n": 1053,
    "up": 567,
    "raw": 0.5385,
    "uncalibratedPUp": 0.5377,
    "base": 0.5127,
    "pUp": 0.5306
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5127,
    "base": 0.5127,
    "pUp": 0.4702
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5127,
    "base": 0.5127,
    "pUp": 0.4702
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5127,
    "base": 0.5127,
    "pUp": 0.4702
   }
  },
  "nova": {
   "50": {
    "n": 1350,
    "up": 397,
    "raw": 0.2941,
    "uncalibratedPUp": 0.2947,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "40": {
    "n": 3201,
    "up": 1063,
    "raw": 0.3321,
    "uncalibratedPUp": 0.332,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "30": {
    "n": 2669,
    "up": 950,
    "raw": 0.3559,
    "uncalibratedPUp": 0.3556,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.201,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "60": {
    "n": 639,
    "up": 119,
    "raw": 0.1862,
    "uncalibratedPUp": 0.1923,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "20": {
    "n": 639,
    "up": 225,
    "raw": 0.3521,
    "uncalibratedPUp": 0.3508,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3123,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2847,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3227
   }
  },
  "flow": {
   "50": {
    "n": 5300,
    "up": 1778,
    "raw": 0.3355,
    "uncalibratedPUp": 0.3354,
    "base": 0.3227,
    "pUp": 0.3354
   },
   "70": {
    "n": 101,
    "up": 44,
    "raw": 0.4356,
    "uncalibratedPUp": 0.4098,
    "base": 0.3227,
    "pUp": 0.3765
   },
   "40": {
    "n": 2449,
    "up": 724,
    "raw": 0.2956,
    "uncalibratedPUp": 0.296,
    "base": 0.3227,
    "pUp": 0.296
   },
   "30": {
    "n": 308,
    "up": 81,
    "raw": 0.263,
    "uncalibratedPUp": 0.2683,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "60": {
    "n": 347,
    "up": 122,
    "raw": 0.3516,
    "uncalibratedPUp": 0.3493,
    "base": 0.3227,
    "pUp": 0.3493
   },
   "20": {
    "n": 48,
    "up": 12,
    "raw": 0.25,
    "uncalibratedPUp": 0.278,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2934,
    "base": 0.3227,
    "pUp": 0.3765
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3765
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 2949,
   "errorCorr": -0.15
  },
  "taro:nova": {
   "n": 4352,
   "errorCorr": 0.693
  },
  "taro:flow": {
   "n": 961,
   "errorCorr": 0.199
  },
  "diana:nova": {
   "n": 2098,
   "errorCorr": -0.163
  },
  "diana:flow": {
   "n": 517,
   "errorCorr": 0.126
  },
  "nova:flow": {
   "n": 745,
   "errorCorr": 0.095
  }
 },
 "redundancyFactor": {
  "taro": 0.9644,
  "diana": 1,
  "nova": 0.9674,
  "flow": 0.997
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.3027,
    "diana": 0.096,
    "nova": 0.2786,
    "flow": 0.3227
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
   "n": 3757,
   "blend": 0.6,
   "weights": {
    "taro": 0.2888,
    "diana": 0.1074,
    "nova": 0.3148,
    "flow": 0.289
   },
   "acc": {
    "taro": {
     "n": 1464,
     "adjustedAcc": 63.5
    },
    "diana": {
     "n": 903,
     "adjustedAcc": 56.2
    },
    "nova": {
     "n": 1125,
     "adjustedAcc": 67.5
    },
    "flow": {
     "n": 265,
     "adjustedAcc": 55.7
    }
   }
  },
  "up_low": {
   "n": 926,
   "blend": 0.537,
   "weights": {
    "taro": 0.3053,
    "diana": 0.0918,
    "nova": 0.3151,
    "flow": 0.2878
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
    "taro": 0.2881,
    "diana": 0.117,
    "nova": 0.2933,
    "flow": 0.3016
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
    "taro": 0.3296,
    "diana": 0.1025,
    "nova": 0.2725,
    "flow": 0.2953
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
  "median5": 2.71,
  "medianAbs1": 1.63,
  "advanceRatio5": 67.4,
  "medianRet1": -0.34,
  "advanceRatio1": 42.6
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 14056,
  "days": 29,
  "guardedN": 201,
  "baseline": {
   "hit": 6945,
   "miss": 6554,
   "mid": 557,
   "accuracy": 51.4
  },
  "guarded": {
   "hit": 6995,
   "miss": 6517,
   "mid": 544,
   "accuracy": 51.8
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 3000,
  "errors": 1902,
  "patterns": [
   {
    "label": "분석가 의견충돌",
    "count": 1317
   },
   {
    "label": "경계점수 판단",
    "count": 1257
   },
   {
    "label": "고변동성 국면",
    "count": 1239
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 157
   }
  ],
  "analystErrors": {
   "taro": 903,
   "diana": 0,
   "nova": 1071,
   "flow": 149
  },
  "regimeErrors": {
   "up_high": 892,
   "down_low": 394,
   "down_high": 347,
   "up_low": 269
  }
 },
 "shadow": {
  "n": 3000,
  "baselineActionN": 1272,
  "baselineActionPrecision": 15.0,
  "candidateActionN": 2702,
  "candidateActionPrecision": 13.3,
  "candidateCoverage": 90.1,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 3000
  },
  "testDays": 6,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 12.0,
  "brier": 0.374,
  "rawBrier": 0.2657
 },
 "prospective": {
  "n": 2000,
  "baselineActionN": 869,
  "baselineActionPrecision": 14.6,
  "candidateActionN": 1680,
  "candidateActionPrecision": 16.1,
  "candidateCoverage": 84.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 86,
   "SELL": 1914
  },
  "testDays": 4,
  "testRegimes": 1,
  "brier": 0.3794,
  "rawBrier": 0.2906
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
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
