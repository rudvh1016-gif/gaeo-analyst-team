// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 15:37",
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
   "taro": 0.3073,
   "diana": 0.1204,
   "nova": 0.2478,
   "flow": 0.3245
  },
  "acc": {
   "taro": {
    "n": 2795,
    "acc": 50.7,
    "adjustedAcc": 50.7,
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
    "n": 622,
    "acc": 45.0,
    "adjustedAcc": 45.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 629
   },
   "flow": {
    "n": 535,
    "acc": 53.1,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.3,
    "absoluteN": 544
   }
  },
  "graded": 3952,
  "team": {
   "basis": "absolute_return",
   "hit": 2449,
   "miss": 1595,
   "n": 4044,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.1216,
    "nova": 0.2773,
    "flow": 0.3118
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 40.8,
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
   "graded": 422,
   "globalBlend": 0.655
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3035,
    "diana": 0.1215,
    "nova": 0.25,
    "flow": 0.325
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 45.0,
     "adjustedAcc": 47.4,
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
     "n": 35,
     "acc": 31.4,
     "adjustedAcc": 45.8,
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
   "graded": 221,
   "globalBlend": 0.784
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3101,
    "diana": 0.1206,
    "nova": 0.2504,
    "flow": 0.3188
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 53.6,
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
     "n": 26,
     "acc": 34.6,
     "adjustedAcc": 47.3,
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
   "graded": 212,
   "globalBlend": 0.791
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.1186,
    "nova": 0.2319,
    "flow": 0.3438
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
    "taro": 0.3151,
    "diana": 0.121,
    "nova": 0.2466,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 55.4,
     "adjustedAcc": 53.3,
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
     "n": 20,
     "acc": 40.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 257,
   "globalBlend": 0.757
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.1205,
    "nova": 0.2585,
    "flow": 0.3135
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
     "n": 11,
     "acc": 63.6,
     "adjustedAcc": 51.1,
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
