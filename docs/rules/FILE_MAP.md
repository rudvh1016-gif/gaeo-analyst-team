# 파일 맵 — 누가 무엇을 관리하는가

> 이 문서는 2026-09-10에 `AGENTS.md`에서 **그대로 옮긴 원문**이다(삭제가 아니라 이동).
> 옮긴 이유: Codex가 자동으로 읽는 `AGENTS.md` 크기 한도(기본 32KiB) 안에 전역 안전규칙이 다 들어가게 하고,
> 세부 규칙은 관련 작업에서만 읽게 하기 위해서다. 대응표는 `docs/agent/RULES_MAP.md`, 잠금은 `test_rules_map.py`.
> 아래 본문의 규칙은 `AGENTS.md`에 있을 때와 똑같은 효력을 가진다.

## 파일 맵 — 누가 무엇을 관리하는가

| 파일 | 역할 | 수정 주체 |
|---|---|---|
| `index.html` / `app-shell.css` / `app.js` | 정적 화면 셸 / 공통 앱 스타일 / 공통 앱 동작. 빌드 없이 이 순서로 직접 로드 | AI 에이전트가 직접 편집 |
| `tickers.js` | 종목 목록 단일 소스(600종목, code·name·sector). ⚠️ 배열은 순수 JSON이어야 한다 — 배열 안에 주석 금지(compute_rotation.py가 주석을 못 거른다) | 사람 / AI 에이전트 |
| `data.js` | 현재가·PER 등 시세 스냅샷 + 홈 숫자 브리핑(`marketBrief`) | `update_prices.py` (GitHub Actions 자동) |
| `analysis.js` | 5인 **정밀분석**(`LIVE_ANALYSIS`, 14종목+date/market 키) | AI 에이전트가 재분석 시 Write — 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참고(Codex는 이 파일을 일반 문서로 읽고 그대로 따르면 됨) |
| `auto_analysis.js` | 5인 **자동분석**(`LIVE_AUTO`, 규칙 기반, 토큰 0 · DART 공식공시 맥락 `dart` 블록 포함) + 홈 보강 브리핑(`marketInsight`) | `analyze_auto.py` (자동) |
| `news_analysis.js` | 📰 뉴스분석 보고서 누적(`NEWS_ANALYSIS`, 최신이 배열 앞, 10건=1페이지) | AI 에이전트 — 절차·품질 기준은 `.claude/skills/뉴스분석 스킬/SKILL.md` 참고 |
| `snap/latest_posts.js` | 첫 화면에 표시할 최신 콘텐츠 5개의 제목·날짜·종류 | `generate_snapshots.js` (콘텐츠 발행·러너 실행 시 자동) |
| `stock_study.js` | 📚 종목공부(`STOCK_STUDY`, 회사별 소개 프로필) | AI 에이전트 |
| `stock_lessons.js` | 🎓 주식공부(`STOCK_LESSONS`, 차트·캔들 등 투자 기초 강의, `[[img:key\|캡션]]`=인라인 SVG 도해) | AI 에이전트 |
| `estate_lessons.js` | 🏠 부동산공부(`ESTATE_LESSONS`, 근저당·대출규제·청약 등, 주식공부와 형식·헬퍼 동일) | AI 에이전트 |
| `calculators.js` | 🧮 계산기(`CALCULATORS`, 7종). body는 SEO용 설명 글이고, 실제 계산 로직은 `app.js`의 `calcWidgetHTML`/`wireCalcWidget`이 `calcType`별로 담당 | AI 에이전트 |
| `history.js` | CHIEF 판단 누적(정밀=분단위 여러 건 + 🤖자동=전 종목 하루 1건, `tier:"auto"` 표식·정밀 우선·`HIST_CAP=80`) | **`archive_analysis.py`만 — 직접 편집 금지.** 러너가 `--auto`로 매 사이클 호출 |
| `research_archive/decisions/` | 실제 자동판단 회차별 불변 원본·manifest, 별도 월별 결과·공시 관찰·검증 요약 | **`decision_records.py`만 — 직접 편집 금지.** `archive_analysis.py --auto` 보존 후 `build_model_scoreboard.py`가 결과·공개 `decisionTrace` 연결. 상세 `docs/DECISION_RECORDS.md` |
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
