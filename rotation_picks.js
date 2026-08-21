// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-21 15:16",
 "dataCutoff": "2026-08-21 15:16 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +63.7% · 20일선 위",
   "overheat": true,
   "gapPct": 34.1,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "192820",
   "name": "코스맥스",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +53.4% · 20일선 위",
   "overheat": false,
   "gapPct": 27.2,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 4,
   "why": "20거래일 +95.3% · 20일선 위",
   "overheat": true,
   "gapPct": 48.0,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 46.0,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6907.74,
    "ma20": 6460.45,
    "above": true,
    "gapPct": 6.92
   },
   "KOSDAQ": {
    "close": 799.99,
    "ma20": 788.05,
    "above": true,
    "gapPct": 1.51
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
