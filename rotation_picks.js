// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-24 14:59",
 "dataCutoff": "2026-08-24 14:59 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 2,
   "why": "20거래일 +73.1% · 20일선 위",
   "overheat": true,
   "gapPct": 33.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 5,
   "why": "20거래일 +89.0% · 20일선 위",
   "overheat": true,
   "gapPct": 31.2,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "008930",
   "name": "한미사이언스",
   "sector": "바이오·제약",
   "sectorRank": 4,
   "why": "20거래일 +64.5% · 20일선 위 · 거래량 평소의 16.3배",
   "overheat": true,
   "gapPct": 35.8,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 54.3,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6685.26,
    "ma20": 6460.44,
    "above": true,
    "gapPct": 3.48
   },
   "KOSDAQ": {
    "close": 812.07,
    "ma20": 791.34,
    "above": true,
    "gapPct": 2.62
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
