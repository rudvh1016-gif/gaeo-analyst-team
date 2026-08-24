// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-24 15:59",
 "dataCutoff": "2026-08-24 종가",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 2,
   "why": "20거래일 +73.5% · 20일선 위",
   "overheat": true,
   "gapPct": 33.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 5,
   "why": "20거래일 +92.3% · 20일선 위",
   "overheat": true,
   "gapPct": 33.3,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "192820",
   "name": "코스맥스",
   "sector": "화장품·미용",
   "sectorRank": 2,
   "why": "20거래일 +60.3% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": true,
   "gapPct": 30.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "008930",
   "name": "한미사이언스",
   "sector": "바이오·제약",
   "sectorRank": 4,
   "why": "20거래일 +63.3% · 20일선 위 · 거래량 평소의 19.0배",
   "overheat": true,
   "gapPct": 34.9,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 57.9,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6696.96,
    "ma20": 6461.02,
    "above": true,
    "gapPct": 3.65
   },
   "KOSDAQ": {
    "close": 813.33,
    "ma20": 791.41,
    "above": true,
    "gapPct": 2.77
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "2차전지"
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
