// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-09-18 13:56",
 "dataCutoff": "2026-09-18 13:56 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "000500",
   "name": "가온전선",
   "sector": "전력·에너지",
   "sectorRank": 2,
   "why": "20거래일 +100.1% · 20일선 위 · 거래량 평소의 3.2배",
   "overheat": true,
   "gapPct": 41.1,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "036540",
   "name": "SFA반도체",
   "sector": "반도체",
   "sectorRank": 3,
   "why": "20거래일 +61.0% · 20일선 위",
   "overheat": true,
   "gapPct": 35.2,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "010170",
   "name": "대한광통신",
   "sector": "통신",
   "sectorRank": 1,
   "why": "20거래일 +53.9% · 20일선 위 · 거래량 평소의 3.6배",
   "overheat": true,
   "gapPct": 30.0,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 41.3,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6885.13,
    "ma20": 6800.5,
    "above": true,
    "gapPct": 1.24
   },
   "KOSDAQ": {
    "close": 827.85,
    "ma20": 820.69,
    "above": true,
    "gapPct": 0.87
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "통신"
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
