// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-26 09:13",
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
   "taro": 0.2476,
   "diana": 0.1284,
   "nova": 0.2838,
   "flow": 0.3402
  },
  "acc": {
   "taro": {
    "n": 1293,
    "acc": 40.5,
    "adjustedAcc": 41.3,
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
    "n": 210,
    "acc": 47.1,
    "adjustedAcc": 48.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 244,
    "acc": 52.9,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 1747,
  "team": {
   "hit": 1092,
   "miss": 650,
   "n": 1742,
   "acc": 62.7
  }
 },
 "sectors": {
  "바이오·제약": {
   "weights": {
    "taro": 0.2571,
    "diana": 0.127,
    "nova": 0.2784,
    "flow": 0.3376
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 48.3,
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
     "n": 34,
     "acc": 35.3,
     "adjustedAcc": 46.8,
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
   "graded": 200,
   "globalBlend": 0.8
  }
 }
};
