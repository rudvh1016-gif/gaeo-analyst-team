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
| **(2026-08-22 수리)** recon/backfill이 실전 성적에 섞임 | build_rows가 recon·비auto·판단보류·타 모델버전 행을 물리 제외(FORWARD RECORD ONLY 재사용) | ForwardRecordOnlyTest |
| 무변경 후보가 개선처럼 보임 | offline 비교를 '시뮬 vs 시뮬'로 통일 + 실제 Production 가중치(team_weights.js) 사용 — 무변경 후보 개선폭 = 정확히 0 | NoChangeCandidateTest(영구 회귀) |
| 후보 바꿔치기 | 생성 순간 SHA256 fingerprint 고정, 같은 ID 다른 내용 저장 거부, 저장 후 변조는 verify_integrity가 감지 | CandidateImmutabilityTest |
| 탈락 실험 증발 | 탈락도 개별 영구기록 + 전역 실험번호(EXP-000001…) | test_experiment_serial_counts_rejected_too |
| 금지 상태역행(REJECTED→QUALIFIED 등) | 상태기계 코드 강제, REJECTED/ROLLED_BACK은 종점 | StateMachineTest |
| Shadow 증거 없음/소급 생성 | shadow.py가 생성일 이후 실전 행만 champ/chall 병행 기록, 소급 행은 LeakageError | ShadowTest |
| 전체만 좋고 BUY(또는 SELL·국면) 붕괴 | Gate 하위그룹 보호(BUY/SELL -2%p, 큰오답 +2%p, 국면 -5%p 한도, 실측 없으면 fail closed) | SubgroupGateTest |
| complexity 거짓 신고 | 선언값을 믿지 않고 parameterChanges 실측으로 검증 | test_complexity_self_report_is_verified |
| 롤백된 설정 재승격 | paramHash cooldown(30일) + 종점 상태 + Circuit Breaker(롤백 후 승격 동결) | test_rolled_back_params_blocked_within_cooldown |
| hypothesis 문자열로 명령 주입 | hypothesis/Memory는 데이터로만 취급 — 판정에 영향 0 | test_hypothesis_text_is_data_not_command |
| 경로 장난(../, 대소문자, symlink, 신규 파일) | normpath+casefold 보호경로 검사, allowlist는 엄격 매칭, find_symlinks | ProtectedPathBypassTest |
| '함수만 있고 연결 안 됨' | 러너가 shadow·gate·rollback을 실제 호출하는지 소스 검증 | RollbackWiringTest |
| 특정 하루가 끌어올린 착시 개선 | 풀링 개선폭과 함께 일평균 개선폭(CI가 인증하는 통계량)도 같은 바닥값 요구 | test_day_mean_gain_must_also_clear_floor |
| 반복 검정으로 우연 통과 | 승격 기준 2회 연속 충족해야 QUALIFIED(러너 qualifiedStreak) | test_runner_requires_two_consecutive_qualifications |
| 수동전용 tier(ORANGE) 자동 승격 | riskTiers.autoShadow/applyMode를 Gate·러너가 코드로 집행 | test_manual_only_tier_cannot_auto_qualify |
| QUALIFIED/PRODUCTION으로 '태어나는' 후보 | 신규 등록 초기 상태를 RESEARCH_DRAFT/BOOTSTRAP_SHADOW로 제한 | test_candidate_cannot_be_born_qualified_or_production |
| 롤백 기준선이 늦게 잡히는 문제 | 사람 승인 순간의 성적표를 productionBaselineMetrics로 동결 | test_approval_freezes_baseline_metrics_at_approval_time |

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
2. **offline 후보 평가는 근사치다**(offline_sim_vs_sim_v2 — chief_eval의
   판단보류·업종별 가중치 오버라이드를 재현하지 않음. 단 기준/후보 양쪽이 같은
   근사를 쓰므로 비교 자체는 공정하다). offline 결과는 '싼 선별'에만 쓰고,
   승격 근거는 실전 Shadow 실측만 인정한다. Shadow의 Gate 비교도 champSim vs
   challenger(같은 함수·같은 입력)로 대칭이며, 실전 기록(champReal)은 참고용으로
   함께 보존한다.
3. **표본이 짧다.** recon/타버전 제외 후 현재 버전 실전 기록은 5 판단일뿐이다
   (2026-08-22 기준). offline 연구는 "데이터 부족 — Shadow 축적 필요"로 쉬고,
   이 상태에서 승격이 일어나지 않는 것이 버그가 아니라 설계다.
   (감사 전에 보이던 "33 판단일·16,074행"은 recon 5,965행과 hotfix 이전 버전
   기록이 섞인 숫자였다 — 그 데이터는 파일에 보존하되 성적에서는 제외한다.)
4. **시간이 지나면 무조건 좋아진다는 보장은 없다.** 개선이 증명되지 않으면
   "아무것도 바꾸지 않음"이 이 시스템의 올바른 출력이다.

## SAFE MODE

트리거: Constitution 변조 · 데이터 7일 이상 정체 · 핵심 파일 소실 ·
allowlist 밖 변경 감지 · 계약 테스트 실패.
동작: 승격·자동커밋 전면 중지, 현재 안정 Production만 유지, 사유를 status에 기록.
`|| true`로 숨기지 않는 것: Constitution 실패·누출·보호경로 위반·Gate 검증 —
전부 FAIL CLOSED.
