// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-04 09:41",
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
   "taro": 0.3115,
   "diana": 0.1163,
   "nova": 0.2363,
   "flow": 0.3358
  },
  "acc": {
   "taro": {
    "n": 3919,
    "acc": 52.4,
    "adjustedAcc": 52.3,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 4026
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
    "n": 865,
    "acc": 44.7,
    "adjustedAcc": 45.4,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.6,
    "absoluteN": 904
   },
   "flow": {
    "n": 694,
    "acc": 55.6,
    "adjustedAcc": 54.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.1,
    "absoluteN": 698
   }
  },
  "graded": 5478,
  "team": {
   "basis": "absolute_return",
   "hit": 3625,
   "miss": 2153,
   "n": 5778,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.288,
    "diana": 0.1178,
    "nova": 0.2778,
    "flow": 0.3163
   },
   "acc": {
    "taro": {
     "n": 396,
     "acc": 42.9,
     "adjustedAcc": 44.6,
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
     "n": 81,
     "acc": 46.9,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 571,
   "globalBlend": 0.584
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3061,
    "diana": 0.1183,
    "nova": 0.2422,
    "flow": 0.3333
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 46.9,
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
   "graded": 301,
   "globalBlend": 0.727
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.1181,
    "nova": 0.2448,
    "flow": 0.3323
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 46.3,
     "adjustedAcc": 47.7,
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
     "n": 58,
     "acc": 55.2,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 298,
   "globalBlend": 0.729
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2978,
    "diana": 0.1161,
    "nova": 0.2553,
    "flow": 0.3308
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 40.9,
     "adjustedAcc": 44.9,
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
     "acc": 62.5,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3133,
    "diana": 0.116,
    "nova": 0.2419,
    "flow": 0.3287
   },
   "acc": {
    "taro": {
     "n": 206,
     "acc": 55.3,
     "adjustedAcc": 53.4,
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
   "graded": 258,
   "globalBlend": 0.756
  },
  "2차전지": {
   "weights": {
    "taro": 0.3188,
    "diana": 0.1154,
    "nova": 0.2467,
    "flow": 0.3191
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 61.2,
     "adjustedAcc": 56.8,
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
     "n": 10,
     "acc": 20.0,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 232,
   "globalBlend": 0.775
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.313,
    "diana": 0.1163,
    "nova": 0.2211,
    "flow": 0.3495
   },
   "acc": {
    "taro": {
     "n": 488,
     "acc": 53.3,
     "adjustedAcc": 52.6,
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
     "n": 183,
     "acc": 34.4,
     "adjustedAcc": 40.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 69.9,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 744,
   "globalBlend": 0.518
  },
  "지주·상사": {
   "weights": {
    "taro": 0.323,
    "diana": 0.1175,
    "nova": 0.234,
    "flow": 0.3254
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 57.5,
     "adjustedAcc": 55.1,
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
     "n": 63,
     "acc": 30.2,
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
   "graded": 339,
   "globalBlend": 0.702
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3157,
    "diana": 0.1173,
    "nova": 0.2495,
    "flow": 0.3175
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 53.9,
     "adjustedAcc": 52.8,
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
   "graded": 360,
   "globalBlend": 0.69
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3116,
    "diana": 0.1179,
    "nova": 0.2475,
    "flow": 0.3229
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
     "acc": 48.9,
     "adjustedAcc": 49.7,
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
    "taro": 0.3236,
    "diana": 0.1163,
    "nova": 0.2378,
    "flow": 0.3222
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 64.5,
     "adjustedAcc": 57.9,
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
     "n": 42,
     "acc": 35.7,
     "adjustedAcc": 46.3,
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
   "graded": 216,
   "globalBlend": 0.787
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3146,
    "diana": 0.1151,
    "nova": 0.241,
    "flow": 0.3293
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
     "n": 105,
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
   "graded": 230,
   "globalBlend": 0.777
  }
 }
};
