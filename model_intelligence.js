// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-04 09:11",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1857,
    "up": 965,
    "raw": 0.5197,
    "uncalibratedPUp": 0.5189,
    "base": 0.4743,
    "pUp": 0.4973
   },
   "20": {
    "n": 1004,
    "up": 482,
    "raw": 0.4801,
    "uncalibratedPUp": 0.4799,
    "base": 0.4743,
    "pUp": 0.4524
   },
   "40": {
    "n": 2236,
    "up": 1136,
    "raw": 0.5081,
    "uncalibratedPUp": 0.5076,
    "base": 0.4743,
    "pUp": 0.4973
   },
   "30": {
    "n": 2551,
    "up": 1125,
    "raw": 0.441,
    "uncalibratedPUp": 0.4414,
    "base": 0.4743,
    "pUp": 0.4524
   },
   "70": {
    "n": 670,
    "up": 323,
    "raw": 0.4821,
    "uncalibratedPUp": 0.4818,
    "base": 0.4743,
    "pUp": 0.4973
   },
   "80": {
    "n": 513,
    "up": 208,
    "raw": 0.4055,
    "uncalibratedPUp": 0.4093,
    "base": 0.4743,
    "pUp": 0.4973
   },
   "60": {
    "n": 1405,
    "up": 717,
    "raw": 0.5103,
    "uncalibratedPUp": 0.5096,
    "base": 0.4743,
    "pUp": 0.4973
   },
   "10": {
    "n": 3166,
    "up": 1419,
    "raw": 0.4482,
    "uncalibratedPUp": 0.4484,
    "base": 0.4743,
    "pUp": 0.4487
   },
   "90": {
    "n": 154,
    "up": 54,
    "raw": 0.3506,
    "uncalibratedPUp": 0.3708,
    "base": 0.4743,
    "pUp": 0.4973
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4487
   }
  },
  "diana": {
   "40": {
    "n": 2030,
    "up": 1227,
    "raw": 0.6044,
    "uncalibratedPUp": 0.6045,
    "base": 0.6117,
    "pUp": 0.6045
   },
   "70": {
    "n": 2246,
    "up": 1380,
    "raw": 0.6144,
    "uncalibratedPUp": 0.6144,
    "base": 0.6117,
    "pUp": 0.6196
   },
   "50": {
    "n": 2670,
    "up": 1630,
    "raw": 0.6105,
    "uncalibratedPUp": 0.6105,
    "base": 0.6117,
    "pUp": 0.6105
   },
   "80": {
    "n": 2449,
    "up": 1569,
    "raw": 0.6407,
    "uncalibratedPUp": 0.6403,
    "base": 0.6117,
    "pUp": 0.6209
   },
   "30": {
    "n": 1394,
    "up": 808,
    "raw": 0.5796,
    "uncalibratedPUp": 0.5803,
    "base": 0.6117,
    "pUp": 0.5814
   },
   "90": {
    "n": 562,
    "up": 301,
    "raw": 0.5356,
    "uncalibratedPUp": 0.5394,
    "base": 0.6117,
    "pUp": 0.6209
   },
   "60": {
    "n": 2198,
    "up": 1374,
    "raw": 0.6251,
    "uncalibratedPUp": 0.6249,
    "base": 0.6117,
    "pUp": 0.6196
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5735,
    "base": 0.6117,
    "pUp": 0.5814
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6117,
    "base": 0.6117,
    "pUp": 0.5814
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6117,
    "base": 0.6117,
    "pUp": 0.5814
   }
  },
  "nova": {
   "50": {
    "n": 1753,
    "up": 665,
    "raw": 0.3793,
    "uncalibratedPUp": 0.3809,
    "base": 0.4743,
    "pUp": 0.4309
   },
   "40": {
    "n": 3826,
    "up": 1493,
    "raw": 0.3902,
    "uncalibratedPUp": 0.3909,
    "base": 0.4743,
    "pUp": 0.4309
   },
   "30": {
    "n": 3460,
    "up": 1468,
    "raw": 0.4243,
    "uncalibratedPUp": 0.4247,
    "base": 0.4743,
    "pUp": 0.4309
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2558,
    "base": 0.4743,
    "pUp": 0.6491
   },
   "60": {
    "n": 2575,
    "up": 1723,
    "raw": 0.6691,
    "uncalibratedPUp": 0.6669,
    "base": 0.4743,
    "pUp": 0.6491
   },
   "20": {
    "n": 1884,
    "up": 1073,
    "raw": 0.5695,
    "uncalibratedPUp": 0.568,
    "base": 0.4743,
    "pUp": 0.4309
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.459,
    "base": 0.4743,
    "pUp": 0.6491
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4185,
    "base": 0.4743,
    "pUp": 0.6491
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4309
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4309
   }
  },
  "flow": {
   "50": {
    "n": 8686,
    "up": 4216,
    "raw": 0.4854,
    "uncalibratedPUp": 0.4853,
    "base": 0.4743,
    "pUp": 0.4853
   },
   "70": {
    "n": 178,
    "up": 100,
    "raw": 0.5618,
    "uncalibratedPUp": 0.5492,
    "base": 0.4743,
    "pUp": 0.5345
   },
   "40": {
    "n": 3598,
    "up": 1599,
    "raw": 0.4444,
    "uncalibratedPUp": 0.4447,
    "base": 0.4743,
    "pUp": 0.4447
   },
   "30": {
    "n": 412,
    "up": 154,
    "raw": 0.3738,
    "uncalibratedPUp": 0.3806,
    "base": 0.4743,
    "pUp": 0.4041
   },
   "60": {
    "n": 593,
    "up": 322,
    "raw": 0.543,
    "uncalibratedPUp": 0.5397,
    "base": 0.4743,
    "pUp": 0.5345
   },
   "20": {
    "n": 80,
    "up": 34,
    "raw": 0.425,
    "uncalibratedPUp": 0.4384,
    "base": 0.4743,
    "pUp": 0.4041
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4065,
    "base": 0.4743,
    "pUp": 0.5345
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5361,
    "base": 0.4743,
    "pUp": 0.4041
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.4041
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4743,
    "base": 0.4743,
    "pUp": 0.5345
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 6233,
   "errorCorr": -0.144
  },
  "taro:nova": {
   "n": 7563,
   "errorCorr": 0.182
  },
  "taro:flow": {
   "n": 1583,
   "errorCorr": 0.239
  },
  "diana:nova": {
   "n": 5640,
   "errorCorr": -0.062
  },
  "diana:flow": {
   "n": 1031,
   "errorCorr": 0.128
  },
  "nova:flow": {
   "n": 1389,
   "errorCorr": -0.1
  }
 },
 "redundancyFactor": {
  "taro": 0.9927,
  "diana": 1,
  "nova": 0.9981,
  "flow": 0.9947
 },
 "regimes": {
  "up_high": {
   "n": 4246,
   "blend": 0.6,
   "weights": {
    "taro": 0.3378,
    "diana": 0.105,
    "nova": 0.1843,
    "flow": 0.3728
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
   "n": 2748,
   "blend": 0.6,
   "weights": {
    "taro": 0.3403,
    "diana": 0.105,
    "nova": 0.2319,
    "flow": 0.3228
   },
   "acc": {
    "taro": {
     "n": 1057,
     "adjustedAcc": 64.4
    },
    "diana": {
     "n": 871,
     "adjustedAcc": 48.1
    },
    "nova": {
     "n": 630,
     "adjustedAcc": 55.7
    },
    "flow": {
     "n": 190,
     "adjustedAcc": 53.6
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2655,
    "diana": 0.1347,
    "nova": 0.2691,
    "flow": 0.3308
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
    "taro": 0.323,
    "diana": 0.1097,
    "nova": 0.2559,
    "flow": 0.3114
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
    "taro": 0.3098,
    "diana": 0.1276,
    "nova": 0.1988,
    "flow": 0.3638
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
  "median5": -2.29,
  "medianAbs1": 1.07,
  "advanceRatio5": 23.0,
  "medianRet1": 0.9,
  "advanceRatio1": 74.5
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
   "hit": 11724,
   "miss": 10005,
   "mid": 822,
   "accuracy": 54.0
  },
  "guarded": {
   "hit": 11720,
   "miss": 10024,
   "mid": 807,
   "accuracy": 53.9
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 6484,
  "errors": 2451,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2297
   },
   {
    "label": "분석가 의견충돌",
    "count": 1382
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 87
   }
  ],
  "analystErrors": {
   "taro": 1370,
   "diana": 0,
   "nova": 159,
   "flow": 296
  },
  "regimeErrors": {
   "down_high": 696,
   "up_low": 627,
   "down_low": 408,
   "side_low": 398,
   "unknown": 322
  }
 },
 "shadow": {
  "n": 6484,
  "baselineActionN": 1206,
  "baselineActionPrecision": 55.2,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 6484,
   "SELL": 0
  },
  "testDays": 11,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 60.9,
  "brier": 0.249,
  "rawBrier": 0.262
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
     "n": 307,
     "hit": 135,
     "raw": 0.4397,
     "uncalibratedAcc": 0.4394,
     "base": 0.4346,
     "calibratedAcc": 0.4394
    },
    "60": {
     "n": 230,
     "hit": 95,
     "raw": 0.413,
     "uncalibratedAcc": 0.4148,
     "base": 0.4346,
     "calibratedAcc": 0.4148
    },
    "70": {
     "n": 124,
     "hit": 56,
     "raw": 0.4516,
     "uncalibratedAcc": 0.4492,
     "base": 0.4346,
     "calibratedAcc": 0.4492
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.4872,
     "base": 0.4346,
     "calibratedAcc": 0.4872
    }
   },
   "SELL": {
    "40": {
     "n": 2177,
     "hit": 1208,
     "raw": 0.5549,
     "uncalibratedAcc": 0.5549,
     "base": 0.5508,
     "calibratedAcc": 0.5549
    },
    "45": {
     "n": 1059,
     "hit": 512,
     "raw": 0.4835,
     "uncalibratedAcc": 0.4847,
     "base": 0.5508,
     "calibratedAcc": 0.4847
    },
    "35": {
     "n": 1375,
     "hit": 856,
     "raw": 0.6225,
     "uncalibratedAcc": 0.6215,
     "base": 0.5508,
     "calibratedAcc": 0.581
    },
    "30": {
     "n": 501,
     "hit": 272,
     "raw": 0.5429,
     "uncalibratedAcc": 0.5432,
     "base": 0.5508,
     "calibratedAcc": 0.581
    },
    "25": {
     "n": 71,
     "hit": 17,
     "raw": 0.2394,
     "uncalibratedAcc": 0.3079,
     "base": 0.5508,
     "calibratedAcc": 0.581
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3545,
     "base": 0.5508,
     "calibratedAcc": 0.581
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5246,
     "base": 0.5508,
     "calibratedAcc": 0.581
    }
   }
  },
  "evaluation": {
   "n": 1206,
   "buyN": 329,
   "sellN": 877,
   "testDays": 11,
   "testRegimes": 4,
   "candidate": {
    "n": 1206,
    "tierSpreadPp": 19.9,
    "corr": 0.1489
   },
   "baseline": {
    "n": 1206,
    "tierSpreadPp": 5.0,
    "corr": 0.0477
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
