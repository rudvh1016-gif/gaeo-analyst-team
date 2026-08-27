// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 13:50",
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
   "taro": 0.2664,
   "diana": 0.1285,
   "nova": 0.2725,
   "flow": 0.3326
  },
  "acc": {
   "taro": {
    "n": 1704,
    "acc": 43.3,
    "adjustedAcc": 43.8,
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
    "n": 288,
    "acc": 45.5,
    "adjustedAcc": 46.8,
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
  "graded": 2308,
  "team": {
   "hit": 1456,
   "miss": 861,
   "n": 2317,
   "acc": 62.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2638,
    "diana": 0.1293,
    "nova": 0.2823,
    "flow": 0.3246
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 35.7,
     "adjustedAcc": 41.4,
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
     "acc": 36.6,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 241,
   "globalBlend": 0.768
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1267,
    "nova": 0.2644,
    "flow": 0.3345
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 49.0,
     "adjustedAcc": 49.4,
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
   "graded": 275,
   "globalBlend": 0.744
  }
 }
};
