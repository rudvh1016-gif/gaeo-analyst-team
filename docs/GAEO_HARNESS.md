# GAEO Harness — 사용법 (초보자용)

## 이게 뭔가요?

GAEO가 "내 판단이 실제로 맞았나"를 스스로 채점하고, 틀린 패턴을 찾고,
고칠 후보를 만들어 **시험**까지 보게 하는 장치입니다.
시험을 통과하지 못하면 **아무것도 바꾸지 않는 것**이 정상 동작입니다.

## 자동으로 도는 것 (대표가 할 일 없음)

| 언제 | 무엇 | 비용 |
|---|---|---|
| 30분마다(기존) | 600종목 자동분석 + 실전 Shadow 기록 | LLM 0원 (변화 없음) |
| 매주 일 08:00 | evolution-lab: 성적표 갱신·실패 채굴·결정론 후보 연구 | LLM 0원 |

## 사람이 실행하는 것

```bash
# 수동으로 연구 1회 돌리기(선택)
python run_evolution_lab.py

# 종목 1개의 compact 정밀분석 컨텍스트 보기(선택)
python -m gaeo_evolution.context_builder 005930
```

Claude Code에서:
- `/gaeo-evolve` — evolution_status.json의 `researchNeeded: true`일 때.
  실패 보고서를 읽고 새 가설(후보 spec)을 만든다. 코드는 안 고친다.

## 지금 어떤 상태인지 보는 곳

- `gaeo_evolution/status/evolution_status.json` — 모드·성적 요약·후보 수·연구필요 여부
- `gaeo_evolution/status/failure_report.json` — 실패 패턴 집계
- `gaeo_evolution/registry/baselines.json` — 날짜별 Production 성적표
- `gaeo_evolution/registry/candidates.json` — 후보와 상태

상태 뜻:
- `BOOTSTRAP_SHADOW` — 새 후보는 실전 기록이 쌓이기 전이라 승격 불가(정상 초기상태)
- `KEEP_SHADOW` — 시험 기준 미달, 그림자 계속
- `QUALIFIED_AWAITING_APPROVAL` — 모든 객관 기준 통과, 사람 승인 대기
- `SAFE_MODE` — 무결성 문제 감지, 모든 승격·자동커밋 중지

## 승인은 어떻게 하나요? (대표용)

Gate가 `QUALIFIED_AWAITING_APPROVAL`을 만들면, 그때 Claude Code에서
"이 후보 승인해줘"라고 하면 됩니다. **어떤 가중치가 맞는지 대표가 판단할
필요가 없습니다** — 판단은 시험(Gate)이 이미 했고, 승인은 실행 결정일 뿐입니다.
지금은 승인 대기 후보가 0개입니다(실전 기록이 없어서 — 정상).

⭐ 2026-08-22 2차 수리 후 승인은 "도장만 찍는 것"이 아니라 **실제 반영**입니다.
승인 명령(`registry.approve_production`)이 후보 설정을
`gaeo_evolution/production_config.json`에 원자적으로 적용하고, 실제 분석 엔진이
그 설정을 읽는지까지 스스로 확인한 다음에야 PRODUCTION 도장을 찍습니다.
중간에 하나라도 실패하면 아무것도 바뀌지 않습니다. 성적이 나빠지면 롤백이
이전 안정 설정을 **실제로 복원**합니다(승인 전 상태로 판단이 되돌아감).

## Constitution을 바꾸고 싶다면 (사람 전용)

```bash
# 1) gaeo_evolution/evolution_constitution.json 수정
# 2) checksum 재고정
python -c "from gaeo_evolution import constitution; print(constitution.write_checksum())"
# 3) 두 파일을 함께 커밋
```
자동 런타임은 이 두 파일을 절대 커밋할 수 없다(allowlist 밖 + FAIL CLOSED).
