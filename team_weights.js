// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 12:46",
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
   "taro": 0.3115,
   "diana": 0.117,
   "nova": 0.2368,
   "flow": 0.3347
  },
  "acc": {
   "taro": {
    "n": 3542,
    "acc": 52.2,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 3621
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
    "n": 786,
    "acc": 44.5,
    "adjustedAcc": 45.3,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.0,
    "absoluteN": 807
   },
   "flow": {
    "n": 636,
    "acc": 55.3,
    "adjustedAcc": 54.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 646
   }
  },
  "graded": 4964,
  "team": {
   "basis": "absolute_return",
   "hit": 3242,
   "miss": 1953,
   "n": 5195,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.1187,
    "nova": 0.2753,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 41.8,
     "adjustedAcc": 43.8,
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
     "acc": 62.9,
     "adjustedAcc": 55.5,
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
   "graded": 529,
   "globalBlend": 0.602
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3071,
    "diana": 0.1181,
    "nova": 0.2408,
    "flow": 0.334
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
    "taro": 0.3085,
    "diana": 0.1181,
    "nova": 0.2445,
    "flow": 0.329
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
    "taro": 0.3094,
    "diana": 0.1173,
    "nova": 0.244,
    "flow": 0.3293
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
     "n": 43,
     "acc": 55.8,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 225,
   "globalBlend": 0.78
  },
  "2차전지": {
   "weights": {
    "taro": 0.3184,
    "diana": 0.1156,
    "nova": 0.2459,
    "flow": 0.32
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
    "taro": 0.3134,
    "diana": 0.1172,
    "nova": 0.2222,
    "flow": 0.3473
   },
   "acc": {
    "taro": {
     "n": 443,
     "acc": 53.0,
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
     "n": 163,
     "acc": 33.1,
     "adjustedAcc": 40.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 69.7,
     "adjustedAcc": 57.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 672,
   "globalBlend": 0.543
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3207,
    "diana": 0.1182,
    "nova": 0.2363,
    "flow": 0.3249
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 56.4,
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
   "graded": 313,
   "globalBlend": 0.719
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3147,
    "diana": 0.118,
    "nova": 0.2494,
    "flow": 0.318
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
    "taro": 0.3127,
    "diana": 0.118,
    "nova": 0.2472,
    "flow": 0.3221
   },
   "acc": {
    "taro": {
     "n": 170,
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
   "graded": 226,
   "globalBlend": 0.78
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3141,
    "diana": 0.1162,
    "nova": 0.2404,
    "flow": 0.3293
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 59.6,
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
     "n": 98,
     "acc": 46.9,
     "adjustedAcc": 48.6,
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
   "graded": 218,
   "globalBlend": 0.786
  }
 }
};
