// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-04 01:19",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 692,
    "up": 210,
    "raw": 0.3035,
    "uncalibratedPUp": 0.303,
    "base": 0.2932,
    "pUp": 0.3063
   },
   "20": {
    "n": 448,
    "up": 141,
    "raw": 0.3147,
    "uncalibratedPUp": 0.3134,
    "base": 0.2932,
    "pUp": 0.2819
   },
   "40": {
    "n": 834,
    "up": 270,
    "raw": 0.3237,
    "uncalibratedPUp": 0.3227,
    "base": 0.2932,
    "pUp": 0.3063
   },
   "30": {
    "n": 986,
    "up": 256,
    "raw": 0.2596,
    "uncalibratedPUp": 0.2606,
    "base": 0.2932,
    "pUp": 0.2819
   },
   "70": {
    "n": 231,
    "up": 68,
    "raw": 0.2944,
    "uncalibratedPUp": 0.2942,
    "base": 0.2932,
    "pUp": 0.3063
   },
   "80": {
    "n": 201,
    "up": 52,
    "raw": 0.2587,
    "uncalibratedPUp": 0.2632,
    "base": 0.2932,
    "pUp": 0.3063
   },
   "60": {
    "n": 478,
    "up": 154,
    "raw": 0.3222,
    "uncalibratedPUp": 0.3205,
    "base": 0.2932,
    "pUp": 0.3063
   },
   "10": {
    "n": 1572,
    "up": 449,
    "raw": 0.2856,
    "uncalibratedPUp": 0.2858,
    "base": 0.2932,
    "pUp": 0.2819
   },
   "90": {
    "n": 90,
    "up": 22,
    "raw": 0.2444,
    "uncalibratedPUp": 0.2566,
    "base": 0.2932,
    "pUp": 0.3063
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.2819
   }
  },
  "diana": {
   "40": {
    "n": 228,
    "up": 21,
    "raw": 0.0921,
    "uncalibratedPUp": 0.1046,
    "base": 0.1997,
    "pUp": 0.1184
   },
   "70": {
    "n": 240,
    "up": 55,
    "raw": 0.2292,
    "uncalibratedPUp": 0.2259,
    "base": 0.1997,
    "pUp": 0.2259
   },
   "50": {
    "n": 300,
    "up": 47,
    "raw": 0.1567,
    "uncalibratedPUp": 0.1606,
    "base": 0.1997,
    "pUp": 0.1606
   },
   "80": {
    "n": 270,
    "up": 101,
    "raw": 0.3741,
    "uncalibratedPUp": 0.3566,
    "base": 0.1997,
    "pUp": 0.3256
   },
   "30": {
    "n": 162,
    "up": 13,
    "raw": 0.0802,
    "uncalibratedPUp": 0.0989,
    "base": 0.1997,
    "pUp": 0.1184
   },
   "90": {
    "n": 60,
    "up": 14,
    "raw": 0.2333,
    "uncalibratedPUp": 0.2221,
    "base": 0.1997,
    "pUp": 0.3256
   },
   "60": {
    "n": 237,
    "up": 48,
    "raw": 0.2025,
    "uncalibratedPUp": 0.2022,
    "base": 0.1997,
    "pUp": 0.2022
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.1997,
    "base": 0.1997,
    "pUp": 0.1184
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.1997,
    "base": 0.1997,
    "pUp": 0.1184
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.1997,
    "base": 0.1997,
    "pUp": 0.1184
   }
  },
  "nova": {
   "50": {
    "n": 1155,
    "up": 316,
    "raw": 0.2736,
    "uncalibratedPUp": 0.2741,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "40": {
    "n": 2204,
    "up": 644,
    "raw": 0.2922,
    "uncalibratedPUp": 0.2922,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "30": {
    "n": 1603,
    "up": 473,
    "raw": 0.2951,
    "uncalibratedPUp": 0.295,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "70": {
    "n": 48,
    "up": 4,
    "raw": 0.0833,
    "uncalibratedPUp": 0.1641,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "60": {
    "n": 313,
    "up": 76,
    "raw": 0.2428,
    "uncalibratedPUp": 0.2472,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "20": {
    "n": 205,
    "up": 109,
    "raw": 0.5317,
    "uncalibratedPUp": 0.5013,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2837,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2665,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.2932
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.2932
   }
  },
  "flow": {
   "50": {
    "n": 3409,
    "up": 1000,
    "raw": 0.2933,
    "uncalibratedPUp": 0.2933,
    "base": 0.2932,
    "pUp": 0.2933
   },
   "70": {
    "n": 66,
    "up": 33,
    "raw": 0.5,
    "uncalibratedPUp": 0.4354,
    "base": 0.2932,
    "pUp": 0.3807
   },
   "40": {
    "n": 1570,
    "up": 422,
    "raw": 0.2688,
    "uncalibratedPUp": 0.2692,
    "base": 0.2932,
    "pUp": 0.2753
   },
   "30": {
    "n": 204,
    "up": 65,
    "raw": 0.3186,
    "uncalibratedPUp": 0.3154,
    "base": 0.2932,
    "pUp": 0.2753
   },
   "60": {
    "n": 249,
    "up": 94,
    "raw": 0.3775,
    "uncalibratedPUp": 0.3684,
    "base": 0.2932,
    "pUp": 0.3684
   },
   "20": {
    "n": 34,
    "up": 8,
    "raw": 0.2353,
    "uncalibratedPUp": 0.2624,
    "base": 0.2932,
    "pUp": 0.2753
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.2753
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.2753
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.3807
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2932,
    "base": 0.2932,
    "pUp": 0.3807
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 738,
   "errorCorr": -0.103
  },
  "taro:nova": {
   "n": 2489,
   "errorCorr": 0.892
  },
  "taro:flow": {
   "n": 645,
   "errorCorr": 0.164
  },
  "diana:nova": {
   "n": 421,
   "errorCorr": -0.0
  },
  "diana:flow": {
   "n": 114,
   "errorCorr": 0.179
  },
  "nova:flow": {
   "n": 444,
   "errorCorr": 0.103
  }
 },
 "redundancyFactor": {
  "taro": 0.9546,
  "diana": 0.9983,
  "nova": 0.9555,
  "flow": 0.9974
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.3704,
    "diana": 0.0551,
    "nova": 0.2925,
    "flow": 0.282
   },
   "acc": {
    "taro": {
     "n": 750,
     "adjustedAcc": 66.4
    },
    "diana": {
     "n": 642,
     "adjustedAcc": 37.9
    },
    "nova": {
     "n": 402,
     "adjustedAcc": 61.5
    },
    "flow": {
     "n": 128,
     "adjustedAcc": 59.6
    }
   }
  },
  "side_high": {
   "n": 1555,
   "blend": 0.6,
   "weights": {
    "taro": 0.3613,
    "diana": 0.0584,
    "nova": 0.2968,
    "flow": 0.2836
   },
   "acc": {
    "taro": {
     "n": 734,
     "adjustedAcc": 62.7
    },
    "diana": {
     "n": 302,
     "adjustedAcc": 42.0
    },
    "nova": {
     "n": 394,
     "adjustedAcc": 61.0
    },
    "flow": {
     "n": 125,
     "adjustedAcc": 58.4
    }
   }
  },
  "down_low": {
   "n": 2966,
   "blend": 0.6,
   "weights": {
    "taro": 0.3609,
    "diana": 0.0644,
    "nova": 0.3096,
    "flow": 0.2651
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 1203,
     "adjustedAcc": 63.3
    },
    "flow": {
     "n": 267,
     "adjustedAcc": 51.4
    }
   }
  },
  "down_high": {
   "n": 2139,
   "blend": 0.6,
   "weights": {
    "taro": 0.3622,
    "diana": 0.0666,
    "nova": 0.299,
    "flow": 0.2721
   },
   "acc": {
    "taro": {
     "n": 1142,
     "adjustedAcc": 58.8
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 787,
     "adjustedAcc": 57.5
    },
    "flow": {
     "n": 210,
     "adjustedAcc": 50.7
    }
   }
  }
 },
 "currentRegime": {
  "key": "down_low",
  "trend": "down",
  "vol": "low",
  "median5": -4.22,
  "medianAbs1": 1.88
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 1515,
  "errors": 510,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 462
   },
   {
    "label": "분석가 의견충돌",
    "count": 379
   },
   {
    "label": "고변동성 국면",
    "count": 340
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 57
   }
  ],
  "analystErrors": {
   "taro": 215,
   "diana": 0,
   "nova": 189,
   "flow": 61
  },
  "regimeErrors": {
   "side_high": 340,
   "up_low": 170
  }
 },
 "shadow": {
  "n": 1515,
  "baselineActionN": 626,
  "baselineActionPrecision": 83.4,
  "candidateActionN": 1368,
  "candidateActionPrecision": 85.7,
  "candidateCoverage": 90.3,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 4,
   "SELL": 1511
  },
  "testDays": 3,
  "testRegimes": 2,
  "candidateAllCallAccuracy": 77.4,
  "brier": 0.1544,
  "rawBrier": 0.2241
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
