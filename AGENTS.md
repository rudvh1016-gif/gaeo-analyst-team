# 개오(Gaeo) 애널리스트팀 — 공통 작업 규칙 (Claude Code · Codex 공용)

이 저장소는 앞으로 **Claude Code와 Codex가 번갈아** 작업합니다. 어느 에이전트든 **작업을 시작하기 전에 이 문서를 먼저 읽고**, 이어서 `CLAUDE.md`도 읽으세요. `CLAUDE.md`에는 이 문서에 없는 Claude Code 전용 세부사항(스킬 파일 사용법, 서브에이전트 구성, 이 세션 환경의 네트워크 제약 등)이 있습니다.

**두 문서 내용이 서로 다르게 말하면, 공통 작업 규칙은 이 AGENTS.md를 따르세요.** CLAUDE.md는 Claude Code에서만 적용되는 보충 지침입니다.

---

## ⭐ 기존 기능·콘텐츠 보존 — 사용자 명시 승인 없는 삭제 금지

- **새 작업은 기존 화면·기능·콘텐츠·데이터 연결을 모두 유지한 상태에서 추가하는 것이 기본이다.**
- 사용자가 명시적으로 삭제·교체·숨김을 요청하지 않았다면, 기존 요소를 임의로 삭제하거나 축소하거나 다른 기능으로 대체하지 않는다. 성능 개선·리디자인·코드 정리도 삭제 승인이 아니다.
- 작업 범위와 기존 구현이 충돌해 보이면 임의로 없애지 말고, 먼저 Git 기록과 현재 동작을 확인한 뒤 사용자에게 선택을 요청한다.
- 수정 전후 `git diff`에서 삭제된 줄과 이동된 DOM·이벤트·데이터 로딩 경로를 따로 확인한다. 예상하지 않은 삭제가 하나라도 있으면 커밋 전에 복구한다.
- 화면 작업은 요청한 부분만 보는 것으로 끝내지 않고, 같은 화면의 기존 주요 섹션이 그대로 표시되고 작동하는지 회귀 테스트한다.

---

## 이 프로젝트가 무엇인가

AI 애널리스트 5인(TARO 기술·DIANA 재무·QUANT 확률통계·FLOW 수급·CHIEF 총괄)이 한국 주식을 분석하는 **순수 정적 사이트**(빌드 과정 없음). 실사용 화면은 `gaeoteam.com`(GitHub Pages, `main` 브랜치 기준). 종목은 `tickers.js` 단일 소스(현재 500종목). 소수 핵심 종목(현재 14개, `analysis.js`에 있는 종목)만 AI가 직접 심층 분석하는 🧠 정밀분석이고, 나머지는 `analyze_auto.py`가 규칙(RSI·MACD·PER 등 지표 기반 if-then 로직)으로 매일 자동 갱신하는 🤖 자동분석이며 **AI API를 전혀 호출하지 않는다**(토큰 0). QUANT는 2026-07-21에 NOVA(뉴스심리)를 교체한 확률·통계 분석가 — 내부 id·데이터 키는 호환성 위해 `nova`를 유지한다. CHIEF 합산은 자가 학습 가중치(`compute_team_weights.py` → `team_weights.js`: `history.js` 채점 기록으로 분석가별 적중률→발언권)를 쓴다. 6번째 카드 🛡️ RISK(리스크 관리)도 규칙 기반 정보 전용(토큰 0).

⭐ **📡 GAEO 레이더는 "6번째 AI 분석가"가 아니다.** 500종목 일봉을 기계적으로 훑어 *직전 거래일 대비 새로 경계를 통과한 종목*(RSI 30/70 돌파·볼린저밴드 이탈·재진입·거래량 2배 급증·MACD/이동평균 교차)만 찾아내는 **보조 탐지기**다(`compute_radar.py`, 토큰 0). 역할 구분: 레이더=변화가 생긴 종목을 찾음 / TARO=기술적 의미 해석 / DIANA=재무 / QUANT=확률·통계 / FLOW=수급 / CHIEF=종합. 레이더는 **BUY/HOLD/SELL 판단을 절대 만들지 않으며**, 화면 문구에도 "반등 확정·매수 기회·곧 상승·바닥 확인" 같은 단정 표현을 쓰지 않는다. 임계값을 바꾸려면 `radar_signals.py` 상단 상수만 고치고, 검증은 `python3 test_radar.py`로 돌린다.

