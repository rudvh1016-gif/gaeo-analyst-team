// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 06:07",
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
   "taro": 0.3085,
   "diana": 0.1221,
   "nova": 0.2398,
   "flow": 0.3296
  },
  "acc": {
   "taro": {
    "n": 2413,
    "acc": 50.4,
    "adjustedAcc": 50.3,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.5,
    "absoluteN": 2468
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
    "n": 488,
    "acc": 42.8,
    "adjustedAcc": 44.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.1,
    "absoluteN": 495
   },
   "flow": {
    "n": 470,
    "acc": 53.2,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 45.3,
    "absoluteN": 468
   }
  },
  "graded": 3371,
  "team": {
   "basis": "absolute_return",
   "hit": 2041,
   "miss": 1415,
   "n": 3456,
   "uniqueDecisionDays": 6,
   "minDaysForConclusion": 20,
   "acc": 59.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.1247,
    "nova": 0.2617,
    "flow": 0.3167
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 40.9,
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
     "n": 50,
     "acc": 52.0,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 37.3,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 361,
   "globalBlend": 0.689
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.306,
    "diana": 0.1198,
    "nova": 0.2309,
    "flow": 0.3433
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 52.0,
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
     "n": 90,
     "acc": 32.2,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 82.5,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 434,
   "globalBlend": 0.648
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3126,
    "diana": 0.1224,
    "nova": 0.2423,
    "flow": 0.3228
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 53.4,
     "adjustedAcc": 52.0,
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
     "n": 45,
     "acc": 33.3,
     "adjustedAcc": 45.5,
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
   "graded": 225,
   "globalBlend": 0.78
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3078,
    "diana": 0.1219,
    "nova": 0.2513,
    "flow": 0.319
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 50.5,
     "adjustedAcc": 50.3,
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
     "n": 25,
     "acc": 36.0,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 224,
   "globalBlend": 0.781
  }
 }
};
