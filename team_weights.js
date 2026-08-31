// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 12:33",
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
   "taro": 0.294,
   "diana": 0.1296,
   "nova": 0.2767,
   "flow": 0.2996
  },
  "acc": {
   "taro": {
    "n": 2459,
    "acc": 46.6,
    "adjustedAcc": 46.8,
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
    "acc": 46.3,
    "adjustedAcc": 47.0,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 473,
    "acc": 46.7,
    "adjustedAcc": 47.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3420,
  "team": {
   "hit": 2073,
   "miss": 1388,
   "n": 3461,
   "acc": 59.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2944,
    "diana": 0.1314,
    "nova": 0.2797,
    "flow": 0.2944
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 43.3,
     "adjustedAcc": 45.5,
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
   "graded": 358,
   "globalBlend": 0.691
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2882,
    "diana": 0.1254,
    "nova": 0.2724,
    "flow": 0.314
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
     "n": 87,
     "acc": 47.1,
     "adjustedAcc": 48.8,
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
   "graded": 425,
   "globalBlend": 0.653
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1282,
    "nova": 0.2721,
    "flow": 0.3031
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
    "taro": 0.293,
    "diana": 0.1284,
    "nova": 0.2794,
    "flow": 0.2991
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