더 자세한 배경·설계 이유는 `docs/PROJECT_OVERVIEW.md`와 `docs/ARCHITECTURE.md`를 참고하세요.

---

## ⭐ 배포 — 가장 중요한 규칙

- **실사용 화면은 GitHub Pages(`rudvh1016-gif.github.io/gaeo-analyst-team`, 커스텀 도메인 gaeoteam.com)이고 `main` 브랜치 기준이다.**
- 작업 브랜치에 push만 하면 사이트에 **반영되지 않는다.** 반드시 PR을 만들어 **main까지 병합**해야 한다.
- 병합 시 `data.js`/`analysis_data.json`/`indicators.json`/`auto_analysis.js`/`history.js`/`price_history.js`/`sitemap.xml` 등 자동 생성 파일에서 충돌이 나면 **더 최신 수집 시각 쪽**을 택한다(보통 GitHub Actions 러너가 가장 최근에 커밋한 쪽).
- **PR이 "merge conflicts"라고 뜨는데 방금 origin/main과 트리가 동일했다면**: squash 병합은 매번 새 커밋 해시를 만들어서, 로컬 브랜치가 그 squash 커밋을 실제 조상으로 갖지 않아 git이 훨씬 이전 커밋을 공통 조상으로 잡고 충돌을 낸다(내용은 같은데 계보만 다른 경우). **force-push로 "해결"하지 말 것**(다른 사람/러너의 작업을 지울 위험). 대신:
  1. `git fetch origin main`
  2. `git merge origin/main` (로컬에서 시도)
  3. 충돌 파일은 실제로 뭐가 다른지 확인 후 `git checkout --ours <file>` 또는 `--theirs <file>`(어느 쪽이 진짜 최신인지 내용으로 판단 — 자동 생성 파일은 대개 러너 쪽인 origin/main이 더 최신일 수 있다는 점 주의)
  4. 커밋 → 평범한 `git push`(강제 아님)

---

## 파일 맵 — 누가 무엇을 관리하는가

