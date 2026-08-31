// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 14:27",
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
   "taro": 0.2969,
   "diana": 0.1311,
   "nova": 0.281,
   "flow": 0.291
  },
  "acc": {
   "taro": {
    "n": 2471,
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
    "n": 497,
    "acc": 46.5,
    "adjustedAcc": 47.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 471,
    "acc": 45.0,
    "adjustedAcc": 46.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3439,
  "team": {
   "hit": 2036,
   "miss": 1426,
   "n": 3462,
   "acc": 58.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2997,
    "diana": 0.1332,
    "nova": 0.2784,
    "flow": 0.2887
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 44.1,
     "adjustedAcc": 46.0,
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
     "n": 53,
     "acc": 32.1,
     "adjustedAcc": 44.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 29.8,
     "adjustedAcc": 43.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 366,
   "globalBlend": 0.686
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2888,
    "diana": 0.1265,
    "nova": 0.279,
    "flow": 0.3057
   },
   "acc": {
    "taro": {
     "n": 297,
     "acc": 46.5,
     "adjustedAcc": 47.5,
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
     "n": 88,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 67.6,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 422,
   "globalBlend": 0.655
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.1294,
    "nova": 0.2745,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "acc": 34.0,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 18,
     "acc": 55.6,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 232,
   "globalBlend": 0.775
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1296,
    "nova": 0.283,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 46.3,
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
     "n": 27,
     "acc": 40.7,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  }
 }
};
