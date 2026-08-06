// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-06 11:39",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 795,
    "up": 266,
    "raw": 0.3346,
    "uncalibratedPUp": 0.3339,
    "base": 0.315,
    "pUp": 0.3392
   },
   "20": {
    "n": 533,
    "up": 178,
    "raw": 0.334,
    "uncalibratedPUp": 0.3329,
    "base": 0.315,
    "pUp": 0.3012
   },
   "40": {
    "n": 1015,
    "up": 381,
    "raw": 0.3754,
    "uncalibratedPUp": 0.3736,
    "base": 0.315,
    "pUp": 0.3392
   },
   "30": {
    "n": 1206,
    "up": 345,
    "raw": 0.2861,
    "uncalibratedPUp": 0.2868,
    "base": 0.315,
    "pUp": 0.3012
   },
   "70": {
    "n": 257,
    "up": 81,
    "raw": 0.3152,
    "uncalibratedPUp": 0.3152,
    "base": 0.315,
    "pUp": 0.3392
   },
   "80": {
    "n": 242,
    "up": 67,
    "raw": 0.2769,
    "uncalibratedPUp": 0.2811,
    "base": 0.315,
    "pUp": 0.3392
   },
   "60": {
    "n": 569,
    "up": 193,
    "raw": 0.3392,
    "uncalibratedPUp": 0.338,
    "base": 0.315,
    "pUp": 0.3392
   },
   "10": {
    "n": 1814,
    "up": 520,
    "raw": 0.2867,
    "uncalibratedPUp": 0.2871,
    "base": 0.315,
    "pUp": 0.2876
   },
   "90": {
    "n": 99,
    "up": 26,
    "raw": 0.2626,
    "uncalibratedPUp": 0.2748,
    "base": 0.315,
    "pUp": 0.3392
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.2876
   }
  },
  "diana": {
   "40": {
    "n": 458,
    "up": 98,
    "raw": 0.214,
    "uncalibratedPUp": 0.2191,
    "base": 0.2971,
    "pUp": 0.2407
   },
   "70": {
    "n": 481,
    "up": 142,
    "raw": 0.2952,
    "uncalibratedPUp": 0.2953,
    "base": 0.2971,
    "pUp": 0.3034
   },
   "50": {
    "n": 602,
    "up": 152,
    "raw": 0.2525,
    "uncalibratedPUp": 0.2546,
    "base": 0.2971,
    "pUp": 0.2546
   },
   "80": {
    "n": 539,
    "up": 236,
    "raw": 0.4378,
    "uncalibratedPUp": 0.4304,
    "base": 0.2971,
    "pUp": 0.3989
   },
   "30": {
    "n": 325,
    "up": 82,
    "raw": 0.2523,
    "uncalibratedPUp": 0.2561,
    "base": 0.2971,
    "pUp": 0.2407
   },
   "90": {
    "n": 120,
    "up": 33,
    "raw": 0.275,
    "uncalibratedPUp": 0.2794,
    "base": 0.2971,
    "pUp": 0.3989
   },
   "60": {
    "n": 477,
    "up": 149,
    "raw": 0.3124,
    "uncalibratedPUp": 0.3115,
    "base": 0.2971,
    "pUp": 0.3034
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2971,
    "base": 0.2971,
    "pUp": 0.2407
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2971,
    "base": 0.2971,
    "pUp": 0.2407
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2971,
    "base": 0.2971,
    "pUp": 0.2407
   }
  },
  "nova": {
   "50": {
    "n": 1283,
    "up": 372,
    "raw": 0.2899,
    "uncalibratedPUp": 0.2905,
    "base": 0.315,
    "pUp": 0.315
   },
   "40": {
    "n": 2577,
    "up": 864,
    "raw": 0.3353,
    "uncalibratedPUp": 0.335,
    "base": 0.315,
    "pUp": 0.315
   },
   "30": {
    "n": 2018,
    "up": 599,
    "raw": 0.2968,
    "uncalibratedPUp": 0.2971,
    "base": 0.315,
    "pUp": 0.315
   },
   "70": {
    "n": 50,
    "up": 6,
    "raw": 0.12,
    "uncalibratedPUp": 0.1931,
    "base": 0.315,
    "pUp": 0.315
   },
   "60": {
    "n": 334,
    "up": 85,
    "raw": 0.2545,
    "uncalibratedPUp": 0.2595,
    "base": 0.315,
    "pUp": 0.315
   },
   "20": {
    "n": 264,
    "up": 131,
    "raw": 0.4962,
    "uncalibratedPUp": 0.4777,
    "base": 0.315,
    "pUp": 0.315
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3048,
    "base": 0.315,
    "pUp": 0.315
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2864,
    "base": 0.315,
    "pUp": 0.315
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.315
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.315
   }
  },
  "flow": {
   "50": {
    "n": 4021,
    "up": 1289,
    "raw": 0.3206,
    "uncalibratedPUp": 0.3205,
    "base": 0.315,
    "pUp": 0.3205
   },
   "70": {
    "n": 78,
    "up": 41,
    "raw": 0.5256,
    "uncalibratedPUp": 0.4671,
    "base": 0.315,
    "pUp": 0.4128
   },
   "40": {
    "n": 1854,
    "up": 535,
    "raw": 0.2886,
    "uncalibratedPUp": 0.289,
    "base": 0.315,
    "pUp": 0.2903
   },
   "30": {
    "n": 244,
    "up": 72,
    "raw": 0.2951,
    "uncalibratedPUp": 0.2973,
    "base": 0.315,
    "pUp": 0.2903
   },
   "60": {
    "n": 293,
    "up": 110,
    "raw": 0.3754,
    "uncalibratedPUp": 0.3698,
    "base": 0.315,
    "pUp": 0.3698
   },
   "20": {
    "n": 40,
    "up": 10,
    "raw": 0.25,
    "uncalibratedPUp": 0.2779,
    "base": 0.315,
    "pUp": 0.2903
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.2903
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.2903
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.4128
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.315,
    "base": 0.315,
    "pUp": 0.4128
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 1395,
   "errorCorr": -0.065
  },
  "taro:nova": {
   "n": 3024,
   "errorCorr": 0.902
  },
  "taro:flow": {
   "n": 762,
   "errorCorr": 0.178
  },
  "diana:nova": {
   "n": 938,
   "errorCorr": -0.085
  },
  "diana:flow": {
   "n": 234,
   "errorCorr": 0.106
  },
  "nova:flow": {
   "n": 534,
   "errorCorr": 0.136
  }
 },
 "redundancyFactor": {
  "taro": 0.9532,
  "diana": 1,
  "nova": 0.9549,
  "flow": 0.9983
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.309,
    "diana": 0.0597,
    "nova": 0.3493,
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
    "taro": 0.3008,
    "diana": 0.0631,
    "nova": 0.3534,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 734,
     "adjustedAcc": 62.8
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
   "n": 3532,
   "blend": 0.6,
   "weights": {
    "taro": 0.3013,
    "diana": 0.063,
    "nova": 0.3703,
    "flow": 0.2654
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 566,
     "adjustedAcc": 40.3
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
   "n": 2427,
   "blend": 0.6,
   "weights": {
    "taro": 0.3007,
    "diana": 0.0729,
    "nova": 0.3555,
    "flow": 0.2709
   },
   "acc": {
    "taro": {
     "n": 1142,
     "adjustedAcc": 58.8
    },
    "diana": {
     "n": 288,
     "adjustedAcc": 51.1
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
  },
  "side_low": {
   "n": 718,
   "blend": 0.473,
   "weights": {
    "taro": 0.2878,
    "diana": 0.072,
    "nova": 0.362,
    "flow": 0.2783
   },
   "acc": {
    "taro": {
     "n": 360,
     "adjustedAcc": 56.7
    },
    "diana": {
     "n": 0,
     "adjustedAcc": 50.0
    },
    "nova": {
     "n": 290,
     "adjustedAcc": 61.4
    },
    "flow": {
     "n": 68,
     "adjustedAcc": 53.9
    }
   }
  }
 },
 "currentRegime": {
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 14.82,
  "medianAbs1": 1.55
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2000,
  "errors": 1283,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1131
   },
   {
    "label": "분석가 의견충돌",
    "count": 1025
   },
   {
    "label": "고변동성 국면",
    "count": 721
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 100
   }
  ],
  "analystErrors": {
   "taro": 1014,
   "diana": 0,
   "nova": 211,
   "flow": 120
  },
  "regimeErrors": {
   "down_high": 721,
   "down_low": 391,
   "up_low": 171
  }
 },
 "shadow": {
  "n": 2000,
  "baselineActionN": 678,
  "baselineActionPrecision": 28.8,
  "candidateActionN": 1843,
  "candidateActionPrecision": 26.6,
  "candidateCoverage": 92.2,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 1,
   "SELL": 1999
  },
  "testDays": 4,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 24.6,
  "brier": 0.3656,
  "rawBrier": 0.257
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
