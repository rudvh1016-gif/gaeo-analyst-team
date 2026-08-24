// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-24 09:11",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1289,
    "up": 447,
    "raw": 0.3468,
    "uncalibratedPUp": 0.3472,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "20": {
    "n": 825,
    "up": 321,
    "raw": 0.3891,
    "uncalibratedPUp": 0.3882,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "40": {
    "n": 1747,
    "up": 691,
    "raw": 0.3955,
    "uncalibratedPUp": 0.395,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "30": {
    "n": 2162,
    "up": 760,
    "raw": 0.3515,
    "uncalibratedPUp": 0.3517,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "70": {
    "n": 452,
    "up": 156,
    "raw": 0.3451,
    "uncalibratedPUp": 0.3463,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "80": {
    "n": 369,
    "up": 111,
    "raw": 0.3008,
    "uncalibratedPUp": 0.3055,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "60": {
    "n": 910,
    "up": 328,
    "raw": 0.3604,
    "uncalibratedPUp": 0.3605,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "10": {
    "n": 2689,
    "up": 996,
    "raw": 0.3704,
    "uncalibratedPUp": 0.3703,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "90": {
    "n": 120,
    "up": 28,
    "raw": 0.2333,
    "uncalibratedPUp": 0.2593,
    "base": 0.3633,
    "pUp": 0.3633
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3633,
    "base": 0.3633,
    "pUp": 0.3633
   }
  },
  "diana": {
   "40": {
    "n": 1379,
    "up": 744,
    "raw": 0.5395,
    "uncalibratedPUp": 0.5398,
    "base": 0.5542,
    "pUp": 0.5325
   },
   "70": {
    "n": 1456,
    "up": 804,
    "raw": 0.5522,
    "uncalibratedPUp": 0.5522,
    "base": 0.5542,
    "pUp": 0.564
   },
   "50": {
    "n": 1798,
    "up": 926,
    "raw": 0.515,
    "uncalibratedPUp": 0.5157,
    "base": 0.5542,
    "pUp": 0.5325
   },
   "80": {
    "n": 1621,
    "up": 990,
    "raw": 0.6107,
    "uncalibratedPUp": 0.6097,
    "base": 0.5542,
    "pUp": 0.5857
   },
   "30": {
    "n": 960,
    "up": 530,
    "raw": 0.5521,
    "uncalibratedPUp": 0.5521,
    "base": 0.5542,
    "pUp": 0.5325
   },
   "90": {
    "n": 375,
    "up": 181,
    "raw": 0.4827,
    "uncalibratedPUp": 0.488,
    "base": 0.5542,
    "pUp": 0.5857
   },
   "60": {
    "n": 1465,
    "up": 844,
    "raw": 0.5761,
    "uncalibratedPUp": 0.5757,
    "base": 0.5542,
    "pUp": 0.564
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5196,
    "base": 0.5542,
    "pUp": 0.5325
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5542,
    "base": 0.5542,
    "pUp": 0.5325
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5542,
    "base": 0.5542,
    "pUp": 0.5325
   }
  },
  "nova": {
   "50": {
    "n": 1416,
    "up": 421,
    "raw": 0.2973,
    "uncalibratedPUp": 0.2987,
    "base": 0.3633,
    "pUp": 0.3363
   },
   "40": {
    "n": 3400,
    "up": 1138,
    "raw": 0.3347,
    "uncalibratedPUp": 0.335,
    "base": 0.3633,
    "pUp": 0.3363
   },
   "30": {
    "n": 2977,
    "up": 1059,
    "raw": 0.3557,
    "uncalibratedPUp": 0.3558,
    "base": 0.3633,
    "pUp": 0.3363
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2157,
    "base": 0.3633,
    "pUp": 0.5044
   },
   "60": {
    "n": 1675,
    "up": 884,
    "raw": 0.5278,
    "uncalibratedPUp": 0.5249,
    "base": 0.3633,
    "pUp": 0.5044
   },
   "20": {
    "n": 1037,
    "up": 329,
    "raw": 0.3173,
    "uncalibratedPUp": 0.3186,
    "base": 0.3633,
    "pUp": 0.3209
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3516,
    "base": 0.3633,
    "pUp": 0.5044
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3206,
    "base": 0.3633,
    "pUp": 0.5044
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3633,
    "base": 0.3633,
    "pUp": 0.3209
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3633,
    "base": 0.3633,
    "pUp": 0.3209
   }
  },
  "flow": {
   "50": {
    "n": 6623,
    "up": 2435,
    "raw": 0.3677,
    "uncalibratedPUp": 0.3676,
    "base": 0.3633,
    "pUp": 0.3676
   },
   "70": {
    "n": 120,
    "up": 56,
    "raw": 0.4667,
    "uncalibratedPUp": 0.446,
    "base": 0.3633,
    "pUp": 0.4126
   },
   "40": {
    "n": 2975,
    "up": 1054,
    "raw": 0.3543,
    "uncalibratedPUp": 0.3544,
    "base": 0.3633,
    "pUp": 0.3544
   },
   "30": {
    "n": 366,
    "up": 112,
    "raw": 0.306,
    "uncalibratedPUp": 0.3104,
    "base": 0.3633,
    "pUp": 0.3205
   },
   "60": {
    "n": 409,
    "up": 160,
    "raw": 0.3912,
    "uncalibratedPUp": 0.3893,
    "base": 0.3633,
    "pUp": 0.3893
   },
   "20": {
    "n": 64,
    "up": 20,
    "raw": 0.3125,
    "uncalibratedPUp": 0.3287,
    "base": 0.3633,
    "pUp": 0.3205
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3114,
    "base": 0.3633,
    "pUp": 0.4126
   },
   "10": {
    "n": 1,
    "up": 1,
    "raw": 1.0,
    "uncalibratedPUp": 0.3839,
    "base": 0.3633,
    "pUp": 0.3205
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3633,
    "base": 0.3633,
    "pUp": 0.3205
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3633,
    "base": 0.3633,
    "pUp": 0.4126
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 4092,
   "errorCorr": -0.13
  },
  "taro:nova": {
   "n": 5743,
   "errorCorr": 0.355
  },
  "taro:flow": {
   "n": 1205,
   "errorCorr": 0.241
  },
  "diana:nova": {
   "n": 3330,
   "errorCorr": -0.164
  },
  "diana:flow": {
   "n": 673,
   "errorCorr": 0.146
  },
  "nova:flow": {
   "n": 1000,
   "errorCorr": -0.015
  }
 },
 "redundancyFactor": {
  "taro": 0.9822,
  "diana": 1,
  "nova": 0.9877,
  "flow": 0.9945
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2776,
    "diana": 0.1029,
    "nova": 0.2902,
    "flow": 0.3293
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
   "n": 6224,
   "blend": 0.6,
   "weights": {
    "taro": 0.2692,
    "diana": 0.1087,
    "nova": 0.3336,
    "flow": 0.2885
   },
   "acc": {
    "taro": {
     "n": 2229,
     "adjustedAcc": 64.1
    },
    "diana": {
     "n": 1780,
     "adjustedAcc": 50.4
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
    "taro": 0.2888,
    "diana": 0.0974,
    "nova": 0.3047,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 706,
     "adjustedAcc": 67.5
    },
    "diana": {
     "n": 308,
     "adjustedAcc": 37.8
    },
    "nova": {
     "n": 585,
     "adjustedAcc": 58.6
    },
    "flow": {
     "n": 121,
     "adjustedAcc": 56.9
    }
   }
  },
  "down_high": {
   "n": 9180,
   "blend": 0.6,
   "weights": {
    "taro": 0.2332,
    "diana": 0.1311,
    "nova": 0.3281,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 3442,
     "adjustedAcc": 45.4
    },
    "diana": {
     "n": 2147,
     "adjustedAcc": 59.9
    },
    "nova": {
     "n": 2979,
     "adjustedAcc": 60.4
    },
    "flow": {
     "n": 612,
     "adjustedAcc": 52.2
    }
   }
  },
  "down_low": {
   "n": 2253,
   "blend": 0.6,
   "weights": {
    "taro": 0.2987,
    "diana": 0.1223,
    "nova": 0.281,
    "flow": 0.298
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 635,
     "adjustedAcc": 60.3
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
  "key": "down_low",
  "trend": "down",
  "vol": "low",
  "median5": -5.86,
  "medianAbs1": 0.89,
  "advanceRatio5": 13.0,
  "medianRet1": 0.3,
  "advanceRatio1": 58.7
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 17176,
  "days": 35,
  "guardedN": 295,
  "baseline": {
   "hit": 8324,
   "miss": 8206,
   "mid": 646,
   "accuracy": 50.4
  },
  "guarded": {
   "hit": 8318,
   "miss": 8227,
   "mid": 631,
   "accuracy": 50.3
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 4113,
  "errors": 2178,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1961
   },
   {
    "label": "분석가 의견충돌",
    "count": 1196
   },
   {
    "label": "고변동성 국면",
    "count": 217
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 95
   }
  ],
  "analystErrors": {
   "taro": 1473,
   "diana": 0,
   "nova": 114,
   "flow": 241
  },
  "regimeErrors": {
   "up_low": 1605,
   "unknown": 356,
   "up_high": 217
  }
 },
 "shadow": {
  "n": 4113,
  "baselineActionN": 999,
  "baselineActionPrecision": 31.5,
  "candidateActionN": 3303,
  "candidateActionPrecision": 63.3,
  "candidateCoverage": 80.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 386,
   "SELL": 3727
  },
  "testDays": 8,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 55.9,
  "brier": 0.231,
  "rawBrier": 0.2813
 },
 "prospective": {
  "n": 4500,
  "baselineActionN": 1414,
  "baselineActionPrecision": 23.8,
  "candidateActionN": 3580,
  "candidateActionPrecision": 47.1,
  "candidateCoverage": 79.6,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 434,
   "SELL": 4066
  },
  "testDays": 9,
  "testRegimes": 1,
  "brier": 0.2815,
  "rawBrier": 0.2885
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
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
     "n": 256,
     "hit": 93,
     "raw": 0.3633,
     "uncalibratedAcc": 0.3635,
     "base": 0.3666,
     "calibratedAcc": 0.3635
    },
    "60": {
     "n": 180,
     "hit": 62,
     "raw": 0.3444,
     "uncalibratedAcc": 0.3467,
     "base": 0.3666,
     "calibratedAcc": 0.3467
    },
    "70": {
     "n": 112,
     "hit": 45,
     "raw": 0.4018,
     "uncalibratedAcc": 0.3965,
     "base": 0.3666,
     "calibratedAcc": 0.3965
    },
    "75": {
     "n": 3,
     "hit": 2,
     "raw": 0.6667,
     "uncalibratedAcc": 0.4057,
     "base": 0.3666,
     "calibratedAcc": 0.4057
    }
   },
   "SELL": {
    "40": {
     "n": 1699,
     "hit": 1172,
     "raw": 0.6898,
     "uncalibratedAcc": 0.6898,
     "base": 0.6843,
     "calibratedAcc": 0.6898
    },
    "45": {
     "n": 787,
     "hit": 487,
     "raw": 0.6188,
     "uncalibratedAcc": 0.6204,
     "base": 0.6843,
     "calibratedAcc": 0.6204
    },
    "35": {
     "n": 1128,
     "hit": 831,
     "raw": 0.7367,
     "uncalibratedAcc": 0.7358,
     "base": 0.6843,
     "calibratedAcc": 0.71
    },
    "30": {
     "n": 406,
     "hit": 261,
     "raw": 0.6429,
     "uncalibratedAcc": 0.6448,
     "base": 0.6843,
     "calibratedAcc": 0.71
    },
    "25": {
     "n": 23,
     "hit": 16,
     "raw": 0.6957,
     "uncalibratedAcc": 0.6904,
     "base": 0.6843,
     "calibratedAcc": 0.71
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6675,
     "base": 0.6843,
     "calibratedAcc": 0.71
    }
   }
  },
  "evaluation": {
   "n": 999,
   "buyN": 435,
   "sellN": 564,
   "testDays": 8,
   "testRegimes": 2,
   "candidate": {
    "n": 997,
    "tierSpreadPp": 8.7,
    "corr": 0.0777
   },
   "baseline": {
    "n": 999,
    "tierSpreadPp": -8.7,
    "corr": -0.0602
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만"
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
