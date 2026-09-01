// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 14:37",
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
   "taro": 0.306,
   "diana": 0.1201,
   "nova": 0.2471,
   "flow": 0.3269
  },
  "acc": {
   "taro": {
    "n": 2793,
    "acc": 50.7,
    "adjustedAcc": 50.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.8,
    "absoluteN": 2859
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
    "n": 620,
    "acc": 45.0,
    "adjustedAcc": 45.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 630
   },
   "flow": {
    "n": 531,
    "acc": 53.5,
    "adjustedAcc": 52.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.4,
    "absoluteN": 540
   }
  },
  "graded": 3944,
  "team": {
   "basis": "absolute_return",
   "hit": 2455,
   "miss": 1588,
   "n": 4043,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2877,
    "diana": 0.1215,
    "nova": 0.2772,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 288,
     "acc": 40.3,
     "adjustedAcc": 43.1,
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
     "n": 70,
     "acc": 62.9,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 63,
     "acc": 42.9,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 421,
   "globalBlend": 0.655
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3017,
    "diana": 0.1213,
    "nova": 0.25,
    "flow": 0.3269
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 44.4,
     "adjustedAcc": 47.0,
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
     "n": 55,
     "acc": 54.5,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 224,
   "globalBlend": 0.781
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3096,
    "diana": 0.1203,
    "nova": 0.2493,
    "flow": 0.3208
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 54.0,
     "adjustedAcc": 52.1,
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
     "n": 25,
     "acc": 32.0,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 47.8,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 210,
   "globalBlend": 0.792
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3049,
    "diana": 0.1185,
    "nova": 0.2314,
    "flow": 0.3453
   },
   "acc": {
    "taro": {
     "n": 348,
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
     "n": 116,
     "acc": 31.9,
     "adjustedAcc": 41.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 78.4,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 515,
   "globalBlend": 0.608
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3148,
    "diana": 0.1206,
    "nova": 0.2452,
    "flow": 0.3195
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
     "n": 50,
     "acc": 30.0,
     "adjustedAcc": 44.1,
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
   "graded": 254,
   "globalBlend": 0.759
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3067,
    "diana": 0.1204,
    "nova": 0.2574,
    "flow": 0.3155
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 50.9,
     "adjustedAcc": 50.6,
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
   "graded": 254,
   "globalBlend": 0.759
  }
 }
};
