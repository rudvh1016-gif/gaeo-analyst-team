// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-02 15:32",
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
   "taro": 0.3132,
   "diana": 0.1185,
   "nova": 0.2431,
   "flow": 0.3252
  },
  "acc": {
   "taro": {
    "n": 3146,
    "acc": 51.9,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 3251
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
    "n": 698,
    "acc": 45.0,
    "adjustedAcc": 45.7,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 723
   },
   "flow": {
    "n": 584,
    "acc": 53.8,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.5,
    "absoluteN": 595
   }
  },
  "graded": 4428,
  "team": {
   "basis": "absolute_return",
   "hit": 2854,
   "miss": 1767,
   "n": 4621,
   "uniqueDecisionDays": 8,
   "minDaysForConclusion": 20,
   "acc": 61.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2941,
    "diana": 0.1199,
    "nova": 0.2751,
    "flow": 0.311
   },
   "acc": {
    "taro": {
     "n": 322,
     "acc": 42.9,
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
     "n": 77,
     "acc": 62.3,
     "adjustedAcc": 54.8,
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
   "graded": 469,
   "globalBlend": 0.63
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3094,
    "diana": 0.1195,
    "nova": 0.2459,
    "flow": 0.3252
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
   "graded": 245,
   "globalBlend": 0.766
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3134,
    "diana": 0.1189,
    "nova": 0.248,
    "flow": 0.3197
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
    "taro": 0.3099,
    "diana": 0.1188,
    "nova": 0.2499,
    "flow": 0.3213
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
    "taro": 0.3102,
    "diana": 0.1177,
    "nova": 0.2283,
    "flow": 0.3438
   },
   "acc": {
    "taro": {
     "n": 395,
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
   "graded": 591,
   "globalBlend": 0.575
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3201,
    "diana": 0.1194,
    "nova": 0.2432,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 55.8,
     "adjustedAcc": 53.7,
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
   "graded": 281,
   "globalBlend": 0.74
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3143,
    "diana": 0.1188,
    "nova": 0.2544,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 242,
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
   "graded": 284,
   "globalBlend": 0.738
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3154,
    "diana": 0.1189,
    "nova": 0.2499,
    "flow": 0.3157
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 54.2,
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
   "graded": 204,
   "globalBlend": 0.797
  }
 }
};
