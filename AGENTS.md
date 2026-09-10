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

## 🧭 작업 지도 (2026-09-10 — 어느 에이전트든 여기부터)

이 문서는 **전역 안전규칙과 지도**다. 세부 규칙은 아래 표의 문서를 "그 일을 할 때" 읽는다.
Codex는 `AGENTS.md`를 기본 32KiB까지만 자동으로 읽으므로, 규칙의 끝이 잘리지 않게 이 문서를 그 안에 유지한다(`test_rules_map.py`가 잠근다).

**절대규칙 (요약 — 본문은 각 절)**
1. 기존 기능·콘텐츠·데이터 연결을 보존한다. 사용자 명시 승인 없는 삭제·축소·대체 금지.
2. 실제 주문·계좌 자금 이동 코드는 영구 금지. 모의투자 원장은 한 곳만 쓰고 과거 원장을 다시 쓰지 않는다.
3. 자동 생성 파일(`data.js`·`history.js`·`auto_analysis.js` 등)은 손으로 고치지 않는다. 산식·가중치·사전등록 상수는 결과를 보고 바꾸지 않는다.
4. 데이터 파이프라인 워크플로의 트리거·`branches: [main]`·`run:` 블록 크기 한도(21,000B)를 지킨다.
5. Secret·토큰·계좌 정보·봉인 시험자료를 저장소·로그·화면에 넣지 않는다. force push·이력 재작성 금지.
6. 정상 점검·요약·예정 시험은 일반 프로그램이 한다(`ops_status.py`·`gaeo_check.py`·`validation-schedule`). LLM 호출 0.
7. "확인하지 못했다"를 "정상"으로 적지 않는다. "run이 돌고 있다"를 건강 신호로 쓰지 않는다.
8. 새 유료 API·서버·크레딧 금지. 무료 한도가 부족하면 중단·자료 부족으로 표시한다.

| 지금 하려는 일 | 먼저 읽을 것 | 검사 |
|---|---|---|
| 아무 작업이든 시작 | `docs/HARNESS.md` → `docs/operations/STATUS.md` | `python3 gaeo_check.py preflight` |
| 자동 생성 파일이 무엇인지 | `docs/rules/FILE_MAP.md` | - |
| 뉴스분석·공부·계산기 글 | `docs/rules/CONTENT_PUBLISHING_RULES.md` | `python3 seo_publish_gate.py` |
| 화면·디자인 | `docs/rules/INDEX_HTML_STRUCTURE.md` · `docs/rules/DESIGN_RULES.md` · `docs/gaeo_design_system.md` | `python3 test_design_contract.py` · Playwright smoke |
| 모의투자 | `docs/rules/PAPER_TRADING_RULES.md` · `docs/PAPER_TRADING_LOCAL_RUNNER.md` | `python3 gaeo_check.py paper` |
| 파이프라인·워크플로 | 이 문서 「데이터 파이프라인」 · `docs/PIPELINE_WATCHDOG.md` | `python3 gaeo_check.py pipeline` |
| 투자검증·사전등록·Evolution | `docs/gaeo_validation_policy.md` · `docs/PREREGISTRATION_BUY_FILTERS_20260905.md` · `docs/GAEO_HARNESS.md` | `python3 gaeo_check.py investment-contract` |
| 예정 시험 일정 | `docs/VALIDATION_SCHEDULE.md`(원본 `config/validation_schedule.json`) | `python3 gaeo_check.py schedule` |
| Claude/Codex 역할·스킬 | `docs/agent/MIGRATION_MAP.md` · `docs/agent/RULES_MAP.md` | `python3 gaeo_check.py compatibility` |
| 병합 전 | - | `python3 gaeo_check.py premerge` (= CI) |

## 파일 맵 — 누가 무엇을 관리하는가

→ `docs/rules/FILE_MAP.md` 로 옮겼다(2026-09-10, 원문 그대로). 자동 생성 파일을 손으로 고치기 전에 반드시 그 표를 본다.

## ⭐ 콘텐츠 발행 철칙 (카테고리 `cat` · 스냅샷 4종 실행 · 제목 길이)

→ `docs/rules/CONTENT_PUBLISHING_RULES.md` 로 옮겼다(2026-09-10, 원문 그대로). 뉴스분석·종목공부·주식공부·부동산공부·계산기 글을 추가·수정할 때 **반드시** 읽는다.

## 데이터 파이프라인 (GitHub Actions 러너 2개) — 건드리지 말고 이해만 할 것

