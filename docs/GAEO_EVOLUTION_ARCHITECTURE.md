# GAEO Evolution Architecture

> 2026-08-21 구축, 2026-08-22 독립 감사 수리. GAEO가 실제 시장 결과에서 실패를
> 발견하고, 안전한 개선 후보를 만들고, 객관적 시험으로 검증하고, 검증된 것만
> (사람 승인 하에) 반영하며, 나빠지면 이전 안정 버전으로 돌아가는 구조.

## 2026-08-22 독립 감사 수리 (Harness 보존, 고장 부품만 교체)

| # | 감사 발견 | 수리 내용 |
|---|---|---|
| 1 | build_rows에 recon(사후 재구성 5,965행)·타 모델버전 기록 혼입 | FORWARD RECORD ONLY 재사용 — recon/비auto/판단보류 물리 제외, baseModelVersion 분리(기본: 현재 버전만). recon 데이터는 파일에 보존하되 성적·mining·후보평가 어디에도 못 들어간다 |
| 2 | Baseline(실기록) vs Candidate(시뮬) 비교 — 무변경 후보가 +2.3%p로 보임 | compare_fair: 시뮬 Baseline vs 시뮬 Candidate(같은 행·같은 함수·같은 risk·같은 sellThreshold), Baseline 가중치는 실제 team_weights.js. 무변경 후보 개선폭=0을 영구 회귀테스트로 고정 |
| 3 | 같은 candidateId 재저장으로 내용 교체 가능, 탈락 후보 미보존 | 생성 순간 SHA256 fingerprint 잠금 + 전역 실험번호(EXP-…) + 탈락 개별 영구기록 + 상태기계 코드 강제(REJECTED/ROLLED_BACK 종점) |
| 4 | Promotion Gate에 Shadow 실측이 None으로만 들어감 | shadow.py 신설 — 생성일 이후 실전 행만 champReal/champSim/challenger 병행 기록, 성숙 후 채점, prospective 실측을 Gate에 실제 공급. 소급 기록은 LeakageError |
| 5 | Rollback 함수 미연결, 전체 점수 하나로만 판정 | Gate에 BUY/SELL/시장국면/큰오답 하위그룹 보호 추가(fail closed), 러너가 승격 후 실측을 감시해 execute_rollback 실행(previousStable 복구 지시·cooldown·재승격 차단·Circuit Breaker), 대표용 승격 카드 생성 |

수리 후에도 자동 런타임의 종점은 QUALIFIED_AWAITING_APPROVAL — Production 반영은
사람(대표) 승인 명령(registry.approve_production)으로만 가능하다.

## 한 장 요약 (전체 흐름)

```
전체종목 Python 자동분석 (600종목 · LLM 토큰 0)
        ↓
      History (history.js — 판단·점수·기준가 누적)

선택종목 Claude 정밀분석 (대표가 직접 고른 종목만)
        ↓
      History

History + 실제 5거래일 결과
        ↓
    Failure Miner          ← Python이 실패를 군집으로 압축
        ↓
Deterministic Candidate    ← Python이 안전범위 안 후보 자동 생성
   또는 Claude Research    ← /gaeo-evolve (사람이 실행, spec만 작성)
        ↓
     Challenger            ← Candidate Registry (선언적 spec)
        ↓
   Validation              ← 같은 데이터·같은 채점의미·날짜 블록 부트스트랩
        ↓
 연구/평가 시간분리          ← Failure Mining 구간과 평가 구간을 겹치지 않게(2026-08-22)
        ↓
     Shadow                ← 실전 병행 기록(gaeo_evolution/shadow.py — 생성일 이후 데이터만)
        ↓
 Promotion Gate            ← Constitution promotionFloor(기존 minimums이 바닥값)
        ↓
    Production             ← 승인은 현행 정책대로 수동(대표는 전문 판단 불필요,
        ↓                     Gate가 객관 판정 → 승인 명령만 실행)
 지속적 Monitoring
        ↓
 필요 시 Rollback          ← previousStableVersion(config 선택 방식)
```

## PHASE 0 저장소 감사 결과 (2026-08-21 실측)

