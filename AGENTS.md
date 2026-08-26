# 개오(Gaeo) 애널리스트팀 — 공통 작업 규칙 (Claude Code · Codex 공용)

## 정밀분석 발행 시스템

정밀분석을 저장·표시·배포하는 작업은 반드시 `docs/DEEP_ANALYSIS_PUBLISHING.md`의 영구 발행 규칙을 따른다. 정밀분석과 종목공부를 섞거나, 발행된 과거 Snapshot을 절단·덮어쓰기하면 안 된다.

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

TARO(기술)·DIANA(재무)·QUANT(확률통계)·FLOW(수급)가 각자의 축을 보고, RISK가 위험을 점검하고, ROTATION이 시장·업종 흐름을 보고, CHIEF가 종합하는 **규칙 기반** 한국 주식 분석 **순수 정적 사이트** (⚠️ 여러 AI가 서로 대화·토론하는 구조가 아니다. 사용자 화면에 "AI 7명이 토론"처럼 쓰지 말 것)(빌드 과정 없음). 실사용 화면은 `gaeoteam.com`(GitHub Pages, `main` 브랜치 기준). 종목은 `tickers.js` 단일 소스(현재 600종목 · Coverage Version `GAEO_COVERAGE_V2_600`, `coverage_version.py`가 관리). 소수 핵심 종목(현재 14개, `analysis.js`에 있는 종목)만 AI가 직접 심층 분석하는 🧠 정밀분석이고, 나머지는 `analyze_auto.py`가 규칙(RSI·MACD·PER 등 지표 기반 if-then 로직)으로 매일 자동 갱신하는 🤖 자동분석이며 **AI API를 전혀 호출하지 않는다**(토큰 0). QUANT는 2026-07-21에 NOVA(뉴스심리)를 교체한 확률·통계 분석가 — 내부 id·데이터 키는 호환성 위해 `nova`를 유지한다. CHIEF 합산은 자가 학습 가중치(`compute_team_weights.py` → `team_weights.js`: `history.js` 채점 기록으로 분석가별 적중률→발언권)를 쓴다. 6번째 카드 🛡️ RISK(리스크 관리)도 규칙 기반 정보 전용(토큰 0).

⭐ **정밀분석 대상 종목은 대표가 직접 고른다. 선정 기준은 없고, 없는 게 정상이다(2026-08-20 대표 확정).**
"600종목 중 4%만 정밀분석인데 편입 기준이 없다"는 건 결함이 아니라 의도된 운영 방식이다.
시가총액·거래대금·검색량 같은 자동 선정 규칙을 만들자는 제안을 하지 말 것. 대표가 분석하고
싶은 종목을 그때그때 지정하면 그 종목을 하면 된다. `/gaeo-strategy`·주간 제안 Routine도
이 항목을 개선 과제로 다시 올리지 않는다.

⭐ **📡 GAEO 레이더는 "6번째 AI 분석가"가 아니다.** 전 종목 일봉을 기계적으로 훑어 *직전 거래일 대비 새로 경계를 통과한 종목*(RSI 30/70 돌파·볼린저밴드 이탈·재진입·거래량 2배 급증·MACD/이동평균 교차)만 찾아내는 **보조 탐지기**다(`compute_radar.py`, 토큰 0). 역할 구분: 레이더=변화가 생긴 종목을 찾음 / TARO=기술적 의미 해석 / DIANA=재무 / QUANT=확률·통계 / FLOW=수급 / CHIEF=종합. 레이더는 **BUY/HOLD/SELL 판단을 절대 만들지 않으며**, 화면 문구에도 "반등 확정·매수 기회·곧 상승·바닥 확인" 같은 단정 표현을 쓰지 않는다. 임계값을 바꾸려면 `radar_signals.py` 상단 상수만 고치고, 검증은 `python3 test_radar.py`로 돌린다.

더 자세한 배경·설계 이유는 `docs/PROJECT_OVERVIEW.md`와 `docs/ARCHITECTURE.md`를 참고하세요.

---

## ⭐ 배포 — 가장 중요한 규칙

