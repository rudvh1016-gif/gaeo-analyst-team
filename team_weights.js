// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 12:14",
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
   "taro": 0.278,
   "diana": 0.1276,
   "nova": 0.2908,
   "flow": 0.3036
  },
  "acc": {
   "taro": {
    "n": 2087,
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
    "n": 382,
    "acc": 49.0,
    "adjustedAcc": 49.2,
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
  "graded": 2860,
  "team": {
   "hit": 1739,
   "miss": 1148,
   "n": 2887,
   "acc": 60.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2782,
    "diana": 0.1292,
    "nova": 0.2948,
    "flow": 0.2978
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
    "taro": 0.2794,
    "diana": 0.125,
    "nova": 0.2862,
    "flow": 0.3095
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 47.4,
     "adjustedAcc": 48.3,
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
   "graded": 356,
   "globalBlend": 0.692
  }
 }
};
