// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-28 09:14",
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
   "taro": 0.2727,
   "diana": 0.127,
   "nova": 0.2991,
   "flow": 0.3011
  },
  "acc": {
   "taro": {
    "n": 2075,
    "acc": 44.6,
    "adjustedAcc": 44.9,
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
    "n": 375,
    "acc": 50.4,
    "adjustedAcc": 50.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 388,
    "acc": 47.7,
    "adjustedAcc": 48.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2838,
  "team": {
   "hit": 1734,
   "miss": 1151,
   "n": 2885,
   "acc": 60.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1286,
    "nova": 0.3013,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 41.0,
     "adjustedAcc": 44.2,
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
   "graded": 300,
   "globalBlend": 0.727
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.1247,
    "nova": 0.2915,
    "flow": 0.3079
   },
   "acc": {
    "taro": {
     "n": 251,
     "acc": 47.4,
     "adjustedAcc": 48.2,
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
   "graded": 353,
   "globalBlend": 0.694
  }
 }
};
