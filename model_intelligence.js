// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-18 14:39",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2364,
    "up": 1195,
    "raw": 0.5055,
    "uncalibratedPUp": 0.5047,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "20": {
    "n": 1046,
    "up": 497,
    "raw": 0.4751,
    "uncalibratedPUp": 0.4743,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "40": {
    "n": 2517,
    "up": 1265,
    "raw": 0.5026,
    "uncalibratedPUp": 0.5019,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "30": {
    "n": 2704,
    "up": 1200,
    "raw": 0.4438,
    "uncalibratedPUp": 0.4438,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "70": {
    "n": 1370,
    "up": 542,
    "raw": 0.3956,
    "uncalibratedPUp": 0.3967,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "80": {
    "n": 1447,
    "up": 477,
    "raw": 0.3296,
    "uncalibratedPUp": 0.332,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "60": {
    "n": 2626,
    "up": 1081,
    "raw": 0.4117,
    "uncalibratedPUp": 0.412,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "10": {
    "n": 3254,
    "up": 1460,
    "raw": 0.4487,
    "uncalibratedPUp": 0.4486,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "90": {
    "n": 434,
    "up": 166,
    "raw": 0.3825,
    "uncalibratedPUp": 0.3864,
    "base": 0.4437,
    "pUp": 0.4438
   },
   "0": {
    "n": 5,
    "up": 1,
    "raw": 0.2,
    "uncalibratedPUp": 0.4089,
    "base": 0.4437,
    "pUp": 0.4089
   }
  },
  "diana": {
   "40": {
    "n": 2762,
    "up": 1548,
    "raw": 0.5605,
    "uncalibratedPUp": 0.5605,
    "base": 0.5646,
    "pUp": 0.5605
   },
   "70": {
    "n": 2990,
    "up": 1701,
    "raw": 0.5689,
    "uncalibratedPUp": 0.5689,
    "base": 0.5646,
    "pUp": 0.5702
   },
   "50": {
    "n": 3487,
    "up": 1975,
    "raw": 0.5664,
    "uncalibratedPUp": 0.5664,
    "base": 0.5646,
    "pUp": 0.5664
   },
   "80": {
    "n": 3100,
    "up": 1871,
    "raw": 0.6035,
    "uncalibratedPUp": 0.6032,
    "base": 0.5646,
    "pUp": 0.5824
   },
   "30": {
    "n": 1838,
    "up": 943,
    "raw": 0.5131,
    "uncalibratedPUp": 0.5139,
    "base": 0.5646,
    "pUp": 0.5154
   },
   "90": {
    "n": 712,
    "up": 350,
    "raw": 0.4916,
    "uncalibratedPUp": 0.4945,
    "base": 0.5646,
    "pUp": 0.5824
   },
   "60": {
    "n": 2860,
    "up": 1635,
    "raw": 0.5717,
    "uncalibratedPUp": 0.5716,
    "base": 0.5646,
    "pUp": 0.5702
   },
   "20": {
    "n": 4,
    "up": 1,
    "raw": 0.25,
    "uncalibratedPUp": 0.5276,
    "base": 0.5646,
    "pUp": 0.5154
   },
   "10": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5464,
    "base": 0.5646,
    "pUp": 0.5154
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5646,
    "base": 0.5646,
    "pUp": 0.5154
   }
  },
  "nova": {
   "50": {
    "n": 4062,
    "up": 1420,
    "raw": 0.3496,
    "uncalibratedPUp": 0.3503,
    "base": 0.4437,
    "pUp": 0.4071
   },
   "40": {
    "n": 5578,
    "up": 2118,
    "raw": 0.3797,
    "uncalibratedPUp": 0.38,
    "base": 0.4437,
    "pUp": 0.4071
   },
   "30": {
    "n": 3547,
    "up": 1521,
    "raw": 0.4288,
    "uncalibratedPUp": 0.4289,
    "base": 0.4437,
    "pUp": 0.4071
   },
   "70": {
    "n": 56,
    "up": 10,
    "raw": 0.1786,
    "uncalibratedPUp": 0.2711,
    "base": 0.4437,
    "pUp": 0.6442
   },
   "60": {
    "n": 2612,
    "up": 1736,
    "raw": 0.6646,
    "uncalibratedPUp": 0.6621,
    "base": 0.4437,
    "pUp": 0.6442
   },
   "20": {
    "n": 1907,
    "up": 1079,
    "raw": 0.5658,
    "uncalibratedPUp": 0.5639,
    "base": 0.4437,
    "pUp": 0.4071
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4294,
    "base": 0.4437,
    "pUp": 0.6442
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3915,
    "base": 0.4437,
    "pUp": 0.6442
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4437,
    "base": 0.4437,
    "pUp": 0.4071
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4437,
    "base": 0.4437,
    "pUp": 0.4071
   }
  },
  "flow": {
   "50": {
    "n": 11063,
    "up": 5034,
    "raw": 0.455,
    "uncalibratedPUp": 0.455,
    "base": 0.4437,
    "pUp": 0.455
   },
   "70": {
    "n": 229,
    "up": 123,
    "raw": 0.5371,
    "uncalibratedPUp": 0.5263,
    "base": 0.4437,
    "pUp": 0.5135
   },
   "40": {
    "n": 5093,
    "up": 2095,
    "raw": 0.4113,
    "uncalibratedPUp": 0.4115,
    "base": 0.4437,
    "pUp": 0.4115
   },
   "30": {
    "n": 562,
    "up": 213,
    "raw": 0.379,
    "uncalibratedPUp": 0.3823,
    "base": 0.4437,
    "pUp": 0.4013
   },
   "60": {
    "n": 704,
    "up": 367,
    "raw": 0.5213,
    "uncalibratedPUp": 0.5181,
    "base": 0.4437,
    "pUp": 0.5135
   },
   "20": {
    "n": 102,
    "up": 47,
    "raw": 0.4608,
    "uncalibratedPUp": 0.4569,
    "base": 0.4437,
    "pUp": 0.4013
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3804,
    "base": 0.4437,
    "pUp": 0.5135
   },
   "10": {
    "n": 9,
    "up": 5,
    "raw": 0.5556,
    "uncalibratedPUp": 0.4695,
    "base": 0.4437,
    "pUp": 0.4013
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4437,
    "base": 0.4437,
    "pUp": 0.4013
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4437,
    "base": 0.4437,
    "pUp": 0.5135
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 8134,
   "errorCorr": -0.056
  },
  "taro:nova": {
   "n": 7799,
   "errorCorr": 0.172
  },
  "taro:flow": {
   "n": 2087,
   "errorCorr": 0.235
  },
  "diana:nova": {
   "n": 5808,
   "errorCorr": -0.067
  },
  "diana:flow": {
   "n": 1358,
   "errorCorr": 0.078
  },
  "nova:flow": {
   "n": 1454,
   "errorCorr": -0.083
  }
 },
 "redundancyFactor": {
  "taro": 0.9936,
  "diana": 1,
  "nova": 0.9987,
  "flow": 0.9949
 },
 "regimes": {
  "up_high": {
   "n": 5756,
   "blend": 0.6,
   "weights": {
    "taro": 0.3332,
    "diana": 0.1209,
    "nova": 0.2165,
    "flow": 0.3294
   },
   "acc": {
    "taro": {
     "n": 2175,
     "adjustedAcc": 58.8
    },
    "diana": {
     "n": 1805,
     "adjustedAcc": 49.9
    },
    "nova": {
     "n": 1364,
     "adjustedAcc": 34.4
    },
    "flow": {
     "n": 412,
     "adjustedAcc": 59.7
    }
   }
  },
  "up_low": {
   "n": 5871,
   "blend": 0.6,
   "weights": {
    "taro": 0.2764,
    "diana": 0.1206,
    "nova": 0.2922,
    "flow": 0.3107
   },
   "acc": {
    "taro": {
     "n": 2646,
     "adjustedAcc": 41.3
    },
    "diana": {
     "n": 2036,
     "adjustedAcc": 48.0
    },
    "nova": {
     "n": 711,
     "adjustedAcc": 58.8
    },
    "flow": {
     "n": 478,
     "adjustedAcc": 53.3
    }
   }
  },
  "down_high": {
   "n": 13327,
   "blend": 0.6,
   "weights": {
    "taro": 0.2641,
    "diana": 0.1411,
    "nova": 0.2999,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 4644,
     "adjustedAcc": 40.8
    },
    "diana": {
     "n": 3832,
     "adjustedAcc": 64.4
    },
    "nova": {
     "n": 4006,
     "adjustedAcc": 64.5
    },
    "flow": {
     "n": 845,
     "adjustedAcc": 52.7
    }
   }
  },
  "side_high": {
   "n": 5233,
   "blend": 0.6,
   "weights": {
    "taro": 0.3191,
    "diana": 0.117,
    "nova": 0.2861,
    "flow": 0.2779
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
    "taro": 0.3095,
    "diana": 0.1377,
    "nova": 0.2246,
    "flow": 0.3283
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
  "median5": -1.28,
  "medianAbs1": 1.21,
  "advanceRatio5": 36.3,
  "medianRet1": -0.36,
  "advanceRatio1": 41.0
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 28539,
  "days": 54,
  "guardedN": 295,
  "baseline": {
   "hit": 15449,
   "miss": 11986,
   "mid": 1104,
   "accuracy": 56.3
  },
  "guarded": {
   "hit": 15445,
   "miss": 12005,
   "mid": 1089,
   "accuracy": 56.3
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 7783,
  "errors": 2548,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2229
   },
   {
    "label": "분석가 의견충돌",
    "count": 1532
   },
   {
    "label": "고변동성 국면",
    "count": 268
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 126
   }
  ],
  "analystErrors": {
   "taro": 1571,
   "diana": 0,
   "nova": 128,
   "flow": 309
  },
  "regimeErrors": {
   "up_low": 891,
   "down_low": 765,
   "side_low": 624,
   "down_high": 268
  }
 },
 "shadow": {
  "n": 7783,
  "baselineActionN": 1980,
  "baselineActionPrecision": 52.6,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 7783,
   "SELL": 0
  },
  "testDays": 13,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2417,
  "rawBrier": 0.2659
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
     "n": 468,
     "hit": 186,
     "raw": 0.3974,
     "uncalibratedAcc": 0.3968,
     "base": 0.3831,
     "calibratedAcc": 0.3968
    },
    "60": {
     "n": 466,
     "hit": 157,
     "raw": 0.3369,
     "uncalibratedAcc": 0.3388,
     "base": 0.3831,
     "calibratedAcc": 0.3388
    },
    "70": {
     "n": 138,
     "hit": 65,
     "raw": 0.471,
     "uncalibratedAcc": 0.4599,
     "base": 0.3831,
     "calibratedAcc": 0.4599
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.487,
     "base": 0.3831,
     "calibratedAcc": 0.487
    }
   },
   "SELL": {
    "40": {
     "n": 2374,
     "hit": 1306,
     "raw": 0.5501,
     "uncalibratedAcc": 0.5501,
     "base": 0.5434,
     "calibratedAcc": 0.5501
    },
    "45": {
     "n": 1212,
     "hit": 600,
     "raw": 0.495,
     "uncalibratedAcc": 0.4958,
     "base": 0.5434,
     "calibratedAcc": 0.4958
    },
    "35": {
     "n": 1455,
     "hit": 884,
     "raw": 0.6076,
     "uncalibratedAcc": 0.6067,
     "base": 0.5434,
     "calibratedAcc": 0.5627
    },
    "30": {
     "n": 542,
     "hit": 280,
     "raw": 0.5166,
     "uncalibratedAcc": 0.5176,
     "base": 0.5434,
     "calibratedAcc": 0.5627
    },
    "25": {
     "n": 80,
     "hit": 17,
     "raw": 0.2125,
     "uncalibratedAcc": 0.2787,
     "base": 0.5434,
     "calibratedAcc": 0.5627
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3514,
     "base": 0.5434,
     "calibratedAcc": 0.5627
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5175,
     "base": 0.5434,
     "calibratedAcc": 0.5627
    }
   }
  },
  "evaluation": {
   "n": 1980,
   "buyN": 505,
   "sellN": 1475,
   "testDays": 13,
   "testRegimes": 4,
   "candidate": {
    "n": 1980,
    "tierSpreadPp": 18.8,
    "corr": 0.1912,
    "ci95": {
     "lowPp": -3.8,
     "highPp": 36.5,
     "includesZero": true,
     "decisionDays": 13,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1980,
    "tierSpreadPp": 7.1,
    "corr": 0.0601,
    "ci95": {
     "lowPp": -0.6,
     "highPp": 13.0,
     "includesZero": true,
     "decisionDays": 13,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     47,
     55
    ],
    "candidateRangeSell": [
     57,
     62
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 505,
     "tierSpreadPp": 2.4
    },
    "candidateWithinSell": {
     "n": 1475,
     "tierSpreadPp": -5.5
    },
    "baselineWithinBuy": {
     "n": 505,
     "tierSpreadPp": -7.7
    },
    "baselineWithinSell": {
     "n": 1475,
     "tierSpreadPp": 3.7
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 59,
   "trainDays": 36,
   "embargoDays": 5,
   "holdoutDays": 18,
   "holdoutSharePct": 30.5,
   "estimatedTotalDaysForGate": 182,
   "isProspective": false
  },
  "prospective": {
   "type": "PROSPECTIVE_ARCHIVED",
   "note": "그날 미리 기록해 둔 확신도 후보값만으로 채점한다. 나중에 만든 교정표를 과거에 적용하지 않으므로 검증일이 실제로 하루씩 쌓인다.",
   "n": 728,
   "testDays": 5,
   "firstDay": "2026-09-07",
   "lastDay": "2026-09-11",
   "buyN": 169,
   "sellN": 559,
   "tierSpreadPp": 33.9,
   "tierSpreadWithinBuyPp": 7.1,
   "tierSpreadWithinSellPp": 3.2,
   "clockStarted": true,
   "daysRemainingToGate": 35
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 판별력 95% 구간(-3.8~36.5pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY 2.4pp · SELL -5.5pp)",
    "사전 기록 기반 검증일 5일 / 40일 (누적 중)"
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
