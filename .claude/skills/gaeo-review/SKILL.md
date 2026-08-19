---
name: gaeo-review
description: 개발 결과 최종 검수·버그·보안 점검. 방금 만든 것을 배포 전 검사할 때 쓴다.
---

# GAEO Review: 배포 전 최종 검수 절차

`/gaeo-build`와는 **다른 시각**으로 독립 검토하는 게 핵심이다. 방금 구현한 사람(Engineer)이 스스로 검토하는 것과, 별도 역할이 처음부터 의심하며 보는 것은 다르다.

## 언제 쓰나 / 언제 쓰지 않나

| 이 스킬을 쓴다 | 다른 스킬을 쓴다 |
|---|---|
| 방금 만든 것을 배포 전 검사 | 원인 모를 **증상**이 보고됨 → `/gaeo-bug` |
| 변경분이 기존 기능을 깼는지 확인 | 아직 **만들기 전** → `/gaeo-build` |
| PASS/FAIL 판정이 필요 | 변경과 무관한 **전반** 점검 → `/gaeo-health` |

`/gaeo-bug`와의 경계: **이 스킬은 "내가 방금 바꾼 것"을 본다.** 원인을 모르는 증상 추적은 `/gaeo-bug`다.

## Agent 구성

항상 부르는 3명 + 상황별 추가.

- `gaeo-qa`: 코드 버그·논리 오류·회귀 오류·빌드·테스트·PC/모바일 렌더링
- `gaeo-engineer`: 코드 구조·성능·기존 시스템과의 호환성(이번엔 "구현자"가 아니라 "다른 눈으로 보는 리뷰어" 역할로 호출한다)
- `gaeo-security`: API·데이터·인증·secret 노출 여부

**상황별 추가**:
- 화면이 바뀌었으면 `gaeo-ux-designer` 추가
- 금융 계산·GAEO Score·분석 산식이 바뀌었으면 `gaeo-quant-research` 추가
- 그 산식 변경이 실제 성과에 영향을 줄 만하면 `gaeo-data-analyst` 추가

## 검사 항목

- 코드 버그·논리 오류
- 회귀 오류(기존 기능이 이번 변경으로 망가지지 않았는지. 변경분을 `git stash`로 걷어내고 같은 증상이 재현되는지로 구분)
- 빌드·테스트(`test_*.py`/`test_*.js` 관련 항목 전체 실행)
- 모바일·PC 렌더링(Playwright, 360~430px와 1440px 안팎 모두)
- UX(해당 시 `gaeo-ux-designer`가 `docs/gaeo_design_system.md` 기준으로 판정)
- 성능
- API·데이터 흐름
- 보안(`gaeo-security`가 판정)
- 금융 계산 정확도(해당 시 `gaeo-quant-research`/`gaeo-data-analyst`가 판정)
- 기존 기능 손상 여부

## 기본 제공(bundled) 스킬 활용

이 저장소는 별도 review 플러그인을 설치하지 않는다. Claude Code에 기본 내장된 스킬을 쓴다.

- **`code-review`**: 변경분(diff) 전반의 정확성·단순화·효율 검토. Review 시작 시 한 번 돌려
  기계적으로 잡히는 것을 먼저 걷어내고, 그 결과를 각 Agent 검사의 입력으로 쓴다.
- **`security-review`**: 보안 변경이 포함됐을 때 `gaeo-security`와 **함께** 쓴다.
  이 스킬은 보조 경보기이지 `gaeo-security`의 대체재가 아니다. 경고를 사실로 단정하지 말고
  false positive 가능성을 열어 두고 실제 코드 맥락에서 판정한다.

⚠️ 작은 변경(오탈자·한 줄 수정)에는 `code-review`만으로 충분하다. Agent Team을 꾸리지 않는다.
⚠️ `/verify`·`/debug`는 현재 Claude Code 버전에 없다. 있다고 가정하고 호출하지 않는다.

## 절차

1. 각 Agent를 병렬로 호출해 자기 담당 영역을 독립적으로 검사하게 한다.
2. 문제 발견 시: **원인 확인 → 최소 수정 → 재검증**. 수정은 `gaeo-engineer`가 하고, 발견한 Agent가 다시 확인한다.
3. 사소한 문제(오탈자, 스타일 불일치)는 이 자리에서 바로 고친다. 범위가 큰 문제(설계 변경이 필요한 수준)는 고치지 말고 발견 사항으로만 보고하고 `/gaeo-bug` 또는 새 `/gaeo-build`로 넘긴다. Review 단계에서 큰 변경을 새로 시작하지 않는다.

