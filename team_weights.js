// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 10:46",
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
   "taro": 0.3103,
   "diana": 0.1167,
   "nova": 0.2383,
   "flow": 0.3346
  },
  "acc": {
   "taro": {
    "n": 3546,
    "acc": 52.1,
    "adjustedAcc": 52.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 3629
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
    "n": 787,
    "acc": 44.9,
    "adjustedAcc": 45.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 808
   },
   "flow": {
    "n": 637,
    "acc": 55.4,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.6,
    "absoluteN": 645
   }
  },
  "graded": 4970,
  "team": {
   "basis": "absolute_return",
   "hit": 3251,
   "miss": 1945,
   "n": 5196,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2857,
    "diana": 0.1184,
    "nova": 0.2777,
    "flow": 0.3181
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 41.3,
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
     "n": 76,
     "acc": 47.4,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 528,
   "globalBlend": 0.602
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3071,
    "diana": 0.118,
    "nova": 0.2414,
    "flow": 0.3334
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 48.9,
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
     "acc": 32.4,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 57.8,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 275,
   "globalBlend": 0.744
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.1179,
    "nova": 0.2456,
    "flow": 0.3289
   },
   "acc": {
    "taro": {
     "n": 185,
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
   "graded": 270,
   "globalBlend": 0.748
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3083,
    "diana": 0.117,
    "nova": 0.245,
    "flow": 0.3296
   },
   "acc": {
    "taro": {
     "n": 178,
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
     "n": 44,
     "acc": 56.8,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 226,
   "globalBlend": 0.78
  },
  "2차전지": {
   "weights": {
    "taro": 0.318,
    "diana": 0.1153,
    "nova": 0.2468,
    "flow": 0.3198
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 63.6,
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
   "graded": 204,
   "globalBlend": 0.797
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1167,
    "nova": 0.222,
    "flow": 0.3476
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 53.6,
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
     "n": 164,
     "acc": 32.9,
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
   "graded": 675,
   "globalBlend": 0.542
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3199,
    "diana": 0.1178,
    "nova": 0.2377,
    "flow": 0.3245
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 56.7,
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
     "n": 59,
     "acc": 32.2,
     "adjustedAcc": 44.1,
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
   "graded": 313,
   "globalBlend": 0.719
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3133,
    "diana": 0.1179,
    "nova": 0.2506,
    "flow": 0.3181
   },
   "acc": {
    "taro": {
     "n": 272,
     "acc": 52.9,
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
   "graded": 317,
   "globalBlend": 0.716
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3115,
    "diana": 0.1178,
    "nova": 0.2484,
    "flow": 0.3222
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 52.1,
     "adjustedAcc": 51.2,
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
   "graded": 225,
   "globalBlend": 0.78
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3116,
    "diana": 0.1159,
    "nova": 0.2434,
    "flow": 0.329
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 58.1,
     "adjustedAcc": 53.8,
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
     "acc": 49.5,
     "adjustedAcc": 49.8,
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
