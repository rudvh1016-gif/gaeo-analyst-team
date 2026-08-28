// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 13:14",
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
   "taro": 0.2773,
   "diana": 0.1272,
   "nova": 0.2949,
   "flow": 0.3006
  },
  "acc": {
   "taro": {
    "n": 2100,
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
    "acc": 49.7,
    "adjustedAcc": 49.8,
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
  "graded": 2867,
  "team": {
   "hit": 1715,
   "miss": 1174,
   "n": 2889,
   "acc": 59.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1289,
    "nova": 0.2977,
    "flow": 0.2957
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
     "n": 28,
     "acc": 46.4,
     "adjustedAcc": 49.3,
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
   "graded": 300,
   "globalBlend": 0.727
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1245,
    "nova": 0.2891,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 256,
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
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
   "graded": 358,
   "globalBlend": 0.691
  }
 }
};
