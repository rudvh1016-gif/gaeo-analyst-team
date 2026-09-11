// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-11 13:18",
 "dataCutoff": "2026-09-11 13:18 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "052690",
   "name": "한전기술",
   "sector": "전력·에너지",
   "sectorRank": 4,
   "why": "20거래일 +50.5% · 20일선 위",
   "overheat": true,
   "gapPct": 30.7,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "000370",
   "name": "한화손해보험",
   "sector": "보험",
   "sectorRank": 2,
   "why": "20거래일 +34.6% · 20일선 위",
   "overheat": false,
   "gapPct": 8.5,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 46.5,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6851.28,
    "ma20": 6820.28,
    "above": true,
    "gapPct": 0.45
   },
   "KOSDAQ": {
    "close": 818.01,
    "ma20": 824.61,
    "above": false,
    "gapPct": -0.8
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스피",
  "topSector": "건설·건자재"
 },
 "record": {
  "hitRate": 53.2,
  "excessMean": 0.93,
  "sampleCount": 269,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-08-06",
  "benchmark": "500종목 업종 중앙값"
 }
};
