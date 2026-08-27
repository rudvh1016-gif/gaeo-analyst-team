// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 15:01",
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
   "taro": 0.2682,
   "diana": 0.1284,
   "nova": 0.2724,
   "flow": 0.331
  },
  "acc": {
   "taro": {
    "n": 1702,
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
    "n": 290,
    "acc": 45.5,
    "adjustedAcc": 46.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 317,
    "acc": 51.4,
    "adjustedAcc": 51.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2309,
  "team": {
   "hit": 1453,
   "miss": 864,
   "n": 2317,
   "acc": 62.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.1294,
    "nova": 0.2825,
    "flow": 0.3224
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
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 240,
   "globalBlend": 0.769
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2752,
    "diana": 0.1267,
    "nova": 0.2646,
    "flow": 0.3336
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 48.5,
     "adjustedAcc": 49.1,
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
