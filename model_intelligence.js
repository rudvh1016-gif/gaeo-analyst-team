// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-18 09:45",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1133,
    "up": 365,
    "raw": 0.3222,
    "uncalibratedPUp": 0.322,
    "base": 0.3171,
    "pUp": 0.3344
   },
   "20": {
    "n": 753,
    "up": 260,
    "raw": 0.3453,
    "uncalibratedPUp": 0.3442,
    "base": 0.3171,
    "pUp": 0.3015
   },
   "40": {
    "n": 1510,
    "up": 544,
    "raw": 0.3603,
    "uncalibratedPUp": 0.3594,
    "base": 0.3171,
    "pUp": 0.3344
   },
   "30": {
    "n": 1765,
    "up": 492,
    "raw": 0.2788,
    "uncalibratedPUp": 0.2794,
    "base": 0.3171,
    "pUp": 0.3015
   },
   "70": {
    "n": 382,
    "up": 123,
    "raw": 0.322,
    "uncalibratedPUp": 0.3216,
    "base": 0.3171,
    "pUp": 0.3344
   },
   "80": {
    "n": 324,
    "up": 90,
    "raw": 0.2778,
    "uncalibratedPUp": 0.2811,
    "base": 0.3171,
    "pUp": 0.3344
   },
   "60": {
    "n": 795,
    "up": 278,
    "raw": 0.3497,
    "uncalibratedPUp": 0.3485,
    "base": 0.3171,
    "pUp": 0.3344
   },
   "10": {
    "n": 2287,
    "up": 695,
    "raw": 0.3039,
    "uncalibratedPUp": 0.3041,
    "base": 0.3171,
    "pUp": 0.3015
   },
   "90": {
    "n": 114,
    "up": 27,
    "raw": 0.2368,
    "uncalibratedPUp": 0.2536,
    "base": 0.3171,
    "pUp": 0.3344
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3171,
    "base": 0.3171,
    "pUp": 0.3015
   }
  },
  "diana": {
   "40": {
    "n": 1072,
    "up": 536,
    "raw": 0.5,
    "uncalibratedPUp": 0.5011,
    "base": 0.541,
    "pUp": 0.5003
   },
   "70": {
    "n": 1133,
    "up": 631,
    "raw": 0.5569,
    "uncalibratedPUp": 0.5565,
    "base": 0.541,
    "pUp": 0.5637
   },
   "50": {
    "n": 1393,
    "up": 685,
    "raw": 0.4917,
    "uncalibratedPUp": 0.4928,
    "base": 0.541,
    "pUp": 0.5003
   },
   "80": {
    "n": 1258,
    "up": 783,
    "raw": 0.6224,
    "uncalibratedPUp": 0.6205,
    "base": 0.541,
    "pUp": 0.5948
   },
   "30": {
    "n": 758,
    "up": 384,
    "raw": 0.5066,
    "uncalibratedPUp": 0.5079,
    "base": 0.541,
    "pUp": 0.5003
   },
   "90": {
    "n": 285,
    "up": 138,
    "raw": 0.4842,
    "uncalibratedPUp": 0.4896,
    "base": 0.541,
    "pUp": 0.5948
   },
   "60": {
    "n": 1130,
    "up": 646,
    "raw": 0.5717,
    "uncalibratedPUp": 0.5709,
    "base": 0.541,
    "pUp": 0.5637
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.541,
    "base": 0.541,
    "pUp": 0.5003
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.541,
    "base": 0.541,
    "pUp": 0.5003
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.541,
    "base": 0.541,
    "pUp": 0.5003
   }
  },
  "nova": {
   "50": {
    "n": 1382,
    "up": 403,
    "raw": 0.2916,
    "uncalibratedPUp": 0.2921,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "40": {
    "n": 3265,
    "up": 1073,
    "raw": 0.3286,
    "uncalibratedPUp": 0.3285,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "30": {
    "n": 2771,
    "up": 975,
    "raw": 0.3519,
    "uncalibratedPUp": 0.3515,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.199,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "60": {
    "n": 711,
    "up": 131,
    "raw": 0.1842,
    "uncalibratedPUp": 0.1896,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "20": {
    "n": 876,
    "up": 285,
    "raw": 0.3253,
    "uncalibratedPUp": 0.3251,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3069,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2798,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3171,
    "base": 0.3171,
    "pUp": 0.3171
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3171,
    "base": 0.3171,
    "pUp": 0.3171
   }
  },
  "flow": {
   "50": {
    "n": 5652,
    "up": 1862,
    "raw": 0.3294,
    "uncalibratedPUp": 0.3294,
    "base": 0.3171,
    "pUp": 0.3294
   },
   "70": {
    "n": 106,
    "up": 44,
    "raw": 0.4151,
    "uncalibratedPUp": 0.3935,
    "base": 0.3171,
    "pUp": 0.3627
   },
   "40": {
    "n": 2567,
    "up": 746,
    "raw": 0.2906,
    "uncalibratedPUp": 0.2909,
    "base": 0.3171,
    "pUp": 0.2909
   },
   "30": {
    "n": 321,
    "up": 84,
    "raw": 0.2617,
    "uncalibratedPUp": 0.2664,
    "base": 0.3171,
    "pUp": 0.2734
   },
   "60": {
    "n": 360,
    "up": 125,
    "raw": 0.3472,
    "uncalibratedPUp": 0.3449,
    "base": 0.3171,
    "pUp": 0.3449
   },
   "20": {
    "n": 53,
    "up": 13,
    "raw": 0.2453,
    "uncalibratedPUp": 0.2712,
    "base": 0.3171,
    "pUp": 0.2734
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2798,
    "base": 0.3171,
    "pUp": 0.3627
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3171,
    "base": 0.3171,
    "pUp": 0.2734
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3171,
    "base": 0.3171,
    "pUp": 0.2734
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3171,
    "base": 0.3171,
    "pUp": 0.3627
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 3224,
   "errorCorr": -0.163
  },
  "taro:nova": {
   "n": 4653,
   "errorCorr": 0.634
  },
  "taro:flow": {
   "n": 1013,
   "errorCorr": 0.218
  },
  "diana:nova": {
   "n": 2376,
   "errorCorr": -0.189
  },
  "diana:flow": {
   "n": 546,
   "errorCorr": 0.136
  },
  "nova:flow": {
   "n": 799,
   "errorCorr": 0.06
  }
 },
 "redundancyFactor": {
  "taro": 0.9669,
  "diana": 1,
  "nova": 0.9709,
  "flow": 0.9959
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.3033,
    "diana": 0.1016,
    "nova": 0.2785,
    "flow": 0.3166
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
    "diana": 0.1107,
    "nova": 0.3191,
    "flow": 0.2769
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
   "n": 926,
   "blend": 0.537,
   "weights": {
    "taro": 0.3058,
    "diana": 0.0971,
    "nova": 0.3149,
    "flow": 0.2822
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
   "n": 7330,
   "blend": 0.6,
   "weights": {
    "taro": 0.2848,
    "diana": 0.1307,
    "nova": 0.2826,
    "flow": 0.3019
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
    "diana": 0.1083,
    "nova": 0.2723,
    "flow": 0.2894
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
  "median5": 0.0,
  "medianAbs1": 2.04,
  "advanceRatio5": 49.0,
  "medianRet1": -1.18,
  "advanceRatio1": 30.9
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
   "hit": 7170,
   "miss": 6816,
   "mid": 580,
   "accuracy": 51.3
  },
  "guarded": {
   "hit": 7162,
   "miss": 6840,
   "mid": 564,
   "accuracy": 51.1
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
  "errors": 1817,
  "patterns": [
   {
    "label": "분석가 의견충돌",
    "count": 1217
   },
   {
    "label": "경계점수 판단",
    "count": 1169
   },
   {
    "label": "고변동성 국면",
    "count": 866
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 146
   }
  ],
  "analystErrors": {
   "taro": 778,
   "diana": 0,
   "nova": 1002,
   "flow": 157
  },
  "regimeErrors": {
   "up_high": 866,
   "up_low": 557,
   "down_low": 394
  }
 },
 "shadow": {
  "n": 3003,
  "baselineActionN": 1242,
  "baselineActionPrecision": 14.9,
  "candidateActionN": 2673,
  "candidateActionPrecision": 18.3,
  "candidateCoverage": 89.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 3003
  },
  "testDays": 6,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 16.3,
  "brier": 0.3613,
  "rawBrier": 0.2672
 },
 "prospective": {
  "n": 2500,
  "baselineActionN": 999,
  "baselineActionPrecision": 15.6,
  "candidateActionN": 2045,
  "candidateActionPrecision": 19.8,
  "candidateCoverage": 81.8,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 168,
   "SELL": 2332
  },
  "testDays": 5,
  "testRegimes": 1,
  "brier": 0.3647,
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
     "n": 237,
     "hit": 80,
     "raw": 0.3376,
     "uncalibratedAcc": 0.3369,
     "base": 0.3286,
     "calibratedAcc": 0.3369
    },
    "60": {
     "n": 153,
     "hit": 45,
     "raw": 0.2941,
     "uncalibratedAcc": 0.2981,
     "base": 0.3286,
     "calibratedAcc": 0.2981
    },
    "70": {
     "n": 101,
     "hit": 36,
     "raw": 0.3564,
     "uncalibratedAcc": 0.3518,
     "base": 0.3286,
     "calibratedAcc": 0.3507
    },
    "75": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.3442,
     "base": 0.3286,
     "calibratedAcc": 0.3507
    }
   },
   "SELL": {
    "40": {
     "n": 1490,
     "hit": 1105,
     "raw": 0.7416,
     "uncalibratedAcc": 0.7414,
     "base": 0.7292,
     "calibratedAcc": 0.731
    },
    "45": {
     "n": 610,
     "hit": 439,
     "raw": 0.7197,
     "uncalibratedAcc": 0.72,
     "base": 0.7292,
     "calibratedAcc": 0.72
    },
    "35": {
     "n": 1078,
     "hit": 807,
     "raw": 0.7486,
     "uncalibratedAcc": 0.7483,
     "base": 0.7292,
     "calibratedAcc": 0.731
    },
    "30": {
     "n": 399,
     "hit": 258,
     "raw": 0.6466,
     "uncalibratedAcc": 0.6506,
     "base": 0.7292,
     "calibratedAcc": 0.731
    },
    "25": {
     "n": 21,
     "hit": 15,
     "raw": 0.7143,
     "uncalibratedAcc": 0.7215,
     "base": 0.7292,
     "calibratedAcc": 0.731
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.7083,
     "base": 0.7292,
     "calibratedAcc": 0.731
    }
   }
  },
  "evaluation": {
   "n": 1242,
   "buyN": 162,
   "sellN": 1080,
   "testDays": 6,
   "testRegimes": 3,
   "candidate": {
    "n": 1213,
    "tierSpreadPp": -16.1,
    "corr": -0.396
   },
   "baseline": {
    "n": 1242,
    "tierSpreadPp": -3.1,
    "corr": -0.0492
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -16.1pp vs 기존 -3.1pp)"
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
