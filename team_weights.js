// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-04 16:11",
 "evalDays": 5,
 "horizons": {
  "taro": {
   "days": 5,
   "deadband": 1.0
  },
  "diana": {
   "days": 20,
   "deadband": 3.0
  },
  "nova": {
   "days": 5,
   "deadband": 1.0
  },
  "flow": {
   "days": 5,
   "deadband": 1.0
  }
 },
 "method": "role-prior-bayesian-shrinkage-v3-market-relative",
 "scoring": {
  "basis": "market_relative_excess",
  "benchmark": "cross_sectional_median_of_covered_universe",
  "benchmarkMinCodes": 30,
  "fallbackToAbsoluteN": 0,
  "since": "2026-08-31",
  "note": "분석가 채점만 시장 대비로 바꿨다. 팀 적중률(team.acc)은 사용자에게 계속 같은 뜻으로 보여야 하므로 절대 기준을 유지한다."
 },
 "global": {
  "version": "tw-2026-08-31-market-relative",
  "weights": {
   "taro": 0.3101,
   "diana": 0.1167,
   "nova": 0.2385,
   "flow": 0.3347
  },
  "acc": {
   "taro": {
    "n": 3912,
    "acc": 52.1,
    "adjustedAcc": 52.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 4021
   },
   "diana": {
    "n": 0,
    "acc": null,
    "adjustedAcc": 50.0,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": null,
    "absoluteN": 0
   },
   "nova": {
    "n": 863,
    "acc": 45.0,
    "adjustedAcc": 45.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 904
   },
   "flow": {
    "n": 688,
    "acc": 55.4,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 701
   }
  },
  "graded": 5463,
  "team": {
   "basis": "absolute_return",
   "hit": 3606,
   "miss": 2172,
   "n": 5778,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.1179,
    "nova": 0.2788,
    "flow": 0.3162
   },
   "acc": {
    "taro": {
     "n": 397,
     "acc": 43.1,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 94,
     "acc": 63.8,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 82,
     "acc": 47.6,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 573,
   "globalBlend": 0.583
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3053,
    "diana": 0.1187,
    "nova": 0.2432,
    "flow": 0.3328
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 46.8,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 39,
     "acc": 33.3,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 55.1,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 296,
   "globalBlend": 0.73
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3045,
    "diana": 0.1182,
    "nova": 0.2468,
    "flow": 0.3305
   },
   "acc": {
    "taro": {
     "n": 206,
     "acc": 47.1,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 34,
     "acc": 41.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 54.4,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 297,
   "globalBlend": 0.729
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2973,
    "diana": 0.116,
    "nova": 0.2559,
    "flow": 0.3308
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 42.6,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 33,
     "acc": 78.8,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 31,
     "acc": 67.7,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3106,
    "diana": 0.1166,
    "nova": 0.2441,
    "flow": 0.3287
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 53.7,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 5,
     "acc": 20.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 57.4,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 253,
   "globalBlend": 0.76
  },
  "2차전지": {
   "weights": {
    "taro": 0.3167,
    "diana": 0.1157,
    "nova": 0.2484,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 60.5,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 34,
     "acc": 61.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 9,
     "acc": 22.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 228,
   "globalBlend": 0.778
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1174,
    "nova": 0.2239,
    "flow": 0.3451
   },
   "acc": {
    "taro": {
     "n": 487,
     "acc": 53.0,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 185,
     "acc": 34.6,
     "adjustedAcc": 40.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 72,
     "acc": 66.7,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 744,
   "globalBlend": 0.518
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3209,
    "diana": 0.1178,
    "nova": 0.2358,
    "flow": 0.3255
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 56.8,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 65,
     "acc": 30.8,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 23,
     "acc": 52.2,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 347,
   "globalBlend": 0.697
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3141,
    "diana": 0.118,
    "nova": 0.2509,
    "flow": 0.317
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 53.1,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 13,
     "acc": 46.2,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 35,
     "acc": 37.1,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 355,
   "globalBlend": 0.693
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3105,
    "diana": 0.1183,
    "nova": 0.2489,
    "flow": 0.3224
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 46,
     "acc": 47.8,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 12,
     "acc": 16.7,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 244,
   "globalBlend": 0.766
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3232,
    "diana": 0.1166,
    "nova": 0.2388,
    "flow": 0.3213
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 65.5,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 39.4,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 213,
   "globalBlend": 0.79
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3133,
    "diana": 0.1154,
    "nova": 0.2431,
    "flow": 0.3282
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 60.9,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 106,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 76.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 233,
   "globalBlend": 0.774
  }
 }
};
