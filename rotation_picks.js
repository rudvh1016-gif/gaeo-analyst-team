// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-10 10:42",
 "dataCutoff": "2026-09-10 10:42 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "403870",
   "name": "HPSP",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +44.6% · 20일선 위",
   "overheat": false,
   "gapPct": 14.5,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 5,
   "why": "20거래일 +50.0% · 20일선 위",
   "overheat": false,
   "gapPct": 24.9,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 37.5,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6912.68,
    "ma20": 6812.32,
    "above": true,
    "gapPct": 1.47
   },
   "KOSDAQ": {
    "close": 815.03,
    "ma20": 825.68,
    "above": false,
    "gapPct": -1.29
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