| 파일 | 역할 | 수정 주체 |
|---|---|---|
| `index.html` | 화면 전부(CSS+JS 인라인, ~5,000줄+) | AI 에이전트가 직접 편집 |
| `tickers.js` | 종목 목록 단일 소스(500종목, code·name·sector) | 사람 / AI 에이전트 |
| `data.js` | 현재가·PER 등 시세 스냅샷 + 홈 숫자 브리핑(`marketBrief`) | `update_prices.py` (GitHub Actions 자동) |
| `analysis.js` | 5인 **정밀분석**(`LIVE_ANALYSIS`, 14종목+date/market 키) | AI 에이전트가 재분석 시 Write — 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참고(Codex는 이 파일을 일반 문서로 읽고 그대로 따르면 됨) |
| `auto_analysis.js` | 5인 **자동분석**(`LIVE_AUTO`, 규칙 기반, 토큰 0) + 홈 보강 브리핑(`marketInsight`) | `analyze_auto.py` (자동) |
| `news_analysis.js` | 📰 뉴스분석 보고서 누적(`NEWS_ANALYSIS`, 최신이 배열 앞, 10건=1페이지) | AI 에이전트 — 절차·품질 기준은 `.claude/skills/뉴스분석 스킬/SKILL.md` 참고 |
| `snap/latest_posts.js` | 첫 화면에 표시할 최신 콘텐츠 5개의 제목·날짜·종류 | `generate_snapshots.js` (콘텐츠 발행·러너 실행 시 자동) |
| `stock_study.js` | 📚 종목공부(`STOCK_STUDY`, 회사별 소개 프로필) | AI 에이전트 |
| `stock_lessons.js` | 🎓 주식공부(`STOCK_LESSONS`, 차트·캔들 등 투자 기초 강의, `[[img:key\|캡션]]`=인라인 SVG 도해) | AI 에이전트 |
| `estate_lessons.js` | 🏠 부동산공부(`ESTATE_LESSONS`, 근저당·대출규제·청약 등, 주식공부와 형식·헬퍼 동일) | AI 에이전트 |
| `calculators.js` | 🧮 계산기(`CALCULATORS`, 7종). body는 SEO용 설명 글이고, 실제 계산 로직은 `index.html`의 `calcWidgetHTML`/`wireCalcWidget`이 `calcType`별로 담당 | AI 에이전트 |
| `history.js` | CHIEF 판단 누적(정밀=분단위 여러 건 + 🤖자동=전 500종목 하루 1건, `tier:"auto"` 표식·정밀 우선·`HIST_CAP=80`) | **`archive_analysis.py`만 — 직접 편집 금지.** 러너가 `--auto`로 매 사이클 호출 |
| `market_history.js` | 날짜별 시장분석 누적 | `archive_analysis.py` |
| `price_history.js` | 일별 종가(5거래일=1페이지) | `update_price_history.py` |
| `analysis_data.json` | 분석용 원천 데이터(일봉·수급·컨센서스) | `collect_analyst_data.py` |
| `indicators.json` / `indicators.js` | 사전계산 지표(RSI·MACD·이동평균·볼린저밴드 등, 분석 시 토큰 절약용) / 브라우저용 축약본 | `compute_indicators.py` |
| `radar_signals.py` | 📡 GAEO 레이더 신호 계산·판정 공용 모듈(임계값 상수·볼린저밴드·RSI·MACD·교차 판정). `compute_indicators.py`도 볼린저밴드를 여기서 가져다 쓴다 | AI 에이전트 |
| `radar.json` / `radar.js` / `radar_series.js` | 📡 레이더 전체 기록 / 홈 화면용 축약본 / 신호 종목의 최근 60거래일 차트 데이터(지연 로딩) | `compute_radar.py` (자동) |
| `dow_stats.js` | 요일별 평균 등락률 사전계산 | `compute_dow_stats.py` (자동) |
| `team_weights.js` | 자가 학습 CHIEF 가중치 | `compute_team_weights.py` (자동) |
| `generate_sitemap.js` | `sitemap.xml` 재생성 | 콘텐츠 추가 시 AI 에이전트가 직접 실행 |
| `generate_snapshots.js` | `/snap/{news,study,lesson,estate,calc}/{id}.html` 정적 스냅샷 + `/snap/stock/<code>.html` 500종목 랜딩페이지 생성 | 콘텐츠는 AI 에이전트가 실행 · 종목 스냅샷은 러너가 매 사이클 자동 재생성 |
| `indexnow_submit.js` · `<32자hex>.txt` | `sitemap.xml`의 URL을 빙·네이버에 즉시 제출 | 러너가 `.indexnow_hash`로 변경 감지해 자동 제출 |
| `site_config.js` / `community.js` | 사이트 문구 오버라이드 / 커뮤니티 공지·고정글 | 관리자 모드 발행 기능이 생성 |
| `stock_bios.js` | 종목별 한줄 소개 | AI 에이전트 |
| `krx_list.json` | 코스피·코스닥 전체 종목 목록(신규 종목 발굴용) | `fetch_krx_list.py` |

---

## ⭐ 카테고리(`cat` 필드) 철칙

`news_analysis.js`·`stock_study.js`·`stock_lessons.js`·`estate_lessons.js`·`calculators.js` 다섯 파일 모두 각 글에 `cat` 필드가 있고, `index.html`이 모드 진입 시 이 값으로 "대>중>소" 중카테고리 선택 화면(카드 그리드)을 그린다. **새 글을 추가할 때 반드시 기존 중카테고리 중 하나와 정확히 일치하는 키를 `cat`에 넣는다** — 안 넣거나 새 값을 지어내면 그 글이 어떤 카테고리 카드에도 안 잡혀서 "전체 글 보기"로만 찾을 수 있게 된다(사실상 묻힌다).

현재 중카테고리 키(index.html의 `NEWS_CATS`/`STUDY_CATS`/`LESSON_CATS`/`ESTATE_CATS`/`CALC_CATS` 참조):
- 뉴스분석: `market`(코스피·코스닥 시황) · `earnings`(기업 실적발표) · `global`(글로벌 이슈·매크로) · `crypto`(코인·신기술) · `domestic`(국내 기업 이슈)
- 종목공부: `kr`(국내기업) · `global`(해외기업)
- 주식공부: `chart`(차트·기술적분석) · `capitalism`(EBS 다큐 자본주의) · `crisis`(경제위기의 역사) · `tax`(세금·절세계좌) · `product`(투자상품) · `macro`(시장을 움직이는 손) · `industry`(산업·기업분석)
- 부동산공부: `buy`(내집마련기초) · `rent`(전월세·임대차보호) · `loan`(대출·금융) · `auction`(경매·공매시리즈) · `strategy`(투자전략)
- 계산기: `stock`(주식 계산기) · `tax`(세금 계산기) · `finance`(재테크 계산기)

