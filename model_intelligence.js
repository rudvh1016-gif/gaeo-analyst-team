// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-01 13:44",
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
    "n": 1800,
    "up": 1109,
    "raw": 0.6161,
    "uncalibratedPUp": 0.6162,
    "base": 0.6218,
    "pUp": 0.6107
   },
   "70": {
    "n": 1987,
    "up": 1230,
    "raw": 0.619,
    "uncalibratedPUp": 0.6191,
    "base": 0.6218,
    "pUp": 0.63
   },
   "50": {
    "n": 2367,
    "up": 1432,
    "raw": 0.605,
    "uncalibratedPUp": 0.6052,
    "base": 0.6218,
    "pUp": 0.6107
   },
   "80": {
    "n": 2187,
    "up": 1426,
    "raw": 0.652,
    "uncalibratedPUp": 0.6516,
    "base": 0.6218,
    "pUp": 0.6325
   },
   "30": {
    "n": 1240,
    "up": 760,
    "raw": 0.6129,
    "uncalibratedPUp": 0.6131,
    "base": 0.6218,
    "pUp": 0.6107
   },
   "90": {
    "n": 511,
    "up": 281,
    "raw": 0.5499,
    "uncalibratedPUp": 0.5539,
    "base": 0.6218,
    "pUp": 0.6325
   },
   "60": {
    "n": 1960,
    "up": 1257,
    "raw": 0.6413,
    "uncalibratedPUp": 0.641,
    "base": 0.6218,
    "pUp": 0.63
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5829,
    "base": 0.6218,
    "pUp": 0.6083
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6218,
    "base": 0.6218,
    "pUp": 0.6083
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6218,
    "base": 0.6218,
    "pUp": 0.6083
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
   "n": 5648,
   "errorCorr": -0.172
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
   "n": 5116,
   "errorCorr": -0.064
  },
  "diana:flow": {
   "n": 924,
   "errorCorr": 0.144
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
   "n": 3651,
   "blend": 0.6,
   "weights": {
    "taro": 0.3365,
    "diana": 0.0995,
    "nova": 0.1969,
    "flow": 0.367
   },
   "acc": {
    "taro": {
     "n": 1449,
     "adjustedAcc": 64.7
    },
    "diana": {
     "n": 634,
     "adjustedAcc": 40.2
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
    "taro": 0.3357,
    "diana": 0.1018,
    "nova": 0.2463,
    "flow": 0.3162
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
    "taro": 0.2595,
    "diana": 0.138,
    "nova": 0.283,
    "flow": 0.3195
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
    "taro": 0.3163,
    "diana": 0.1126,
    "nova": 0.2697,
    "flow": 0.3014
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
   "n": 3473,
   "blend": 0.6,
   "weights": {
    "taro": 0.3048,
    "diana": 0.1309,
    "nova": 0.2104,
    "flow": 0.3538
   },
   "acc": {
    "taro": {
     "n": 1111,
     "adjustedAcc": 57.3
    },
    "diana": {
     "n": 955,
     "adjustedAcc": 64.5
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
  "key": "side_low",
  "trend": "side",
  "vol": "low",
  "median5": 0.8,
  "medianAbs1": 1.45,
  "advanceRatio5": 55.9,
  "medianRet1": -0.7,
  "advanceRatio1": 33.2
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 20756,
  "days": 41,
  "guardedN": 295,
  "baseline": {
   "hit": 10549,
   "miss": 9438,
   "mid": 769,
   "accuracy": 52.8
  },
  "guarded": {
   "hit": 10544,
   "miss": 9458,
   "mid": 754,
   "accuracy": 52.7
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 5193,
  "errors": 2152,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2007
   },
   {
    "label": "분석가 의견충돌",
    "count": 1187
   },
   {
    "label": "고변동성 국면",
    "count": 697
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 70
   }
  ],
  "analystErrors": {
   "taro": 1257,
   "diana": 0,
   "nova": 129,
   "flow": 272
  },
  "regimeErrors": {
   "down_high": 697,
   "up_low": 555,
   "down_low": 408,
   "unknown": 322,
   "side_low": 170
  }
 },
 "shadow": {
  "n": 5193,
  "baselineActionN": 943,
  "baselineActionPrecision": 47.9,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 5193,
   "SELL": 0
  },
  "testDays": 9,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 58.0,
  "brier": 0.2501,
  "rawBrier": 0.2628
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
   "n": 943,
   "buyN": 283,
   "sellN": 660,
   "testDays": 9,
   "testRegimes": 4,
   "candidate": {
    "n": 943,
    "tierSpreadPp": -4.8,
    "corr": 0.0633
   },
   "baseline": {
    "n": 943,
    "tierSpreadPp": 3.8,
    "corr": 0.0505
   }
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -4.8pp vs 기존 3.8pp)"
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
