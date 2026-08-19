---
name: gaeo-review
description: 방금 만든 게 제대로 됐는지 끝까지 검사하는 코드 리뷰·회귀 테스트 스킬. 개발 결과 최종 검수, 버그·보안 점검이 필요할 때, 배포(커밋·PR·병합) 직전에 사용한다. "gaeo-review 해줘 / 배포 전에 검수해줘"처럼 최종 확인이 필요할 때 쓴다.
---

# GAEO Review: 배포 전 최종 검수 절차

`/gaeo-build`와는 **다른 시각**으로 독립 검토하는 게 핵심이다. 방금 구현한 사람(Engineer)이 스스로 검토하는 것과, 별도 역할이 처음부터 의심하며 보는 것은 다르다.

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

## ⭐ 안전장치

- 필요한 수정만 최소 범위로 한다. Review 도중 "이왕 보는 김에" 식으로 관련 없는 부분을 고치지 않는다.
- PASS라고 보고한 뒤에는 반드시 실제로 그 근거(테스트 로그, 스크린샷, computed style 등)를 함께 제시한다. 근거 없는 PASS를 내지 않는다.
