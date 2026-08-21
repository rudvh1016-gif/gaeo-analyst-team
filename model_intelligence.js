// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-21 09:49",
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
    "n": 1299,
    "up": 684,
    "raw": 0.5266,
    "uncalibratedPUp": 0.5271,
    "base": 0.5524,
    "pUp": 0.5251
   },
   "70": {
    "n": 1372,
    "up": 762,
    "raw": 0.5554,
    "uncalibratedPUp": 0.5553,
    "base": 0.5524,
    "pUp": 0.5642
   },
   "50": {
    "n": 1702,
    "up": 873,
    "raw": 0.5129,
    "uncalibratedPUp": 0.5136,
    "base": 0.5524,
    "pUp": 0.5251
   },
   "80": {
    "n": 1531,
    "up": 946,
    "raw": 0.6179,
    "uncalibratedPUp": 0.6166,
    "base": 0.5524,
    "pUp": 0.5926
   },
   "30": {
    "n": 913,
    "up": 494,
    "raw": 0.5411,
    "uncalibratedPUp": 0.5414,
    "base": 0.5524,
    "pUp": 0.5251
   },
   "90": {
    "n": 355,
    "up": 174,
    "raw": 0.4901,
    "uncalibratedPUp": 0.495,
    "base": 0.5524,
    "pUp": 0.5926
   },
   "60": {
    "n": 1383,
    "up": 793,
    "raw": 0.5734,
    "uncalibratedPUp": 0.5729,
    "base": 0.5524,
    "pUp": 0.5642
   },
   "20": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5345,
    "base": 0.5524,
    "pUp": 0.5251
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5524,
    "base": 0.5524,
    "pUp": 0.5251
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5524,
    "base": 0.5524,
    "pUp": 0.5251
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
   "n": 3880,
   "errorCorr": -0.14
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
   "n": 3098,
   "errorCorr": -0.165
  },
  "diana:flow": {
   "n": 642,
   "errorCorr": 0.152
  },
  "nova:flow": {
   "n": 1000,
   "errorCorr": -0.015
  }
 },
 "redundancyFactor": {
  "taro": 0.9822,
  "diana": 0.9999,
  "nova": 0.9877,
  "flow": 0.9944
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2851,
    "diana": 0.1034,
    "nova": 0.2865,
    "flow": 0.325
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
   "n": 5934,
   "blend": 0.6,
   "weights": {
    "taro": 0.2764,
    "diana": 0.1098,
    "nova": 0.3292,
    "flow": 0.2847
   },
   "acc": {
    "taro": {
     "n": 2229,
     "adjustedAcc": 64.1
    },
    "diana": {
     "n": 1490,
     "adjustedAcc": 50.8
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
    "taro": 0.2964,
    "diana": 0.0979,
    "nova": 0.3007,
    "flow": 0.305
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
    "taro": 0.2397,
    "diana": 0.132,
    "nova": 0.3243,
    "flow": 0.304
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
    "taro": 0.3063,
    "diana": 0.1228,
    "nova": 0.2771,
    "flow": 0.2938
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
  "key": "down_high",
  "trend": "down",
  "vol": "high",
  "median5": -4.88,
  "medianAbs1": 2.59,
  "advanceRatio5": 17.9,
  "medianRet1": -2.52,
  "advanceRatio1": 8.9
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 16074,
  "days": 33,
  "guardedN": 295,
  "baseline": {
   "hit": 7916,
   "miss": 7529,
   "mid": 629,
   "accuracy": 51.3
  },
  "guarded": {
   "hit": 7910,
   "miss": 7550,
   "mid": 614,
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
  "matured": 3011,
  "errors": 1501,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1291
   },
   {
    "label": "분석가 의견충돌",
    "count": 786
   },
   {
    "label": "고변동성 국면",
    "count": 217
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 73
   }
  ],
  "analystErrors": {
   "taro": 902,
   "diana": 0,
   "nova": 100,
   "flow": 195
  },
  "regimeErrors": {
   "up_low": 1284,
   "up_high": 217
  }
 },
 "shadow": {
  "n": 3011,
  "baselineActionN": 792,
  "baselineActionPrecision": 28.8,
  "candidateActionN": 2503,
  "candidateActionPrecision": 55.2,
  "candidateCoverage": 83.1,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 169,
   "SELL": 2842
  },
  "testDays": 6,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 49.4,
  "brier": 0.2527,
  "rawBrier": 0.2745
 },
 "prospective": {
  "n": 4000,
  "baselineActionN": 1307,
  "baselineActionPrecision": 22.6,
  "candidateActionN": 3171,
  "candidateActionPrecision": 41.8,
  "candidateCoverage": 79.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 391,
   "SELL": 3609
  },
  "testDays": 8,
  "testRegimes": 1,
  "brier": 0.2976,
  "rawBrier": 0.2871
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
   "n": 792,
   "buyN": 299,
   "sellN": 493,
   "testDays": 6,
   "testRegimes": 2,
   "candidate": {
    "n": 790,
    "tierSpreadPp": 0.0,
    "corr": -0.0554
   },
   "baseline": {
    "n": 792,
    "tierSpreadPp": -15.2,
    "corr": -0.1121
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 0.0pp vs 기존 -15.2pp)"
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
