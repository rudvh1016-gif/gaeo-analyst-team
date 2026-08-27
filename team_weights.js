// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 14:01",
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
   "taro": 0.2659,
   "diana": 0.1282,
   "nova": 0.2728,
   "flow": 0.333
  },
  "acc": {
   "taro": {
    "n": 1701,
    "acc": 43.3,
    "adjustedAcc": 43.8,
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
    "n": 285,
    "acc": 45.6,
    "adjustedAcc": 46.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 315,
    "acc": 51.7,
    "adjustedAcc": 51.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2301,
  "team": {
   "hit": 1454,
   "miss": 861,
   "n": 2315,
   "acc": 62.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2636,
    "diana": 0.1291,
    "nova": 0.2824,
    "flow": 0.3249
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 35.9,
     "adjustedAcc": 41.5,
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
   "graded": 240,
   "globalBlend": 0.769
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1265,
    "nova": 0.2648,
    "flow": 0.335
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 48.8,
     "adjustedAcc": 49.2,
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
     "acc": 31.2,
     "adjustedAcc": 44.6,
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
   "graded": 274,
   "globalBlend": 0.745
  }
 }
};
