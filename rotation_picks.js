// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-26 10:44",
 "dataCutoff": "2026-08-26 10:44 장중",
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
   "sectorRank": 9,
   "why": "20거래일 +99.3% · 20일선 위",
   "overheat": true,
   "gapPct": 48.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 12,
   "why": "20거래일 +82.6% · 20일선 위",
   "overheat": false,
   "gapPct": 19.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 4,
   "why": "20거래일 +67.7% · 20일선 위",
   "overheat": false,
   "gapPct": 26.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 60.4,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6729.72,
    "ma20": 6495.68,
    "above": true,
    "gapPct": 3.6
   },
   "KOSDAQ": {
    "close": 815.55,
    "ma20": 800.01,
    "above": true,
    "gapPct": 1.94
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
