// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-15 07:05",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1053,
    "up": 339,
    "raw": 0.3219,
    "uncalibratedPUp": 0.322,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "20": {
    "n": 728,
    "up": 252,
    "raw": 0.3462,
    "uncalibratedPUp": 0.3452,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "40": {
    "n": 1407,
    "up": 520,
    "raw": 0.3696,
    "uncalibratedPUp": 0.3686,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "30": {
    "n": 1655,
    "up": 477,
    "raw": 0.2882,
    "uncalibratedPUp": 0.2888,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "70": {
    "n": 342,
    "up": 114,
    "raw": 0.3333,
    "uncalibratedPUp": 0.3325,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "80": {
    "n": 300,
    "up": 84,
    "raw": 0.28,
    "uncalibratedPUp": 0.2839,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "60": {
    "n": 736,
    "up": 259,
    "raw": 0.3519,
    "uncalibratedPUp": 0.3508,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "10": {
    "n": 2224,
    "up": 689,
    "raw": 0.3098,
    "uncalibratedPUp": 0.31,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "90": {
    "n": 111,
    "up": 27,
    "raw": 0.2432,
    "uncalibratedPUp": 0.2601,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3082
   }
  },
  "diana": {
   "40": {
    "n": 1000,
    "up": 472,
    "raw": 0.472,
    "uncalibratedPUp": 0.4733,
    "base": 0.5176,
    "pUp": 0.474
   },
   "70": {
    "n": 1052,
    "up": 559,
    "raw": 0.5314,
    "uncalibratedPUp": 0.531,
    "base": 0.5176,
    "pUp": 0.5395
   },
   "50": {
    "n": 1296,
    "up": 600,
    "raw": 0.463,
    "uncalibratedPUp": 0.4642,
    "base": 0.5176,
    "pUp": 0.474
   },
   "80": {
    "n": 1165,
    "up": 709,
    "raw": 0.6086,
    "uncalibratedPUp": 0.6063,
    "base": 0.5176,
    "pUp": 0.5792
   },
   "30": {
    "n": 704,
    "up": 342,
    "raw": 0.4858,
    "uncalibratedPUp": 0.4871,
    "base": 0.5176,
    "pUp": 0.474
   },
   "90": {
    "n": 260,
    "up": 120,
    "raw": 0.4615,
    "uncalibratedPUp": 0.4673,
    "base": 0.5176,
    "pUp": 0.5792
   },
   "60": {
    "n": 1053,
    "up": 578,
    "raw": 0.5489,
    "uncalibratedPUp": 0.548,
    "base": 0.5176,
    "pUp": 0.5395
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5176,
    "base": 0.5176,
    "pUp": 0.474
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5176,
    "base": 0.5176,
    "pUp": 0.474
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5176,
    "base": 0.5176,
    "pUp": 0.474
   }
  },
  "nova": {
   "50": {
    "n": 1350,
    "up": 397,
    "raw": 0.2941,
    "uncalibratedPUp": 0.2947,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "40": {
    "n": 3201,
    "up": 1063,
    "raw": 0.3321,
    "uncalibratedPUp": 0.332,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "30": {
    "n": 2669,
    "up": 950,
    "raw": 0.3559,
    "uncalibratedPUp": 0.3556,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.201,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "60": {
    "n": 639,
    "up": 119,
    "raw": 0.1862,
    "uncalibratedPUp": 0.1923,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "20": {
    "n": 639,
    "up": 225,
    "raw": 0.3521,
    "uncalibratedPUp": 0.3508,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3123,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2847,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3227
   }
  },
  "flow": {
   "50": {
    "n": 5300,
    "up": 1778,
    "raw": 0.3355,
    "uncalibratedPUp": 0.3354,
    "base": 0.3227,
    "pUp": 0.3354
   },
   "70": {
    "n": 101,
    "up": 44,
    "raw": 0.4356,
    "uncalibratedPUp": 0.4098,
    "base": 0.3227,
    "pUp": 0.3765
   },
   "40": {
    "n": 2449,
    "up": 724,
    "raw": 0.2956,
    "uncalibratedPUp": 0.296,
    "base": 0.3227,
    "pUp": 0.296
   },
   "30": {
    "n": 308,
    "up": 81,
    "raw": 0.263,
    "uncalibratedPUp": 0.2683,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "60": {
    "n": 347,
    "up": 122,
    "raw": 0.3516,
    "uncalibratedPUp": 0.3493,
    "base": 0.3227,
    "pUp": 0.3493
   },
   "20": {
    "n": 48,
    "up": 12,
    "raw": 0.25,
    "uncalibratedPUp": 0.278,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2934,
    "base": 0.3227,
    "pUp": 0.3765
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3765
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 2952,
   "errorCorr": -0.15
  },
  "taro:nova": {
   "n": 4352,
   "errorCorr": 0.693
  },
  "taro:flow": {
   "n": 961,
   "errorCorr": 0.199
  },
  "diana:nova": {
   "n": 2100,
   "errorCorr": -0.164
  },
  "diana:flow": {
   "n": 519,
   "errorCorr": 0.119
  },
  "nova:flow": {
   "n": 745,
   "errorCorr": 0.095
  }
 },
 "redundancyFactor": {
  "taro": 0.9644,
  "diana": 1,
  "nova": 0.9674,
  "flow": 0.997
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.3033,
    "diana": 0.0972,
    "nova": 0.2778,
    "flow": 0.3217
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
   "n": 3768,
   "blend": 0.6,
   "weights": {
    "taro": 0.289,
    "diana": 0.1098,
    "nova": 0.3135,
    "flow": 0.2877
   },
   "acc": {
    "taro": {
     "n": 1464,
     "adjustedAcc": 63.5
    },
    "diana": {
     "n": 914,
     "adjustedAcc": 57.2
    },
    "nova": {
     "n": 1125,
     "adjustedAcc": 67.5
    },
    "flow": {
     "n": 265,
     "adjustedAcc": 55.7
    }
   }
  },
  "up_low": {
   "n": 926,
   "blend": 0.537,
   "weights": {
    "taro": 0.3059,
    "diana": 0.0929,
    "nova": 0.3142,
    "flow": 0.287
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
   "n": 8069,
   "blend": 0.6,
   "weights": {
    "taro": 0.2886,
    "diana": 0.1184,
    "nova": 0.2924,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 2110,
     "adjustedAcc": 55.9
    },
    "nova": {
     "n": 2384,
     "adjustedAcc": 54.2
    },
    "flow": {
     "n": 532,
     "adjustedAcc": 51.9
    }
   }
  },
  "down_low": {
   "n": 1618,
   "blend": 0.6,
   "weights": {
    "taro": 0.3302,
    "diana": 0.1037,
    "nova": 0.2717,
    "flow": 0.2944
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
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 4.57,
  "medianAbs1": 1.85,
  "advanceRatio5": 74.6,
  "medianRet1": 1.03,
  "advanceRatio1": 65.2
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 14056,
  "days": 29,
  "guardedN": 201,
  "baseline": {
   "hit": 6914,
   "miss": 6587,
   "mid": 555,
   "accuracy": 51.2
  },
  "guarded": {
   "hit": 6964,
   "miss": 6550,
   "mid": 542,
   "accuracy": 51.5
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 3000,
  "errors": 1935,
  "patterns": [
   {
    "label": "분석가 의견충돌",
    "count": 1327
   },
   {
    "label": "경계점수 판단",
    "count": 1289
   },
   {
    "label": "고변동성 국면",
    "count": 1239
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 157
   }
  ],
  "analystErrors": {
   "taro": 901,
   "diana": 0,
   "nova": 1072,
   "flow": 149
  },
  "regimeErrors": {
   "up_high": 892,
   "down_low": 394,
   "down_high": 347,
   "up_low": 302
  }
 },
 "shadow": {
  "n": 3000,
  "baselineActionN": 1274,
  "baselineActionPrecision": 14.9,
  "candidateActionN": 2727,
  "candidateActionPrecision": 12.8,
  "candidateCoverage": 90.9,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 3000
  },
  "testDays": 6,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 11.7,
  "brier": 0.3764,
  "rawBrier": 0.2642
 },
 "prospective": {
  "n": 2000,
  "baselineActionN": 871,
  "baselineActionPrecision": 14.5,
  "candidateActionN": 1704,
  "candidateActionPrecision": 15.4,
  "candidateCoverage": 85.2,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 86,
   "SELL": 1914
  },
  "testDays": 4,
  "testRegimes": 1,
  "brier": 0.3837,
  "rawBrier": 0.2889
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
   "실제 그림자 행동 정밀도 개선폭 1.5%p 미만",
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
     "n": 227,
     "hit": 78,
     "raw": 0.3436,
     "uncalibratedAcc": 0.3428,
     "base": 0.3333,
     "calibratedAcc": 0.3428
    },
    "60": {
     "n": 144,
     "hit": 43,
     "raw": 0.2986,
     "uncalibratedAcc": 0.3028,
     "base": 0.3333,
     "calibratedAcc": 0.3028
    },
    "70": {
     "n": 101,
     "hit": 36,
     "raw": 0.3564,
     "uncalibratedAcc": 0.3526,
     "base": 0.3333,
     "calibratedAcc": 0.352
    },
    "75": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.3485,
     "base": 0.3333,
     "calibratedAcc": 0.352
    }
   },
   "SELL": {
    "40": {
     "n": 1414,
     "hit": 1045,
     "raw": 0.739,
     "uncalibratedAcc": 0.7388,
     "base": 0.723,
     "calibratedAcc": 0.7266
    },
    "45": {
     "n": 579,
     "hit": 408,
     "raw": 0.7047,
     "uncalibratedAcc": 0.7053,
     "base": 0.723,
     "calibratedAcc": 0.7053
    },
    "35": {
     "n": 1009,
     "hit": 748,
     "raw": 0.7413,
     "uncalibratedAcc": 0.741,
     "base": 0.723,
     "calibratedAcc": 0.7266
    },
    "30": {
     "n": 384,
     "hit": 248,
     "raw": 0.6458,
     "uncalibratedAcc": 0.6497,
     "base": 0.723,
     "calibratedAcc": 0.7266
    },
    "25": {
     "n": 20,
     "hit": 14,
     "raw": 0.7,
     "uncalibratedAcc": 0.7115,
     "base": 0.723,
     "calibratedAcc": 0.7266
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.7027,
     "base": 0.723,
     "calibratedAcc": 0.7266
    }
   }
  },
  "evaluation": {
   "n": 1274,
   "buyN": 122,
   "sellN": 1152,
   "testDays": 6,
   "testRegimes": 4,
   "candidate": {
    "n": 1246,
    "tierSpreadPp": -17.3,
    "corr": -0.4785
   },
   "baseline": {
    "n": 1274,
    "tierSpreadPp": -1.7,
    "corr": -0.0315
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -17.3pp vs 기존 -1.7pp)"
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
