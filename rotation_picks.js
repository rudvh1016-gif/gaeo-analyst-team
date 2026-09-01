// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-01 14:15",
 "dataCutoff": "2026-09-01 14:15 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 1,
   "why": "20거래일 +86.1% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": false,
   "gapPct": 24.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 3,
   "why": "20거래일 +102.0% · 20일선 위",
   "overheat": false,
   "gapPct": 28.0,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 55.0,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6807.91,
    "ma20": 6660.57,
    "above": true,
    "gapPct": 2.21
   },
   "KOSDAQ": {
    "close": 817.66,
    "ma20": 828.74,
    "above": false,
    "gapPct": -1.34
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "2차전지"
 },
 "record": {
  "hitRate": 54.5,
  "excessMean": 0.93,
  "sampleCount": 264,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-07-30",
  "benchmark": "500종목 업종 중앙값"
 }
};
