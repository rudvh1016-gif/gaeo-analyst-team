// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-15 09:17",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2180,
    "up": 1141,
    "raw": 0.5234,
    "uncalibratedPUp": 0.5226,
    "base": 0.4613,
    "pUp": 0.4671
   },
   "20": {
    "n": 1030,
    "up": 492,
    "raw": 0.4777,
    "uncalibratedPUp": 0.4772,
    "base": 0.4613,
    "pUp": 0.4559
   },
   "40": {
    "n": 2404,
    "up": 1235,
    "raw": 0.5137,
    "uncalibratedPUp": 0.5131,
    "base": 0.4613,
    "pUp": 0.4671
   },
   "30": {
    "n": 2651,
    "up": 1186,
    "raw": 0.4474,
    "uncalibratedPUp": 0.4475,
    "base": 0.4613,
    "pUp": 0.4559
   },
   "70": {
    "n": 1082,
    "up": 466,
    "raw": 0.4307,
    "uncalibratedPUp": 0.4315,
    "base": 0.4613,
    "pUp": 0.4671
   },
   "80": {
    "n": 1045,
    "up": 368,
    "raw": 0.3522,
    "uncalibratedPUp": 0.3552,
    "base": 0.4613,
    "pUp": 0.4671
   },
   "60": {
    "n": 2119,
    "up": 957,
    "raw": 0.4516,
    "uncalibratedPUp": 0.4518,
    "base": 0.4613,
    "pUp": 0.4671
   },
   "10": {
    "n": 3227,
    "up": 1454,
    "raw": 0.4506,
    "uncalibratedPUp": 0.4507,
    "base": 0.4613,
    "pUp": 0.4507
   },
   "90": {
    "n": 326,
    "up": 111,
    "raw": 0.3405,
    "uncalibratedPUp": 0.3507,
    "base": 0.4613,
    "pUp": 0.4671
   },
   "0": {
    "n": 3,
    "up": 1,
    "raw": 0.3333,
    "uncalibratedPUp": 0.4496,
    "base": 0.4613,
    "pUp": 0.4496
   }
  },
  "diana": {
   "40": {
    "n": 2457,
    "up": 1428,
    "raw": 0.5812,
    "uncalibratedPUp": 0.5813,
    "base": 0.5859,
    "pUp": 0.5813
   },
   "70": {
    "n": 2683,
    "up": 1573,
    "raw": 0.5863,
    "uncalibratedPUp": 0.5863,
    "base": 0.5859,
    "pUp": 0.5901
   },
   "50": {
    "n": 3159,
    "up": 1857,
    "raw": 0.5878,
    "uncalibratedPUp": 0.5878,
    "base": 0.5859,
    "pUp": 0.5878
   },
   "80": {
    "n": 2844,
    "up": 1774,
    "raw": 0.6238,
    "uncalibratedPUp": 0.6234,
    "base": 0.5859,
    "pUp": 0.6028
   },
   "30": {
    "n": 1665,
    "up": 900,
    "raw": 0.5405,
    "uncalibratedPUp": 0.5413,
    "base": 0.5859,
    "pUp": 0.5429
   },
   "90": {
    "n": 648,
    "up": 332,
    "raw": 0.5123,
    "uncalibratedPUp": 0.5156,
    "base": 0.5859,
    "pUp": 0.6028
   },
   "60": {
    "n": 2597,
    "up": 1543,
    "raw": 0.5941,
    "uncalibratedPUp": 0.5941,
    "base": 0.5859,
    "pUp": 0.5901
   },
   "20": {
    "n": 3,
    "up": 1,
    "raw": 0.3333,
    "uncalibratedPUp": 0.563,
    "base": 0.5859,
    "pUp": 0.5429
   },
   "10": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.567,
    "base": 0.5859,
    "pUp": 0.5429
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5859,
    "base": 0.5859,
    "pUp": 0.5429
   }
  },
  "nova": {
   "50": {
    "n": 3171,
    "up": 1191,
    "raw": 0.3756,
    "uncalibratedPUp": 0.3764,
    "base": 0.4613,
    "pUp": 0.4232
   },
   "40": {
    "n": 4821,
    "up": 1885,
    "raw": 0.391,
    "uncalibratedPUp": 0.3914,
    "base": 0.4613,
    "pUp": 0.4232
   },
   "30": {
    "n": 3534,
    "up": 1521,
    "raw": 0.4304,
    "uncalibratedPUp": 0.4307,
    "base": 0.4613,
    "pUp": 0.4232
   },
   "70": {
    "n": 56,
    "up": 10,
    "raw": 0.1786,
    "uncalibratedPUp": 0.2772,
    "base": 0.4613,
    "pUp": 0.6487
   },
   "60": {
    "n": 2579,
    "up": 1725,
    "raw": 0.6689,
    "uncalibratedPUp": 0.6665,
    "base": 0.4613,
    "pUp": 0.6487
   },
   "20": {
    "n": 1901,
    "up": 1079,
    "raw": 0.5676,
    "uncalibratedPUp": 0.5659,
    "base": 0.4613,
    "pUp": 0.4232
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4464,
    "base": 0.4613,
    "pUp": 0.6487
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.407,
    "base": 0.4613,
    "pUp": 0.6487
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4613,
    "base": 0.4613,
    "pUp": 0.4232
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4613,
    "base": 0.4613,
    "pUp": 0.4232
   }
  },
  "flow": {
   "50": {
    "n": 10126,
    "up": 4770,
    "raw": 0.4711,
    "uncalibratedPUp": 0.471,
    "base": 0.4613,
    "pUp": 0.471
   },
   "70": {
    "n": 215,
    "up": 119,
    "raw": 0.5535,
    "uncalibratedPUp": 0.5422,
    "base": 0.4613,
    "pUp": 0.5258
   },
   "40": {
    "n": 4453,
    "up": 1924,
    "raw": 0.4321,
    "uncalibratedPUp": 0.4323,
    "base": 0.4613,
    "pUp": 0.4323
   },
   "30": {
    "n": 503,
    "up": 197,
    "raw": 0.3917,
    "uncalibratedPUp": 0.3956,
    "base": 0.4613,
    "pUp": 0.4143
   },
   "60": {
    "n": 663,
    "up": 353,
    "raw": 0.5324,
    "uncalibratedPUp": 0.5293,
    "base": 0.4613,
    "pUp": 0.5258
   },
   "20": {
    "n": 96,
    "up": 43,
    "raw": 0.4479,
    "uncalibratedPUp": 0.4511,
    "base": 0.4613,
    "pUp": 0.4143
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3954,
    "base": 0.4613,
    "pUp": 0.5258
   },
   "10": {
    "n": 6,
    "up": 5,
    "raw": 0.8333,
    "uncalibratedPUp": 0.5233,
    "base": 0.4613,
    "pUp": 0.4143
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4613,
    "base": 0.4613,
    "pUp": 0.4143
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4613,
    "base": 0.4613,
    "pUp": 0.5258
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 7371,
   "errorCorr": -0.089
  },
  "taro:nova": {
   "n": 7630,
   "errorCorr": 0.189
  },
  "taro:flow": {
   "n": 1881,
   "errorCorr": 0.239
  },
  "diana:nova": {
   "n": 5687,
   "errorCorr": -0.062
  },
  "diana:flow": {
   "n": 1219,
   "errorCorr": 0.104
  },
  "nova:flow": {
   "n": 1416,
   "errorCorr": -0.079
  }
 },
 "redundancyFactor": {
  "taro": 0.9923,
  "diana": 1,
  "nova": 0.9977,
  "flow": 0.9946
 },
 "regimes": {
  "up_high": {
   "n": 5012,
   "blend": 0.6,
   "weights": {
    "taro": 0.328,
    "diana": 0.1176,
    "nova": 0.2137,
    "flow": 0.3407
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
   "n": 5773,
   "blend": 0.6,
   "weights": {
    "taro": 0.2944,
    "diana": 0.1227,
    "nova": 0.274,
    "flow": 0.3088
   },
   "acc": {
    "taro": {
     "n": 2576,
     "adjustedAcc": 46.4
    },
    "diana": {
     "n": 2031,
     "adjustedAcc": 49.3
    },
    "nova": {
     "n": 697,
     "adjustedAcc": 53.6
    },
    "flow": {
     "n": 469,
     "adjustedAcc": 50.9
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.261,
    "diana": 0.1423,
    "nova": 0.2975,
    "flow": 0.2992
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
    "taro": 0.318,
    "diana": 0.1162,
    "nova": 0.2836,
    "flow": 0.2822
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
    "taro": 0.308,
    "diana": 0.1366,
    "nova": 0.2224,
    "flow": 0.333
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
  "median5": -0.93,
  "medianAbs1": 0.75,
  "advanceRatio5": 36.4,
  "medianRet1": 0.0,
  "advanceRatio1": 44.7
 },
 "holdPolicy": {
  "buyProbability": 0.62,
  "sellProbability": 0.38
 },
 "reboundGuard": {
  "n": 26744,
  "days": 51,
  "guardedN": 295,
  "baseline": {
   "hit": 14264,
   "miss": 11449,
   "mid": 1031,
   "accuracy": 55.5
  },
  "guarded": {
   "hit": 14260,
   "miss": 11468,
   "mid": 1016,
   "accuracy": 55.4
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 7781,
  "errors": 2747,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2369
   },
   {
    "label": "분석가 의견충돌",
    "count": 1568
   },
   {
    "label": "고변동성 국면",
    "count": 601
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 123
   }
  ],
  "analystErrors": {
   "taro": 1553,
   "diana": 0,
   "nova": 173,
   "flow": 359
  },
  "regimeErrors": {
   "down_low": 965,
   "side_low": 624,
   "down_high": 601,
   "up_low": 557
  }
 },
 "shadow": {
  "n": 7781,
  "baselineActionN": 1953,
  "baselineActionPrecision": 48.1,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 7781,
   "SELL": 0
  },
  "testDays": 13,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2498,
  "rawBrier": 0.2609
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
     "n": 411,
     "hit": 165,
     "raw": 0.4015,
     "uncalibratedAcc": 0.4011,
     "base": 0.3929,
     "calibratedAcc": 0.4011
    },
    "60": {
     "n": 379,
     "hit": 133,
     "raw": 0.3509,
     "uncalibratedAcc": 0.353,
     "base": 0.3929,
     "calibratedAcc": 0.353
    },
    "70": {
     "n": 133,
     "hit": 62,
     "raw": 0.4662,
     "uncalibratedAcc": 0.4566,
     "base": 0.3929,
     "calibratedAcc": 0.4566
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.4945,
     "base": 0.3929,
     "calibratedAcc": 0.4945
    }
   },
   "SELL": {
    "40": {
     "n": 2325,
     "hit": 1268,
     "raw": 0.5454,
     "uncalibratedAcc": 0.5453,
     "base": 0.5375,
     "calibratedAcc": 0.5453
    },
    "45": {
     "n": 1155,
     "hit": 554,
     "raw": 0.4797,
     "uncalibratedAcc": 0.4806,
     "base": 0.5375,
     "calibratedAcc": 0.4806
    },
    "35": {
     "n": 1440,
     "hit": 871,
     "raw": 0.6049,
     "uncalibratedAcc": 0.6039,
     "base": 0.5375,
     "calibratedAcc": 0.5598
    },
    "30": {
     "n": 539,
     "hit": 277,
     "raw": 0.5139,
     "uncalibratedAcc": 0.5148,
     "base": 0.5375,
     "calibratedAcc": 0.5598
    },
    "25": {
     "n": 80,
     "hit": 17,
     "raw": 0.2125,
     "uncalibratedAcc": 0.2775,
     "base": 0.5375,
     "calibratedAcc": 0.5598
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.349,
     "base": 0.5375,
     "calibratedAcc": 0.5598
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5119,
     "base": 0.5375,
     "calibratedAcc": 0.5598
    }
   }
  },
  "evaluation": {
   "n": 1953,
   "buyN": 426,
   "sellN": 1527,
   "testDays": 13,
   "testRegimes": 4,
   "candidate": {
    "n": 1953,
    "tierSpreadPp": 7.1,
    "corr": 0.0946,
    "ci95": {
     "lowPp": -9.9,
     "highPp": 29.0,
     "includesZero": true,
     "decisionDays": 13,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1953,
    "tierSpreadPp": 1.2,
    "corr": 0.0105,
    "ci95": {
     "lowPp": -6.0,
     "highPp": 8.4,
     "includesZero": true,
     "decisionDays": 13,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     48,
     55
    ],
    "candidateRangeSell": [
     56,
     61
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 426,
     "tierSpreadPp": 3.5
    },
    "candidateWithinSell": {
     "n": 1527,
     "tierSpreadPp": 9.8
    },
    "baselineWithinBuy": {
     "n": 426,
     "tierSpreadPp": -14.1
    },
    "baselineWithinSell": {
     "n": 1527,
     "tierSpreadPp": 0.2
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 55,
   "trainDays": 33,
   "embargoDays": 5,
   "holdoutDays": 17,
   "holdoutSharePct": 30.9,
   "estimatedTotalDaysForGate": 169,
   "isProspective": false
  },
  "prospective": {
   "type": "PROSPECTIVE_ARCHIVED",
   "note": "그날 미리 기록해 둔 확신도 후보값만으로 채점한다. 나중에 만든 교정표를 과거에 적용하지 않으므로 검증일이 실제로 하루씩 쌓인다.",
   "n": 322,
   "testDays": 2,
   "firstDay": "2026-09-07",
   "lastDay": "2026-09-08",
   "buyN": 56,
   "sellN": 266,
   "tierSpreadPp": 24.3,
   "tierSpreadWithinBuyPp": 16.7,
   "tierSpreadWithinSellPp": 13.6,
   "clockStarted": true,
   "daysRemainingToGate": 38
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 판별력 95% 구간(-9.9~29.0pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY 3.5pp · SELL 9.8pp)",
    "사전 기록 기반 검증일 2일 / 40일 (누적 중)"
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
