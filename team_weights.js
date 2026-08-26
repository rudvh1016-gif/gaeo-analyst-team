// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-26 16:25",
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
   "taro": 0.2522,
   "diana": 0.1293,
   "nova": 0.2798,
   "flow": 0.3386
  },
  "acc": {
   "taro": {
    "n": 1299,
    "acc": 41.0,
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
    "n": 217,
    "acc": 46.1,
    "adjustedAcc": 47.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 239,
    "acc": 52.3,
    "adjustedAcc": 51.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 1755,
  "team": {
   "hit": 1056,
   "miss": 685,
   "n": 1741,
   "acc": 60.7
  }
 },
 "sectors": {
  "바이오·제약": {
   "weights": {
    "taro": 0.262,
    "diana": 0.1275,
    "nova": 0.2748,
    "flow": 0.3358
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
   "graded": 201,
   "globalBlend": 0.799
  }
 }
};
