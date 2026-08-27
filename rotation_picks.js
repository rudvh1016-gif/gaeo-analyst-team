// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-27 15:21",
 "dataCutoff": "2026-08-27 15:21 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 4,
   "why": "20거래일 +107.3% · 20일선 위",
   "overheat": false,
   "gapPct": 22.3,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 2,
   "why": "20거래일 +98.5% · 20일선 위 · 거래량 평소의 1.5배",
   "overheat": true,
   "gapPct": 32.3,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 11,
   "why": "20거래일 +140.0% · 20일선 위 · 거래량 평소의 1.8배",
   "overheat": true,
   "gapPct": 31.8,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "010170",
   "name": "대한광통신",
   "sector": "통신",
   "sectorRank": 8,
   "why": "20거래일 +99.3% · 20일선 위 · 거래량 평소의 2.1배",
   "overheat": false,
   "gapPct": 22.4,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 61.7,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6876.08,
    "ma20": 6560.24,
    "above": true,
    "gapPct": 4.81
   },
   "KOSDAQ": {
    "close": 834.98,
    "ma20": 809.19,
    "above": true,
    "gapPct": 3.19
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "전력·에너지"
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
