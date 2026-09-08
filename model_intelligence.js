// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-08 16:06",
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
    "n": 2192,
    "up": 1305,
    "raw": 0.5953,
    "uncalibratedPUp": 0.5954,
    "base": 0.6025,
    "pUp": 0.5954
   },
   "70": {
    "n": 2429,
    "up": 1459,
    "raw": 0.6007,
    "uncalibratedPUp": 0.6007,
    "base": 0.6025,
    "pUp": 0.6078
   },
   "50": {
    "n": 2872,
    "up": 1731,
    "raw": 0.6027,
    "uncalibratedPUp": 0.6027,
    "base": 0.6025,
    "pUp": 0.6027
   },
   "80": {
    "n": 2605,
    "up": 1657,
    "raw": 0.6361,
    "uncalibratedPUp": 0.6357,
    "base": 0.6025,
    "pUp": 0.616
   },
   "30": {
    "n": 1497,
    "up": 848,
    "raw": 0.5665,
    "uncalibratedPUp": 0.5672,
    "base": 0.6025,
    "pUp": 0.5684
   },
   "90": {
    "n": 595,
    "up": 315,
    "raw": 0.5294,
    "uncalibratedPUp": 0.5329,
    "base": 0.6025,
    "pUp": 0.616
   },
   "60": {
    "n": 2360,
    "up": 1452,
    "raw": 0.6153,
    "uncalibratedPUp": 0.6151,
    "base": 0.6025,
    "pUp": 0.6078
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5648,
    "base": 0.6025,
    "pUp": 0.5684
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6025,
    "base": 0.6025,
    "pUp": 0.5684
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6025,
    "base": 0.6025,
    "pUp": 0.5684
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
   "n": 6671,
   "errorCorr": -0.124
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
   "n": 5674,
   "errorCorr": -0.06
  },
  "diana:flow": {
   "n": 1108,
   "errorCorr": 0.122
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
   "n": 5012,
   "blend": 0.6,
   "weights": {
    "taro": 0.3238,
    "diana": 0.1132,
    "nova": 0.2144,
    "flow": 0.3486
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
   "n": 3495,
   "blend": 0.6,
   "weights": {
    "taro": 0.335,
    "diana": 0.1125,
    "nova": 0.2578,
    "flow": 0.2948
   },
   "acc": {
    "taro": {
     "n": 1408,
     "adjustedAcc": 62.8
    },
    "diana": {
     "n": 1146,
     "adjustedAcc": 49.8
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
    "taro": 0.2579,
    "diana": 0.1371,
    "nova": 0.2987,
    "flow": 0.3063
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
    "taro": 0.3143,
    "diana": 0.112,
    "nova": 0.2847,
    "flow": 0.289
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
    "taro": 0.3043,
    "diana": 0.1316,
    "nova": 0.2232,
    "flow": 0.3409
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
  "median5": -1.88,
  "medianAbs1": 1.5,
  "advanceRatio5": 30.7,
  "medianRet1": -1.02,
  "advanceRatio1": 24.9
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 23749,
  "days": 46,
  "guardedN": 295,
  "baseline": {
   "hit": 12417,
   "miss": 10446,
   "mid": 886,
   "accuracy": 54.3
  },
  "guarded": {
   "hit": 12413,
   "miss": 10465,
   "mid": 871,
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
  "matured": 6580,
  "errors": 2285,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2094
   },
   {
    "label": "분석가 의견충돌",
    "count": 1271
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 94
   }
  ],
  "analystErrors": {
   "taro": 1174,
   "diana": 0,
   "nova": 163,
   "flow": 302
  },
  "regimeErrors": {
   "down_high": 696,
   "side_low": 624,
   "up_low": 557,
   "down_low": 408
  }
 },
 "shadow": {
  "n": 6580,
  "baselineActionN": 1331,
  "baselineActionPrecision": 53.9,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 6580,
   "SELL": 0
  },
  "testDays": 11,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.25,
  "rawBrier": 0.2576
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
   "n": 1331,
   "buyN": 349,
   "sellN": 982,
   "testDays": 11,
   "testRegimes": 4,
   "candidate": {
    "n": 1331,
    "tierSpreadPp": 23.7,
    "corr": 0.1281,
    "ci95": {
     "lowPp": -10.2,
     "highPp": 35.2,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1331,
    "tierSpreadPp": 4.3,
    "corr": 0.0433,
    "ci95": {
     "lowPp": -4.7,
     "highPp": 14.8,
     "includesZero": true,
     "decisionDays": 11,
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
     "n": 349,
     "tierSpreadPp": -2.6
    },
    "candidateWithinSell": {
     "n": 982,
     "tierSpreadPp": 4.3
    },
    "baselineWithinBuy": {
     "n": 349,
     "tierSpreadPp": -12.9
    },
    "baselineWithinSell": {
     "n": 982,
     "tierSpreadPp": 1.2
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 51,
   "trainDays": 30,
   "embargoDays": 5,
   "holdoutDays": 16,
   "holdoutSharePct": 31.4,
   "estimatedTotalDaysForGate": 185,
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
    "후보 판별력 95% 구간(-10.2~35.2pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY -2.6pp · SELL 4.3pp)",
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
