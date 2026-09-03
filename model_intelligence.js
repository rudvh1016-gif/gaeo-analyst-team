// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-03 15:12",
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
    "n": 1952,
    "up": 1186,
    "raw": 0.6076,
    "uncalibratedPUp": 0.6077,
    "base": 0.6158,
    "pUp": 0.6077
   },
   "70": {
    "n": 2158,
    "up": 1334,
    "raw": 0.6182,
    "uncalibratedPUp": 0.6181,
    "base": 0.6158,
    "pUp": 0.6247
   },
   "50": {
    "n": 2566,
    "up": 1565,
    "raw": 0.6099,
    "uncalibratedPUp": 0.61,
    "base": 0.6158,
    "pUp": 0.61
   },
   "80": {
    "n": 2364,
    "up": 1523,
    "raw": 0.6442,
    "uncalibratedPUp": 0.6439,
    "base": 0.6158,
    "pUp": 0.6247
   },
   "30": {
    "n": 1342,
    "up": 794,
    "raw": 0.5917,
    "uncalibratedPUp": 0.5922,
    "base": 0.6158,
    "pUp": 0.5928
   },
   "90": {
    "n": 547,
    "up": 296,
    "raw": 0.5411,
    "uncalibratedPUp": 0.545,
    "base": 0.6158,
    "pUp": 0.6247
   },
   "60": {
    "n": 2121,
    "up": 1340,
    "raw": 0.6318,
    "uncalibratedPUp": 0.6316,
    "base": 0.6158,
    "pUp": 0.6247
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5774,
    "base": 0.6158,
    "pUp": 0.5928
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6158,
    "base": 0.6158,
    "pUp": 0.5928
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6158,
    "base": 0.6158,
    "pUp": 0.5928
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
   "n": 6040,
   "errorCorr": -0.155
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
   "n": 5624,
   "errorCorr": -0.063
  },
  "diana:flow": {
   "n": 999,
   "errorCorr": 0.127
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
   "n": 4248,
   "blend": 0.6,
   "weights": {
    "taro": 0.3398,
    "diana": 0.1057,
    "nova": 0.1831,
    "flow": 0.3713
   },
   "acc": {
    "taro": {
     "n": 1449,
     "adjustedAcc": 64.7
    },
    "diana": {
     "n": 1231,
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
   "n": 2462,
   "blend": 0.6,
   "weights": {
    "taro": 0.3436,
    "diana": 0.1026,
    "nova": 0.2311,
    "flow": 0.3226
   },
   "acc": {
    "taro": {
     "n": 1057,
     "adjustedAcc": 64.4
    },
    "diana": {
     "n": 585,
     "adjustedAcc": 45.1
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
    "taro": 0.2672,
    "diana": 0.1357,
    "nova": 0.2675,
    "flow": 0.3297
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
    "diana": 0.1104,
    "nova": 0.2543,
    "flow": 0.3102
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
    "taro": 0.3117,
    "diana": 0.1285,
    "nova": 0.1975,
    "flow": 0.3624
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
  "median5": -1.97,
  "medianAbs1": 1.55,
  "advanceRatio5": 33.1,
  "medianRet1": -0.05,
  "advanceRatio1": 46.7
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
   "hit": 11330,
   "miss": 9822,
   "mid": 802,
   "accuracy": 53.6
  },
  "guarded": {
   "hit": 11326,
   "miss": 9841,
   "mid": 787,
   "accuracy": 53.5
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 5887,
  "errors": 2268,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2120
   },
   {
    "label": "분석가 의견충돌",
    "count": 1274
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 83
   }
  ],
  "analystErrors": {
   "taro": 1247,
   "diana": 0,
   "nova": 149,
   "flow": 283
  },
  "regimeErrors": {
   "down_high": 696,
   "up_low": 453,
   "down_low": 408,
   "side_low": 389,
   "unknown": 322
  }
 },
 "shadow": {
  "n": 5887,
  "baselineActionN": 1083,
  "baselineActionPrecision": 53.4,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 5887,
   "SELL": 0
  },
  "testDays": 10,
  "testRegimes": 4,
  "candidateAllCallAccuracy": 60.4,
  "brier": 0.2497,
  "rawBrier": 0.2607
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
   "n": 1083,
   "buyN": 293,
   "sellN": 790,
   "testDays": 10,
   "testRegimes": 4,
   "candidate": {
    "n": 1083,
    "tierSpreadPp": 11.4,
    "corr": 0.1033
   },
   "baseline": {
    "n": 1083,
    "tierSpreadPp": 3.6,
    "corr": 0.0409
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