- **실사용 화면은 GitHub Pages(`rudvh1016-gif.github.io/gaeo-analyst-team`, 커스텀 도메인 gaeoteam.com)이고 `main` 브랜치 기준이다.**
- 작업 브랜치에 push만 하면 사이트에 **반영되지 않는다.** 반드시 PR을 만들어 **main까지 병합**해야 한다.
- ⭐ **PR 생성·main 병합은 매번 확인받지 않고 자동으로 진행한다(2026-08-01 사용자 지정, 고정 승인).** 사용자가 "커밋해줘/올려줘/반영해줘/업로드해줘"라고만 말해도 그건 이미 "커밋→푸시→PR→main 병합"까지 전부 끝내달라는 뜻이다. "PR을 열까요?"처럼 다시 물어보지 말 것 — 이 저장소는 개인 프로젝트이고 병합 전 리뷰가 필요한 팀 저장소가 아니다. (단, `main --force` 같은 진짜 파괴적인 작업은 별개로 여전히 확인받는다.)
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
| `tickers.js` | 종목 목록 단일 소스(600종목, code·name·sector). ⚠️ 배열은 순수 JSON이어야 한다 — 배열 안에 주석 금지(compute_rotation.py가 주석을 못 거른다) | 사람 / AI 에이전트 |
| `data.js` | 현재가·PER 등 시세 스냅샷 + 홈 숫자 브리핑(`marketBrief`) | `update_prices.py` (GitHub Actions 자동) |
| `analysis.js` | 5인 **정밀분석**(`LIVE_ANALYSIS`, 14종목+date/market 키) | AI 에이전트가 재분석 시 Write — 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참고(Codex는 이 파일을 일반 문서로 읽고 그대로 따르면 됨) |
| `auto_analysis.js` | 5인 **자동분석**(`LIVE_AUTO`, 규칙 기반, 토큰 0 · DART 공식공시 맥락 `dart` 블록 포함) + 홈 보강 브리핑(`marketInsight`) | `analyze_auto.py` (자동) |
| `news_analysis.js` | 📰 뉴스분석 보고서 누적(`NEWS_ANALYSIS`, 최신이 배열 앞, 10건=1페이지) | AI 에이전트 — 절차·품질 기준은 `.claude/skills/뉴스분석 스킬/SKILL.md` 참고 |
| `snap/latest_posts.js` | 첫 화면에 표시할 최신 콘텐츠 5개의 제목·날짜·종류 | `generate_snapshots.js` (콘텐츠 발행·러너 실행 시 자동) |
| `stock_study.js` | 📚 종목공부(`STOCK_STUDY`, 회사별 소개 프로필) | AI 에이전트 |
| `stock_lessons.js` | 🎓 주식공부(`STOCK_LESSONS`, 차트·캔들 등 투자 기초 강의, `[[img:key\|캡션]]`=인라인 SVG 도해) | AI 에이전트 |
| `estate_lessons.js` | 🏠 부동산공부(`ESTATE_LESSONS`, 근저당·대출규제·청약 등, 주식공부와 형식·헬퍼 동일) | AI 에이전트 |
| `calculators.js` | 🧮 계산기(`CALCULATORS`, 7종). body는 SEO용 설명 글이고, 실제 계산 로직은 `index.html`의 `calcWidgetHTML`/`wireCalcWidget`이 `calcType`별로 담당 | AI 에이전트 |
| `history.js` | CHIEF 판단 누적(정밀=분단위 여러 건 + 🤖자동=전 종목 하루 1건, `tier:"auto"` 표식·정밀 우선·`HIST_CAP=80`) | **`archive_analysis.py`만 — 직접 편집 금지.** 러너가 `--auto`로 매 사이클 호출 |
| `market_history.js` | 날짜별 시장분석 누적 | `archive_analysis.py` |
| `price_history.js` | 일별 종가(5거래일=1페이지) | `update_price_history.py` |
| `flow_history/YYYY-MM.json` · `flow_history/index.json` | 종목별 일별 수급(외국인·기관·개인 순매수·거래량·종가·시총추정) 영구 기록. 네이버가 최근 5거래일치만 주므로 지금부터 쌓는 원본이고, **APPEND-ONLY**(기록된 날짜·종목은 덮어쓰기·삭제 금지) | `update_flow_history.py` (update-analysis.yml이 매 사이클 실행) |
| `analysis_data.json` | 분석용 원천 데이터(일봉·수급·컨센서스) | `collect_analyst_data.py` |
| `indicators.json` / `indicators.js` | 사전계산 지표(RSI·MACD·이동평균·볼린저밴드 등, 분석 시 토큰 절약용) / 브라우저용 축약본 | `compute_indicators.py` |
| `radar_signals.py` | 📡 GAEO 레이더 신호 계산·판정 공용 모듈(임계값 상수·볼린저밴드·RSI·MACD·교차 판정). `compute_indicators.py`도 볼린저밴드를 여기서 가져다 쓴다 | AI 에이전트 |
| `radar.json` / `radar.js` / `radar_series.js` | 📡 레이더 전체 기록 / 홈 화면용 축약본 / 신호 종목의 최근 60거래일 차트 데이터(지연 로딩) | `compute_radar.py` (자동) |
| `dow_stats.js` | 요일별 평균 등락률 사전계산 | `compute_dow_stats.py` (자동) |
| `rotation_engine.py` / `compute_rotation.py` | 분석 종목을 24업종으로 집계하는 순환매 계산 엔진 / 현재 스냅샷·마감 아카이브 생성 | AI 에이전트 / `update-analysis.yml` (자동) |
| `rotation_snapshot.js` / `rotation_archive.json` | 순환매 화면용 현재 자료 / 거래일별 마감 기록 | **`compute_rotation.py`만, 직접 편집 금지.** |
| `rotation_backtest.py` / `backtest_rotation.py` / `rotation_model.json` | 미래 정보 차단형 Lead-Lag·유사 국면·Walk-forward 검증 / 주간 모델 산출물 | `rotation-maintenance.yml` (자동) |
| `compute_rotation_picks.py` / `rotation_picks.js` | 홈 「업종 흐름에서 고른 종목」용 2KB 경량 요약(시장 게이트·상위 4종목·성적). 홈이 421KB짜리 `rotation_snapshot.js`를 받지 않게 하려고 분리했다. ⚠️ z점수 클램프를 고치기 전에 `zscores()` 주석의 측정 결과를 읽을 것 | `compute_rotation_picks.py`만, 직접 편집 금지. 계약은 `test_rotation_picks.py` |
| `rotation-ui.js` / `rotation.css` | `?m=rotation` 전용 지연 로딩 화면과 반응형 디자인 | AI 에이전트가 직접 편집 |
| `team_weights.js` | 자가 학습 CHIEF 가중치 | `compute_team_weights.py` (자동) |
| `model_intelligence.js` | 확률교정·오답 중복·시장국면·AUDIT·그림자 승격 판정 | `compute_model_intelligence.py` (자동) |
| `generate_sitemap.js` | `sitemap.xml` 재생성 | 콘텐츠 추가 시 AI 에이전트가 직접 실행 |
| `generate_llms.js` | `llms.txt` 재생성. AI 답변엔진(ChatGPT·Perplexity 등)이 읽을 사이트 안내판 | 콘텐츠 추가 시 AI 에이전트가 직접 실행 |
| `generate_snapshots.js` | `/snap/{news,study,lesson,estate,calc}/{id}.html` 정적 스냅샷 + `/snap/stock/<code>.html` 종목별 랜딩페이지 생성 | 콘텐츠는 AI 에이전트가 실행 · 종목 스냅샷은 러너가 매 사이클 자동 재생성 |
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

