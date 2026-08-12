# Rotation Targeted Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve GAEO의 기존 Walk-forward 및 기간 UI를 유지하면서 점수, 점수 변화, 순환 경로, 유사 시장, 관심 종목, 최종 종합의견을 실제 데이터 기반으로 이해하기 쉽게 만든다.

**Architecture:** 무거운 통계는 기존 Python 스케줄러에서 계산해 `rotation_model.json`과 `rotation_snapshot.js`에 저장한다. 프런트엔드는 스냅샷만 읽고 결정론적 템플릿으로 설명하며, 데이터가 없으면 명시적으로 축적 중 상태를 표시한다.

**Tech Stack:** Python 3 표준 라이브러리, Vanilla JavaScript, CSS, Node 계약 테스트, unittest, Playwright/Chrome.

## Global Constraints

- 기존 1·3·5·20일 Walk-forward 카드와 상세 설명을 삭제하거나 축약하지 않는다.
- 추천 Horizon은 검증 성과에서 자동 선택하고 60·120·200일은 장기 참고로만 둔다.
- Rotation Score와 상승확률을 혼동시키지 않는다.
- 없는 Lead-Lag, 기여도, 과거 표본을 생성하지 않는다.
- TARO 원점수는 변경하지 않고 관심 종목용 별도 관찰순위만 계산한다.
- LLM과 페이지 로드 재계산 없이 스냅샷 기반으로 동작한다.
- 모바일 순서는 점수 → 의미 → 근거 → 변화 → 흐름 → 유사시장 → 종목 → 활용 → 종합의견이다.

---

### Task 1: 추천기간 및 유사시장 모델

**Files:**
- Modify: `backtest_rotation.py`
- Test: `test_rotation.py`

**Interfaces:**
- Produces: `recommendedHorizon.evidence`, `similarMarkets.summary`, `similarMarkets.cases[].sectorOutcome`

- [ ] 추천기간이 적중률·평균/중앙 초과·안정성·최근 재현·표본을 종합하고 세부 근거를 반환하는 실패 테스트를 작성한다.
- [ ] 현재 추천 함수가 테스트에 실패하는지 확인한다.
- [ ] 시장 국면 자료가 없으면 `regimeMatchStatus: accumulating`으로 표시하고 나머지 실제 지표를 정규화해 추천한다.
- [ ] 유사시장 결과 Horizon을 추천기간과 동기화하고 선택 업종별 성공·실패·초과수익 집계를 생성한다.
- [ ] Python 테스트를 통과시킨다.

### Task 2: 점수 변화와 관심 종목 스냅샷

**Files:**
- Modify: `rotation_engine.py`
- Modify: `compute_rotation.py`
- Test: `test_rotation.py`

**Interfaces:**
- Produces: `scoreChange.previousScore/currentScore/componentDeltas`, `candidateStocks[].rotationRank`, `candidateStocks[].maStatus`

- [ ] 이전 스냅샷 구성요소가 있을 때 실제 기여 변화가 합계와 일치하는 실패 테스트를 작성한다.
- [ ] Archive에 구성요소와 기여도를 보존하고, 자료가 없을 때는 `componentStatus: accumulating`을 반환한다.
- [ ] TARO·거래량·업종 백분위·과열 페널티 기반의 별도 관심 종목 순위를 테스트한다.
- [ ] 실제 TARO 점수는 그대로 보존하면서 관찰순위와 MA20/60/120/200 상태를 생성한다.
- [ ] Python 테스트를 통과시킨다.

### Task 3: 설명 중심 상세 UI

**Files:**
- Modify: `rotation-ui.js`
- Modify: `rotation.css`
- Test: `test_rotation_ui.js`

**Interfaces:**
- Consumes: Task 1·2 스냅샷 필드
- Produces: 선택 업종 점수 의미, 구성요소 상세, 점수 변화 이유, 순환 경로, 유사시장, TOP5 종목, 활용 안내, 최종 종합의견

- [ ] 최종 명세의 사용자 질문에 답하는 렌더링 실패 테스트를 작성한다.
- [ ] 기존 Walk-forward HTML 보존 테스트가 계속 통과함을 확인한다.
- [ ] 구성요소를 `강도·점수·기여·한 줄 해석` 기본형과 `<details>` 계산 기준으로 렌더링한다.
- [ ] 점수 변화의 이전/현재/비교일과 실제 TOP 변화 또는 축적 중 상태를 렌더링한다.
- [ ] 선행 흐름과 유사시장을 사용자 언어 및 집계 우선 구조로 렌더링한다.
- [ ] TOP5 종목과 최종 종합의견을 실제 스냅샷 값으로 렌더링한다.
- [ ] 모바일 정보 순서와 다크모드를 CSS로 보완한다.
- [ ] Node UI 테스트를 통과시킨다.

### Task 4: 산출물 재생성 및 QA

**Files:**
- Regenerate: `rotation_model.json`
- Regenerate: `rotation_snapshot.js`
- Modify if produced by close run: `rotation_archive.json`

- [ ] `backtest_rotation.py`로 모델을 재생성한다.
- [ ] `compute_rotation.py --mode close`로 스냅샷을 재생성한다.
- [ ] 전체 JavaScript와 Python 테스트를 실행한다.
- [ ] Chrome 데스크톱·390px 모바일에서 기간 선택, 업종 선택, 펼쳐보기, 종목 클릭, Walk-forward 보존을 확인한다.
- [ ] Preserve 체크리스트를 명세와 대조한다.

### Task 5: 게시

**Files:** 명시적으로 변경된 파일만 스테이징한다.

- [ ] `git diff --check`와 최종 테스트를 새로 실행한다.
- [ ] 사용자 소유 `work/`를 제외하고 커밋한다.
- [ ] 원격 브랜치를 푸시하고 가능하면 PR을 생성한다.
- [ ] PR API가 차단되면 최신 `main` 확인 후 fast-forward로 반영한다.
- [ ] 원격 `main`과 최종 커밋 SHA가 같은지 확인한다.
