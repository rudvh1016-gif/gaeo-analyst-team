# Nav Refresh Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 상단 새로고침 버튼을 주변 유틸리티 메뉴와 동일한 크기와 시각적 무게로 표시한다.

**Architecture:** 기존 공용 `.global-icon-btn` 스타일을 새로고침 버튼에도 적용하고, 새로고침 전용 스타일은 비활성·회전 상태만 남긴다. 클릭 동작과 안내 줄은 변경하지 않는다.

**Tech Stack:** 정적 HTML, CSS, 바닐라 JavaScript, Node.js 회귀 테스트

## Global Constraints

- 기존 새로고침 기능과 안내 줄을 유지한다.
- 검색, 새로고침, 프로필, 전체 메뉴 순서를 유지한다.
- 자동 생성 데이터 파일은 수정하지 않는다.

---

### Task 1: 새로고침 버튼 시각 통일

**Files:**
- Modify: `index.html:2439-2449`
- Modify: `index.html:3333-3338`
- Create: `test_nav_refresh_consistency.js`

**Interfaces:**
- Consumes: `.global-icon-btn`, `#navRefresh`, 기존 새로고침 클릭 이벤트
- Produces: 공용 크기와 hover 스타일을 공유하는 새로고침 버튼

- [ ] **Step 1: 실패하는 회귀 테스트 작성**

```js
assert.match(refreshMarkup, /class="global-icon-btn nav-refresh-btn"/);
assert.doesNotMatch(refreshMarkup, /nav-refresh-circle/);
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node test_nav_refresh_consistency.js`

Expected: 공용 버튼 클래스가 없어서 FAIL

- [ ] **Step 3: 최소 구현**

```html
<button class="global-icon-btn nav-refresh-btn" id="navRefresh" type="button">
  <svg viewBox="0 0 24 24" aria-hidden="true">...</svg>
  <span>새로고침</span>
</button>
```

전용 빨간 원형 CSS를 제거하고 비활성·회전 상태만 유지한다.

- [ ] **Step 4: 전체 검증**

Run: `node test_nav_refresh_consistency.js` 및 기존 관련 Node 테스트

Expected: 모두 PASS

- [ ] **Step 5: 커밋과 배포**

```bash
git add index.html test_nav_refresh_consistency.js docs/superpowers/specs/2026-08-10-nav-refresh-consistency-design.md docs/superpowers/plans/2026-08-10-nav-refresh-consistency.md
git commit -m "Unify refresh navigation styling"
git push
```

PR을 생성해 `main`에 병합한다.