`news_analysis.js`·`stock_study.js`·`stock_lessons.js`·`estate_lessons.js`·`calculators.js` 중 **어느 파일이든 글을 추가/수정할 때마다** `node generate_snapshots.js` · `node generate_sitemap.js` · `node generate_rss.js` · `node generate_llms.js` **4개를 반드시 함께 실행**한다(안 하면 검색엔진·AI 크롤러가 새 글을 못 찾거나 못 읽는다). `generate_llms.js`는 AI 답변엔진용 `/llms.txt` 안내판을 다시 만든다. 이 4개 실행만으로 네이버·구글·빙·다음(카카오) 4개 검색엔진 + IndexNow(빙·네이버) + 네이버 서치어드바이저 RSS + AI 크롤러(정적 스냅샷)까지 전부 자동으로 커버된다. `sitemap.xml`만 갱신해서 push하면 IndexNow 제출은 러너가 다음 사이클(30분 이내)에 자동으로 해준다.

**그다음 `python3 seo_publish_gate.py`를 실행해 0건 위반을 확인한다** (2026-08-16, AdSense 'Low value content' 대응). 글 단위 최소 계약(고유 제목·H1 1개·설명·canonical 자기참조·placeholder 없음·noindex/sitemap 모순 없음)을 기계 검사한다. 상세 규칙·체크리스트는 `docs/gaeo_seo_publishing_rules.md`. **게이트가 실패하면 filler로 채우지 말고 발행을 보류**하고 내용을 고친다.

### ⭐ 제목·요약 길이 기준 (2026-08-03 사용자 지정, 신규 글 전부 적용)

검색결과에서 제목·설명이 중간에 잘려 뜻이 끊기는 걸 막기 위한 기준이다. **글을 새로 쓸 때 이 기준으로 쓰고, 다 쓴 뒤 아래 검증 스크립트로 확인한다.**

**자동으로 처리되니 신경 쓰지 않아도 되는 것** (`generate_snapshots.js`가 이미 해줌 — 이 동작을 되돌리지 말 것):
- `<title>` 뒤 브랜드 꼬리표는 `TITLE_SUFFIX = 'Gaeo'`(7자)로 짧게 붙는다. 예전엔 사이트명 전체(19자)가 붙어서 멀쩡한 제목까지 30건이 잘렸다.
- `meta description`은 `metaDesc()`가 155자 이내로, **문장 끝(`요.`/`다.`) → 어절** 순으로 자연스러운 지점을 찾아 끊는다. 화면에 보이는 요약(`.summary`)은 원문 그대로 나가므로 **글 내용은 절대 바뀌지 않는다.**

