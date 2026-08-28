// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 10:14",
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
   "taro": 0.2772,
   "diana": 0.1273,
   "nova": 0.2865,
   "flow": 0.309
  },
  "acc": {
   "taro": {
    "n": 2074,
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
    "n": 378,
    "acc": 48.4,
    "adjustedAcc": 48.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 386,
    "acc": 48.7,
    "adjustedAcc": 49.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2838,
  "team": {
   "hit": 1755,
   "miss": 1126,
   "n": 2881,
   "acc": 60.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1289,
    "nova": 0.2922,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 40.7,
     "adjustedAcc": 44.0,
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
     "n": 51,
     "acc": 31.4,
     "adjustedAcc": 44.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 299,
   "globalBlend": 0.728
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2803,
    "diana": 0.1249,
    "nova": 0.2791,
    "flow": 0.3157
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 48.0,
     "adjustedAcc": 48.7,
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
     "n": 72,
     "acc": 44.4,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 67.9,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 352,
   "globalBlend": 0.694
  }
 }
};
