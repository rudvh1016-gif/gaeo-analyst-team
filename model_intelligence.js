// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-02 15:02",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1754,
    "up": 878,
    "raw": 0.5006,
    "uncalibratedPUp": 0.5,
    "base": 0.4651,
    "pUp": 0.483
   },
   "20": {
    "n": 998,
    "up": 478,
    "raw": 0.479,
    "uncalibratedPUp": 0.4786,
    "base": 0.4651,
    "pUp": 0.4478
   },
   "40": {
    "n": 2183,
    "up": 1094,
    "raw": 0.5011,
    "uncalibratedPUp": 0.5007,
    "base": 0.4651,
    "pUp": 0.483
   },
   "30": {
    "n": 2515,
    "up": 1094,
    "raw": 0.435,
    "uncalibratedPUp": 0.4353,
    "base": 0.4651,
    "pUp": 0.4478
   },
   "70": {
    "n": 595,
    "up": 278,
    "raw": 0.4672,
    "uncalibratedPUp": 0.4671,
    "base": 0.4651,
    "pUp": 0.483
   },
   "80": {
    "n": 460,
    "up": 183,
    "raw": 0.3978,
    "uncalibratedPUp": 0.4019,
    "base": 0.4651,
    "pUp": 0.483
   },
   "60": {
    "n": 1271,
    "up": 620,
    "raw": 0.4878,
    "uncalibratedPUp": 0.4873,
    "base": 0.4651,
    "pUp": 0.483
   },
   "10": {
    "n": 3144,
    "up": 1406,
    "raw": 0.4472,
    "uncalibratedPUp": 0.4474,
    "base": 0.4651,
    "pUp": 0.4475
   },
   "90": {
    "n": 136,
    "up": 41,
    "raw": 0.3015,
    "uncalibratedPUp": 0.331,
    "base": 0.4651,
    "pUp": 0.483
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4651,
    "base": 0.4651,
    "pUp": 0.4475
   }
  },
  "diana": {
   "40": {
    "n": 1875,
    "up": 1155,
    "raw": 0.616,
    "uncalibratedPUp": 0.6161,
    "base": 0.6214,
    "pUp": 0.6138
   },
   "70": {
    "n": 2075,
    "up": 1288,
    "raw": 0.6207,
    "uncalibratedPUp": 0.6207,
    "base": 0.6214,
    "pUp": 0.629
   },
   "50": {
    "n": 2466,
    "up": 1509,
    "raw": 0.6119,
    "uncalibratedPUp": 0.612,
    "base": 0.6214,
    "pUp": 0.6138
   },
   "80": {
    "n": 2276,
    "up": 1478,
    "raw": 0.6494,
    "uncalibratedPUp": 0.649,
    "base": 0.6214,
    "pUp": 0.6295
   },
   "30": {
    "n": 1290,
    "up": 781,
    "raw": 0.6054,
    "uncalibratedPUp": 0.6058,
    "base": 0.6214,
    "pUp": 0.6059
   },
   "90": {
    "n": 530,
    "up": 289,
    "raw": 0.5453,
    "uncalibratedPUp": 0.5494,
    "base": 0.6214,
    "pUp": 0.6295
   },
   "60": {
    "n": 2039,
    "up": 1300,
    "raw": 0.6376,
    "uncalibratedPUp": 0.6373,
    "base": 0.6214,
    "pUp": 0.629
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5825,
    "base": 0.6214,
    "pUp": 0.6059
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6214,
    "base": 0.6214,
    "pUp": 0.6059
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6214,
    "base": 0.6214,
    "pUp": 0.6059
   }
  },
  "nova": {
   "50": {
    "n": 1523,
    "up": 520,
    "raw": 0.3414,
    "uncalibratedPUp": 0.3438,
    "base": 0.4651,
    "pUp": 0.4173
   },
   "40": {
    "n": 3602,
    "up": 1316,
    "raw": 0.3654,
    "uncalibratedPUp": 0.3662,
    "base": 0.4651,
    "pUp": 0.4173
   },
   "30": {
    "n": 3418,
    "up": 1434,
    "raw": 0.4195,
    "uncalibratedPUp": 0.4199,
    "base": 0.4651,
    "pUp": 0.4173
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2524,
    "base": 0.4651,
    "pUp": 0.649
   },
   "60": {
    "n": 2575,
    "up": 1724,
    "raw": 0.6695,
    "uncalibratedPUp": 0.6672,
    "base": 0.4651,
    "pUp": 0.649
   },
   "20": {
    "n": 1880,
    "up": 1071,
    "raw": 0.5697,
    "uncalibratedPUp": 0.568,
    "base": 0.4651,
    "pUp": 0.4173
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4501,
    "base": 0.4651,
    "pUp": 0.649
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4104,
    "base": 0.4651,
    "pUp": 0.649
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4651,
    "base": 0.4651,
    "pUp": 0.4173
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4651,
    "base": 0.4651,
    "pUp": 0.4173
   }
  },
  "flow": {
   "50": {
    "n": 8353,
    "up": 3983,
    "raw": 0.4768,
    "uncalibratedPUp": 0.4768,
    "base": 0.4651,
    "pUp": 0.4768
   },
   "70": {
    "n": 167,
    "up": 95,
    "raw": 0.5689,
    "uncalibratedPUp": 0.5531,
    "base": 0.4651,
    "pUp": 0.5298
   },
   "40": {
    "n": 3476,
    "up": 1509,
    "raw": 0.4341,
    "uncalibratedPUp": 0.4344,
    "base": 0.4651,
    "pUp": 0.4344
   },
   "30": {
    "n": 398,
    "up": 140,
    "raw": 0.3518,
    "uncalibratedPUp": 0.3597,
    "base": 0.4651,
    "pUp": 0.3874
   },
   "60": {
    "n": 574,
    "up": 308,
    "raw": 0.5366,
    "uncalibratedPUp": 0.533,
    "base": 0.4651,
    "pUp": 0.5298
   },
   "20": {
    "n": 79,
    "up": 33,
    "raw": 0.4177,
    "uncalibratedPUp": 0.4308,
    "base": 0.4651,
    "pUp": 0.3874
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3986,
    "base": 0.4651,
    "pUp": 0.5298
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.528,
    "base": 0.4651,
    "pUp": 0.3874
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4651,
    "base": 0.4651,
    "pUp": 0.3874
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4651,
    "base": 0.4651,
    "pUp": 0.5298
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 5854,
   "errorCorr": -0.164
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
   "n": 5391,
   "errorCorr": -0.068
  },
  "diana:flow": {
   "n": 963,
   "errorCorr": 0.135
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
   "n": 3954,
   "blend": 0.6,
   "weights": {
    "taro": 0.3421,
    "diana": 0.1046,
    "nova": 0.1923,
    "flow": 0.361
   },
   "acc": {
    "taro": {
     "n": 1449,
     "adjustedAcc": 64.7
    },
    "diana": {
     "n": 937,
     "adjustedAcc": 46.8
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
    "diana": 0.1004,
    "nova": 0.242,
    "flow": 0.3136
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
    "taro": 0.2668,
    "diana": 0.1364,
    "nova": 0.2789,
    "flow": 0.3179
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
    "taro": 0.3246,
    "diana": 0.111,
    "nova": 0.2652,
    "flow": 0.2992
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
   "n": 3474,
   "blend": 0.6,
   "weights": {
    "taro": 0.3125,
    "diana": 0.1297,
    "nova": 0.2068,
    "flow": 0.351
   },
   "acc": {
    "taro": {
     "n": 1111,
     "adjustedAcc": 57.3
    },
    "diana": {
     "n": 956,
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
  "key": "down_high",
  "trend": "down",
  "vol": "high",
  "median5": -1.9,
  "medianAbs1": 2.35,
  "advanceRatio5": 31.7,
  "medianRet1": -2.08,
  "advanceRatio1": 15.0
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 21353,
  "days": 42,
  "guardedN": 295,
  "baseline": {
   "hit": 10948,
   "miss": 9613,
   "mid": 792,
   "accuracy": 53.2
  },
  "guarded": {
   "hit": 10943,
   "miss": 9633,
   "mid": 777,
   "accuracy": 53.2
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 5790,
  "errors": 2327,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2176
   },
   {
    "label": "분석가 의견충돌",
    "count": 1294
   },
   {
    "label": "고변동성 국면",
    "count": 697
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 79
   }
  ],
  "analystErrors": {
   "taro": 1344,
   "diana": 0,
   "nova": 135,
   "flow": 289
  },
  "regimeErrors": {
   "up_low": 726,
   "down_high": 697,
   "down_low": 408,
   "unknown": 322,
   "side_low": 174
  }
 },
 "shadow": {
  "n": 5790,
  "baselineActionN": 1053,
  "baselineActionPrecision": 50.6,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 5790,
   "SELL": 0
  },
  "testDays": 10,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 59.1,
  "brier": 0.2492,
  "rawBrier": 0.2633
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
     "base": 0.5623,
     "calibratedAcc": 0.5654
    },
    "45": {
     "n": 1023,
     "hit": 504,
     "raw": 0.4927,
     "uncalibratedAcc": 0.494,
     "base": 0.5623,
     "calibratedAcc": 0.494
    },
    "35": {
     "n": 1350,
     "hit": 854,
     "raw": 0.6326,
     "uncalibratedAcc": 0.6316,
     "base": 0.5623,
     "calibratedAcc": 0.5943
    },
    "30": {
     "n": 482,
     "hit": 270,
     "raw": 0.5602,
     "uncalibratedAcc": 0.5603,
     "base": 0.5623,
     "calibratedAcc": 0.5943
    },
    "25": {
     "n": 62,
     "hit": 16,
     "raw": 0.2581,
     "uncalibratedAcc": 0.3323,
     "base": 0.5623,
     "calibratedAcc": 0.5943
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3593,
     "base": 0.5623,
     "calibratedAcc": 0.5943
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5355,
     "base": 0.5623,
     "calibratedAcc": 0.5943
    }
   }
  },
  "evaluation": {
   "n": 1053,
   "buyN": 307,
   "sellN": 746,
   "testDays": 10,
   "testRegimes": 4,
   "candidate": {
    "n": 1053,
    "tierSpreadPp": 2.6,
    "corr": 0.1028
   },
   "baseline": {
    "n": 1053,
    "tierSpreadPp": 3.7,
    "corr": 0.0405
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 2.6pp vs 기존 3.7pp)"
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
