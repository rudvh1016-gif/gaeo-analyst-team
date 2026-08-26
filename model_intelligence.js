// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-26 09:13",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1330,
    "up": 483,
    "raw": 0.3632,
    "uncalibratedPUp": 0.3637,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "20": {
    "n": 880,
    "up": 377,
    "raw": 0.4284,
    "uncalibratedPUp": 0.4271,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "40": {
    "n": 1818,
    "up": 756,
    "raw": 0.4158,
    "uncalibratedPUp": 0.4154,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "30": {
    "n": 2263,
    "up": 863,
    "raw": 0.3814,
    "uncalibratedPUp": 0.3815,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "70": {
    "n": 465,
    "up": 166,
    "raw": 0.357,
    "uncalibratedPUp": 0.359,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "80": {
    "n": 375,
    "up": 115,
    "raw": 0.3067,
    "uncalibratedPUp": 0.3128,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "60": {
    "n": 947,
    "up": 354,
    "raw": 0.3738,
    "uncalibratedPUp": 0.3743,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "10": {
    "n": 2864,
    "up": 1172,
    "raw": 0.4092,
    "uncalibratedPUp": 0.409,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "90": {
    "n": 121,
    "up": 28,
    "raw": 0.2314,
    "uncalibratedPUp": 0.2629,
    "base": 0.3899,
    "pUp": 0.3899
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3899,
    "base": 0.3899,
    "pUp": 0.3899
   }
  },
  "diana": {
   "40": {
    "n": 1526,
    "up": 865,
    "raw": 0.5668,
    "uncalibratedPUp": 0.567,
    "base": 0.5755,
    "pUp": 0.558
   },
   "70": {
    "n": 1630,
    "up": 940,
    "raw": 0.5767,
    "uncalibratedPUp": 0.5767,
    "base": 0.5755,
    "pUp": 0.586
   },
   "50": {
    "n": 1987,
    "up": 1081,
    "raw": 0.544,
    "uncalibratedPUp": 0.5445,
    "base": 0.5755,
    "pUp": 0.558
   },
   "80": {
    "n": 1801,
    "up": 1116,
    "raw": 0.6197,
    "uncalibratedPUp": 0.6189,
    "base": 0.5755,
    "pUp": 0.5965
   },
   "30": {
    "n": 1055,
    "up": 601,
    "raw": 0.5697,
    "uncalibratedPUp": 0.5698,
    "base": 0.5755,
    "pUp": 0.558
   },
   "90": {
    "n": 418,
    "up": 209,
    "raw": 0.5,
    "uncalibratedPUp": 0.5051,
    "base": 0.5755,
    "pUp": 0.5965
   },
   "60": {
    "n": 1637,
    "up": 975,
    "raw": 0.5956,
    "uncalibratedPUp": 0.5952,
    "base": 0.5755,
    "pUp": 0.586
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5395,
    "base": 0.5755,
    "pUp": 0.558
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5755,
    "base": 0.5755,
    "pUp": 0.558
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5755,
    "base": 0.5755,
    "pUp": 0.558
   }
  },
  "nova": {
   "50": {
    "n": 1424,
    "up": 427,
    "raw": 0.2999,
    "uncalibratedPUp": 0.3017,
    "base": 0.3899,
    "pUp": 0.3413
   },
   "40": {
    "n": 3432,
    "up": 1169,
    "raw": 0.3406,
    "uncalibratedPUp": 0.341,
    "base": 0.3899,
    "pUp": 0.3413
   },
   "30": {
    "n": 3004,
    "up": 1082,
    "raw": 0.3602,
    "uncalibratedPUp": 0.3605,
    "base": 0.3899,
    "pUp": 0.3413
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2253,
    "base": 0.3899,
    "pUp": 0.5915
   },
   "60": {
    "n": 2099,
    "up": 1293,
    "raw": 0.616,
    "uncalibratedPUp": 0.6128,
    "base": 0.3899,
    "pUp": 0.5915
   },
   "20": {
    "n": 1046,
    "up": 336,
    "raw": 0.3212,
    "uncalibratedPUp": 0.3231,
    "base": 0.3899,
    "pUp": 0.3267
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3774,
    "base": 0.3899,
    "pUp": 0.5915
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3441,
    "base": 0.3899,
    "pUp": 0.5915
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3899,
    "base": 0.3899,
    "pUp": 0.3267
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3899,
    "base": 0.3899,
    "pUp": 0.3267
   }
  },
  "flow": {
   "50": {
    "n": 6948,
    "up": 2741,
    "raw": 0.3945,
    "uncalibratedPUp": 0.3945,
    "base": 0.3899,
    "pUp": 0.3945
   },
   "70": {
    "n": 126,
    "up": 61,
    "raw": 0.4841,
    "uncalibratedPUp": 0.466,
    "base": 0.3899,
    "pUp": 0.4348
   },
   "40": {
    "n": 3100,
    "up": 1178,
    "raw": 0.38,
    "uncalibratedPUp": 0.3801,
    "base": 0.3899,
    "pUp": 0.3801
   },
   "30": {
    "n": 379,
    "up": 125,
    "raw": 0.3298,
    "uncalibratedPUp": 0.3342,
    "base": 0.3899,
    "pUp": 0.3453
   },
   "60": {
    "n": 437,
    "up": 185,
    "raw": 0.4233,
    "uncalibratedPUp": 0.4212,
    "base": 0.3899,
    "pUp": 0.4212
   },
   "20": {
    "n": 66,
    "up": 22,
    "raw": 0.3333,
    "uncalibratedPUp": 0.351,
    "base": 0.3899,
    "pUp": 0.3453
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3342,
    "base": 0.3899,
    "pUp": 0.4348
   },
   "10": {
    "n": 2,
    "up": 2,
    "raw": 1.0,
    "uncalibratedPUp": 0.4281,
    "base": 0.3899,
    "pUp": 0.3453
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3899,
    "base": 0.3899,
    "pUp": 0.3453
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3899,
    "base": 0.3899,
    "pUp": 0.4348
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 4558,
   "errorCorr": -0.148
  },
  "taro:nova": {
   "n": 6161,
   "errorCorr": 0.283
  },
  "taro:flow": {
   "n": 1280,
   "errorCorr": 0.236
  },
  "diana:nova": {
   "n": 3824,
   "errorCorr": -0.116
  },
  "diana:flow": {
   "n": 740,
   "errorCorr": 0.129
  },
  "nova:flow": {
   "n": 1078,
   "errorCorr": -0.019
  }
 },
 "redundancyFactor": {
  "taro": 0.9869,
  "diana": 1,
  "nova": 0.992,
  "flow": 0.9949
 },
 "regimes": {
  "up_high": {
   "n": 995,
   "blend": 0.554,
   "weights": {
    "taro": 0.2659,
    "diana": 0.1082,
    "nova": 0.2699,
    "flow": 0.356
   },
   "acc": {
    "taro": {
     "n": 403,
     "adjustedAcc": 62.9
    },
    "diana": {
     "n": 333,
     "adjustedAcc": 39.9
    },
    "nova": {
     "n": 192,
     "adjustedAcc": 52.0
    },
    "flow": {
     "n": 67,
     "adjustedAcc": 60.6
    }
   }
  },
  "side_high": {
   "n": 6238,
   "blend": 0.6,
   "weights": {
    "taro": 0.259,
    "diana": 0.116,
    "nova": 0.3121,
    "flow": 0.313
   },
   "acc": {
    "taro": {
     "n": 2229,
     "adjustedAcc": 64.0
    },
    "diana": {
     "n": 1794,
     "adjustedAcc": 51.5
    },
    "nova": {
     "n": 1825,
     "adjustedAcc": 68.0
    },
    "flow": {
     "n": 390,
     "adjustedAcc": 53.1
    }
   }
  },
  "up_low": {
   "n": 1997,
   "blend": 0.6,
   "weights": {
    "taro": 0.2747,
    "diana": 0.1099,
    "nova": 0.283,
    "flow": 0.3324
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
   "n": 10473,
   "blend": 0.6,
   "weights": {
    "taro": 0.2128,
    "diana": 0.1396,
    "nova": 0.3175,
    "flow": 0.3301
   },
   "acc": {
    "taro": {
     "n": 3859,
     "adjustedAcc": 41.6
    },
    "diana": {
     "n": 2469,
     "adjustedAcc": 61.7
    },
    "nova": {
     "n": 3455,
     "adjustedAcc": 64.0
    },
    "flow": {
     "n": 690,
     "adjustedAcc": 52.4
    }
   }
  },
  "down_low": {
   "n": 2255,
   "blend": 0.6,
   "weights": {
    "taro": 0.2862,
    "diana": 0.1291,
    "nova": 0.2623,
    "flow": 0.3224
   },
   "acc": {
    "taro": {
     "n": 741,
     "adjustedAcc": 71.7
    },
    "diana": {
     "n": 635,
     "adjustedAcc": 60.6
    },
    "nova": {
     "n": 768,
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
  "median5": 1.09,
  "medianAbs1": 0.75,
  "advanceRatio5": 59.9,
  "medianRet1": 0.0,
  "advanceRatio1": 47.7
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 18372,
  "days": 37,
  "guardedN": 295,
  "baseline": {
   "hit": 9187,
   "miss": 8493,
   "mid": 692,
   "accuracy": 52.0
  },
  "guarded": {
   "hit": 9182,
   "miss": 8513,
   "mid": 677,
   "accuracy": 51.9
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 4809,
  "errors": 2197,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2037
   },
   {
    "label": "분석가 의견충돌",
    "count": 1251
   },
   {
    "label": "고변동성 국면",
    "count": 548
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 89
   }
  ],
  "analystErrors": {
   "taro": 1455,
   "diana": 0,
   "nova": 100,
   "flow": 260
  },
  "regimeErrors": {
   "up_low": 1327,
   "down_high": 330,
   "unknown": 322,
   "up_high": 218
  }
 },
 "shadow": {
  "n": 4809,
  "baselineActionN": 989,
  "baselineActionPrecision": 41.2,
  "candidateActionN": 84,
  "candidateActionPrecision": 56.0,
  "candidateCoverage": 1.7,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 4722,
   "SELL": 87
  },
  "testDays": 9,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 54.1,
  "brier": 0.2351,
  "rawBrier": 0.2734
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
     "n": 268,
     "hit": 102,
     "raw": 0.3806,
     "uncalibratedAcc": 0.3807,
     "base": 0.3822,
     "calibratedAcc": 0.3807
    },
    "60": {
     "n": 188,
     "hit": 68,
     "raw": 0.3617,
     "uncalibratedAcc": 0.3637,
     "base": 0.3822,
     "calibratedAcc": 0.3637
    },
    "70": {
     "n": 114,
     "hit": 47,
     "raw": 0.4123,
     "uncalibratedAcc": 0.4078,
     "base": 0.3822,
     "calibratedAcc": 0.4078
    },
    "75": {
     "n": 3,
     "hit": 2,
     "raw": 0.6667,
     "uncalibratedAcc": 0.4193,
     "base": 0.3822,
     "calibratedAcc": 0.4193
    }
   },
   "SELL": {
    "40": {
     "n": 1779,
     "hit": 1170,
     "raw": 0.6577,
     "uncalibratedAcc": 0.6577,
     "base": 0.6586,
     "calibratedAcc": 0.6577
    },
    "45": {
     "n": 850,
     "hit": 487,
     "raw": 0.5729,
     "uncalibratedAcc": 0.5749,
     "base": 0.6586,
     "calibratedAcc": 0.5749
    },
    "35": {
     "n": 1140,
     "hit": 831,
     "raw": 0.7289,
     "uncalibratedAcc": 0.7277,
     "base": 0.6586,
     "calibratedAcc": 0.7036
    },
    "30": {
     "n": 406,
     "hit": 261,
     "raw": 0.6429,
     "uncalibratedAcc": 0.6436,
     "base": 0.6586,
     "calibratedAcc": 0.7036
    },
    "25": {
     "n": 23,
     "hit": 16,
     "raw": 0.6957,
     "uncalibratedAcc": 0.6784,
     "base": 0.6586,
     "calibratedAcc": 0.7036
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6442,
     "base": 0.6586,
     "calibratedAcc": 0.7036
    }
   }
  },
  "evaluation": {
   "n": 989,
   "buyN": 441,
   "sellN": 548,
   "testDays": 9,
   "testRegimes": 3,
   "candidate": {
    "n": 987,
    "tierSpreadPp": 17.3,
    "corr": 0.0983
   },
   "baseline": {
    "n": 989,
    "tierSpreadPp": -1.8,
    "corr": 0.0126
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
