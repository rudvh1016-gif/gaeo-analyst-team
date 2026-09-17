// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-17 12:26",
 "dataCutoff": "2026-09-17 12:26 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 4,
   "why": "20거래일 +56.5% · 20일선 위",
   "overheat": false,
   "gapPct": 19.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "000880",
   "name": "한화",
   "sector": "지주·상사",
   "sectorRank": 3,
   "why": "20거래일 +38.3% · 20일선 위",
   "overheat": false,
   "gapPct": 6.3,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 40.3,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6722.8,
    "ma20": 6802.26,
    "above": false,
    "gapPct": -1.17
   },
   "KOSDAQ": {
    "close": 821.83,
    "ma20": 819.38,
    "above": true,
    "gapPct": 0.3
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "중립",
  "topSector": "보험"
 },
 "record": {
  "hitRate": 52.6,
  "excessMean": 0.83,
  "sampleCount": 274,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-08-13",
  "benchmark": "500종목 업종 중앙값"
 }
};
