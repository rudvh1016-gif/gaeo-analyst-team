// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 14:31",
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
   "taro": 0.2669,
   "diana": 0.1278,
   "nova": 0.268,
   "flow": 0.3373
  },
  "acc": {
   "taro": {
    "n": 1707,
    "acc": 43.6,
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
    "n": 289,
    "acc": 45.0,
    "adjustedAcc": 46.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 320,
    "acc": 52.5,
    "adjustedAcc": 51.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2316,
  "team": {
   "hit": 1464,
   "miss": 856,
   "n": 2320,
   "acc": 63.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2639,
    "diana": 0.1288,
    "nova": 0.2789,
    "flow": 0.3283
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 35.4,
     "adjustedAcc": 41.2,
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
   "graded": 240,
   "globalBlend": 0.769
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.1262,
    "nova": 0.2612,
    "flow": 0.3382
   },
   "acc": {
    "taro": {
     "n": 203,
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
   "graded": 274,
   "globalBlend": 0.745
  }
 }
};
