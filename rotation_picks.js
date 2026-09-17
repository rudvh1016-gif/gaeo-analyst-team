// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-17 09:33",
 "dataCutoff": "2026-09-17 09:33 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "036540",
   "name": "SFA반도체",
   "sector": "반도체",
   "sectorRank": 2,
   "why": "20거래일 +46.4% · 20일선 위",
   "overheat": true,
   "gapPct": 37.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 8,
   "why": "20거래일 +56.5% · 20일선 위",
   "overheat": false,
   "gapPct": 16.9,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 1,
  "breadthPct": 35.7,
  "shown": 2,
  "allowed": 2,
  "sectorCap": 1,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6786.38,
    "ma20": 6805.44,
    "above": false,
    "gapPct": -0.28
   },
   "KOSDAQ": {
    "close": 822.98,
    "ma20": 819.44,
    "above": true,
    "gapPct": 0.43
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "중립",
  "topSector": "2차전지"
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
