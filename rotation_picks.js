// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-09 09:16",
 "dataCutoff": "2026-09-09 09:16 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "000880",
   "name": "한화",
   "sector": "지주·상사",
   "sectorRank": 2,
   "why": "20거래일 +65.0% · 20일선 위",
   "overheat": false,
   "gapPct": 17.9,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "336260",
   "name": "두산퓨얼셀",
   "sector": "전력·에너지",
   "sectorRank": 5,
   "why": "20거래일 +47.7% · 20일선 위",
   "overheat": false,
   "gapPct": 18.9,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 42.5,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6987.07,
    "ma20": 6792.41,
    "above": true,
    "gapPct": 2.87
   },
   "KOSDAQ": {
    "close": 820.79,
    "ma20": 827.4,
    "above": false,
    "gapPct": -0.8
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
