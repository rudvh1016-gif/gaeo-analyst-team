// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-25 10:12",
 "dataCutoff": "2026-08-25 10:12 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +64.3% · 20일선 위",
   "overheat": true,
   "gapPct": 32.1,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 2,
   "why": "20거래일 +57.6% · 20일선 위",
   "overheat": false,
   "gapPct": 28.6,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "085620",
   "name": "미래에셋생명",
   "sector": "보험",
   "sectorRank": 10,
   "why": "20거래일 +68.9% · 20일선 위",
   "overheat": true,
   "gapPct": 44.1,
   "call": "SELL",
   "callConflict": true
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 50.2,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6533.35,
    "ma20": 6449.9,
    "above": true,
    "gapPct": 1.29
   },
   "KOSDAQ": {
    "close": 797.21,
    "ma20": 793.02,
    "above": true,
    "gapPct": 0.53
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
