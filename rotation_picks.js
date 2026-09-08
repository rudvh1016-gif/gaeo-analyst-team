// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-08 09:14",
 "dataCutoff": "2026-09-08 09:14 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "336260",
   "name": "두산퓨얼셀",
   "sector": "전력·에너지",
   "sectorRank": 2,
   "why": "20거래일 +63.3% · 20일선 위 · 거래량 평소의 3.1배",
   "overheat": false,
   "gapPct": 22.8,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 3,
   "why": "20거래일 +82.2% · 20일선 위",
   "overheat": false,
   "gapPct": 5.9,
   "call": "SELL",
   "callConflict": true
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 50.3,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7047.91,
    "ma20": 6765.0,
    "above": true,
    "gapPct": 4.18
   },
   "KOSDAQ": {
    "close": 825.65,
    "ma20": 829.94,
    "above": false,
    "gapPct": -0.52
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
