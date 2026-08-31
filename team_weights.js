// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 09:56",
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
   "taro": 0.292,
   "diana": 0.1284,
   "nova": 0.2791,
   "flow": 0.3005
  },
  "acc": {
   "taro": {
    "n": 2461,
    "acc": 46.7,
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
    "n": 493,
    "acc": 47.1,
    "adjustedAcc": 47.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 472,
    "acc": 47.2,
    "adjustedAcc": 47.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3426,
  "team": {
   "hit": 2082,
   "miss": 1383,
   "n": 3465,
   "acc": 60.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2916,
    "diana": 0.1303,
    "nova": 0.2823,
    "flow": 0.2958
   },
   "acc": {
    "taro": {
     "n": 254,
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
     "n": 49,
     "acc": 40.8,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 32.7,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 358,
   "globalBlend": 0.691
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.1246,
    "nova": 0.2733,
    "flow": 0.3157
   },
   "acc": {
    "taro": {
     "n": 301,
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
     "n": 88,
     "acc": 46.6,
     "adjustedAcc": 48.6,
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
   "graded": 430,
   "globalBlend": 0.65
  },
  "지주·상사": {
   "weights": {
    "taro": 0.295,
    "diana": 0.127,
    "nova": 0.2734,
    "flow": 0.3046
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
     "acc": 61.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 233,
   "globalBlend": 0.774
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.1274,
    "nova": 0.2812,
    "flow": 0.2998
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
