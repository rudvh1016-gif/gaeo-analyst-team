# Expanded Weekday Rates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 요일별 등락률 메뉴에 들어오면 통계 표와 설명을 접힌 요약 없이 항상 펼쳐서 표시한다.

**Architecture:** 기존 요일별 통계 계산은 유지하고 렌더링 컨테이너만 `details/summary`에서 일반 Header와 본문으로 바꾼다. 실제 렌더링 IIFE를 VM에서 실행하는 회귀 테스트로 펼침 상태를 검증한다.

**Tech Stack:** 정적 HTML, 인라인 JavaScript, Node.js 내장 `assert`와 `vm`

## Global Constraints

- 요일별 통계 계산식과 데이터 문구는 변경하지 않는다.
- PC와 모바일에서 같은 통계 내용이 처음부터 보인다.
- 별도 의존성을 추가하지 않는다.
- 해당 변경과 테스트, 계획 문서만 커밋한다.

---

### Task 1: 요일별 통계 항상 펼침

**Files:**
- Modify: `index.html:5632-5637`
- Create: `test_weekday_rates_expanded.js`

**Interfaces:**
- Consumes: `DOW_STATS`와 `#dowbar`
- Produces: 접기 동작이 없는 `.dow-h`, `.dow-grid`, `.dow-foot` 렌더링

- [ ] **Step 1: 실패하는 회귀 테스트 작성**

`test_weekday_rates_expanded.js`에서 실제 요일별 통계 IIFE를 실행하고 결과 HTML에 `<details>`와 `<summary>`가 없으며 `.dow-grid`가 존재하는지 확인한다.

- [ ] **Step 2: 테스트가 기존 접힌 구조 때문에 실패하는지 확인**

Run: `node test_weekday_rates_expanded.js`

Expected: `요일별 등락률은 details에 접히지 않아야 합니다.` assertion failure

- [ ] **Step 3: 최소 렌더링 변경**

`index.html`의 `<details><summary>`를 `<div class="dow-h">`로 바꾸고 닫는 `</details>`를 제거한다. 계산과 셀 렌더링은 그대로 둔다.

- [ ] **Step 4: 회귀 테스트와 관련 테스트 실행**

Run: `node test_weekday_rates_expanded.js`

Expected: `weekday rates expanded test passed`

Run: `node test_navigation_scorecard.js`

Expected: `navigation and scorecard tests passed`

- [ ] **Step 5: 변경 범위 검토 및 커밋**

```powershell
git diff --check
git diff -- index.html test_weekday_rates_expanded.js
git add index.html test_weekday_rates_expanded.js docs/superpowers/plans/2026-08-10-expanded-weekday-rates.md
git commit -m "Keep weekday rates expanded"
```

