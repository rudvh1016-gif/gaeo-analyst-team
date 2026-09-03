// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 16:12",
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
   "taro": 0.3118,
   "diana": 0.1172,
   "nova": 0.235,
   "flow": 0.336
  },
  "acc": {
   "taro": {
    "n": 3551,
    "acc": 52.2,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 3637
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
    "n": 783,
    "acc": 44.2,
    "adjustedAcc": 45.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.4,
    "absoluteN": 815
   },
   "flow": {
    "n": 635,
    "acc": 55.4,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 648
   }
  },
  "graded": 4969,
  "team": {
   "basis": "absolute_return",
   "hit": 3223,
   "miss": 1984,
   "n": 5207,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 61.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2864,
    "diana": 0.1186,
    "nova": 0.2756,
    "flow": 0.3195
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 41.4,
     "adjustedAcc": 43.5,
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
     "n": 89,
     "acc": 64.0,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 77,
     "acc": 48.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 531,
   "globalBlend": 0.601
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3072,
    "diana": 0.1184,
    "nova": 0.2397,
    "flow": 0.3347
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 48.0,
     "adjustedAcc": 48.8,
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
     "n": 38,
     "acc": 34.2,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 58.1,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 273,
   "globalBlend": 0.746
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3087,
    "diana": 0.1183,
    "nova": 0.2431,
    "flow": 0.3299
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 49.2,
     "adjustedAcc": 49.5,
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
     "n": 32,
     "acc": 40.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 52.8,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 268,
   "globalBlend": 0.749
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2994,
    "diana": 0.1166,
    "nova": 0.2522,
    "flow": 0.3319
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 41.8,
     "adjustedAcc": 45.6,
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
     "n": 31,
     "acc": 80.6,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 67.9,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 200,
   "globalBlend": 0.8
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3096,
    "diana": 0.1175,
    "nova": 0.2427,
    "flow": 0.3302
   },
   "acc": {
    "taro": {
     "n": 182,
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
     "n": 4,
     "acc": 25.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 55.8,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 229,
   "globalBlend": 0.777
  },
  "2차전지": {
   "weights": {
    "taro": 0.3189,
    "diana": 0.1158,
    "nova": 0.2444,
    "flow": 0.3209
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 63.1,
     "adjustedAcc": 57.6,
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
     "acc": 63.6,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 6,
     "acc": 16.7,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 207,
   "globalBlend": 0.794
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3144,
    "diana": 0.1172,
    "nova": 0.2194,
    "flow": 0.349
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 53.4,
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
     "n": 162,
     "acc": 32.1,
     "adjustedAcc": 39.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 70.8,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 669,
   "globalBlend": 0.545
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3216,
    "diana": 0.1183,
    "nova": 0.2344,
    "flow": 0.3257
   },
   "acc": {
    "taro": {
     "n": 236,
     "acc": 56.8,
     "adjustedAcc": 54.5,
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
     "n": 59,
     "acc": 30.5,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 47.6,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 316,
   "globalBlend": 0.717
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3147,
    "diana": 0.1182,
    "nova": 0.2481,
    "flow": 0.319
   },
   "acc": {
    "taro": {
     "n": 271,
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
     "n": 12,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 36.4,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 316,
   "globalBlend": 0.717
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3122,
    "diana": 0.1183,
    "nova": 0.2461,
    "flow": 0.3234
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 51.5,
     "adjustedAcc": 50.9,
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
     "n": 44,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
   "graded": 227,
   "globalBlend": 0.779
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3148,
    "diana": 0.1164,
    "nova": 0.2385,
    "flow": 0.3303
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 60.4,
     "adjustedAcc": 54.8,
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
     "n": 95,
     "acc": 46.3,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 75.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 212,
   "globalBlend": 0.791
  }
 }
};
