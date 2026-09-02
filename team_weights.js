// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-02 14:02",
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
   "taro": 0.3133,
   "diana": 0.1182,
   "nova": 0.244,
   "flow": 0.3245
  },
  "acc": {
   "taro": {
    "n": 3151,
    "acc": 52.0,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.3,
    "absoluteN": 3236
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
    "acc": 45.2,
    "adjustedAcc": 45.9,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.6,
    "absoluteN": 720
   },
   "flow": {
    "n": 586,
    "acc": 53.8,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.6,
    "absoluteN": 594
   }
  },
  "graded": 4438,
  "team": {
   "basis": "absolute_return",
   "hit": 2860,
   "miss": 1764,
   "n": 4624,
   "uniqueDecisionDays": 8,
   "minDaysForConclusion": 20,
   "acc": 61.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.1197,
    "nova": 0.2747,
    "flow": 0.3105
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 43.3,
     "adjustedAcc": 45.1,
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
   "graded": 471,
   "globalBlend": 0.629
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3098,
    "diana": 0.1191,
    "nova": 0.2469,
    "flow": 0.3242
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 48.7,
     "adjustedAcc": 49.3,
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
   "graded": 248,
   "globalBlend": 0.763
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1187,
    "nova": 0.2486,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 158,
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
   "graded": 234,
   "globalBlend": 0.774
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3096,
    "diana": 0.1185,
    "nova": 0.2512,
    "flow": 0.3206
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
    "taro": 0.3091,
    "diana": 0.1175,
    "nova": 0.2289,
    "flow": 0.3445
   },
   "acc": {
    "taro": {
     "n": 396,
     "acc": 51.8,
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
     "n": 140,
     "acc": 33.6,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 74.6,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 595,
   "globalBlend": 0.573
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3207,
    "diana": 0.1191,
    "nova": 0.2437,
    "flow": 0.3165
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 56.2,
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
   "graded": 283,
   "globalBlend": 0.739
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3142,
    "diana": 0.1188,
    "nova": 0.2545,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 238,
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
   "graded": 279,
   "globalBlend": 0.741
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3156,
    "diana": 0.1186,
    "nova": 0.2509,
    "flow": 0.3149
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
     "n": 39,
     "acc": 48.7,
     "adjustedAcc": 49.7,
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
   "graded": 204,
   "globalBlend": 0.797
  }
 }
};
