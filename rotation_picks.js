// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-28 10:45",
 "dataCutoff": "2026-08-28 10:45 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "323280",
   "name": "태성",
   "sector": "반도체",
   "sectorRank": 4,
   "why": "20거래일 +105.4% · 20일선 위",
   "overheat": false,
   "gapPct": 5.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "001820",
   "name": "삼화콘덴서",
   "sector": "전자·부품",
   "sectorRank": 2,
   "why": "20거래일 +98.1% · 20일선 위",
   "overheat": false,
   "gapPct": 25.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 13,
   "why": "20거래일 +144.8% · 20일선 위",
   "overheat": true,
   "gapPct": 33.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 3,
   "why": "20거래일 +96.6% · 20일선 위",
   "overheat": false,
   "gapPct": 29.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 56.5,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6832.15,
    "ma20": 6623.99,
    "above": true,
    "gapPct": 3.14
   },
   "KOSDAQ": {
    "close": 830.88,
    "ma20": 818.63,
    "above": true,
    "gapPct": 1.5
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
