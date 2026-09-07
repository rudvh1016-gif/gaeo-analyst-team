// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-07 10:03",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 1968,
    "up": 1061,
    "raw": 0.5391,
    "uncalibratedPUp": 0.5383,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "20": {
    "n": 1009,
    "up": 485,
    "raw": 0.4807,
    "uncalibratedPUp": 0.4808,
    "base": 0.4853,
    "pUp": 0.4572
   },
   "40": {
    "n": 2292,
    "up": 1183,
    "raw": 0.5161,
    "uncalibratedPUp": 0.5157,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "30": {
    "n": 2582,
    "up": 1155,
    "raw": 0.4473,
    "uncalibratedPUp": 0.4478,
    "base": 0.4853,
    "pUp": 0.4572
   },
   "70": {
    "n": 749,
    "up": 384,
    "raw": 0.5127,
    "uncalibratedPUp": 0.5116,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "80": {
    "n": 579,
    "up": 242,
    "raw": 0.418,
    "uncalibratedPUp": 0.4213,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "60": {
    "n": 1518,
    "up": 805,
    "raw": 0.5303,
    "uncalibratedPUp": 0.5294,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "10": {
    "n": 3191,
    "up": 1444,
    "raw": 0.4525,
    "uncalibratedPUp": 0.4528,
    "base": 0.4853,
    "pUp": 0.4531
   },
   "90": {
    "n": 168,
    "up": 62,
    "raw": 0.369,
    "uncalibratedPUp": 0.3867,
    "base": 0.4853,
    "pUp": 0.5131
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4531
   }
  },
  "diana": {
   "40": {
    "n": 2110,
    "up": 1275,
    "raw": 0.6043,
    "uncalibratedPUp": 0.6043,
    "base": 0.6087,
    "pUp": 0.6043
   },
   "70": {
    "n": 2338,
    "up": 1417,
    "raw": 0.6061,
    "uncalibratedPUp": 0.6061,
    "base": 0.6087,
    "pUp": 0.6142
   },
   "50": {
    "n": 2772,
    "up": 1690,
    "raw": 0.6097,
    "uncalibratedPUp": 0.6097,
    "base": 0.6087,
    "pUp": 0.6097
   },
   "80": {
    "n": 2526,
    "up": 1613,
    "raw": 0.6386,
    "uncalibratedPUp": 0.6382,
    "base": 0.6087,
    "pUp": 0.6182
   },
   "30": {
    "n": 1444,
    "up": 831,
    "raw": 0.5755,
    "uncalibratedPUp": 0.5762,
    "base": 0.6087,
    "pUp": 0.5773
   },
   "90": {
    "n": 579,
    "up": 307,
    "raw": 0.5302,
    "uncalibratedPUp": 0.5341,
    "base": 0.6087,
    "pUp": 0.6182
   },
   "60": {
    "n": 2279,
    "up": 1419,
    "raw": 0.6226,
    "uncalibratedPUp": 0.6225,
    "base": 0.6087,
    "pUp": 0.6142
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5706,
    "base": 0.6087,
    "pUp": 0.5773
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6087,
    "base": 0.6087,
    "pUp": 0.5773
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.6087,
    "base": 0.6087,
    "pUp": 0.5773
   }
  },
  "nova": {
   "50": {
    "n": 1992,
    "up": 848,
    "raw": 0.4257,
    "uncalibratedPUp": 0.4266,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "40": {
    "n": 4041,
    "up": 1665,
    "raw": 0.412,
    "uncalibratedPUp": 0.4126,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "30": {
    "n": 3502,
    "up": 1503,
    "raw": 0.4292,
    "uncalibratedPUp": 0.4297,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "70": {
    "n": 53,
    "up": 7,
    "raw": 0.1321,
    "uncalibratedPUp": 0.2597,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "60": {
    "n": 2575,
    "up": 1723,
    "raw": 0.6691,
    "uncalibratedPUp": 0.667,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "20": {
    "n": 1888,
    "up": 1075,
    "raw": 0.5694,
    "uncalibratedPUp": 0.5681,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4696,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4282,
    "base": 0.4853,
    "pUp": 0.6496
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4463
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4463
   }
  },
  "flow": {
   "50": {
    "n": 9001,
    "up": 4450,
    "raw": 0.4944,
    "uncalibratedPUp": 0.4944,
    "base": 0.4853,
    "pUp": 0.4944
   },
   "70": {
    "n": 186,
    "up": 105,
    "raw": 0.5645,
    "uncalibratedPUp": 0.5535,
    "base": 0.4853,
    "pUp": 0.5442
   },
   "40": {
    "n": 3742,
    "up": 1721,
    "raw": 0.4599,
    "uncalibratedPUp": 0.4601,
    "base": 0.4853,
    "pUp": 0.4601
   },
   "30": {
    "n": 426,
    "up": 167,
    "raw": 0.392,
    "uncalibratedPUp": 0.3982,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "60": {
    "n": 610,
    "up": 338,
    "raw": 0.5541,
    "uncalibratedPUp": 0.5509,
    "base": 0.4853,
    "pUp": 0.5442
   },
   "20": {
    "n": 82,
    "up": 36,
    "raw": 0.439,
    "uncalibratedPUp": 0.4514,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4159,
    "base": 0.4853,
    "pUp": 0.5442
   },
   "10": {
    "n": 4,
    "up": 4,
    "raw": 1.0,
    "uncalibratedPUp": 0.5458,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.4197
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4853,
    "base": 0.4853,
    "pUp": 0.5442
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 6434,
   "errorCorr": -0.135
  },
  "taro:nova": {
   "n": 7599,
   "errorCorr": 0.186
  },
  "taro:flow": {
   "n": 1643,
   "errorCorr": 0.252
  },
  "diana:nova": {
   "n": 5664,
   "errorCorr": -0.061
  },
  "diana:flow": {
   "n": 1071,
   "errorCorr": 0.124
  },
  "nova:flow": {
   "n": 1398,
   "errorCorr": -0.091
  }
 },
 "redundancyFactor": {
  "taro": 0.9917,
  "diana": 1,
  "nova": 0.9978,
  "flow": 0.9939
 },
 "regimes": {
  "up_high": {
   "n": 4246,
   "blend": 0.6,
   "weights": {
    "taro": 0.3321,
    "diana": 0.1082,
    "nova": 0.208,
    "flow": 0.3517
   },
   "acc": {
    "taro": {
     "n": 1449,
     "adjustedAcc": 64.7
    },
    "diana": {
     "n": 1229,
     "adjustedAcc": 49.0
    },
    "nova": {
     "n": 1299,
     "adjustedAcc": 35.3
    },
    "flow": {
     "n": 269,
     "adjustedAcc": 66.3
    }
   }
  },
  "up_low": {
   "n": 3487,
   "blend": 0.6,
   "weights": {
    "taro": 0.3342,
    "diana": 0.1111,
    "nova": 0.2588,
    "flow": 0.2959
   },
   "acc": {
    "taro": {
     "n": 1408,
     "adjustedAcc": 62.8
    },
    "diana": {
     "n": 1138,
     "adjustedAcc": 49.0
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
    "taro": 0.2569,
    "diana": 0.1365,
    "nova": 0.2995,
    "flow": 0.3071
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
    "taro": 0.3132,
    "diana": 0.1115,
    "nova": 0.2855,
    "flow": 0.2898
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
    "taro": 0.3032,
    "diana": 0.1311,
    "nova": 0.2238,
    "flow": 0.3419
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
  "median5": -1.17,
  "medianAbs1": 1.08,
  "advanceRatio5": 35.4,
  "medianRet1": 0.5,
  "advanceRatio1": 61.1
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
   "hit": 12069,
   "miss": 10217,
   "mid": 864,
   "accuracy": 54.2
  },
  "guarded": {
   "hit": 12065,
   "miss": 10236,
   "mid": 849,
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
  "matured": 6579,
  "errors": 2378,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2203
   },
   {
    "label": "분석가 의견충돌",
    "count": 1330
   },
   {
    "label": "고변동성 국면",
    "count": 696
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 86
   }
  ],
  "analystErrors": {
   "taro": 1280,
   "diana": 0,
   "nova": 165,
   "flow": 293
  },
  "regimeErrors": {
   "down_high": 696,
   "up_low": 554,
   "down_low": 408,
   "side_low": 398,
   "unknown": 322
  }
 },
 "shadow": {
  "n": 6579,
  "baselineActionN": 1244,
  "baselineActionPrecision": 54.5,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 6579,
   "SELL": 0
  },
  "testDays": 11,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2498,
  "rawBrier": 0.2597
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
     "n": 317,
     "hit": 140,
     "raw": 0.4416,
     "uncalibratedAcc": 0.4411,
     "base": 0.4331,
     "calibratedAcc": 0.4411
    },
    "60": {
     "n": 249,
     "hit": 102,
     "raw": 0.4096,
     "uncalibratedAcc": 0.4114,
     "base": 0.4331,
     "calibratedAcc": 0.4114
    },
    "70": {
     "n": 125,
     "hit": 56,
     "raw": 0.448,
     "uncalibratedAcc": 0.4459,
     "base": 0.4331,
     "calibratedAcc": 0.4459
    },
    "75": {
     "n": 4,
     "hit": 3,
     "raw": 0.75,
     "uncalibratedAcc": 0.4859,
     "base": 0.4331,
     "calibratedAcc": 0.4859
    }
   },
   "SELL": {
    "40": {
     "n": 2231,
     "hit": 1211,
     "raw": 0.5428,
     "uncalibratedAcc": 0.5428,
     "base": 0.5376,
     "calibratedAcc": 0.5428
    },
    "45": {
     "n": 1090,
     "hit": 517,
     "raw": 0.4743,
     "uncalibratedAcc": 0.4755,
     "base": 0.5376,
     "calibratedAcc": 0.4755
    },
    "35": {
     "n": 1410,
     "hit": 858,
     "raw": 0.6085,
     "uncalibratedAcc": 0.6075,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "30": {
     "n": 524,
     "hit": 272,
     "raw": 0.5191,
     "uncalibratedAcc": 0.5198,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "25": {
     "n": 75,
     "hit": 17,
     "raw": 0.2267,
     "uncalibratedAcc": 0.2921,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.349,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.512,
     "base": 0.5376,
     "calibratedAcc": 0.5644
    }
   }
  },
  "evaluation": {
   "n": 1244,
   "buyN": 329,
   "sellN": 915,
   "testDays": 11,
   "testRegimes": 4,
   "candidate": {
    "n": 1244,
    "tierSpreadPp": 20.5,
    "corr": 0.1247,
    "ci95": {
     "lowPp": -8.7,
     "highPp": 37.9,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1244,
    "tierSpreadPp": 4.8,
    "corr": 0.0491,
    "ci95": {
     "lowPp": -4.8,
     "highPp": 15.2,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     52,
     54
    ],
    "candidateRangeSell": [
     56,
     62
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 329,
     "tierSpreadPp": 8.3
    },
    "candidateWithinSell": {
     "n": 915,
     "tierSpreadPp": 7.2
    },
    "baselineWithinBuy": {
     "n": 329,
     "tierSpreadPp": -13.8
    },
    "baselineWithinSell": {
     "n": 915,
     "tierSpreadPp": 2.6
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 49,
   "trainDays": 29,
   "embargoDays": 5,
   "holdoutDays": 15,
   "holdoutSharePct": 30.6,
   "estimatedTotalDaysForGate": 178,
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
    "후보 판별력 95% 구간(-8.7~37.9pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
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
