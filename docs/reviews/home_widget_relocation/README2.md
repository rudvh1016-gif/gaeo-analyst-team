# 후속 2건 — 환율 위치 정리 + 뉴스 클릭 버그 수정

날짜: 2026-09-03 (KST)
브랜치: `claude/auto-analysis-failure-prevention-94we7m`
상태: 소유자 지시 "모두반영해서저장해" — 승인 대기 없이 CI 통과 후 바로 병합.

## (1) 소유자 지시: 환율만 코스닥 아래로, 위 줄 중복 제거

> "그럼 여기서 환율만 코스닥 중기조정 아래에 옮겨주고 두번째 이미지는 지워도돼 위아래중복되잖아
> 이해했지 모두반영해서저장해" (스크린샷 2장과 함께)

PR #491에서 `#idxPanels`를 브리핑 숫자 바로 아래로 옮겼지만, 그 위 `#briefMarket`(코스피·코스닥·
원/달러를 텍스트로 보여주는 줄)이 그대로 남아 있어 코스피·코스닥 숫자가 여전히 위아래로 중복이었다.

- `app.js` `renderMarketTape()`: 코스피·코스닥 `item()` 호출을 지우고 원/달러(+기준 시각)만 남김.
- `index.html`: `#briefMarket`과 `#idxPanels` 순서를 바꿔, `#idxPanels`(코스피·코스닥 상세)가 먼저
  오고 `#briefMarket`(환율만)이 그 아래(코스닥 행 다음)로 온다.
- `app-shell.css`: 바뀐 순서에 맞춰 위쪽 여백 규칙을 `#idxPanels`→`#briefMarket`로 옮김.
- 실측: `#briefMarket` 텍스트가 이제 "원/달러 1,356.40원 ▼0.29% · 09-03 16:03 반영"만 남고
  코스피·코스닥 문자열이 전혀 없음(라이트 모바일·데스크톱 확인). `#idxPanels`가 카드 맨 위,
  `#briefMarket`이 코스닥 행 바로 아래(간격 13~14px).

## (2) 대표 신고: "해당 뉴스를 누르면 뉴스화면으로 이동 안 하는 버그"

### 원인
`insight-rail.js`(데스크톱 좌측 빠른보기 레일)의 "뉴스" 탭에서, 각 기사 행이 전부 같은
`data-gir-page="news"`만 갖고 있었다(하단 "뉴스 전체 보기 →" 버튼과 완전히 동일). 그래서 어떤
기사를 눌러도 그 기사가 아니라 뉴스 목록 화면(전체 보기와 똑같은 화면)으로만 이동했고, 클릭한
기사 자체는 한 번도 펼쳐지지 않았다. 게다가 이동한 뒤에도 이 패널이 닫히지 않아서, 실제로는
화면이 바뀌었어도 패널에 가려 "아무 반응이 없는 것"처럼 보였다.

### 수정
- `insight-rail.js` `news()`: 행마다 `data-gir-news-id="<기사 id>"`를 붙인다.
- `insight-rail.js` `bind()`: 클릭 대상에 `data-gir-news-id`가 있으면 (1) 패널을 먼저 닫고
  (2) 뉴스 화면으로 이동한 뒤 (3) `window.openNewsId(id)`로 그 기사를 실제로 펼친다. 다른
  `data-gir-page`(전체 종목·순환매·뉴스 전체보기 등) 클릭도 패널을 닫도록 함께 통일했다.
- 실측(Playwright): 최신 기사(#64)·다른 기사(#40) 모두 클릭 시 `body[data-mode=news]`,
  패널 닫힘, `#nw-<id>.open` 및 실제 화면 표시까지 확인.
- 회귀 방지: `test_insight_rail_browser.js`에 "뉴스 행을 누르면 뉴스 모드로 전환 + 패널 닫힘 +
  그 기사가 열려서 보인다"는 계약을 추가.

## 캐시

`app.js`·`app-shell.css`·`insight-rail.js` 변경으로 `?v=20260903-p6`→**`p7`**,
`gaeo-shell-v23`→**`v24`**.

## 테스트

- CI 동일 회귀: Python 57/57 · Node(비브라우저) 34/34 PASS.
- 브라우저(로컬 8877): dart · insight · foundation · deep · market · growth · menu_scroll ·
  daily_brief · performance_service_worker 전체 통과(9종).

## 스크린샷 (`after2/`)

`home-brief-mobile-390` · `home-brief-desktop-1440`(환율이 코스닥 아래로) ·
`news-rail-open` · `news-rail-after-click`(뉴스 행 클릭 후 그 기사가 실제로 펼쳐짐).
측정값 원본 `after2/measured.json`.
