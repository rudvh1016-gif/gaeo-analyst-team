# Rotation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 500종목과 24업종의 실제 가격·거래량·기술지표를 규칙 기반으로 집계해 `?m=rotation`에서 주도 업종, 관찰 후보, 무신호, 시장 국면과 통계 근거를 보여주는 순환매 시스템을 완성한다.

**Architecture:** 계산은 순수 함수 모듈 `rotation_engine.py`에 두고, `compute_rotation.py`가 현재 스냅샷과 일별 아카이브를 원자적으로 생성한다. `backtest_rotation.py`는 날짜순 Walk-forward 결과와 캐시형 Lead-Lag·신뢰도 교정을 만들며, 정적 화면은 지연 로딩되는 `rotation_snapshot.js`, `rotation-ui.js`, `rotation.css`만 사용한다.

**Tech Stack:** Python 3 표준 라이브러리, unittest, 정적 HTML/CSS/바닐라 JavaScript, 결정론적 SVG, GitHub Actions

## Global Constraints

- 실제 데이터와 규칙 기반 계산만 사용하고 LLM API를 호출하지 않는다.
- 평가 날짜 이후 데이터를 참조하지 않으며 Random split을 사용하지 않는다.
- 정확한 거래대금이 없으므로 화면에는 `거래량 기반 자금 흐름`이라고 표시한다.
- 높은 신뢰도는 Walk-forward 교정이 확인될 때까지 허용하지 않는다.
- 데이터가 부족하면 `관찰`, `통계 축적 중`, `뚜렷한 순환 신호 없음`을 반환한다.
- 기존 화면·기능·콘텐츠와 자동 생성 파일 소유권을 보존한다.
- 사용자 노출 문구에는 Emoji와 em dash를 사용하지 않는다.
- PC, 모바일, 다크모드, 키보드, `prefers-reduced-motion`을 지원한다.

---

### Task 1: 순환매 순수 계산 엔진

**Files:**
- Create: `rotation_engine.py`
- Create: `test_rotation.py`

**Interfaces:**
- Consumes: 종목별 `{date, close, volume}` 이력, 업종·시장 매핑, 지수 이력, 현재 기술지표
- Produces: `build_snapshot(...) -> dict`, `build_asof_snapshot(...) -> dict`, `compute_lead_lag(...) -> list`, `find_similar_periods(...) -> dict`

- [ ] **Step 1: 수익률·보정·집중도 실패 테스트 작성**

```python
class RotationMathTest(unittest.TestCase):
    def test_period_return_uses_exact_horizon(self):
        self.assertEqual(period_return([100, 102, 105, 110], 3), 10.0)

    def test_beta_binomial_shrinks_small_sector_to_market(self):
        self.assertAlmostEqual(beta_binomial_rate(1, 2, 0.5, 4), 0.5)

    def test_positive_concentration_uses_only_positive_contribution(self):
        self.assertEqual(concentration([8, 2, -5], 1), 80.0)
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `python -m unittest test_rotation.RotationMathTest -v`

Expected: `ModuleNotFoundError: rotation_engine`

- [ ] **Step 3: 핵심 수학 함수 최소 구현**

```python
def period_return(values, horizon): ...
def winsorized_mean(values, proportion=0.1): ...
def beta_binomial_rate(successes, total, market_rate, prior_strength): ...
def shrink_value(value, center, sample_size, strength): ...
def concentration(contributions, top_n): ...
```

- [ ] **Step 4: 업종·시장 국면·Gate 실패 테스트 작성**

```python
def test_sector_snapshot_reports_breadth_flow_taro_and_sample(self): ...
def test_high_concentration_lowers_confidence(self): ...
def test_weak_models_return_no_signal(self): ...
def test_kospi_stock_uses_kospi_benchmark(self): ...
def test_future_rows_do_not_change_asof_snapshot(self): ...
```

- [ ] **Step 5: 스냅샷 계산 구현**

```python
HORIZONS = (1, 3, 5, 20, 60, 120, 200)
PUBLIC_HORIZONS = (1, 3, 5, 20)

def build_snapshot(stocks, sectors, markets, indices, indicators=None,
                   model=None, as_of=None, generated_at=None): ...
