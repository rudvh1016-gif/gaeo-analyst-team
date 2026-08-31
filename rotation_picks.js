// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-31 15:27",
 "dataCutoff": "2026-08-31 15:27 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 1,
   "why": "20거래일 +99.9% · 20일선 위 · 거래량 평소의 2.0배",
   "overheat": true,
   "gapPct": 38.9,
   "call": "SELL",
   "callConflict": true
  },
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 2,
   "why": "20거래일 +135.1% · 20일선 위",
   "overheat": true,
   "gapPct": 34.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 3,
   "why": "20거래일 +82.1% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": false,
   "gapPct": 26.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 4,
   "why": "20거래일 +90.4% · 20일선 위",
   "overheat": false,
   "gapPct": 24.7,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 59.8,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6780.36,
    "ma20": 6631.07,
    "above": true,
    "gapPct": 2.25
   },
   "KOSDAQ": {
    "close": 833.74,
    "ma20": 824.7,
    "above": true,
    "gapPct": 1.1
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "2차전지"
 },
 "record": {
  "hitRate": 54.5,
  "excessMean": 0.93,
  "sampleCount": 264,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-07-30",
  "benchmark": "500종목 업종 중앙값"
 }
};
