// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 14:16",
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
   "taro": 0.312,
   "diana": 0.1171,
   "nova": 0.2352,
   "flow": 0.3357
  },
  "acc": {
   "taro": {
    "n": 3544,
    "acc": 52.2,
    "adjustedAcc": 52.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 3636
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
    "n": 782,
    "acc": 44.2,
    "adjustedAcc": 45.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.7,
    "absoluteN": 814
   },
   "flow": {
    "n": 635,
    "acc": 55.4,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.8,
    "absoluteN": 647
   }
  },
  "graded": 4961,
  "team": {
   "basis": "absolute_return",
   "hit": 3240,
   "miss": 1962,
   "n": 5202,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.1185,
    "nova": 0.2757,
    "flow": 0.3193
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 41.4,
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
     "n": 77,
     "acc": 48.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 531,
   "globalBlend": 0.601
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.1183,
    "nova": 0.2399,
    "flow": 0.3344
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 48.0,
     "adjustedAcc": 48.8,
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
     "n": 62,
     "acc": 58.1,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 273,
   "globalBlend": 0.746
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3091,
    "diana": 0.1182,
    "nova": 0.2432,
    "flow": 0.3296
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 49.5,
     "adjustedAcc": 49.7,
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
    "taro": 0.3098,
    "diana": 0.1174,
    "nova": 0.2428,
    "flow": 0.33
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
    "taro": 0.3188,
    "diana": 0.1157,
    "nova": 0.2447,
    "flow": 0.3207
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 62.7,
     "adjustedAcc": 57.4,
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
    "taro": 0.3144,
    "diana": 0.1171,
    "nova": 0.2199,
    "flow": 0.3487
   },
   "acc": {
    "taro": {
     "n": 440,
     "acc": 53.4,
     "adjustedAcc": 52.7,
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
     "n": 161,
     "acc": 32.3,
     "adjustedAcc": 39.9,
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
   "graded": 666,
   "globalBlend": 0.546
  },
  "지주·상사": {
   "weights": {
    "taro": 0.321,
    "diana": 0.1183,
    "nova": 0.2351,
    "flow": 0.3256
   },
   "acc": {
    "taro": {
     "n": 236,
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
   "graded": 315,
   "globalBlend": 0.717
  },
  "화학·소재": {
   "weights": {
    "taro": 0.315,
    "diana": 0.1181,
    "nova": 0.2482,
    "flow": 0.3187
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
    "taro": 0.3133,
    "diana": 0.1181,
    "nova": 0.2454,
    "flow": 0.3232
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
   "graded": 223,
   "globalBlend": 0.782
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3154,
    "diana": 0.1163,
    "nova": 0.2383,
    "flow": 0.33
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 60.6,
     "adjustedAcc": 54.9,
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
     "acc": 45.9,
     "adjustedAcc": 48.2,
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
