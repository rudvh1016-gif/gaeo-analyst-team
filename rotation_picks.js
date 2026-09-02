// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "hold",
 "generatedAt": "2026-09-02 12:34",
 "dataCutoff": "2026-09-02 12:34 장중",
 "horizonDays": 20,
 "picks": [],
 "gate": {
  "indexAboveMa20": 0,
  "breadthPct": 42.8,
  "shown": 0,
  "allowed": 0,
  "sectorCap": 1,
  "sectorCount": 0,
  "detail": {
   "KOSPI": {
    "close": 6620.21,
    "ma20": 6675.03,
    "above": false,
    "gapPct": -0.82
   },
   "KOSDAQ": {
    "close": 811.88,
    "ma20": 830.48,
    "above": false,
    "gapPct": -2.24
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "중립",
  "topSector": "화학·소재"
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
