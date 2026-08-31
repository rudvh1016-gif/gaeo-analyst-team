// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 09:25",
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
   "taro": 0.2877,
   "diana": 0.1264,
   "nova": 0.2824,
   "flow": 0.3035
  },
  "acc": {
   "taro": {
    "n": 2464,
    "acc": 46.7,
    "adjustedAcc": 46.9,
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
    "n": 500,
    "acc": 48.2,
    "adjustedAcc": 48.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 474,
    "acc": 48.3,
    "adjustedAcc": 48.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3438,
  "team": {
   "hit": 2089,
   "miss": 1375,
   "n": 3464,
   "acc": 60.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2847,
    "diana": 0.1274,
    "nova": 0.291,
    "flow": 0.2969
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
     "n": 53,
     "acc": 52.8,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 56,
     "acc": 35.7,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.1232,
    "nova": 0.2754,
    "flow": 0.3177
   },
   "acc": {
    "taro": {
     "n": 303,
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
   "graded": 432,
   "globalBlend": 0.649
  },
  "지주·상사": {
   "weights": {
    "taro": 0.291,
    "diana": 0.1254,
    "nova": 0.2769,
    "flow": 0.3067
   },
   "acc": {
    "taro": {
     "n": 163,
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
     "acc": 38.3,
     "adjustedAcc": 46.7,
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
   "graded": 228,
   "globalBlend": 0.778
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.1261,
    "nova": 0.2843,
    "flow": 0.302
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 45.5,
     "adjustedAcc": 47.2,
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
   "graded": 218,
   "globalBlend": 0.786
  }
 }
};
