// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-20 10:11",
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
    "up": 649,
    "raw": 0.5328,
    "uncalibratedPUp": 0.5336,
    "base": 0.5629,
    "pUp": 0.5311
   },
   "70": {
    "n": 1291,
    "up": 729,
    "raw": 0.5647,
    "uncalibratedPUp": 0.5646,
    "base": 0.5629,
    "pUp": 0.5776
   },
   "50": {
    "n": 1596,
    "up": 832,
    "raw": 0.5213,
    "uncalibratedPUp": 0.5221,
    "base": 0.5629,
    "pUp": 0.5311
   },
   "80": {
    "n": 1446,
    "up": 919,
    "raw": 0.6355,
    "uncalibratedPUp": 0.6341,
    "base": 0.5629,
    "pUp": 0.6082
   },
   "30": {
    "n": 861,
    "up": 465,
    "raw": 0.5401,
    "uncalibratedPUp": 0.5408,
    "base": 0.5629,
    "pUp": 0.5311
   },
   "90": {
    "n": 335,
    "up": 167,
    "raw": 0.4985,
    "uncalibratedPUp": 0.5038,
    "base": 0.5629,
    "pUp": 0.6082
   },
   "60": {
    "n": 1294,
    "up": 765,
    "raw": 0.5912,
    "uncalibratedPUp": 0.5905,
    "base": 0.5629,
    "pUp": 0.5776
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5629,
    "base": 0.5629,
    "pUp": 0.5311
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5629,
    "base": 0.5629,
    "pUp": 0.5311
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5629,
    "base": 0.5629,
    "pUp": 0.5311
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
   "errorCorr": -0.141
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
   "errorCorr": -0.163
  },
  "diana:flow": {
   "n": 604,
   "errorCorr": 0.165
  },
  "nova:flow": {
   "n": 918,
   "errorCorr": -0.01
  }
 },
 "redundancyFactor": {
  "taro": 0.976,
  "diana": 0.9991,
  "nova": 0.9822,
  "flow": 0.9929
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2907,
    "diana": 0.1053,
    "nova": 0.2832,
    "flow": 0.3208
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
    "diana": 0.1146,
    "nova": 0.3243,
    "flow": 0.2803
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
    "diana": 0.0997,
    "nova": 0.2969,
    "flow": 0.3013
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
    "diana": 0.1354,
    "nova": 0.3064,
    "flow": 0.2996
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
   "n": 2249,
   "blend": 0.6,
   "weights": {
    "taro": 0.3117,
    "diana": 0.1255,
    "nova": 0.2734,
    "flow": 0.2894
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 631,
     "adjustedAcc": 60.8
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
  "median5": -2.12,
  "medianAbs1": 1.56,
  "advanceRatio5": 28.8,
  "medianRet1": 1.07,
  "advanceRatio1": 68.9
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
   "hit": 7702,
   "miss": 7246,
   "mid": 622,
   "accuracy": 51.5
  },
  "guarded": {
   "hit": 7696,
   "miss": 7267,
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
  "errors": 1491,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1155
   },
   {
    "label": "분석가 의견충돌",
    "count": 858
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
   "taro": 728,
   "diana": 0,
   "nova": 351,
   "flow": 185
  },
  "regimeErrors": {
   "up_low": 999,
   "up_high": 492
  }
 },
 "shadow": {
  "n": 3007,
  "baselineActionN": 931,
  "baselineActionPrecision": 22.6,
  "candidateActionN": 2578,
  "candidateActionPrecision": 43.2,
  "candidateCoverage": 85.7,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 11,
   "SELL": 2996
  },
  "testDays": 6,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 37.2,
  "brier": 0.2834,
  "rawBrier": 0.2707
 },
 "prospective": {
  "n": 3500,
  "baselineActionN": 1207,
  "baselineActionPrecision": 19.3,
  "candidateActionN": 2738,
  "candidateActionPrecision": 34.6,
  "candidateCoverage": 78.2,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 350,
   "SELL": 3150
  },
  "testDays": 7,
  "testRegimes": 1,
  "brier": 0.3158,
  "rawBrier": 0.2878
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
    "corr": -0.1553
   },
   "baseline": {
    "n": 931,
    "tierSpreadPp": -9.7,
    "corr": -0.073
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -11.1pp vs 기존 -9.7pp)"
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
