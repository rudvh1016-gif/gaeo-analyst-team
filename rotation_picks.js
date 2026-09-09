// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-09 11:17",
 "dataCutoff": "2026-09-09 11:17 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "403870",
   "name": "HPSP",
   "sector": "반도체",
   "sectorRank": 1,
   "why": "20거래일 +47.4% · 20일선 위",
   "overheat": false,
   "gapPct": 17.9,
   "call": "BUY",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 2,
   "why": "20거래일 +68.9% · 20일선 위 · 거래량 평소의 2.2배",
   "overheat": true,
   "gapPct": 39.3,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "336260",
   "name": "두산퓨얼셀",
   "sector": "전력·에너지",
   "sectorRank": 2,
   "why": "20거래일 +53.2% · 20일선 위 · 거래량 평소의 2.0배",
   "overheat": false,
   "gapPct": 28.4,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 45.8,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 7068.48,
    "ma20": 6796.48,
    "above": true,
    "gapPct": 4.0
   },
   "KOSDAQ": {
    "close": 829.08,
    "ma20": 827.81,
    "above": true,
    "gapPct": 0.15
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
