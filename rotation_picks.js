// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-11 12:48",
 "dataCutoff": "2026-09-11 12:48 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 4,
   "why": "20거래일 +49.7% · 20일선 위",
   "overheat": false,
   "gapPct": 25.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "000370",
   "name": "한화손해보험",
   "sector": "보험",
   "sectorRank": 1,
   "why": "20거래일 +34.8% · 20일선 위",
   "overheat": false,
   "gapPct": 8.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 45.5,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6834.12,
    "ma20": 6819.42,
    "above": true,
    "gapPct": 0.22
   },
   "KOSDAQ": {
    "close": 817.53,
    "ma20": 824.58,
    "above": false,
    "gapPct": -0.86
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스피",
  "topSector": "보험"
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
