// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 11:44",
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
   "taro": 0.2788,
   "diana": 0.1275,
   "nova": 0.2879,
   "flow": 0.3059
  },
  "acc": {
   "taro": {
    "n": 2087,
    "acc": 45.3,
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
    "n": 385,
    "acc": 48.6,
    "adjustedAcc": 48.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 392,
    "acc": 48.2,
    "adjustedAcc": 48.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2864,
  "team": {
   "hit": 1744,
   "miss": 1146,
   "n": 2890,
   "acc": 60.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1292,
    "nova": 0.2927,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 40.5,
     "adjustedAcc": 43.9,
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
   "graded": 301,
   "globalBlend": 0.727
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.1249,
    "nova": 0.2836,
    "flow": 0.3112
   },
   "acc": {
    "taro": {
     "n": 254,
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
     "n": 74,
     "acc": 48.6,
     "adjustedAcc": 49.5,
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
