// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-09 10:45",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2070,
    "up": 1110,
    "raw": 0.5362,
    "uncalibratedPUp": 0.5354,
    "base": 0.4763,
    "pUp": 0.4938
   },
   "20": {
    "n": 1021,
    "up": 490,
    "raw": 0.4799,
    "uncalibratedPUp": 0.4798,
    "base": 0.4763,
    "pUp": 0.4581
   },
   "40": {
    "n": 2352,
    "up": 1223,
    "raw": 0.52,
    "uncalibratedPUp": 0.5194,
    "base": 0.4763,
    "pUp": 0.4938
   },
   "30": {
    "n": 2616,
    "up": 1175,
    "raw": 0.4492,
    "uncalibratedPUp": 0.4495,
    "base": 0.4763,
    "pUp": 0.4581
   },
   "70": {
    "n": 909,
    "up": 434,
    "raw": 0.4774,
    "uncalibratedPUp": 0.4774,
    "base": 0.4763,
    "pUp": 0.4938
   },
   "80": {
    "n": 831,
    "up": 307,
    "raw": 0.3694,
    "uncalibratedPUp": 0.3732,
    "base": 0.4763,
    "pUp": 0.4938
   },
   "60": {
    "n": 1790,
    "up": 896,
    "raw": 0.5006,
    "uncalibratedPUp": 0.5002,
    "base": 0.4763,
    "pUp": 0.4938
   },
   "10": {
    "n": 3215,
    "up": 1452,
    "raw": 0.4516,
    "uncalibratedPUp": 0.4519,
    "base": 0.4763,
    "pUp": 0.4521
   },
   "90": {
    "n": 253,
    "up": 85,
    "raw": 0.336,
    "uncalibratedPUp": 0.3508,
    "base": 0.4763,
    "pUp": 0.4938
   },
   "0": {
    "n": 2,
    "up": 1,
    "raw": 0.5,
    "uncalibratedPUp": 0.4778,
    "base": 0.4763,
    "pUp": 0.4521
   }
  },
  "diana": {
   "40": {
    "n": 2277,
    "up": 1342,
    "raw": 0.5894,
    "uncalibratedPUp": 0.5895,
    "base": 0.5963,
    "pUp": 0.5895
   },
   "70": {
    "n": 2515,
    "up": 1493,
    "raw": 0.5936,
    "uncalibratedPUp": 0.5937,
    "base": 0.5963,
    "pUp": 0.6007
   },
   "50": {
    "n": 2972,
    "up": 1776,
    "raw": 0.5976,
    "uncalibratedPUp": 0.5976,
    "base": 0.5963,
    "pUp": 0.5976
   },
   "80": {
    "n": 2685,
    "up": 1696,
    "raw": 0.6317,
    "uncalibratedPUp": 0.6313,
    "base": 0.5963,
    "pUp": 0.6113
   },
   "30": {
    "n": 1551,
    "up": 866,
    "raw": 0.5583,
    "uncalibratedPUp": 0.5591,
    "base": 0.5963,
    "pUp": 0.5604
   },
   "90": {
    "n": 610,
    "up": 319,
    "raw": 0.523,
    "uncalibratedPUp": 0.5264,
    "base": 0.5963,
    "pUp": 0.6113
   },
   "60": {
    "n": 2439,
    "up": 1483,
    "raw": 0.608,
    "uncalibratedPUp": 0.6079,
    "base": 0.5963,
    "pUp": 0.6007
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.559,
    "base": 0.5963,
    "pUp": 0.5604
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5963,
    "base": 0.5963,
    "pUp": 0.5604
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5963,
    "base": 0.5963,
    "pUp": 0.5604
   }
  },
  "nova": {
   "50": {
    "n": 2522,
    "up": 1014,
    "raw": 0.4021,
    "uncalibratedPUp": 0.4029,
    "base": 0.4763,
    "pUp": 0.4384
   },
   "40": {
    "n": 4484,
    "up": 1829,
    "raw": 0.4079,
    "uncalibratedPUp": 0.4083,
    "base": 0.4763,
    "pUp": 0.4384
   },
   "30": {
    "n": 3522,
    "up": 1519,
    "raw": 0.4313,
    "uncalibratedPUp": 0.4317,
    "base": 0.4763,
    "pUp": 0.4384
   },
   "70": {
    "n": 54,
    "up": 8,
    "raw": 0.1481,
    "uncalibratedPUp": 0.2654,
    "base": 0.4763,
    "pUp": 0.6495
   },
   "60": {
    "n": 2577,
    "up": 1725,
    "raw": 0.6694,
    "uncalibratedPUp": 0.6672,
    "base": 0.4763,
    "pUp": 0.6495
   },
   "20": {
    "n": 1895,
    "up": 1078,
    "raw": 0.5689,
    "uncalibratedPUp": 0.5674,
    "base": 0.4763,
    "pUp": 0.4384
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.461,
    "base": 0.4763,
    "pUp": 0.6495
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4203,
    "base": 0.4763,
    "pUp": 0.6495
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4763,
    "base": 0.4763,
    "pUp": 0.4384
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4763,
    "base": 0.4763,
    "pUp": 0.4384
   }
  },
  "flow": {
   "50": {
    "n": 9603,
    "up": 4645,
    "raw": 0.4837,
    "uncalibratedPUp": 0.4837,
    "base": 0.4763,
    "pUp": 0.4837
   },
   "70": {
    "n": 205,
    "up": 116,
    "raw": 0.5659,
    "uncalibratedPUp": 0.5544,
    "base": 0.4763,
    "pUp": 0.5364
   },
   "40": {
    "n": 4057,
    "up": 1839,
    "raw": 0.4533,
    "uncalibratedPUp": 0.4535,
    "base": 0.4763,
    "pUp": 0.4535
   },
   "30": {
    "n": 461,
    "up": 184,
    "raw": 0.3991,
    "uncalibratedPUp": 0.4038,
    "base": 0.4763,
    "pUp": 0.4237
   },
   "60": {
    "n": 636,
    "up": 345,
    "raw": 0.5425,
    "uncalibratedPUp": 0.5395,
    "base": 0.4763,
    "pUp": 0.5364
   },
   "20": {
    "n": 88,
    "up": 40,
    "raw": 0.4545,
    "uncalibratedPUp": 0.4601,
    "base": 0.4763,
    "pUp": 0.4237
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4083,
    "base": 0.4763,
    "pUp": 0.5364
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5379,
    "base": 0.4763,
    "pUp": 0.4237
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4763,
    "base": 0.4763,
    "pUp": 0.4237
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4763,
    "base": 0.4763,
    "pUp": 0.5364
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 6903,
   "errorCorr": -0.109
  },
  "taro:nova": {
   "n": 7619,
   "errorCorr": 0.189
  },
  "taro:flow": {
   "n": 1757,
   "errorCorr": 0.255
  },
  "diana:nova": {
   "n": 5676,
   "errorCorr": -0.061
  },
  "diana:flow": {
   "n": 1140,
   "errorCorr": 0.115
  },
  "nova:flow": {
   "n": 1408,
   "errorCorr": -0.082
  }
 },
 "redundancyFactor": {
  "taro": 0.9914,
  "diana": 1,
  "nova": 0.9977,
  "flow": 0.9937
 },
 "regimes": {
  "up_high": {
   "n": 5012,
   "blend": 0.6,
   "weights": {
    "taro": 0.3229,
    "diana": 0.1141,
    "nova": 0.2177,
    "flow": 0.3453
   },
   "acc": {
    "taro": {
     "n": 1824,
     "adjustedAcc": 58.9
    },
    "diana": {
     "n": 1526,
     "adjustedAcc": 49.2
    },
    "nova": {
     "n": 1319,
     "adjustedAcc": 35.1
    },
    "flow": {
     "n": 343,
     "adjustedAcc": 62.3
    }
   }
  },
  "up_low": {
   "n": 4241,
   "blend": 0.6,
   "weights": {
    "taro": 0.3145,
    "diana": 0.1162,
    "nova": 0.2707,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 1791,
     "adjustedAcc": 55.2
    },
    "diana": {
     "n": 1442,
     "adjustedAcc": 49.1
    },
    "nova": {
     "n": 679,
     "adjustedAcc": 53.0
    },
    "flow": {
     "n": 329,
     "adjustedAcc": 48.8
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2566,
    "diana": 0.1379,
    "nova": 0.3027,
    "flow": 0.3027
   },
   "acc": {
    "taro": {
     "n": 4244,
     "adjustedAcc": 40.3
    },
    "diana": {
     "n": 3504,
     "adjustedAcc": 65.9
    },
    "nova": {
     "n": 3925,
     "adjustedAcc": 64.9
    },
    "flow": {
     "n": 768,
     "adjustedAcc": 52.9
    }
   }
  },
  "side_high": {
   "n": 5233,
   "blend": 0.6,
   "weights": {
    "taro": 0.3128,
    "diana": 0.1127,
    "nova": 0.2887,
    "flow": 0.2858
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
    "taro": 0.3033,
    "diana": 0.1326,
    "nova": 0.2266,
    "flow": 0.3376
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
  "key": "up_low",
  "trend": "up",
  "vol": "low",
  "median5": 1.02,
  "medianAbs1": 1.2,
  "advanceRatio5": 57.3,
  "medianRet1": 0.26,
  "advanceRatio1": 54.6
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 24348,
  "days": 47,
  "guardedN": 295,
  "baseline": {
   "hit": 12727,
   "miss": 10708,
   "mid": 913,
   "accuracy": 54.3
  },
  "guarded": {
   "hit": 12723,
   "miss": 10727,
   "mid": 898,
   "accuracy": 54.3
  },
  "active": true,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 6581,
  "errors": 2375,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2120
   },
   {
    "label": "분석가 의견충돌",
    "count": 1332
   },
   {
    "label": "고변동성 국면",
    "count": 786
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 100
   }
  ],
  "analystErrors": {
   "taro": 1255,
   "diana": 0,
   "nova": 154,
   "flow": 312
  },
  "regimeErrors": {
   "down_high": 786,
   "side_low": 624,
   "up_low": 557,
   "down_low": 408
  }
 },
 "shadow": {
  "n": 6581,
  "baselineActionN": 1435,
  "baselineActionPrecision": 49.4,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 6581,
   "SELL": 0
  },
  "testDays": 11,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2504,
  "rawBrier": 0.2587
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
     "n": 367,
     "hit": 154,
     "raw": 0.4196,
     "uncalibratedAcc": 0.4189,
     "base": 0.4053,
     "calibratedAcc": 0.4189
    },
    "60": {
     "n": 323,
     "hit": 117,
     "raw": 0.3622,
     "uncalibratedAcc": 0.3647,
     "base": 0.4053,
     "calibratedAcc": 0.3647
    },
    "70": {
     "n": 128,
     "hit": 58,
     "raw": 0.4531,
     "uncalibratedAcc": 0.4467,
     "base": 0.4053,
     "calibratedAcc": 0.4467
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.5041,
     "base": 0.4053,
     "calibratedAcc": 0.5041
    }
   },
   "SELL": {
    "40": {
     "n": 2287,
     "hit": 1235,
     "raw": 0.54,
     "uncalibratedAcc": 0.54,
     "base": 0.5341,
     "calibratedAcc": 0.54
    },
    "45": {
     "n": 1120,
     "hit": 531,
     "raw": 0.4741,
     "uncalibratedAcc": 0.4752,
     "base": 0.5341,
     "calibratedAcc": 0.4752
    },
    "35": {
     "n": 1429,
     "hit": 863,
     "raw": 0.6039,
     "uncalibratedAcc": 0.603,
     "base": 0.5341,
     "calibratedAcc": 0.5589
    },
    "30": {
     "n": 533,
     "hit": 274,
     "raw": 0.5141,
     "uncalibratedAcc": 0.5148,
     "base": 0.5341,
     "calibratedAcc": 0.5589
    },
    "25": {
     "n": 80,
     "hit": 17,
     "raw": 0.2125,
     "uncalibratedAcc": 0.2768,
     "base": 0.5341,
     "calibratedAcc": 0.5589
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3476,
     "base": 0.5341,
     "calibratedAcc": 0.5589
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5087,
     "base": 0.5341,
     "calibratedAcc": 0.5589
    }
   }
  },
  "evaluation": {
   "n": 1435,
   "buyN": 357,
   "sellN": 1078,
   "testDays": 11,
   "testRegimes": 4,
   "candidate": {
    "n": 1435,
    "tierSpreadPp": 16.1,
    "corr": 0.0871,
    "ci95": {
     "lowPp": -12.0,
     "highPp": 31.8,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1435,
    "tierSpreadPp": 4.2,
    "corr": 0.0473,
    "ci95": {
     "lowPp": -4.2,
     "highPp": 14.5,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     49,
     54
    ],
    "candidateRangeSell": [
     56,
     61
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 357,
     "tierSpreadPp": -6.7
    },
    "candidateWithinSell": {
     "n": 1078,
     "tierSpreadPp": -4.2
    },
    "baselineWithinBuy": {
     "n": 357,
     "tierSpreadPp": -15.1
    },
    "baselineWithinSell": {
     "n": 1078,
     "tierSpreadPp": 4.5
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 52,
   "trainDays": 31,
   "embargoDays": 5,
   "holdoutDays": 16,
   "holdoutSharePct": 30.8,
   "estimatedTotalDaysForGate": 189,
   "isProspective": false
  },
  "prospective": {
   "type": "PROSPECTIVE_ARCHIVED",
   "note": "그날 미리 기록해 둔 확신도 후보값만으로 채점한다. 나중에 만든 교정표를 과거에 적용하지 않으므로 검증일이 실제로 하루씩 쌓인다.",
   "n": 0,
   "testDays": 0,
   "firstDay": null,
   "lastDay": null,
   "buyN": 0,
   "sellN": 0,
   "tierSpreadPp": null,
   "tierSpreadWithinBuyPp": null,
   "tierSpreadWithinSellPp": null,
   "clockStarted": false,
   "daysRemainingToGate": 40
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 판별력 95% 구간(-12.0~31.8pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY -6.7pp · SELL -4.2pp)",
    "사전 기록 기반 검증일 0일 / 40일 (기록 시작 전)"
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
