// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 16:31",
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
   "taro": 0.2711,
   "diana": 0.1286,
   "nova": 0.2687,
   "flow": 0.3316
  },
  "acc": {
   "taro": {
    "n": 1703,
    "acc": 43.9,
    "adjustedAcc": 44.3,
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
    "acc": 44.8,
    "adjustedAcc": 46.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 313,
    "acc": 51.4,
    "adjustedAcc": 51.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2304,
  "team": {
   "hit": 1451,
   "miss": 863,
   "n": 2314,
   "acc": 62.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2686,
    "diana": 0.1296,
    "nova": 0.279,
    "flow": 0.3228
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 36.6,
     "adjustedAcc": 41.9,
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
     "n": 19,
     "acc": 52.6,
     "adjustedAcc": 50.4,
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
   "graded": 243,
   "globalBlend": 0.767
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.1266,
    "nova": 0.2614,
    "flow": 0.3336
   },
   "acc": {
    "taro": {
     "n": 206,
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
   "graded": 277,
   "globalBlend": 0.743
  }
 }
};
