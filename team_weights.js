// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 09:17",
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
   "diana": 0.1174,
   "nova": 0.2372,
   "flow": 0.3323
  },
  "acc": {
   "taro": {
    "n": 3534,
    "acc": 52.2,
    "adjustedAcc": 52.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.8,
    "absoluteN": 3625
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
    "acc": 44.5,
    "adjustedAcc": 45.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.8,
    "absoluteN": 805
   },
   "flow": {
    "n": 639,
    "acc": 54.9,
    "adjustedAcc": 54.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 646
   }
  },
  "graded": 4960,
  "team": {
   "basis": "absolute_return",
   "hit": 3258,
   "miss": 1939,
   "n": 5197,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2909,
    "diana": 0.119,
    "nova": 0.2738,
    "flow": 0.3163
   },
   "acc": {
    "taro": {
     "n": 361,
     "acc": 42.7,
     "adjustedAcc": 44.5,
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
     "acc": 61.8,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 77,
     "acc": 46.8,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 527,
   "globalBlend": 0.603
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3109,
    "diana": 0.1185,
    "nova": 0.2402,
    "flow": 0.3304
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
     "acc": 31.6,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 56.2,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 274,
   "globalBlend": 0.745
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3094,
    "diana": 0.1185,
    "nova": 0.2449,
    "flow": 0.3273
   },
   "acc": {
    "taro": {
     "n": 184,
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
   "graded": 269,
   "globalBlend": 0.748
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3101,
    "diana": 0.1175,
    "nova": 0.2441,
    "flow": 0.3283
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
     "n": 45,
     "acc": 57.8,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 226,
   "globalBlend": 0.78
  },
  "2차전지": {
   "weights": {
    "taro": 0.3192,
    "diana": 0.116,
    "nova": 0.2465,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 62.1,
     "adjustedAcc": 57.1,
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
   "graded": 208,
   "globalBlend": 0.794
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.316,
    "diana": 0.1175,
    "nova": 0.2216,
    "flow": 0.345
   },
   "acc": {
    "taro": {
     "n": 443,
     "acc": 53.5,
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
     "n": 163,
     "acc": 32.5,
     "adjustedAcc": 39.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 69.2,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 671,
   "globalBlend": 0.544
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3211,
    "diana": 0.1184,
    "nova": 0.2376,
    "flow": 0.3228
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
     "n": 60,
     "acc": 33.3,
     "adjustedAcc": 44.4,
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
    "taro": 0.3151,
    "diana": 0.1184,
    "nova": 0.2499,
    "flow": 0.3166
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 52.8,
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
   "graded": 314,
   "globalBlend": 0.718
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3149,
    "diana": 0.1182,
    "nova": 0.2466,
    "flow": 0.3203
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 53.3,
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
     "n": 43,
     "acc": 48.8,
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
   "graded": 222,
   "globalBlend": 0.783
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1165,
    "nova": 0.2427,
    "flow": 0.3273
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 57.5,
     "adjustedAcc": 53.5,
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
   "graded": 221,
   "globalBlend": 0.784
  }
 }
};
