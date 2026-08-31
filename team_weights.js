// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 10:59",
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
   "taro": 0.2898,
   "diana": 0.1277,
   "nova": 0.2788,
   "flow": 0.3037
  },
  "acc": {
   "taro": {
    "n": 2452,
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
    "n": 487,
    "acc": 47.2,
    "adjustedAcc": 47.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 478,
    "acc": 47.9,
    "adjustedAcc": 48.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3417,
  "team": {
   "hit": 2103,
   "miss": 1367,
   "n": 3470,
   "acc": 60.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.1291,
    "nova": 0.2863,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 42.2,
     "adjustedAcc": 44.7,
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
     "acc": 47.9,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 33.9,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 360,
   "globalBlend": 0.69
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.1241,
    "nova": 0.2712,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 302,
     "acc": 48.0,
     "adjustedAcc": 48.6,
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
     "acc": 44.9,
     "adjustedAcc": 47.8,
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
   "graded": 432,
   "globalBlend": 0.649
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.1266,
    "nova": 0.2744,
    "flow": 0.3066
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
    "taro": 0.2899,
    "diana": 0.1269,
    "nova": 0.2809,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 46.5,
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
   "graded": 219,
   "globalBlend": 0.785
  }
 }
};
