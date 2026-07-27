# 개오(Gaeo) 애널리스트팀 — 공통 작업 규칙 (Claude Code · Codex 공용)

이 저장소는 앞으로 **Claude Code와 Codex가 번갈아** 작업합니다. 어느 에이전트든 **작업을 시작하기 전에 이 문서를 먼저 읽고**, 이어서 `CLAUDE.md`도 읽으세요. `CLAUDE.md`에는 이 문서에 없는 Claude Code 전용 세부사항(스킬 파일 사용법, 서브에이전트 구성, 이 세션 환경의 네트워크 제약 등)이 있습니다.

**두 문서 내용이 서로 다르게 말하면, 공통 작업 규칙은 이 AGENTS.md를 따르세요.** CLAUDE.md는 Claude Code에서만 적용되는 보충 지침입니다.

---

## 이 프로젝트가 무엇인가

AI 애널리스트 5인(TARO 기술·DIANA 재무·QUANT 확률통계·FLOW 수급·CHIEF 총괄)이 한국 주식을 분석하는 **순수 정적 사이트**(빌드 과정 없음). 실사용 화면은 `gaeoteam.com`(GitHub Pages, `main` 브랜치 기준). 종목은 `tickers.js` 단일 소스(현재 500종목). 소수 핵심 종목(현재 14개, `analysis.js`에 있는 종목)만 AI가 직접 심층 분석하는 🧠 정밀분석이고, 나머지는 `analyze_auto.py`가 규칙(RSI·MACD·PER 등 지표 기반 if-then 로직)으로 매일 자동 갱신하는 🤖 자동분석이며 **AI API를 전혀 호출하지 않는다**(토큰 0). QUANT는 2026-07-21에 NOVA(뉴스심리)를 교체한 확률·통계 분석가 — 내부 id·데이터 키는 호환성 위해 `nova`를 유지한다. CHIEF 합산은 자가 학습 가중치(`compute_team_weights.py` → `team_weights.js`: `history.js` 채점 기록으로 분석가별 적중률→발언권)를 쓴다. 6번째 카드 🛡️ RISK(리스크 관리)도 규칙 기반 정보 전용(토큰 0).

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
| `indicators.json` / `indicators.js` | 사전계산 지표(RSI·MACD·이동평균 등, 분석 시 토큰 절약용) / 브라우저용 축약본 | `compute_indicators.py` |
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
- **update-analysis.yml** — 같은 시간대, 30분마다 `price_history.js`·`analysis_data.json`·`indicators.json/js`·`auto_analysis.js`(홈 보강 브리핑 포함) 갱신 + `archive_analysis.py --auto`로 500종목 판단을 `history.js`에 하루 1건씩 누적.
- 두 러너 모두 "자가 반복 루프 + 종료 시 자기 재기동 체인" 구조다(GitHub 무료 cron이 이 저장소에서 불안정해서). 이 워크플로우 파일들의 트리거는 `workflow_dispatch` / `push`(`.analyst-refresh` 경로) / `schedule`(cron)뿐이고, **외부 PR로 실행되는 트리거는 없다** — 이 점은 어떤 에이전트도 바꾸지 말 것(포크 PR이 권한 있는 워크플로우를 실행하게 만드는 건 보안 사고다).
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

## 작업 전 체크리스트 (모든 에이전트 공통)

1. 이 문서(AGENTS.md)와 `CLAUDE.md`를 읽었는가?
2. 자동 생성 파일(`data.js`, `history.js`, `analysis_data.json`, `indicators.json/js`, `auto_analysis.js`, `price_history.js`, `team_weights.js`, `dow_stats.js`, `market_history.js`, `sitemap.xml`)을 직접 손으로 고치려는 게 아닌가? (전부 스크립트/러너 전용 — 사람이나 AI가 직접 편집하면 다음 자동 갱신 때 덮어써지거나 형식이 깨진다.)
3. 콘텐츠 파일을 추가/수정했다면 `generate_sitemap.js`·`generate_snapshots.js`를 실행했는가?
4. 화면(`index.html`)을 바꿨다면 데스크톱·모바일·다크모드에서 실제로 확인했는가?
5. 작업 브랜치에서 끝내지 않고 PR을 만들어 `main`까지 병합했는가?
