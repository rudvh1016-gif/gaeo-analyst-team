// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-13 14:49",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1053,
    "up": 339,
    "raw": 0.3219,
    "uncalibratedPUp": 0.322,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "20": {
    "n": 728,
    "up": 252,
    "raw": 0.3462,
    "uncalibratedPUp": 0.3452,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "40": {
    "n": 1407,
    "up": 520,
    "raw": 0.3696,
    "uncalibratedPUp": 0.3686,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "30": {
    "n": 1655,
    "up": 477,
    "raw": 0.2882,
    "uncalibratedPUp": 0.2888,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "70": {
    "n": 342,
    "up": 114,
    "raw": 0.3333,
    "uncalibratedPUp": 0.3325,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "80": {
    "n": 300,
    "up": 84,
    "raw": 0.28,
    "uncalibratedPUp": 0.2839,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "60": {
    "n": 736,
    "up": 259,
    "raw": 0.3519,
    "uncalibratedPUp": 0.3508,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "10": {
    "n": 2224,
    "up": 689,
    "raw": 0.3098,
    "uncalibratedPUp": 0.31,
    "base": 0.3227,
    "pUp": 0.3082
   },
   "90": {
    "n": 111,
    "up": 27,
    "raw": 0.2432,
    "uncalibratedPUp": 0.2601,
    "base": 0.3227,
    "pUp": 0.3393
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3082
   }
  },
  "diana": {
   "40": {
    "n": 848,
    "up": 350,
    "raw": 0.4127,
    "uncalibratedPUp": 0.4147,
    "base": 0.4714,
    "pUp": 0.4255
   },
   "70": {
    "n": 892,
    "up": 431,
    "raw": 0.4832,
    "uncalibratedPUp": 0.4828,
    "base": 0.4714,
    "pUp": 0.4888
   },
   "50": {
    "n": 1097,
    "up": 460,
    "raw": 0.4193,
    "uncalibratedPUp": 0.4207,
    "base": 0.4714,
    "pUp": 0.4255
   },
   "80": {
    "n": 985,
    "up": 569,
    "raw": 0.5777,
    "uncalibratedPUp": 0.5745,
    "base": 0.4714,
    "pUp": 0.5449
   },
   "30": {
    "n": 596,
    "up": 263,
    "raw": 0.4413,
    "uncalibratedPUp": 0.4427,
    "base": 0.4714,
    "pUp": 0.4255
   },
   "90": {
    "n": 220,
    "up": 92,
    "raw": 0.4182,
    "uncalibratedPUp": 0.4246,
    "base": 0.4714,
    "pUp": 0.5449
   },
   "60": {
    "n": 894,
    "up": 443,
    "raw": 0.4955,
    "uncalibratedPUp": 0.4947,
    "base": 0.4714,
    "pUp": 0.4888
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4714,
    "base": 0.4714,
    "pUp": 0.4255
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4714,
    "base": 0.4714,
    "pUp": 0.4255
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4714,
    "base": 0.4714,
    "pUp": 0.4255
   }
  },
  "nova": {
   "50": {
    "n": 1350,
    "up": 397,
    "raw": 0.2941,
    "uncalibratedPUp": 0.2947,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "40": {
    "n": 3201,
    "up": 1063,
    "raw": 0.3321,
    "uncalibratedPUp": 0.332,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "30": {
    "n": 2669,
    "up": 950,
    "raw": 0.3559,
    "uncalibratedPUp": 0.3556,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.201,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "60": {
    "n": 639,
    "up": 119,
    "raw": 0.1862,
    "uncalibratedPUp": 0.1923,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "20": {
    "n": 639,
    "up": 225,
    "raw": 0.3521,
    "uncalibratedPUp": 0.3508,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3123,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2847,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3227
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3227
   }
  },
  "flow": {
   "50": {
    "n": 5300,
    "up": 1778,
    "raw": 0.3355,
    "uncalibratedPUp": 0.3354,
    "base": 0.3227,
    "pUp": 0.3354
   },
   "70": {
    "n": 101,
    "up": 44,
    "raw": 0.4356,
    "uncalibratedPUp": 0.4098,
    "base": 0.3227,
    "pUp": 0.3765
   },
   "40": {
    "n": 2449,
    "up": 724,
    "raw": 0.2956,
    "uncalibratedPUp": 0.296,
    "base": 0.3227,
    "pUp": 0.296
   },
   "30": {
    "n": 308,
    "up": 81,
    "raw": 0.263,
    "uncalibratedPUp": 0.2683,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "60": {
    "n": 347,
    "up": 122,
    "raw": 0.3516,
    "uncalibratedPUp": 0.3493,
    "base": 0.3227,
    "pUp": 0.3493
   },
   "20": {
    "n": 48,
    "up": 12,
    "raw": 0.25,
    "uncalibratedPUp": 0.278,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2934,
    "base": 0.3227,
    "pUp": 0.3765
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.2767
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3227,
    "base": 0.3227,
    "pUp": 0.3765
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 2523,
   "errorCorr": -0.138
  },
  "taro:nova": {
   "n": 4352,
   "errorCorr": 0.693
  },
  "taro:flow": {
   "n": 961,
   "errorCorr": 0.199
  },
  "diana:nova": {
   "n": 1727,
   "errorCorr": -0.141
  },
  "diana:flow": {
   "n": 442,
   "errorCorr": 0.106
  },
  "nova:flow": {
   "n": 745,
   "errorCorr": 0.095
  }
 },
 "redundancyFactor": {
  "taro": 0.9644,
  "diana": 1,
  "nova": 0.9674,
  "flow": 0.997
 },
 "regimes": {
  "up_high": {
   "n": 996,
   "blend": 0.555,
   "weights": {
    "taro": 0.3016,
    "diana": 0.0898,
    "nova": 0.28,
    "flow": 0.3285
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
   "n": 3447,
   "blend": 0.6,
   "weights": {
    "taro": 0.2898,
    "diana": 0.0955,
    "nova": 0.3187,
    "flow": 0.2961
   },
   "acc": {
    "taro": {
     "n": 1464,
     "adjustedAcc": 63.5
    },
    "diana": {
     "n": 593,
     "adjustedAcc": 51.1
    },
    "nova": {
     "n": 1125,
     "adjustedAcc": 67.5
    },
    "flow": {
     "n": 265,
     "adjustedAcc": 55.7
    }
   }
  },
  "up_low": {
   "n": 926,
   "blend": 0.537,
   "weights": {
    "taro": 0.3043,
    "diana": 0.0859,
    "nova": 0.3167,
    "flow": 0.2931
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
   "n": 8069,
   "blend": 0.6,
   "weights": {
    "taro": 0.2876,
    "diana": 0.1096,
    "nova": 0.2953,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 3043,
     "adjustedAcc": 55.7
    },
    "diana": {
     "n": 2110,
     "adjustedAcc": 55.9
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
   "n": 1618,
   "blend": 0.6,
   "weights": {
    "taro": 0.3289,
    "diana": 0.0959,
    "nova": 0.2742,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 740,
     "adjustedAcc": 71.9
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
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
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 2.97,
  "medianAbs1": 1.44
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2500,
  "errors": 1627,
  "patterns": [
   {
    "label": "고변동성 국면",
    "count": 1233
   },
   {
    "label": "분석가 의견충돌",
    "count": 1210
   },
   {
    "label": "경계점수 판단",
    "count": 1062
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 138
   }
  ],
  "analystErrors": {
   "taro": 794,
   "diana": 0,
   "nova": 1032,
   "flow": 106
  },
  "regimeErrors": {
   "up_high": 886,
   "down_low": 394,
   "down_high": 347
  }
 },
 "shadow": {
  "n": 2500,
  "baselineActionN": 1095,
  "baselineActionPrecision": 15.2,
  "candidateActionN": 2276,
  "candidateActionPrecision": 12.1,
  "candidateCoverage": 91.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 0,
   "SELL": 2500
  },
  "testDays": 5,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 11.0,
  "brier": 0.3833,
  "rawBrier": 0.2686
 },
 "prospective": {
  "n": 1500,
  "baselineActionN": 692,
  "baselineActionPrecision": 14.7,
  "candidateActionN": 1311,
  "candidateActionPrecision": 15.9,
  "candidateCoverage": 87.4,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 20,
   "SELL": 1480
  },
  "testDays": 3,
  "testRegimes": 1,
  "brier": 0.3891,
  "rawBrier": 0.2945
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
