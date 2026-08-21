// 자동 생성: compute_rebound_watch.py · 반등 후보 관찰 기록
// ⚠️ 매수 추천이 아니다. 규칙이 실제로 통하는지 성적을 쌓는 관찰 목록이다.
// ⚠️ 표본이 찰 때까지 summary의 성적 항목은 null이다. 화면이 0으로 채우면 안 된다.
// ⚠️ 사람이 직접 고치지 말 것 — 다음 사이클에 덮어써진다.
window.REBOUND_WATCH = {
 "schemaVersion": 1,
 "ruleVersion": "REBOUND_WATCH_V1",
 "generatedAt": "2026-08-21 16:27",
 "rule": {
  "dropPct": -20.0,
  "volRatio": 1.5,
  "lookbackDays": 20,
  "holdDays": 5,
  "maxWatch": 12,
  "note": "직전 20거래일 하락률이 -20% 이하이고 당일 거래량이 20일 평균의 1.5배 이상인 종목. 매수 추천이 아니라 관찰 기록이다."
 },
 "costModel": {
  "commissionPct": 0.015,
  "sellTaxPct": 0.2
 },
 "today": "2026-08-21",
 "todayCount": 0,
 "summary": {
  "ruleVersion": "REBOUND_WATCH_V1",
  "scoredCount": 0,
  "observedDays": 0,
  "minScoredForEvidence": 20,
  "minDaysForEvidence": 20,
  "evidenceOk": false,
  "pendingCount": 0,
  "winRatePct": null,
  "avgReturnPct": null,
  "medianReturnPct": null,
  "surgeRatePct": null,
  "avgMaxGainPct": null,
  "gaeoBuyRatePct": null
 },
 "entries": []
};
