// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-04 10:40",
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
   "taro": 0.3105,
   "diana": 0.1163,
   "nova": 0.236,
   "flow": 0.3372
  },
  "acc": {
   "taro": {
    "n": 3916,
    "acc": 52.2,
    "adjustedAcc": 52.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.1,
    "absoluteN": 4038
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
    "acc": 44.7,
    "adjustedAcc": 45.3,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.9,
    "absoluteN": 904
   },
   "flow": {
    "n": 690,
    "acc": 55.8,
    "adjustedAcc": 54.9,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.2,
    "absoluteN": 705
   }
  },
  "graded": 5472,
  "team": {
   "basis": "absolute_return",
   "hit": 3603,
   "miss": 2179,
   "n": 5782,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2867,
    "diana": 0.1178,
    "nova": 0.2776,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 396,
     "acc": 42.7,
     "adjustedAcc": 44.4,
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
   "graded": 572,
   "globalBlend": 0.583
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3059,
    "diana": 0.1182,
    "nova": 0.2417,
    "flow": 0.3341
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 47.4,
     "adjustedAcc": 48.4,
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
   "graded": 299,
   "globalBlend": 0.728
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3037,
    "diana": 0.118,
    "nova": 0.2453,
    "flow": 0.333
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 46.4,
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
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
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
   "graded": 303,
   "globalBlend": 0.725
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2978,
    "diana": 0.1159,
    "nova": 0.2546,
    "flow": 0.3317
   },
   "acc": {
    "taro": {
     "n": 157,
     "acc": 42.7,
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
     "n": 33,
     "acc": 63.6,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 223,
   "globalBlend": 0.782
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3116,
    "diana": 0.1162,
    "nova": 0.242,
    "flow": 0.3303
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 54.5,
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
    "taro": 0.3178,
    "diana": 0.1153,
    "nova": 0.2462,
    "flow": 0.3208
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 61.3,
     "adjustedAcc": 56.9,
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
    "taro": 0.3116,
    "diana": 0.1163,
    "nova": 0.2206,
    "flow": 0.3516
   },
   "acc": {
    "taro": {
     "n": 486,
     "acc": 53.1,
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
     "n": 186,
     "acc": 34.4,
     "adjustedAcc": 40.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 72,
     "acc": 70.8,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 744,
   "globalBlend": 0.518
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3217,
    "diana": 0.1177,
    "nova": 0.2337,
    "flow": 0.3268
   },
   "acc": {
    "taro": {
     "n": 257,
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
     "n": 64,
     "acc": 29.7,
     "adjustedAcc": 42.9,
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
   "graded": 343,
   "globalBlend": 0.7
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3147,
    "diana": 0.1174,
    "nova": 0.2494,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 311,
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
   "graded": 361,
   "globalBlend": 0.689
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3113,
    "diana": 0.1179,
    "nova": 0.2468,
    "flow": 0.324
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 51.1,
     "adjustedAcc": 50.7,
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
     "n": 48,
     "acc": 47.9,
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
   "graded": 246,
   "globalBlend": 0.765
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3228,
    "diana": 0.1163,
    "nova": 0.2375,
    "flow": 0.3233
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
    "taro": 0.3131,
    "diana": 0.1152,
    "nova": 0.2409,
    "flow": 0.3307
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 60.4,
     "adjustedAcc": 54.9,
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
     "n": 103,
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
   "graded": 226,
   "globalBlend": 0.78
  }
 }
};
