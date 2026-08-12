# 52주 지표 카드 숫자 넘침 수정 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 데스크톱 종목 상세에서 긴 52주 가격 범위가 카드 경계 안에 한 줄로 표시되도록 한다.

**Architecture:** 기존 `index.html`의 반응형 지표 그리드를 유지하고, 1180px 이상에서 52주 카드에만 적용되는 최소 폭을 140px로 늘린다. 소스 계약 테스트와 실제 롯데쇼핑 브라우저 측정을 함께 사용해 재발을 막는다.

**Tech Stack:** HTML, CSS Grid, Node.js 계약 테스트, Playwright 브라우저 검증

## Global Constraints

- 52주 값의 글자 크기와 `white-space: nowrap`을 유지한다.
- 다른 여섯 개 지표 카드의 크기와 스타일을 변경하지 않는다.
- 1180px 미만의 전체 행 배치를 유지한다.
- 로컬 미추적 `work/` 폴더는 커밋하지 않는다.

---

### Task 1: 52주 카드 데스크톱 최소 폭 수정

**Files:**
- Modify: `test_market_summary_style.js`
- Modify: `index.html:651-663`

**Interfaces:**
- Consumes: `.qmetrics`, `.qm-wide`, `.qm-val` CSS 규칙
- Produces: 1180px 이상에서 최소 140px인 52주 카드

- [ ] **Step 1: Write the failing contract test**

`test_market_summary_style.js`에 다음 계약을 추가한다.

```js
assert.match(html, /@media\(min-width:1180px\)[\s\S]*?\.qmetrics \.qm-wide\{grid-column:auto;min-width:140px\}/);
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node test_market_summary_style.js`

Expected: 현재 CSS가 `min-width:112px`이므로 assertion failure.

- [ ] **Step 3: Implement the minimal CSS change**

`index.html`의 데스크톱 미디어쿼리에서 다음과 같이 변경한다.

```css
@media(min-width:1180px){
  .qmetrics .qm-wide{grid-column:auto;min-width:140px}
}
```

- [ ] **Step 4: Run the contract test and verify GREEN**

Run: `node test_market_summary_style.js`

Expected: `market summary style tests passed`.

- [ ] **Step 5: Verify real browser geometry**

롯데쇼핑(`023530`)을 1285px 뷰포트에서 열어 `.qm-val.scrollWidth <= .qm-val.clientWidth`와 한 줄 표시를 확인한다.

- [ ] **Step 6: Run repository regression tests**

모든 `test_*.js`와 `python -m unittest discover -p test_*.py`를 실행한다.

- [ ] **Step 7: Commit and publish**

```bash
git add docs/superpowers/plans/2026-08-11-52week-metric-overflow.md test_market_summary_style.js index.html
git commit -m "52주 지표 카드 숫자 넘침 수정"
git push -u origin agent/fix-52week-metric-overflow
```