**글 쓸 때 지켜야 하는 것**:
- **제목(`title`/`name`)은 53자 이내**로 쓴다(꼬리표 ` · Gaeo` 7자를 더해 60자 이내가 되게). 넘어가면 늘어지는 연결어구(`~까지`, `무슨 일이 벌어지고 있나`, `~해야 할까` 등)부터 줄인다. **고유명사·숫자·날짜·시리즈 표기는 절대 빼지 않는다** — 줄이려고 정보를 버리느니 조금 긴 제목이 낫다.
- **`summary`의 앞 150자만 읽어도 말이 되게** 쓴다. 그 앞부분이 그대로 검색결과 설명문이 되기 때문이다. 뒤쪽에 결론을 몰아두면 검색결과에선 도입부만 보이고 끝난다. 전체 길이 자체는 제한 없다(화면엔 원문 전체가 나온다).
- em dash(`—`)는 제목·요약·본문 어디에도 쓰지 않는다(이 문서 상단 규칙). 구분이 필요하면 `:` 나 `,` 를 쓴다.

**발행 전 확인** (스냅샷 생성 후 실행):
```bash
node -e "const fs=require('fs'),p=require('path');const un=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'\"');
let t=0,d=0;for(const dir of ['snap/news','snap/study','snap/lesson','snap/estate','snap/calc'])
for(const f of fs.readdirSync(dir)){const h=fs.readFileSync(p.join(dir,f),'utf8');
if(un((h.match(/<title>([^<]*)<\/title>/)||[])[1]||'').length>60)t++;
if(un((h.match(/<meta name=\"description\" content=\"([^\"]*)\"/)||[])[1]||'').length>160)d++;}
console.log('제목 60자 초과:',t,'/ 설명 160자 초과:',d);"
```
설명은 **항상 0건**이어야 한다(0이 아니면 `metaDesc()`가 깨진 것). 제목은 2026-08-03 기준 9건이 남아 있는데, 전부 시리즈명·기업명·날짜가 든 기존 글이라 의도적으로 둔 것이다 — **새 글 때문에 이 숫자가 늘면 그 제목을 줄인다.**

## 데이터 파이프라인 (GitHub Actions 러너 2개) — 건드리지 말고 이해만 할 것

