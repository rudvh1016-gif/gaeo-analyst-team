# GAEO PC Left Insight Rail Locked Redesign

## 목표

기존 데스크톱 Rail과 300px Overlay Panel의 기능·데이터·라우팅·상태 복원을 그대로 보존하면서, 여섯 탭을 하나의 조용한 금융 편집 UI로 정돈한다. 종목명이 시각적 기준점이 되고 모든 중요 숫자에 의미 라벨을 붙인다.

## 접근 방식

기존 `insight-rail.js`의 데이터 접근과 이벤트 처리를 유지한다. 표시 계층에만 공통 숫자·시각·신호 포맷터와 Ranking/Change/Signal/History/Article 행 문법을 추가한다. 스타일은 `insight-rail.css` 내부의 스코프 변수로 제한해 전역 버튼·카드·타이포를 변경하지 않는다.

CSS만 줄이는 방식은 숫자 의미와 순환 정보 구조를 해결하지 못하고, 전면 컴포넌트 재작성은 상태·라우팅·캐시 회귀 위험이 크므로 사용하지 않는다.

## 디자인 시스템

- 배경: 흰색과 거의 흰색, 텍스트 `#1d1d1f`, 메트릭 `#3a3a3c`, 보조 `#737982`, muted `#9aa0a8`, 구분선 `rgba(17,17,17,.07)`.
- 글꼴: 기존 Pretendard Variable을 우선하고 시스템 폰트로 폴백한다. 새 폰트·라이브러리를 추가하지 않는다.
- Rail 활성 상태: 중립 배경과 왼쪽 2px ink indicator. 검은 캡슐, 이동 효과, blur 장식은 제거한다.
- Panel: 300px overlay, 64px sticky editorial header, 18px 수평 여백, 얇은 구분선, 작은 ghost close.
- 행: 카드나 배지 대신 정렬·타이포·여백·구분선으로 위계를 만든다. 종목명 13px semibold, 중요 수치 13~15px medium, 보조정보 10.5~11px regular.
- 색상은 상승·하락·방향 변화에만 사용한다.

## 탭별 정보 구조

- 상위 30: `순위 → 종목명 → 업종·판단 → 종합 점수 → 순위 변동`. 동점과 원래 순위 계산은 변경하지 않는다.
- 오늘의 변화: `종목명 → 판단 전후 → 종합점수 변화량 → 종합점수 이전값·현재값`. 변화량이 주가처럼 보이지 않게 `종합`과 `점`을 명시한다.
- 순환: 추천 관찰기간, 추천기간 기준 주도 업종과 대표 종목 2개, 다음 후보와 대표 종목 2개, 당일 5거래일 주도 업종과 대표 종목 2개를 section/divider 문법으로 구분한다. 실제 `recommendedHorizon`, `summary`, `sectors`, `candidateStocks`, `shortTerm`만 사용한다.
- 뉴스: meta, headline, preview 순서의 편집형 기사 목록. 현재 선정 로직과 링크를 유지한다.
- 마감 흐름: 텍스트형 시장 요약 뒤 `종목명·현재가 → 신호명 → 지표 라벨·값 → 기준일`. 실제 signal type의 `unit/currentValue`를 중앙 매핑해 RSI·거래량·밴드 라벨을 붙인다.
- 최근 본: 종목명이 가장 강한 재방문 목록. 현재가·방문 시각은 보조, `종합` 점수는 중간 강도. 개별 삭제와 전체 삭제는 조용한 text action으로 유지한다.

## 기능·안전성

Rail 클릭, 같은 탭 재클릭 닫기, 탭 전환, Escape, route 이후 상태, reload 복원, localStorage 25개 제한, 종목·뉴스·순환 이동, 내부 scroll, lazy loading, cache, dark mode, 1280px breakpoint를 보존한다. 모바일에는 Rail을 새로 만들지 않는다. `undefined`, `NaN`, `null`은 표시하지 않고 기존 빈 상태를 유지한다.

## 검증

포맷터와 signal mapping은 단위 테스트로 먼저 고정한다. 브라우저 테스트에서 1920·1440·1280px의 300px panel, 무수치 노출 금지, 여섯 탭 행 문법, 순환 3개 시간축, 링크·삭제·clear·keyboard·persistence·mobile lazy loading을 검증한다. 마지막에 전체 JS·Python·브라우저 회귀를 실행하고 화면 스크린샷으로 anti-AI 감사를 수행한다.
