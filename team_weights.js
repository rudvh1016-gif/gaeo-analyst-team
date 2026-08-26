// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-26 12:43",
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
   "taro": 0.2478,
   "diana": 0.1295,
   "nova": 0.2851,
   "flow": 0.3377
  },
  "acc": {
   "taro": {
    "n": 1294,
    "acc": 40.3,
    "adjustedAcc": 41.1,
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
    "n": 215,
    "acc": 47.0,
    "adjustedAcc": 48.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 236,
    "acc": 52.1,
    "adjustedAcc": 51.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 1745,
  "team": {
   "hit": 1065,
   "miss": 670,
   "n": 1735,
   "acc": 61.4
  }
 },
 "sectors": {
  "바이오·제약": {
   "weights": {
    "taro": 0.2585,
    "diana": 0.1277,
    "nova": 0.2786,
    "flow": 0.3352
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "n": 35,
     "acc": 34.3,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 19,
     "acc": 68.4,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 205,
   "globalBlend": 0.796
  }
 }
};