def build_asof_snapshot(...): ...
def classify_regime(indices, stock_series, as_of=None): ...
def gate_signal(sector, horizon, model): ...
```

- [ ] **Step 6: 전체 엔진 테스트 실행**

Run: `python -m unittest test_rotation -v`

Expected: 모든 수학·업종·무신호·미래 누출 테스트 PASS

---

### Task 2: 입력 로더와 원자적 스냅샷 생성

**Files:**
- Create: `compute_rotation.py`
- Modify: `test_rotation.py`
- Generate: `rotation_snapshot.js`
- Generate: `rotation_archive.json`
- Generate: `rotation_model.json`

**Interfaces:**
- Consumes: `tickers.js`, `krx_list.json`, `price_history.js`, `index_history.js`, `indicators.json`
- Produces: 브라우저 전역 `window.ROTATION_SNAPSHOT`, 하루 1건 아카이브, 기본 Shadow 모델

- [ ] **Step 1: 실제 형식 로더·원자적 보존 실패 테스트 작성**

```python
def test_loaders_filter_to_configured_universe_and_sort_dates(self): ...
def test_invalid_snapshot_does_not_replace_last_good_file(self): ...
def test_close_mode_archives_once_per_day(self): ...
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `python -m unittest test_rotation.RotationIoTest -v`

Expected: `compute_rotation` import 또는 함수 부재로 FAIL

- [ ] **Step 3: 로더와 CLI 구현**

```python
def load_inputs(root): ...
def validate_snapshot(snapshot): ...
def atomic_write(path, text): ...
def update_archive(path, snapshot): ...
def main(argv=None): ...  # --mode intraday|close, --root, --now
```

- [ ] **Step 4: 현재 데이터로 초기 생성**

Run: `python compute_rotation.py --mode intraday`

Expected: schemaVersion 1, 24업종, 유효 유니버스와 기준 시각이 있는 스냅샷 생성

- [ ] **Step 5: 생성 결과 검증**

Run: `python -m unittest test_rotation -v`

Expected: PASS, 마지막 정상 파일 보존과 하루 1회 아카이브 증명

---

### Task 3: Walk-forward, Lead-Lag와 유사 시장

**Files:**
- Create: `backtest_rotation.py`
- Modify: `rotation_engine.py`
- Modify: `test_rotation.py`
- Generate: `rotation_model.json`

**Interfaces:**
- Consumes: 날짜별 과거 종목·지수 이력, 현재 업종 분류
- Produces: Horizon별 성능, Calibration, 캐시형 Lead-Lag Edge, 유사 시장 통계, 모델 버전·검증 기간

- [ ] **Step 1: 시차·Embargo·Walk-forward 실패 테스트 작성**

```python
def test_lead_lag_points_from_leader_to_lagging_sector(self): ...
def test_similarity_excludes_overlapping_future_window(self): ...
def test_walk_forward_never_passes_future_rows_to_builder(self): ...
def test_high_confidence_stays_locked_without_calibration_order(self): ...
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `python -m unittest test_rotation.RotationBacktestTest -v`

Expected: Lead-Lag·Walk-forward 함수 부재로 FAIL

- [ ] **Step 3: 통계 계산 구현**

```python
def compute_lead_lag(sector_returns, max_lag=20, min_pairs=60): ...
def find_similar_periods(features, current_date, horizon, embargo=None): ...
def walk_forward(inputs, horizons=(1, 3, 5, 20)): ...
def calibrate_model(records): ...
```

- [ ] **Step 4: 백테스트 CLI 구현**

```python
def main(argv=None): ...  # --root, --weekly, --monthly, --as-of
```

- [ ] **Step 5: 현재 이력에서 보수적 모델 생성**

Run: `python backtest_rotation.py --weekly --monthly`

Expected: 이력이 부족한 기능은 탐색적·통계 축적 중으로 저장하고 높은 신뢰도 잠금 유지

---

### Task 4: 정적 순환매 화면과 내비게이션

**Files:**
- Create: `rotation.css`
- Create: `rotation-ui.js`
- Create: `test_rotation_ui.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `window.ROTATION_SNAPSHOT`
- Produces: `window.GaeoRotation.mount(container, data)`, `window.GaeoRotation.destroy()`, `?m=rotation`

- [ ] **Step 1: 지연 로딩·라우팅·접근성 실패 테스트 작성**

```js
assert.equal(normalizeGaeoMode('rotation'), 'rotation');
await setModeAndWait('rotation');
assert.equal(rotationView.hidden, false);
assert.ok(rotationView.querySelector('[aria-label="순환매 업종 지도"]'));
assert.ok(rotationView.querySelector('table caption'));
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node test_rotation_ui.js`

Expected: rotation route 또는 renderer 부재로 FAIL

- [ ] **Step 3: 화면 자산 구현**

Frontend direction:

