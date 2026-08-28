// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-28 09:45",
 "dataCutoff": "2026-08-28 09:45 장중",
 "horizonDays": 20,
 "picks": [
  {
   "code": "222800",
   "name": "심텍",
   "sector": "전자·부품",
   "sectorRank": 2,
   "why": "20거래일 +104.4% · 20일선 위",
   "overheat": false,
   "gapPct": 20.5,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "323280",
   "name": "태성",
   "sector": "반도체",
   "sectorRank": 4,
   "why": "20거래일 +106.2% · 20일선 위",
   "overheat": false,
   "gapPct": 6.0,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "356860",
   "name": "티엘비",
   "sector": "반도체",
   "sectorRank": 4,
   "why": "20거래일 +102.7% · 20일선 위",
   "overheat": false,
   "gapPct": 29.5,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 53.8,
  "shown": 3,
  "allowed": 3,
  "sectorCap": 2,
  "sectorCount": 2,
  "detail": {
   "KOSPI": {
    "close": 6874.1,
    "ma20": 6626.08,
    "above": true,
    "gapPct": 3.74
   },
   "KOSDAQ": {
    "close": 831.96,
    "ma20": 818.68,
    "above": true,
    "gapPct": 1.62
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
