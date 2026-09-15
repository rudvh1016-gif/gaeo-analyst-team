// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-15 15:32",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2220,
    "up": 1152,
    "raw": 0.5189,
    "uncalibratedPUp": 0.518,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "20": {
    "n": 1032,
    "up": 493,
    "raw": 0.4777,
    "uncalibratedPUp": 0.477,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "40": {
    "n": 2431,
    "up": 1239,
    "raw": 0.5097,
    "uncalibratedPUp": 0.509,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "30": {
    "n": 2661,
    "up": 1187,
    "raw": 0.4461,
    "uncalibratedPUp": 0.4462,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "70": {
    "n": 1183,
    "up": 482,
    "raw": 0.4074,
    "uncalibratedPUp": 0.4086,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "80": {
    "n": 1190,
    "up": 396,
    "raw": 0.3328,
    "uncalibratedPUp": 0.3357,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "60": {
    "n": 2252,
    "up": 979,
    "raw": 0.4347,
    "uncalibratedPUp": 0.435,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "10": {
    "n": 3235,
    "up": 1455,
    "raw": 0.4498,
    "uncalibratedPUp": 0.4498,
    "base": 0.4534,
    "pUp": 0.4498
   },
   "90": {
    "n": 364,
    "up": 129,
    "raw": 0.3544,
    "uncalibratedPUp": 0.3619,
    "base": 0.4534,
    "pUp": 0.4543
   },
   "0": {
    "n": 3,
    "up": 1,
    "raw": 0.3333,
    "uncalibratedPUp": 0.4425,
    "base": 0.4534,
    "pUp": 0.4425
   }
  },
  "diana": {
   "40": {
    "n": 2549,
    "up": 1460,
    "raw": 0.5728,
    "uncalibratedPUp": 0.5728,
    "base": 0.5784,
    "pUp": 0.5728
   },
   "70": {
    "n": 2770,
    "up": 1607,
    "raw": 0.5801,
    "uncalibratedPUp": 0.5801,
    "base": 0.5784,
    "pUp": 0.5832
   },
   "50": {
    "n": 3256,
    "up": 1890,
    "raw": 0.5805,
    "uncalibratedPUp": 0.5804,
    "base": 0.5784,
    "pUp": 0.5804
   },
   "80": {
    "n": 2919,
    "up": 1804,
    "raw": 0.618,
    "uncalibratedPUp": 0.6176,
    "base": 0.5784,
    "pUp": 0.5968
   },
   "30": {
    "n": 1723,
    "up": 912,
    "raw": 0.5293,
    "uncalibratedPUp": 0.5301,
    "base": 0.5784,
    "pUp": 0.5319
   },
   "90": {
    "n": 665,
    "up": 336,
    "raw": 0.5053,
    "uncalibratedPUp": 0.5084,
    "base": 0.5784,
    "pUp": 0.5968
   },
   "60": {
    "n": 2674,
    "up": 1568,
    "raw": 0.5864,
    "uncalibratedPUp": 0.5863,
    "base": 0.5784,
    "pUp": 0.5832
   },
   "20": {
    "n": 3,
    "up": 1,
    "raw": 0.3333,
    "uncalibratedPUp": 0.5561,
    "base": 0.5784,
    "pUp": 0.5319
   },
   "10": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5597,
    "base": 0.5784,
    "pUp": 0.5319
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.5784,
    "base": 0.5784,
    "pUp": 0.5319
   }
  },
  "nova": {
   "50": {
    "n": 3491,
    "up": 1258,
    "raw": 0.3604,
    "uncalibratedPUp": 0.3611,
    "base": 0.4534,
    "pUp": 0.4153
   },
   "40": {
    "n": 4996,
    "up": 1919,
    "raw": 0.3841,
    "uncalibratedPUp": 0.3845,
    "base": 0.4534,
    "pUp": 0.4153
   },
   "30": {
    "n": 3538,
    "up": 1521,
    "raw": 0.4299,
    "uncalibratedPUp": 0.4301,
    "base": 0.4534,
    "pUp": 0.4153
   },
   "70": {
    "n": 56,
    "up": 10,
    "raw": 0.1786,
    "uncalibratedPUp": 0.2744,
    "base": 0.4534,
    "pUp": 0.648
   },
   "60": {
    "n": 2582,
    "up": 1726,
    "raw": 0.6685,
    "uncalibratedPUp": 0.666,
    "base": 0.4534,
    "pUp": 0.648
   },
   "20": {
    "n": 1903,
    "up": 1079,
    "raw": 0.567,
    "uncalibratedPUp": 0.5652,
    "base": 0.4534,
    "pUp": 0.4153
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4388,
    "base": 0.4534,
    "pUp": 0.648
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4,
    "base": 0.4534,
    "pUp": 0.648
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4534,
    "base": 0.4534,
    "pUp": 0.4153
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4534,
    "base": 0.4534,
    "pUp": 0.4153
   }
  },
  "flow": {
   "50": {
    "n": 10381,
    "up": 4824,
    "raw": 0.4647,
    "uncalibratedPUp": 0.4647,
    "base": 0.4534,
    "pUp": 0.4647
   },
   "70": {
    "n": 219,
    "up": 121,
    "raw": 0.5525,
    "uncalibratedPUp": 0.5406,
    "base": 0.4534,
    "pUp": 0.52
   },
   "40": {
    "n": 4661,
    "up": 1962,
    "raw": 0.4209,
    "uncalibratedPUp": 0.4211,
    "base": 0.4534,
    "pUp": 0.4211
   },
   "30": {
    "n": 522,
    "up": 201,
    "raw": 0.3851,
    "uncalibratedPUp": 0.3888,
    "base": 0.4534,
    "pUp": 0.4075
   },
   "60": {
    "n": 678,
    "up": 356,
    "raw": 0.5251,
    "uncalibratedPUp": 0.522,
    "base": 0.4534,
    "pUp": 0.52
   },
   "20": {
    "n": 98,
    "up": 44,
    "raw": 0.449,
    "uncalibratedPUp": 0.45,
    "base": 0.4534,
    "pUp": 0.4075
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3886,
    "base": 0.4534,
    "pUp": 0.52
   },
   "10": {
    "n": 7,
    "up": 5,
    "raw": 0.7143,
    "uncalibratedPUp": 0.5027,
    "base": 0.4534,
    "pUp": 0.4075
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4534,
    "base": 0.4534,
    "pUp": 0.4075
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4534,
    "base": 0.4534,
    "pUp": 0.52
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 7615,
   "errorCorr": -0.078
  },
  "taro:nova": {
   "n": 7682,
   "errorCorr": 0.183
  },
  "taro:flow": {
   "n": 1952,
   "errorCorr": 0.235
  },
  "diana:nova": {
   "n": 5726,
   "errorCorr": -0.064
  },
  "diana:flow": {
   "n": 1265,
   "errorCorr": 0.09
  },
  "nova:flow": {
   "n": 1430,
   "errorCorr": -0.071
  }
 },
 "redundancyFactor": {
  "taro": 0.9929,
  "diana": 1,
  "nova": 0.998,
  "flow": 0.9949
 },
 "regimes": {
  "up_high": {
   "n": 5012,
   "blend": 0.6,
   "weights": {
    "taro": 0.3283,
    "diana": 0.1174,
    "nova": 0.2161,
    "flow": 0.3382
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
   "n": 6615,
   "blend": 0.6,
   "weights": {
    "taro": 0.2828,
    "diana": 0.1212,
    "nova": 0.2851,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 2997,
     "adjustedAcc": 43.2
    },
    "diana": {
     "n": 2315,
     "adjustedAcc": 48.7
    },
    "nova": {
     "n": 756,
     "adjustedAcc": 56.2
    },
    "flow": {
     "n": 547,
     "adjustedAcc": 52.4
    }
   }
  },
  "down_high": {
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2609,
    "diana": 0.1419,
    "nova": 0.3006,
    "flow": 0.2965
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
    "taro": 0.3179,
    "diana": 0.1159,
    "nova": 0.2865,
    "flow": 0.2797
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
    "taro": 0.3083,
    "diana": 0.1364,
    "nova": 0.2249,
    "flow": 0.3305
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
  "median5": -1.03,
  "medianAbs1": 1.38,
  "advanceRatio5": 39.1,
  "medianRet1": -0.34,
  "advanceRatio1": 41.4
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
   "hit": 14233,
   "miss": 11478,
   "mid": 1033,
   "accuracy": 55.4
  },
  "guarded": {
   "hit": 14229,
   "miss": 11497,
   "mid": 1018,
   "accuracy": 55.3
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 7182,
  "errors": 2443,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2108
   },
   {
    "label": "분석가 의견충돌",
    "count": 1433
   },
   {
    "label": "고변동성 국면",
    "count": 268
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 118
   }
  ],
  "analystErrors": {
   "taro": 1425,
   "diana": 0,
   "nova": 162,
   "flow": 315
  },
  "regimeErrors": {
   "down_low": 994,
   "side_low": 624,
   "up_low": 557,
   "down_high": 268
  }
 },
 "shadow": {
  "n": 7182,
  "baselineActionN": 1790,
  "baselineActionPrecision": 50.0,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 7182,
   "SELL": 0
  },
  "testDays": 12,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2476,
  "rawBrier": 0.2626
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
     "n": 440,
     "hit": 169,
     "raw": 0.3841,
     "uncalibratedAcc": 0.384,
     "base": 0.3825,
     "calibratedAcc": 0.384
    },
    "60": {
     "n": 415,
     "hit": 143,
     "raw": 0.3446,
     "uncalibratedAcc": 0.3463,
     "base": 0.3825,
     "calibratedAcc": 0.3463
    },
    "70": {
     "n": 135,
     "hit": 64,
     "raw": 0.4741,
     "uncalibratedAcc": 0.4623,
     "base": 0.3825,
     "calibratedAcc": 0.4623
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.4866,
     "base": 0.3825,
     "calibratedAcc": 0.4866
    }
   },
   "SELL": {
    "40": {
     "n": 2341,
     "hit": 1281,
     "raw": 0.5472,
     "uncalibratedAcc": 0.5471,
     "base": 0.5395,
     "calibratedAcc": 0.5471
    },
    "45": {
     "n": 1168,
     "hit": 566,
     "raw": 0.4846,
     "uncalibratedAcc": 0.4855,
     "base": 0.5395,
     "calibratedAcc": 0.4855
    },
    "35": {
     "n": 1445,
     "hit": 875,
     "raw": 0.6055,
     "uncalibratedAcc": 0.6046,
     "base": 0.5395,
     "calibratedAcc": 0.5604
    },
    "30": {
     "n": 539,
     "hit": 277,
     "raw": 0.5139,
     "uncalibratedAcc": 0.5148,
     "base": 0.5395,
     "calibratedAcc": 0.5604
    },
    "25": {
     "n": 80,
     "hit": 17,
     "raw": 0.2125,
     "uncalibratedAcc": 0.2779,
     "base": 0.5395,
     "calibratedAcc": 0.5604
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3498,
     "base": 0.5395,
     "calibratedAcc": 0.5604
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5138,
     "base": 0.5395,
     "calibratedAcc": 0.5604
    }
   }
  },
  "evaluation": {
   "n": 1790,
   "buyN": 406,
   "sellN": 1384,
   "testDays": 12,
   "testRegimes": 4,
   "candidate": {
    "n": 1790,
    "tierSpreadPp": -3.9,
    "corr": 0.1325,
    "ci95": {
     "lowPp": -12.3,
     "highPp": 32.8,
     "includesZero": true,
     "decisionDays": 12,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 1790,
    "tierSpreadPp": 2.5,
    "corr": 0.0219,
    "ci95": {
     "lowPp": -4.9,
     "highPp": 9.9,
     "includesZero": true,
     "decisionDays": 12,
     "draws": 1000
    }
   },
   "directionConfound": {
    "candidateRangeBuy": [
     48,
     55
    ],
    "candidateRangeSell": [
     57,
     61
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 406,
     "tierSpreadPp": 7.4
    },
    "candidateWithinSell": {
     "n": 1384,
     "tierSpreadPp": -6.9
    },
    "baselineWithinBuy": {
     "n": 406,
     "tierSpreadPp": -14.8
    },
    "baselineWithinSell": {
     "n": 1384,
     "tierSpreadPp": 1.1
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 56,
   "trainDays": 34,
   "embargoDays": 5,
   "holdoutDays": 17,
   "holdoutSharePct": 30.4,
   "estimatedTotalDaysForGate": 187,
   "isProspective": false
  },
  "prospective": {
   "type": "PROSPECTIVE_ARCHIVED",
   "note": "그날 미리 기록해 둔 확신도 후보값만으로 채점한다. 나중에 만든 교정표를 과거에 적용하지 않으므로 검증일이 실제로 하루씩 쌓인다.",
   "n": 320,
   "testDays": 2,
   "firstDay": "2026-09-07",
   "lastDay": "2026-09-08",
   "buyN": 56,
   "sellN": 264,
   "tierSpreadPp": 17.0,
   "tierSpreadWithinBuyPp": 11.1,
   "tierSpreadWithinSellPp": 9.1,
   "clockStarted": true,
   "daysRemainingToGate": 38
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 -3.9pp vs 기존 2.5pp)",
    "후보 판별력 95% 구간(-12.3~32.8pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY 7.4pp · SELL -6.9pp)",
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
