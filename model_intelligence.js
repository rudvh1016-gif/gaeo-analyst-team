// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-10 10:41",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 893,
    "up": 312,
    "raw": 0.3494,
    "uncalibratedPUp": 0.3493,
    "base": 0.3476,
    "pUp": 0.3644
   },
   "20": {
    "n": 645,
    "up": 241,
    "raw": 0.3736,
    "uncalibratedPUp": 0.3725,
    "base": 0.3476,
    "pUp": 0.3397
   },
   "40": {
    "n": 1198,
    "up": 493,
    "raw": 0.4115,
    "uncalibratedPUp": 0.41,
    "base": 0.3476,
    "pUp": 0.3644
   },
   "30": {
    "n": 1420,
    "up": 460,
    "raw": 0.3239,
    "uncalibratedPUp": 0.3244,
    "base": 0.3476,
    "pUp": 0.3397
   },
   "70": {
    "n": 284,
    "up": 98,
    "raw": 0.3451,
    "uncalibratedPUp": 0.3453,
    "base": 0.3476,
    "pUp": 0.3644
   },
   "80": {
    "n": 263,
    "up": 75,
    "raw": 0.2852,
    "uncalibratedPUp": 0.2916,
    "base": 0.3476,
    "pUp": 0.3644
   },
   "60": {
    "n": 642,
    "up": 232,
    "raw": 0.3614,
    "uncalibratedPUp": 0.3608,
    "base": 0.3476,
    "pUp": 0.3644
   },
   "10": {
    "n": 2077,
    "up": 679,
    "raw": 0.3269,
    "uncalibratedPUp": 0.3272,
    "base": 0.3476,
    "pUp": 0.3275
   },
   "90": {
    "n": 106,
    "up": 27,
    "raw": 0.2547,
    "uncalibratedPUp": 0.2752,
    "base": 0.3476,
    "pUp": 0.3644
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.3275
   }
  },
  "diana": {
   "40": {
    "n": 621,
    "up": 180,
    "raw": 0.2899,
    "uncalibratedPUp": 0.2938,
    "base": 0.3752,
    "pUp": 0.3222
   },
   "70": {
    "n": 652,
    "up": 255,
    "raw": 0.3911,
    "uncalibratedPUp": 0.3904,
    "base": 0.3752,
    "pUp": 0.3934
   },
   "50": {
    "n": 796,
    "up": 258,
    "raw": 0.3241,
    "uncalibratedPUp": 0.326,
    "base": 0.3752,
    "pUp": 0.326
   },
   "80": {
    "n": 715,
    "up": 358,
    "raw": 0.5007,
    "uncalibratedPUp": 0.4956,
    "base": 0.3752,
    "pUp": 0.4604
   },
   "30": {
    "n": 434,
    "up": 152,
    "raw": 0.3502,
    "uncalibratedPUp": 0.3518,
    "base": 0.3752,
    "pUp": 0.3222
   },
   "90": {
    "n": 160,
    "up": 50,
    "raw": 0.3125,
    "uncalibratedPUp": 0.3224,
    "base": 0.3752,
    "pUp": 0.4604
   },
   "60": {
    "n": 657,
    "up": 261,
    "raw": 0.3973,
    "uncalibratedPUp": 0.3963,
    "base": 0.3752,
    "pUp": 0.3934
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3752,
    "base": 0.3752,
    "pUp": 0.3222
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3752,
    "base": 0.3752,
    "pUp": 0.3222
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3752,
    "base": 0.3752,
    "pUp": 0.3222
   }
  },
  "nova": {
   "50": {
    "n": 1307,
    "up": 388,
    "raw": 0.2969,
    "uncalibratedPUp": 0.298,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "40": {
    "n": 2967,
    "up": 1013,
    "raw": 0.3414,
    "uncalibratedPUp": 0.3415,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "30": {
    "n": 2427,
    "up": 902,
    "raw": 0.3717,
    "uncalibratedPUp": 0.3714,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "70": {
    "n": 51,
    "up": 7,
    "raw": 0.1373,
    "uncalibratedPUp": 0.2152,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "60": {
    "n": 340,
    "up": 88,
    "raw": 0.2588,
    "uncalibratedPUp": 0.266,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "20": {
    "n": 432,
    "up": 219,
    "raw": 0.5069,
    "uncalibratedPUp": 0.4966,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3364,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.316,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.3476
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.3476
   }
  },
  "flow": {
   "50": {
    "n": 4612,
    "up": 1658,
    "raw": 0.3595,
    "uncalibratedPUp": 0.3594,
    "base": 0.3476,
    "pUp": 0.3594
   },
   "70": {
    "n": 87,
    "up": 44,
    "raw": 0.5057,
    "uncalibratedPUp": 0.4652,
    "base": 0.3476,
    "pUp": 0.4254
   },
   "40": {
    "n": 2194,
    "up": 703,
    "raw": 0.3204,
    "uncalibratedPUp": 0.3208,
    "base": 0.3476,
    "pUp": 0.3208
   },
   "30": {
    "n": 278,
    "up": 81,
    "raw": 0.2914,
    "uncalibratedPUp": 0.2968,
    "base": 0.3476,
    "pUp": 0.3025
   },
   "60": {
    "n": 313,
    "up": 120,
    "raw": 0.3834,
    "uncalibratedPUp": 0.3803,
    "base": 0.3476,
    "pUp": 0.3803
   },
   "20": {
    "n": 44,
    "up": 11,
    "raw": 0.25,
    "uncalibratedPUp": 0.2896,
    "base": 0.3476,
    "pUp": 0.3025
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.3025
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.3025
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.4254
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3476,
    "base": 0.3476,
    "pUp": 0.4254
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 1849,
   "errorCorr": -0.111
  },
  "taro:nova": {
   "n": 3727,
   "errorCorr": 0.877
  },
  "taro:flow": {
   "n": 853,
   "errorCorr": 0.187
  },
  "diana:nova": {
   "n": 1228,
   "errorCorr": -0.123
  },
  "diana:flow": {
   "n": 333,
   "errorCorr": 0.09
  },
  "nova:flow": {
   "n": 632,
   "errorCorr": 0.151
  }
 },
 "redundancyFactor": {
  "taro": 0.9541,
  "diana": 1,
  "nova": 0.9563,
  "flow": 0.9977
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.2928,
    "diana": 0.0747,
    "nova": 0.3172,
    "flow": 0.3153
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
   "n": 2273,
   "blend": 0.6,
   "weights": {
    "taro": 0.2808,
    "diana": 0.0737,
    "nova": 0.3462,
    "flow": 0.2993
   },
   "acc": {
    "taro": {
     "n": 1094,
     "adjustedAcc": 61.3
    },
    "diana": {
     "n": 302,
     "adjustedAcc": 42.0
    },
    "nova": {
     "n": 684,
     "adjustedAcc": 62.1
    },
    "flow": {
     "n": 193,
     "adjustedAcc": 58.1
    }
   }
  },
  "up_low": {
   "n": 926,
   "blend": 0.537,
   "weights": {
    "taro": 0.2932,
    "diana": 0.0711,
    "nova": 0.3562,
    "flow": 0.2795
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
   "n": 7423,
   "blend": 0.6,
   "weights": {
    "taro": 0.2808,
    "diana": 0.0859,
    "nova": 0.3365,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 1464,
     "adjustedAcc": 50.4
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
   "n": 826,
   "blend": 0.508,
   "weights": {
    "taro": 0.2825,
    "diana": 0.0796,
    "nova": 0.3511,
    "flow": 0.2867
   },
   "acc": {
    "taro": {
     "n": 348,
     "adjustedAcc": 65.0
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 426,
     "adjustedAcc": 66.7
    },
    "flow": {
     "n": 52,
     "adjustedAcc": 56.2
    }
   }
  }
 },
 "currentRegime": {
  "key": "up_high",
  "trend": "up",
  "vol": "high",
  "median5": 9.62,
  "medianAbs1": 2.42
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2000,
  "errors": 1532,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1256
   },
   {
    "label": "분석가 의견충돌",
    "count": 1204
   },
   {
    "label": "고변동성 국면",
    "count": 1161
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 129
   }
  ],
  "analystErrors": {
   "taro": 1183,
   "diana": 0,
   "nova": 487,
   "flow": 108
  },
  "regimeErrors": {
   "down_high": 1161,
   "down_low": 371
  }
 },
 "shadow": {
  "n": 2000,
  "baselineActionN": 766,
  "baselineActionPrecision": 13.8,
  "candidateActionN": 1881,
  "candidateActionPrecision": 5.8,
  "candidateCoverage": 94.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 9,
   "SELL": 1991
  },
  "testDays": 4,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 5.7,
  "brier": 0.3943,
  "rawBrier": 0.2675
 },
 "prospective": {
  "n": 0,
  "baselineActionN": 0,
  "baselineActionPrecision": null,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 0
  },
  "testDays": 0,
  "testRegimes": 0,
  "brier": null,
  "rawBrier": null
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
   "실제 그림자 누적 표본 500건 미만",
   "실제 그림자 BUY·SELL 표본 100건 미만",
   "실제 그림자 행동 정밀도 개선폭 1.5%p 미만",
   "실제 그림자 확률오차(Brier) 개선폭 0.005 미만",
   "실제 그림자 BUY·SELL 커버리지 15% 미만",
   "실제 그림자 검증일 40거래일 미만",
   "실제 그림자 시장국면 3개 미만",
   "BUY·SELL 양방향 검증 표본 각각 50건 미만"
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
 }
};
