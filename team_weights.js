// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 10:44",
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
   "taro": 0.3063,
   "diana": 0.1194,
   "nova": 0.2507,
   "flow": 0.3236
  },
  "acc": {
   "taro": {
    "n": 2787,
    "acc": 50.9,
    "adjustedAcc": 50.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.7,
    "absoluteN": 2864
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
    "n": 616,
    "acc": 45.8,
    "adjustedAcc": 46.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.9,
    "absoluteN": 626
   },
   "flow": {
    "n": 533,
    "acc": 53.3,
    "adjustedAcc": 52.7,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.8,
    "absoluteN": 542
   }
  },
  "graded": 3936,
  "team": {
   "basis": "absolute_return",
   "hit": 2460,
   "miss": 1582,
   "n": 4042,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.1205,
    "nova": 0.2817,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 40.5,
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
     "n": 70,
     "acc": 65.7,
     "adjustedAcc": 55.8,
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
    "taro": 0.3027,
    "diana": 0.1208,
    "nova": 0.2525,
    "flow": 0.3241
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 44.7,
     "adjustedAcc": 47.2,
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
     "n": 54,
     "acc": 53.7,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 221,
   "globalBlend": 0.784
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3106,
    "diana": 0.1197,
    "nova": 0.2525,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 55.0,
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
    "taro": 0.3055,
    "diana": 0.1182,
    "nova": 0.2365,
    "flow": 0.3398
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
     "n": 115,
     "acc": 33.9,
     "adjustedAcc": 42.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 52,
     "acc": 75.0,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 515,
   "globalBlend": 0.608
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3153,
    "diana": 0.12,
    "nova": 0.2478,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 56.6,
     "adjustedAcc": 54.0,
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
   "graded": 251,
   "globalBlend": 0.761
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.1196,
    "nova": 0.2603,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 51.9,
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
   "graded": 253,
   "globalBlend": 0.76
  }
 }
};
