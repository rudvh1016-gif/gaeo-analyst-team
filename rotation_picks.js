// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-10 14:12",
 "dataCutoff": "2026-09-10 14:12 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "064290",
   "name": "인텍플러스",
   "sector": "반도체",
   "sectorRank": 2,
   "why": "20거래일 +47.7% · 20일선 위",
   "overheat": true,
   "gapPct": 34.2,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "403870",
   "name": "HPSP",
   "sector": "반도체",
   "sectorRank": 2,
   "why": "20거래일 +46.4% · 20일선 위 · 거래량 평소의 1.7배",
   "overheat": false,
   "gapPct": 15.8,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 6,
   "why": "20거래일 +53.7% · 20일선 위 · 거래량 평소의 1.3배",
   "overheat": false,
   "gapPct": 27.8,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 49.0,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7047.51,
    "ma20": 6819.06,
    "above": true,
    "gapPct": 3.35
   },
   "KOSDAQ": {
    "close": 832.5,
    "ma20": 826.55,
    "above": true,
    "gapPct": 0.72
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
