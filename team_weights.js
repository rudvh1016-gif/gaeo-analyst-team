// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 10:28",
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
 "method": "role-prior-bayesian-shrinkage-v2",
 "global": {
  "weights": {
   "taro": 0.2876,
   "diana": 0.1271,
   "nova": 0.2823,
   "flow": 0.303
  },
  "acc": {
   "taro": {
    "n": 2453,
    "acc": 46.5,
    "adjustedAcc": 46.7,
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
    "n": 488,
    "acc": 48.0,
    "adjustedAcc": 48.4,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 477,
    "acc": 48.0,
    "adjustedAcc": 48.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3418,
  "team": {
   "hit": 2103,
   "miss": 1361,
   "n": 3464,
   "acc": 60.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2848,
    "diana": 0.1279,
    "nova": 0.2912,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 42.5,
     "adjustedAcc": 44.9,
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
     "acc": 53.1,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 34.5,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 358,
   "globalBlend": 0.691
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2838,
    "diana": 0.1238,
    "nova": 0.2748,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 47.2,
     "adjustedAcc": 48.0,
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
     "acc": 46.1,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 70.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 435,
   "globalBlend": 0.648
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2908,
    "diana": 0.1261,
    "nova": 0.2771,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 49.1,
     "adjustedAcc": 49.5,
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
     "n": 47,
     "acc": 38.3,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 19,
     "acc": 57.9,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 231,
   "globalBlend": 0.776
  },
  "화학·소재": {
   "weights": {
    "taro": 0.288,
    "diana": 0.1264,
    "nova": 0.2838,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 46.2,
     "adjustedAcc": 47.7,
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
     "n": 4,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 42.9,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 218,
   "globalBlend": 0.786
  }
 }
};