- **update-prices.yml** — 평일 09:00~16:00 KST, 10분마다 `data.js`(시세·지수·환율 + 홈 숫자 브리핑) 커밋.
- **update-analysis.yml** — 같은 시간대, 30분마다 `price_history.js`·`analysis_data.json`·`indicators.json/js`·`radar.json/js`·`radar_series.js`·`auto_analysis.js`(홈 보강 브리핑 포함) 갱신 + `archive_analysis.py --auto`로 600종목 판단을 `history.js`에 하루 1건씩 누적.
- **순환매 갱신** — `update-analysis.yml`이 매 사이클 `rotation_snapshot.js`를 갱신하고 15:40 KST 이후에는 같은 거래일 마감본을 `rotation_archive.json`에 한 번만 남긴다. `rotation-maintenance.yml`은 주 1회 과거 검증을 다시 계산한다. 높은 신뢰도는 검증상 중간 신뢰도를 앞설 때만 열린다.
- **🌐 전체시장 관찰(2026-08-16)** — `collect_market_universe.py`가 같은 사이클에서 KOSPI+KOSDAQ 전체(bulk 44요청, 종목별 polling 금지)의 Breadth·집중도 집계만 만든다(`market_context.js` 1KB + 일일 history). 600 정밀분석과 **별개 모집단**이고 실패해도 파이프라인을 멈추지 않는다. 상세: `docs/full_market_universe.md`. 업종 매핑 95% 게이트 통과 전에는 순환매를 전체시장으로 바꾸지 않는다.
- 두 러너 모두 "자가 반복 루프 + 종료 시 자기 재기동 체인" 구조다(GitHub 무료 cron이 이 저장소에서 불안정해서). 이 워크플로우 파일들의 트리거는 `workflow_dispatch` / `push`(`.analyst-refresh` 경로) / `schedule`(cron)뿐이고, **외부 PR로 실행되는 트리거는 없다(⚠️ 데이터 파이프라인 워크플로 한정이다. 2026-08-20 신설된 `ci.yml`은 `pull_request` 트리거를 쓰지만 secrets 참조가 0이고 `permissions: contents:read`뿐이라 포크 PR이 권한을 얻지 못한다)** — 이 점은 어떤 에이전트도 바꾸지 말 것(포크 PR이 권한 있는 워크플로우를 실행하게 만드는 건 보안 사고다).
- ⚠️ **`cancel-in-progress: false`다(2026-07-21 변경).** 즉 이미 실행 중인 잡이 있으면 새 트리거(마커 push·cron·dispatch)는 그 잡을 **취소하지 않고 뒤에서 대기(큐)만** 한다. "마커를 push하면 최신 1개만 남으니 안전하다"는 옛 설명은 틀렸다. 잡이 완전히 죽었을 땐 대기하던 실행이 곧바로 시작돼 문제없지만, 잡이 **죽지 않고 멈춘(hang)** 경우엔 마커 push가 최대 6시간(잡 timeout 350분) 동안 효과가 없다 — 그땐 실행을 먼저 **취소**해야 대기분이 뜬다(매시 Routine 안전망이 이 판정을 한다).
- 🔒 **파일 소유권(2026-07-31)**: `data.js`는 update-prices만 커밋하고, 파생물(`indicators*`·`auto_analysis.js`·`radar*`·`snap/` 등)은 update-analysis만 커밋한다. update-analysis는 매 사이클 `data.js`·`analysis.js`를 origin 최신본으로 받아 **읽기만** 하고, 커밋 직전 `git checkout HEAD --`로 되돌린다. (`git checkout <ref> -- <file>`은 인덱스에 stage까지 하므로, 안 되돌리면 add 목록에 없어도 커밋에 딸려 들어가고 push 재시도의 `merge -X ours`가 낡은 시세로 최신을 덮어쓴다.)
- ⏱️ **hang 방지**: 루프 안의 모든 `git fetch`·`git push`와 네트워크를 쓰는 스크립트(`curl`·`node ...submit.js` 등)에 `timeout`을 건다. 한 단계가 멈추면 잡이 350분 timeout으로 강제 종료되고, 그 경우 `chain()` 재기동 줄에 도달하지 못해 체인이 통째로 끊긴다(2026-07-22 사고 유형). ⚠️ 2026-08-04: `dispatch()`/`alive()` 함수 안 `curl`과 `git push` 자체에 timeout이 안 걸려 있어서, 이것들이 응답을 못 받으면 잡이 몇 시간이고 조용히 멈춰 있는 사고가 또 발생했다(체인은 안 끊기고 그냥 hang만 남는 유형이라 알아채기 더 어렵다) — 새 네트워크 호출을 추가할 땐 반드시 `timeout N <명령>`으로 감쌀 것.
- 수동 수집이 필요하면 `.analyst-refresh` 내용을 바꿔 `main`에 커밋·푸시한다(러너가 대신 수집, 1~2분 뒤 반영). SessionStart 훅(`check_pipeline.py`)이 세션 시작 때 파이프라인 신선도를 자동 점검해 경고를 띄운다.
- ⭐ **FLOW(수급) 데이터는 구조적으로 하루(T+1) 지연된다(2026-08-12 확인, 버그 아님).** `collect_analyst_data.py`가 받아오는 `dealTrendInfos`(네이버 `m.stock.naver.com` 통합 API)는 그날 장중에 실시간으로 갱신되는 값이 아니라, 그날 장 마감 후 다음 거래일이 돼야 `dt[0]`으로 확정 반영된다 — 실제로 8/12 당일 09:02~15:49 KST 사이 30분 간격 수집 12회를 전부 대조해봐도 `dt[0].bizdate`는 하루 종일 `20260811`(전일)에 머물러 있었다. 즉 **당일 오전부터 장마감까지 아무리 자주 수집해도 "오늘 확정 수급"은 절대 못 얻는다** — 다음 거래일 아침이 돼야 전날 몫이 `dt[0]`으로 올라온다. `index.html`의 `flow_summary()`가 만드는 기간 라벨(`최근 N거래일(YYYY-MM-DD~YYYY-MM-DD)`)은 이 원본 bizdate를 그대로 읽는 것이라 데이터가 실제로 갱신되면 자동으로 날짜도 따라간다(별도 코드 수정 불필요). 당일 실시간 수급(장중 누적)을 보여주려면 이 `dealTrendInfos`와는 다른 진짜 장중 갱신 API를 새로 찾아 검증해야 하는데, 이 저장소의 원격 세션은 네이버 접속이 막혀 있어 후보 엔드포인트를 직접 검증할 수 없다(위 "네이버 금융 403" 항목과 같은 제약). 사용자 로컬 PC 등 네이버 접속이 가능한 환경에서 브라우저 개발자도구로 실제 종목 페이지의 장중 수급 위젯이 호출하는 API를 확인해 알려주면, 그걸 받아 안전하게 추가할 수 있다.
- 재분석 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참조. **base ≡ data.js price 무결성이 최우선 철칙.**

