// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-02 14:32",
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
   "taro": 0.313,
   "diana": 0.118,
   "nova": 0.2451,
   "flow": 0.3239
  },
  "acc": {
   "taro": {
    "n": 3161,
    "acc": 52.0,
    "adjustedAcc": 52.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.5,
    "absoluteN": 3235
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
    "n": 704,
    "acc": 45.5,
    "adjustedAcc": 46.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 720
   },
   "flow": {
    "n": 586,
    "acc": 53.8,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.6,
    "absoluteN": 596
   }
  },
  "graded": 4451,
  "team": {
   "basis": "absolute_return",
   "hit": 2864,
   "miss": 1757,
   "n": 4621,
   "uniqueDecisionDays": 8,
   "minDaysForConclusion": 20,
   "acc": 62.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2944,
    "diana": 0.1196,
    "nova": 0.2756,
    "flow": 0.3103
   },
   "acc": {
    "taro": {
     "n": 325,
     "acc": 43.1,
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
     "n": 78,
     "acc": 61.5,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 44.3,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 473,
   "globalBlend": 0.628
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3098,
    "diana": 0.1189,
    "nova": 0.2476,
    "flow": 0.3237
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 49.0,
     "adjustedAcc": 49.4,
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
   "graded": 247,
   "globalBlend": 0.764
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1185,
    "nova": 0.2494,
    "flow": 0.3186
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
    "taro": 0.3096,
    "diana": 0.1185,
    "nova": 0.2516,
    "flow": 0.3204
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 49.1,
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
   "graded": 202,
   "globalBlend": 0.798
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3102,
    "diana": 0.1174,
    "nova": 0.2295,
    "flow": 0.343
   },
   "acc": {
    "taro": {
     "n": 393,
     "acc": 52.2,
     "adjustedAcc": 51.7,
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
     "n": 138,
     "acc": 33.3,
     "adjustedAcc": 41.1,
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
   "graded": 589,
   "globalBlend": 0.576
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3206,
    "diana": 0.1188,
    "nova": 0.2449,
    "flow": 0.3157
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 56.3,
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
     "n": 55,
     "acc": 34.5,
     "adjustedAcc": 45.1,
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
   "graded": 287,
   "globalBlend": 0.736
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3142,
    "diana": 0.1185,
    "nova": 0.2558,
    "flow": 0.3115
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
     "n": 12,
     "acc": 58.3,
     "adjustedAcc": 50.8,
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
   "graded": 282,
   "globalBlend": 0.739
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3152,
    "diana": 0.1184,
    "nova": 0.2522,
    "flow": 0.3142
   },
   "acc": {
    "taro": {
     "n": 156,
     "acc": 54.5,
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
     "n": 40,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
   "graded": 207,
   "globalBlend": 0.794
  }
 }
};
