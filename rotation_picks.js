// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "hold",
 "generatedAt": "2026-09-15 16:03",
 "dataCutoff": "2026-09-15 종가",
 "horizonDays": 20,
 "picks": [],
 "gate": {
  "indexAboveMa20": 0,
  "breadthPct": 38.3,
  "shown": 0,
  "allowed": 0,
  "sectorCap": 1,
  "sectorCount": 0,
  "detail": {
   "KOSPI": {
    "close": 6627.26,
    "ma20": 6796.41,
    "above": false,
    "gapPct": -2.49
   },
   "KOSDAQ": {
    "close": 812.41,
    "ma20": 820.76,
    "above": false,
    "gapPct": -1.02
   }
  }
 },
 "regime": {
  "direction": "하락",
  "leadership": "중립",
  "topSector": "2차전지"
 },
 "record": {
  "hitRate": 52.6,
  "excessMean": 0.83,
  "sampleCount": 274,
  "periodStart": "2025-07-02",
  "periodEnd": "2026-08-13",
  "benchmark": "500종목 업종 중앙값"
 }
};
