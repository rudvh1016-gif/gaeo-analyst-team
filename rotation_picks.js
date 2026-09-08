// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-08 15:07",
 "dataCutoff": "2026-09-08 15:07 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "000880",
   "name": "한화",
   "sector": "지주·상사",
   "sectorRank": 1,
   "why": "20거래일 +65.2% · 20일선 위",
   "overheat": false,
   "gapPct": 18.0,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 2,
   "why": "20거래일 +77.4% · 20일선 위",
   "overheat": false,
   "gapPct": 3.3,
   "call": "SELL",
   "callConflict": true
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 45.0,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7013.45,
    "ma20": 6763.28,
    "above": true,
    "gapPct": 3.7
   },
   "KOSDAQ": {
    "close": 818.1,
    "ma20": 829.56,
    "above": false,
    "gapPct": -1.38
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
