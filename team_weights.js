// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-26 09:43",
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
   "taro": 0.2393,
   "diana": 0.1279,
   "nova": 0.2893,
   "flow": 0.3435
  },
  "acc": {
   "taro": {
    "n": 1298,
    "acc": 39.4,
    "adjustedAcc": 40.3,
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
    "acc": 48.4,
    "adjustedAcc": 49.0,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 237,
    "acc": 53.6,
    "adjustedAcc": 52.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 1750,
  "team": {
   "hit": 1081,
   "miss": 658,
   "n": 1739,
   "acc": 62.2
  }
 },
 "sectors": {
  "바이오·제약": {
   "weights": {
    "taro": 0.2508,
    "diana": 0.1265,
    "nova": 0.282,
    "flow": 0.3407
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 49.0,
     "adjustedAcc": 49.4,
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
     "n": 33,
     "acc": 33.3,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 18,
     "acc": 72.2,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 200,
   "globalBlend": 0.8
  }
 }
};