어느 카테고리에도 안 맞는 완전히 새로운 주제라면, 새 `cat` 키를 쓰기 전에 `index.html`의 해당 `*_CATS` 배열에도 카드를 함께 추가한다. 계산기를 새로 추가할 때는 `cat` 외에 `calcType`도 `index.html`의 `calcWidgetHTML`/`wireCalcWidget`에 해당 타입의 실제 계산 로직을 함께 추가해야 위젯이 동작한다(데이터만 추가하면 설명 글만 뜨고 계산기는 비어있게 된다).

## ⭐ 콘텐츠 발행 철칙

`news_analysis.js`·`stock_study.js`·`stock_lessons.js`·`estate_lessons.js`·`calculators.js` 중 **어느 파일이든 글을 추가/수정할 때마다** `node generate_sitemap.js`와 `node generate_snapshots.js`를 **반드시 함께 실행**한다(둘 다 안 하면 검색엔진·AI 크롤러가 새 글을 못 찾거나 못 읽는다). 이 두 스크립트 실행만으로 네이버·구글·빙·다음(카카오) 4개 검색엔진 + IndexNow(빙·네이버) + AI 크롤러(정적 스냅샷)까지 전부 자동으로 커버된다. `sitemap.xml`만 갱신해서 push하면 IndexNow 제출은 러너가 다음 사이클(30분 이내)에 자동으로 해준다.

## 데이터 파이프라인 (GitHub Actions 러너 2개) — 건드리지 말고 이해만 할 것

- **update-prices.yml** — 평일 09:00~16:00 KST, 10분마다 `data.js`(시세·지수·환율 + 홈 숫자 브리핑) 커밋.
- **update-analysis.yml** — 같은 시간대, 30분마다 `price_history.js`·`analysis_data.json`·`indicators.json/js`·`radar.json/js`·`radar_series.js`·`auto_analysis.js`(홈 보강 브리핑 포함) 갱신 + `archive_analysis.py --auto`로 500종목 판단을 `history.js`에 하루 1건씩 누적.
- 두 러너 모두 "자가 반복 루프 + 종료 시 자기 재기동 체인" 구조다(GitHub 무료 cron이 이 저장소에서 불안정해서). 이 워크플로우 파일들의 트리거는 `workflow_dispatch` / `push`(`.analyst-refresh` 경로) / `schedule`(cron)뿐이고, **외부 PR로 실행되는 트리거는 없다** — 이 점은 어떤 에이전트도 바꾸지 말 것(포크 PR이 권한 있는 워크플로우를 실행하게 만드는 건 보안 사고다).
- ⚠️ **`cancel-in-progress: false`다(2026-07-21 변경).** 즉 이미 실행 중인 잡이 있으면 새 트리거(마커 push·cron·dispatch)는 그 잡을 **취소하지 않고 뒤에서 대기(큐)만** 한다. "마커를 push하면 최신 1개만 남으니 안전하다"는 옛 설명은 틀렸다. 잡이 완전히 죽었을 땐 대기하던 실행이 곧바로 시작돼 문제없지만, 잡이 **죽지 않고 멈춘(hang)** 경우엔 마커 push가 최대 6시간(잡 timeout 350분) 동안 효과가 없다 — 그땐 실행을 먼저 **취소**해야 대기분이 뜬다(매시 Routine 안전망이 이 판정을 한다).
- 🔒 **파일 소유권(2026-07-31)**: `data.js`는 update-prices만 커밋하고, 파생물(`indicators*`·`auto_analysis.js`·`radar*`·`snap/` 등)은 update-analysis만 커밋한다. update-analysis는 매 사이클 `data.js`·`analysis.js`를 origin 최신본으로 받아 **읽기만** 하고, 커밋 직전 `git checkout HEAD --`로 되돌린다. (`git checkout <ref> -- <file>`은 인덱스에 stage까지 하므로, 안 되돌리면 add 목록에 없어도 커밋에 딸려 들어가고 push 재시도의 `merge -X ours`가 낡은 시세로 최신을 덮어쓴다.)
- ⏱️ **hang 방지**: 루프 안의 모든 `git fetch`와 네트워크를 쓰는 스크립트에 `timeout`을 건다. 한 단계가 멈추면 잡이 350분 timeout으로 강제 종료되고, 그 경우 `chain()` 재기동 줄에 도달하지 못해 체인이 통째로 끊긴다(2026-07-22 사고 유형).
- 수동 수집이 필요하면 `.analyst-refresh` 내용을 바꿔 `main`에 커밋·푸시한다(러너가 대신 수집, 1~2분 뒤 반영). SessionStart 훅(`check_pipeline.py`)이 세션 시작 때 파이프라인 신선도를 자동 점검해 경고를 띄운다.
- 재분석 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참조. **base ≡ data.js price 무결성이 최우선 철칙.**

