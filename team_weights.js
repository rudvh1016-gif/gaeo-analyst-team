// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-02 12:04",
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
   "diana": 0.1181,
   "nova": 0.2457,
   "flow": 0.323
  },
  "acc": {
   "taro": {
    "n": 3158,
    "acc": 52.0,
    "adjustedAcc": 52.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.3,
    "absoluteN": 3230
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
    "n": 703,
    "acc": 45.5,
    "adjustedAcc": 46.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.8,
    "absoluteN": 712
   },
   "flow": {
    "n": 584,
    "acc": 53.6,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.4,
    "absoluteN": 593
   }
  },
  "graded": 4445,
  "team": {
   "basis": "absolute_return",
   "hit": 2853,
   "miss": 1764,
   "n": 4617,
   "uniqueDecisionDays": 8,
   "minDaysForConclusion": 20,
   "acc": 61.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2952,
    "diana": 0.1196,
    "nova": 0.2757,
    "flow": 0.3095
   },
   "acc": {
    "taro": {
     "n": 324,
     "acc": 43.5,
     "adjustedAcc": 45.3,
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
   "graded": 472,
   "globalBlend": 0.629
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3107,
    "diana": 0.1189,
    "nova": 0.2474,
    "flow": 0.323
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "acc": 33.3,
     "adjustedAcc": 46.2,
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
    "taro": 0.3134,
    "diana": 0.1186,
    "nova": 0.25,
    "flow": 0.318
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 52.5,
     "adjustedAcc": 51.4,
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
   "graded": 236,
   "globalBlend": 0.772
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3094,
    "diana": 0.1185,
    "nova": 0.2526,
    "flow": 0.3194
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
     "n": 4,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
    "taro": 0.3103,
    "diana": 0.1171,
    "nova": 0.2297,
    "flow": 0.3429
   },
   "acc": {
    "taro": {
     "n": 394,
     "acc": 52.5,
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
     "n": 139,
     "acc": 33.8,
     "adjustedAcc": 41.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 75.4,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 590,
   "globalBlend": 0.576
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3204,
    "diana": 0.1189,
    "nova": 0.2454,
    "flow": 0.3152
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 56.1,
     "adjustedAcc": 53.9,
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
   "graded": 286,
   "globalBlend": 0.737
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3138,
    "diana": 0.1186,
    "nova": 0.2564,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 52.5,
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
    "diana": 0.1185,
    "nova": 0.2527,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 54.5,
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
   "graded": 205,
   "globalBlend": 0.796
  }
 }
};
