// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-31 12:01",
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
   "taro": 0.2918,
   "diana": 0.1282,
   "nova": 0.2774,
   "flow": 0.3026
  },
  "acc": {
   "taro": {
    "n": 2460,
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
    "n": 493,
    "acc": 46.9,
    "adjustedAcc": 47.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 477,
    "acc": 47.6,
    "adjustedAcc": 48.1,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 3430,
  "team": {
   "hit": 2093,
   "miss": 1375,
   "n": 3468,
   "acc": 60.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2908,
    "diana": 0.1298,
    "nova": 0.2828,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 43.0,
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
     "n": 50,
     "acc": 44.0,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 33.3,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2866,
    "diana": 0.1244,
    "nova": 0.2721,
    "flow": 0.3169
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
   "graded": 427,
   "globalBlend": 0.652
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.1271,
    "nova": 0.2727,
    "flow": 0.3054
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
    "taro": 0.2915,
    "diana": 0.1273,
    "nova": 0.2799,
    "flow": 0.3014
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
