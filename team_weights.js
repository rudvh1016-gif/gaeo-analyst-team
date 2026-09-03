// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 13:16",
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
   "taro": 0.3111,
   "diana": 0.1171,
   "nova": 0.2366,
   "flow": 0.3352
  },
  "acc": {
   "taro": {
    "n": 3538,
    "acc": 52.1,
    "adjustedAcc": 52.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 3615
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
    "n": 785,
    "acc": 44.5,
    "adjustedAcc": 45.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.8,
    "absoluteN": 805
   },
   "flow": {
    "n": 634,
    "acc": 55.4,
    "adjustedAcc": 54.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 644
   }
  },
  "graded": 4957,
  "team": {
   "basis": "absolute_return",
   "hit": 3243,
   "miss": 1954,
   "n": 5197,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.1187,
    "nova": 0.2759,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 41.6,
     "adjustedAcc": 43.7,
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
     "n": 90,
     "acc": 63.3,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 76,
     "acc": 47.4,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 531,
   "globalBlend": 0.601
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3068,
    "diana": 0.1182,
    "nova": 0.2407,
    "flow": 0.3344
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 48.3,
     "adjustedAcc": 49.0,
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
     "n": 63,
     "acc": 58.7,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 275,
   "globalBlend": 0.744
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3082,
    "diana": 0.1182,
    "nova": 0.2443,
    "flow": 0.3293
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
  "금융·증권": {
   "weights": {
    "taro": 0.3089,
    "diana": 0.1174,
    "nova": 0.2439,
    "flow": 0.3298
   },
   "acc": {
    "taro": {
     "n": 177,
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
   "graded": 224,
   "globalBlend": 0.781
  },
  "2차전지": {
   "weights": {
    "taro": 0.3179,
    "diana": 0.1157,
    "nova": 0.2461,
    "flow": 0.3203
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 62.9,
     "adjustedAcc": 57.5,
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
     "acc": 65.6,
     "adjustedAcc": 53.3,
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
   "graded": 205,
   "globalBlend": 0.796
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3129,
    "diana": 0.1171,
    "nova": 0.2213,
    "flow": 0.3487
   },
   "acc": {
    "taro": {
     "n": 441,
     "acc": 53.1,
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
     "n": 162,
     "acc": 32.7,
     "adjustedAcc": 40.1,
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
   "graded": 668,
   "globalBlend": 0.545
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3201,
    "diana": 0.1183,
    "nova": 0.2362,
    "flow": 0.3254
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 56.2,
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
     "n": 58,
     "acc": 31.0,
     "adjustedAcc": 43.8,
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
   "graded": 314,
   "globalBlend": 0.718
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3142,
    "diana": 0.1181,
    "nova": 0.2493,
    "flow": 0.3185
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
    "taro": 0.3124,
    "diana": 0.1181,
    "nova": 0.2469,
    "flow": 0.3226
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 52.4,
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
   "graded": 224,
   "globalBlend": 0.781
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1164,
    "nova": 0.2401,
    "flow": 0.3299
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 59.0,
     "adjustedAcc": 54.2,
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
     "n": 99,
     "acc": 46.5,
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
   "graded": 220,
   "globalBlend": 0.784
  }
 }
};
