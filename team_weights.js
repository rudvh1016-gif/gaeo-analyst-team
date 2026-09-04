// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-04 14:41",
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
   "taro": 0.3109,
   "diana": 0.1167,
   "nova": 0.2394,
   "flow": 0.3329
  },
  "acc": {
   "taro": {
    "n": 3912,
    "acc": 52.2,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 4019
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
    "n": 867,
    "acc": 45.1,
    "adjustedAcc": 45.7,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.2,
    "absoluteN": 902
   },
   "flow": {
    "n": 689,
    "acc": 55.2,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.8,
    "absoluteN": 703
   }
  },
  "graded": 5468,
  "team": {
   "basis": "absolute_return",
   "hit": 3609,
   "miss": 2165,
   "n": 5774,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.1181,
    "nova": 0.2798,
    "flow": 0.3138
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
     "acc": 46.3,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 574,
   "globalBlend": 0.582
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3065,
    "diana": 0.1184,
    "nova": 0.2441,
    "flow": 0.3309
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
    "taro": 0.3048,
    "diana": 0.1183,
    "nova": 0.2476,
    "flow": 0.3293
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
   "graded": 296,
   "globalBlend": 0.73
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2979,
    "diana": 0.116,
    "nova": 0.2566,
    "flow": 0.3294
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
    "taro": 0.3114,
    "diana": 0.1166,
    "nova": 0.2447,
    "flow": 0.3272
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
    "taro": 0.3176,
    "diana": 0.1157,
    "nova": 0.249,
    "flow": 0.3177
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 60.8,
     "adjustedAcc": 56.5,
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
   "graded": 229,
   "globalBlend": 0.777
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3139,
    "diana": 0.1175,
    "nova": 0.2241,
    "flow": 0.3444
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
     "n": 184,
     "acc": 34.2,
     "adjustedAcc": 40.5,
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
   "graded": 740,
   "globalBlend": 0.519
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3212,
    "diana": 0.1181,
    "nova": 0.2368,
    "flow": 0.3238
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 56.4,
     "adjustedAcc": 54.4,
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
     "n": 22,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 346,
   "globalBlend": 0.698
  },
  "화학·소재": {
   "weights": {
    "taro": 0.315,
    "diana": 0.1176,
    "nova": 0.2517,
    "flow": 0.3156
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 53.7,
     "adjustedAcc": 52.7,
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
    "taro": 0.3115,
    "diana": 0.1183,
    "nova": 0.2491,
    "flow": 0.321
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 50.8,
     "adjustedAcc": 50.5,
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
   "graded": 244,
   "globalBlend": 0.766
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3239,
    "diana": 0.1166,
    "nova": 0.2395,
    "flow": 0.3199
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
    "taro": 0.3148,
    "diana": 0.1153,
    "nova": 0.2432,
    "flow": 0.3267
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 61.8,
     "adjustedAcc": 55.7,
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
     "n": 107,
     "acc": 49.5,
     "adjustedAcc": 49.8,
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
   "graded": 234,
   "globalBlend": 0.774
  }
 }
};
