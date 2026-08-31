// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 05:52",
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
   "taro": 0.3083,
   "diana": 0.1211,
   "nova": 0.2371,
   "flow": 0.3335
  },
  "acc": {
   "taro": {
    "n": 2406,
    "acc": 50.6,
    "adjustedAcc": 50.6,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.6,
    "absoluteN": 2460
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
    "n": 494,
    "acc": 42.7,
    "adjustedAcc": 44.1,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.8,
    "absoluteN": 491
   },
   "flow": {
    "n": 472,
    "acc": 54.0,
    "adjustedAcc": 53.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.8,
    "absoluteN": 474
   }
  },
  "graded": 3372,
  "team": {
   "basis": "absolute_return",
   "hit": 2075,
   "miss": 1388,
   "n": 3463,
   "uniqueDecisionDays": 6,
   "minDaysForConclusion": 20,
   "acc": 59.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.1235,
    "nova": 0.263,
    "flow": 0.3193
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 40.2,
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
     "n": 55,
     "acc": 56.4,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 39.0,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 370,
   "globalBlend": 0.684
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3075,
    "diana": 0.1191,
    "nova": 0.2279,
    "flow": 0.3455
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 52.8,
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
     "n": 90,
     "acc": 31.1,
     "adjustedAcc": 41.9,
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
   "graded": 433,
   "globalBlend": 0.649
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3131,
    "diana": 0.1216,
    "nova": 0.2395,
    "flow": 0.3258
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 54.1,
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
     "n": 44,
     "acc": 31.8,
     "adjustedAcc": 45.1,
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
    "taro": 0.3077,
    "diana": 0.1211,
    "nova": 0.2493,
    "flow": 0.322
   },
   "acc": {
    "taro": {
     "n": 192,
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
   "graded": 226,
   "globalBlend": 0.78
  }
 }
};