자세한 동작 원리는 `docs/ARCHITECTURE.md`와 `docs/WORKFLOW.md` 참고.

## 모의투자(Paper Trading) — 실행 주체는 집 PC 하나뿐 (2026-08-18)

- **`paper-trading.yml`의 `schedule`은 의도적으로 비활성화돼 있다. 되살리지 말 것.**
  토스증권 Open API는 허용 IP로 접근을 통제하는데 GitHub-hosted 러너(Azure) IP는
  등록할 수 없어 403이 나고, 집 PC와 동시에 돌면 같은 Paper 상태를 두 곳에서 건드린다.
- 단일 실행 주체: 집 Windows PC의 작업 스케줄러 **"GAEO Paper Trading"**
  → `scripts/paper_cycle.ps1` (평일 KST 09:05~15:05, 30분 간격).
  부트스트랩은 `%LOCALAPPDATA%\GAEO\run-paper.ps1`(저장소 밖, Secret은 DPAPI 암호화).
- 러너는 **개발용 저장소를 절대 쓰지 않는다.** 전용 clone(`%LOCALAPPDATA%\GAEO\paper-runner\repo`)에서만
  돌고, 러너 루트의 `.gaeo-paper-runner` 마커가 없으면 실행을 거부한다.
- 러너가 커밋하는 파일은 `paper_trading/`과 `paper_public.js` **뿐**이다(화이트리스트 강제).
  `git add .`·force push·`reset --hard`·자동 충돌 해결은 어느 경로에도 없다.
- Toss는 **시세(Market Data)만** 쓴다. 계좌·보유·주문 API 호출 0, `POST`는 토큰 발급 하나뿐.
  실주문 코드를 새로 만들지 말 것. 상세: `docs/PAPER_TRADING_LOCAL_RUNNER.md`.
- ⭐ **회계 기준은 거래마다 진입할 때 원장에 박제된다(2026-08-26).** 2026-08-27부터
  진입한 거래는 수수료·거래세를 반영하고(`ACCOUNTING_V2_NET`), 그 전 거래는 옛 기준
  (`ACCOUNTING_V1_GROSS`)으로 남는다. **과거 원장(trades.jsonl)을 다시 쓰지 않는다.**
  전환 이전 미반영 비용은 `summary.accounting.unreflectedCostKrw`로 그대로 공개한다.
  시장대비(벤치마크)는 원장 값이 아니라 **보고 시점에 실제 진입일·청산일 종가로
  재계산**한다(원장의 `benchmark_*`는 탐지 시점 기록이라 손대지 않는다).
- 🧪 세 번째 전략 `paper_smart_v2.py`(PAPER_SMART_V2)는 **Shadow**다. 별도 폴더
  (`paper_trading/smart_v2`)·별도 environment를 쓰고 공개 화면에 나가지 않으며,
  **자동 승격이 없다**(V1이 Baseline). 5거래일은 청산일이 아니라 재평가일이고
  안전상한은 60거래일이다. 60D 성적·적중률은 어떤 형태로도 주장하지 않는다
  (`docs/gaeo_validation_policy.md`: 60D는 평가 가능한 판단 0건).
