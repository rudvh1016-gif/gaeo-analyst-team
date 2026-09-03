// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 13:47",
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
   "taro": 0.3117,
   "diana": 0.1171,
   "nova": 0.2369,
   "flow": 0.3343
  },
  "acc": {
   "taro": {
    "n": 3542,
    "acc": 52.2,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.1,
    "absoluteN": 3616
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
    "absoluteAcc": 46.9,
    "absoluteN": 806
   },
   "flow": {
    "n": 635,
    "acc": 55.3,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 646
   }
  },
  "graded": 4963,
  "team": {
   "basis": "absolute_return",
   "hit": 3247,
   "miss": 1950,
   "n": 5197,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.1187,
    "nova": 0.2761,
    "flow": 0.318
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
    "taro": 0.3072,
    "diana": 0.1182,
    "nova": 0.2409,
    "flow": 0.3337
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
    "taro": 0.3083,
    "diana": 0.1183,
    "nova": 0.2446,
    "flow": 0.3288
   },
   "acc": {
    "taro": {
     "n": 182,
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
   "graded": 267,
   "globalBlend": 0.75
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3096,
    "diana": 0.1174,
    "nova": 0.244,
    "flow": 0.329
   },
   "acc": {
    "taro": {
     "n": 176,
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
   "graded": 223,
   "globalBlend": 0.782
  },
  "2차전지": {
   "weights": {
    "taro": 0.3186,
    "diana": 0.1156,
    "nova": 0.2463,
    "flow": 0.3195
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 63.1,
     "adjustedAcc": 57.6,
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
   "graded": 206,
   "globalBlend": 0.795
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3132,
    "diana": 0.1173,
    "nova": 0.2223,
    "flow": 0.3472
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 52.9,
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
   "graded": 671,
   "globalBlend": 0.544
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3215,
    "diana": 0.1182,
    "nova": 0.2358,
    "flow": 0.3244
   },
   "acc": {
    "taro": {
     "n": 236,
     "acc": 56.8,
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
     "n": 59,
     "acc": 30.5,
     "adjustedAcc": 43.6,
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
    "taro": 0.3148,
    "diana": 0.1181,
    "nova": 0.2494,
    "flow": 0.3177
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
    "taro": 0.3129,
    "diana": 0.1181,
    "nova": 0.2472,
    "flow": 0.3219
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
    "taro": 0.3143,
    "diana": 0.1163,
    "nova": 0.2405,
    "flow": 0.3289
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
