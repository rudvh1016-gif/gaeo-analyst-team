// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 15:55",
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
   "taro": 0.3071,
   "diana": 0.1219,
   "nova": 0.2437,
   "flow": 0.3274
  },
  "acc": {
   "taro": {
    "n": 2409,
    "acc": 50.3,
    "adjustedAcc": 50.3,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.6,
    "absoluteN": 2479
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
    "n": 491,
    "acc": 43.6,
    "adjustedAcc": 44.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.3,
    "absoluteN": 503
   },
   "flow": {
    "n": 466,
    "acc": 53.0,
    "adjustedAcc": 52.4,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 44.3,
    "absoluteN": 474
   }
  },
  "graded": 3366,
  "team": {
   "basis": "absolute_return",
   "hit": 2041,
   "miss": 1423,
   "n": 3464,
   "uniqueDecisionDays": 6,
   "minDaysForConclusion": 20,
   "acc": 58.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1245,
    "nova": 0.2641,
    "flow": 0.3156
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
     "n": 58,
     "acc": 37.9,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 360,
   "globalBlend": 0.69
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.305,
    "diana": 0.1196,
    "nova": 0.2338,
    "flow": 0.3416
   },
   "acc": {
    "taro": {
     "n": 302,
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
     "n": 89,
     "acc": 32.6,
     "adjustedAcc": 42.6,
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
   "graded": 431,
   "globalBlend": 0.65
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3123,
    "diana": 0.122,
    "nova": 0.2453,
    "flow": 0.3205
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 54.7,
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
     "n": 44,
     "acc": 34.1,
     "adjustedAcc": 45.7,
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
   "graded": 222,
   "globalBlend": 0.783
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3067,
    "diana": 0.1217,
    "nova": 0.2543,
    "flow": 0.3174
   },
   "acc": {
    "taro": {
     "n": 188,
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
   "graded": 222,
   "globalBlend": 0.783
  }
 }
};
