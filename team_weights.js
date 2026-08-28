// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 16:11",
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
   "taro": 0.2758,
   "diana": 0.1268,
   "nova": 0.2976,
   "flow": 0.2998
  },
  "acc": {
   "taro": {
    "n": 2104,
    "acc": 45.1,
    "adjustedAcc": 45.4,
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
    "n": 376,
    "acc": 50.3,
    "adjustedAcc": 50.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 391,
    "acc": 47.6,
    "adjustedAcc": 48.1,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2871,
  "team": {
   "hit": 1694,
   "miss": 1195,
   "n": 2889,
   "acc": 58.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1284,
    "nova": 0.3001,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 40.3,
     "adjustedAcc": 43.7,
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
     "n": 27,
     "acc": 48.1,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 49,
     "acc": 32.7,
     "adjustedAcc": 45.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 297,
   "globalBlend": 0.729
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1241,
    "nova": 0.2914,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 48.2,
     "adjustedAcc": 48.8,
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
     "n": 73,
     "acc": 50.7,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 30,
     "acc": 63.3,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 360,
   "globalBlend": 0.69
  }
 }
};
