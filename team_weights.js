// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 12:44",
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
   "taro": 0.3048,
   "diana": 0.1195,
   "nova": 0.249,
   "flow": 0.3267
  },
  "acc": {
   "taro": {
    "n": 2793,
    "acc": 50.7,
    "adjustedAcc": 50.7,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 2852
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
    "acc": 45.5,
    "adjustedAcc": 46.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.7,
    "absoluteN": 633
   },
   "flow": {
    "n": 533,
    "acc": 53.7,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.1,
    "absoluteN": 541
   }
  },
  "graded": 3948,
  "team": {
   "basis": "absolute_return",
   "hit": 2455,
   "miss": 1587,
   "n": 4042,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.1209,
    "nova": 0.2786,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 40.8,
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
   "graded": 427,
   "globalBlend": 0.652
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1208,
    "nova": 0.2516,
    "flow": 0.3268
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
    "taro": 0.3078,
    "diana": 0.12,
    "nova": 0.2517,
    "flow": 0.3204
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
    "taro": 0.3049,
    "diana": 0.1182,
    "nova": 0.2339,
    "flow": 0.3431
   },
   "acc": {
    "taro": {
     "n": 349,
     "acc": 52.1,
     "adjustedAcc": 51.6,
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
     "acc": 32.8,
     "adjustedAcc": 41.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 76.5,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 516,
   "globalBlend": 0.608
  },
  "지주·상사": {
   "weights": {
    "taro": 0.313,
    "diana": 0.1201,
    "nova": 0.2476,
    "flow": 0.3193
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 55.7,
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
     "n": 50,
     "acc": 32.0,
     "adjustedAcc": 44.7,
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
   "graded": 252,
   "globalBlend": 0.76
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.1199,
    "nova": 0.2593,
    "flow": 0.3153
   },
   "acc": {
    "taro": {
     "n": 214,
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
