// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 13:01",
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
   "taro": 0.2681,
   "diana": 0.1284,
   "nova": 0.2733,
   "flow": 0.3301
  },
  "acc": {
   "taro": {
    "n": 1694,
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
    "n": 287,
    "acc": 45.6,
    "adjustedAcc": 46.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 314,
    "acc": 51.3,
    "adjustedAcc": 50.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2295,
  "team": {
   "hit": 1457,
   "miss": 854,
   "n": 2311,
   "acc": 63.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2655,
    "diana": 0.1292,
    "nova": 0.2827,
    "flow": 0.3225
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 36.3,
     "adjustedAcc": 41.7,
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
    "taro": 0.2761,
    "diana": 0.1265,
    "nova": 0.2649,
    "flow": 0.3324
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 49.5,
     "adjustedAcc": 49.7,
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
   "graded": 273,
   "globalBlend": 0.746
  }
 }
};