## 최종 보고

각 영역을 **PASS / FAIL**로 명확히 표시하고, 전체 결론을 맨 위에 한 줄로 요약한다.

```
전체 판정: PASS (또는 FAIL, 무엇이 막고 있는지)

- QA: PASS/FAIL
- Engineer(구조·호환성): PASS/FAIL
- Security: PASS/FAIL
- UX: PASS/FAIL (해당 시)
- Quant/Data(금융 계산): PASS/FAIL (해당 시)
```

FAIL인 항목이 하나라도 있으면 전체 판정도 FAIL로 표기하고, 무엇을 고쳐야 PASS가 되는지 구체적으로 적는다.

## ⭐ 독립성 규칙 (§가장 중요)

- **Engineer가 구현한 것을 Engineer 혼자 PASS 처리하지 않는다.** 최소한 `gaeo-qa`의 독립 검수 결과가 있어야 전체 PASS를 낼 수 있다.
- 금융 계산·GAEO Score가 바뀌었으면 `gaeo-quant-research`(또는 `gaeo-data-analyst`)의 독립 검증 없이 PASS를 내지 않는다.
- 화면이 바뀌었으면 `gaeo-ux-designer`의 독립 검증 없이 PASS를 내지 않는다.
- 인증·계좌·개인정보·API 키가 얽힌 변경이면 `gaeo-security`의 독립 검증 없이 PASS를 내지 않는다.
- 검수 Agent는 findings만 작성한다. 실제 수정은 `gaeo-engineer`가 하고, **수정 후 발견한 Agent가 다시 검증**한다.

## ⭐ 안전장치

- 필요한 수정만 최소 범위로 한다. Review 도중 "이왕 보는 김에" 식으로 관련 없는 부분을 고치지 않는다.
- PASS라고 보고한 뒤에는 반드시 실제로 그 근거(테스트 로그, 스크린샷, computed style 등)를 함께 제시한다. 근거 없는 PASS를 내지 않는다.

## ⭐ 공통 운영 규칙 (모든 GAEO Skill 동일)

### Agent를 몇 명 부를까

Agent가 많다고 결과가 좋아지지 않는다. 같은 파일을 여러 Agent가 의미 없이 반복해서 읽는 것이 가장 큰 낭비다.

| 작업 크기 | Agent 수 |
|---|---|
| 작은 작업(오탈자·한 줄 수정·단일 화면 확인) | 1~2명 (또는 메인 세션이 직접) |
| 보통 작업 | 2~4명 |
| 전략 수립·고위험 감사 | 3~5명 |

**8명 전체 동시 호출은 명확한 필요성이 없는 한 금지한다.** 일이 끝난 Agent를 계속 붙들고 있지 않는다.

부르지 않아도 되는 대표적인 경우:
- CSS 한 줄 변경에 `gaeo-security`를 부르지 않는다
- 일반 코드 수정에 `gaeo-quant-research`/`gaeo-data-analyst`를 부르지 않는다
- 디자인과 무관한 작업에 디자인 보조 스킬(`impeccable` 등)을 부르지 않는다
- 매 작업마다 `skill-creator` 평가를 돌리지 않는다(스킬 자체를 손볼 때만)

### 외부 Plugin·스킬은 GAEO 규칙보다 아래

판단이 충돌할 때의 우선순위는 항상 이 순서다.

1. 사용자(대표)의 명시적 요청
2. GAEO 프로젝트 안전규칙(`AGENTS.md` · `CLAUDE.md`)
3. GAEO Skill 절차
4. GAEO 전문 Agent 판단
5. 외부 Plugin·범용 스킬의 일반 지침

외부 지침 때문에 다음이 일어나는 것을 금지한다: GAEO 디자인 방향이 갑자기 바뀌는 것 ·
승인되지 않은 대규모 리팩터링 · 요청하지 않은 기능 추가 · 자동 commit/push ·
GAEO 워크플로가 외부 방식으로 통째로 대체되는 것.

### 배포 순서

`Build` → `Review` → **PASS** → Commit/Push. Review에서 FAIL이면 배포하지 않는다.
자동 commit/push 플러그인을 쓰지 않는다.
