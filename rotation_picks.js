// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-25 15:13",
 "dataCutoff": "2026-08-25 15:12 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 2,
   "why": "20거래일 +60.9% · 20일선 위",
   "overheat": false,
   "gapPct": 29.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 3,
   "why": "20거래일 +62.8% · 20일선 위",
   "overheat": true,
   "gapPct": 32.6,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 7,
   "why": "20거래일 +66.6% · 20일선 위",
   "overheat": false,
   "gapPct": 24.1,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "085620",
   "name": "미래에셋생명",
   "sector": "보험",
   "sectorRank": 10,
   "why": "20거래일 +77.7% · 20일선 위 · 거래량 평소의 2.1배",
   "overheat": true,
   "gapPct": 51.1,
   "call": "SELL",
   "callConflict": true
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 64.5,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6723.64,
    "ma20": 6459.42,
    "above": true,
    "gapPct": 4.09
   },
   "KOSDAQ": {
    "close": 822.89,
    "ma20": 794.31,
    "above": true,
    "gapPct": 3.6
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "철강·금속"
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
