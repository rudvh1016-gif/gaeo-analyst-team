// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-05 12:12",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 751,
    "up": 246,
    "raw": 0.3276,
    "uncalibratedPUp": 0.3267,
    "base": 0.3049,
    "pUp": 0.325
   },
   "20": {
    "n": 488,
    "up": 159,
    "raw": 0.3258,
    "uncalibratedPUp": 0.3246,
    "base": 0.3049,
    "pUp": 0.2884
   },
   "40": {
    "n": 921,
    "up": 321,
    "raw": 0.3485,
    "uncalibratedPUp": 0.3472,
    "base": 0.3049,
    "pUp": 0.325
   },
   "30": {
    "n": 1093,
    "up": 296,
    "raw": 0.2708,
    "uncalibratedPUp": 0.2717,
    "base": 0.3049,
    "pUp": 0.2884
   },
   "70": {
    "n": 247,
    "up": 76,
    "raw": 0.3077,
    "uncalibratedPUp": 0.3074,
    "base": 0.3049,
    "pUp": 0.325
   },
   "80": {
    "n": 227,
    "up": 62,
    "raw": 0.2731,
    "uncalibratedPUp": 0.2768,
    "base": 0.3049,
    "pUp": 0.325
   },
   "60": {
    "n": 529,
    "up": 175,
    "raw": 0.3308,
    "uncalibratedPUp": 0.3294,
    "base": 0.3049,
    "pUp": 0.325
   },
   "10": {
    "n": 1680,
    "up": 480,
    "raw": 0.2857,
    "uncalibratedPUp": 0.2861,
    "base": 0.3049,
    "pUp": 0.2864
   },
   "90": {
    "n": 95,
    "up": 24,
    "raw": 0.2526,
    "uncalibratedPUp": 0.2652,
    "base": 0.3049,
    "pUp": 0.325
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2864
   }
  },
  "diana": {
   "40": {
    "n": 380,
    "up": 63,
    "raw": 0.1658,
    "uncalibratedPUp": 0.1721,
    "base": 0.2521,
    "pUp": 0.186
   },
   "70": {
    "n": 400,
    "up": 102,
    "raw": 0.255,
    "uncalibratedPUp": 0.2548,
    "base": 0.2521,
    "pUp": 0.2563
   },
   "50": {
    "n": 500,
    "up": 107,
    "raw": 0.214,
    "uncalibratedPUp": 0.2162,
    "base": 0.2521,
    "pUp": 0.2162
   },
   "80": {
    "n": 450,
    "up": 181,
    "raw": 0.4022,
    "uncalibratedPUp": 0.3928,
    "base": 0.2521,
    "pUp": 0.3641
   },
   "30": {
    "n": 270,
    "up": 48,
    "raw": 0.1778,
    "uncalibratedPUp": 0.1852,
    "base": 0.2521,
    "pUp": 0.186
   },
   "90": {
    "n": 100,
    "up": 26,
    "raw": 0.26,
    "uncalibratedPUp": 0.2582,
    "base": 0.2521,
    "pUp": 0.3641
   },
   "60": {
    "n": 395,
    "up": 102,
    "raw": 0.2582,
    "uncalibratedPUp": 0.2578,
    "base": 0.2521,
    "pUp": 0.2563
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2521,
    "base": 0.2521,
    "pUp": 0.186
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2521,
    "base": 0.2521,
    "pUp": 0.186
   },
   "20": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.2521,
    "base": 0.2521,
    "pUp": 0.186
   }
  },
  "nova": {
   "50": {
    "n": 1228,
    "up": 347,
    "raw": 0.2826,
    "uncalibratedPUp": 0.2831,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "40": {
    "n": 2380,
    "up": 750,
    "raw": 0.3151,
    "uncalibratedPUp": 0.315,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "30": {
    "n": 1800,
    "up": 531,
    "raw": 0.295,
    "uncalibratedPUp": 0.2952,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "70": {
    "n": 49,
    "up": 5,
    "raw": 0.102,
    "uncalibratedPUp": 0.1791,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "60": {
    "n": 326,
    "up": 82,
    "raw": 0.2515,
    "uncalibratedPUp": 0.256,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "20": {
    "n": 244,
    "up": 124,
    "raw": 0.5082,
    "uncalibratedPUp": 0.4859,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2951,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "80": {
    "n": 3,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.2772,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3049
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3049
   }
  },
  "flow": {
   "50": {
    "n": 3716,
    "up": 1145,
    "raw": 0.3081,
    "uncalibratedPUp": 0.3081,
    "base": 0.3049,
    "pUp": 0.3081
   },
   "70": {
    "n": 72,
    "up": 37,
    "raw": 0.5139,
    "uncalibratedPUp": 0.4524,
    "base": 0.3049,
    "pUp": 0.3978
   },
   "40": {
    "n": 1712,
    "up": 478,
    "raw": 0.2792,
    "uncalibratedPUp": 0.2796,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "30": {
    "n": 223,
    "up": 68,
    "raw": 0.3049,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "60": {
    "n": 271,
    "up": 102,
    "raw": 0.3764,
    "uncalibratedPUp": 0.3693,
    "base": 0.3049,
    "pUp": 0.3693
   },
   "20": {
    "n": 37,
    "up": 9,
    "raw": 0.2432,
    "uncalibratedPUp": 0.2709,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.2831
   },
   "80": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3978
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.3049,
    "base": 0.3049,
    "pUp": 0.3978
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 1173,
   "errorCorr": -0.054
  },
  "taro:nova": {
   "n": 2750,
   "errorCorr": 0.895
  },
  "taro:flow": {
   "n": 703,
   "errorCorr": 0.173
  },
  "diana:nova": {
   "n": 752,
   "errorCorr": -0.035
  },
  "diana:flow": {
   "n": 191,
   "errorCorr": 0.133
  },
  "nova:flow": {
   "n": 489,
   "errorCorr": 0.121
  }
 },
 "redundancyFactor": {
  "taro": 0.954,
  "diana": 1,
  "nova": 0.9553,
  "flow": 0.9986
 },
 "regimes": {
  "up_low": {
   "n": 1922,
   "blend": 0.6,
   "weights": {
    "taro": 0.3296,
    "diana": 0.0572,
    "nova": 0.3305,
    "flow": 0.2827
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
    "taro": 0.3212,
    "diana": 0.0605,
    "nova": 0.3346,
    "flow": 0.2837
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
   "n": 3521,
   "blend": 0.6,
   "weights": {
    "taro": 0.3217,
    "diana": 0.0614,
    "nova": 0.3506,
    "flow": 0.2663
   },
   "acc": {
    "taro": {
     "n": 1496,
     "adjustedAcc": 61.4
    },
    "diana": {
     "n": 555,
     "adjustedAcc": 41.8
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
    "taro": 0.3216,
    "diana": 0.0691,
    "nova": 0.3371,
    "flow": 0.2723
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
  },
  "side_low": {
   "n": 718,
   "blend": 0.473,
   "weights": {
    "taro": 0.3078,
    "diana": 0.0691,
    "nova": 0.3434,
    "flow": 0.2797
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
  "median5": 15.16,
  "medianAbs1": 2.49
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "audit": {
  "matured": 2000,
  "errors": 1035,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 900
   },
   {
    "label": "고변동성 국면",
    "count": 864
   },
   {
    "label": "분석가 의견충돌",
    "count": 811
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 84
   }
  ],
  "analystErrors": {
   "taro": 740,
   "diana": 0,
   "nova": 229,
   "flow": 104
  },
  "regimeErrors": {
   "down_high": 718,
   "up_low": 171,
   "side_high": 146
  }
 },
 "shadow": {
  "n": 2000,
  "baselineActionN": 715,
  "baselineActionPrecision": 48.3,
  "candidateActionN": 1816,
  "candidateActionPrecision": 44.8,
  "candidateCoverage": 90.8,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 2,
   "SELL": 1998
  },
  "testDays": 4,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 40.6,
  "brier": 0.3082,
  "rawBrier": 0.2486
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
