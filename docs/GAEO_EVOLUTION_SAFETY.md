# GAEO Evolution 안전장치 — 무엇을 막고, 무엇은 못 막는가

## 막는 것 (테스트로 고정)

| 위험 | 장치 | 테스트 |
|---|---|---|
| 규칙 몰래 완화 | Constitution + sha256 checksum, 불일치 시 SAFE_MODE | tampered_constitution_fails_closed |
| 자동 런타임의 Production 코드 수정 | protectedPaths + 커밋 allowlist, 위반 시 커밋 자체를 거부 | protected_file_change_is_flagged |
| 미래정보로 성적 부풀리기 | outcomeDate 강제 기록 + 판단일 이후 검증, 위반 시 예외 | future_outcome_date_raises |
| 후보가 결과를 보고 학습 | decision_view가 결과 필드를 물리적으로 제거 | decision_view_strips_outcome_fields |
| 같은 날 600종목을 독립표본으로 과신 | unique days 별도 집계 + 날짜 블록 부트스트랩 | same_day_rows_do_not_inflate_ci |
| 배포 당일 과거데이터 승격 | prospective 없음 → 무조건 BOOTSTRAP_SHADOW | no_prospective_evidence_means_bootstrap |
| 표본부족·방향붕괴·커버리지붕괴 승격 | Gate가 KEEP_SHADOW로 거부 | insufficient/direction/coverage 테스트 |
| 애매한 개선 승격 | 개선폭 95% CI가 0을 포함하면 거부 | ci_including_zero_keeps_shadow |
| 복잡도 폭증 | complexity budget + 복잡할수록 더 큰 개선 요구 | complex_candidate_needs_bigger_gain |
| 가짜 비용 기록 | 모르면 null + costSource 명시 | unknown_cost_is_null |
| 민감 연구 평문 유출 | Key 없으면 상세 Memory 저장 생략(평문 fallback 없음) | no_key_means_no_plaintext |
| 무의미 소군집 과신 | Failure Miner 최소지지(8행·5일) 미달 폐기 | small_clusters_are_dropped |
| 승격 후 악화 방치 | Rollback 트리거(정밀도 -3%p 등) + 관측 최소 10일 | precision_drop_triggers_rollback |

## 기존 승격 바닥값 (실코드에서 가져옴 — 낮추지 않음)

compute_model_intelligence.py promotion.minimums 그대로:
실전 표본 500 · 행동 표본 100 · 정밀도 +1.5%p · Brier +0.005 · 커버리지 15% ·
검증 40거래일 · 국면 3개 · BUY/SELL 각 50건 · 방향 편중 ≤80%.
Harness는 여기에 **더 보수적으로**: unique days·CI 0 제외·복잡도 보정을 추가했다.

## 솔직한 한계 (숨기지 않는다)

1. **같은 저장소에 쓰기 권한이 있는 주체(사람, Claude Code 대화 세션)를 물리적으로
   막을 수는 없다.** Constitution·protected path는 "자동 런타임(evolution-lab)"의
   행동을 강제하는 장치다. 사람이 대화에서 Claude에게 "analyze_auto.py 고쳐"라고
   하면 그것은 일반 개발 작업이며 기존 리뷰 절차(gaeo-review)가 방어선이다.
2. **offline 후보 평가는 근사치다**(offline_approximation_v1 — chief_eval의
   판단보류·반등가드 분기를 전부 재현하지 않음). 그래서 offline 결과는 '싼 선별'
   에만 쓰고, 승격 근거는 실전 Shadow 실측만 인정한다.
3. **표본이 짧다.** 현재 33 판단일. CI가 ±11%p로 넓은 이유이며, 이 상태에서
   승격이 일어나지 않는 것이 버그가 아니라 설계다.
4. **시간이 지나면 무조건 좋아진다는 보장은 없다.** 개선이 증명되지 않으면
   "아무것도 바꾸지 않음"이 이 시스템의 올바른 출력이다.

## SAFE MODE

트리거: Constitution 변조 · 데이터 7일 이상 정체 · 핵심 파일 소실 ·
allowlist 밖 변경 감지 · 계약 테스트 실패.
동작: 승격·자동커밋 전면 중지, 현재 안정 Production만 유지, 사유를 status에 기록.
`|| true`로 숨기지 않는 것: Constitution 실패·누출·보호경로 위반·Gate 검증 —
전부 FAIL CLOSED.
