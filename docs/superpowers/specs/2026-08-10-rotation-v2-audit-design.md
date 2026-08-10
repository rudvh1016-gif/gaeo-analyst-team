# GAEO Rotation v2.0 감사 및 변경 설계

- 작성일: 2026-08-10
- 기준 브랜치: `origin/main`
- 입력 명세: `GAEO ROTATION v2.0 FINAL DEVELOPMENT MASTER SPEC`
- 원칙: 기존 구현 보존, 실제 데이터만 사용, LLM 토큰 0, 미래 데이터 누출 금지

## 1. Project Audit A~N

### A. 현재 69.8점의 계산

`rotation_engine.py`는 업종별 1·3·5·20·60·120·200거래일 자료를 만들고, 각 기간에서 24개 업종을 서로 비교해 다음 8개 구성요소를 0~100 백분위 점수로 바꾼다.

1. 상승 탄력 `momentum`
2. 시장 대비 강도 `relativeStrength`
3. 거래량 기반 자금 흐름 `flow`
4. 상승 종목 확산 `breadth`
5. 선행 흐름 `leadLag`
6. 과거 유사성 `similarity`
7. 시장 국면 적합도 `regimeMatch`
8. TARO 기술 확인 `taro`

현재 `rotation_model.json`은 `rotation-shadow-v1`이며 모든 구성요소 가중치가 `0.125`다. 따라서 철강·금속 5일 점수 69.8은 다음 실제 값의 동일가중 합계다.

| 구성요소 | 점수 | 가중 기여 |
|---|---:|---:|
| 상승 종목 확산 | 82.6 | 10.325 |
| 거래량 흐름 | 69.6 | 8.700 |
| 선행 흐름 | 61.1 | 7.638 |
| 상승 탄력 | 69.6 | 8.700 |
| 시장 국면 적합도 | 50.0 | 6.250 |
| 시장 대비 강도 | 82.6 | 10.325 |
| 과거 유사성 | 45.0 | 5.625 |
| TARO 확인 | 97.8 | 12.225 |
| 합계 |  | 69.788 → 69.8 |

이 점수는 상승확률이 아니라 현재 24개 업종 중 순환 조건을 상대적으로 얼마나 충족하는지 나타내는 종합점수다.

### B. 현재 Score의 통계적 취약점

- 공개 가중치는 아직 Walk-forward로 승격되지 않은 동일가중 Shadow 모델이다.
- Score 구간과 미래 초과수익률 사이의 단조성이 검증되지 않았다.
- 기존 백테스트는 20일 과거수익으로 고른 선두의 5일 결과만 평가한다. 1·3·5·20일 모델을 독립 평가하지 않는다.
- Lead-Lag는 상관계수와 전후반 방향 일치만 사용하며 다중검정 보정과 유의확률이 없다.
- Similarity는 24개 업종 수익률 순위 벡터의 유클리드 거리만 사용한다.
- 정확한 거래대금 이력이 없어 거래량 상대비율을 자금 흐름의 대체값으로 사용한다.
- 과거 시가총액과 업종 구성 변경 이력이 없어 시가총액 가중·과거 구성 복원은 할 수 없다.
- 아카이브가 1거래일뿐이라 실제 점수 변화 방향을 아직 표시할 수 없다.

### C. 현재 기간 구현

- 엔진 계산: 1·3·5·20·60·120·200거래일
- 공개 예측 기간 상수: 1·3·5·20거래일
- 현재 화면: 일곱 기간을 같은 종류의 탭으로 표시
- 현재 백테스트: 미래 5거래일만 평가

v2.0에서는 1·3·5·20일을 검증 대상 관찰기간으로, 60·120·200일을 중장기 추세 문맥으로 분리한다.

### D. 업종별 종목 수 보정

- 비율: Beta-Binomial 방식으로 전체 시장 상승률 쪽으로 축소하며 현재 prior strength는 6이다.
- 연속 수익률: 업종 중앙값을 전체 유니버스 중앙값 쪽으로 축소하며 strength는 6이다.
- 표본 신뢰도: 유효 종목 수와 커버리지로 높음·보통·낮음을 구분한다.
- 미흡: 상대강도·TARO·거래량 흐름은 별도의 표본 축소가 없다. prior strength도 Empirical Bayes로 교정되지 않았다.

### E. 대장주 집중 보정

양의 동일가중 수익 기여분에서 Top1·Top3·Top5 집중도를 계산한다. Top3 80% 이상이면 신뢰도를 낮추지만 최종 점수 자체의 감점과 설명용 기여도는 없다. v2.0에서는 점수와 별도로 위험 감점·설명 근거·Gate에 같은 기준을 공개한다.

