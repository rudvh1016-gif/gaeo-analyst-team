// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-21 09:19",
 "dataCutoff": "2026-08-21 09:19 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +63.8% · 20일선 위",
   "overheat": true,
   "gapPct": 34.2,
   "call": "HOLD"
  },
  {
   "code": "085620",
   "name": "미래에셋생명",
   "sector": "보험",
   "sectorRank": 2,
   "why": "20거래일 +70.1% · 20일선 위 · 거래량 평소의 4.4배",
   "overheat": true,
   "gapPct": 49.9,
   "call": "HOLD"
  },
  {
   "code": "192820",
   "name": "코스맥스",
   "sector": "화장품·미용",
   "sectorRank": 1,
   "why": "20거래일 +54.0% · 20일선 위",
   "overheat": false,
   "gapPct": 24.8,
   "call": "HOLD"
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 3,
   "why": "20거래일 +86.8% · 20일선 위",
   "overheat": true,
   "gapPct": 41.9,
   "call": "HOLD"
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 60.2,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6748.38,
    "ma20": 6452.48,
    "above": true,
    "gapPct": 4.59
   },
   "KOSDAQ": {
    "close": 816.07,
    "ma20": 788.86,
    "above": true,
    "gapPct": 3.45
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
