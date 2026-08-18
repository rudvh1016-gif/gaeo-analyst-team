// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-18 11:15",
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
    "up": 535,
    "raw": 0.4991,
    "uncalibratedPUp": 0.5002,
    "base": 0.5402,
    "pUp": 0.5002
   },
   "70": {
    "n": 1133,
    "up": 627,
    "raw": 0.5534,
    "uncalibratedPUp": 0.5531,
    "base": 0.5402,
    "pUp": 0.5611
   },
   "50": {
    "n": 1393,
    "up": 686,
    "raw": 0.4925,
    "uncalibratedPUp": 0.4935,
    "base": 0.5402,
    "pUp": 0.5002
   },
   "80": {
    "n": 1258,
    "up": 783,
    "raw": 0.6224,
    "uncalibratedPUp": 0.6205,
    "base": 0.5402,
    "pUp": 0.5948
   },
   "30": {
    "n": 758,
    "up": 384,
    "raw": 0.5066,
    "uncalibratedPUp": 0.5079,
    "base": 0.5402,
    "pUp": 0.5002
   },
   "90": {
    "n": 285,
    "up": 138,
    "raw": 0.4842,
    "uncalibratedPUp": 0.4895,
    "base": 0.5402,
    "pUp": 0.5948
   },
   "60": {
    "n": 1130,
    "up": 644,
    "raw": 0.5699,
    "uncalibratedPUp": 0.5691,
    "base": 0.5402,
    "pUp": 0.5611
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5402,
    "base": 0.5402,
    "pUp": 0.5002
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5402,
    "base": 0.5402,
    "pUp": 0.5002
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5402,
    "base": 0.5402,
    "pUp": 0.5002
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
   "n": 3222,
   "errorCorr": -0.161
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
   "n": 2374,
   "errorCorr": -0.187
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
    "taro": 0.3033,
    "diana": 0.1014,
    "nova": 0.2783,
    "flow": 0.317
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
    "taro": 0.2933,
    "diana": 0.1105,
    "nova": 0.3189,
    "flow": 0.2773
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
    "taro": 0.3149,
    "diana": 0.096,
    "nova": 0.2915,
    "flow": 0.2976
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
   "n": 7330,
   "blend": 0.6,
   "weights": {
    "taro": 0.2848,
    "diana": 0.1304,
    "nova": 0.2824,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 2635,
     "adjustedAcc": 54.5
    },
    "diana": {
     "n": 2160,
     "adjustedAcc": 60.2
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
    "taro": 0.33,
    "diana": 0.1081,
    "nova": 0.2721,
    "flow": 0.2898
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
  "key": "side_high",
  "trend": "side",
  "vol": "high",
  "median5": -0.11,
  "medianAbs1": 2.21,
  "advanceRatio5": 47.7,
  "medianRet1": -1.39,
  "advanceRatio1": 26.1
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
   "hit": 7169,
   "miss": 6811,
   "mid": 586,
   "accuracy": 51.3
  },
  "guarded": {
   "hit": 7160,
   "miss": 6836,
   "mid": 570,
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
  "errors": 1418,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 915
   },
   {
    "label": "분석가 의견충돌",
    "count": 895
   },
   {
    "label": "고변동성 국면",
    "count": 861
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 106
   }
  ],
  "analystErrors": {
   "taro": 530,
   "diana": 0,
   "nova": 688,
   "flow": 143
  },
  "regimeErrors": {
   "up_high": 861,
   "up_low": 557
  }
 },
 "shadow": {
  "n": 2503,
  "baselineActionN": 996,
  "baselineActionPrecision": 16.1,
  "candidateActionN": 2185,
  "candidateActionPrecision": 21.5,
  "candidateCoverage": 87.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 2503
  },
  "testDays": 5,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 18.7,
  "brier": 0.3575,
  "rawBrier": 0.2629
 },
 "prospective": {
  "n": 2500,
  "baselineActionN": 993,
  "baselineActionPrecision": 15.8,
  "candidateActionN": 2037,
  "candidateActionPrecision": 19.8,
  "candidateCoverage": 81.5,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 168,
   "SELL": 2332
  },
  "testDays": 5,
  "testRegimes": 1,
  "brier": 0.3642,
  "rawBrier": 0.2865
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
   "n": 996,
   "buyN": 140,
   "sellN": 856,
   "testDays": 5,
   "testRegimes": 2,
   "candidate": {
    "n": 967,
    "tierSpreadPp": -14.3,
    "corr": -0.3444
   },
   "baseline": {
    "n": 996,
    "tierSpreadPp": -3.6,
    "corr": -0.0482
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -14.3pp vs 기존 -3.6pp)"
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