- ⚠️ Windows에서 Python 출력이 cp949로 나가면 `—` 같은 문자에서 `UnicodeEncodeError`로 죽는다.
  러너는 `PYTHONUTF8=1`을 강제한다. 또 PowerShell 5.1은 BOM 없는 UTF-8 `.ps1`을 cp949로
  오독하므로 **`scripts/*.ps1`은 BOM 있는 UTF-8로 저장**해야 한다.

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
11. ⭐ **모바일 글자 잘림 방지: 콘텐츠 컨테이너는 `overflow-wrap:anywhere` 필수 (2026-08-03 실제 사고).** 뉴스분석·종목공부·주식공부·부동산공부·계산기가 전부 공유하는 `.nw-title`/`.nw-sum`/`.nw-body`에 `overflow-wrap:anywhere`가 걸려 있다 — 이게 없으면 `word-break:keep-all`(한국어 어절 단위 줄바꿈, 이 파일 다른 곳에도 적용된 규칙) 때문에 공백 없이 `·`로 죽 이어붙인 나열("로봇(+7.79%)·통신(+3.84%)·바이오제약(+3.63%)·..."처럼)이 줄바꿈될 자리를 못 찾고 뷰포트 밖으로 그냥 넘쳐서 모바일 화면에서 글자가 잘려 보인다(실제로 8/3 시장분석 기사에서 발생). `.nw-*` 계열 CSS를 고칠 때 이 속성을 빼지 말 것. 그리고 새 글을 쓸 때 `·`로 여러 항목을 나열하려면 **양옆에 공백을 넣는 게 원칙**이다(`"A(+1%) · B(+2%) · C(+3%)"`, 사이트 기존 관례와도 일치) — CSS가 넘침 자체는 막아주지만, 무공백으로 붙이면 그 줄바꿈이 단어 중간에서 뚝 끊겨 보기 나쁘다.
12. ⭐ **분석 카드 근거(findings) 문장은 한 줄에 들어오게 짧게 쓴다 (2026-08-05 사용자 지정).** `.card ul li` 근거 목록은 항목마다 구분선(border-top)이 있는 짧은 리스트 디자인이라, 문장이 2줄로 넘어가면 답답해 보인다는 지적을 받았다. 특히 DIANA(재무)의 목표주가 문장처럼 "증권사 평균 목표주가 X원 · 현재가 대비 +Y% 여력"류로 큰 숫자(백만원대)와 %가 같이 들어가는 문장이 잘 넘친다 — `analyze_auto.py`의 `diana_eval()`을 "목표주가 X원 → 현재가 대비 +Y%"로 압축한 게 실제 수정 사례(불필요한 "증권사 평균"·"여력" 같은 수식어부터 뺀다). 새 finding 문장을 쓰거나 고칠 때는 모바일 폭(390px, 폰트 12~12.5px)에서 한 줄에 들어가는지를 기준으로 잡고, 숫자가 큰 종목(100만원 이상)·퍼센트가 세 자리(±100%대)인 경우까지 감안해서 여유 있게 짧게 쓴다.

## ⭐ 디자인 — 새 화면을 만들기 전에 읽을 것

**`docs/gaeo_design_system.md`를 먼저 읽으세요.** 기능을 추가할 때마다 새 색·새 배지·새 카드를
얹다 보니 화면이 조용한 금융 리포트가 아니라 알록달록한 AI 대시보드처럼 변해 갔습니다.
핵심 규칙 여덟 줄만 옮겨 둡니다.

1. **분석가별 고유색 금지** — QUANT 주황·FLOW 초록 식으로 색을 배정하지 않는다. 이름과 역할로 구분한다.
2. **장식용 그라데이션 금지** (neon·glass·glow도 마찬가지)
3. **섹션 제목마다 장식 emoji 붙이지 않기**
4. **모든 상태를 배지(pill)로 만들지 않기** — 가능하면 평범한 secondary text
5. **빨강·파랑은 시장 방향에만** (주가 등락·실제 수익률·BUY/SELL). 카드 배경까지 칠하지 않는다
6. **계층은 색이 아니라 타이포·크기·굵기·여백·구분선으로**
7. **Apple 감성 Editorial 금융 리포트** — 화려함보다 읽히는 것
8. **모바일 우선 가독성** — 360·375·390·430px에서 가로 넘침 0

정보를 삭제하기보다 재배치·접기를 쓴다. 모바일이라고 내용을 빼지 않는다.

### 2026-08-18 전체 sweep으로 못박은 것 (되돌리지 말 것)

- **글꼴은 사이트 전체가 하나다.** `Wanted Sans Variable`(저장소 self-host,
  SIL OFL 1.1) → 예비 Pretendard → 시스템 글꼴. index뿐 아니라 `about.html` ·
  `404.html` · `generate_snapshots.js`(snap 787개) · `deep_analysis_publish.js`
  (정밀분석 31개)가 **전부 같은 스택**이다. 생성기를 고쳤으면 **재생성까지** 해야
  한다(`node generate_snapshots.js` · `node generate_deep_analysis.js`).
- **굵기는 3단계뿐이다.** 본문 `400` · 라벨 `500` · 제목·강조 `600`.
  브랜드 로고/히어로만 `800`(전체 3곳). `650` `700` `720` `760` `900` 금지.
  `<b>` `<strong>` `<h1~h6>` `<th>`는 선언을 빠뜨리면 브라우저 기본 700으로
  새므로, 화면 CSS 맨 앞의 기본 굵기 정규화 규칙을 지운다면 안 된다.
- **"가로 스크롤 0"은 합격 기준이 아니다.** 제목 3줄 붕괴 · 고아 줄바꿈 ·
  탭 2줄 접힘 · 좁은 칸의 과대 글자도 전부 불합격이다. 고치는 순서는
  ① 문구를 짧게 ② 칸 폭 확보 ③ **마지막에만** 크기 미세 조정.
  줄바꿈을 없애려고 글자를 무조건 작게 하는 해결은 금지.
- 검사: `python3 test_design_contract.py` · `node test_typography_quality.js`
  (15화면 × 360·390·1280px) · `node test_paper_font.js`(웹폰트 실제 로드 실측).

