// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 15:19",
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
   "taro": 0.268,
   "diana": 0.1287,
   "nova": 0.2681,
   "flow": 0.3352
  },
  "acc": {
   "taro": {
    "n": 1706,
    "acc": 43.5,
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
    "n": 291,
    "acc": 44.7,
    "adjustedAcc": 46.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 316,
    "acc": 51.9,
    "adjustedAcc": 51.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2313,
  "team": {
   "hit": 1457,
   "miss": 859,
   "n": 2316,
   "acc": 62.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.1297,
    "nova": 0.2795,
    "flow": 0.3257
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 35.5,
     "adjustedAcc": 41.3,
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
     "acc": 34.1,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 242,
   "globalBlend": 0.768
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.127,
    "nova": 0.2615,
    "flow": 0.337
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 48.0,
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
