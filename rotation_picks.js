// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-10 15:31",
 "dataCutoff": "2026-09-10 15:31 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "064290",
   "name": "인텍플러스",
   "sector": "반도체",
   "sectorRank": 2,
   "why": "20거래일 +49.1% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": true,
   "gapPct": 35.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "403870",
   "name": "HPSP",
   "sector": "반도체",
   "sectorRank": 2,
   "why": "20거래일 +44.6% · 20일선 위 · 거래량 평소의 2.1배",
   "overheat": false,
   "gapPct": 14.5,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 3,
   "why": "20거래일 +54.9% · 20일선 위 · 거래량 평소의 1.5배",
   "overheat": false,
   "gapPct": 28.7,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 52.0,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7047.36,
    "ma20": 6819.06,
    "above": true,
    "gapPct": 3.35
   },
   "KOSDAQ": {
    "close": 835.71,
    "ma20": 826.71,
    "above": true,
    "gapPct": 1.09
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스피",
  "topSector": "지주·상사"
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
