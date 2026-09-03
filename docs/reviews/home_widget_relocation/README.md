# 홈 위젯 정리 — 코스피·코스닥 상세를 브리핑에 통합 + 오늘의 공시를 메뉴로

날짜: 2026-09-03 (KST)
브랜치: `claude/auto-analysis-failure-prevention-94we7m`
상태: 소유자 지시 "작업후 메인반영커밋푸쉬다해" — 이번 건은 승인 대기 없이 CI 통과 후 바로 병합.

## 소유자 지시 (2026-09-03, 스크린샷 2장과 함께)

> "코스피코스닥상세 차트보여주는거를 두번째이미지 코스피코스닥 아래에 붙여서 눌러서 차트를 보게하고싶어.
> 이렇게하지않으면 메인에 코스피코스닥 숫자를 두번보여주니까 불필요해. 그리고 공시도 메인에서 지우고
> 메뉴에서 눌러서 보게해줘 그리고 공시내용을 훨씬 구체적으로 가져올 수 있다면 가져와줘 지금은 너무
> 짧은설명만있어 모바일도 모두 동일적용해"

## (A) 코스피·코스닥 상세(펼치면 이동평균·차트)를 브리핑 숫자 바로 아래로

- `index.html`: `#idxPanels`를 홈 하단(업종 흐름 다음)에서 `.hdb-context` 안 `#briefMarket` 바로 아래로 옮겼다.
  `renderIndexPanels()`/펼치기 토글은 id로 찾아 그리므로 JS 변경 없음.
- `app-shell.css`: 더는 페이지에 홀로 떠 있는 상자가 아니라 브리핑 카드 안의 한 구획이라, 자체
  테두리·둥근 모서리·배경을 지우고 형제 요소(`.brief-market`)와 같은 방식(얇은 아래 구분선)으로 맞췄다.
- 실측(Playwright): `#briefMarket`(top 809, h 88) 바로 아래(top 897)에 `#idxPanels`가 붙어 있고, 홈에
  코스피·코스닥 숫자가 더 이상 두 곳에 나타나지 않는다. KOSPI 행을 펼치면 캔들차트·이동평균 설명이
  정상 로드됨(라이트/다크 모바일, 데스크톱 1440 모두 확인).

## (B) 오늘의 공시를 홈에서 빼고 전체 메뉴 '오늘의 공시'로

- `index.html`: `#dartBoard`를 홈에서 제거하고, `#marketView`/`#deepView`와 같은 패턴으로
  `#disclosureView`(`.newsView`)에 담아 별도 화면으로 옮겼다. 전체 메뉴 "분석" 그룹에
  `오늘의 공시`(`#mode-disclosure`) 버튼 신설.
- `app.js`: `setMode`에 `disclosure` 분기(제목·메뉴 강조·화면 토글·진입 시 `renderDartBoard()` 호출),
  메뉴 클릭 핸들러, `?m=disclosure` 딥링크, `MODE_VIEW_ID` 추가. 상단 "오늘 시장" 메뉴의
  `data-nav-alias`에 `disclosure`를 더해 현재 위치 표시가 이어지게 했다.
- 실측: 홈 대시보드 안에는 `#dartBoard` 마크업 자체가 없고(`.home-dashboard #dartBoard` 0건),
  `?m=disclosure`·메뉴 클릭 양쪽에서 5건씩 정상 표시. 종목 화면(분석가별 근거)의 공시 매칭은
  이 작업과 무관하게 그대로 유지.

## (C) 공시내용을 더 구체적으로 — 쉬운 말 설명 + DART 원문 링크

DART 목록 API는 제목만 주고 본문 전체는 안 준다. 종목마다 원문 문서를 새로 받아와 파싱하는 건
별도 파이프라인·예산 검토가 필요해 오늘 범위 밖이라 하지 않았다(솔직하게 못 한 부분). 대신:

- `app.js`: `DART_EXPLAIN_RULES`/`dartExplain()` — "임원ㆍ주요주주특정증권등소유상황보고서" 같은 법률
  용어 제목을 "회사 임원이나 주요 주주가 가진 주식 수가 바뀌었다는 신고예요" 식 쉬운 말 한 줄로 바꿔
  항목마다 붙인다(24개 패턴 + 기본 문구).
- `dartTodayItems()`가 `rceptNo`(접수번호, 이미 수집돼 있던 값)를 함께 넘기면, `renderDartBoard()`가
  `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=...` 링크를 "DART 원문 보기 ↗"로 보여준다.
- `analyze_auto.py`: `DART_TODAY` 빌더에 `rceptNo` 필드를 추가했다(새 네트워크 호출 없음 —
  `dart_context_loader.public_event_summary()`가 이미 갖고 있던 값을 실어 보낼 뿐). **오늘 이미 커밋된
  `dart_today.js`(501건)는 손대지 않았다** — 다음 평일 장중 자동 수집(`update-analysis.yml`)부터
  새 항목에 채워진다. 그때까지는 링크가 없는 항목은 자동으로 링크를 생략한다(방어적으로 처리).
- 실측: 오늘의 공시 5건 모두 쉬운 말 설명이 붙었고(예: "다른 회사와 물건이나 서비스를 팔거나 공급하는
  큰 계약을 맺었다는 공시예요"), 아직 `rceptNo`가 없는 오늘 데이터에서는 링크가 정상적으로 생략됨.

## 캐시

`app.js`·`app-shell.css` 둘 다 바뀌어 SW가 정확한 `?v=` URL로 cache-first인 규칙에 따라
`?v=20260903-p5`→**`p6`**, `CACHE` `gaeo-shell-v22`→**`v23`**로 올렸다.

## 테스트

- `test_dart_exposure.js`: B·C 계약을 홈이 아니라 `?m=disclosure` 화면 기준으로 갱신, 홈에는
  더 이상 마크업이 없다는 B0·B1을 추가, 쉬운 말 설명 존재를 C2b로 추가. D·E·F(분석가 매칭)는 무변경.
- `test_performance_budget.js`/`test_performance_service_worker_browser.js`: p6/v23 반영.
- CI 동일 회귀: Python 57/57 · Node(비브라우저) 34/34 PASS.
- 브라우저(로컬 8877): dart · foundation · deep · market · growth · menu_scroll · daily_brief ·
  performance_service_worker 전체 통과.
- **별건 발견(이번 PR과 무관, 별도 작업 제안으로 분리)**: `test_editorial_accessibility_browser.js`가
  종목 화면의 관심종목(★) 버튼(`.watch-toggle`, 79×32px)이 44px 접근성 목표에 못 미친다고 잡았다.
  원인은 이 PR이 아니라 앞서 병합된 PR #490(다크모드 버그 수정)에서 `min-height`를 45px→32px로
  줄인 것 — CI가 브라우저 접근성 테스트를 안 돌려서 그때는 못 걸렀다. 이 PR의 범위 밖이라 여기서는
  고치지 않고 별도로 남겨 둔다.

## 스크린샷 (`after/`)

`home-light-mobile-390`(+ `-expanded`) · `home-dark-mobile-390`(+ `-expanded`) ·
`home-light-desktop-1440`(+ `-expanded`) · `disclosure-mobile-390` · `disclosure-desktop-1440`.
측정값 원본 `after/measured.json`.
