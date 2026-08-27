// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 14:19",
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
   "taro": 0.2684,
   "diana": 0.1283,
   "nova": 0.2712,
   "flow": 0.3321
  },
  "acc": {
   "taro": {
    "n": 1705,
    "acc": 43.6,
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
    "n": 289,
    "acc": 45.3,
    "adjustedAcc": 46.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 316,
    "acc": 51.6,
    "adjustedAcc": 51.1,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2310,
  "team": {
   "hit": 1457,
   "miss": 861,
   "n": 2318,
   "acc": 62.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.1292,
    "nova": 0.2814,
    "flow": 0.3237
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 35.9,
     "adjustedAcc": 41.5,
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
     "n": 40,
     "acc": 35.0,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 239,
   "globalBlend": 0.77
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1265,
    "nova": 0.2634,
    "flow": 0.3341
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 49.3,
     "adjustedAcc": 49.5,
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
   "graded": 276,
   "globalBlend": 0.743
  }
 }
};
