// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-12 09:12",
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
    "n": 772,
    "up": 292,
    "raw": 0.3782,
    "uncalibratedPUp": 0.3809,
    "base": 0.4496,
    "pUp": 0.4006
   },
   "70": {
    "n": 812,
    "up": 383,
    "raw": 0.4717,
    "uncalibratedPUp": 0.4709,
    "base": 0.4496,
    "pUp": 0.4709
   },
   "50": {
    "n": 997,
    "up": 394,
    "raw": 0.3952,
    "uncalibratedPUp": 0.3968,
    "base": 0.4496,
    "pUp": 0.4006
   },
   "80": {
    "n": 895,
    "up": 501,
    "raw": 0.5598,
    "uncalibratedPUp": 0.5562,
    "base": 0.4496,
    "pUp": 0.5247
   },
   "30": {
    "n": 542,
    "up": 231,
    "raw": 0.4262,
    "uncalibratedPUp": 0.4274,
    "base": 0.4496,
    "pUp": 0.4006
   },
   "90": {
    "n": 200,
    "up": 78,
    "raw": 0.39,
    "uncalibratedPUp": 0.3978,
    "base": 0.4496,
    "pUp": 0.5247
   },
   "60": {
    "n": 815,
    "up": 384,
    "raw": 0.4712,
    "uncalibratedPUp": 0.4704,
    "base": 0.4496,
    "pUp": 0.4704
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4496,
    "base": 0.4496,
    "pUp": 0.4006
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4496,
    "base": 0.4496,
    "pUp": 0.4006
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4496,
    "base": 0.4496,
    "pUp": 0.4006
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
   "n": 2323,
   "errorCorr": -0.114
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
   "n": 1638,
   "errorCorr": -0.128
  },
  "diana:flow": {
   "n": 404,
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
    "taro": 0.2992,
    "diana": 0.0874,
    "nova": 0.282,
    "flow": 0.3314
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
    "taro": 0.2883,
    "diana": 0.0864,
    "nova": 0.3092,
    "flow": 0.3161
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
    "taro": 0.3018,
    "diana": 0.0835,
    "nova": 0.319,
    "flow": 0.2957
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
   "n": 8075,
   "blend": 0.6,
   "weights": {
    "taro": 0.2853,
    "diana": 0.107,
    "nova": 0.2974,
    "flow": 0.3103
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 2116,
     "adjustedAcc": 56.2
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
    "taro": 0.2901,
    "diana": 0.0935,
    "nova": 0.3137,
    "flow": 0.3028
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
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 3.84,
  "medianAbs1": 1.05
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 3000,
  "errors": 2181,
  "patterns": [
   {
    "label": "고변동성 국면",
    "count": 1787
   },
   {
    "label": "분석가 의견충돌",
    "count": 1766
   },
   {
    "label": "경계점수 판단",
    "count": 1602
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 180
   }
  ],
  "analystErrors": {
   "taro": 1394,
   "diana": 0,
   "nova": 1074,
   "flow": 130
  },
  "regimeErrors": {
   "down_high": 1161,
   "up_high": 626,
   "down_low": 394
  }
 },
 "shadow": {
  "n": 3000,
  "baselineActionN": 1283,
  "baselineActionPrecision": 14.7,
  "candidateActionN": 2738,
  "candidateActionPrecision": 7.4,
  "candidateCoverage": 91.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 58,
   "SELL": 2942
  },
  "testDays": 6,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 7.8,
  "brier": 0.3787,
  "rawBrier": 0.2693
 },
 "prospective": {
  "n": 1000,
  "baselineActionN": 515,
  "baselineActionPrecision": 16.3,
  "candidateActionN": 888,
  "candidateActionPrecision": 11.5,
  "candidateCoverage": 88.8,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 7,
   "SELL": 993
  },
  "testDays": 2,
  "testRegimes": 1,
  "brier": 0.4141,
  "rawBrier": 0.298
 },
 "promotion": {
  "qualified": false,
  "status": "shadow",
  "reasons": [
   "실제 그림자 행동 정밀도 개선폭 1.5%p 미만",
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
 }
};
