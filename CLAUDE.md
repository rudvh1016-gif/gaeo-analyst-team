# 개오(Gaeo) 애널리스트팀 — Claude Code 전용 가이드

## 공개 콘텐츠 SEO 규칙 (2026-08-16, AdSense 'Low value content' 대응)

**공개 Publisher Content(시장분석·정밀분석·뉴스분석·종목/주식/부동산공부·방법론)를
만들거나 고칠 때는** 설치된 SEO Skill(`.claude/skills/seo`)을 쓰고, 발행 전에
`python3 seo_publish_gate.py`로 글 단위 계약(고유 제목·H1 1개·설명·canonical·
placeholder 없음·중복 발행 없음·sitemap 반영)을 통과시킨다. 상세 규칙과 체크리스트는
`docs/gaeo_seo_publishing_rules.md`. **게이트 실패 시 filler로 채우지 말고 발행 보류.**
CSS 버그·시세 데이터·DART 수집 같은 SEO 무관 작업에는 강제하지 않는다.

## 정밀분석 발행

정밀분석 관련 작업 전에는 `docs/DEEP_ANALYSIS_PUBLISHING.md`를 읽고 Source of Truth, 영구 URL, Archive, 홈 최신 5건, sitemap 규칙을 함께 지킨다.

> ⭐ **먼저 저장소 최상위의 `AGENTS.md`를 읽으세요.** 프로젝트가 무엇인지, 파일맵, 배포 규칙, 카테고리 철칙,
> 콘텐츠 발행 철칙, 데이터 파이프라인, index.html 구조, 코딩 시 주의사항 등 **Claude Code와 Codex가 공통으로
> 지켜야 할 작업 규칙은 전부 그 문서에 있습니다.** 이 파일(CLAUDE.md)에는 Claude Code 세션에서만 해당하는
> 보충 내용만 남겨뒀습니다. **두 문서 내용이 다르면 공통 작업 규칙은 AGENTS.md를 따르세요.**

프로젝트 개요·구조·현재 상태 문서는 `docs/PROJECT_OVERVIEW.md` · `docs/ARCHITECTURE.md` · `docs/WORKFLOW.md` · `docs/CURRENT_STATUS.md`에도 정리돼 있습니다.

## Claude Code 스킬(Skill) — 정해진 절차가 있는 반복 작업

이 저장소에는 Claude Code의 Skill 기능으로 호출하는 절차 문서 2개가 있습니다(`.claude/skills/` 아래). Codex 등 다른 에이전트가 같은 작업을 할 때도 이 문서들을 **일반 텍스트 절차서로 그대로 읽고 따르면** 동일한 결과를 낼 수 있습니다 — Skill 호출이라는 메커니즘 자체만 Claude Code 전용입니다.

- **`.claude/skills/종목분석 스킬/SKILL.md`** — 정밀분석 대상 종목(`analysis.js`, 현재 14개 안팎)을 팀 5인 관점(기술·재무·뉴스·수급·종합)으로 재분석해 `analysis.js`를 다시 쓰고 `history.js`에 기록하는 절차. "정밀분석 해줘 / analysis.js 갱신해줘 / 개오 팀 재분석해줘"처럼 **명시적인 재분석 요청에만** 쓴다. base(기준가) ≡ data.js 시세 무결성이 최우선 철칙.
- **`.claude/skills/뉴스분석 스킬/SKILL.md`** — 시장을 움직인 기사·이슈를 조사해 초보자 눈높이 심층 보고서를 `news_analysis.js`에 추가하는 절차(조사→집필→등록→검증→배포). 품질 기준(분량 4,500~6,000자, 구체성 체크, 교차 확인된 수치만 사용 등)이 상세히 적혀 있다.

## 서브에이전트 (`.claude/agents/*.md`)

