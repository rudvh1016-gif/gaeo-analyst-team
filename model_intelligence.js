// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-10 13:41",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2129,
    "up": 1132,
    "raw": 0.5317,
    "uncalibratedPUp": 0.5309,
    "base": 0.4708,
    "pUp": 0.4836
   },
   "20": {
    "n": 1027,
    "up": 491,
    "raw": 0.4781,
    "uncalibratedPUp": 0.4779,
    "base": 0.4708,
    "pUp": 0.4573
   },
   "40": {
    "n": 2374,
    "up": 1231,
    "raw": 0.5185,
    "uncalibratedPUp": 0.5179,
    "base": 0.4708,
    "pUp": 0.4836
   },
   "30": {
    "n": 2631,
    "up": 1181,
    "raw": 0.4489,
    "uncalibratedPUp": 0.4491,
    "base": 0.4708,
    "pUp": 0.4573
   },
   "70": {
    "n": 994,
    "up": 453,
    "raw": 0.4557,
    "uncalibratedPUp": 0.4562,
    "base": 0.4708,
    "pUp": 0.4836
   },
   "80": {
    "n": 936,
    "up": 348,
    "raw": 0.3718,
    "uncalibratedPUp": 0.3749,
    "base": 0.4708,
    "pUp": 0.4836
   },
   "60": {
    "n": 1953,
    "up": 936,
    "raw": 0.4793,
    "uncalibratedPUp": 0.4791,
    "base": 0.4708,
    "pUp": 0.4836
   },
   "10": {
    "n": 3220,
    "up": 1453,
    "raw": 0.4512,
    "uncalibratedPUp": 0.4514,
    "base": 0.4708,
    "pUp": 0.4516
   },
   "90": {
    "n": 297,
    "up": 101,
    "raw": 0.3401,
    "uncalibratedPUp": 0.3521,
    "base": 0.4708,
    "pUp": 0.4836
   },
   "0": {
    "n": 2,
    "up": 1,
    "raw": 0.5,
    "uncalibratedPUp": 0.4726,
    "base": 0.4708,
    "pUp": 0.4516
   }
  },
  "diana": {
   "40": {
    "n": 2370,
    "up": 1390,
    "raw": 0.5865,
    "uncalibratedPUp": 0.5866,
    "base": 0.5915,
    "pUp": 0.5866
   },
   "70": {
    "n": 2599,
    "up": 1532,
    "raw": 0.5895,
    "uncalibratedPUp": 0.5895,
    "base": 0.5915,
    "pUp": 0.5954
   },
   "50": {
    "n": 3066,
    "up": 1822,
    "raw": 0.5943,
    "uncalibratedPUp": 0.5942,
    "base": 0.5915,
    "pUp": 0.5942
   },
   "80": {
    "n": 2765,
    "up": 1733,
    "raw": 0.6268,
    "uncalibratedPUp": 0.6264,
    "base": 0.5915,
    "pUp": 0.6067
   },
   "30": {
    "n": 1605,
    "up": 881,
    "raw": 0.5489,
    "uncalibratedPUp": 0.5497,
    "base": 0.5915,
    "pUp": 0.5512
   },
   "90": {
    "n": 629,
    "up": 327,
    "raw": 0.5199,
    "uncalibratedPUp": 0.5231,
    "base": 0.5915,
    "pUp": 0.6067
   },
   "60": {
    "n": 2518,
    "up": 1515,
    "raw": 0.6017,
    "uncalibratedPUp": 0.6015,
    "base": 0.5915,
    "pUp": 0.5954
   },
   "20": {
    "n": 2,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5545,
    "base": 0.5915,
    "pUp": 0.5512
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5915,
    "base": 0.5915,
    "pUp": 0.5512
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5915,
    "base": 0.5915,
    "pUp": 0.5512
   }
  },
  "nova": {
   "50": {
    "n": 2901,
    "up": 1138,
    "raw": 0.3923,
    "uncalibratedPUp": 0.3931,
    "base": 0.4708,
    "pUp": 0.4332
   },
   "40": {
    "n": 4596,
    "up": 1855,
    "raw": 0.4036,
    "uncalibratedPUp": 0.404,
    "base": 0.4708,
    "pUp": 0.4332
   },
   "30": {
    "n": 3528,
    "up": 1520,
    "raw": 0.4308,
    "uncalibratedPUp": 0.4312,
    "base": 0.4708,
    "pUp": 0.4332
   },
   "70": {
    "n": 56,
    "up": 10,
    "raw": 0.1786,
    "uncalibratedPUp": 0.2805,
    "base": 0.4708,
    "pUp": 0.6491
   },
   "60": {
    "n": 2579,
    "up": 1725,
    "raw": 0.6689,
    "uncalibratedPUp": 0.6666,
    "base": 0.4708,
    "pUp": 0.6491
   },
   "20": {
    "n": 1898,
    "up": 1079,
    "raw": 0.5685,
    "uncalibratedPUp": 0.567,
    "base": 0.4708,
    "pUp": 0.4332
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4556,
    "base": 0.4708,
    "pUp": 0.6491
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4154,
    "base": 0.4708,
    "pUp": 0.6491
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4708,
    "base": 0.4708,
    "pUp": 0.4332
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4708,
    "base": 0.4708,
    "pUp": 0.4332
   }
  },
  "flow": {
   "50": {
    "n": 9874,
    "up": 4726,
    "raw": 0.4786,
    "uncalibratedPUp": 0.4786,
    "base": 0.4708,
    "pUp": 0.4786
   },
   "70": {
    "n": 211,
    "up": 116,
    "raw": 0.5498,
    "uncalibratedPUp": 0.5399,
    "base": 0.4708,
    "pUp": 0.531
   },
   "40": {
    "n": 4245,
    "up": 1896,
    "raw": 0.4466,
    "uncalibratedPUp": 0.4468,
    "base": 0.4708,
    "pUp": 0.4468
   },
   "30": {
    "n": 482,
    "up": 192,
    "raw": 0.3983,
    "uncalibratedPUp": 0.4026,
    "base": 0.4708,
    "pUp": 0.4221
   },
   "60": {
    "n": 648,
    "up": 350,
    "raw": 0.5401,
    "uncalibratedPUp": 0.5371,
    "base": 0.4708,
    "pUp": 0.531
   },
   "20": {
    "n": 93,
    "up": 42,
    "raw": 0.4516,
    "uncalibratedPUp": 0.4563,
    "base": 0.4708,
    "pUp": 0.4221
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4035,
    "base": 0.4708,
    "pUp": 0.531
   },
   "10": {
    "n": 5,
    "up": 5,
    "raw": 1.0,
    "uncalibratedPUp": 0.5464,
    "base": 0.4708,
    "pUp": 0.4221
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4708,
    "base": 0.4708,
    "pUp": 0.4221
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4708,
    "base": 0.4708,
    "pUp": 0.531
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 7140,
   "errorCorr": -0.097
  },
  "taro:nova": {
   "n": 7624,
   "errorCorr": 0.189
  },
  "taro:flow": {
   "n": 1813,
   "errorCorr": 0.242
  },
  "diana:nova": {
   "n": 5681,
   "errorCorr": -0.061
  },
  "diana:flow": {
   "n": 1179,
   "errorCorr": 0.114
  },
  "nova:flow": {
   "n": 1411,
   "errorCorr": -0.081
  }
 },
 "redundancyFactor": {
  "taro": 0.9921,
  "diana": 1,
  "nova": 0.9977,
  "flow": 0.9945
 },
 "regimes": {
  "up_high": {
   "n": 5012,
   "blend": 0.6,
   "weights": {
    "taro": 0.3234,
    "diana": 0.115,
    "nova": 0.2194,
    "flow": 0.3423
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
   "n": 4999,
   "blend": 0.6,
   "weights": {
    "taro": 0.3036,
    "diana": 0.118,
    "nova": 0.278,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 2168,
     "adjustedAcc": 50.9
    },
    "diana": {
     "n": 1749,
     "adjustedAcc": 48.6
    },
    "nova": {
     "n": 688,
     "adjustedAcc": 53.3
    },
    "flow": {
     "n": 394,
     "adjustedAcc": 48.9
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2567,
    "diana": 0.1388,
    "nova": 0.3048,
    "flow": 0.2997
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
    "taro": 0.3129,
    "diana": 0.1134,
    "nova": 0.2907,
    "flow": 0.283
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
    "taro": 0.3036,
    "diana": 0.1336,
    "nova": 0.2283,
    "flow": 0.3345
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
  "key": "side_low",
  "trend": "side",
  "vol": "low",
  "median5": 0.73,
  "medianAbs1": 1.19,
  "advanceRatio5": 56.8,
  "medianRet1": -0.25,
  "advanceRatio1": 40.2
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 24947,
  "days": 48,
  "guardedN": 295,
  "baseline": {
   "hit": 13025,
   "miss": 10975,
   "mid": 947,
   "accuracy": 54.3
  },
  "guarded": {
   "hit": 13021,
   "miss": 10994,
   "mid": 932,
   "accuracy": 54.2
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 6582,
  "errors": 2451,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2126
   },
   {
    "label": "분석가 의견충돌",
    "count": 1383
   },
   {
    "label": "고변동성 국면",
    "count": 601
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 106
   }
  ],
  "analystErrors": {
   "taro": 1355,
   "diana": 0,
   "nova": 154,
   "flow": 323
  },
  "regimeErrors": {
   "down_low": 669,
   "side_low": 624,
   "down_high": 601,
   "up_low": 557
  }
 },
 "shadow": {
  "n": 6582,
  "baselineActionN": 1553,
  "baselineActionPrecision": 44.9,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 6582,
   "SELL": 0
  },
  "testDays": 11,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2507,
  "rawBrier": 0.261
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
     "n": 390,
     "hit": 158,
     "raw": 0.4051,
     "uncalibratedAcc": 0.4047,
     "base": 0.3959,
     "calibratedAcc": 0.4047
    },
    "60": {
     "n": 353,
     "hit": 126,
     "raw": 0.3569,
     "uncalibratedAcc": 0.359,
     "base": 0.3959,
     "calibratedAcc": 0.359
    },
    "70": {
     "n": 130,
     "hit": 59,
     "raw": 0.4538,
     "uncalibratedAcc": 0.4461,
     "base": 0.3959,
     "calibratedAcc": 0.4461
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.4968,
     "base": 0.3959,
     "calibratedAcc": 0.4968
    }
   },
   "SELL": {
    "40": {
     "n": 2303,
     "hit": 1247,
     "raw": 0.5415,
     "uncalibratedAcc": 0.5414,
     "base": 0.5343,
     "calibratedAcc": 0.5414
    },
    "45": {
     "n": 1137,
     "hit": 538,
     "raw": 0.4732,
     "uncalibratedAcc": 0.4742,
     "base": 0.5343,
     "calibratedAcc": 0.4742
    },
    "35": {
     "n": 1434,
     "hit": 866,
     "raw": 0.6039,
     "uncalibratedAcc": 0.6029,
     "base": 0.5343,
     "calibratedAcc": 0.5585
    },
    "30": {
     "n": 535,
     "hit": 274,
     "raw": 0.5121,
     "uncalibratedAcc": 0.5129,
     "base": 0.5343,
     "calibratedAcc": 0.5585
    },
    "25": {
     "n": 80,
     "hit": 17,
     "raw": 0.2125,
     "uncalibratedAcc": 0.2769,
     "base": 0.5343,
     "calibratedAcc": 0.5585
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3476,
     "base": 0.5343,
     "calibratedAcc": 0.5585
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5088,
     "base": 0.5343,
     "calibratedAcc": 0.5585
    }
   }
  },
  "evaluation": {
   "n": 1553,
   "buyN": 362,
   "sellN": 1191,
   "testDays": 11,
   "testRegimes": 4,
   "candidate": {
    "n": 1553,
    "tierSpreadPp": 1.2,
    "corr": 0.0649,
    "ci95": {
     "lowPp": -14.4,
     "highPp": 30.3,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1553,
    "tierSpreadPp": 2.7,
    "corr": 0.0333,
    "ci95": {
     "lowPp": -5.0,
     "highPp": 10.8,
     "includesZero": true,
     "decisionDays": 11,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     48,
     54
    ],
    "candidateRangeSell": [
     56,
     61
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 362,
     "tierSpreadPp": -3.3
    },
    "candidateWithinSell": {
     "n": 1191,
     "tierSpreadPp": -3.8
    },
    "baselineWithinBuy": {
     "n": 362,
     "tierSpreadPp": -15.8
    },
    "baselineWithinSell": {
     "n": 1191,
     "tierSpreadPp": 3.3
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 53,
   "trainDays": 32,
   "embargoDays": 5,
   "holdoutDays": 16,
   "holdoutSharePct": 30.2,
   "estimatedTotalDaysForGate": 193,
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
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 1.2pp vs 기존 2.7pp)",
    "후보 판별력 95% 구간(-14.4~30.3pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY -3.3pp · SELL -3.8pp)",
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
