// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-10 09:42",
 "dataCutoff": "2026-09-10 09:42 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "064290",
   "name": "인텍플러스",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +44.8% · 20일선 위",
   "overheat": true,
   "gapPct": 31.8,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 4,
   "why": "20거래일 +52.8% · 20일선 위",
   "overheat": false,
   "gapPct": 27.0,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 45.7,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7008.47,
    "ma20": 6817.11,
    "above": true,
    "gapPct": 2.81
   },
   "KOSDAQ": {
    "close": 821.99,
    "ma20": 826.03,
    "above": false,
    "gapPct": -0.49
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스피",
  "topSector": "반도체"
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
