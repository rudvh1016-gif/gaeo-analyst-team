// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-07 12:34",
 "dataCutoff": "2026-09-07 12:34 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "031980",
   "name": "피에스케이홀딩스",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +65.6% · 20일선 위",
   "overheat": true,
   "gapPct": 30.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "336260",
   "name": "두산퓨얼셀",
   "sector": "전력·에너지",
   "sectorRank": 2,
   "why": "20거래일 +67.3% · 20일선 위 · 거래량 평소의 2.4배",
   "overheat": false,
   "gapPct": 25.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 47.7,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6904.64,
    "ma20": 6723.05,
    "above": true,
    "gapPct": 2.7
   },
   "KOSDAQ": {
    "close": 824.19,
    "ma20": 831.48,
    "above": false,
    "gapPct": -0.88
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
