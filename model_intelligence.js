// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-07 14:03",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2018,
    "up": 1086,
    "raw": 0.5382,
    "uncalibratedPUp": 0.5373,
    "base": 0.4827,
    "pUp": 0.5063
   },
   "20": {
    "n": 1016,
    "up": 488,
    "raw": 0.4803,
    "uncalibratedPUp": 0.4804,
    "base": 0.4827,
    "pUp": 0.4582
   },
   "40": {
    "n": 2325,
    "up": 1207,
    "raw": 0.5191,
    "uncalibratedPUp": 0.5187,
    "base": 0.4827,
    "pUp": 0.5063
   },
   "30": {
    "n": 2601,
    "up": 1168,
    "raw": 0.4491,
    "uncalibratedPUp": 0.4494,
    "base": 0.4827,
    "pUp": 0.4582
   },
   "70": {
    "n": 837,
    "up": 418,
    "raw": 0.4994,
    "uncalibratedPUp": 0.4988,
    "base": 0.4827,
    "pUp": 0.5063
   },
   "80": {
    "n": 701,
    "up": 272,
    "raw": 0.388,
    "uncalibratedPUp": 0.3919,
    "base": 0.4827,
    "pUp": 0.5063
   },
   "60": {
    "n": 1651,
    "up": 866,
    "raw": 0.5245,
    "uncalibratedPUp": 0.5238,
    "base": 0.4827,
    "pUp": 0.5063
   },
   "10": {
    "n": 3204,
    "up": 1449,
    "raw": 0.4522,
    "uncalibratedPUp": 0.4525,
    "base": 0.4827,
    "pUp": 0.4528
   },
   "90": {
    "n": 204,
    "up": 72,
    "raw": 0.3529,
    "uncalibratedPUp": 0.3696,
    "base": 0.4827,
    "pUp": 0.5063
   },
   "0": {
    "n": 2,
    "up": 1,
    "raw": 0.5,
    "uncalibratedPUp": 0.4837,
    "base": 0.4827,
    "pUp": 0.4528
   }
  },
  "diana": {
   "40": {
    "n": 2110,
    "up": 1273,
    "raw": 0.6033,
    "uncalibratedPUp": 0.6034,
    "base": 0.6088,
    "pUp": 0.6034
   },
   "70": {
    "n": 2338,
    "up": 1418,
    "raw": 0.6065,
    "uncalibratedPUp": 0.6065,
    "base": 0.6088,
    "pUp": 0.6148
   },
   "50": {
    "n": 2772,
    "up": 1688,
    "raw": 0.6089,
    "uncalibratedPUp": 0.6089,
    "base": 0.6088,
    "pUp": 0.6089
   },
   "80": {
    "n": 2526,
    "up": 1615,
    "raw": 0.6394,
    "uncalibratedPUp": 0.639,
    "base": 0.6088,
    "pUp": 0.6188
   },
   "30": {
    "n": 1444,
    "up": 831,
    "raw": 0.5755,
    "uncalibratedPUp": 0.5762,
    "base": 0.6088,
    "pUp": 0.5773
   },
   "90": {
    "n": 579,
    "up": 307,
    "raw": 0.5302,
    "uncalibratedPUp": 0.5341,
    "base": 0.6088,
    "pUp": 0.6188
   },
   "60": {
    "n": 2279,
    "up": 1421,
    "raw": 0.6235,
    "uncalibratedPUp": 0.6233,
    "base": 0.6088,
    "pUp": 0.6148
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5707,
    "base": 0.6088,
    "pUp": 0.5773
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6088,
    "base": 0.6088,
    "pUp": 0.5773
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6088,
    "base": 0.6088,
    "pUp": 0.5773
   }
  },
  "nova": {
   "50": {
    "n": 2259,
    "up": 936,
    "raw": 0.4143,
    "uncalibratedPUp": 0.4152,
    "base": 0.4827,
    "pUp": 0.4446
   },
   "40": {
    "n": 4254,
    "up": 1764,
    "raw": 0.4147,
    "uncalibratedPUp": 0.4151,
    "base": 0.4827,
    "pUp": 0.4446
   },
   "30": {
    "n": 3518,
    "up": 1517,
    "raw": 0.4312,
    "uncalibratedPUp": 0.4316,
    "base": 0.4827,
    "pUp": 0.4446
   },
   "70": {
    "n": 54,
    "up": 8,
    "raw": 0.1481,
    "uncalibratedPUp": 0.2676,
    "base": 0.4827,
    "pUp": 0.6498
   },
   "60": {
    "n": 2577,
    "up": 1725,
    "raw": 0.6694,
    "uncalibratedPUp": 0.6672,
    "base": 0.4827,
    "pUp": 0.6498
   },
   "20": {
    "n": 1892,
    "up": 1077,
    "raw": 0.5692,
    "uncalibratedPUp": 0.5679,
    "base": 0.4827,
    "pUp": 0.4446
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4671,
    "base": 0.4827,
    "pUp": 0.6498
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4259,
    "base": 0.4827,
    "pUp": 0.6498
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4827,
    "base": 0.4827,
    "pUp": 0.4446
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4827,
    "base": 0.4827,
    "pUp": 0.4446
   }
  },
  "flow": {
   "50": {
    "n": 9291,
    "up": 4563,
    "raw": 0.4911,
    "uncalibratedPUp": 0.4911,
    "base": 0.4827,
    "pUp": 0.4911
   },
   "70": {
    "n": 196,
    "up": 112,
    "raw": 0.5714,
    "uncalibratedPUp": 0.5596,
    "base": 0.4827,
    "pUp": 0.5407
   },
   "40": {
    "n": 3910,
    "up": 1793,
    "raw": 0.4586,
    "uncalibratedPUp": 0.4588,
    "base": 0.4827,
    "pUp": 0.4588
   },
   "30": {
    "n": 445,
    "up": 176,
    "raw": 0.3955,
    "uncalibratedPUp": 0.401,
    "base": 0.4827,
    "pUp": 0.4228
   },
   "60": {
    "n": 622,
    "up": 340,
    "raw": 0.5466,
    "uncalibratedPUp": 0.5437,
    "base": 0.4827,
    "pUp": 0.5407
   },
   "20": {
    "n": 86,
    "up": 39,
    "raw": 0.4535,
    "uncalibratedPUp": 0.461,
    "base": 0.4827,
    "pUp": 0.4228
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4137,
    "base": 0.4827,
    "pUp": 0.5407
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5435,
    "base": 0.4827,
    "pUp": 0.4228
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4827,
    "base": 0.4827,
    "pUp": 0.4228
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4827,
    "base": 0.4827,
    "pUp": 0.5407
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 6436,
   "errorCorr": -0.136
  },
  "taro:nova": {
   "n": 7617,
   "errorCorr": 0.188
  },
  "taro:flow": {
   "n": 1706,
   "errorCorr": 0.251
  },
  "diana:nova": {
   "n": 5664,
   "errorCorr": -0.061
  },
  "diana:flow": {
   "n": 1068,
   "errorCorr": 0.125
  },
  "nova:flow": {
   "n": 1407,
   "errorCorr": -0.083
  }
 },
 "redundancyFactor": {
  "taro": 0.9916,
  "diana": 1,
  "nova": 0.9977,
  "flow": 0.9939
 },
 "regimes": {
  "up_high": {
   "n": 4715,
   "blend": 0.6,
   "weights": {
    "taro": 0.3234,
    "diana": 0.1127,
    "nova": 0.2148,
    "flow": 0.3491
   },
   "acc": {
    "taro": {
     "n": 1824,
     "adjustedAcc": 58.9
    },
    "diana": {
     "n": 1229,
     "adjustedAcc": 49.0
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
   "n": 3491,
   "blend": 0.6,
   "weights": {
    "taro": 0.3346,
    "diana": 0.1117,
    "nova": 0.2584,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 1408,
     "adjustedAcc": 62.8
    },
    "diana": {
     "n": 1142,
     "adjustedAcc": 49.5
    },
    "nova": {
     "n": 675,
     "adjustedAcc": 53.1
    },
    "flow": {
     "n": 266,
     "adjustedAcc": 49.7
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2575,
    "diana": 0.1367,
    "nova": 0.2993,
    "flow": 0.3066
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
    "taro": 0.3138,
    "diana": 0.1116,
    "nova": 0.2853,
    "flow": 0.2893
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
    "taro": 0.3039,
    "diana": 0.1312,
    "nova": 0.2236,
    "flow": 0.3413
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
  "median5": -1.19,
  "medianAbs1": 1.19,
  "advanceRatio5": 36.7,
  "medianRet1": 0.38,
  "advanceRatio1": 59.6
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 23150,
  "days": 45,
  "guardedN": 295,
  "baseline": {
   "hit": 12074,
   "miss": 10219,
   "mid": 857,
   "accuracy": 54.2
  },
  "guarded": {
   "hit": 12070,
   "miss": 10238,
   "mid": 842,
   "accuracy": 54.1
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 5981,
  "errors": 2058,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 1890
   },
   {
    "label": "분석가 의견충돌",
    "count": 1138
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 77
   }
  ],
  "analystErrors": {
   "taro": 1027,
   "diana": 0,
   "nova": 151,
   "flow": 270
  },
  "regimeErrors": {
   "down_high": 696,
   "up_low": 556,
   "down_low": 408,
   "side_low": 398
  }
 },
 "shadow": {
  "n": 5981,
  "baselineActionN": 1159,
  "baselineActionPrecision": 55.1,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 5981,
   "SELL": 0
  },
  "testDays": 10,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2501,
  "rawBrier": 0.2556
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
     "n": 337,
     "hit": 148,
     "raw": 0.4392,
     "uncalibratedAcc": 0.4384,
     "base": 0.425,
     "calibratedAcc": 0.4384
    },
    "60": {
     "n": 284,
     "hit": 110,
     "raw": 0.3873,
     "uncalibratedAcc": 0.3898,
     "base": 0.425,
     "calibratedAcc": 0.3898
    },
    "70": {
     "n": 126,
     "hit": 57,
     "raw": 0.4524,
     "uncalibratedAcc": 0.4486,
     "base": 0.425,
     "calibratedAcc": 0.4486
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.5192,
     "base": 0.425,
     "calibratedAcc": 0.5192
    }
   },
   "SELL": {
    "40": {
     "n": 2260,
     "hit": 1222,
     "raw": 0.5407,
     "uncalibratedAcc": 0.5407,
     "base": 0.5348,
     "calibratedAcc": 0.5407
    },
    "45": {
     "n": 1107,
     "hit": 525,
     "raw": 0.4743,
     "uncalibratedAcc": 0.4753,
     "base": 0.5348,
     "calibratedAcc": 0.4753
    },
    "35": {
     "n": 1423,
     "hit": 860,
     "raw": 0.6044,
     "uncalibratedAcc": 0.6034,
     "base": 0.5348,
     "calibratedAcc": 0.5596
    },
    "30": {
     "n": 533,
     "hit": 274,
     "raw": 0.5141,
     "uncalibratedAcc": 0.5148,
     "base": 0.5348,
     "calibratedAcc": 0.5596
    },
    "25": {
     "n": 78,
     "hit": 17,
     "raw": 0.2179,
     "uncalibratedAcc": 0.2826,
     "base": 0.5348,
     "calibratedAcc": 0.5596
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3478,
     "base": 0.5348,
     "calibratedAcc": 0.5596
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5093,
     "base": 0.5348,
     "calibratedAcc": 0.5596
    }
   }
  },
  "evaluation": {
   "n": 1159,
   "buyN": 278,
   "sellN": 881,
   "testDays": 10,
   "testRegimes": 4,
   "candidate": {
    "n": 1159,
    "tierSpreadPp": 23.8,
    "corr": 0.0897,
    "ci95": {
     "lowPp": -12.8,
     "highPp": 33.2,
     "includesZero": true,
     "decisionDays": 10,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1159,
    "tierSpreadPp": 4.7,
    "corr": 0.0445,
    "ci95": {
     "lowPp": -5.7,
     "highPp": 15.9,
     "includesZero": true,
     "decisionDays": 10,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     50,
     54
    ],
    "candidateRangeSell": [
     56,
     61
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 278,
     "tierSpreadPp": -6.5
    },
    "candidateWithinSell": {
     "n": 881,
     "tierSpreadPp": 8.5
    },
    "baselineWithinBuy": {
     "n": 278,
     "tierSpreadPp": -16.3
    },
    "baselineWithinSell": {
     "n": 881,
     "tierSpreadPp": 3.4
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 50,
   "trainDays": 30,
   "embargoDays": 5,
   "holdoutDays": 15,
   "holdoutSharePct": 30.0,
   "estimatedTotalDaysForGate": 200,
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
    "후보 판별력 95% 구간(-12.8~33.2pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY -6.5pp · SELL 8.5pp)",
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
