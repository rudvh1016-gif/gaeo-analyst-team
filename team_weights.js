// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 10:16",
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
   "diana": 0.1169,
   "nova": 0.2386,
   "flow": 0.3334
  },
  "acc": {
   "taro": {
    "n": 3546,
    "acc": 52.1,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 3634
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
    "acc": 44.8,
    "adjustedAcc": 45.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 806
   },
   "flow": {
    "n": 634,
    "acc": 55.2,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 648
   }
  },
  "graded": 4965,
  "team": {
   "basis": "absolute_return",
   "hit": 3256,
   "miss": 1948,
   "n": 5204,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.286,
    "diana": 0.1187,
    "nova": 0.2784,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 41.0,
     "adjustedAcc": 43.3,
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
     "n": 75,
     "acc": 46.7,
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
    "taro": 0.308,
    "diana": 0.118,
    "nova": 0.2416,
    "flow": 0.3324
   },
   "acc": {
    "taro": {
     "n": 173,
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
   "graded": 274,
   "globalBlend": 0.745
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3081,
    "diana": 0.1181,
    "nova": 0.2458,
    "flow": 0.3279
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
    "taro": 0.3089,
    "diana": 0.1173,
    "nova": 0.2455,
    "flow": 0.3284
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
    "taro": 0.3186,
    "diana": 0.1155,
    "nova": 0.2471,
    "flow": 0.3188
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 63.5,
     "adjustedAcc": 57.8,
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
   "graded": 206,
   "globalBlend": 0.795
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3153,
    "diana": 0.1168,
    "nova": 0.221,
    "flow": 0.347
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 53.9,
     "adjustedAcc": 53.1,
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
   "graded": 672,
   "globalBlend": 0.543
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3192,
    "diana": 0.118,
    "nova": 0.2392,
    "flow": 0.3235
   },
   "acc": {
    "taro": {
     "n": 236,
     "acc": 55.9,
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
     "n": 61,
     "acc": 34.4,
     "adjustedAcc": 44.8,
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
   "graded": 318,
   "globalBlend": 0.716
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3144,
    "diana": 0.1179,
    "nova": 0.2507,
    "flow": 0.3171
   },
   "acc": {
    "taro": {
     "n": 272,
     "acc": 53.3,
     "adjustedAcc": 52.3,
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
    "taro": 0.3121,
    "diana": 0.118,
    "nova": 0.2486,
    "flow": 0.3213
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
    "taro": 0.312,
    "diana": 0.1161,
    "nova": 0.2437,
    "flow": 0.3282
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 57.7,
     "adjustedAcc": 53.6,
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
   "graded": 219,
   "globalBlend": 0.785
  }
 }
};
