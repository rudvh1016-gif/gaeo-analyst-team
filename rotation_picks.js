// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-07 11:04",
 "dataCutoff": "2026-09-07 11:04 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "031980",
   "name": "피에스케이홀딩스",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +68.5% · 20일선 위",
   "overheat": true,
   "gapPct": 32.9,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "336260",
   "name": "두산퓨얼셀",
   "sector": "전력·에너지",
   "sectorRank": 3,
   "why": "20거래일 +67.3% · 20일선 위 · 거래량 평소의 2.0배",
   "overheat": false,
   "gapPct": 25.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 47.0,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6889.7,
    "ma20": 6722.31,
    "above": true,
    "gapPct": 2.49
   },
   "KOSDAQ": {
    "close": 826.73,
    "ma20": 831.6,
    "above": false,
    "gapPct": -0.59
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