### F. TARO 재사용 데이터

`indicators.json`에 500종목의 MA5·20·60·120·200, 기울기, RSI14, MACD, 거래량비, 볼린저밴드, 52주 위치, 시장·업종 상대강도, 수급·위험 정보가 있다. 현재 Rotation은 이를 전달받고도 사용하지 않고 가격 이력에서 `_stock_taro()`를 중복 계산한다. v2.0은 기존 `indicators.json`을 우선 사용하고, 누락 종목만 기존 순수 계산으로 보완한다.

### G. Historical Similarity 집계 기간

- 원천 이력: 2025-06-04~2026-08-10, 약 290거래일
- Embargo: 최근 30일
- 현재 사례: 거리 상위 5건
- 결과 기간: 미래 5거래일
- 한계: 현재 국면·거래 흐름·TARO Feature가 포함되지 않고 성공/실패·Benchmark·표본 신뢰도가 화면에 없다.

### H. Lead-Lag 방식

24개 업종의 일별 중앙 수익률에 대해 1~20일 시차 Pearson 상관을 구하고, 전체 표본의 전반·후반에서 부호와 최소 강도가 유지되는 관계만 탐색 Edge로 남긴다. 최소 60쌍, 기본 상관 0.25이며 최대 12개 Edge다. 현재 자료에서는 통과 Edge가 0개다.

### I. 자동 업데이트

- `update-analysis.yml`: 장중 약 30분 주기, `compute_indicators.py` 직후 Rotation 생성
- 15:40 이전: intraday 스냅샷
- 15:40 이후: close 스냅샷과 일별 아카이브
- `rotation-maintenance.yml`: 매주 월요일 05:15 KST에 테스트·백테스트·스냅샷 갱신
- 핵심 엔진은 네트워크와 LLM API를 사용하지 않는다.

### J. 빈 공간 Component 구조

PC에서 기존 `Rotation Map + 순위/Quick Detail` 아래에 다음 분석 영역을 추가한다.

1. 오늘의 종합 해석과 추천 관찰기간
2. 다음 순환 후보 상세, 핵심 이유 3개, 신호 품질
3. 실제 아카이브 기반 순환점수 변화 또는 `자료 축적 중`
4. 기간별 Walk-forward 성과와 추천 근거
5. 과거 유사 시장의 기간·Benchmark·성공 정의·표본
6. 업종 내 TARO 관심 종목
7. 점수 구성·모델 버전·산식 설명

### K. 필요한 Backend 변경

- 구성요소별 정규화 가중치와 실제 기여점수 저장
- 점수 상태·단계·모델 합의도·신호 품질·자연어 근거 생성
- 기존 지표 기반 TARO 상세와 후보 종목 생성
- 아카이브를 이용한 전일/최근 점수 변화와 변화 기여 저장
- 1·3·5·20일 Walk-forward 성능·추천기간·점수구간 성과 생성
- 유사 국면에 분석 기간·Benchmark·성공 정의·성공/실패 집계 추가
- 모델 버전과 검증 범위 확장

### L. 필요한 Front-end 변경

- 상단 5개 요약: 현재 주도·다음 후보·둔화 업종·시장 국면·추천 관찰기간
- 오늘의 종합 해석
- 예측기간과 추세문맥 탭 구분
- Map·Ranking에 점수 상태와 변화 표시
- 점수 클릭 시 구성·기여·확률 아님 설명
- 세부 항목 도움말과 쉬운 해석
- 추천기간 근거·기간별 성과·통계 기준 펼치기
- 다음 후보·점수 변화·TARO 종목을 PC 빈 공간과 모바일 읽기 순서에 배치

### M. Backtest 계획

1. 날짜순으로만 평가하고 평가일 이후 자료를 Feature에 전달하지 않는다.
2. 1·3·5·20일을 독립 평가한다.
3. 각 평가일에서 당시 사용 가능한 가격·거래량·시장 자료로 Shadow Score를 만든다.
4. 미래 업종 수익률에서 해당 시장 Benchmark를 뺀 초과수익률을 Outcome으로 사용한다.
5. Sample Count, Hit Rate, Top-3 Hit Rate, 평균·중앙 초과수익률, Positive Rate, MAE, Rank Correlation, 최근 재현성과 안정성을 저장한다.
6. 업종×시장 국면×기간 표본이 작으면 전체 기간 성과 쪽으로 축소한다.
7. 충분한 표본과 안정성이 없는 기간은 추천하지 않고 `추천 근거 축적 중`을 반환한다.
8. Score 구간 성과가 단조적이지 않으면 상태 구간을 `임시 기준`으로 표시하고 높은 신뢰도를 잠근다.

