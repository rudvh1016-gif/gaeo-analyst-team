// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-10 13:42",
 "dataCutoff": "2026-09-10 13:42 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "403870",
   "name": "HPSP",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +48.5% · 20일선 위 · 거래량 평소의 1.6배",
   "overheat": false,
   "gapPct": 17.4,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "064290",
   "name": "인텍플러스",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +46.2% · 20일선 위",
   "overheat": true,
   "gapPct": 32.9,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 5,
   "why": "20거래일 +53.9% · 20일선 위",
   "overheat": false,
   "gapPct": 27.9,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 46.8,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7018.65,
    "ma20": 6817.62,
    "above": true,
    "gapPct": 2.95
   },
   "KOSDAQ": {
    "close": 830.84,
    "ma20": 826.47,
    "above": true,
    "gapPct": 0.53
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
