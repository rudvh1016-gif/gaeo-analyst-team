// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 13:44",
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
   "taro": 0.3051,
   "diana": 0.1198,
   "nova": 0.249,
   "flow": 0.3261
  },
  "acc": {
   "taro": {
    "n": 2786,
    "acc": 50.6,
    "adjustedAcc": 50.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 2860
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
    "n": 619,
    "acc": 45.4,
    "adjustedAcc": 46.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 631
   },
   "flow": {
    "n": 533,
    "acc": 53.5,
    "adjustedAcc": 52.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.0,
    "absoluteN": 545
   }
  },
  "graded": 3938,
  "team": {
   "basis": "absolute_return",
   "hit": 2453,
   "miss": 1593,
   "n": 4046,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.121,
    "nova": 0.2786,
    "flow": 0.3133
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
     "n": 71,
     "acc": 63.4,
     "adjustedAcc": 55.0,
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
   "graded": 425,
   "globalBlend": 0.653
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3011,
    "diana": 0.121,
    "nova": 0.2516,
    "flow": 0.3263
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
    "taro": 0.3081,
    "diana": 0.1203,
    "nova": 0.2517,
    "flow": 0.32
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 52.9,
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
   "graded": 211,
   "globalBlend": 0.791
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.1184,
    "nova": 0.2334,
    "flow": 0.3436
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
     "n": 117,
     "acc": 32.5,
     "adjustedAcc": 41.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 52,
     "acc": 76.9,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 517,
   "globalBlend": 0.607
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1204,
    "nova": 0.2471,
    "flow": 0.3189
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 56.0,
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
     "n": 49,
     "acc": 30.6,
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
   "graded": 250,
   "globalBlend": 0.762
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.12,
    "nova": 0.2591,
    "flow": 0.3146
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 51.4,
     "adjustedAcc": 50.9,
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
     "n": 9,
     "acc": 66.7,
     "adjustedAcc": 51.2,
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
   "graded": 251,
   "globalBlend": 0.761
  }
 }
};
