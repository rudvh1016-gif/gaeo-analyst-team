// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-19 12:11",
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
    "up": 585,
    "raw": 0.5118,
    "uncalibratedPUp": 0.5128,
    "base": 0.5495,
    "pUp": 0.5125
   },
   "70": {
    "n": 1212,
    "up": 674,
    "raw": 0.5561,
    "uncalibratedPUp": 0.5559,
    "base": 0.5495,
    "pUp": 0.5681
   },
   "50": {
    "n": 1491,
    "up": 751,
    "raw": 0.5037,
    "uncalibratedPUp": 0.5046,
    "base": 0.5495,
    "pUp": 0.5125
   },
   "80": {
    "n": 1350,
    "up": 849,
    "raw": 0.6289,
    "uncalibratedPUp": 0.6272,
    "base": 0.5495,
    "pUp": 0.6008
   },
   "30": {
    "n": 811,
    "up": 423,
    "raw": 0.5216,
    "uncalibratedPUp": 0.5226,
    "base": 0.5495,
    "pUp": 0.5125
   },
   "90": {
    "n": 311,
    "up": 152,
    "raw": 0.4887,
    "uncalibratedPUp": 0.4941,
    "base": 0.5495,
    "pUp": 0.6008
   },
   "60": {
    "n": 1210,
    "up": 703,
    "raw": 0.581,
    "uncalibratedPUp": 0.5802,
    "base": 0.5495,
    "pUp": 0.5681
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5495,
    "base": 0.5495,
    "pUp": 0.5125
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5495,
    "base": 0.5495,
    "pUp": 0.5125
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5495,
    "base": 0.5495,
    "pUp": 0.5125
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
   "n": 3433,
   "errorCorr": -0.151
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
   "n": 2632,
   "errorCorr": -0.179
  },
  "diana:flow": {
   "n": 575,
   "errorCorr": 0.168
  },
  "nova:flow": {
   "n": 856,
   "errorCorr": 0.026
  }
 },
 "redundancyFactor": {
  "taro": 0.9707,
  "diana": 0.9989,
  "nova": 0.9758,
  "flow": 0.9938
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2951,
    "diana": 0.1037,
    "nova": 0.2814,
    "flow": 0.3198
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
    "taro": 0.2853,
    "diana": 0.1129,
    "nova": 0.3222,
    "flow": 0.2796
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
    "taro": 0.3066,
    "diana": 0.0982,
    "nova": 0.2949,
    "flow": 0.3004
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
    "taro": 0.2769,
    "diana": 0.1329,
    "nova": 0.2853,
    "flow": 0.3049
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
   "n": 1936,
   "blend": 0.6,
   "weights": {
    "taro": 0.3165,
    "diana": 0.1233,
    "nova": 0.2716,
    "flow": 0.2886
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 318,
     "adjustedAcc": 60.6
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
  "median5": -2.87,
  "medianAbs1": 2.04,
  "advanceRatio5": 29.9,
  "medianRet1": -1.56,
  "advanceRatio1": 24.7
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
   "hit": 7418,
   "miss": 7054,
   "mid": 594,
   "accuracy": 51.3
  },
  "guarded": {
   "hit": 7412,
   "miss": 7075,
   "mid": 579,
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
  "matured": 3003,
  "errors": 1661,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1146
   },
   {
    "label": "분석가 의견충돌",
    "count": 1045
   },
   {
    "label": "고변동성 국면",
    "count": 854
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 115
   }
  ],
  "analystErrors": {
   "taro": 728,
   "diana": 0,
   "nova": 691,
   "flow": 174
  },
  "regimeErrors": {
   "up_high": 854,
   "up_low": 807
  }
 },
 "shadow": {
  "n": 3003,
  "baselineActionN": 1123,
  "baselineActionPrecision": 18.0,
  "candidateActionN": 2645,
  "candidateActionPrecision": 32.1,
  "candidateCoverage": 88.1,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 3003
  },
  "testDays": 6,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 28.3,
  "brier": 0.3262,
  "rawBrier": 0.2702
 },
 "prospective": {
  "n": 3000,
  "baselineActionN": 1120,
  "baselineActionPrecision": 17.8,
  "candidateActionN": 2392,
  "candidateActionPrecision": 29.0,
  "candidateCoverage": 79.7,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 278,
   "SELL": 2722
  },
  "testDays": 6,
  "testRegimes": 1,
  "brier": 0.3341,
  "rawBrier": 0.2891
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
   "n": 1123,
   "buyN": 217,
   "sellN": 906,
   "testDays": 6,
   "testRegimes": 2,
   "candidate": {
    "n": 1094,
    "tierSpreadPp": -8.8,
    "corr": -0.2355
   },
   "baseline": {
    "n": 1123,
    "tierSpreadPp": -3.7,
    "corr": -0.0473
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -8.8pp vs 기존 -3.7pp)"
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
