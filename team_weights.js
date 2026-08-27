// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 11:33",
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
   "taro": 0.2697,
   "diana": 0.1287,
   "nova": 0.2707,
   "flow": 0.3309
  },
  "acc": {
   "taro": {
    "n": 1694,
    "acc": 43.7,
    "adjustedAcc": 44.1,
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
    "n": 284,
    "acc": 45.1,
    "adjustedAcc": 46.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 314,
    "acc": 51.3,
    "adjustedAcc": 50.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2292,
  "team": {
   "hit": 1456,
   "miss": 858,
   "n": 2314,
   "acc": 62.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1296,
    "nova": 0.2811,
    "flow": 0.3235
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 35.0,
     "adjustedAcc": 41.0,
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
     "n": 18,
     "acc": 55.6,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 36.6,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 239,
   "globalBlend": 0.77
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1266,
    "nova": 0.2632,
    "flow": 0.3328
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 49.8,
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
     "acc": 31.9,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 23,
     "acc": 73.9,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 273,
   "globalBlend": 0.746
  }
 }
};
