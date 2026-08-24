// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-24 15:58",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1330,
    "up": 481,
    "raw": 0.3617,
    "uncalibratedPUp": 0.3622,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "20": {
    "n": 880,
    "up": 376,
    "raw": 0.4273,
    "uncalibratedPUp": 0.426,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "40": {
    "n": 1818,
    "up": 754,
    "raw": 0.4147,
    "uncalibratedPUp": 0.4143,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "30": {
    "n": 2263,
    "up": 858,
    "raw": 0.3791,
    "uncalibratedPUp": 0.3793,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "70": {
    "n": 465,
    "up": 166,
    "raw": 0.357,
    "uncalibratedPUp": 0.3589,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "80": {
    "n": 375,
    "up": 115,
    "raw": 0.3067,
    "uncalibratedPUp": 0.3127,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "60": {
    "n": 947,
    "up": 354,
    "raw": 0.3738,
    "uncalibratedPUp": 0.3743,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "10": {
    "n": 2864,
    "up": 1167,
    "raw": 0.4075,
    "uncalibratedPUp": 0.4073,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "90": {
    "n": 121,
    "up": 28,
    "raw": 0.2314,
    "uncalibratedPUp": 0.2626,
    "base": 0.3886,
    "pUp": 0.3886
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3886,
    "base": 0.3886,
    "pUp": 0.3886
   }
  },
  "diana": {
   "40": {
    "n": 1379,
    "up": 743,
    "raw": 0.5388,
    "uncalibratedPUp": 0.5392,
    "base": 0.5555,
    "pUp": 0.5332
   },
   "70": {
    "n": 1456,
    "up": 808,
    "raw": 0.5549,
    "uncalibratedPUp": 0.555,
    "base": 0.5555,
    "pUp": 0.566
   },
   "50": {
    "n": 1798,
    "up": 933,
    "raw": 0.5189,
    "uncalibratedPUp": 0.5195,
    "base": 0.5555,
    "pUp": 0.5332
   },
   "80": {
    "n": 1621,
    "up": 992,
    "raw": 0.612,
    "uncalibratedPUp": 0.6109,
    "base": 0.5555,
    "pUp": 0.5872
   },
   "30": {
    "n": 960,
    "up": 527,
    "raw": 0.549,
    "uncalibratedPUp": 0.5492,
    "base": 0.5555,
    "pUp": 0.5332
   },
   "90": {
    "n": 375,
    "up": 182,
    "raw": 0.4853,
    "uncalibratedPUp": 0.4905,
    "base": 0.5555,
    "pUp": 0.5872
   },
   "60": {
    "n": 1465,
    "up": 846,
    "raw": 0.5775,
    "uncalibratedPUp": 0.577,
    "base": 0.5555,
    "pUp": 0.566
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5208,
    "base": 0.5555,
    "pUp": 0.5332
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5555,
    "base": 0.5555,
    "pUp": 0.5332
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5555,
    "base": 0.5555,
    "pUp": 0.5332
   }
  },
  "nova": {
   "50": {
    "n": 1424,
    "up": 426,
    "raw": 0.2992,
    "uncalibratedPUp": 0.301,
    "base": 0.3886,
    "pUp": 0.34
   },
   "40": {
    "n": 3432,
    "up": 1164,
    "raw": 0.3392,
    "uncalibratedPUp": 0.3396,
    "base": 0.3886,
    "pUp": 0.34
   },
   "30": {
    "n": 3004,
    "up": 1078,
    "raw": 0.3589,
    "uncalibratedPUp": 0.3591,
    "base": 0.3886,
    "pUp": 0.34
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2248,
    "base": 0.3886,
    "pUp": 0.5901
   },
   "60": {
    "n": 2099,
    "up": 1290,
    "raw": 0.6146,
    "uncalibratedPUp": 0.6114,
    "base": 0.3886,
    "pUp": 0.5901
   },
   "20": {
    "n": 1046,
    "up": 334,
    "raw": 0.3193,
    "uncalibratedPUp": 0.3212,
    "base": 0.3886,
    "pUp": 0.3248
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3761,
    "base": 0.3886,
    "pUp": 0.5901
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3429,
    "base": 0.3886,
    "pUp": 0.5901
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3886,
    "base": 0.3886,
    "pUp": 0.3248
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3886,
    "base": 0.3886,
    "pUp": 0.3248
   }
  },
  "flow": {
   "50": {
    "n": 6948,
    "up": 2729,
    "raw": 0.3928,
    "uncalibratedPUp": 0.3928,
    "base": 0.3886,
    "pUp": 0.3928
   },
   "70": {
    "n": 126,
    "up": 61,
    "raw": 0.4841,
    "uncalibratedPUp": 0.4658,
    "base": 0.3886,
    "pUp": 0.4343
   },
   "40": {
    "n": 3100,
    "up": 1175,
    "raw": 0.379,
    "uncalibratedPUp": 0.3791,
    "base": 0.3886,
    "pUp": 0.3791
   },
   "30": {
    "n": 379,
    "up": 125,
    "raw": 0.3298,
    "uncalibratedPUp": 0.3341,
    "base": 0.3886,
    "pUp": 0.345
   },
   "60": {
    "n": 437,
    "up": 185,
    "raw": 0.4233,
    "uncalibratedPUp": 0.4211,
    "base": 0.3886,
    "pUp": 0.4211
   },
   "20": {
    "n": 66,
    "up": 22,
    "raw": 0.3333,
    "uncalibratedPUp": 0.3506,
    "base": 0.3886,
    "pUp": 0.345
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3331,
    "base": 0.3886,
    "pUp": 0.4343
   },
   "10": {
    "n": 2,
    "up": 2,
    "raw": 1.0,
    "uncalibratedPUp": 0.4268,
    "base": 0.3886,
    "pUp": 0.345
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3886,
    "base": 0.3886,
    "pUp": 0.345
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3886,
    "base": 0.3886,
    "pUp": 0.4343
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 4102,
   "errorCorr": -0.134
  },
  "taro:nova": {
   "n": 6158,
   "errorCorr": 0.282
  },
  "taro:flow": {
   "n": 1280,
   "errorCorr": 0.236
  },
  "diana:nova": {
   "n": 3339,
   "errorCorr": -0.159
  },
  "diana:flow": {
   "n": 674,
   "errorCorr": 0.141
  },
  "nova:flow": {
   "n": 1078,
   "errorCorr": -0.019
  }
 },
 "redundancyFactor": {
  "taro": 0.9869,
  "diana": 1,
  "nova": 0.9921,
  "flow": 0.9949
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.1804,
    "diana": 0.1072,
    "nova": 0.3106,
    "flow": 0.4017
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
   "n": 6240,
   "blend": 0.6,
   "weights": {
    "taro": 0.1752,
    "diana": 0.1145,
    "nova": 0.3578,
    "flow": 0.3524
   },
   "acc": {
    "taro": {
     "n": 2229,
     "adjustedAcc": 64.1
    },
    "diana": {
     "n": 1796,
     "adjustedAcc": 51.2
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
    "taro": 0.1892,
    "diana": 0.1022,
    "nova": 0.3287,
    "flow": 0.3799
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
   "n": 10147,
   "blend": 0.6,
   "weights": {
    "taro": 0.1421,
    "diana": 0.1332,
    "nova": 0.3581,
    "flow": 0.3666
   },
   "acc": {
    "taro": {
     "n": 3857,
     "adjustedAcc": 41.7
    },
    "diana": {
     "n": 2147,
     "adjustedAcc": 59.9
    },
    "nova": {
     "n": 3453,
     "adjustedAcc": 64.0
    },
    "flow": {
     "n": 690,
     "adjustedAcc": 52.4
    }
   }
  },
  "down_low": {
   "n": 2253,
   "blend": 0.6,
   "weights": {
    "taro": 0.1972,
    "diana": 0.1294,
    "nova": 0.3048,
    "flow": 0.3685
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
  "median5": -4.78,
  "medianAbs1": 1.66,
  "advanceRatio5": 19.1,
  "medianRet1": 1.07,
  "advanceRatio1": 71.7
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
   "hit": 8375,
   "miss": 8143,
   "mid": 658,
   "accuracy": 50.7
  },
  "guarded": {
   "hit": 8369,
   "miss": 8164,
   "mid": 643,
   "accuracy": 50.6
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 3613,
  "errors": 1860,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1715
   },
   {
    "label": "분석가 의견충돌",
    "count": 1063
   },
   {
    "label": "고변동성 국면",
    "count": 217
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 75
   }
  ],
  "analystErrors": {
   "taro": 1295,
   "diana": 0,
   "nova": 76,
   "flow": 207
  },
  "regimeErrors": {
   "up_low": 1322,
   "unknown": 321,
   "up_high": 217
  }
 },
 "shadow": {
  "n": 3613,
  "baselineActionN": 811,
  "baselineActionPrecision": 35.6,
  "candidateActionN": 140,
  "candidateActionPrecision": 59.3,
  "candidateCoverage": 3.9,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 3465,
   "SELL": 148
  },
  "testDays": 7,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 49.3,
  "brier": 0.225,
  "rawBrier": 0.2724
 },
 "prospective": {
  "n": 4500,
  "baselineActionN": 1409,
  "baselineActionPrecision": 24.3,
  "candidateActionN": 3580,
  "candidateActionPrecision": 46.4,
  "candidateCoverage": 79.6,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 434,
   "SELL": 4066
  },
  "testDays": 9,
  "testRegimes": 1,
  "brier": 0.2839,
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
     "n": 1778,
     "hit": 1172,
     "raw": 0.6592,
     "uncalibratedAcc": 0.6592,
     "base": 0.6597,
     "calibratedAcc": 0.6592
    },
    "45": {
     "n": 850,
     "hit": 489,
     "raw": 0.5753,
     "uncalibratedAcc": 0.5772,
     "base": 0.6597,
     "calibratedAcc": 0.5772
    },
    "35": {
     "n": 1140,
     "hit": 831,
     "raw": 0.7289,
     "uncalibratedAcc": 0.7278,
     "base": 0.6597,
     "calibratedAcc": 0.7037
    },
    "30": {
     "n": 406,
     "hit": 261,
     "raw": 0.6429,
     "uncalibratedAcc": 0.6436,
     "base": 0.6597,
     "calibratedAcc": 0.7037
    },
    "25": {
     "n": 23,
     "hit": 16,
     "raw": 0.6957,
     "uncalibratedAcc": 0.6789,
     "base": 0.6597,
     "calibratedAcc": 0.7037
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6452,
     "base": 0.6597,
     "calibratedAcc": 0.7037
    }
   }
  },
  "evaluation": {
   "n": 811,
   "buyN": 385,
   "sellN": 426,
   "testDays": 7,
   "testRegimes": 2,
   "candidate": {
    "n": 809,
    "tierSpreadPp": 14.5,
    "corr": 0.1148
   },
   "baseline": {
    "n": 811,
    "tierSpreadPp": -6.7,
    "corr": -0.0299
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
