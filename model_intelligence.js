// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-18 14:57",
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
    "n": 1072,
    "up": 529,
    "raw": 0.4935,
    "uncalibratedPUp": 0.4946,
    "base": 0.5366,
    "pUp": 0.4962
   },
   "70": {
    "n": 1133,
    "up": 622,
    "raw": 0.549,
    "uncalibratedPUp": 0.5487,
    "base": 0.5366,
    "pUp": 0.5576
   },
   "50": {
    "n": 1393,
    "up": 680,
    "raw": 0.4882,
    "uncalibratedPUp": 0.4892,
    "base": 0.5366,
    "pUp": 0.4962
   },
   "80": {
    "n": 1258,
    "up": 780,
    "raw": 0.62,
    "uncalibratedPUp": 0.6181,
    "base": 0.5366,
    "pUp": 0.5921
   },
   "30": {
    "n": 758,
    "up": 383,
    "raw": 0.5053,
    "uncalibratedPUp": 0.5065,
    "base": 0.5366,
    "pUp": 0.4962
   },
   "90": {
    "n": 285,
    "up": 137,
    "raw": 0.4807,
    "uncalibratedPUp": 0.486,
    "base": 0.5366,
    "pUp": 0.5921
   },
   "60": {
    "n": 1130,
    "up": 641,
    "raw": 0.5673,
    "uncalibratedPUp": 0.5665,
    "base": 0.5366,
    "pUp": 0.5576
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5366,
    "base": 0.5366,
    "pUp": 0.4962
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5366,
    "base": 0.5366,
    "pUp": 0.4962
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5366,
    "base": 0.5366,
    "pUp": 0.4962
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
   "n": 3215,
   "errorCorr": -0.16
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
   "n": 2365,
   "errorCorr": -0.186
  },
  "diana:flow": {
   "n": 546,
   "errorCorr": 0.136
  },
  "nova:flow": {
   "n": 856,
   "errorCorr": 0.026
  }
 },
 "redundancyFactor": {
  "taro": 0.9707,
  "diana": 1,
  "nova": 0.9758,
  "flow": 0.9949
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2997,
    "diana": 0.1012,
    "nova": 0.2791,
    "flow": 0.3201
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
    "taro": 0.2899,
    "diana": 0.1102,
    "nova": 0.3198,
    "flow": 0.2801
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
    "taro": 0.3112,
    "diana": 0.0958,
    "nova": 0.2924,
    "flow": 0.3006
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
   "n": 7321,
   "blend": 0.6,
   "weights": {
    "taro": 0.2815,
    "diana": 0.1296,
    "nova": 0.2834,
    "flow": 0.3055
   },
   "acc": {
    "taro": {
     "n": 2635,
     "adjustedAcc": 54.5
    },
    "diana": {
     "n": 2151,
     "adjustedAcc": 59.8
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
   "n": 1618,
   "blend": 0.6,
   "weights": {
    "taro": 0.3263,
    "diana": 0.1079,
    "nova": 0.273,
    "flow": 0.2928
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
  "key": "down_high",
  "trend": "down",
  "vol": "high",
  "median5": -1.74,
  "medianAbs1": 3.68,
  "advanceRatio5": 34.9,
  "medianRet1": -3.32,
  "advanceRatio1": 15.4
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 14566,
  "days": 30,
  "guardedN": 295,
  "baseline": {
   "hit": 7171,
   "miss": 6814,
   "mid": 581,
   "accuracy": 51.3
  },
  "guarded": {
   "hit": 7163,
   "miss": 6837,
   "mid": 566,
   "accuracy": 51.2
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 2503,
  "errors": 1421,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 920
   },
   {
    "label": "분석가 의견충돌",
    "count": 898
   },
   {
    "label": "고변동성 국면",
    "count": 864
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 106
   }
  ],
  "analystErrors": {
   "taro": 555,
   "diana": 0,
   "nova": 688,
   "flow": 144
  },
  "regimeErrors": {
   "up_high": 864,
   "up_low": 557
  }
 },
 "shadow": {
  "n": 2503,
  "baselineActionN": 1001,
  "baselineActionPrecision": 16.6,
  "candidateActionN": 2205,
  "candidateActionPrecision": 24.9,
  "candidateCoverage": 88.1,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 2503
  },
  "testDays": 5,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 21.9,
  "brier": 0.3488,
  "rawBrier": 0.2662
 },
 "prospective": {
  "n": 2500,
  "baselineActionN": 998,
  "baselineActionPrecision": 16.3,
  "candidateActionN": 2055,
  "candidateActionPrecision": 22.9,
  "candidateCoverage": 82.2,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 168,
   "SELL": 2332
  },
  "testDays": 5,
  "testRegimes": 1,
  "brier": 0.3564,
  "rawBrier": 0.2888
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
   "n": 1001,
   "buyN": 141,
   "sellN": 860,
   "testDays": 5,
   "testRegimes": 2,
   "candidate": {
    "n": 972,
    "tierSpreadPp": -9.9,
    "corr": -0.2918
   },
   "baseline": {
    "n": 1001,
    "tierSpreadPp": -3.3,
    "corr": -0.032
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -9.9pp vs 기존 -3.3pp)"
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
