// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 11:30",
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
   "diana": 0.1282,
   "nova": 0.2758,
   "flow": 0.3033
  },
  "acc": {
   "taro": {
    "n": 2454,
    "acc": 46.8,
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
    "n": 487,
    "acc": 46.6,
    "adjustedAcc": 47.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 476,
    "acc": 47.7,
    "adjustedAcc": 48.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3417,
  "team": {
   "hit": 2099,
   "miss": 1367,
   "n": 3466,
   "acc": 60.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2913,
    "diana": 0.1295,
    "nova": 0.2827,
    "flow": 0.2965
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
     "n": 46,
     "acc": 45.7,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 32.1,
     "adjustedAcc": 44.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 354,
   "globalBlend": 0.693
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2887,
    "diana": 0.1246,
    "nova": 0.2688,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 47.8,
     "adjustedAcc": 48.4,
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
     "acc": 44.3,
     "adjustedAcc": 47.6,
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
    "taro": 0.2951,
    "diana": 0.127,
    "nova": 0.2716,
    "flow": 0.3063
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
     "n": 48,
     "acc": 37.5,
     "adjustedAcc": 46.4,
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
   "graded": 233,
   "globalBlend": 0.774
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2924,
    "diana": 0.1272,
    "nova": 0.2785,
    "flow": 0.3019
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 46.8,
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