- Palette: Paper `#F5F5F7`, Surface `#FFFFFF`, Ink `#1D1D1F`, Signal Blue `#2563EB`, Risk Red `#D84A4A`, Muted `#6E737D`와 기존 다크 토큰
- Type: 사이트 본문 시스템 글꼴, 업종·수치에는 tabular 숫자, 데이터 기준에는 작은 utility label
- Layout: 모바일은 후보와 순위를 지도보다 먼저, PC는 지도와 순위를 2열 배치
- Signature: 1·3·5·20일 Horizon을 동심 궤도로 표현하는 결정론적 Rotation Map. 장식이 아니라 Node의 현재 기간 위치를 의미한다.

```js
window.GaeoRotation = {
  mount(container, data) { ... },
  destroy() { ... }
};
```

- [ ] **Step 4: 내비게이션과 지연 로딩 연결**

```html
<button class="global-link" data-nav-mode="rotation">순환매</button>
<button class="modebtn" id="mode-rotation">순환매</button>
<section id="rotationView" hidden></section>
```

`GaeoFeatures`가 `rotation.css`, `rotation_snapshot.js`, `rotation-ui.js`를 진입 시 한 번만 불러오고 `setMode('rotation')`이 mount한다.

- [ ] **Step 5: 키보드·모바일 동작 구현**

Node는 button 역할과 업종명 label을 가지며 Enter·Space로 상세를 연다. Escape는 모바일 상세 Sheet를 닫고 포커스를 선택 Node로 돌린다. reduced motion에서는 Edge 애니메이션을 사용하지 않는다.

- [ ] **Step 6: UI 테스트 실행**

Run: `node test_rotation_ui.js` 및 기존 Node 회귀 테스트

Expected: 딥링크, 지연 로딩, 표, 상세, 기존 메뉴 테스트 PASS

---

### Task 5: 자동화와 파일 소유권

**Files:**
- Modify: `.github/workflows/update-analysis.yml`
- Create: `.github/workflows/rotation-maintenance.yml`
- Modify: `AGENTS.md`
- Modify: `test_rotation.py`

**Interfaces:**
- Consumes: 기존 장중 분석 체인의 최신 입력
- Produces: 30분 스냅샷, 장 마감 아카이브, 주간 Lead-Lag, 월간 Walk-forward 갱신

- [ ] **Step 1: 자동화 계약 실패 테스트 작성**

```python
def test_workflow_runs_rotation_after_indicators(self): ...
def test_generated_rotation_files_are_staged_by_owner_workflow(self): ...
def test_rotation_code_contains_no_llm_client_or_network_call(self): ...
```

- [ ] **Step 2: 기존 체인 연결**

`compute_indicators.py` 직후 `python3 compute_rotation.py --mode intraday`를 실행하고 생성 파일 add 목록에 rotation 3종을 추가한다. 15:40 이후에는 close 모드를 idempotent하게 호출한다.

- [ ] **Step 3: 백업 유지보수 workflow 작성**

수동 실행, 일요일 주간 캐시, 매월 첫 거래 주 월간 검증을 제공한다. 외부 PR 트리거와 LLM 비밀키를 추가하지 않는다.

- [ ] **Step 4: 운영 문서 갱신**

`AGENTS.md` 파일 맵과 파이프라인 설명에 순환매 파일 소유권·일정을 추가한다.

---

### Task 6: 전체 검증과 배포

**Files:**
- Verify all changed files

**Interfaces:**
- Consumes: 완성된 계산·UI·자동화
- Produces: 검증된 PR과 `main` 배포

- [ ] **Step 1: 전체 자동 테스트**

```bash
python -m unittest test_rotation -v
node test_rotation_ui.js
node test_navigation_scorecard.js
node test_weekday_rates_expanded.js
node test_nav_refresh_consistency.js
node test_market_summary_style.js
node test_mobile_radar_layout.js
python test_radar.py
```

- [ ] **Step 2: 현재 데이터 Smoke Test**

```bash
python compute_rotation.py --mode intraday
python backtest_rotation.py --weekly --monthly
```

스키마 1, 24업종, 현행 500종목만 사용, 결정론적 동일 출력, 미래 누출 방지를 확인한다.

- [ ] **Step 3: 실제 브라우저 검증**

1680px, 1920px, 390px, 360px, 라이트·다크·reduced motion에서 `?m=rotation` 스크린샷과 pageerror 0건을 확인한다. Tab·Enter·Escape 동작을 확인한다.

- [ ] **Step 4: 변경 범위 검토**

`git diff --check`, 삭제 줄, 기존 주요 화면, 자동 생성 파일 소유권을 확인한다.

- [ ] **Step 5: 커밋·푸시·PR·main 병합**

```bash
git add <rotation source, tests, generated snapshots, workflow, docs>
git commit -m "Build rotation analysis system"
git push -u origin feature/rotation-system
```

PR을 생성하고 `main`에 병합한 뒤 원격 `main`이 구현 커밋을 포함하는지 확인한다.
