// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-02 15:02",
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
   "taro": 0.3131,
   "diana": 0.1182,
   "nova": 0.2449,
   "flow": 0.3238
  },
  "acc": {
   "taro": {
    "n": 3153,
    "acc": 52.0,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.2,
    "absoluteN": 3241
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
    "n": 701,
    "acc": 45.4,
    "adjustedAcc": 46.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.6,
    "absoluteN": 720
   },
   "flow": {
    "n": 583,
    "acc": 53.7,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.6,
    "absoluteN": 596
   }
  },
  "graded": 4437,
  "team": {
   "basis": "absolute_return",
   "hit": 2853,
   "miss": 1767,
   "n": 4620,
   "uniqueDecisionDays": 8,
   "minDaysForConclusion": 20,
   "acc": 61.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.1198,
    "nova": 0.2764,
    "flow": 0.3094
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 43.0,
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
     "n": 77,
     "acc": 62.3,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 43.5,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 469,
   "globalBlend": 0.63
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3091,
    "diana": 0.1192,
    "nova": 0.2478,
    "flow": 0.324
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 48.0,
     "adjustedAcc": 48.9,
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
     "n": 37,
     "acc": 35.1,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 55.9,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 246,
   "globalBlend": 0.765
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1187,
    "nova": 0.2492,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 52.8,
     "adjustedAcc": 51.6,
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
     "n": 28,
     "acc": 39.3,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 235,
   "globalBlend": 0.773
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3099,
    "diana": 0.1186,
    "nova": 0.2514,
    "flow": 0.3202
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 49.4,
     "adjustedAcc": 49.6,
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
     "n": 3,
     "acc": 33.3,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 203,
   "globalBlend": 0.798
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3093,
    "diana": 0.1175,
    "nova": 0.2304,
    "flow": 0.3429
   },
   "acc": {
    "taro": {
     "n": 395,
     "acc": 51.9,
     "adjustedAcc": 51.5,
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
     "n": 140,
     "acc": 34.3,
     "adjustedAcc": 41.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 58,
     "acc": 74.1,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 593,
   "globalBlend": 0.574
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3209,
    "diana": 0.119,
    "nova": 0.2442,
    "flow": 0.3159
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 56.5,
     "adjustedAcc": 54.1,
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
     "n": 54,
     "acc": 33.3,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 19,
     "acc": 42.1,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 282,
   "globalBlend": 0.739
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3145,
    "diana": 0.1187,
    "nova": 0.255,
    "flow": 0.3117
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 52.9,
     "adjustedAcc": 51.9,
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
     "n": 11,
     "acc": 54.5,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 30,
     "acc": 36.7,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 281,
   "globalBlend": 0.74
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3149,
    "diana": 0.1188,
    "nova": 0.2516,
    "flow": 0.3147
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 53.5,
     "adjustedAcc": 52.0,
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
     "acc": 47.5,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 11,
     "acc": 18.2,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 206,
   "globalBlend": 0.795
  }
 }
};
