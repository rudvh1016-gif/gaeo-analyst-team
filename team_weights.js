// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 14:42",
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
   "taro": 0.2779,
   "diana": 0.1271,
   "nova": 0.2938,
   "flow": 0.3012
  },
  "acc": {
   "taro": {
    "n": 2104,
    "acc": 45.3,
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
    "n": 377,
    "acc": 49.6,
    "adjustedAcc": 49.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 390,
    "acc": 47.7,
    "adjustedAcc": 48.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2871,
  "team": {
   "hit": 1712,
   "miss": 1178,
   "n": 2890,
   "acc": 59.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1287,
    "nova": 0.2975,
    "flow": 0.2965
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
     "n": 50,
     "acc": 32.0,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 298,
   "globalBlend": 0.729
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.1244,
    "nova": 0.287,
    "flow": 0.3073
   },
   "acc": {
    "taro": {
     "n": 260,
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
     "n": 74,
     "acc": 48.6,
     "adjustedAcc": 49.5,
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
   "graded": 364,
   "globalBlend": 0.687
  }
 }
};
