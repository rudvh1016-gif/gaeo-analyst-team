// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 14:55",
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
   "taro": 0.2947,
   "diana": 0.1304,
   "nova": 0.2835,
   "flow": 0.2914
  },
  "acc": {
   "taro": {
    "n": 2468,
    "acc": 46.5,
    "adjustedAcc": 46.6,
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
    "n": 495,
    "acc": 47.1,
    "adjustedAcc": 47.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 468,
    "acc": 45.3,
    "adjustedAcc": 46.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3431,
  "team": {
   "hit": 2041,
   "miss": 1415,
   "n": 3456,
   "acc": 59.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2973,
    "diana": 0.1325,
    "nova": 0.2811,
    "flow": 0.2891
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 44.0,
     "adjustedAcc": 45.9,
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
     "acc": 34.0,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 30.4,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 366,
   "globalBlend": 0.686
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2885,
    "diana": 0.126,
    "nova": 0.2798,
    "flow": 0.3057
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 47.1,
     "adjustedAcc": 47.9,
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
     "n": 87,
     "acc": 49.4,
     "adjustedAcc": 49.8,
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
   "graded": 417,
   "globalBlend": 0.657
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2972,
    "diana": 0.1289,
    "nova": 0.277,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 168,
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
     "acc": 35.4,
     "adjustedAcc": 45.8,
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
    "taro": 0.2938,
    "diana": 0.1291,
    "nova": 0.2849,
    "flow": 0.2922
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
