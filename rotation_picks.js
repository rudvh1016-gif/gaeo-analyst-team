// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-27 13:33",
 "dataCutoff": "2026-08-27 13:33 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 3,
   "why": "20거래일 +108.2% · 20일선 위",
   "overheat": false,
   "gapPct": 22.8,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 2,
   "why": "20거래일 +99.5% · 20일선 위",
   "overheat": true,
   "gapPct": 32.9,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "356860",
   "name": "티엘비",
   "sector": "반도체",
   "sectorRank": 6,
   "why": "20거래일 +95.3% · 20일선 위",
   "overheat": true,
   "gapPct": 34.3,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "323280",
   "name": "태성",
   "sector": "반도체",
   "sectorRank": 6,
   "why": "20거래일 +94.2% · 20일선 위",
   "overheat": false,
   "gapPct": 10.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 63.5,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6923.79,
    "ma20": 6562.63,
    "above": true,
    "gapPct": 5.5
   },
   "KOSDAQ": {
    "close": 836.4,
    "ma20": 809.26,
    "above": true,
    "gapPct": 3.35
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "전력·에너지"
 },
 "record": {
  "hitRate": 54.8,
  "excessMean": 1,
  "sampleCount": 259,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-07-23",
  "benchmark": "500종목 업종 중앙값"
 }
};
