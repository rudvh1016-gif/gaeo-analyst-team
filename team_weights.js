// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-24 13:41",
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
   "taro": 0.159,
   "diana": 0.1272,
   "nova": 0.3326,
   "flow": 0.3813
  },
  "acc": {
   "taro": {
    "n": 497,
    "acc": 21.3,
    "adjustedAcc": 26.9,
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
    "n": 78,
    "acc": 65.4,
    "adjustedAcc": 56.1,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 639,
  "team": {
   "hit": 242,
   "miss": 337,
   "n": 579,
   "acc": 41.8
  }
 },
 "sectors": {}
};
