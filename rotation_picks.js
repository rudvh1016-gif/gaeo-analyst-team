// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-21 16:16",
 "dataCutoff": "2026-08-21 종가",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +64.6% · 20일선 위",
   "overheat": true,
   "gapPct": 34.9,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "192820",
   "name": "코스맥스",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +53.1% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": false,
   "gapPct": 26.9,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 3,
   "why": "20거래일 +95.3% · 20일선 위 · 거래량 평소의 1.3배",
   "overheat": true,
   "gapPct": 48.0,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 47.0,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6912.95,
    "ma20": 6460.71,
    "above": true,
    "gapPct": 7.0
   },
   "KOSDAQ": {
    "close": 801.94,
    "ma20": 788.15,
    "above": true,
    "gapPct": 1.75
   }
  }
 },
 "regime": {
  "direction": "하락",
  "leadership": "코스닥",
  "topSector": "화장품·미용"
 },
 "record": {
  "hitRate": 53.7,
  "excessMean": 1.23,
  "sampleCount": 255,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-07-16",
  "benchmark": "500종목 업종 중앙값"
 }
};
