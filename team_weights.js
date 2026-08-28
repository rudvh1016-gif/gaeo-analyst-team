// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 09:44",
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
   "diana": 0.1278,
   "nova": 0.2876,
   "flow": 0.3073
  },
  "acc": {
   "taro": {
    "n": 2079,
    "acc": 45.0,
    "adjustedAcc": 45.3,
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
    "acc": 48.4,
    "adjustedAcc": 48.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 387,
    "acc": 48.3,
    "adjustedAcc": 48.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2846,
  "team": {
   "hit": 1746,
   "miss": 1142,
   "n": 2888,
   "acc": 60.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1292,
    "nova": 0.2929,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 40.9,
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
   "graded": 298,
   "globalBlend": 0.729
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.1252,
    "nova": 0.281,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 47.5,
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
     "n": 76,
     "acc": 46.1,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 30,
     "acc": 66.7,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  }
 }
};
