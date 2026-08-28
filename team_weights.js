// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 15:12",
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
   "taro": 0.2776,
   "diana": 0.1271,
   "nova": 0.293,
   "flow": 0.3023
  },
  "acc": {
   "taro": {
    "n": 2102,
    "acc": 45.2,
    "adjustedAcc": 45.5,
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
    "acc": 49.5,
    "adjustedAcc": 49.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 391,
    "acc": 47.8,
    "adjustedAcc": 48.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2869,
  "team": {
   "hit": 1709,
   "miss": 1182,
   "n": 2891,
   "acc": 59.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.1287,
    "nova": 0.2968,
    "flow": 0.2979
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 40.0,
     "adjustedAcc": 43.5,
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
   "graded": 296,
   "globalBlend": 0.73
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.1244,
    "nova": 0.2871,
    "flow": 0.308
   },
   "acc": {
    "taro": {
     "n": 258,
     "acc": 48.4,
     "adjustedAcc": 48.9,
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
     "acc": 49.3,
     "adjustedAcc": 49.7,
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
   "graded": 361,
   "globalBlend": 0.689
  }
 }
};
