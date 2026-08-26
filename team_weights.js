// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-26 11:13",
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
   "taro": 0.2413,
   "diana": 0.129,
   "nova": 0.2879,
   "flow": 0.3418
  },
  "acc": {
   "taro": {
    "n": 1308,
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
    "n": 216,
    "acc": 47.7,
    "adjustedAcc": 48.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 242,
    "acc": 52.9,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 1766,
  "team": {
   "hit": 1076,
   "miss": 665,
   "n": 1741,
   "acc": 61.8
  }
 },
 "sectors": {
  "바이오·제약": {
   "weights": {
    "taro": 0.2532,
    "diana": 0.1272,
    "nova": 0.2806,
    "flow": 0.339
   },
   "acc": {
    "taro": {
     "n": 150,
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
   "graded": 201,
   "globalBlend": 0.799
  }
 }
};
