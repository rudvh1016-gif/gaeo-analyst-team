// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-24 11:11",
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
   "taro": 0.1573,
   "diana": 0.1272,
   "nova": 0.3378,
   "flow": 0.3777
  },
  "acc": {
   "taro": {
    "n": 506,
    "acc": 20.9,
    "adjustedAcc": 26.5,
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
    "n": 66,
    "acc": 62.1,
    "adjustedAcc": 54.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 81,
    "acc": 64.2,
    "adjustedAcc": 55.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 653,
  "team": {
   "hit": 249,
   "miss": 337,
   "n": 586,
   "acc": 42.5
  }
 },
 "sectors": {}
};
