// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-01 09:14",
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
   "taro": 0.3068,
   "diana": 0.1197,
   "nova": 0.2463,
   "flow": 0.3272
  },
  "acc": {
   "taro": {
    "n": 2768,
    "acc": 50.9,
    "adjustedAcc": 50.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 2845
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
    "n": 607,
    "acc": 45.0,
    "adjustedAcc": 45.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.0,
    "absoluteN": 619
   },
   "flow": {
    "n": 535,
    "acc": 53.6,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.7,
    "absoluteN": 541
   }
  },
  "graded": 3910,
  "team": {
   "basis": "absolute_return",
   "hit": 2460,
   "miss": 1579,
   "n": 4039,
   "uniqueDecisionDays": 7,
   "minDaysForConclusion": 20,
   "acc": 60.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2875,
    "diana": 0.1211,
    "nova": 0.2771,
    "flow": 0.3143
   },
   "acc": {
    "taro": {
     "n": 287,
     "acc": 40.1,
     "adjustedAcc": 43.0,
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
     "n": 67,
     "acc": 64.2,
     "adjustedAcc": 55.1,
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
   "graded": 418,
   "globalBlend": 0.657
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.1208,
    "nova": 0.2481,
    "flow": 0.3275
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 45.9,
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
     "n": 36,
     "acc": 30.6,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 55.4,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 225,
   "globalBlend": 0.78
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3102,
    "diana": 0.12,
    "nova": 0.2493,
    "flow": 0.3205
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
   "graded": 210,
   "globalBlend": 0.792
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3056,
    "diana": 0.1181,
    "nova": 0.2312,
    "flow": 0.3451
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 52.2,
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
     "n": 113,
     "acc": 31.9,
     "adjustedAcc": 41.2,
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
   "graded": 509,
   "globalBlend": 0.611
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3145,
    "diana": 0.1203,
    "nova": 0.2456,
    "flow": 0.3196
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 55.7,
     "adjustedAcc": 53.4,
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
   "graded": 254,
   "globalBlend": 0.759
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3087,
    "diana": 0.1196,
    "nova": 0.2562,
    "flow": 0.3155
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 52.8,
     "adjustedAcc": 51.8,
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
     "n": 27,
     "acc": 37.0,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 248,
   "globalBlend": 0.763
  }
 }
};
