// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-04 15:11",
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
   "taro": 0.3103,
   "diana": 0.1166,
   "nova": 0.2387,
   "flow": 0.3343
  },
  "acc": {
   "taro": {
    "n": 3914,
    "acc": 52.1,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 4014
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
    "n": 866,
    "acc": 45.0,
    "adjustedAcc": 45.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.3,
    "absoluteN": 903
   },
   "flow": {
    "n": 690,
    "acc": 55.4,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 701
   }
  },
  "graded": 5470,
  "team": {
   "basis": "absolute_return",
   "hit": 3608,
   "miss": 2168,
   "n": 5776,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2875,
    "diana": 0.1178,
    "nova": 0.2789,
    "flow": 0.3159
   },
   "acc": {
    "taro": {
     "n": 398,
     "acc": 43.2,
     "adjustedAcc": 44.8,
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
   "graded": 574,
   "globalBlend": 0.582
  },
  "전자·부품": {
   "weights": {
    "taro": 0.306,
    "diana": 0.1184,
    "nova": 0.2436,
    "flow": 0.3319
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 47.6,
     "adjustedAcc": 48.6,
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
     "n": 40,
     "acc": 35.0,
     "adjustedAcc": 46.2,
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
   "graded": 300,
   "globalBlend": 0.727
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.1183,
    "nova": 0.2466,
    "flow": 0.3305
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 46.8,
     "adjustedAcc": 48.0,
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
     "n": 35,
     "acc": 40.0,
     "adjustedAcc": 47.7,
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
    "taro": 0.2971,
    "diana": 0.1161,
    "nova": 0.2565,
    "flow": 0.3302
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 41.9,
     "adjustedAcc": 45.5,
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
     "n": 32,
     "acc": 65.6,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 220,
   "globalBlend": 0.784
  },
  "금융·증권": {
   "weights": {
    "taro": 0.311,
    "diana": 0.1165,
    "nova": 0.2442,
    "flow": 0.3283
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 54.0,
     "adjustedAcc": 52.5,
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
   "graded": 254,
   "globalBlend": 0.759
  },
  "2차전지": {
   "weights": {
    "taro": 0.3169,
    "diana": 0.1156,
    "nova": 0.2485,
    "flow": 0.3189
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
    "taro": 0.3138,
    "diana": 0.1175,
    "nova": 0.2234,
    "flow": 0.3453
   },
   "acc": {
    "taro": {
     "n": 484,
     "acc": 52.9,
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
     "n": 185,
     "acc": 34.1,
     "adjustedAcc": 40.3,
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
   "graded": 741,
   "globalBlend": 0.519
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3211,
    "diana": 0.1177,
    "nova": 0.2359,
    "flow": 0.3253
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
    "diana": 0.1176,
    "nova": 0.2514,
    "flow": 0.3168
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 53.4,
     "adjustedAcc": 52.5,
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
     "n": 14,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 38.9,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 357,
   "globalBlend": 0.691
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3108,
    "diana": 0.1183,
    "nova": 0.2486,
    "flow": 0.3222
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
     "n": 47,
     "acc": 46.8,
     "adjustedAcc": 49.1,
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
   "graded": 245,
   "globalBlend": 0.766
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3234,
    "diana": 0.1165,
    "nova": 0.239,
    "flow": 0.321
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
    "diana": 0.1152,
    "nova": 0.2437,
    "flow": 0.3278
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 61.1,
     "adjustedAcc": 55.3,
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
     "n": 104,
     "acc": 51.0,
     "adjustedAcc": 50.4,
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
   "graded": 229,
   "globalBlend": 0.777
  }
 }
};
