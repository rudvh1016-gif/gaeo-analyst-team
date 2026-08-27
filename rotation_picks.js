// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-27 14:33",
 "dataCutoff": "2026-08-27 14:33 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "002990",
   "name": "금호건설",
   "sector": "건설·건자재",
   "sectorRank": 3,
   "why": "20거래일 +105.9% · 20일선 위",
   "overheat": false,
   "gapPct": 21.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "066970",
   "name": "엘앤에프",
   "sector": "2차전지",
   "sectorRank": 2,
   "why": "20거래일 +98.8% · 20일선 위 · 거래량 평소의 1.3배",
   "overheat": true,
   "gapPct": 32.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "232140",
   "name": "와이씨",
   "sector": "반도체",
   "sectorRank": 5,
   "why": "20거래일 +96.1% · 20일선 위 · 거래량 평소의 6.3배",
   "overheat": true,
   "gapPct": 40.7,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "006110",
   "name": "삼아알미늄",
   "sector": "화학·소재",
   "sectorRank": 12,
   "why": "20거래일 +148.5% · 20일선 위 · 거래량 평소의 1.6배",
   "overheat": true,
   "gapPct": 36.2,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 61.4,
  "shown": 4,
  "allowed": 4,
  "sectorCap": 2,
  "sectorCount": 4,
  "detail": {
   "KOSPI": {
    "close": 6875.13,
    "ma20": 6560.2,
    "above": true,
    "gapPct": 4.8
   },
   "KOSDAQ": {
    "close": 834.13,
    "ma20": 809.14,
    "above": true,
    "gapPct": 3.09
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
