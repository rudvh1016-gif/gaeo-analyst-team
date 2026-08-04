// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-04 09:14",
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
    "n": 304,
    "up": 35,
    "raw": 0.1151,
    "uncalibratedPUp": 0.1235,
    "base": 0.2079,
    "pUp": 0.1361
   },
   "70": {
    "n": 320,
    "up": 72,
    "raw": 0.225,
    "uncalibratedPUp": 0.2235,
    "base": 0.2079,
    "pUp": 0.2235
   },
   "50": {
    "n": 400,
    "up": 68,
    "raw": 0.17,
    "uncalibratedPUp": 0.1726,
    "base": 0.2079,
    "pUp": 0.1726
   },
   "80": {
    "n": 360,
    "up": 128,
    "raw": 0.3556,
    "uncalibratedPUp": 0.3442,
    "base": 0.2079,
    "pUp": 0.3189
   },
   "30": {
    "n": 216,
    "up": 25,
    "raw": 0.1157,
    "uncalibratedPUp": 0.127,
    "base": 0.2079,
    "pUp": 0.1361
   },
   "90": {
    "n": 80,
    "up": 19,
    "raw": 0.2375,
    "uncalibratedPUp": 0.2294,
    "base": 0.2079,
    "pUp": 0.3189
   },
   "60": {
    "n": 316,
    "up": 68,
    "raw": 0.2152,
    "uncalibratedPUp": 0.2146,
    "base": 0.2079,
    "pUp": 0.2146
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2079,
    "base": 0.2079,
    "pUp": 0.1361
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2079,
    "base": 0.2079,
    "pUp": 0.1361
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2079,
    "base": 0.2079,
    "pUp": 0.1361
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
   "n": 959,
   "errorCorr": -0.07
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
   "n": 577,
   "errorCorr": -0.03
  },
  "diana:flow": {
   "n": 152,
   "errorCorr": 0.175
  },
  "nova:flow": {
   "n": 444,
   "errorCorr": 0.103
  }
 },
 "redundancyFactor": {
  "taro": 0.9546,
  "diana": 0.9985,
  "nova": 0.9555,
  "flow": 0.9976
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.3534,
    "diana": 0.0551,
    "nova": 0.3103,
    "flow": 0.2811
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
    "taro": 0.3444,
    "diana": 0.0584,
    "nova": 0.3147,
    "flow": 0.2825
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
   "n": 3262,
   "blend": 0.6,
   "weights": {
    "taro": 0.3463,
    "diana": 0.0575,
    "nova": 0.3305,
    "flow": 0.2657
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 296,
     "adjustedAcc": 38.8
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
    "taro": 0.3453,
    "diana": 0.0666,
    "nova": 0.317,
    "flow": 0.2711
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
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 4.24,
  "medianAbs1": 2.05
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2015,
  "errors": 787,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 702
   },
   {
    "label": "고변동성 국면",
    "count": 617
   },
   {
    "label": "분석가 의견충돌",
    "count": 598
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 71
   }
  ],
  "analystErrors": {
   "taro": 443,
   "diana": 0,
   "nova": 225,
   "flow": 95
  },
  "regimeErrors": {
   "side_high": 340,
   "down_high": 277,
   "up_low": 170
  }
 },
 "shadow": {
  "n": 2015,
  "baselineActionN": 767,
  "baselineActionPrecision": 70.7,
  "candidateActionN": 1807,
  "candidateActionPrecision": 69.4,
  "candidateCoverage": 89.7,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 4,
   "SELL": 2011
  },
  "testDays": 4,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 62.2,
  "brier": 0.2191,
  "rawBrier": 0.235
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
