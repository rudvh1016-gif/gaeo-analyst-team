// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 12:31",
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
   "taro": 0.2694,
   "diana": 0.1284,
   "nova": 0.2722,
   "flow": 0.33
  },
  "acc": {
   "taro": {
    "n": 1694,
    "acc": 43.7,
    "adjustedAcc": 44.2,
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
    "n": 286,
    "acc": 45.5,
    "adjustedAcc": 46.8,
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
  "graded": 2294,
  "team": {
   "hit": 1456,
   "miss": 855,
   "n": 2311,
   "acc": 63.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2673,
    "diana": 0.1294,
    "nova": 0.2817,
    "flow": 0.3216
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 36.6,
     "adjustedAcc": 41.9,
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
     "n": 19,
     "acc": 52.6,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 243,
   "globalBlend": 0.767
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2769,
    "diana": 0.1264,
    "nova": 0.2645,
    "flow": 0.3322
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 49.5,
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
   "graded": 272,
   "globalBlend": 0.746
  }
 }
};
