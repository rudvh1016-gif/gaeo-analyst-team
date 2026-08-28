// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-28 13:15",
 "dataCutoff": "2026-08-28 13:15 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 7,
   "why": "20거래일 +148.7% · 20일선 위",
   "overheat": true,
   "gapPct": 35.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 3,
   "why": "20거래일 +101.9% · 20일선 위",
   "overheat": true,
   "gapPct": 32.9,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "323280",
   "name": "태성",
   "sector": "반도체",
   "sectorRank": 5,
   "why": "20거래일 +107.7% · 20일선 위",
   "overheat": false,
   "gapPct": 6.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 11,
   "why": "20거래일 +115.1% · 20일선 위",
   "overheat": false,
   "gapPct": 23.2,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 64.4,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6830.59,
    "ma20": 6623.91,
    "above": true,
    "gapPct": 3.12
   },
   "KOSDAQ": {
    "close": 837.12,
    "ma20": 818.94,
    "above": true,
    "gapPct": 2.22
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
