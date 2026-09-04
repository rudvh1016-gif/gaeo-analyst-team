// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-04 13:41",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1968,
    "up": 1061,
    "raw": 0.5391,
    "uncalibratedPUp": 0.5383,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "20": {
    "n": 1009,
    "up": 485,
    "raw": 0.4807,
    "uncalibratedPUp": 0.4808,
    "base": 0.4853,
    "pUp": 0.4572
   },
   "40": {
    "n": 2292,
    "up": 1183,
    "raw": 0.5161,
    "uncalibratedPUp": 0.5157,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "30": {
    "n": 2582,
    "up": 1155,
    "raw": 0.4473,
    "uncalibratedPUp": 0.4478,
    "base": 0.4853,
    "pUp": 0.4572
   },
   "70": {
    "n": 749,
    "up": 384,
    "raw": 0.5127,
    "uncalibratedPUp": 0.5116,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "80": {
    "n": 579,
    "up": 242,
    "raw": 0.418,
    "uncalibratedPUp": 0.4213,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "60": {
    "n": 1518,
    "up": 805,
    "raw": 0.5303,
    "uncalibratedPUp": 0.5294,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "10": {
    "n": 3191,
    "up": 1444,
    "raw": 0.4525,
    "uncalibratedPUp": 0.4528,
    "base": 0.4853,
    "pUp": 0.4531
   },
   "90": {
    "n": 168,
    "up": 62,
    "raw": 0.369,
    "uncalibratedPUp": 0.3867,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4531
   }
  },
  "diana": {
   "40": {
    "n": 2030,
    "up": 1229,
    "raw": 0.6054,
    "uncalibratedPUp": 0.6055,
    "base": 0.6111,
    "pUp": 0.6055
   },
   "70": {
    "n": 2246,
    "up": 1372,
    "raw": 0.6109,
    "uncalibratedPUp": 0.6109,
    "base": 0.6111,
    "pUp": 0.618
   },
   "50": {
    "n": 2670,
    "up": 1626,
    "raw": 0.609,
    "uncalibratedPUp": 0.609,
    "base": 0.6111,
    "pUp": 0.609
   },
   "80": {
    "n": 2449,
    "up": 1570,
    "raw": 0.6411,
    "uncalibratedPUp": 0.6407,
    "base": 0.6111,
    "pUp": 0.6212
   },
   "30": {
    "n": 1394,
    "up": 808,
    "raw": 0.5796,
    "uncalibratedPUp": 0.5803,
    "base": 0.6111,
    "pUp": 0.5814
   },
   "90": {
    "n": 562,
    "up": 301,
    "raw": 0.5356,
    "uncalibratedPUp": 0.5394,
    "base": 0.6111,
    "pUp": 0.6212
   },
   "60": {
    "n": 2198,
    "up": 1375,
    "raw": 0.6256,
    "uncalibratedPUp": 0.6254,
    "base": 0.6111,
    "pUp": 0.618
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5729,
    "base": 0.6111,
    "pUp": 0.5814
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6111,
    "base": 0.6111,
    "pUp": 0.5814
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6111,
    "base": 0.6111,
    "pUp": 0.5814
   }
  },
  "nova": {
   "50": {
    "n": 1992,
    "up": 848,
    "raw": 0.4257,
    "uncalibratedPUp": 0.4266,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "40": {
    "n": 4041,
    "up": 1665,
    "raw": 0.412,
    "uncalibratedPUp": 0.4126,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "30": {
    "n": 3502,
    "up": 1503,
    "raw": 0.4292,
    "uncalibratedPUp": 0.4297,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2597,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "60": {
    "n": 2575,
    "up": 1723,
    "raw": 0.6691,
    "uncalibratedPUp": 0.667,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "20": {
    "n": 1888,
    "up": 1075,
    "raw": 0.5694,
    "uncalibratedPUp": 0.5681,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4696,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4282,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4463
   }
  },
  "flow": {
   "50": {
    "n": 9001,
    "up": 4450,
    "raw": 0.4944,
    "uncalibratedPUp": 0.4944,
    "base": 0.4853,
    "pUp": 0.4944
   },
   "70": {
    "n": 186,
    "up": 105,
    "raw": 0.5645,
    "uncalibratedPUp": 0.5535,
    "base": 0.4853,
    "pUp": 0.5442
   },
   "40": {
    "n": 3742,
    "up": 1721,
    "raw": 0.4599,
    "uncalibratedPUp": 0.4601,
    "base": 0.4853,
    "pUp": 0.4601
   },
   "30": {
    "n": 426,
    "up": 167,
    "raw": 0.392,
    "uncalibratedPUp": 0.3982,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "60": {
    "n": 610,
    "up": 338,
    "raw": 0.5541,
    "uncalibratedPUp": 0.5509,
    "base": 0.4853,
    "pUp": 0.5442
   },
   "20": {
    "n": 82,
    "up": 36,
    "raw": 0.439,
    "uncalibratedPUp": 0.4514,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4159,
    "base": 0.4853,
    "pUp": 0.5442
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5458,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.5442
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 6235,
   "errorCorr": -0.145
  },
  "taro:nova": {
   "n": 7599,
   "errorCorr": 0.186
  },
  "taro:flow": {
   "n": 1643,
   "errorCorr": 0.252
  },
  "diana:nova": {
   "n": 5640,
   "errorCorr": -0.062
  },
  "diana:flow": {
   "n": 1032,
   "errorCorr": 0.125
  },
  "nova:flow": {
   "n": 1398,
   "errorCorr": -0.091
  }
 },
 "redundancyFactor": {
  "taro": 0.9917,
  "diana": 1,
  "nova": 0.9978,
  "flow": 0.9939
 },
 "regimes": {
  "up_high": {
   "n": 4246,
   "blend": 0.6,
   "weights": {
    "taro": 0.3375,
    "diana": 0.1053,
    "nova": 0.1863,
    "flow": 0.3709
   },
   "acc": {
    "taro": {
     "n": 1449,
     "adjustedAcc": 64.7
    },
    "diana": {
     "n": 1229,
     "adjustedAcc": 49.0
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
   "n": 3213,
   "blend": 0.6,
   "weights": {
    "taro": 0.3432,
    "diana": 0.1078,
    "nova": 0.2336,
    "flow": 0.3153
   },
   "acc": {
    "taro": {
     "n": 1408,
     "adjustedAcc": 62.8
    },
    "diana": {
     "n": 864,
     "adjustedAcc": 47.9
    },
    "nova": {
     "n": 675,
     "adjustedAcc": 53.1
    },
    "flow": {
     "n": 266,
     "adjustedAcc": 49.7
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2648,
    "diana": 0.1348,
    "nova": 0.2717,
    "flow": 0.3287
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
    "taro": 0.3223,
    "diana": 0.1098,
    "nova": 0.2584,
    "flow": 0.3095
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
    "taro": 0.3094,
    "diana": 0.1279,
    "nova": 0.2009,
    "flow": 0.3619
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
  "median5": -2.13,
  "medianAbs1": 1.42,
  "advanceRatio5": 25.2,
  "medianRet1": 0.76,
  "advanceRatio1": 65.8
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 22551,
  "days": 44,
  "guardedN": 295,
  "baseline": {
   "hit": 11708,
   "miss": 10014,
   "mid": 829,
   "accuracy": 53.9
  },
  "guarded": {
   "hit": 11704,
   "miss": 10033,
   "mid": 814,
   "accuracy": 53.8
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 5980,
  "errors": 2175,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2019
   },
   {
    "label": "분석가 의견충돌",
    "count": 1210
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 79
   }
  ],
  "analystErrors": {
   "taro": 1148,
   "diana": 0,
   "nova": 157,
   "flow": 271
  },
  "regimeErrors": {
   "down_high": 696,
   "down_low": 408,
   "side_low": 398,
   "up_low": 351,
   "unknown": 322
  }
 },
 "shadow": {
  "n": 5980,
  "baselineActionN": 1098,
  "baselineActionPrecision": 55.4,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 5980,
   "SELL": 0
  },
  "testDays": 10,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 62.4,
  "brier": 0.25,
  "rawBrier": 0.259
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
     "n": 317,
     "hit": 140,
     "raw": 0.4416,
     "uncalibratedAcc": 0.4411,
     "base": 0.4331,
     "calibratedAcc": 0.4411
    },
    "60": {
     "n": 249,
     "hit": 102,
     "raw": 0.4096,
     "uncalibratedAcc": 0.4114,
     "base": 0.4331,
     "calibratedAcc": 0.4114
    },
    "70": {
     "n": 125,
     "hit": 56,
     "raw": 0.448,
     "uncalibratedAcc": 0.4459,
     "base": 0.4331,
     "calibratedAcc": 0.4459
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.4859,
     "base": 0.4331,
     "calibratedAcc": 0.4859
    }
   },
   "SELL": {
    "40": {
     "n": 2231,
     "hit": 1211,
     "raw": 0.5428,
     "uncalibratedAcc": 0.5428,
     "base": 0.5376,
     "calibratedAcc": 0.5428
    },
    "45": {
     "n": 1090,
     "hit": 517,
     "raw": 0.4743,
     "uncalibratedAcc": 0.4755,
     "base": 0.5376,
     "calibratedAcc": 0.4755
    },
    "35": {
     "n": 1410,
     "hit": 858,
     "raw": 0.6085,
     "uncalibratedAcc": 0.6075,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "30": {
     "n": 524,
     "hit": 272,
     "raw": 0.5191,
     "uncalibratedAcc": 0.5198,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "25": {
     "n": 75,
     "hit": 17,
     "raw": 0.2267,
     "uncalibratedAcc": 0.2921,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.349,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.512,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    }
   }
  },
  "evaluation": {
   "n": 1098,
   "buyN": 262,
   "sellN": 836,
   "testDays": 10,
   "testRegimes": 4,
   "candidate": {
    "n": 1098,
    "tierSpreadPp": 18.0,
    "corr": 0.0973
   },
   "baseline": {
    "n": 1098,
    "tierSpreadPp": 4.9,
    "corr": 0.0419
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