자세한 동작 원리는 `docs/ARCHITECTURE.md`와 `docs/WORKFLOW.md` 참고.

## index.html 구조 (2026-07-28 Home Master Design 반영)

- 상단 고정 글로벌 네비게이션(`.global-nav`): 로고·주요 메뉴·종목 검색·프로필·전체 메뉴 구조. 모바일에서는 주요 메뉴를 접고 아이콘과 전체 메뉴 버튼으로 전환한다.
- 기존 사이드바 DOM(`.rail`)은 삭제하거나 복제하지 않고 `#navWorkspace` 안으로 이동한다. 따라서 모드 토글·검색·업종 폴더(24개)·광고의 기존 id와 이벤트는 그대로 유지된다.
- Home Dashboard(`.home-dashboard`)는 Emerald 계열의 독립 디자인 시스템을 쓰며, PC는 화면 좌우 32px 이상 여백을 둔 최대 1840px 와이드 레이아웃, 모바일은 1열 플로우다.
- 우측 레일 `#railR`의 다가오는 일정·최근 팀 판단은 Home Dashboard 하단의 반응형 정보 카드로 이동한다(`MEGA_CAP` 화이트리스트 기준은 그대로).
- 검색 자동완성(`makeAutocomplete`)은 상단 검색·홈 검색·단일분석·종목비교 A/B가 공유한다. 📖 가이드북 탭(`renderGuide`)은 초보용 사용법+단어장이다.
- 모드 전환은 `setMode()`가 display 토글 — 요소가 다시 나타날 때 `viewIn` 애니메이션 재생.
- 스파크라인: `flatCloses(code)`(price_history 평탄화) + `priceSparkSVG()`.
- TARO 미니차트: `taroChartHTML(code)` — `indicators.js`(`INDICATORS`)에서 가격/MA/RSI/MACD를 읽어 `fillCard('taro')`가 삽입.
- 📡 GAEO 레이더: 홈은 `#gaeoRadar` 카드(`renderGaeoRadar()`, `radar.js`의 `GAEO_RADAR`를 읽음 — 분류 칩 클릭 → 종목 목록 → 클릭 시 `jumpToStock`). 종목 상세는 기존 분석 화면 안 `#radarDetail` 카드(`renderRadarDetail(code)`가 `runChief()` 끝에서 호출)로, `GaeoFeatures.load('radar')`로 `radar_series.js`를 그때 내려받아 가격+볼린저밴드·RSI·거래량·(접이식)MACD 차트와 어제/오늘 비교표를 그린다.
- 용어 설명: `GLOSSARY` + `wrapGloss()`가 findings 속 용어를 `.gterm`으로 감싸고 클릭 시 `.gloss-pop` 팝업.
- PC 버전 토글: 물리 화면 최소변 <820px에서만 우측 하단 노출.

## ⚠️ 코딩 시 주의 (실제 겪은 함정 — 어떤 에이전트든 반드시 지킬 것)

