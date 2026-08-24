// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-24 12:11",
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
   "taro": 0.1624,
   "diana": 0.1271,
   "nova": 0.3325,
   "flow": 0.378
  },
  "acc": {
   "taro": {
    "n": 499,
    "acc": 22.2,
    "adjustedAcc": 27.6,
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
    "n": 64,
    "acc": 60.9,
    "adjustedAcc": 53.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 79,
    "acc": 64.6,
    "adjustedAcc": 55.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 642,
  "team": {
   "hit": 249,
   "miss": 334,
   "n": 583,
   "acc": 42.7
  }
 },
 "sectors": {}
};
