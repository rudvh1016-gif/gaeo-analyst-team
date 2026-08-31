// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 15:25",
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
   "taro": 0.297,
   "diana": 0.1313,
   "nova": 0.2856,
   "flow": 0.2862
  },
  "acc": {
   "taro": {
    "n": 2477,
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
    "n": 501,
    "acc": 47.1,
    "adjustedAcc": 47.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 472,
    "acc": 44.3,
    "adjustedAcc": 45.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3450,
  "team": {
   "hit": 2043,
   "miss": 1420,
   "n": 3463,
   "acc": 59.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.1333,
    "nova": 0.2822,
    "flow": 0.2852
   },
   "acc": {
    "taro": {
     "n": 259,
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
     "n": 54,
     "acc": 33.3,
     "adjustedAcc": 44.8,
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
   "graded": 370,
   "globalBlend": 0.684
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2902,
    "diana": 0.1268,
    "nova": 0.2823,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 47.0,
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
     "n": 88,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 64.9,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2994,
    "diana": 0.1296,
    "nova": 0.2781,
    "flow": 0.2929
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
    "diana": 0.1299,
    "nova": 0.2868,
    "flow": 0.2878
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 46.0,
     "adjustedAcc": 47.6,
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
     "acc": 39.3,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 221,
   "globalBlend": 0.784
  }
 }
};