| 기능 | 현재 Source of Truth | 생성 주체 | 소비 주체 | 현재 테스트 | Harness에서 | 새 코드 |
|---|---|---|---|---|---|---|
| 600종 자동분석 | analyze_auto.py | GitHub Actions(30분) | auto_analysis.js→화면 | test 다수 | **보존·읽기만** | 없음 |
| 정밀분석 | analysis.js | Claude(대표 지정 종목만) | 화면·아카이브 | seo/design 계열 | **보존** | 없음 |
| 자가학습 가중치 | team_weights.js | compute_team_weights.py | analyze_auto | 기존 | **재사용** | 없음 |
| 확률교정·국면·그림자 | model_intelligence.js | compute_model_intelligence.py | analyze_auto(표시) | test_model_intelligence | **재사용**(minimums→Constitution 바닥값) | 없음 |
| 승격 정책 | model_registry.py `AUTO_PROMOTION=NONE_MANUAL_APPROVAL_REQUIRED` | 코드 정의 | scoreboard·문서 | test_research_* | **정책 그대로 계승** | 없음 |
| 실전 Shadow | research_shadow.json + Research Archive | analyze_auto(v10/v11/v20) | scoreboard | test_research_* 161케이스 | **재사용** | 없음 |
| 채점·블록부트스트랩 | build_model_scoreboard.py (grading_v1) | 러너 | model_scoreboard.js | 기존 | **import 재사용** | 없음 |
| 시점고정(PIT)·누출차단 | research_engine* (created_at/cutoff) | 러너 | 아카이브 | 기존 | **원칙 계승+명시 검증기 추가** | leakage.py |
| 실패 채굴 | (부분) model_intelligence.audit | — | 표시 | 기존 | **확장** | failure_miner.py |
| 후보 생성/등록 | 없음 | — | — | — | **신규** | candidates.py·registry.py |
| Constitution | 없음 | — | — | — | **신규** | constitution.py+json |
| Run Manifest | 없음 | — | — | — | **신규** | manifest.py |
| Memory | 없음(아카이브 암호화만 존재) | — | — | — | **신규**(기존 research_crypto 재사용) | memory.py |
| Rollback/SAFE MODE | (부분) qualified=false→기본공식 | — | — | — | **명시화** | gate.py |
| 공개 Status | 없음 | — | — | — | **신규** | status.py |

**역할 이름 실측**: 자동분석 내부 id `nova` = QUANT(확률통계, compute_team_weights.py 주석).
정밀분석 NOVA = 뉴스·이슈(.claude/agents/nova-sentiment.md). 두 역할을 통합하지 않았다.
종목 수 실측: tickers 600 · 정밀분석 23 (하드코딩 금지 — 코드가 매번 읽는다).

## 새로 추가된 것 (전부 ADDITIVE)

```
gaeo_evolution/
  evolution_constitution.json   불변 규칙(+.sha256 checksum)
  constitution.py               로더·checksum·보호경로 검사
  manifest.py                   실행 메타데이터(비용 미상=null)
  registry.py                   Baseline·Candidate 등록부
  evaluation.py                 통합 평가(기존 의미 import 재사용)
  leakage.py                    미래정보 차단 검증기
  failure_miner.py              실패 군집화(Python 전용)
  candidates.py                 결정론 후보 생성+Cheap Filter
  gate.py                       Promotion Gate·Rollback·Circuit Breaker
  shadow.py                     ⭐ 실전 Shadow 기록기(champ/chall 병행, 2026-08-22)
  memory.py                     경험 저장(암호화, Key 없으면 상세 생략)
  context_builder.py            정밀분석용 compact 컨텍스트(내부용)
  status.py                     공개 상태 파일
  registry/ status/             자동 커밋 허용 구역(allowlist, registry/shadow/ 포함)
run_evolution_lab.py            결정론 오케스트레이터(무LLM)
test_gaeo_evolution.py          계약 테스트 128건(고의 실패 시험 포함)
.github/workflows/evolution-lab.yml   주1회(일 08:00 KST)
.claude/skills/gaeo-evolve/     Claude 연구 인터페이스(spec만 작성)
```

## 첫 실측 기준선 (2026-08-21, 33 판단일 · 16,074행) — ⚠️ 폐기됨

이 표의 숫자(정밀도 51.7% 등)는 2026-08-22 감사에서 **recon(사후 재구성) 5,965행과
hotfix 이전 버전 기록이 섞인 오염 성적**으로 판정되어 비교 기준으로 쓰지 않는다
(registry.usable_baselines가 자동 제외). 데이터 자체는 git 이력에 보존된다.

## 수리 후 기준선 (2026-08-22, forward_record_only_v2)

현재 Production 버전(base-2026-08-15-parity-hotfix)의 실전 기록은 5 판단일 ·
성숙(5거래일 결과 확정) 0행. 그래서 성적표는 정직하게 "축적 중"이며, offline
연구는 "데이터 부족 — Shadow 축적 필요"로 쉰다. 약 4~5주 실전 기록이 쌓이면
(30 판단일) 결정론 후보 연구가 자동 재개된다. 이 기간에 승격이 일어나지 않는
것은 고장이 아니라 설계다.
