// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-26 12:43",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1399,
    "up": 547,
    "raw": 0.391,
    "uncalibratedPUp": 0.3914,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "20": {
    "n": 924,
    "up": 414,
    "raw": 0.4481,
    "uncalibratedPUp": 0.4469,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "40": {
    "n": 1911,
    "up": 843,
    "raw": 0.4411,
    "uncalibratedPUp": 0.4407,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "30": {
    "n": 2362,
    "up": 955,
    "raw": 0.4043,
    "uncalibratedPUp": 0.4044,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "70": {
    "n": 486,
    "up": 185,
    "raw": 0.3807,
    "uncalibratedPUp": 0.3824,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "80": {
    "n": 389,
    "up": 127,
    "raw": 0.3265,
    "uncalibratedPUp": 0.3325,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "60": {
    "n": 993,
    "up": 389,
    "raw": 0.3917,
    "uncalibratedPUp": 0.3923,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "10": {
    "n": 2978,
    "up": 1266,
    "raw": 0.4251,
    "uncalibratedPUp": 0.425,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "90": {
    "n": 121,
    "up": 28,
    "raw": 0.2314,
    "uncalibratedPUp": 0.2671,
    "base": 0.4111,
    "pUp": 0.4111
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4111,
    "base": 0.4111,
    "pUp": 0.4111
   }
  },
  "diana": {
   "40": {
    "n": 1526,
    "up": 865,
    "raw": 0.5668,
    "uncalibratedPUp": 0.567,
    "base": 0.5755,
    "pUp": 0.5578
   },
   "70": {
    "n": 1630,
    "up": 942,
    "raw": 0.5779,
    "uncalibratedPUp": 0.5779,
    "base": 0.5755,
    "pUp": 0.5866
   },
   "50": {
    "n": 1987,
    "up": 1081,
    "raw": 0.544,
    "uncalibratedPUp": 0.5445,
    "base": 0.5755,
    "pUp": 0.5578
   },
   "80": {
    "n": 1801,
    "up": 1115,
    "raw": 0.6191,
    "uncalibratedPUp": 0.6184,
    "base": 0.5755,
    "pUp": 0.5961
   },
   "30": {
    "n": 1055,
    "up": 600,
    "raw": 0.5687,
    "uncalibratedPUp": 0.5689,
    "base": 0.5755,
    "pUp": 0.5578
   },
   "90": {
    "n": 418,
    "up": 209,
    "raw": 0.5,
    "uncalibratedPUp": 0.5051,
    "base": 0.5755,
    "pUp": 0.5961
   },
   "60": {
    "n": 1637,
    "up": 975,
    "raw": 0.5956,
    "uncalibratedPUp": 0.5952,
    "base": 0.5755,
    "pUp": 0.5866
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5395,
    "base": 0.5755,
    "pUp": 0.5578
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5755,
    "base": 0.5755,
    "pUp": 0.5578
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5755,
    "base": 0.5755,
    "pUp": 0.5578
   }
  },
  "nova": {
   "50": {
    "n": 1451,
    "up": 450,
    "raw": 0.3101,
    "uncalibratedPUp": 0.3122,
    "base": 0.4111,
    "pUp": 0.3507
   },
   "40": {
    "n": 3481,
    "up": 1209,
    "raw": 0.3473,
    "uncalibratedPUp": 0.3479,
    "base": 0.4111,
    "pUp": 0.3507
   },
   "30": {
    "n": 3073,
    "up": 1143,
    "raw": 0.3719,
    "uncalibratedPUp": 0.3723,
    "base": 0.4111,
    "pUp": 0.3507
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2329,
    "base": 0.4111,
    "pUp": 0.633
   },
   "60": {
    "n": 2437,
    "up": 1599,
    "raw": 0.6561,
    "uncalibratedPUp": 0.6532,
    "base": 0.4111,
    "pUp": 0.633
   },
   "20": {
    "n": 1063,
    "up": 346,
    "raw": 0.3255,
    "uncalibratedPUp": 0.3278,
    "base": 0.4111,
    "pUp": 0.3322
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3979,
    "base": 0.4111,
    "pUp": 0.633
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3628,
    "base": 0.4111,
    "pUp": 0.633
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4111,
    "base": 0.4111,
    "pUp": 0.3322
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4111,
    "base": 0.4111,
    "pUp": 0.3322
   }
  },
  "flow": {
   "50": {
    "n": 7273,
    "up": 3025,
    "raw": 0.4159,
    "uncalibratedPUp": 0.4159,
    "base": 0.4111,
    "pUp": 0.4159
   },
   "70": {
    "n": 132,
    "up": 67,
    "raw": 0.5076,
    "uncalibratedPUp": 0.4897,
    "base": 0.4111,
    "pUp": 0.4582
   },
   "40": {
    "n": 3225,
    "up": 1293,
    "raw": 0.4009,
    "uncalibratedPUp": 0.401,
    "base": 0.4111,
    "pUp": 0.401
   },
   "30": {
    "n": 392,
    "up": 135,
    "raw": 0.3444,
    "uncalibratedPUp": 0.3491,
    "base": 0.4111,
    "pUp": 0.3625
   },
   "60": {
    "n": 465,
    "up": 207,
    "raw": 0.4452,
    "uncalibratedPUp": 0.4431,
    "base": 0.4111,
    "pUp": 0.4431
   },
   "20": {
    "n": 68,
    "up": 24,
    "raw": 0.3529,
    "uncalibratedPUp": 0.3708,
    "base": 0.4111,
    "pUp": 0.3625
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3524,
    "base": 0.4111,
    "pUp": 0.4582
   },
   "10": {
    "n": 3,
    "up": 3,
    "raw": 1.0,
    "uncalibratedPUp": 0.4647,
    "base": 0.4111,
    "pUp": 0.3625
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4111,
    "base": 0.4111,
    "pUp": 0.3625
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4111,
    "base": 0.4111,
    "pUp": 0.4582
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 4558,
   "errorCorr": -0.149
  },
  "taro:nova": {
   "n": 6546,
   "errorCorr": 0.226
  },
  "taro:flow": {
   "n": 1350,
   "errorCorr": 0.231
  },
  "diana:nova": {
   "n": 3827,
   "errorCorr": -0.117
  },
  "diana:flow": {
   "n": 741,
   "errorCorr": 0.127
  },
  "nova:flow": {
   "n": 1156,
   "errorCorr": -0.015
  }
 },
 "redundancyFactor": {
  "taro": 0.9906,
  "diana": 1,
  "nova": 0.9955,
  "flow": 0.9951
 },
 "regimes": {
  "up_high": {
   "n": 995,
   "blend": 0.554,
   "weights": {
    "taro": 0.2661,
    "diana": 0.1092,
    "nova": 0.2712,
    "flow": 0.3535
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
    "taro": 0.2591,
    "diana": 0.117,
    "nova": 0.3134,
    "flow": 0.3106
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
    "taro": 0.2749,
    "diana": 0.1108,
    "nova": 0.2843,
    "flow": 0.33
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
   "n": 11407,
   "blend": 0.6,
   "weights": {
    "taro": 0.2094,
    "diana": 0.1406,
    "nova": 0.3214,
    "flow": 0.3285
   },
   "acc": {
    "taro": {
     "n": 4244,
     "adjustedAcc": 40.3
    },
    "diana": {
     "n": 2470,
     "adjustedAcc": 61.9
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
  "down_low": {
   "n": 2255,
   "blend": 0.6,
   "weights": {
    "taro": 0.2863,
    "diana": 0.1302,
    "nova": 0.2635,
    "flow": 0.32
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
  "median5": 1.14,
  "medianAbs1": 1.09,
  "advanceRatio5": 59.9,
  "medianRet1": 0.13,
  "advanceRatio1": 52.0
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
   "hit": 9162,
   "miss": 8511,
   "mid": 699,
   "accuracy": 51.8
  },
  "guarded": {
   "hit": 9157,
   "miss": 8531,
   "mid": 684,
   "accuracy": 51.8
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 4309,
  "errors": 1912,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1833
   },
   {
    "label": "분석가 의견충돌",
    "count": 1134
   },
   {
    "label": "고변동성 국면",
    "count": 566
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 70
   }
  ],
  "analystErrors": {
   "taro": 1355,
   "diana": 0,
   "nova": 61,
   "flow": 216
  },
  "regimeErrors": {
   "up_low": 1024,
   "down_high": 348,
   "unknown": 322,
   "up_high": 218
  }
 },
 "shadow": {
  "n": 4309,
  "baselineActionN": 805,
  "baselineActionPrecision": 47.3,
  "candidateActionN": 2,
  "candidateActionPrecision": 100.0,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 4307,
   "SELL": 2
  },
  "testDays": 8,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 54.3,
  "brier": 0.2276,
  "rawBrier": 0.2764
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
     "n": 279,
     "hit": 113,
     "raw": 0.405,
     "uncalibratedAcc": 0.405,
     "base": 0.405,
     "calibratedAcc": 0.405
    },
    "60": {
     "n": 192,
     "hit": 72,
     "raw": 0.375,
     "uncalibratedAcc": 0.3778,
     "base": 0.405,
     "calibratedAcc": 0.3778
    },
    "70": {
     "n": 120,
     "hit": 53,
     "raw": 0.4417,
     "uncalibratedAcc": 0.4364,
     "base": 0.405,
     "calibratedAcc": 0.4364
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.4625,
     "base": 0.405,
     "calibratedAcc": 0.4625
    }
   },
   "SELL": {
    "40": {
     "n": 1849,
     "hit": 1177,
     "raw": 0.6366,
     "uncalibratedAcc": 0.6366,
     "base": 0.6409,
     "calibratedAcc": 0.6366
    },
    "45": {
     "n": 912,
     "hit": 496,
     "raw": 0.5439,
     "uncalibratedAcc": 0.5459,
     "base": 0.6409,
     "calibratedAcc": 0.5459
    },
    "35": {
     "n": 1149,
     "hit": 832,
     "raw": 0.7241,
     "uncalibratedAcc": 0.7227,
     "base": 0.6409,
     "calibratedAcc": 0.6991
    },
    "30": {
     "n": 407,
     "hit": 261,
     "raw": 0.6413,
     "uncalibratedAcc": 0.6413,
     "base": 0.6409,
     "calibratedAcc": 0.6991
    },
    "25": {
     "n": 23,
     "hit": 16,
     "raw": 0.6957,
     "uncalibratedAcc": 0.6702,
     "base": 0.6409,
     "calibratedAcc": 0.6991
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6281,
     "base": 0.6409,
     "calibratedAcc": 0.6991
    }
   }
  },
  "evaluation": {
   "n": 805,
   "buyN": 410,
   "sellN": 395,
   "testDays": 8,
   "testRegimes": 3,
   "candidate": {
    "n": 803,
    "tierSpreadPp": 31.5,
    "corr": 0.2652
   },
   "baseline": {
    "n": 805,
    "tierSpreadPp": 6.0,
    "corr": 0.0706
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
