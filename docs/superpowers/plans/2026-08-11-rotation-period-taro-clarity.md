# Rotation Period and TARO Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 추천 관찰기간과 상단 업종 기준을 일치시키고, 기간·표본·실제 TARO·거래량 비교 기준을 오해 없이 표시한다.

**Architecture:** 자동분석이 만든 실제 TARO를 순환매 입력으로 전달하고, 엔진이 현재·시장국면·검증·거래량 기간 메타데이터를 스냅샷에 저장한다. UI는 추천기간을 기본값으로 사용하고 각 숫자 옆에 데이터의 기간과 정의를 표시한다.

**Tech Stack:** Python 3.11, 정적 JavaScript, Node.js 계약 테스트, GitHub Actions

## Global Constraints

- 생성물 `rotation_snapshot.js`는 `compute_rotation.py`로만 갱신한다.
- 실제 TARO와 다른 점수를 TARO라고 표시하지 않는다.
- 표본 251회는 중첩 평가 사례이며 독립 시행 확률로 표현하지 않는다.
- 기존 1·3·5·20 및 60·120·200 기간 탭을 유지한다.
- 기존 사용자 소유 `work/`는 스테이징하지 않는다.

---

### Task 1: 실제 TARO와 기간 메타데이터 계약

**Files:**
- Modify: `test_rotation.py`
- Modify: `compute_rotation.py`
- Modify: `rotation_engine.py`
- Modify: `.github/workflows/update-analysis.yml`

**Interfaces:**
- Consumes: `LIVE_AUTO.stocks[code].taro.score`, 기술지표 `volRatio`, 가격이력 날짜
- Produces: 후보의 `taroScore`, `taroSource`, `volumeBaseline`, 요약·시장국면 기간 메타데이터

- [ ] **Step 1: 실제 TARO, 추천기간 연동, 거래량 기간을 요구하는 실패 테스트를 작성한다.**
- [ ] **Step 2: `python -m unittest test_rotation -v`를 실행해 기존 별도 TARO와 고정 5일 때문에 실패하는지 확인한다.**
- [ ] **Step 3: 자동분석 입력 로드, 추천기간 선택, 기간 범위 계산, 거래량 기준 저장을 최소 구현한다.**
- [ ] **Step 4: 자동화에서 `analyze_auto.py`를 `compute_rotation.py`보다 먼저 실행하도록 순서를 조정한다.**
- [ ] **Step 5: 단위 테스트를 다시 실행해 통과시킨다.**

### Task 2: 오해 없는 UI 문구

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation-ui.js`
- Modify: `rotation.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1이 만든 기간·원천 메타데이터
- Produces: 추천기간 기본 화면, 단기 참고, 시장국면별 기간, 검증기간·중첩표본, 거래량 분모 표시

- [ ] **Step 1: 원하는 한국어 문구와 기본 선택기간을 검증하는 실패 UI 계약 테스트를 작성한다.**
- [ ] **Step 2: `node test_rotation_ui.js`를 실행해 기존 모호한 문구 때문에 실패하는지 확인한다.**
- [ ] **Step 3: `rotation-ui.js`의 요약·성과·후보 카드와 초기 상태를 최소 수정한다.**
- [ ] **Step 4: 필요한 보조 문구가 모바일에서도 읽히도록 기존 카드 CSS 안에서만 조정하고 자산 버전을 올린다.**
- [ ] **Step 5: UI 계약 테스트를 다시 실행해 통과시킨다.**

### Task 3: 생성물·통합 검증·배포

**Files:**
- Modify: `rotation_snapshot.js`
- Modify: 관련 테스트가 요구하는 정적 자산 참조

**Interfaces:**
- Consumes: 수정된 엔진, 자동분석, UI
- Produces: 2026-08-11 종가 기준 검증된 정적 배포물

- [ ] **Step 1: 실제 생성 순서로 TARO와 순환매 스냅샷을 재생성한다.**
- [ ] **Step 2: Python·Node·워크플로 테스트와 `git diff --check`를 실행한다.**
- [ ] **Step 3: 브라우저에서 추천 20일, 실제 TARO, 거래량 비교 기준과 기간 문구를 확인한다.**
- [ ] **Step 4: 의도한 파일만 스테이징하고 커밋한다.**
- [ ] **Step 5: 승인된 원격 브랜치에 푸시하고 PR을 생성한 뒤 `main`에 병합한다.**

