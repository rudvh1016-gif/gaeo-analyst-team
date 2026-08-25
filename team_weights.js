// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-25 09:11",
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
   "taro": 0.1659,
   "diana": 0.1262,
   "nova": 0.3066,
   "flow": 0.4013
  },
  "acc": {
   "taro": {
    "n": 927,
    "acc": 25.8,
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
    "n": 143,
    "acc": 52.4,
    "adjustedAcc": 51.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 161,
    "acc": 64.0,
    "adjustedAcc": 58.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 1231,
  "team": {
   "hit": 611,
   "miss": 558,
   "n": 1169,
   "acc": 52.3
  }
 },
 "sectors": {}
};
