// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 10:44",
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
   "taro": 0.2787,
   "diana": 0.1272,
   "nova": 0.2845,
   "flow": 0.3096
  },
  "acc": {
   "taro": {
    "n": 2077,
    "acc": 45.4,
    "adjustedAcc": 45.6,
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
    "n": 380,
    "acc": 48.2,
    "adjustedAcc": 48.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 387,
    "acc": 48.8,
    "adjustedAcc": 49.1,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2844,
  "team": {
   "hit": 1763,
   "miss": 1123,
   "n": 2886,
   "acc": 61.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1288,
    "nova": 0.2907,
    "flow": 0.3026
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
    "taro": 0.2803,
    "diana": 0.1247,
    "nova": 0.2793,
    "flow": 0.3157
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 47.6,
     "adjustedAcc": 48.4,
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
     "acc": 46.6,
     "adjustedAcc": 48.7,
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
   "graded": 353,
   "globalBlend": 0.694
  }
 }
};
