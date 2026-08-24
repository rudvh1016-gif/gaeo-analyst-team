// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-24 11:12",
 "dataCutoff": "2026-08-24 11:12 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +71.7% · 20일선 위",
   "overheat": true,
   "gapPct": 32.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "192820",
   "name": "코스맥스",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +59.5% · 20일선 위",
   "overheat": true,
   "gapPct": 30.0,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "085620",
   "name": "미래에셋생명",
   "sector": "보험",
   "sectorRank": 4,
   "why": "20거래일 +68.6% · 20일선 위",
   "overheat": true,
   "gapPct": 43.4,
   "call": "SELL",
   "callConflict": true
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 53.2,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6737.82,
    "ma20": 6463.07,
    "above": true,
    "gapPct": 4.25
   },
   "KOSDAQ": {
    "close": 811.26,
    "ma20": 791.3,
    "above": true,
    "gapPct": 2.52
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "화장품·미용"
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
