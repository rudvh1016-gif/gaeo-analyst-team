// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "hold",
 "generatedAt": "2026-09-04 12:42",
 "dataCutoff": "2026-09-04 12:42 장중",
 "horizonDays": 20,
 "picks": [],
 "gate": {
  "indexAboveMa20": 0,
  "breadthPct": 39.8,
  "shown": 0,
  "allowed": 0,
  "sectorCap": 1,
  "sectorCount": 0,
  "detail": {
   "KOSPI": {
    "close": 6664.19,
    "ma20": 6689.61,
    "above": false,
    "gapPct": -0.38
   },
   "KOSDAQ": {
    "close": 810.69,
    "ma20": 830.07,
    "above": false,
    "gapPct": -2.33
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스피",
  "topSector": "보험"
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
