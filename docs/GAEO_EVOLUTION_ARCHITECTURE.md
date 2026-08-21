# GAEO Evolution Architecture

> 2026-08-21 구축. GAEO가 실제 시장 결과에서 실패를 발견하고, 안전한 개선 후보를
> 만들고, 객관적 시험으로 검증하고, 검증된 것만 (사람 승인 하에) 반영하며,
> 나빠지면 이전 안정 버전으로 돌아가는 구조.

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
 Sealed Holdout            ← 시간순 분리(기존 model_intelligence의 70/30+embargo 재사용)
        ↓
     Shadow                ← 실전 병행 기록(기존 research_shadow 체계 재사용)
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
  memory.py                     경험 저장(암호화, Key 없으면 상세 생략)
  context_builder.py            정밀분석용 compact 컨텍스트(내부용)
  status.py                     공개 상태 파일
  registry/ status/             자동 커밋 허용 구역(allowlist)
run_evolution_lab.py            결정론 오케스트레이터(무LLM)
test_gaeo_evolution.py          계약 테스트 61건
.github/workflows/evolution-lab.yml   주1회(일 08:00 KST)
.claude/skills/gaeo-evolve/     Claude 연구 인터페이스(spec만 작성)
```

## 첫 실측 기준선 (2026-08-21, 33 판단일 · 16,074행)

| 지표 | 값 |
|---|---|
| 행동(BUY·SELL) 정밀도 | 51.7% (95% CI 41.2~63.7 — 날짜 블록 부트스트랩) |
| BUY 정밀도 | 39.3% (929건) |
| SELL 정밀도 | 53.8% (5,564건) |
| 커버리지 | 44.3% · Brier 0.2596 · 시장국면 5개 |
| 결정론 후보 | 18개 생성 → Cheap Filter 생존 0 (개선 증거 없음 = 정상 결과) |
| 실패군집 | 20개 → Memory 후보 20건 |

표본 한계를 숨기지 않는다: 판단일 33일은 짧다. CI가 ±11%p로 넓은 이유다.
