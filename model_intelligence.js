// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-03 09:17",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1754,
    "up": 878,
    "raw": 0.5006,
    "uncalibratedPUp": 0.5,
    "base": 0.4648,
    "pUp": 0.483
   },
   "20": {
    "n": 998,
    "up": 478,
    "raw": 0.479,
    "uncalibratedPUp": 0.4785,
    "base": 0.4648,
    "pUp": 0.4475
   },
   "40": {
    "n": 2183,
    "up": 1094,
    "raw": 0.5011,
    "uncalibratedPUp": 0.5007,
    "base": 0.4648,
    "pUp": 0.483
   },
   "30": {
    "n": 2515,
    "up": 1093,
    "raw": 0.4346,
    "uncalibratedPUp": 0.4349,
    "base": 0.4648,
    "pUp": 0.4475
   },
   "70": {
    "n": 595,
    "up": 278,
    "raw": 0.4672,
    "uncalibratedPUp": 0.4671,
    "base": 0.4648,
    "pUp": 0.483
   },
   "80": {
    "n": 460,
    "up": 183,
    "raw": 0.3978,
    "uncalibratedPUp": 0.4019,
    "base": 0.4648,
    "pUp": 0.483
   },
   "60": {
    "n": 1271,
    "up": 620,
    "raw": 0.4878,
    "uncalibratedPUp": 0.4873,
    "base": 0.4648,
    "pUp": 0.483
   },
   "10": {
    "n": 3144,
    "up": 1404,
    "raw": 0.4466,
    "uncalibratedPUp": 0.4467,
    "base": 0.4648,
    "pUp": 0.4469
   },
   "90": {
    "n": 136,
    "up": 41,
    "raw": 0.3015,
    "uncalibratedPUp": 0.331,
    "base": 0.4648,
    "pUp": 0.483
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4648,
    "base": 0.4648,
    "pUp": 0.4469
   }
  },
  "diana": {
   "40": {
    "n": 1952,
    "up": 1191,
    "raw": 0.6101,
    "uncalibratedPUp": 0.6102,
    "base": 0.6161,
    "pUp": 0.6099
   },
   "70": {
    "n": 2158,
    "up": 1331,
    "raw": 0.6168,
    "uncalibratedPUp": 0.6168,
    "base": 0.6161,
    "pUp": 0.6241
   },
   "50": {
    "n": 2566,
    "up": 1564,
    "raw": 0.6095,
    "uncalibratedPUp": 0.6096,
    "base": 0.6161,
    "pUp": 0.6099
   },
   "80": {
    "n": 2364,
    "up": 1522,
    "raw": 0.6438,
    "uncalibratedPUp": 0.6435,
    "base": 0.6161,
    "pUp": 0.6244
   },
   "30": {
    "n": 1342,
    "up": 797,
    "raw": 0.5939,
    "uncalibratedPUp": 0.5944,
    "base": 0.6161,
    "pUp": 0.5949
   },
   "90": {
    "n": 547,
    "up": 296,
    "raw": 0.5411,
    "uncalibratedPUp": 0.545,
    "base": 0.6161,
    "pUp": 0.6244
   },
   "60": {
    "n": 2121,
    "up": 1340,
    "raw": 0.6318,
    "uncalibratedPUp": 0.6316,
    "base": 0.6161,
    "pUp": 0.6241
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5776,
    "base": 0.6161,
    "pUp": 0.5949
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6161,
    "base": 0.6161,
    "pUp": 0.5949
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6161,
    "base": 0.6161,
    "pUp": 0.5949
   }
  },
  "nova": {
   "50": {
    "n": 1523,
    "up": 520,
    "raw": 0.3414,
    "uncalibratedPUp": 0.3438,
    "base": 0.4648,
    "pUp": 0.4171
   },
   "40": {
    "n": 3602,
    "up": 1316,
    "raw": 0.3654,
    "uncalibratedPUp": 0.3662,
    "base": 0.4648,
    "pUp": 0.4171
   },
   "30": {
    "n": 3418,
    "up": 1432,
    "raw": 0.419,
    "uncalibratedPUp": 0.4194,
    "base": 0.4648,
    "pUp": 0.4171
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2524,
    "base": 0.4648,
    "pUp": 0.6487
   },
   "60": {
    "n": 2575,
    "up": 1723,
    "raw": 0.6691,
    "uncalibratedPUp": 0.6668,
    "base": 0.4648,
    "pUp": 0.6487
   },
   "20": {
    "n": 1880,
    "up": 1071,
    "raw": 0.5697,
    "uncalibratedPUp": 0.568,
    "base": 0.4648,
    "pUp": 0.4171
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4498,
    "base": 0.4648,
    "pUp": 0.6487
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4102,
    "base": 0.4648,
    "pUp": 0.6487
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4648,
    "base": 0.4648,
    "pUp": 0.4171
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4648,
    "base": 0.4648,
    "pUp": 0.4171
   }
  },
  "flow": {
   "50": {
    "n": 8353,
    "up": 3981,
    "raw": 0.4766,
    "uncalibratedPUp": 0.4766,
    "base": 0.4648,
    "pUp": 0.4766
   },
   "70": {
    "n": 167,
    "up": 95,
    "raw": 0.5689,
    "uncalibratedPUp": 0.553,
    "base": 0.4648,
    "pUp": 0.5298
   },
   "40": {
    "n": 3476,
    "up": 1508,
    "raw": 0.4338,
    "uncalibratedPUp": 0.4341,
    "base": 0.4648,
    "pUp": 0.4341
   },
   "30": {
    "n": 398,
    "up": 140,
    "raw": 0.3518,
    "uncalibratedPUp": 0.3597,
    "base": 0.4648,
    "pUp": 0.3873
   },
   "60": {
    "n": 574,
    "up": 308,
    "raw": 0.5366,
    "uncalibratedPUp": 0.533,
    "base": 0.4648,
    "pUp": 0.5298
   },
   "20": {
    "n": 79,
    "up": 33,
    "raw": 0.4177,
    "uncalibratedPUp": 0.4307,
    "base": 0.4648,
    "pUp": 0.3873
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3984,
    "base": 0.4648,
    "pUp": 0.5298
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5278,
    "base": 0.4648,
    "pUp": 0.3873
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4648,
    "base": 0.4648,
    "pUp": 0.3873
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4648,
    "base": 0.4648,
    "pUp": 0.5298
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 6036,
   "errorCorr": -0.156
  },
  "taro:nova": {
   "n": 7526,
   "errorCorr": 0.178
  },
  "taro:flow": {
   "n": 1526,
   "errorCorr": 0.223
  },
  "diana:nova": {
   "n": 5619,
   "errorCorr": -0.063
  },
  "diana:flow": {
   "n": 997,
   "errorCorr": 0.128
  },
  "nova:flow": {
   "n": 1375,
   "errorCorr": -0.112
  }
 },
 "redundancyFactor": {
  "taro": 0.994,
  "diana": 1,
  "nova": 0.9983,
  "flow": 0.9956
 },
 "regimes": {
  "up_high": {
   "n": 4239,
   "blend": 0.6,
   "weights": {
    "taro": 0.3405,
    "diana": 0.1051,
    "nova": 0.1856,
    "flow": 0.3688
   },
   "acc": {
    "taro": {
     "n": 1449,
     "adjustedAcc": 64.7
    },
    "diana": {
     "n": 1222,
     "adjustedAcc": 48.3
    },
    "nova": {
     "n": 1299,
     "adjustedAcc": 35.3
    },
    "flow": {
     "n": 269,
     "adjustedAcc": 66.3
    }
   }
  },
  "up_low": {
   "n": 1997,
   "blend": 0.6,
   "weights": {
    "taro": 0.3441,
    "diana": 0.0997,
    "nova": 0.2344,
    "flow": 0.3218
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
    "taro": 0.2671,
    "diana": 0.1357,
    "nova": 0.2706,
    "flow": 0.3266
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
     "adjustedAcc": 64.9
    },
    "flow": {
     "n": 768,
     "adjustedAcc": 52.9
    }
   }
  },
  "side_high": {
   "n": 5233,
   "blend": 0.6,
   "weights": {
    "taro": 0.325,
    "diana": 0.1105,
    "nova": 0.2572,
    "flow": 0.3074
   },
   "acc": {
    "taro": {
     "n": 1841,
     "adjustedAcc": 61.9
    },
    "diana": {
     "n": 1492,
     "adjustedAcc": 53.7
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
   "n": 3473,
   "blend": 0.6,
   "weights": {
    "taro": 0.3119,
    "diana": 0.1287,
    "nova": 0.2,
    "flow": 0.3595
   },
   "acc": {
    "taro": {
     "n": 1111,
     "adjustedAcc": 57.3
    },
    "diana": {
     "n": 955,
     "adjustedAcc": 65.0
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
  "key": "down_low",
  "trend": "down",
  "vol": "low",
  "median5": -2.05,
  "medianAbs1": 0.7,
  "advanceRatio5": 29.7,
  "medianRet1": 0.0,
  "advanceRatio1": 42.9
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 21954,
  "days": 43,
  "guardedN": 295,
  "baseline": {
   "hit": 11359,
   "miss": 9785,
   "mid": 810,
   "accuracy": 53.7
  },
  "guarded": {
   "hit": 11355,
   "miss": 9804,
   "mid": 795,
   "accuracy": 53.7
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 6391,
  "errors": 2501,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2347
   },
   {
    "label": "분석가 의견충돌",
    "count": 1405
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 84
   }
  ],
  "analystErrors": {
   "taro": 1451,
   "diana": 0,
   "nova": 149,
   "flow": 301
  },
  "regimeErrors": {
   "up_low": 723,
   "down_high": 696,
   "down_low": 408,
   "side_low": 352,
   "unknown": 322
  }
 },
 "shadow": {
  "n": 6391,
  "baselineActionN": 1175,
  "baselineActionPrecision": 54.0,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 6391,
   "SELL": 0
  },
  "testDays": 11,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 59.3,
  "brier": 0.248,
  "rawBrier": 0.2638
 },
 "prospective": {
  "n": 4500,
  "baselineActionN": 1412,
  "baselineActionPrecision": 24.4,
  "candidateActionN": 3592,
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
     "n": 298,
     "hit": 130,
     "raw": 0.4362,
     "uncalibratedAcc": 0.4359,
     "base": 0.4308,
     "calibratedAcc": 0.4359
    },
    "60": {
     "n": 204,
     "hit": 82,
     "raw": 0.402,
     "uncalibratedAcc": 0.4045,
     "base": 0.4308,
     "calibratedAcc": 0.4045
    },
    "70": {
     "n": 123,
     "hit": 56,
     "raw": 0.4553,
     "uncalibratedAcc": 0.4519,
     "base": 0.4308,
     "calibratedAcc": 0.4519
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.484,
     "base": 0.4308,
     "calibratedAcc": 0.484
    }
   },
   "SELL": {
    "40": {
     "n": 2126,
     "hit": 1202,
     "raw": 0.5654,
     "uncalibratedAcc": 0.5654,
     "base": 0.5625,
     "calibratedAcc": 0.5654
    },
    "45": {
     "n": 1023,
     "hit": 504,
     "raw": 0.4927,
     "uncalibratedAcc": 0.494,
     "base": 0.5625,
     "calibratedAcc": 0.494
    },
    "35": {
     "n": 1350,
     "hit": 854,
     "raw": 0.6326,
     "uncalibratedAcc": 0.6316,
     "base": 0.5625,
     "calibratedAcc": 0.5948
    },
    "30": {
     "n": 482,
     "hit": 271,
     "raw": 0.5622,
     "uncalibratedAcc": 0.5623,
     "base": 0.5625,
     "calibratedAcc": 0.5948
    },
    "25": {
     "n": 62,
     "hit": 16,
     "raw": 0.2581,
     "uncalibratedAcc": 0.3323,
     "base": 0.5625,
     "calibratedAcc": 0.5948
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3594,
     "base": 0.5625,
     "calibratedAcc": 0.5948
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5357,
     "base": 0.5625,
     "calibratedAcc": 0.5948
    }
   }
  },
  "evaluation": {
   "n": 1175,
   "buyN": 341,
   "sellN": 834,
   "testDays": 11,
   "testRegimes": 4,
   "candidate": {
    "n": 1175,
    "tierSpreadPp": 10.0,
    "corr": 0.1283
   },
   "baseline": {
    "n": 1175,
    "tierSpreadPp": 5.1,
    "corr": 0.0547
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
