// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-31 12:04",
 "dataCutoff": "2026-08-31 12:04 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 1,
   "why": "20거래일 +95.1% · 20일선 위",
   "overheat": true,
   "gapPct": 35.8,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 2,
   "why": "20거래일 +86.8% · 20일선 위",
   "overheat": false,
   "gapPct": 29.5,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 51.2,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6639.87,
    "ma20": 6624.04,
    "above": true,
    "gapPct": 0.24
   },
   "KOSDAQ": {
    "close": 811.9,
    "ma20": 823.61,
    "above": false,
    "gapPct": -1.42
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
