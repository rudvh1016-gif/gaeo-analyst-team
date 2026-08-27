// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 09:11",
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
   "taro": 0.2653,
   "diana": 0.1298,
   "nova": 0.2759,
   "flow": 0.329
  },
  "acc": {
   "taro": {
    "n": 1684,
    "acc": 42.8,
    "adjustedAcc": 43.3,
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
    "n": 283,
    "acc": 45.6,
    "adjustedAcc": 46.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 314,
    "acc": 50.6,
    "adjustedAcc": 50.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2281,
  "team": {
   "hit": 1477,
   "miss": 842,
   "n": 2319,
   "acc": 63.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2622,
    "diana": 0.1302,
    "nova": 0.2852,
    "flow": 0.3225
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 34.7,
     "adjustedAcc": 41.0,
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
     "n": 17,
     "acc": 58.8,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 36.8,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 228,
   "globalBlend": 0.778
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1276,
    "nova": 0.268,
    "flow": 0.3307
   },
   "acc": {
    "taro": {
     "n": 201,
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
     "acc": 33.3,
     "adjustedAcc": 45.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 24,
     "acc": 70.8,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 273,
   "globalBlend": 0.746
  }
 }
};
