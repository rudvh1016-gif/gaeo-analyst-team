// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-26 09:14",
 "dataCutoff": "2026-08-26 09:14 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +69.1% · 20일선 위",
   "overheat": false,
   "gapPct": 27.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 2,
   "why": "20거래일 +90.1% · 20일선 위",
   "overheat": false,
   "gapPct": 28.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "323280",
   "name": "태성",
   "sector": "반도체",
   "sectorRank": 4,
   "why": "20거래일 +69.4% · 20일선 위",
   "overheat": false,
   "gapPct": 12.0,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "356860",
   "name": "티엘비",
   "sector": "반도체",
   "sectorRank": 4,
   "why": "20거래일 +64.9% · 20일선 위",
   "overheat": true,
   "gapPct": 31.6,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 64.9,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6744.87,
    "ma20": 6496.43,
    "above": true,
    "gapPct": 3.82
   },
   "KOSDAQ": {
    "close": 827.49,
    "ma20": 800.6,
    "above": true,
    "gapPct": 3.36
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