---

## GAEO TEAM — 저장소 개발·점검을 돕는 Agent/Skill 체계 (Claude Code 전용)

이 저장소를 개발·점검·성장시키는 작업(사용자에게 보여줄 종목 판단이 아니라 이 서비스 자체를 다루는 작업)을 돕는 8개 Agent + 8개 `gaeo-` Skill이 `.claude/agents/gaeo-*.md`·`.claude/skills/gaeo-*/SKILL.md`에 있다. Claude Code에서 `/gaeo-strategy`(방향 제안, 읽기 전용)·`/gaeo-design`(디자인 점검, 읽기 전용)·`/gaeo-build`(구현)·`/gaeo-review`(배포 전 검수)·`/gaeo-bug`(버그 수정)·`/gaeo-quant`(분석력 실증 검증)·`/gaeo-growth`(유입·성장 검토)·`/gaeo-health`(전체 점검, 읽기 전용)로 호출한다. 전체 구조·안전 규칙·주간 자동 제안(Routine) 방식은 `docs/gaeo_team_system.md`에 정리돼 있다. Codex 등 다른 에이전트는 이 체계를 직접 호출할 수 없지만, 같은 절차를 텍스트 그대로 따라 하면 동일한 결과를 낼 수 있다.

## GAEO Evolution Harness (2026-08-21 신설 — gaeo_evolution/)

GAEO가 실측 결과로 실패를 찾고, 안전범위 후보를 만들어 시험까지 보게 하는 계층.
**전부 ADDITIVE** — 기존 판단 경로(analyze_auto.py 등)를 읽기만 하고 수정하지 않는다.

- 실행: 주 1회 `evolution-lab` workflow(무LLM·결정론) + Claude Code `/gaeo-evolve`(가설 spec만)
- 원칙: 600종 자동분석 LLM 토큰 0 유지 · 정밀분석 대상 자동확대 금지 ·
  Candidate가 Production을 직접 수정하는 것 금지 · 승격은 실전 Shadow 실측이
  `gaeo_evolution/evolution_constitution.json`의 promotionFloor(기존
  compute_model_intelligence minimums이 바닥값)를 채우고 사람이 승인해야만 한다.
- 보호: Constitution+checksum(어긋나면 SAFE_MODE), 자동 커밋은
  `gaeo_evolution/registry|status/`·`research_archive/evolution/`만 허용(위반=커밋 거부).
- Rollback: previousStableVersion(config 선택 방식). 상세는
  `docs/GAEO_EVOLUTION_ARCHITECTURE.md`·`docs/GAEO_HARNESS.md`·`docs/GAEO_EVOLUTION_SAFETY.md`.
- ⭐ 2026-08-22 2차 수리: 승인된 후보는 `gaeo_evolution/production_config.json`
  (Production Config Adapter)을 통해 실제 analyze_auto 판단에 적용된다 —
  override 없으면 기존과 100% 동일, team_weights.js는 덮어쓰지 않음(재생성 무관).
  승인 = `registry.approve_production(후보ID, '대표')`(원자 적용+fixture 검증),
  롤백 = 실제 previousStable 복원까지 자동. 자동 런타임은 이 파일을
  '해제/복원' 방향으로만 커밋할 수 있다(활성화는 사람 전용).
- ⚠️ Constitution 수정은 사람 전용: JSON 수정 후 `constitution.write_checksum()`으로
  재고정해 두 파일을 함께 커밋한다.

## 작업 전 체크리스트 (모든 에이전트 공통)

1. 이 문서(AGENTS.md)와 `CLAUDE.md`를 읽었는가?
2. 자동 생성 파일(`data.js`, `history.js`, `analysis_data.json`, `indicators.json/js`, `auto_analysis.js`, `price_history.js`, `team_weights.js`, `dow_stats.js`, `market_history.js`, `sitemap.xml`)을 직접 손으로 고치려는 게 아닌가? (전부 스크립트/러너 전용 — 사람이나 AI가 직접 편집하면 다음 자동 갱신 때 덮어써지거나 형식이 깨진다.)
3. 콘텐츠 파일을 추가/수정했다면 `generate_snapshots.js`·`generate_sitemap.js`·`generate_rss.js`·`generate_llms.js` 4개를 실행했는가?
4. 화면(`index.html`)을 바꿨다면 데스크톱·모바일·다크모드에서 실제로 확인했는가?
5. 작업 브랜치에서 끝내지 않고 PR을 만들어 `main`까지 병합했는가?
6. `git diff`의 삭제·교체 내용을 확인했고, 사용자가 요청하지 않은 기존 기능·콘텐츠가 그대로 보존됐는가?
