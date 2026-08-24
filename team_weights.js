// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-24 15:58",
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
   "taro": 0.1669,
   "diana": 0.1269,
   "nova": 0.324,
   "flow": 0.3823
  },
  "acc": {
   "taro": {
    "n": 492,
    "acc": 23.4,
    "adjustedAcc": 28.6,
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
    "n": 63,
    "acc": 58.7,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 81,
    "acc": 65.4,
    "adjustedAcc": 56.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 636,
  "team": {
   "hit": 261,
   "miss": 321,
   "n": 582,
   "acc": 44.8
  }
 },
 "sectors": {}
};
