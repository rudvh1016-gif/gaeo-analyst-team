// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 15:31",
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
   "taro": 0.2665,
   "diana": 0.1281,
   "nova": 0.2738,
   "flow": 0.3316
  },
  "acc": {
   "taro": {
    "n": 1701,
    "acc": 43.4,
    "adjustedAcc": 43.9,
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
    "n": 290,
    "acc": 45.9,
    "adjustedAcc": 47.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 312,
    "acc": 51.6,
    "adjustedAcc": 51.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2303,
  "team": {
   "hit": 1450,
   "miss": 866,
   "n": 2316,
   "acc": 62.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2647,
    "diana": 0.1292,
    "nova": 0.283,
    "flow": 0.323
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 36.1,
     "adjustedAcc": 41.7,
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
   "graded": 240,
   "globalBlend": 0.769
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.1264,
    "nova": 0.2656,
    "flow": 0.334
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 48.5,
     "adjustedAcc": 49.1,
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
   "graded": 273,
   "globalBlend": 0.746
  }
 }
};
