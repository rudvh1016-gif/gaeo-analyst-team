// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-01 09:14",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1617,
    "up": 759,
    "raw": 0.4694,
    "uncalibratedPUp": 0.4691,
    "base": 0.4522,
    "pUp": 0.461
   },
   "20": {
    "n": 984,
    "up": 467,
    "raw": 0.4746,
    "uncalibratedPUp": 0.4739,
    "base": 0.4522,
    "pUp": 0.4442
   },
   "40": {
    "n": 2126,
    "up": 1050,
    "raw": 0.4939,
    "uncalibratedPUp": 0.4933,
    "base": 0.4522,
    "pUp": 0.461
   },
   "30": {
    "n": 2481,
    "up": 1065,
    "raw": 0.4293,
    "uncalibratedPUp": 0.4295,
    "base": 0.4522,
    "pUp": 0.4442
   },
   "70": {
    "n": 544,
    "up": 242,
    "raw": 0.4449,
    "uncalibratedPUp": 0.4452,
    "base": 0.4522,
    "pUp": 0.461
   },
   "80": {
    "n": 422,
    "up": 154,
    "raw": 0.3649,
    "uncalibratedPUp": 0.3707,
    "base": 0.4522,
    "pUp": 0.461
   },
   "60": {
    "n": 1129,
    "up": 513,
    "raw": 0.4544,
    "uncalibratedPUp": 0.4543,
    "base": 0.4522,
    "pUp": 0.461
   },
   "10": {
    "n": 3125,
    "up": 1394,
    "raw": 0.4461,
    "uncalibratedPUp": 0.4461,
    "base": 0.4522,
    "pUp": 0.4442
   },
   "90": {
    "n": 128,
    "up": 34,
    "raw": 0.2656,
    "uncalibratedPUp": 0.3011,
    "base": 0.4522,
    "pUp": 0.461
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4522,
    "base": 0.4522,
    "pUp": 0.4442
   }
  },
  "diana": {
   "40": {
    "n": 1800,
    "up": 1113,
    "raw": 0.6183,
    "uncalibratedPUp": 0.6184,
    "base": 0.6222,
    "pUp": 0.6118
   },
   "70": {
    "n": 1987,
    "up": 1232,
    "raw": 0.62,
    "uncalibratedPUp": 0.6201,
    "base": 0.6222,
    "pUp": 0.6305
   },
   "50": {
    "n": 2367,
    "up": 1433,
    "raw": 0.6054,
    "uncalibratedPUp": 0.6056,
    "base": 0.6222,
    "pUp": 0.6118
   },
   "80": {
    "n": 2187,
    "up": 1423,
    "raw": 0.6507,
    "uncalibratedPUp": 0.6503,
    "base": 0.6222,
    "pUp": 0.6314
   },
   "30": {
    "n": 1240,
    "up": 761,
    "raw": 0.6137,
    "uncalibratedPUp": 0.6139,
    "base": 0.6222,
    "pUp": 0.6118
   },
   "90": {
    "n": 511,
    "up": 281,
    "raw": 0.5499,
    "uncalibratedPUp": 0.5539,
    "base": 0.6222,
    "pUp": 0.6314
   },
   "60": {
    "n": 1960,
    "up": 1257,
    "raw": 0.6413,
    "uncalibratedPUp": 0.641,
    "base": 0.6222,
    "pUp": 0.6305
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5833,
    "base": 0.6222,
    "pUp": 0.6087
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6222,
    "base": 0.6222,
    "pUp": 0.6087
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6222,
    "base": 0.6222,
    "pUp": 0.6087
   }
  },
  "nova": {
   "50": {
    "n": 1494,
    "up": 499,
    "raw": 0.334,
    "uncalibratedPUp": 0.3363,
    "base": 0.4522,
    "pUp": 0.3998
   },
   "40": {
    "n": 3586,
    "up": 1306,
    "raw": 0.3642,
    "uncalibratedPUp": 0.3649,
    "base": 0.4522,
    "pUp": 0.3998
   },
   "30": {
    "n": 3279,
    "up": 1326,
    "raw": 0.4044,
    "uncalibratedPUp": 0.4048,
    "base": 0.4522,
    "pUp": 0.3998
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2478,
    "base": 0.4522,
    "pUp": 0.6467
   },
   "60": {
    "n": 2550,
    "up": 1703,
    "raw": 0.6678,
    "uncalibratedPUp": 0.6653,
    "base": 0.4522,
    "pUp": 0.6467
   },
   "20": {
    "n": 1589,
    "up": 837,
    "raw": 0.5267,
    "uncalibratedPUp": 0.5254,
    "base": 0.4522,
    "pUp": 0.3998
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4376,
    "base": 0.4522,
    "pUp": 0.6467
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.399,
    "base": 0.4522,
    "pUp": 0.6467
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4522,
    "base": 0.4522,
    "pUp": 0.3998
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4522,
    "base": 0.4522,
    "pUp": 0.3998
   }
  },
  "flow": {
   "50": {
    "n": 7984,
    "up": 3693,
    "raw": 0.4626,
    "uncalibratedPUp": 0.4625,
    "base": 0.4522,
    "pUp": 0.4625
   },
   "70": {
    "n": 153,
    "up": 87,
    "raw": 0.5686,
    "uncalibratedPUp": 0.5495,
    "base": 0.4522,
    "pUp": 0.5149
   },
   "40": {
    "n": 3400,
    "up": 1447,
    "raw": 0.4256,
    "uncalibratedPUp": 0.4258,
    "base": 0.4522,
    "pUp": 0.4258
   },
   "30": {
    "n": 395,
    "up": 138,
    "raw": 0.3494,
    "uncalibratedPUp": 0.3566,
    "base": 0.4522,
    "pUp": 0.3813
   },
   "60": {
    "n": 538,
    "up": 278,
    "raw": 0.5167,
    "uncalibratedPUp": 0.5133,
    "base": 0.4522,
    "pUp": 0.5133
   },
   "20": {
    "n": 77,
    "up": 31,
    "raw": 0.4026,
    "uncalibratedPUp": 0.4165,
    "base": 0.4522,
    "pUp": 0.3813
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3876,
    "base": 0.4522,
    "pUp": 0.5149
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5167,
    "base": 0.4522,
    "pUp": 0.3813
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4522,
    "base": 0.4522,
    "pUp": 0.3813
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4522,
    "base": 0.4522,
    "pUp": 0.5149
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 5653,
   "errorCorr": -0.172
  },
  "taro:nova": {
   "n": 7212,
   "errorCorr": 0.211
  },
  "taro:flow": {
   "n": 1473,
   "errorCorr": 0.209
  },
  "diana:nova": {
   "n": 5124,
   "errorCorr": -0.065
  },
  "diana:flow": {
   "n": 926,
   "errorCorr": 0.143
  },
  "nova:flow": {
   "n": 1306,
   "errorCorr": -0.09
  }
 },
 "redundancyFactor": {
  "taro": 0.9928,
  "diana": 1,
  "nova": 0.9963,
  "flow": 0.9965
 },
 "regimes": {
  "up_high": {
   "n": 2842,
   "blend": 0.6,
   "weights": {
    "taro": 0.3338,
    "diana": 0.0989,
    "nova": 0.2055,
    "flow": 0.3618
   },
   "acc": {
    "taro": {
     "n": 1122,
     "adjustedAcc": 64.1
    },
    "diana": {
     "n": 634,
     "adjustedAcc": 40.2
    },
    "nova": {
     "n": 886,
     "adjustedAcc": 41.1
    },
    "flow": {
     "n": 200,
     "adjustedAcc": 65.4
    }
   }
  },
  "up_low": {
   "n": 1997,
   "blend": 0.6,
   "weights": {
    "taro": 0.3375,
    "diana": 0.1017,
    "nova": 0.2436,
    "flow": 0.3172
   },
   "acc": {
    "taro": {
     "n": 706,
     "adjustedAcc": 67.2
    },
    "diana": {
     "n": 585,
     "adjustedAcc": 45.1
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
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2611,
    "diana": 0.138,
    "nova": 0.2801,
    "flow": 0.3208
   },
   "acc": {
    "taro": {
     "n": 4244,
     "adjustedAcc": 40.3
    },
    "diana": {
     "n": 3504,
     "adjustedAcc": 65.9
    },
    "nova": {
     "n": 3925,
     "adjustedAcc": 64.8
    },
    "flow": {
     "n": 768,
     "adjustedAcc": 52.9
    }
   }
  },
  "side_high": {
   "n": 5234,
   "blend": 0.6,
   "weights": {
    "taro": 0.3182,
    "diana": 0.1125,
    "nova": 0.2668,
    "flow": 0.3025
   },
   "acc": {
    "taro": {
     "n": 1841,
     "adjustedAcc": 61.9
    },
    "diana": {
     "n": 1493,
     "adjustedAcc": 53.6
    },
    "nova": {
     "n": 1571,
     "adjustedAcc": 65.4
    },
    "flow": {
     "n": 329,
     "adjustedAcc": 52.2
    }
   }
  },
  "down_low": {
   "n": 3478,
   "blend": 0.6,
   "weights": {
    "taro": 0.3063,
    "diana": 0.1311,
    "nova": 0.208,
    "flow": 0.3547
   },
   "acc": {
    "taro": {
     "n": 1111,
     "adjustedAcc": 57.3
    },
    "diana": {
     "n": 960,
     "adjustedAcc": 64.8
    },
    "nova": {
     "n": 1217,
     "adjustedAcc": 42.4
    },
    "flow": {
     "n": 190,
     "adjustedAcc": 64.0
    }
   }
  }
 },
 "currentRegime": {
  "key": "side_low",
  "trend": "side",
  "vol": "low",
  "median5": 0.99,
  "medianAbs1": 0.94,
  "advanceRatio5": 59.3,
  "medianRet1": -0.35,
  "advanceRatio1": 35.2
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 20756,
  "days": 41,
  "guardedN": 295,
  "baseline": {
   "hit": 10556,
   "miss": 9424,
   "mid": 776,
   "accuracy": 52.8
  },
  "guarded": {
   "hit": 10551,
   "miss": 9444,
   "mid": 761,
   "accuracy": 52.8
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 5697,
  "errors": 2357,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2203
   },
   {
    "label": "분석가 의견충돌",
    "count": 1316
   },
   {
    "label": "고변동성 국면",
    "count": 697
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 75
   }
  ],
  "analystErrors": {
   "taro": 1394,
   "diana": 0,
   "nova": 128,
   "flow": 296
  },
  "regimeErrors": {
   "up_low": 774,
   "down_high": 697,
   "down_low": 408,
   "unknown": 322,
   "side_low": 156
  }
 },
 "shadow": {
  "n": 5697,
  "baselineActionN": 1030,
  "baselineActionPrecision": 46.7,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 5697,
   "SELL": 0
  },
  "testDays": 10,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 58.5,
  "brier": 0.2493,
  "rawBrier": 0.2649
 },
 "prospective": {
  "n": 4500,
  "baselineActionN": 1410,
  "baselineActionPrecision": 24.3,
  "candidateActionN": 3589,
  "candidateActionPrecision": 46.3,
  "candidateCoverage": 79.8,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 434,
   "SELL": 4066
  },
  "testDays": 9,
  "testRegimes": 1,
  "brier": 0.2847,
  "rawBrier": 0.287
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
     "n": 292,
     "hit": 126,
     "raw": 0.4315,
     "uncalibratedAcc": 0.4311,
     "base": 0.4256,
     "calibratedAcc": 0.4311
    },
    "60": {
     "n": 199,
     "hit": 78,
     "raw": 0.392,
     "uncalibratedAcc": 0.395,
     "base": 0.4256,
     "calibratedAcc": 0.395
    },
    "70": {
     "n": 123,
     "hit": 56,
     "raw": 0.4553,
     "uncalibratedAcc": 0.4511,
     "base": 0.4256,
     "calibratedAcc": 0.4511
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.4796,
     "base": 0.4256,
     "calibratedAcc": 0.4796
    }
   },
   "SELL": {
    "40": {
     "n": 2046,
     "hit": 1187,
     "raw": 0.5802,
     "uncalibratedAcc": 0.5802,
     "base": 0.5816,
     "calibratedAcc": 0.5802
    },
    "45": {
     "n": 979,
     "hit": 499,
     "raw": 0.5097,
     "uncalibratedAcc": 0.5111,
     "base": 0.5816,
     "calibratedAcc": 0.5111
    },
    "35": {
     "n": 1287,
     "hit": 845,
     "raw": 0.6566,
     "uncalibratedAcc": 0.6554,
     "base": 0.5816,
     "calibratedAcc": 0.6198
    },
    "30": {
     "n": 460,
     "hit": 265,
     "raw": 0.5761,
     "uncalibratedAcc": 0.5763,
     "base": 0.5816,
     "calibratedAcc": 0.6198
    },
    "25": {
     "n": 48,
     "hit": 16,
     "raw": 0.3333,
     "uncalibratedAcc": 0.4063,
     "base": 0.5816,
     "calibratedAcc": 0.6198
    },
    "20": {
     "n": 21,
     "hit": 4,
     "raw": 0.1905,
     "uncalibratedAcc": 0.3813,
     "base": 0.5816,
     "calibratedAcc": 0.6198
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5539,
     "base": 0.5816,
     "calibratedAcc": 0.6198
    }
   }
  },
  "evaluation": {
   "n": 1030,
   "buyN": 340,
   "sellN": 690,
   "testDays": 10,
   "testRegimes": 4,
   "candidate": {
    "n": 1030,
    "tierSpreadPp": 1.7,
    "corr": 0.0874
   },
   "baseline": {
    "n": 1030,
    "tierSpreadPp": 4.1,
    "corr": 0.0466
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 1.7pp vs 기존 4.1pp)"
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
