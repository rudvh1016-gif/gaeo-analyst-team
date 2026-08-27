// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-08-27 14:01",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1485,
    "up": 631,
    "raw": 0.4249,
    "uncalibratedPUp": 0.4251,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "20": {
    "n": 960,
    "up": 447,
    "raw": 0.4656,
    "uncalibratedPUp": 0.4646,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "40": {
    "n": 2033,
    "up": 964,
    "raw": 0.4742,
    "uncalibratedPUp": 0.4736,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "30": {
    "n": 2438,
    "up": 1029,
    "raw": 0.4221,
    "uncalibratedPUp": 0.4222,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "70": {
    "n": 506,
    "up": 202,
    "raw": 0.3992,
    "uncalibratedPUp": 0.4011,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "80": {
    "n": 399,
    "up": 135,
    "raw": 0.3383,
    "uncalibratedPUp": 0.345,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "60": {
    "n": 1040,
    "up": 433,
    "raw": 0.4163,
    "uncalibratedPUp": 0.4168,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "10": {
    "n": 3079,
    "up": 1357,
    "raw": 0.4407,
    "uncalibratedPUp": 0.4407,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "90": {
    "n": 123,
    "up": 29,
    "raw": 0.2358,
    "uncalibratedPUp": 0.2745,
    "base": 0.4333,
    "pUp": 0.4333
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4333,
    "base": 0.4333,
    "pUp": 0.4333
   }
  },
  "diana": {
   "40": {
    "n": 1593,
    "up": 930,
    "raw": 0.5838,
    "uncalibratedPUp": 0.5839,
    "base": 0.5911,
    "pUp": 0.5747
   },
   "70": {
    "n": 1717,
    "up": 1017,
    "raw": 0.5923,
    "uncalibratedPUp": 0.5923,
    "base": 0.5911,
    "pUp": 0.6016
   },
   "50": {
    "n": 2082,
    "up": 1172,
    "raw": 0.5629,
    "uncalibratedPUp": 0.5633,
    "base": 0.5911,
    "pUp": 0.5747
   },
   "80": {
    "n": 1901,
    "up": 1200,
    "raw": 0.6312,
    "uncalibratedPUp": 0.6306,
    "base": 0.5911,
    "pUp": 0.6098
   },
   "30": {
    "n": 1099,
    "up": 640,
    "raw": 0.5823,
    "uncalibratedPUp": 0.5826,
    "base": 0.5911,
    "pUp": 0.5747
   },
   "90": {
    "n": 444,
    "up": 231,
    "raw": 0.5203,
    "uncalibratedPUp": 0.5248,
    "base": 0.5911,
    "pUp": 0.6098
   },
   "60": {
    "n": 1718,
    "up": 1050,
    "raw": 0.6112,
    "uncalibratedPUp": 0.6108,
    "base": 0.5911,
    "pUp": 0.6016
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5542,
    "base": 0.5911,
    "pUp": 0.5747
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5911,
    "base": 0.5911,
    "pUp": 0.5747
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5911,
    "base": 0.5911,
    "pUp": 0.5747
   }
  },
  "nova": {
   "50": {
    "n": 1485,
    "up": 484,
    "raw": 0.3259,
    "uncalibratedPUp": 0.3281,
    "base": 0.4333,
    "pUp": 0.3742
   },
   "40": {
    "n": 3575,
    "up": 1298,
    "raw": 0.3631,
    "uncalibratedPUp": 0.3637,
    "base": 0.4333,
    "pUp": 0.3742
   },
   "30": {
    "n": 3150,
    "up": 1214,
    "raw": 0.3854,
    "uncalibratedPUp": 0.3858,
    "base": 0.4333,
    "pUp": 0.3742
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.241,
    "base": 0.4333,
    "pUp": 0.6443
   },
   "60": {
    "n": 2529,
    "up": 1685,
    "raw": 0.6663,
    "uncalibratedPUp": 0.6635,
    "base": 0.4333,
    "pUp": 0.6443
   },
   "20": {
    "n": 1266,
    "up": 539,
    "raw": 0.4258,
    "uncalibratedPUp": 0.4259,
    "base": 0.4333,
    "pUp": 0.3742
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4193,
    "base": 0.4333,
    "pUp": 0.6443
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3823,
    "base": 0.4333,
    "pUp": 0.6443
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4333,
    "base": 0.4333,
    "pUp": 0.3742
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4333,
    "base": 0.4333,
    "pUp": 0.3742
   }
  },
  "flow": {
   "50": {
    "n": 7626,
    "up": 3360,
    "raw": 0.4406,
    "uncalibratedPUp": 0.4406,
    "base": 0.4333,
    "pUp": 0.4406
   },
   "70": {
    "n": 144,
    "up": 78,
    "raw": 0.5417,
    "uncalibratedPUp": 0.523,
    "base": 0.4333,
    "pUp": 0.4895
   },
   "40": {
    "n": 3312,
    "up": 1373,
    "raw": 0.4146,
    "uncalibratedPUp": 0.4147,
    "base": 0.4333,
    "pUp": 0.4147
   },
   "30": {
    "n": 394,
    "up": 137,
    "raw": 0.3477,
    "uncalibratedPUp": 0.3538,
    "base": 0.4333,
    "pUp": 0.3729
   },
   "60": {
    "n": 506,
    "up": 248,
    "raw": 0.4901,
    "uncalibratedPUp": 0.4869,
    "base": 0.4333,
    "pUp": 0.4869
   },
   "20": {
    "n": 72,
    "up": 27,
    "raw": 0.375,
    "uncalibratedPUp": 0.3921,
    "base": 0.4333,
    "pUp": 0.3729
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3714,
    "base": 0.4333,
    "pUp": 0.4895
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5,
    "base": 0.4333,
    "pUp": 0.3729
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4333,
    "base": 0.4333,
    "pUp": 0.3729
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4333,
    "base": 0.4333,
    "pUp": 0.4895
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 4860,
   "errorCorr": -0.164
  },
  "taro:nova": {
   "n": 6900,
   "errorCorr": 0.23
  },
  "taro:flow": {
   "n": 1421,
   "errorCorr": 0.206
  },
  "diana:nova": {
   "n": 4175,
   "errorCorr": -0.088
  },
  "diana:flow": {
   "n": 791,
   "errorCorr": 0.124
  },
  "nova:flow": {
   "n": 1234,
   "errorCorr": -0.061
  }
 },
 "redundancyFactor": {
  "taro": 0.9918,
  "diana": 1,
  "nova": 0.9952,
  "flow": 0.9967
 },
 "regimes": {
  "up_high": {
   "n": 995,
   "blend": 0.554,
   "weights": {
    "taro": 0.2851,
    "diana": 0.1079,
    "nova": 0.2591,
    "flow": 0.3479
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
    "taro": 0.278,
    "diana": 0.1158,
    "nova": 0.2999,
    "flow": 0.3063
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
    "taro": 0.2944,
    "diana": 0.1095,
    "nova": 0.2714,
    "flow": 0.3247
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
   "n": 11764,
   "blend": 0.6,
   "weights": {
    "taro": 0.2249,
    "diana": 0.1431,
    "nova": 0.3078,
    "flow": 0.3242
   },
   "acc": {
    "taro": {
     "n": 4244,
     "adjustedAcc": 40.3
    },
    "diana": {
     "n": 2827,
     "adjustedAcc": 64.0
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
   "n": 3153,
   "blend": 0.6,
   "weights": {
    "taro": 0.2681,
    "diana": 0.1346,
    "nova": 0.2324,
    "flow": 0.3649
   },
   "acc": {
    "taro": {
     "n": 1111,
     "adjustedAcc": 57.3
    },
    "diana": {
     "n": 635,
     "adjustedAcc": 60.6
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
  "key": "side_low",
  "trend": "side",
  "vol": "low",
  "median5": 0.63,
  "medianAbs1": 1.37,
  "advanceRatio5": 56.4,
  "medianRet1": -0.3,
  "advanceRatio1": 40.3
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 18970,
  "days": 38,
  "guardedN": 295,
  "baseline": {
   "hit": 9549,
   "miss": 8704,
   "mid": 717,
   "accuracy": 52.3
  },
  "guarded": {
   "hit": 9544,
   "miss": 8724,
   "mid": 702,
   "accuracy": 52.2
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 4404,
  "errors": 1887,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1828
   },
   {
    "label": "분석가 의견충돌",
    "count": 1122
   },
   {
    "label": "고변동성 국면",
    "count": 363
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 63
   }
  ],
  "analystErrors": {
   "taro": 1296,
   "diana": 0,
   "nova": 60,
   "flow": 205
  },
  "regimeErrors": {
   "up_low": 1024,
   "down_high": 363,
   "unknown": 322,
   "down_low": 178
  }
 },
 "shadow": {
  "n": 4404,
  "baselineActionN": 772,
  "baselineActionPrecision": 50.6,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 4404,
   "SELL": 0
  },
  "testDays": 8,
  "testRegimes": 3,
  "candidateAllCallAccuracy": 55.9,
  "brier": 0.2351,
  "rawBrier": 0.2738
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
     "n": 288,
     "hit": 122,
     "raw": 0.4236,
     "uncalibratedAcc": 0.4234,
     "base": 0.4199,
     "calibratedAcc": 0.4234
    },
    "60": {
     "n": 197,
     "hit": 76,
     "raw": 0.3858,
     "uncalibratedAcc": 0.3889,
     "base": 0.4199,
     "calibratedAcc": 0.3889
    },
    "70": {
     "n": 123,
     "hit": 56,
     "raw": 0.4553,
     "uncalibratedAcc": 0.4503,
     "base": 0.4199,
     "calibratedAcc": 0.4503
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.4749,
     "base": 0.4199,
     "calibratedAcc": 0.4749
    }
   },
   "SELL": {
    "40": {
     "n": 1954,
     "hit": 1182,
     "raw": 0.6049,
     "uncalibratedAcc": 0.605,
     "base": 0.6119,
     "calibratedAcc": 0.605
    },
    "45": {
     "n": 945,
     "hit": 497,
     "raw": 0.5259,
     "uncalibratedAcc": 0.5277,
     "base": 0.6119,
     "calibratedAcc": 0.5277
    },
    "35": {
     "n": 1224,
     "hit": 837,
     "raw": 0.6838,
     "uncalibratedAcc": 0.6827,
     "base": 0.6119,
     "calibratedAcc": 0.6663
    },
    "30": {
     "n": 417,
     "hit": 261,
     "raw": 0.6259,
     "uncalibratedAcc": 0.6253,
     "base": 0.6119,
     "calibratedAcc": 0.6663
    },
    "25": {
     "n": 24,
     "hit": 16,
     "raw": 0.6667,
     "uncalibratedAcc": 0.6418,
     "base": 0.6119,
     "calibratedAcc": 0.6663
    },
    "20": {
     "n": 2,
     "hit": 1,
     "raw": 0.5,
     "uncalibratedAcc": 0.6017,
     "base": 0.6119,
     "calibratedAcc": 0.6663
    }
   }
  },
  "evaluation": {
   "n": 772,
   "buyN": 376,
   "sellN": 396,
   "testDays": 8,
   "testRegimes": 3,
   "candidate": {
    "n": 772,
    "tierSpreadPp": 37.4,
    "corr": 0.3087
   },
   "baseline": {
    "n": 772,
    "tierSpreadPp": 10.1,
    "corr": 0.0851
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
