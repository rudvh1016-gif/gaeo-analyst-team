// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-25 11:42",
 "dataCutoff": "2026-08-25 11:42 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +59.8% · 20일선 위",
   "overheat": false,
   "gapPct": 28.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 3,
   "why": "20거래일 +57.8% · 20일선 위",
   "overheat": false,
   "gapPct": 28.8,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "085620",
   "name": "미래에셋생명",
   "sector": "보험",
   "sectorRank": 9,
   "why": "20거래일 +76.5% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": true,
   "gapPct": 50.1,
   "call": "SELL",
   "callConflict": true
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 52.3,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6577.28,
    "ma20": 6452.1,
    "above": true,
    "gapPct": 1.94
   },
   "KOSDAQ": {
    "close": 800.86,
    "ma20": 793.21,
    "above": true,
    "gapPct": 0.96
   }
  }
 },
 "regime": {
  "direction": "하락",
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
