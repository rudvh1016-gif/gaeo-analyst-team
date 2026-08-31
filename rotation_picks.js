// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-31 16:27",
 "dataCutoff": "2026-08-31 종가",
 "horizonDays": 20,
 "picks": [
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 1,
   "why": "20거래일 +100.1% · 20일선 위 · 거래량 평소의 2.1배",
   "overheat": true,
   "gapPct": 39.1,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "317400",
   "name": "자이에스앤디",
   "sector": "건설·건자재",
   "sectorRank": 2,
   "why": "20거래일 +80.8% · 20일선 위",
   "overheat": false,
   "gapPct": 21.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 2,
   "why": "20거래일 +80.7% · 20일선 위 · 거래량 평소의 1.4배",
   "overheat": false,
   "gapPct": 25.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 3,
   "why": "20거래일 +134.8% · 20일선 위",
   "overheat": true,
   "gapPct": 34.5,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 61.5,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 3,
  "detail": {
   "KOSPI": {
    "close": 6820.02,
    "ma20": 6633.05,
    "above": true,
    "gapPct": 2.82
   },
   "KOSDAQ": {
    "close": 834.29,
    "ma20": 824.73,
    "above": true,
    "gapPct": 1.16
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