정밀분석에 쓰이는 5개 역할별 서브에이전트 정의: `chief-pm`(총괄 PM) · `diana-fundamental`(재무) · `flow-supply`(수급) · `nova-sentiment`(뉴스·심리) · `taro-technical`(기술적 분석). 종목분석 스킬 절차 안에서 병렬로 호출된다. 이 구조는 Claude Code의 서브에이전트 기능에 의존하므로, Codex가 같은 작업을 할 땐 이 5개 관점을 순차적으로(또는 자기 방식대로) 직접 수행하면 된다.

## GAEO TEAM — 저장소 개발·점검용 8개 Agent + 8개 Skill

위 5인 팀이 "종목 판단"을 만든다면, GAEO TEAM은 **이 저장소를 개발·점검·성장시키는 작업**(다음에 뭘 만들지, 만든 걸 검수하는지, 버그를 고치는지, 사이트 전체를 점검하는지)을 돕는다. `.claude/agents/gaeo-*.md`(8개) · `.claude/skills/gaeo-*/SKILL.md`(작업 스킬 8개, `/gaeo-strategy`·`/gaeo-design`·`/gaeo-build`·`/gaeo-review`·`/gaeo-bug`·`/gaeo-quant`·`/gaeo-growth`·`/gaeo-health`)로 구성돼 있다. 여기에 목록만 띄우는 안내 스킬 `.claude/skills/gaeo/SKILL.md`가 따로 있어서 `/gaeo`만 입력하면 8개 목록이 뜬다(2026-08-20 신설 — 그 전에는 문서에만 「`/gaeo`가 된다」고 적혀 있고 실제 스킬이 없어서, 입력해도 아무 것도 안 뜨는 상태였다).
> ⚠️ 이 스킬들은 저장소 안에 들어 있어서 **이 저장소를 연 세션에서만 보인다.** 계정에 저장되는 게 아니라, 저장소를 열지 않은 일반 대화창에서는 `/gaeo`가 안 뜨는 게 정상이다. 매주 월요일 09:00 KST·금요일 09:00 KST에 이 세션으로 오는 Routine 2개가 각각 `/gaeo-strategy`·`/gaeo-health` 실행을 "제안"한다(자동 실행·자동 커밋 아님). 전체 구조·안전 규칙·Skill별 Agent 조합은 `docs/gaeo_team_system.md`에 정리돼 있다.

## 이 원격 세션 환경의 특이사항

