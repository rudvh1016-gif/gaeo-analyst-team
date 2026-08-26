// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-26 14:26",
 "dataCutoff": "2026-08-26 14:26 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 1,
   "why": "20거래일 +93.1% · 20일선 위",
   "overheat": true,
   "gapPct": 30.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "085620",
   "name": "미래에셋생명",
   "sector": "보험",
   "sectorRank": 3,
   "why": "20거래일 +101.6% · 20일선 위",
   "overheat": true,
   "gapPct": 50.1,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 2,
   "why": "20거래일 +67.4% · 20일선 위",
   "overheat": false,
   "gapPct": 26.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "323280",
   "name": "태성",
   "sector": "반도체",
   "sectorRank": 7,
   "why": "20거래일 +70.4% · 20일선 위",
   "overheat": false,
   "gapPct": 12.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 67.7,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6848.47,
    "ma20": 6501.61,
    "above": true,
    "gapPct": 5.33
   },
   "KOSDAQ": {
    "close": 824.86,
    "ma20": 800.47,
    "above": true,
    "gapPct": 3.05
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "건설·건자재"
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
