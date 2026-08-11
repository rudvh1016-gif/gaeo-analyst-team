# 중첩 평가 설명 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기간별 과거 성과 아래에 중첩 평가의 계산 순서와 251회의 의미를 초보자도 이해할 수 있는 작은 상시 설명으로 표시한다.

**Architecture:** 기존 `renderPerformance` 결과에 설명용 안내문을 추가하고 기존 스냅샷 데이터를 그대로 사용한다. 계산 로직과 추천기간 선정은 변경하지 않으며, CSS와 UI 계약 테스트로 데스크톱·모바일 가독성을 보호한다.

**Tech Stack:** Vanilla JavaScript, CSS, Node.js 계약 테스트

## Global Constraints

- 상단 대표 업종은 추천 20거래일에 자동 연동한다.
- 5거래일 흐름은 단기 참고로 분리한다.
- 모든 계산·검증·표본에는 시작일과 종료일을 표시한다.
- `중첩 평가 251회`는 거래일 수나 독립적인 투자 횟수가 아님을 명시한다.
- 기존 TARO 및 거래량 비교기간 표시는 변경하지 않는다.

---

### Task 1: 중첩 평가 상시 설명

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation-ui.js`
- Modify: `rotation.css`

**Interfaces:**
- Consumes: `horizonPerformance[horizon].sampleCount`, 검증기간, 기간별 적중률
- Produces: `.rot-overlap-explanation` 상시 안내문

- [ ] **Step 1: Write the failing test**

`test_rotation_ui.js`의 실제 렌더 결과에서 매 거래일마다 1위 업종을 다시 선정하고 다음 관찰기간을 확인한다는 설명, 하루씩 이동하므로 관찰기간이 겹친다는 설명, 251회가 평가 시작일 개수라는 설명을 요구한다.

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_rotation_ui.js`

Expected: 새 중첩 평가 설명이 아직 없어 assertion failure.

- [ ] **Step 3: Write minimal implementation**

`renderPerformance`의 카드 그리드 아래에 `.rot-overlap-explanation`을 추가한다. 문구는 다음 의미를 모두 포함한다.

1. 각 거래일 당시까지의 최근 N거래일로 1위 업종을 선정한다.
2. 그다음 N거래일 동안 업종 중앙값을 웃돌았는지 확인한다.
3. 시작일을 하루씩 옮겨 반복하므로 관찰기간이 서로 겹친다.
4. 251회는 거래일 수나 독립 투자 횟수가 아니라 평가 시작일 251개의 결과다.

`rotation.css`에서는 본문보다 작은 회색 글씨, 충분한 행간, 모바일에서도 숨기지 않는 스타일만 추가한다.

- [ ] **Step 4: Run test to verify it passes**

Run: `node test_rotation_ui.js`

Expected: PASS.

- [ ] **Step 5: Run regression checks**

Run: `node test_rotation_ui.js` 및 저장소의 JavaScript 계약 테스트 전체.

Expected: 모든 테스트가 exit 0.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/plans/2026-08-11-overlap-evaluation-explanation.md test_rotation_ui.js rotation-ui.js rotation.css
git commit -m "중첩 평가 계산 방식 설명 추가"
```
