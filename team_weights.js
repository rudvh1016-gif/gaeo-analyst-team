// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 10:14",
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
   "taro": 0.3078,
   "diana": 0.12,
   "nova": 0.2462,
   "flow": 0.326
  },
  "acc": {
   "taro": {
    "n": 2790,
    "acc": 50.9,
    "adjustedAcc": 50.9,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 2861
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
    "n": 615,
    "acc": 44.9,
    "adjustedAcc": 45.7,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 627
   },
   "flow": {
    "n": 530,
    "acc": 53.4,
    "adjustedAcc": 52.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.7,
    "absoluteN": 546
   }
  },
  "graded": 3935,
  "team": {
   "basis": "absolute_return",
   "hit": 2458,
   "miss": 1585,
   "n": 4043,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2884,
    "diana": 0.1209,
    "nova": 0.278,
    "flow": 0.3126
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 40.7,
     "adjustedAcc": 43.4,
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
     "n": 69,
     "acc": 65.2,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 43.8,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3051,
    "diana": 0.1213,
    "nova": 0.2474,
    "flow": 0.3261
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 45.8,
     "adjustedAcc": 47.8,
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
     "n": 34,
     "acc": 26.5,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 54,
     "acc": 53.7,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.312,
    "diana": 0.1201,
    "nova": 0.2488,
    "flow": 0.3191
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 55.3,
     "adjustedAcc": 52.9,
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
     "n": 26,
     "acc": 34.6,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 46.7,
     "adjustedAcc": 49.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 212,
   "globalBlend": 0.791
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.1185,
    "nova": 0.2314,
    "flow": 0.3438
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 52.0,
     "adjustedAcc": 51.5,
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
     "n": 113,
     "acc": 31.9,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 78.0,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 509,
   "globalBlend": 0.611
  },
  "지주·상사": {
   "weights": {
    "taro": 0.316,
    "diana": 0.1205,
    "nova": 0.2449,
    "flow": 0.3186
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 56.2,
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
     "n": 51,
     "acc": 31.4,
     "adjustedAcc": 44.4,
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
   "graded": 255,
   "globalBlend": 0.758
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3088,
    "diana": 0.1202,
    "nova": 0.2565,
    "flow": 0.3146
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 51.6,
     "adjustedAcc": 51.0,
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
     "n": 10,
     "acc": 60.0,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 35.7,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 255,
   "globalBlend": 0.758
  }
 }
};
