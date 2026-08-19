// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-19 09:11",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1207,
    "up": 377,
    "raw": 0.3123,
    "uncalibratedPUp": 0.3123,
    "base": 0.3088,
    "pUp": 0.3247
   },
   "20": {
    "n": 767,
    "up": 264,
    "raw": 0.3442,
    "uncalibratedPUp": 0.3429,
    "base": 0.3088,
    "pUp": 0.2944
   },
   "40": {
    "n": 1605,
    "up": 559,
    "raw": 0.3483,
    "uncalibratedPUp": 0.3476,
    "base": 0.3088,
    "pUp": 0.3247
   },
   "30": {
    "n": 1905,
    "up": 517,
    "raw": 0.2714,
    "uncalibratedPUp": 0.272,
    "base": 0.3088,
    "pUp": 0.2944
   },
   "70": {
    "n": 411,
    "up": 130,
    "raw": 0.3163,
    "uncalibratedPUp": 0.3158,
    "base": 0.3088,
    "pUp": 0.3247
   },
   "80": {
    "n": 341,
    "up": 92,
    "raw": 0.2698,
    "uncalibratedPUp": 0.2729,
    "base": 0.3088,
    "pUp": 0.3247
   },
   "60": {
    "n": 838,
    "up": 285,
    "raw": 0.3401,
    "uncalibratedPUp": 0.339,
    "base": 0.3088,
    "pUp": 0.3247
   },
   "10": {
    "n": 2372,
    "up": 702,
    "raw": 0.296,
    "uncalibratedPUp": 0.2961,
    "base": 0.3088,
    "pUp": 0.2944
   },
   "90": {
    "n": 117,
    "up": 27,
    "raw": 0.2308,
    "uncalibratedPUp": 0.2467,
    "base": 0.3088,
    "pUp": 0.3247
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3088,
    "base": 0.3088,
    "pUp": 0.2944
   }
  },
  "diana": {
   "40": {
    "n": 1143,
    "up": 584,
    "raw": 0.5109,
    "uncalibratedPUp": 0.5119,
    "base": 0.5469,
    "pUp": 0.511
   },
   "70": {
    "n": 1212,
    "up": 667,
    "raw": 0.5503,
    "uncalibratedPUp": 0.5502,
    "base": 0.5469,
    "pUp": 0.5624
   },
   "50": {
    "n": 1491,
    "up": 749,
    "raw": 0.5023,
    "uncalibratedPUp": 0.5032,
    "base": 0.5469,
    "pUp": 0.511
   },
   "80": {
    "n": 1350,
    "up": 847,
    "raw": 0.6274,
    "uncalibratedPUp": 0.6257,
    "base": 0.5469,
    "pUp": 0.6001
   },
   "30": {
    "n": 811,
    "up": 421,
    "raw": 0.5191,
    "uncalibratedPUp": 0.5201,
    "base": 0.5469,
    "pUp": 0.511
   },
   "90": {
    "n": 311,
    "up": 153,
    "raw": 0.492,
    "uncalibratedPUp": 0.4968,
    "base": 0.5469,
    "pUp": 0.6001
   },
   "60": {
    "n": 1210,
    "up": 696,
    "raw": 0.5752,
    "uncalibratedPUp": 0.5745,
    "base": 0.5469,
    "pUp": 0.5624
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5469,
    "base": 0.5469,
    "pUp": 0.511
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5469,
    "base": 0.5469,
    "pUp": 0.511
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5469,
    "base": 0.5469,
    "pUp": 0.511
   }
  },
  "nova": {
   "50": {
    "n": 1401,
    "up": 406,
    "raw": 0.2898,
    "uncalibratedPUp": 0.2902,
    "base": 0.3088,
    "pUp": 0.309
   },
   "40": {
    "n": 3342,
    "up": 1086,
    "raw": 0.325,
    "uncalibratedPUp": 0.3248,
    "base": 0.3088,
    "pUp": 0.309
   },
   "30": {
    "n": 2864,
    "up": 985,
    "raw": 0.3439,
    "uncalibratedPUp": 0.3436,
    "base": 0.3088,
    "pUp": 0.309
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.1959,
    "base": 0.3088,
    "pUp": 0.309
   },
   "60": {
    "n": 894,
    "up": 161,
    "raw": 0.1801,
    "uncalibratedPUp": 0.1843,
    "base": 0.3088,
    "pUp": 0.309
   },
   "20": {
    "n": 1004,
    "up": 308,
    "raw": 0.3068,
    "uncalibratedPUp": 0.3068,
    "base": 0.3088,
    "pUp": 0.3069
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2988,
    "base": 0.3088,
    "pUp": 0.309
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2725,
    "base": 0.3088,
    "pUp": 0.309
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3088,
    "base": 0.3088,
    "pUp": 0.3069
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3088,
    "base": 0.3088,
    "pUp": 0.3069
   }
  },
  "flow": {
   "50": {
    "n": 6001,
    "up": 1910,
    "raw": 0.3183,
    "uncalibratedPUp": 0.3182,
    "base": 0.3088,
    "pUp": 0.3182
   },
   "70": {
    "n": 109,
    "up": 46,
    "raw": 0.422,
    "uncalibratedPUp": 0.3976,
    "base": 0.3088,
    "pUp": 0.3617
   },
   "40": {
    "n": 2677,
    "up": 770,
    "raw": 0.2876,
    "uncalibratedPUp": 0.2879,
    "base": 0.3088,
    "pUp": 0.2879
   },
   "30": {
    "n": 339,
    "up": 86,
    "raw": 0.2537,
    "uncalibratedPUp": 0.2582,
    "base": 0.3088,
    "pUp": 0.2637
   },
   "60": {
    "n": 375,
    "up": 128,
    "raw": 0.3413,
    "uncalibratedPUp": 0.3389,
    "base": 0.3088,
    "pUp": 0.3389
   },
   "20": {
    "n": 57,
    "up": 13,
    "raw": 0.2281,
    "uncalibratedPUp": 0.2559,
    "base": 0.3088,
    "pUp": 0.2637
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2647,
    "base": 0.3088,
    "pUp": 0.3617
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3088,
    "base": 0.3088,
    "pUp": 0.2637
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3088,
    "base": 0.3088,
    "pUp": 0.2637
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3088,
    "base": 0.3088,
    "pUp": 0.3617
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 3431,
   "errorCorr": -0.15
  },
  "taro:nova": {
   "n": 4951,
   "errorCorr": 0.553
  },
  "taro:flow": {
   "n": 1066,
   "errorCorr": 0.235
  },
  "diana:nova": {
   "n": 2627,
   "errorCorr": -0.181
  },
  "diana:flow": {
   "n": 571,
   "errorCorr": 0.163
  },
  "nova:flow": {
   "n": 856,
   "errorCorr": 0.026
  }
 },
 "redundancyFactor": {
  "taro": 0.9707,
  "diana": 0.9992,
  "nova": 0.9758,
  "flow": 0.9941
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2934,
    "diana": 0.1037,
    "nova": 0.2827,
    "flow": 0.3202
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
   "n": 5640,
   "blend": 0.6,
   "weights": {
    "taro": 0.2835,
    "diana": 0.1129,
    "nova": 0.3237,
    "flow": 0.2799
   },
   "acc": {
    "taro": {
     "n": 2229,
     "adjustedAcc": 64.0
    },
    "diana": {
     "n": 1196,
     "adjustedAcc": 53.3
    },
    "nova": {
     "n": 1825,
     "adjustedAcc": 68.1
    },
    "flow": {
     "n": 390,
     "adjustedAcc": 53.1
    }
   }
  },
  "up_low": {
   "n": 1720,
   "blend": 0.6,
   "weights": {
    "taro": 0.3048,
    "diana": 0.0982,
    "nova": 0.2962,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 706,
     "adjustedAcc": 67.4
    },
    "diana": {
     "n": 308,
     "adjustedAcc": 37.8
    },
    "nova": {
     "n": 585,
     "adjustedAcc": 58.4
    },
    "flow": {
     "n": 121,
     "adjustedAcc": 56.9
    }
   }
  },
  "down_high": {
   "n": 7317,
   "blend": 0.6,
   "weights": {
    "taro": 0.2753,
    "diana": 0.1329,
    "nova": 0.2866,
    "flow": 0.3052
   },
   "acc": {
    "taro": {
     "n": 2635,
     "adjustedAcc": 54.5
    },
    "diana": {
     "n": 2147,
     "adjustedAcc": 59.9
    },
    "nova": {
     "n": 2068,
     "adjustedAcc": 51.0
    },
    "flow": {
     "n": 467,
     "adjustedAcc": 53.5
    }
   }
  },
  "down_low": {
   "n": 1924,
   "blend": 0.6,
   "weights": {
    "taro": 0.3153,
    "diana": 0.1217,
    "nova": 0.2734,
    "flow": 0.2896
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 306,
     "adjustedAcc": 59.3
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
  "key": "down_high",
  "trend": "down",
  "vol": "high",
  "median5": -4.12,
  "medianAbs1": 2.71,
  "advanceRatio5": 19.2,
  "medianRet1": -2.7,
  "advanceRatio1": 3.7
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 15066,
  "days": 31,
  "guardedN": 295,
  "baseline": {
   "hit": 7384,
   "miss": 7083,
   "mid": 599,
   "accuracy": 51.0
  },
  "guarded": {
   "hit": 7378,
   "miss": 7104,
   "mid": 584,
   "accuracy": 50.9
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 3003,
  "errors": 1690,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1178
   },
   {
    "label": "분석가 의견충돌",
    "count": 1061
   },
   {
    "label": "고변동성 국면",
    "count": 854
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 116
   }
  ],
  "analystErrors": {
   "taro": 765,
   "diana": 0,
   "nova": 690,
   "flow": 175
  },
  "regimeErrors": {
   "up_high": 854,
   "up_low": 836
  }
 },
 "shadow": {
  "n": 3003,
  "baselineActionN": 1118,
  "baselineActionPrecision": 18.2,
  "candidateActionN": 2652,
  "candidateActionPrecision": 34.2,
  "candidateCoverage": 88.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 3003
  },
  "testDays": 6,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 30.2,
  "brier": 0.3196,
  "rawBrier": 0.2725
 },
 "prospective": {
  "n": 3000,
  "baselineActionN": 1115,
  "baselineActionPrecision": 18.0,
  "candidateActionN": 2399,
  "candidateActionPrecision": 30.9,
  "candidateCoverage": 80.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 278,
   "SELL": 2722
  },
  "testDays": 6,
  "testRegimes": 1,
  "brier": 0.3285,
  "rawBrier": 0.2905
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
 },
 "confidenceModel": {
  "version": "calibrated-accuracy-v1",
  "calibration": {
   "BUY": {
    "65": {
     "n": 241,
     "hit": 82,
     "raw": 0.3402,
     "uncalibratedAcc": 0.3391,
     "base": 0.3248,
     "calibratedAcc": 0.3391
    },
    "60": {
     "n": 160,
     "hit": 45,
     "raw": 0.2812,
     "uncalibratedAcc": 0.2861,
     "base": 0.3248,
     "calibratedAcc": 0.2861
    },
    "70": {
     "n": 102,
     "hit": 36,
     "raw": 0.3529,
     "uncalibratedAcc": 0.3483,
     "base": 0.3248,
     "calibratedAcc": 0.3472
    },
    "75": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.3407,
     "base": 0.3248,
     "calibratedAcc": 0.3472
    }
   },
   "SELL": {
    "40": {
     "n": 1557,
     "hit": 1165,
     "raw": 0.7482,
     "uncalibratedAcc": 0.7481,
     "base": 0.7342,
     "calibratedAcc": 0.7347
    },
    "45": {
     "n": 660,
     "hit": 483,
     "raw": 0.7318,
     "uncalibratedAcc": 0.7319,
     "base": 0.7342,
     "calibratedAcc": 0.7319
    },
    "35": {
     "n": 1105,
     "hit": 828,
     "raw": 0.7493,
     "uncalibratedAcc": 0.7491,
     "base": 0.7342,
     "calibratedAcc": 0.7347
    },
    "30": {
     "n": 405,
     "hit": 261,
     "raw": 0.6444,
     "uncalibratedAcc": 0.6487,
     "base": 0.7342,
     "calibratedAcc": 0.7347
    },
    "25": {
     "n": 22,
     "hit": 16,
     "raw": 0.7273,
     "uncalibratedAcc": 0.7306,
     "base": 0.7342,
     "calibratedAcc": 0.7347
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.7129,
     "base": 0.7342,
     "calibratedAcc": 0.7347
    }
   }
  },
  "evaluation": {
   "n": 1118,
   "buyN": 213,
   "sellN": 905,
   "testDays": 6,
   "testRegimes": 2,
   "candidate": {
    "n": 1089,
    "tierSpreadPp": -5.0,
    "corr": -0.2015
   },
   "baseline": {
    "n": 1118,
    "tierSpreadPp": -1.6,
    "corr": -0.021
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -5.0pp vs 기존 -1.6pp)"
   ],
   "minimums": {
    "testDays": 40,
    "buyN": 50,
    "sellN": 50,
    "minTierSpreadLiftPp": 5.0
   }
  }
 }
};
