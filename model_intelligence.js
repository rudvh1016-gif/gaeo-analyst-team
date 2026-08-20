// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-20 13:11",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1254,
    "up": 414,
    "raw": 0.3301,
    "uncalibratedPUp": 0.3303,
    "base": 0.3364,
    "pUp": 0.3451
   },
   "20": {
    "n": 786,
    "up": 282,
    "raw": 0.3588,
    "uncalibratedPUp": 0.358,
    "base": 0.3364,
    "pUp": 0.3319
   },
   "40": {
    "n": 1697,
    "up": 642,
    "raw": 0.3783,
    "uncalibratedPUp": 0.3776,
    "base": 0.3364,
    "pUp": 0.3451
   },
   "30": {
    "n": 2062,
    "up": 663,
    "raw": 0.3215,
    "uncalibratedPUp": 0.3217,
    "base": 0.3364,
    "pUp": 0.3319
   },
   "70": {
    "n": 426,
    "up": 141,
    "raw": 0.331,
    "uncalibratedPUp": 0.3313,
    "base": 0.3364,
    "pUp": 0.3451
   },
   "80": {
    "n": 351,
    "up": 99,
    "raw": 0.2821,
    "uncalibratedPUp": 0.2863,
    "base": 0.3364,
    "pUp": 0.3451
   },
   "60": {
    "n": 878,
    "up": 308,
    "raw": 0.3508,
    "uncalibratedPUp": 0.3503,
    "base": 0.3364,
    "pUp": 0.3451
   },
   "10": {
    "n": 2490,
    "up": 808,
    "raw": 0.3245,
    "uncalibratedPUp": 0.3246,
    "base": 0.3364,
    "pUp": 0.3248
   },
   "90": {
    "n": 119,
    "up": 28,
    "raw": 0.2353,
    "uncalibratedPUp": 0.2556,
    "base": 0.3364,
    "pUp": 0.3451
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3364,
    "base": 0.3364,
    "pUp": 0.3248
   }
  },
  "diana": {
   "40": {
    "n": 1218,
    "up": 647,
    "raw": 0.5312,
    "uncalibratedPUp": 0.5319,
    "base": 0.562,
    "pUp": 0.5305
   },
   "70": {
    "n": 1291,
    "up": 729,
    "raw": 0.5647,
    "uncalibratedPUp": 0.5646,
    "base": 0.562,
    "pUp": 0.5768
   },
   "50": {
    "n": 1596,
    "up": 832,
    "raw": 0.5213,
    "uncalibratedPUp": 0.5221,
    "base": 0.562,
    "pUp": 0.5305
   },
   "80": {
    "n": 1446,
    "up": 918,
    "raw": 0.6349,
    "uncalibratedPUp": 0.6334,
    "base": 0.562,
    "pUp": 0.6066
   },
   "30": {
    "n": 861,
    "up": 465,
    "raw": 0.5401,
    "uncalibratedPUp": 0.5408,
    "base": 0.562,
    "pUp": 0.5305
   },
   "90": {
    "n": 335,
    "up": 165,
    "raw": 0.4925,
    "uncalibratedPUp": 0.4982,
    "base": 0.562,
    "pUp": 0.6066
   },
   "60": {
    "n": 1294,
    "up": 763,
    "raw": 0.5896,
    "uncalibratedPUp": 0.589,
    "base": 0.562,
    "pUp": 0.5768
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.562,
    "base": 0.562,
    "pUp": 0.5305
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.562,
    "base": 0.562,
    "pUp": 0.5305
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.562,
    "base": 0.562,
    "pUp": 0.5305
   }
  },
  "nova": {
   "50": {
    "n": 1401,
    "up": 406,
    "raw": 0.2898,
    "uncalibratedPUp": 0.2908,
    "base": 0.3364,
    "pUp": 0.3306
   },
   "40": {
    "n": 3386,
    "up": 1124,
    "raw": 0.332,
    "uncalibratedPUp": 0.332,
    "base": 0.3364,
    "pUp": 0.3306
   },
   "30": {
    "n": 2904,
    "up": 1012,
    "raw": 0.3485,
    "uncalibratedPUp": 0.3484,
    "base": 0.3364,
    "pUp": 0.3306
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2059,
    "base": 0.3364,
    "pUp": 0.3833
   },
   "60": {
    "n": 1289,
    "up": 515,
    "raw": 0.3995,
    "uncalibratedPUp": 0.3981,
    "base": 0.3364,
    "pUp": 0.3833
   },
   "20": {
    "n": 1025,
    "up": 321,
    "raw": 0.3132,
    "uncalibratedPUp": 0.3138,
    "base": 0.3364,
    "pUp": 0.315
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3255,
    "base": 0.3364,
    "pUp": 0.3833
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2968,
    "base": 0.3364,
    "pUp": 0.3833
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3364,
    "base": 0.3364,
    "pUp": 0.315
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3364,
    "base": 0.3364,
    "pUp": 0.315
   }
  },
  "flow": {
   "50": {
    "n": 6311,
    "up": 2164,
    "raw": 0.3429,
    "uncalibratedPUp": 0.3429,
    "base": 0.3364,
    "pUp": 0.3429
   },
   "70": {
    "n": 114,
    "up": 50,
    "raw": 0.4386,
    "uncalibratedPUp": 0.4173,
    "base": 0.3364,
    "pUp": 0.3841
   },
   "40": {
    "n": 2830,
    "up": 913,
    "raw": 0.3226,
    "uncalibratedPUp": 0.3228,
    "base": 0.3364,
    "pUp": 0.3228
   },
   "30": {
    "n": 353,
    "up": 99,
    "raw": 0.2805,
    "uncalibratedPUp": 0.2848,
    "base": 0.3364,
    "pUp": 0.2955
   },
   "60": {
    "n": 387,
    "up": 140,
    "raw": 0.3618,
    "uncalibratedPUp": 0.3599,
    "base": 0.3364,
    "pUp": 0.3599
   },
   "20": {
    "n": 63,
    "up": 19,
    "raw": 0.3016,
    "uncalibratedPUp": 0.3128,
    "base": 0.3364,
    "pUp": 0.2955
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2883,
    "base": 0.3364,
    "pUp": 0.3841
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3364,
    "base": 0.3364,
    "pUp": 0.2955
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3364,
    "base": 0.3364,
    "pUp": 0.2955
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3364,
    "base": 0.3364,
    "pUp": 0.3841
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 3667,
   "errorCorr": -0.142
  },
  "taro:nova": {
   "n": 5321,
   "errorCorr": 0.447
  },
  "taro:flow": {
   "n": 1126,
   "errorCorr": 0.254
  },
  "diana:nova": {
   "n": 2841,
   "errorCorr": -0.161
  },
  "diana:flow": {
   "n": 605,
   "errorCorr": 0.163
  },
  "nova:flow": {
   "n": 918,
   "errorCorr": -0.01
  }
 },
 "redundancyFactor": {
  "taro": 0.976,
  "diana": 0.9992,
  "nova": 0.9822,
  "flow": 0.993
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2908,
    "diana": 0.1055,
    "nova": 0.2838,
    "flow": 0.3199
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
    "taro": 0.2809,
    "diana": 0.1148,
    "nova": 0.3248,
    "flow": 0.2795
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
    "taro": 0.3021,
    "diana": 0.1,
    "nova": 0.2975,
    "flow": 0.3005
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
   "n": 8198,
   "blend": 0.6,
   "weights": {
    "taro": 0.2586,
    "diana": 0.1357,
    "nova": 0.3069,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 3020,
     "adjustedAcc": 49.8
    },
    "diana": {
     "n": 2147,
     "adjustedAcc": 59.9
    },
    "nova": {
     "n": 2501,
     "adjustedAcc": 56.1
    },
    "flow": {
     "n": 530,
     "adjustedAcc": 51.5
    }
   }
  },
  "down_low": {
   "n": 2247,
   "blend": 0.6,
   "weights": {
    "taro": 0.3116,
    "diana": 0.1262,
    "nova": 0.2737,
    "flow": 0.2885
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 629,
     "adjustedAcc": 61.1
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
  "median5": -2.32,
  "medianAbs1": 1.56,
  "advanceRatio5": 29.8,
  "medianRet1": 0.85,
  "advanceRatio1": 67.1
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 15570,
  "days": 32,
  "guardedN": 295,
  "baseline": {
   "hit": 7698,
   "miss": 7250,
   "mid": 622,
   "accuracy": 51.5
  },
  "guarded": {
   "hit": 7692,
   "miss": 7271,
   "mid": 607,
   "accuracy": 51.4
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 3007,
  "errors": 1495,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1160
   },
   {
    "label": "분석가 의견충돌",
    "count": 859
   },
   {
    "label": "고변동성 국면",
    "count": 492
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 93
   }
  ],
  "analystErrors": {
   "taro": 731,
   "diana": 0,
   "nova": 351,
   "flow": 186
  },
  "regimeErrors": {
   "up_low": 1003,
   "up_high": 492
  }
 },
 "shadow": {
  "n": 3007,
  "baselineActionN": 931,
  "baselineActionPrecision": 22.8,
  "candidateActionN": 2593,
  "candidateActionPrecision": 43.2,
  "candidateCoverage": 86.2,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 11,
   "SELL": 2996
  },
  "testDays": 6,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 37.4,
  "brier": 0.2838,
  "rawBrier": 0.2706
 },
 "prospective": {
  "n": 3500,
  "baselineActionN": 1207,
  "baselineActionPrecision": 19.5,
  "candidateActionN": 2749,
  "candidateActionPrecision": 34.7,
  "candidateCoverage": 78.5,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 350,
   "SELL": 3150
  },
  "testDays": 7,
  "testRegimes": 1,
  "brier": 0.316,
  "rawBrier": 0.2877
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
     "hit": 1169,
     "raw": 0.7247,
     "uncalibratedAcc": 0.7246,
     "base": 0.7119,
     "calibratedAcc": 0.7198
    },
    "45": {
     "n": 719,
     "hit": 486,
     "raw": 0.6759,
     "uncalibratedAcc": 0.6769,
     "base": 0.7119,
     "calibratedAcc": 0.6769
    },
    "35": {
     "n": 1118,
     "hit": 829,
     "raw": 0.7415,
     "uncalibratedAcc": 0.741,
     "base": 0.7119,
     "calibratedAcc": 0.7198
    },
    "30": {
     "n": 405,
     "hit": 261,
     "raw": 0.6444,
     "uncalibratedAcc": 0.6476,
     "base": 0.7119,
     "calibratedAcc": 0.7198
    },
    "25": {
     "n": 23,
     "hit": 16,
     "raw": 0.6957,
     "uncalibratedAcc": 0.7032,
     "base": 0.7119,
     "calibratedAcc": 0.7198
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6926,
     "base": 0.7119,
     "calibratedAcc": 0.7198
    }
   }
  },
  "evaluation": {
   "n": 931,
   "buyN": 264,
   "sellN": 667,
   "testDays": 6,
   "testRegimes": 2,
   "candidate": {
    "n": 922,
    "tierSpreadPp": -11.1,
    "corr": -0.1575
   },
   "baseline": {
    "n": 931,
    "tierSpreadPp": -10.3,
    "corr": -0.0789
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -11.1pp vs 기존 -10.3pp)"
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