- **update-prices.yml** — 평일 09:00~16:00 KST, 10분마다 `data.js`(시세·지수·환율 + 홈 숫자 브리핑) 커밋.
- **update-analysis.yml** — 같은 시간대, 30분마다 `price_history.js`·`analysis_data.json`·`indicators.json/js`·`radar.json/js`·`radar_series.js`·`auto_analysis.js`(홈 보강 브리핑 포함) 갱신 + `archive_analysis.py --auto`로 600종목 판단을 `history.js`에 하루 1건씩 누적.
- **순환매 갱신** — `update-analysis.yml`이 매 사이클 `rotation_snapshot.js`를 갱신하고 15:40 KST 이후에는 같은 거래일 마감본을 `rotation_archive.json`에 한 번만 남긴다. `rotation-maintenance.yml`은 주 1회 과거 검증을 다시 계산한다. 높은 신뢰도는 검증상 중간 신뢰도를 앞설 때만 열린다.
- **🌐 전체시장 관찰(2026-08-16)** — `collect_market_universe.py`가 같은 사이클에서 KOSPI+KOSDAQ 전체(bulk 44요청, 종목별 polling 금지)의 Breadth·집중도 집계만 만든다(`market_context.js` 1KB + 거래일별 **종가 기준** history). 600 정밀분석과 **별개 모집단**이고 실패해도 파이프라인을 멈추지 않는다. 상세: `docs/full_market_universe.md`. 업종 매핑 95% 게이트 통과 전에는 순환매를 전체시장으로 바꾸지 않는다.
- 두 러너 모두 "자가 반복 루프 + 종료 시 자기 재기동 체인" 구조다(GitHub 무료 cron이 이 저장소에서 불안정해서). 이 워크플로우 파일들의 트리거는 `workflow_dispatch` / `push`(`.analyst-refresh` 경로) / `schedule`(cron)뿐이고, **외부 PR로 실행되는 트리거는 없다(⚠️ 데이터 파이프라인 워크플로 한정이다. 2026-08-20 신설된 `ci.yml`은 `pull_request` 트리거를 쓰지만 secrets 참조가 0이고 `permissions: contents:read`뿐이라 포크 PR이 권한을 얻지 못한다)** — 이 점은 어떤 에이전트도 바꾸지 말 것(포크 PR이 권한 있는 워크플로우를 실행하게 만드는 건 보안 사고다).
- ⚠️ **`cancel-in-progress: false`다(2026-07-21 변경).** 즉 이미 실행 중인 잡이 있으면 새 트리거(마커 push·cron·dispatch)는 그 잡을 **취소하지 않고 뒤에서 대기(큐)만** 한다. "마커를 push하면 최신 1개만 남으니 안전하다"는 옛 설명은 틀렸다. 잡이 완전히 죽었을 땐 대기하던 실행이 곧바로 시작돼 문제없지만, 잡이 **죽지 않고 멈춘(hang)** 경우엔 마커 push가 최대 6시간(잡 timeout 350분) 동안 효과가 없다 — 그땐 실행을 먼저 **취소**해야 대기분이 뜬다(매시 Routine 안전망이 이 판정을 한다).
- 🧟 **좀비(hang) 판정은 "run이 있는가"가 아니라 "산출물이 갱신되는가"로 한다(2026-09-02 사고).** 그날 아침 두 러너가 같이 hang에 빠졌는데 안전망이 update-prices 쪽만 취소·재기동했다. 살아남은 update-analysis 좀비 뒤에서 새 run이 `pending`으로 2시간을 대기했고(위 `cancel-in-progress: false` 항목), 시세는 10분마다 정상 갱신되는데 자동분석만 전날 16:08에 얼어붙어 화면에 "분석 기준 어제 · 재분석 권장"이 아침 내내 떴다. **감시 3개가 전부 이걸 정상으로 봤다**: ① 매시 Routine은 `data.js` 신선도만 쟀고(시세는 멀쩡했다) ② update-prices의 짝꿍 상호 감시 `alive()`는 queued/in_progress run의 **존재**만 확인하는데 좀비도 in_progress고 밀린 대기분도 queued라 항상 "살아있다"고 답했으며 ③ `check_pipeline.py`는 auto_analysis.js를 70분 임계로 제대로 보지만 **SessionStart 훅**이라 사람이 세션을 열 때만 말한다. → 그래서 `pipeline-watchdog.yml`(+ `pipeline_watchdog.py`)을 추가했다. 산출물 타임스탬프로 판정하고, **두 파이프라인을 각각 독립적으로** 본다(한쪽이 멀쩡해도 다른 쪽을 가리지 않는다). 방금 뜬 run을 죽이지 않도록 `max(run 시작, 08:58)`부터 유예를 재는 것이 핵심이고, 이 규칙은 `test_pipeline_watchdog.py`가 사고 상황 재현으로 못 박아 뒀다. **앞으로 새 감시를 만들 때도 "run이 돌고 있다"를 건강 신호로 쓰지 말 것.** 사고 경위·임계값 표·아직 남은 조치는 `docs/PIPELINE_WATCHDOG.md`.
- 🔒 **파일 소유권(2026-07-31)**: `data.js`는 update-prices만 커밋하고, 파생물(`indicators*`·`auto_analysis.js`·`radar*`·`snap/` 등)은 update-analysis만 커밋한다. update-analysis는 매 사이클 `data.js`·`analysis.js`를 origin 최신본으로 받아 **읽기만** 하고, 커밋 직전 `git checkout HEAD --`로 되돌린다. (`git checkout <ref> -- <file>`은 인덱스에 stage까지 하므로, 안 되돌리면 add 목록에 없어도 커밋에 딸려 들어가고 push 재시도의 `merge -X ours`가 낡은 시세로 최신을 덮어쓴다.)
- ⏱️ **hang 방지**: 루프 안의 모든 `git fetch`·`git push`와 네트워크를 쓰는 스크립트(`curl`·`node ...submit.js` 등)에 `timeout`을 건다. 한 단계가 멈추면 잡이 350분 timeout으로 강제 종료되고, 그 경우 `chain()` 재기동 줄에 도달하지 못해 체인이 통째로 끊긴다(2026-07-22 사고 유형). ⚠️ 2026-08-04: `dispatch()`/`alive()` 함수 안 `curl`과 `git push` 자체에 timeout이 안 걸려 있어서, 이것들이 응답을 못 받으면 잡이 몇 시간이고 조용히 멈춰 있는 사고가 또 발생했다(체인은 안 끊기고 그냥 hang만 남는 유형이라 알아채기 더 어렵다) — 새 네트워크 호출을 추가할 땐 반드시 `timeout N <명령>`으로 감쌀 것.
- 수동 수집이 필요하면 `.analyst-refresh` 내용을 바꿔 `main`에 커밋·푸시한다(러너가 대신 수집, 1~2분 뒤 반영). SessionStart 훅(`check_pipeline.py`)이 세션 시작 때 파이프라인 신선도를 자동 점검해 경고를 띄운다.
- ⭐ **FLOW(수급) 데이터는 구조적으로 하루(T+1) 지연된다(2026-08-12 확인, 버그 아님).** `collect_analyst_data.py`가 받아오는 `dealTrendInfos`(네이버 `m.stock.naver.com` 통합 API)는 그날 장중에 실시간으로 갱신되는 값이 아니라, 그날 장 마감 후 다음 거래일이 돼야 `dt[0]`으로 확정 반영된다 — 실제로 8/12 당일 09:02~15:49 KST 사이 30분 간격 수집 12회를 전부 대조해봐도 `dt[0].bizdate`는 하루 종일 `20260811`(전일)에 머물러 있었다. 즉 **당일 오전부터 장마감까지 아무리 자주 수집해도 "오늘 확정 수급"은 절대 못 얻는다** — 다음 거래일 아침이 돼야 전날 몫이 `dt[0]`으로 올라온다. `index.html`의 `flow_summary()`가 만드는 기간 라벨(`최근 N거래일(YYYY-MM-DD~YYYY-MM-DD)`)은 이 원본 bizdate를 그대로 읽는 것이라 데이터가 실제로 갱신되면 자동으로 날짜도 따라간다(별도 코드 수정 불필요). 당일 실시간 수급(장중 누적)을 보여주려면 이 `dealTrendInfos`와는 다른 진짜 장중 갱신 API를 새로 찾아 검증해야 하는데, 이 저장소의 원격 세션은 네이버 접속이 막혀 있어 후보 엔드포인트를 직접 검증할 수 없다(위 "네이버 금융 403" 항목과 같은 제약). 사용자 로컬 PC 등 네이버 접속이 가능한 환경에서 브라우저 개발자도구로 실제 종목 페이지의 장중 수급 위젯이 호출하는 API를 확인해 알려주면, 그걸 받아 안전하게 추가할 수 있다.
- 재분석 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참조. **base ≡ data.js price 무결성이 최우선 철칙.**

