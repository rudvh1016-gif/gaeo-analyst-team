// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-21 09:17",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1254,
    "up": 414,
    "raw": 0.3301,
    "uncalibratedPUp": 0.3303,
    "base": 0.336,
    "pUp": 0.3451
   },
   "20": {
    "n": 786,
    "up": 282,
    "raw": 0.3588,
    "uncalibratedPUp": 0.3579,
    "base": 0.336,
    "pUp": 0.3319
   },
   "40": {
    "n": 1697,
    "up": 642,
    "raw": 0.3783,
    "uncalibratedPUp": 0.3776,
    "base": 0.336,
    "pUp": 0.3451
   },
   "30": {
    "n": 2062,
    "up": 663,
    "raw": 0.3215,
    "uncalibratedPUp": 0.3217,
    "base": 0.336,
    "pUp": 0.3319
   },
   "70": {
    "n": 426,
    "up": 141,
    "raw": 0.331,
    "uncalibratedPUp": 0.3313,
    "base": 0.336,
    "pUp": 0.3451
   },
   "80": {
    "n": 351,
    "up": 99,
    "raw": 0.2821,
    "uncalibratedPUp": 0.2863,
    "base": 0.336,
    "pUp": 0.3451
   },
   "60": {
    "n": 878,
    "up": 308,
    "raw": 0.3508,
    "uncalibratedPUp": 0.3503,
    "base": 0.336,
    "pUp": 0.3451
   },
   "10": {
    "n": 2490,
    "up": 804,
    "raw": 0.3229,
    "uncalibratedPUp": 0.323,
    "base": 0.336,
    "pUp": 0.3232
   },
   "90": {
    "n": 119,
    "up": 28,
    "raw": 0.2353,
    "uncalibratedPUp": 0.2556,
    "base": 0.336,
    "pUp": 0.3451
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.336,
    "base": 0.336,
    "pUp": 0.3232
   }
  },
  "diana": {
   "40": {
    "n": 1299,
    "up": 690,
    "raw": 0.5312,
    "uncalibratedPUp": 0.5317,
    "base": 0.5533,
    "pUp": 0.5266
   },
   "70": {
    "n": 1372,
    "up": 761,
    "raw": 0.5547,
    "uncalibratedPUp": 0.5546,
    "base": 0.5533,
    "pUp": 0.5653
   },
   "50": {
    "n": 1702,
    "up": 874,
    "raw": 0.5135,
    "uncalibratedPUp": 0.5142,
    "base": 0.5533,
    "pUp": 0.5266
   },
   "80": {
    "n": 1531,
    "up": 945,
    "raw": 0.6172,
    "uncalibratedPUp": 0.616,
    "base": 0.5533,
    "pUp": 0.5921
   },
   "30": {
    "n": 913,
    "up": 493,
    "raw": 0.54,
    "uncalibratedPUp": 0.5404,
    "base": 0.5533,
    "pUp": 0.5266
   },
   "90": {
    "n": 355,
    "up": 174,
    "raw": 0.4901,
    "uncalibratedPUp": 0.4951,
    "base": 0.5533,
    "pUp": 0.5921
   },
   "60": {
    "n": 1383,
    "up": 797,
    "raw": 0.5763,
    "uncalibratedPUp": 0.5758,
    "base": 0.5533,
    "pUp": 0.5653
   },
   "20": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5354,
    "base": 0.5533,
    "pUp": 0.5266
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5533,
    "base": 0.5533,
    "pUp": 0.5266
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5533,
    "base": 0.5533,
    "pUp": 0.5266
   }
  },
  "nova": {
   "50": {
    "n": 1401,
    "up": 406,
    "raw": 0.2898,
    "uncalibratedPUp": 0.2908,
    "base": 0.336,
    "pUp": 0.3303
   },
   "40": {
    "n": 3386,
    "up": 1124,
    "raw": 0.332,
    "uncalibratedPUp": 0.332,
    "base": 0.336,
    "pUp": 0.3303
   },
   "30": {
    "n": 2904,
    "up": 1010,
    "raw": 0.3478,
    "uncalibratedPUp": 0.3477,
    "base": 0.336,
    "pUp": 0.3303
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2058,
    "base": 0.336,
    "pUp": 0.3833
   },
   "60": {
    "n": 1289,
    "up": 515,
    "raw": 0.3995,
    "uncalibratedPUp": 0.3981,
    "base": 0.336,
    "pUp": 0.3833
   },
   "20": {
    "n": 1025,
    "up": 319,
    "raw": 0.3112,
    "uncalibratedPUp": 0.3119,
    "base": 0.336,
    "pUp": 0.3132
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3251,
    "base": 0.336,
    "pUp": 0.3833
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2965,
    "base": 0.336,
    "pUp": 0.3833
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.336,
    "base": 0.336,
    "pUp": 0.3132
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.336,
    "base": 0.336,
    "pUp": 0.3132
   }
  },
  "flow": {
   "50": {
    "n": 6311,
    "up": 2160,
    "raw": 0.3423,
    "uncalibratedPUp": 0.3422,
    "base": 0.336,
    "pUp": 0.3422
   },
   "70": {
    "n": 114,
    "up": 50,
    "raw": 0.4386,
    "uncalibratedPUp": 0.4172,
    "base": 0.336,
    "pUp": 0.3839
   },
   "40": {
    "n": 2830,
    "up": 913,
    "raw": 0.3226,
    "uncalibratedPUp": 0.3228,
    "base": 0.336,
    "pUp": 0.3228
   },
   "30": {
    "n": 353,
    "up": 99,
    "raw": 0.2805,
    "uncalibratedPUp": 0.2848,
    "base": 0.336,
    "pUp": 0.2954
   },
   "60": {
    "n": 387,
    "up": 140,
    "raw": 0.3618,
    "uncalibratedPUp": 0.3599,
    "base": 0.336,
    "pUp": 0.3599
   },
   "20": {
    "n": 63,
    "up": 19,
    "raw": 0.3016,
    "uncalibratedPUp": 0.3127,
    "base": 0.336,
    "pUp": 0.2954
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.288,
    "base": 0.336,
    "pUp": 0.3839
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.336,
    "base": 0.336,
    "pUp": 0.2954
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.336,
    "base": 0.336,
    "pUp": 0.2954
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.336,
    "base": 0.336,
    "pUp": 0.3839
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 3883,
   "errorCorr": -0.14
  },
  "taro:nova": {
   "n": 5322,
   "errorCorr": 0.446
  },
  "taro:flow": {
   "n": 1126,
   "errorCorr": 0.254
  },
  "diana:nova": {
   "n": 3099,
   "errorCorr": -0.166
  },
  "diana:flow": {
   "n": 644,
   "errorCorr": 0.154
  },
  "nova:flow": {
   "n": 918,
   "errorCorr": -0.01
  }
 },
 "redundancyFactor": {
  "taro": 0.976,
  "diana": 0.9997,
  "nova": 0.9822,
  "flow": 0.9935
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.285,
    "diana": 0.1034,
    "nova": 0.2866,
    "flow": 0.3249
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
   "n": 5935,
   "blend": 0.6,
   "weights": {
    "taro": 0.2763,
    "diana": 0.1097,
    "nova": 0.3293,
    "flow": 0.2847
   },
   "acc": {
    "taro": {
     "n": 2229,
     "adjustedAcc": 64.1
    },
    "diana": {
     "n": 1491,
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
   "n": 8200,
   "blend": 0.6,
   "weights": {
    "taro": 0.2537,
    "diana": 0.1329,
    "nova": 0.3101,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 3021,
     "adjustedAcc": 49.9
    },
    "diana": {
     "n": 2147,
     "adjustedAcc": 59.9
    },
    "nova": {
     "n": 2502,
     "adjustedAcc": 56.2
    },
    "flow": {
     "n": 530,
     "adjustedAcc": 51.5
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
  "median5": -4.75,
  "medianAbs1": 2.54,
  "advanceRatio5": 16.7,
  "medianRet1": -2.49,
  "advanceRatio1": 5.7
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
   "hit": 7911,
   "miss": 7535,
   "mid": 628,
   "accuracy": 51.2
  },
  "guarded": {
   "hit": 7905,
   "miss": 7556,
   "mid": 613,
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
  "matured": 3511,
  "errors": 1782,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1443
   },
   {
    "label": "분석가 의견충돌",
    "count": 1033
   },
   {
    "label": "고변동성 국면",
    "count": 492
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 98
   }
  ],
  "analystErrors": {
   "taro": 968,
   "diana": 0,
   "nova": 353,
   "flow": 208
  },
  "regimeErrors": {
   "up_low": 1290,
   "up_high": 492
  }
 },
 "shadow": {
  "n": 3511,
  "baselineActionN": 1034,
  "baselineActionPrecision": 26.3,
  "candidateActionN": 3054,
  "candidateActionPrecision": 49.7,
  "candidateCoverage": 87.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 8,
   "SELL": 3503
  },
  "testDays": 7,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 43.3,
  "brier": 0.2684,
  "rawBrier": 0.2732
 },
 "prospective": {
  "n": 4000,
  "baselineActionN": 1309,
  "baselineActionPrecision": 22.5,
  "candidateActionN": 3176,
  "candidateActionPrecision": 41.9,
  "candidateCoverage": 79.4,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 391,
   "SELL": 3609
  },
  "testDays": 8,
  "testRegimes": 1,
  "brier": 0.2968,
  "rawBrier": 0.2872
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
     "n": 246,
     "hit": 86,
     "raw": 0.3496,
     "uncalibratedAcc": 0.3492,
     "base": 0.3441,
     "calibratedAcc": 0.3492
    },
    "60": {
     "n": 171,
     "hit": 54,
     "raw": 0.3158,
     "uncalibratedAcc": 0.3188,
     "base": 0.3441,
     "calibratedAcc": 0.3188
    },
    "70": {
     "n": 107,
     "hit": 40,
     "raw": 0.3738,
     "uncalibratedAcc": 0.3692,
     "base": 0.3441,
     "calibratedAcc": 0.3675
    },
    "75": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.3583,
     "base": 0.3441,
     "calibratedAcc": 0.3675
    }
   },
   "SELL": {
    "40": {
     "n": 1613,
     "hit": 1171,
     "raw": 0.726,
     "uncalibratedAcc": 0.7258,
     "base": 0.7129,
     "calibratedAcc": 0.721
    },
    "45": {
     "n": 719,
     "hit": 486,
     "raw": 0.6759,
     "uncalibratedAcc": 0.6769,
     "base": 0.7129,
     "calibratedAcc": 0.6769
    },
    "35": {
     "n": 1118,
     "hit": 831,
     "raw": 0.7433,
     "uncalibratedAcc": 0.7428,
     "base": 0.7129,
     "calibratedAcc": 0.721
    },
    "30": {
     "n": 405,
     "hit": 261,
     "raw": 0.6444,
     "uncalibratedAcc": 0.6477,
     "base": 0.7129,
     "calibratedAcc": 0.721
    },
    "25": {
     "n": 23,
     "hit": 16,
     "raw": 0.6957,
     "uncalibratedAcc": 0.7037,
     "base": 0.7129,
     "calibratedAcc": 0.721
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6935,
     "base": 0.7129,
     "calibratedAcc": 0.721
    }
   }
  },
  "evaluation": {
   "n": 1034,
   "buyN": 311,
   "sellN": 723,
   "testDays": 7,
   "testRegimes": 2,
   "candidate": {
    "n": 1025,
    "tierSpreadPp": -5.0,
    "corr": -0.0924
   },
   "baseline": {
    "n": 1034,
    "tierSpreadPp": -7.3,
    "corr": -0.0584
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -5.0pp vs 기존 -7.3pp)"
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
