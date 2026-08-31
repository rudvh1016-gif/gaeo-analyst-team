// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 13:05",
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
   "taro": 0.2927,
   "diana": 0.1291,
   "nova": 0.2791,
   "flow": 0.2991
  },
  "acc": {
   "taro": {
    "n": 2460,
    "acc": 46.6,
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
    "n": 491,
    "acc": 46.8,
    "adjustedAcc": 47.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 474,
    "acc": 46.8,
    "adjustedAcc": 47.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3425,
  "team": {
   "hit": 2075,
   "miss": 1388,
   "n": 3463,
   "acc": 59.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1311,
    "nova": 0.2815,
    "flow": 0.2941
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 43.1,
     "adjustedAcc": 45.3,
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
     "acc": 38.8,
     "adjustedAcc": 46.7,
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
   "graded": 359,
   "globalBlend": 0.69
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.125,
    "nova": 0.2744,
    "flow": 0.3135
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
     "n": 88,
     "acc": 47.7,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 70.0,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 426,
   "globalBlend": 0.653
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1277,
    "nova": 0.2739,
    "flow": 0.3026
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
   "graded": 234,
   "globalBlend": 0.774
  },
  "화학·소재": {
   "weights": {
    "taro": 0.292,
    "diana": 0.128,
    "nova": 0.2813,
    "flow": 0.2988
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
