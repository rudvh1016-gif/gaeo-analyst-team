// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 13:36",
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
   "taro": 0.2932,
   "diana": 0.1295,
   "nova": 0.2787,
   "flow": 0.2987
  },
  "acc": {
   "taro": {
    "n": 2467,
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
    "n": 493,
    "acc": 46.7,
    "adjustedAcc": 47.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 476,
    "acc": 46.6,
    "adjustedAcc": 47.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3436,
  "team": {
   "hit": 2067,
   "miss": 1396,
   "n": 3463,
   "acc": 59.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2931,
    "diana": 0.1313,
    "nova": 0.2819,
    "flow": 0.2938
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 42.9,
     "adjustedAcc": 45.2,
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
     "n": 48,
     "acc": 39.6,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 30.9,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 355,
   "globalBlend": 0.693
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.1252,
    "nova": 0.2734,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 47.3,
     "adjustedAcc": 48.1,
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
     "acc": 47.2,
     "adjustedAcc": 48.8,
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
   "graded": 428,
   "globalBlend": 0.651
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2959,
    "diana": 0.1281,
    "nova": 0.2737,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 49.4,
     "adjustedAcc": 49.7,
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
     "acc": 36.7,
     "adjustedAcc": 46.2,
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
   "graded": 233,
   "globalBlend": 0.774
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2924,
    "diana": 0.1283,
    "nova": 0.281,
    "flow": 0.2984
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
     "n": 28,
     "acc": 42.9,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 220,
   "globalBlend": 0.784
  }
 }
};