### N. 예상 수정 파일

- `rotation_engine.py`
- `rotation_backtest.py`
- `backtest_rotation.py`
- `compute_rotation.py`
- `rotation-ui.js`
- `rotation.css`
- `test_rotation.py`
- `test_rotation_ui.js`
- `test_rotation_workflow.py`
- `.github/workflows/rotation-maintenance.yml`
- 생성물 `rotation_model.json`, `rotation_snapshot.js`, `rotation_archive.json`

## 2. 채택한 구현 방식

### 검토안 1: 화면만 확장

빠르지만 현재 없는 점수 변화·기간 성과·후보 종목을 예시 숫자로 채우게 된다. FINAL SPEC의 실제 데이터 원칙을 위반하므로 제외한다.

### 검토안 2: 기존 엔진을 보존하는 Schema 확장

현재 점수 산식과 자동화는 유지하면서 설명·성능·후보 종목 Layer를 추가한다. 자료가 부족한 항목은 상태를 명시하고 축적 후 자동으로 열린다. 기존 화면과 생성 파이프라인의 위험을 가장 낮추므로 채택한다.

### 검토안 3: 모델 전면 교체

현재 290거래일 이력으로 복잡한 Ensemble을 새로 최적화하면 과적합 위험이 크다. 장기 데이터가 쌓인 뒤 Shadow 모델 비교를 통해 승격해야 하므로 제외한다.

## 3. v2.0 Architecture

```text
기존 가격·지수·indicators.json
               |
               v
rotation_engine.py
  기존 8개 Score + 기여도 + 단계 + 설명 + TARO 종목
               |
               +---- rotation_archive.json → 실제 점수 변화
               |
               +---- rotation_model.json → 기간 성과·추천기간·통계
               v
rotation_snapshot.js
               |
               v
rotation-ui.js + rotation.css
  시장 → 업종 → 근거 → 통계 → 종목
```

## 4. 데이터 계약

기존 필드는 삭제하지 않는다. 다음 선택 필드를 추가한다.

- Snapshot: `recommendedHorizon`, `overallInterpretation`, `scoreScale`
- Model: `version`, `validation`, `horizonPerformance`, `recommendedHorizon`, `scoreCalibration`
- Sector: `stage`, `scoreChange`, `signalQuality`, `candidateStocks`, `explanation`
- Period: `weights`, `contributions`, `agreement`, `interpretation`, `trendContext`
- Similarity: `analysisPeriod`, `benchmark`, `successDefinition`, `summary`

자료가 부족하면 숫자를 만들지 않고 `null`, `accumulating`, `자료 축적 중`을 사용한다.

## 5. UI 설계

색상은 기존 Paper `#F5F5F7`, Surface `#FFFFFF`, Ink `#1D1D1F`, Signal Blue `#2563EB`, Risk Red `#D84A4A`, Neutral Gray를 유지한다. 상승·강화는 제한된 파랑, 약화·위험은 제한된 빨강만 사용한다.

Desktop은 상단 결론과 5개 요약, Map+Ranking, 하단 넓은 분석 영역+Quick Detail 순서다. Mobile은 결론, 추천기간, 주도/후보, Map, 후보 상세, 점수 설명, 기간 성과, TARO 종목 순서다.

화면의 대표적인 시각 장치는 원형 Map을 유지하되 각 Node에 `점수·변화·단계`를 함께 표시하는 것이다. 검증 Edge가 없으면 화살표를 그리지 않는다. 지속 애니메이션은 사용하지 않는다.

## 6. 실패와 보수적 표시

- 아카이브 2일 미만: 점수 변화 대신 `점수 변화 자료 축적 중`
- Horizon 평가 표본 부족: 추천기간 대신 `추천 근거 축적 중`
- 유사 사례 부족: 성공률 숨김
- Candidate Gate 실패: `뚜렷한 다음 순환 신호 없음`
- 지표 누락 종목: 후보 종목에서 제외하고 제외 수 표시
- 새 계산 실패: 마지막 정상 스냅샷 유지

## 7. 검증 기준

- 구성 기여점수 합계가 최종 Score와 반올림 오차 0.1 이내로 일치
- 미래행 추가가 과거 as-of 결과를 바꾸지 않음
- 기간 추천은 표본·Walk-forward·안정성 Gate를 통과해야 함
- 후보 종목은 선택 업종에 속하고 기존 종목 상세로 이동
- 정확한 거래대금·확률로 오해할 표현 없음
- PC 1680/1920, 모바일 360/390, 라이트/다크, 키보드, reduced motion에서 오류·가로 넘침 없음
- 기존 홈·메뉴·순환매 지연 로딩과 자동 생성 파일 소유권 유지
