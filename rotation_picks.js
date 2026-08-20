// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)
// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.
// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.
window.ROTATION_PICKS = {
 "schemaVersion": 1,
 "status": "ready",
 "generatedAt": "2026-08-20 20:14",
 "dataCutoff": "2026-08-20 종가",
 "horizonDays": 20,
 "picks": [
  {
   "code": "475830",
   "name": "오름테라퓨틱",
   "sector": "바이오·제약",
   "sectorRank": 1,
   "why": "20거래일 +68.9% · 20일선 위",
   "overheat": false,
   "gapPct": 25.6,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "241710",
   "name": "코스메카코리아",
   "sector": "화장품·미용",
   "sectorRank": 2,
   "why": "20거래일 +79.6% · 20일선 위",
   "overheat": true,
   "gapPct": 38.4,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "181710",
   "name": "NHN",
   "sector": "인터넷·IT",
   "sectorRank": 4,
   "why": "20거래일 +99.2% · 20일선 위",
   "overheat": true,
   "gapPct": 46.8,
   "call": "HOLD",
   "callConflict": false
  },
  {
   "code": "196170",
   "name": "알테오젠",
   "sector": "바이오·제약",
   "sectorRank": 1,
   "why": "20거래일 +64.6% · 20일선 위 · 거래량 평소의 1.8배",
   "overheat": false,
   "gapPct": 22.2,
   "call": "HOLD",
   "callConflict": false
  }
 ],
 "gate": {
  "indexAboveMa20": 2,
  "breadthPct": 66.9,
  "shown": 4,
  "allowed": 4,
  "detail": {
   "KOSPI": {
    "close": 6852.58,
    "ma20": 6469.9,
    "above": true,
    "gapPct": 5.91
   },
   "KOSDAQ": {
    "close": 840.89,
    "ma20": 787.57,
    "above": true,
    "gapPct": 6.77
   }
  }
 },
 "regime": {
  "direction": "횡보",
  "leadership": "코스닥",
  "topSector": "바이오·제약"
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