1. **정규식 lookbehind `(?<!)` 금지** — iOS 16.4 미만 Safari에서 그 줄 하나로 스크립트 블록 전체가 죽는다. 앞 경계는 `(^|[^A-Za-z0-9])` 캡처그룹으로 대체할 것. (`??`·`?.`는 기존 코드가 이미 사용 — ES2020 기준선 OK)
2. **PRICE_HISTORY 페이지는 시간순이 아닐 수 있다** — flatMap 후 반드시 날짜로 정렬(`flatCloses` 참조).
3. `index.html`의 JS는 `document.getElementById` 위주라 HTML 래핑(aside/main 추가)에 안전하지만, `.wrap` 직계 자식 순서에 기대는 CSS(`.layout` 그리드)가 있으니 마크업 이동 시 확인.
4. **시각 변경 후엔 반드시 실제 브라우저로 데스크톱(1680)·초와이드(1920)·모바일(390, iPhone 13 프로필) 스크린샷을 찍고 콘솔 에러(pageerror)가 없는지 확인한다.** (Claude Code 세션의 구체적인 브라우저 실행 경로는 `CLAUDE.md` 참고.)
5. `base`/`updated` 등 `analysis.js` 필드 규격은 `index.html`이 전부 파싱한다 — 구조 변경 금지(스킬 문서 참조).
6. **테마 시스템(🍎 애플 감성)**: 기본은 라이트(#F5F5F7 캔버스·흰 카드·#1D1D1F 잉크·애플 블루 #0071E3 단일 액센트). `html.gdark` = 애플 다크(순검정 배경·#1C1C1E 카드·#0A84FF 블루). **본문 텍스트 색은 반드시 변수(`--ink`/`--t2`/`--t3`/`--dim`)로** — 하드코딩 slate hex는 다크에서 안 보인다. 새 배경 요소를 만들면 `html.gdark` 개별 오버라이드를 함께 추가할 것.
7. **본문 등락 색(한국식)**: `SIGNUM(html)` 전역 헬퍼가 이스케이프된 HTML에서 「부호+숫자+단위(%·%p·포인트·원)」만 골라 상승(+)=빨강(`.sgn-u`/`--krup`)·하락(−)=파랑(`.sgn-d`/`--krdn`)으로 감싼다. 새 텍스트도 자동 반영되니 별도 처리 불필요.
8. **보안 — 게시판(`community.js`) 관련**: 방문자 자유게시판은 `kvdb.io` 외부 저장소를 직접 fetch로 읽고 쓴다. 수정·삭제 비밀번호 확인은 **브라우저 쪽에서만** 이뤄지고 저장소 자체는 검증하지 않으니, 이 부분을 손댈 땐 "누구나 그 kvdb 주소를 알면 우회해서 쓸 수 있다"는 전제를 유지할 것 — 별도 서버 없이는 완전한 인증을 걸 수 없는 구조다.
9. **보안 — 관리자 모드**: "🌍 모두에게 발행" 기능은 사용자가 자신의 GitHub 개인 액세스 토큰을 브라우저에 직접 입력해 `api.github.com`에 커밋한다. 이 토큰은 `localStorage`에 저장된다 — 코드를 고칠 때 이 토큰을 어디에도 로그로 남기거나 다른 곳에 전송하는 코드를 추가하지 말 것.
10. ⭐ **em dash(—) 사용 금지 (2026-07-30 사용자 지정, 고정 규칙).** 뉴스분석·종목공부·주식공부·부동산공부·계산기 본문, 제목, summary, tag, 출처명, analysis.js의 findings·report·text, index.html이 화면에 그리는 모든 문장 등 사용자가 실제로 읽는 텍스트에는 절대 em dash를 쓰지 않는다. 이 부호가 들어가면 "AI가 썼다"는 티가 나서 독자가 피로감을 느낀다는 게 이유다. 대신 문장 구조에 맞게 쉼표·마침표·콜론(:)·괄호로 자연스럽게 풀어 쓸 것. (코드 주석처럼 사용자에게 노출되지 않는 부분은 해당 없음.)

## 작업 전 체크리스트 (모든 에이전트 공통)

1. 이 문서(AGENTS.md)와 `CLAUDE.md`를 읽었는가?
2. 자동 생성 파일(`data.js`, `history.js`, `analysis_data.json`, `indicators.json/js`, `auto_analysis.js`, `price_history.js`, `team_weights.js`, `dow_stats.js`, `market_history.js`, `sitemap.xml`)을 직접 손으로 고치려는 게 아닌가? (전부 스크립트/러너 전용 — 사람이나 AI가 직접 편집하면 다음 자동 갱신 때 덮어써지거나 형식이 깨진다.)
3. 콘텐츠 파일을 추가/수정했다면 `generate_sitemap.js`·`generate_snapshots.js`를 실행했는가?
4. 화면(`index.html`)을 바꿨다면 데스크톱·모바일·다크모드에서 실제로 확인했는가?
5. 작업 브랜치에서 끝내지 않고 PR을 만들어 `main`까지 병합했는가?
6. `git diff`의 삭제·교체 내용을 확인했고, 사용자가 요청하지 않은 기존 기능·콘텐츠가 그대로 보존됐는가?
