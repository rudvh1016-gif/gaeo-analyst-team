// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-27 13:31",
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
   "taro": 0.2679,
   "diana": 0.1287,
   "nova": 0.2727,
   "flow": 0.3307
  },
  "acc": {
   "taro": {
    "n": 1695,
    "acc": 43.5,
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
    "n": 286,
    "acc": 45.5,
    "adjustedAcc": 46.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 312,
    "acc": 51.3,
    "adjustedAcc": 50.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 2293,
  "team": {
   "hit": 1455,
   "miss": 857,
   "n": 2312,
   "acc": 62.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.265,
    "diana": 0.1295,
    "nova": 0.2825,
    "flow": 0.3231
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 35.9,
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
   "graded": 243,
   "globalBlend": 0.767
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2757,
    "diana": 0.1268,
    "nova": 0.2645,
    "flow": 0.333
   },
   "acc": {
    "taro": {
     "n": 203,
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
   "graded": 274,
   "globalBlend": 0.745
  }
 }
};