- **네이버 금융이 이 원격 세션에서는 403으로 막힌다.** 수동 시세 수집이 필요하면 `.analyst-refresh` 내용을 바꿔 `main`에 커밋·푸시해서 GitHub Actions 러너가 대신 수집하게 한다(1~2분 뒤 pull). 이건 이 특정 원격 실행 환경의 네트워크 제약이라, Codex가 다른 환경(예: 사용자 로컬 PC)에서 실행되면 이 문제가 아예 없을 수 있다.
- **`gaeoteam.com`·`rudvh1016-gif.github.io`(실제 프로덕션 사이트) 자체도 이 원격 세션 egress 프록시가 막는다** (2026-08-12 확인, `curl`·`WebFetch` 둘 다 `CONNECT tunnel failed, response 403`). 프로덕션 실물 화면을 직접 열어봐야 하는 감사·QA 요청이 오면, 리포지토리 내 `test_static_server.js`(로컬 8877 포트 정적 서버) + Playwright(`/opt/pw-browsers/chromium`)로 대체 검증하고 "프로덕션 직접 접근은 NOT VERIFIED — 세션 egress 제약"이라고 명시할 것. 다른 환경(사용자 로컬 PC 등)이나 이 프록시 정책이 바뀐 세션이라면 가능할 수 있으니, 그때는 직접 접근을 다시 시도해볼 것.
- Playwright 시각 검증은 전역 설치된 Chromium(`/opt/pw-browsers/chromium`)을 쓴다. `NODE_PATH=/opt/node22/lib/node_modules node 스크립트.js`로 실행.
- SessionStart 훅(`.claude/settings.json` → `check_pipeline.py`)이 세션 시작 때마다 데이터 파이프라인 신선도를 자동 점검해 경고를 띄운다. 이건 Claude Code 훅 메커니즘 전용 설정이다.
- 클로드 Routine("gaeo 장중 매시 kickoff 안전망")이 평일 매시 data.js 커밋이 25분 이상 끊기면 마커 push로 러너를 소생시키는 안전망 중 하나로 등록돼 있다(Claude Code의 예약 실행 기능, `AGENTS.md`의 데이터 파이프라인 안전망 5중 중 ⑤).
- ⭐ **16시(KST) 이후·주말·공휴일에는 시세 갱신이 원래 안 도는 게 정상이다(2026-07-31 사용자 지정).** `update-prices.yml`·`update-analysis.yml` 둘 다 애초에 "평일 09:00~16:00 KST"에만 도는 워크플로우고, 시장 자체가 그 시간에만 열리니 그 밖의 시간엔 데이터가 "오래돼 보이는" 게 당연한 정상 상태다. `check_pipeline.py` 훅이 장외 시간엔 점검을 생략하는 것도, 매일 시장분석 Routine이 주말·공휴일엔 조용히 종료하는 것도 이미 이 전제로 설계돼 있다. 그러니 이 시간대에 "며칠 전 갱신됨" 같은 경고나 자동 발행 스킵을 보면 그건 파이프라인 고장이 아니라 정상 작동이니, 알람으로 착각해 러너를 깨우거나 놀랄 필요 없다.

## 디자인 규칙

화면 작업 전에는 **`docs/gaeo_design_system.md`를 읽는다.** 요약 규칙은 `AGENTS.md`의
「디자인 — 새 화면을 만들기 전에 읽을 것」에 있다. 핵심은 분석가별 고유색 폐지 ·
장식 그라데이션/emoji/배지 자제 · 빨강파랑은 시장 방향에만 · 계층은 타이포와 여백으로.
새 기능을 추가하면서 다시 컬러풀하게 되돌리지 말 것.

## 이 세션에서 자주 하는 작업 패턴

- 종목/뉴스/공부 콘텐츠를 대량으로 추가할 때는 병렬 서브에이전트(Agent 도구)로 나눠서 각자 독립적으로 리서치·집필하게 하고, 결과를 스크래치패드에 모아 한 번에 조립·검증·배포하는 방식이 토큰·시간 면에서 효율적이었다.
- 마케팅 문구(title/meta/og 태그, 태그라인 등)를 고칠 땐 `og-image.png`처럼 텍스트가 이미지 픽셀로 박제된 파일이 있는지 확인할 것 — 텍스트만 고치고 이미지를 안 바꾸면 링크 미리보기가 예전 문구로 계속 뜬다.

## 스레드(Threads) 홍보 문구 스타일 (사용자 지정, 고정 규칙)

발행된 글을 스레드용 홍보 문구로 뽑아달라는 요청에는 항상 이 형식을 따른다:
- **맨 앞 줄에 날짜를 "YYYY년 M월D일 종가 기준"(또는 해당 글 성격에 맞는 날짜 표현)으로 넣는다.**
- 문장 끝에 마침표(.)를 쓰지 않는다.
- AI 말투 대신 자연스러운 사람 말투로 쓴다(딱딱한 격식체·설명체 지양).
- 목록형 내용(예: "~템 모음", "체크리스트", "필수 아이템")일 땐 제목 한 줄 쓰고 그 아래 1. 2. 3.… 번호를 매겨 각 항목을 짧고 간결하게 나열한다(긴 설명 붙이지 말 것).
- 글 맨 하단에 해당 글의 딥링크(`https://gaeoteam.com/?m=<mode>&id=<id>`, mode ∈ news/study/lesson/estate/calc)를 붙인다.
