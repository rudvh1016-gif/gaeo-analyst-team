// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 12:01",
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
   "taro": 0.2685,
   "diana": 0.128,
   "nova": 0.2664,
   "flow": 0.3371
  },
  "acc": {
   "taro": {
    "n": 1697,
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
    "n": 285,
    "acc": 44.6,
    "adjustedAcc": 46.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 315,
    "acc": 52.4,
    "adjustedAcc": 51.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2297,
  "team": {
   "hit": 1455,
   "miss": 858,
   "n": 2313,
   "acc": 62.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2654,
    "diana": 0.1288,
    "nova": 0.2773,
    "flow": 0.3285
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 35.8,
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
     "n": 40,
     "acc": 37.5,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 237,
   "globalBlend": 0.771
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1262,
    "nova": 0.2596,
    "flow": 0.3375
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
