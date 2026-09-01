// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-01 09:45",
 "dataCutoff": "2026-09-01 09:45 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 1,
   "why": "20거래일 +109.8% · 20일선 위",
   "overheat": true,
   "gapPct": 32.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 3,
   "why": "20거래일 +99.2% · 20일선 위",
   "overheat": true,
   "gapPct": 32.7,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 57.3,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6785.02,
    "ma20": 6659.43,
    "above": true,
    "gapPct": 1.89
   },
   "KOSDAQ": {
    "close": 821.68,
    "ma20": 828.94,
    "above": false,
    "gapPct": -0.88
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "화학·소재"
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