자세한 동작 원리는 `docs/ARCHITECTURE.md`와 `docs/WORKFLOW.md` 참고.

## 모의투자(Paper Trading) — 실행 주체는 언제나 한 곳뿐

→ `docs/rules/PAPER_TRADING_RULES.md` 로 옮겼다(2026-09-10, 원문 그대로). 절대규칙만 여기 남긴다: 원장을 쓰는 러너는 한 곳뿐(`paper_runner_config.json`) · 실주문 코드 금지 · 과거 원장 재작성 금지 · `paper-trading.yml`의 schedule을 되살리지 말 것. 러너 복구·이력 재작성 대응은 `docs/PAPER_TRADING_LOCAL_RUNNER.md` §9.

## index.html 구조

→ `docs/rules/INDEX_HTML_STRUCTURE.md` 로 옮겼다(2026-09-10, 원문 그대로). 화면(`index.html`·`app.js`·`app-shell.css`)을 만지기 전에 읽는다.

## ⚠️ 코딩 시 주의 (실제 겪은 함정 — 어떤 에이전트든 반드시 지킬 것)

1. **정규식 lookbehind `(?<!)` 금지** — iOS 16.4 미만 Safari에서 그 줄 하나로 스크립트 블록 전체가 죽는다. 앞 경계는 `(^|[^A-Za-z0-9])` 캡처그룹으로 대체할 것. (`??`·`?.`는 기존 코드가 이미 사용 — ES2020 기준선 OK)
2. **PRICE_HISTORY 페이지는 시간순이 아닐 수 있다** — flatMap 후 반드시 날짜로 정렬(`flatCloses` 참조).
3. `app.js`는 `document.getElementById` 위주라 HTML 래핑(aside/main 추가)에 안전하지만, `app-shell.css`에는 `.wrap` 직계 자식 순서에 기대는 규칙(`.layout` 그리드)이 있으니 마크업 이동 시 확인.
4. **시각 변경 후엔 반드시 실제 브라우저로 데스크톱(1680)·초와이드(1920)·모바일(390, iPhone 13 프로필) 스크린샷을 찍고 콘솔 에러(pageerror)가 없는지 확인한다.** (Claude Code 세션의 구체적인 브라우저 실행 경로는 `CLAUDE.md` 참고.)
5. `base`/`updated` 등 `analysis.js` 필드 규격은 `app.js`가 전부 파싱한다 — 구조 변경 금지(스킬 문서 참조).
6. **테마 시스템(🍎 애플 감성)**: 기본은 라이트(#F5F5F7 캔버스·흰 카드·#1D1D1F 잉크·애플 블루 #0071E3 단일 액센트). `html.gdark` = 애플 다크(순검정 배경·#1C1C1E 카드·#0A84FF 블루). **본문 텍스트 색은 반드시 변수(`--ink`/`--t2`/`--t3`/`--dim`)로** — 하드코딩 slate hex는 다크에서 안 보인다. 새 배경 요소를 만들면 `html.gdark` 개별 오버라이드를 함께 추가할 것.
7. **본문 등락 색(한국식)**: `SIGNUM(html)` 전역 헬퍼가 이스케이프된 HTML에서 「부호+숫자+단위(%·%p·포인트·원)」만 골라 상승(+)=빨강(`.sgn-u`/`--krup`)·하락(−)=파랑(`.sgn-d`/`--krdn`)으로 감싼다. 새 텍스트도 자동 반영되니 별도 처리 불필요.
8. **보안 — 게시판(`community.js`) 관련**: 공개 방문자 쓰기는 닫혀 있다. 브라우저에서 KVdb에 게시글을 직접 쓰거나 비밀번호를 인증처럼 다루는 경로를 다시 추가하지 않는다.
9. **보안 — 관리자 초안**: 브라우저 관리자 도구는 이 기기의 초안과 PR 요청문만 만든다. GitHub PAT 입력·저장, `api.github.com` 직접 커밋, 정적 비밀번호 인증을 다시 추가하지 않는다. 실제 공개 반영은 별도 브랜치·계약 테스트·PR·CI로 수행한다.
10. ⭐ **em dash(—) 사용 금지 (2026-07-30 사용자 지정, 고정 규칙).** 뉴스분석·종목공부·주식공부·부동산공부·계산기 본문, 제목, summary, tag, 출처명, analysis.js의 findings·report·text, index.html이 화면에 그리는 모든 문장 등 사용자가 실제로 읽는 텍스트에는 절대 em dash를 쓰지 않는다. 이 부호가 들어가면 "AI가 썼다"는 티가 나서 독자가 피로감을 느낀다는 게 이유다. 대신 문장 구조에 맞게 쉼표·마침표·콜론(:)·괄호로 자연스럽게 풀어 쓸 것. (코드 주석처럼 사용자에게 노출되지 않는 부분은 해당 없음.)
11. ⭐ **모바일 글자 잘림 방지: 콘텐츠 컨테이너는 `overflow-wrap:anywhere` 필수 (2026-08-03 실제 사고).** 뉴스분석·종목공부·주식공부·부동산공부·계산기가 전부 공유하는 `.nw-title`/`.nw-sum`/`.nw-body`에 `overflow-wrap:anywhere`가 걸려 있다 — 이게 없으면 `word-break:keep-all`(한국어 어절 단위 줄바꿈, 이 파일 다른 곳에도 적용된 규칙) 때문에 공백 없이 `·`로 죽 이어붙인 나열("로봇(+7.79%)·통신(+3.84%)·바이오제약(+3.63%)·..."처럼)이 줄바꿈될 자리를 못 찾고 뷰포트 밖으로 그냥 넘쳐서 모바일 화면에서 글자가 잘려 보인다(실제로 8/3 시장분석 기사에서 발생). `.nw-*` 계열 CSS를 고칠 때 이 속성을 빼지 말 것. 그리고 새 글을 쓸 때 `·`로 여러 항목을 나열하려면 **양옆에 공백을 넣는 게 원칙**이다(`"A(+1%) · B(+2%) · C(+3%)"`, 사이트 기존 관례와도 일치) — CSS가 넘침 자체는 막아주지만, 무공백으로 붙이면 그 줄바꿈이 단어 중간에서 뚝 끊겨 보기 나쁘다.
12. ⭐ **분석 카드 근거(findings) 문장은 한 줄에 들어오게 짧게 쓴다 (2026-08-05 사용자 지정).** `.card ul li` 근거 목록은 항목마다 구분선(border-top)이 있는 짧은 리스트 디자인이라, 문장이 2줄로 넘어가면 답답해 보인다는 지적을 받았다. 특히 DIANA(재무)의 목표주가 문장처럼 "증권사 평균 목표주가 X원 · 현재가 대비 +Y% 여력"류로 큰 숫자(백만원대)와 %가 같이 들어가는 문장이 잘 넘친다 — `analyze_auto.py`의 `diana_eval()`을 "목표주가 X원 → 현재가 대비 +Y%"로 압축한 게 실제 수정 사례(불필요한 "증권사 평균"·"여력" 같은 수식어부터 뺀다). 새 finding 문장을 쓰거나 고칠 때는 모바일 폭(390px, 폰트 12~12.5px)에서 한 줄에 들어가는지를 기준으로 잡고, 숫자가 큰 종목(100만원 이상)·퍼센트가 세 자리(±100%대)인 경우까지 감안해서 여유 있게 짧게 쓴다.

## ⭐ 디자인 — 새 화면을 만들기 전에 읽을 것

→ `docs/rules/DESIGN_RULES.md`(요약 8줄 + 2026-08-18 sweep 고정 사항, 원문 그대로) 와 `docs/gaeo_design_system.md`(원본)를 읽는다. 분석가별 고유색 금지 · 장식 그라데이션/emoji/배지 자제 · 빨강파랑은 시장 방향에만 · 계층은 타이포와 여백으로.

## GAEO TEAM — 저장소 개발·점검을 돕는 Agent/Skill 체계 (Claude Code 전용)

이 저장소를 개발·점검·성장시키는 작업(사용자에게 보여줄 종목 판단이 아니라 이 서비스 자체를 다루는 작업)을 돕는 8개 Agent + 8개 `gaeo-` Skill이 `.claude/agents/gaeo-*.md`·`.claude/skills/gaeo-*/SKILL.md`에 있다. Claude Code에서 `/gaeo-strategy`(방향 제안, 읽기 전용)·`/gaeo-design`(디자인 점검, 읽기 전용)·`/gaeo-build`(구현)·`/gaeo-review`(배포 전 검수)·`/gaeo-bug`(버그 수정)·`/gaeo-quant`(분석력 실증 검증)·`/gaeo-growth`(유입·성장 검토)·`/gaeo-health`(전체 점검, 읽기 전용)·`/gaeo-maintain`(유지보수 진입점: STATUS·통합 점검·수리 요청서부터 읽음, 2026-09-10 신설)로 호출한다. 2026-09-10부터 기본은 메인 작업자 1명·동시 2명 이내이며 정상 점검에는 AI를 쓰지 않는다(`docs/gaeo_team_system.md` 개정 절). 전체 구조·안전 규칙·주간 자동 제안(Routine) 방식은 `docs/gaeo_team_system.md`에 정리돼 있다. Codex 등 다른 에이전트는 이 체계를 직접 호출할 수 없지만, 같은 절차를 텍스트 그대로 따라 하면 동일한 결과를 낼 수 있다.

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
