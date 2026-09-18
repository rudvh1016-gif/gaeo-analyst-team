// 자동 생성: compute_model_intelligence.py · 확률교정·중복보정·국면·AUDIT·그림자 평가
// promotion.qualified가 true일 때만 analyze_auto.py가 후보 공식을 실전 승격한다.
const MODEL_INTELLIGENCE = {
 "generatedAt": "2026-09-18 09:17",
 "version": "calibrated-ensemble-v3",
 "calibration": {
  "taro": {
   "50": {
    "n": 2274,
    "up": 1160,
    "raw": 0.5101,
    "uncalibratedPUp": 0.5093,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "20": {
    "n": 1036,
    "up": 493,
    "raw": 0.4759,
    "uncalibratedPUp": 0.475,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "40": {
    "n": 2465,
    "up": 1245,
    "raw": 0.5051,
    "uncalibratedPUp": 0.5043,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "30": {
    "n": 2676,
    "up": 1190,
    "raw": 0.4447,
    "uncalibratedPUp": 0.4447,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "70": {
    "n": 1293,
    "up": 502,
    "raw": 0.3882,
    "uncalibratedPUp": 0.3895,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "80": {
    "n": 1339,
    "up": 428,
    "raw": 0.3196,
    "uncalibratedPUp": 0.3224,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "60": {
    "n": 2435,
    "up": 1004,
    "raw": 0.4123,
    "uncalibratedPUp": 0.4127,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "10": {
    "n": 3244,
    "up": 1456,
    "raw": 0.4488,
    "uncalibratedPUp": 0.4488,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "90": {
    "n": 404,
    "up": 147,
    "raw": 0.3639,
    "uncalibratedPUp": 0.3694,
    "base": 0.4442,
    "pUp": 0.4442
   },
   "0": {
    "n": 3,
    "up": 1,
    "raw": 0.3333,
    "uncalibratedPUp": 0.4341,
    "base": 0.4442,
    "pUp": 0.4341
   }
  },
  "diana": {
   "40": {
    "n": 2658,
    "up": 1499,
    "raw": 0.564,
    "uncalibratedPUp": 0.564,
    "base": 0.57,
    "pUp": 0.564
   },
   "70": {
    "n": 2880,
    "up": 1652,
    "raw": 0.5736,
    "uncalibratedPUp": 0.5736,
    "base": 0.57,
    "pUp": 0.5758
   },
   "50": {
    "n": 3372,
    "up": 1927,
    "raw": 0.5715,
    "uncalibratedPUp": 0.5715,
    "base": 0.57,
    "pUp": 0.5715
   },
   "80": {
    "n": 3008,
    "up": 1836,
    "raw": 0.6104,
    "uncalibratedPUp": 0.61,
    "base": 0.57,
    "pUp": 0.5891
   },
   "30": {
    "n": 1783,
    "up": 924,
    "raw": 0.5182,
    "uncalibratedPUp": 0.5191,
    "base": 0.57,
    "pUp": 0.5209
   },
   "90": {
    "n": 687,
    "up": 342,
    "raw": 0.4978,
    "uncalibratedPUp": 0.5008,
    "base": 0.57,
    "pUp": 0.5891
   },
   "60": {
    "n": 2765,
    "up": 1599,
    "raw": 0.5783,
    "uncalibratedPUp": 0.5782,
    "base": 0.57,
    "pUp": 0.5758
   },
   "20": {
    "n": 3,
    "up": 1,
    "raw": 0.3333,
    "uncalibratedPUp": 0.5485,
    "base": 0.57,
    "pUp": 0.5209
   },
   "10": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.5516,
    "base": 0.57,
    "pUp": 0.5209
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.57,
    "base": 0.57,
    "pUp": 0.5209
   }
  },
  "nova": {
   "50": {
    "n": 3769,
    "up": 1299,
    "raw": 0.3447,
    "uncalibratedPUp": 0.3454,
    "base": 0.4442,
    "pUp": 0.4062
   },
   "40": {
    "n": 5295,
    "up": 1989,
    "raw": 0.3756,
    "uncalibratedPUp": 0.376,
    "base": 0.4442,
    "pUp": 0.4062
   },
   "30": {
    "n": 3544,
    "up": 1521,
    "raw": 0.4292,
    "uncalibratedPUp": 0.4293,
    "base": 0.4442,
    "pUp": 0.4062
   },
   "70": {
    "n": 56,
    "up": 10,
    "raw": 0.1786,
    "uncalibratedPUp": 0.2712,
    "base": 0.4442,
    "pUp": 0.6453
   },
   "60": {
    "n": 2595,
    "up": 1728,
    "raw": 0.6659,
    "uncalibratedPUp": 0.6634,
    "base": 0.4442,
    "pUp": 0.6453
   },
   "20": {
    "n": 1905,
    "up": 1079,
    "raw": 0.5664,
    "uncalibratedPUp": 0.5645,
    "base": 0.4442,
    "pUp": 0.4062
   },
   "90": {
    "n": 1,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.4298,
    "base": 0.4442,
    "pUp": 0.6453
   },
   "80": {
    "n": 4,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3919,
    "base": 0.4442,
    "pUp": 0.6453
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4442,
    "base": 0.4442,
    "pUp": 0.4062
   },
   "10": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4442,
    "base": 0.4442,
    "pUp": 0.4062
   }
  },
  "flow": {
   "50": {
    "n": 10722,
    "up": 4892,
    "raw": 0.4563,
    "uncalibratedPUp": 0.4562,
    "base": 0.4442,
    "pUp": 0.4562
   },
   "70": {
    "n": 224,
    "up": 122,
    "raw": 0.5446,
    "uncalibratedPUp": 0.5328,
    "base": 0.4442,
    "pUp": 0.5157
   },
   "40": {
    "n": 4877,
    "up": 1998,
    "raw": 0.4097,
    "uncalibratedPUp": 0.4099,
    "base": 0.4442,
    "pUp": 0.4099
   },
   "30": {
    "n": 542,
    "up": 203,
    "raw": 0.3745,
    "uncalibratedPUp": 0.3782,
    "base": 0.4442,
    "pUp": 0.3978
   },
   "60": {
    "n": 691,
    "up": 361,
    "raw": 0.5224,
    "uncalibratedPUp": 0.5192,
    "base": 0.4442,
    "pUp": 0.5157
   },
   "20": {
    "n": 100,
    "up": 45,
    "raw": 0.45,
    "uncalibratedPUp": 0.4487,
    "base": 0.4442,
    "pUp": 0.3978
   },
   "80": {
    "n": 5,
    "up": 0,
    "raw": 0.0,
    "uncalibratedPUp": 0.3807,
    "base": 0.4442,
    "pUp": 0.5157
   },
   "10": {
    "n": 8,
    "up": 5,
    "raw": 0.625,
    "uncalibratedPUp": 0.4822,
    "base": 0.4442,
    "pUp": 0.3978
   },
   "0": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4442,
    "base": 0.4442,
    "pUp": 0.3978
   },
   "90": {
    "n": 0,
    "up": 0,
    "raw": null,
    "uncalibratedPUp": 0.4442,
    "base": 0.4442,
    "pUp": 0.5157
   }
  }
 },
 "errorCorrelation": {
  "taro:diana": {
   "n": 7895,
   "errorCorr": -0.065
  },
  "taro:nova": {
   "n": 7741,
   "errorCorr": 0.178
  },
  "taro:flow": {
   "n": 2025,
   "errorCorr": 0.233
  },
  "diana:nova": {
   "n": 5761,
   "errorCorr": -0.065
  },
  "diana:flow": {
   "n": 1315,
   "errorCorr": 0.083
  },
  "nova:flow": {
   "n": 1441,
   "errorCorr": -0.077
  }
 },
 "redundancyFactor": {
  "taro": 0.9933,
  "diana": 1,
  "nova": 0.9983,
  "flow": 0.995
 },
 "regimes": {
  "up_high": {
   "n": 5756,
   "blend": 0.6,
   "weights": {
    "taro": 0.333,
    "diana": 0.1213,
    "nova": 0.2171,
    "flow": 0.3286
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
    "taro": 0.2762,
    "diana": 0.121,
    "nova": 0.2929,
    "flow": 0.3099
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
   "n": 12441,
   "blend": 0.6,
   "weights": {
    "taro": 0.2617,
    "diana": 0.1437,
    "nova": 0.3009,
    "flow": 0.2937
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
    "taro": 0.3188,
    "diana": 0.1173,
    "nova": 0.2867,
    "flow": 0.2771
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
    "taro": 0.3093,
    "diana": 0.1381,
    "nova": 0.2251,
    "flow": 0.3274
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
  "median5": -0.71,
  "medianAbs1": 0.68,
  "advanceRatio5": 39.5,
  "medianRet1": 0.21,
  "advanceRatio1": 58.9
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
   "hit": 15465,
   "miss": 11965,
   "mid": 1109,
   "accuracy": 56.4
  },
  "guarded": {
   "hit": 15461,
   "miss": 11984,
   "mid": 1094,
   "accuracy": 56.3
  },
  "active": false,
  "policy": {
   "sellThreshold": 40,
   "minAffectedN": 30,
   "conditions": "high-volatility broad rebound + TARO/QUANT both bear"
  }
 },
 "audit": {
  "matured": 8380,
  "errors": 2700,
  "patterns": [
   {
    "label": "경계점수 판단",
    "count": 2358
   },
   {
    "label": "분석가 의견충돌",
    "count": 1632
   },
   {
    "label": "고변동성 국면",
    "count": 268
   },
   {
    "label": "3인 이상 같은 방향 오판",
    "count": 134
   }
  ],
  "analystErrors": {
   "taro": 1636,
   "diana": 0,
   "nova": 150,
   "flow": 333
  },
  "regimeErrors": {
   "up_low": 891,
   "side_low": 776,
   "down_low": 765,
   "down_high": 268
  }
 },
 "shadow": {
  "n": 8380,
  "baselineActionN": 2073,
  "baselineActionPrecision": 52.8,
  "candidateActionN": 0,
  "candidateActionPrecision": null,
  "candidateCoverage": 0.0,
  "candidateCalls": {
   "BUY": 0,
   "HOLD": 8380,
   "SELL": 0
  },
  "testDays": 14,
  "testRegimes": 4,
  "candidateAllCallAccuracy": null,
  "candidateAllCallBasis": "BUY·SELL은 ±1%, HOLD는 ±5%로 채점한 값이라 BUY·SELL 정밀도와 같은 잣대가 아니다.",
  "candidateAllCallSuppressed": true,
  "candidateAllCallSuppressedReason": "후보가 실행 가능한 판단(BUY·SELL)을 한 건도 내지 않아, 이 값은 HOLD 판정폭(±5%)만 반영한다.",
  "brier": 0.2433,
  "rawBrier": 0.2644
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
     "n": 455,
     "hit": 177,
     "raw": 0.389,
     "uncalibratedAcc": 0.3886,
     "base": 0.3781,
     "calibratedAcc": 0.3886
    },
    "60": {
     "n": 452,
     "hit": 150,
     "raw": 0.3319,
     "uncalibratedAcc": 0.3338,
     "base": 0.3781,
     "calibratedAcc": 0.3338
    },
    "70": {
     "n": 137,
     "hit": 65,
     "raw": 0.4745,
     "uncalibratedAcc": 0.4622,
     "base": 0.3781,
     "calibratedAcc": 0.4622
    },
    "75": {
     "n": 6,
     "hit": 5,
     "raw": 0.8333,
     "uncalibratedAcc": 0.4832,
     "base": 0.3781,
     "calibratedAcc": 0.4832
    }
   },
   "SELL": {
    "40": {
     "n": 2354,
     "hit": 1292,
     "raw": 0.5489,
     "uncalibratedAcc": 0.5488,
     "base": 0.5415,
     "calibratedAcc": 0.5488
    },
    "45": {
     "n": 1188,
     "hit": 582,
     "raw": 0.4899,
     "uncalibratedAcc": 0.4908,
     "base": 0.5415,
     "calibratedAcc": 0.4908
    },
    "35": {
     "n": 1449,
     "hit": 879,
     "raw": 0.6066,
     "uncalibratedAcc": 0.6057,
     "base": 0.5415,
     "calibratedAcc": 0.5615
    },
    "30": {
     "n": 540,
     "hit": 278,
     "raw": 0.5148,
     "uncalibratedAcc": 0.5158,
     "base": 0.5415,
     "calibratedAcc": 0.5615
    },
    "25": {
     "n": 80,
     "hit": 17,
     "raw": 0.2125,
     "uncalibratedAcc": 0.2783,
     "base": 0.5415,
     "calibratedAcc": 0.5615
    },
    "20": {
     "n": 28,
     "hit": 6,
     "raw": 0.2143,
     "uncalibratedAcc": 0.3506,
     "base": 0.5415,
     "calibratedAcc": 0.5615
    },
    "15": {
     "n": 1,
     "hit": 0,
     "raw": 0.0,
     "uncalibratedAcc": 0.5157,
     "base": 0.5415,
     "calibratedAcc": 0.5615
    }
   }
  },
  "evaluation": {
   "n": 2073,
   "buyN": 511,
   "sellN": 1562,
   "testDays": 14,
   "testRegimes": 4,
   "candidate": {
    "n": 2073,
    "tierSpreadPp": 6.2,
    "corr": 0.1962,
    "ci95": {
     "lowPp": -5.5,
     "highPp": 37.3,
     "includesZero": true,
     "decisionDays": 14,
     "draws": 1000
    }
   },
   "baseline": {
    "n": 2073,
    "tierSpreadPp": 8.5,
    "corr": 0.0683,
    "ci95": {
     "lowPp": 0.9,
     "highPp": 15.1,
     "includesZero": false,
     "decisionDays": 14,
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
     61
    ],
    "rangesOverlap": false,
    "candidateWithinBuy": {
     "n": 511,
     "tierSpreadPp": 1.8
    },
    "candidateWithinSell": {
     "n": 1562,
     "tierSpreadPp": -3.3
    },
    "baselineWithinBuy": {
     "n": 511,
     "tierSpreadPp": -8.2
    },
    "baselineWithinSell": {
     "n": 1562,
     "tierSpreadPp": 5.2
    },
    "note": "합친 표의 스프레드는 BUY·SELL 자체의 적중률 차이만으로도 커질 수 있다. 같은 방향 안에서 다시 잰 값이 진짜 판별력이다."
   }
  },
  "evaluationDesign": {
   "type": "RETROSPECTIVE_RESPLIT",
   "note": "매 실행마다 전체 기록을 날짜순 70:30으로 다시 자르고 학습 구간에서 교정표를 새로 만든다. testDays는 앞으로 하루씩 쌓이는 누적 검증일이 아니라, 지금 기록의 뒤쪽 30% 중 BUY·SELL 채점이 가능한 날짜 수다.",
   "totalDecisionDays": 58,
   "trainDays": 35,
   "embargoDays": 5,
   "holdoutDays": 18,
   "holdoutSharePct": 31.0,
   "estimatedTotalDaysForGate": 166,
   "isProspective": false
  },
  "prospective": {
   "type": "PROSPECTIVE_ARCHIVED",
   "note": "그날 미리 기록해 둔 확신도 후보값만으로 채점한다. 나중에 만든 교정표를 과거에 적용하지 않으므로 검증일이 실제로 하루씩 쌓인다.",
   "n": 723,
   "testDays": 5,
   "firstDay": "2026-09-07",
   "lastDay": "2026-09-11",
   "buyN": 168,
   "sellN": 555,
   "tierSpreadPp": 32.4,
   "tierSpreadWithinBuyPp": 8.9,
   "tierSpreadWithinSellPp": 0.0,
   "clockStarted": true,
   "daysRemainingToGate": 35
  },
  "promotion": {
   "qualified": false,
   "status": "shadow",
   "reasons": [
    "검증일 40거래일 미만",
    "후보 확신도가 기존보다 실제 적중률을 더 잘 가른다는 근거 부족(후보 6.2pp vs 기존 8.5pp)",
    "후보 판별력 95% 구간(-5.5~37.3pp)이 0을 포함해 우연일 가능성을 배제하지 못함",
    "같은 방향 안에서 다시 재면 판별력이 약함(BUY 1.8pp · SELL -3.3pp)",
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
