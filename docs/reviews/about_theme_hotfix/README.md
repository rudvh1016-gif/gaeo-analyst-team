# About 페이지 테마 핫픽스 검토 기록

날짜: 2026-09-03 (KST)
브랜치: `claude/auto-analysis-failure-prevention-94we7m` (병합된 옛 PR과 무관한 새 작업 — 세션 지정 브랜치를 최신 `origin/main`에서 다시 시작)
기준 main: `e86a073cc516588edba89ecc766e3ee36a5d469c`
상태: **소유자 시각 승인 대기. 병합·배포하지 않음.**

## 증상

홈은 밝은 화면 `#F7F7F5`, 어두운 화면 `#0D0E10`(설계 토큰)으로 정확히 그려지는데,
`about.html`만 사용자의 밝은 화면 요청을 무시하고 항상 어둡게 떴다.
그마저도 `html`은 `#090909`(about.html 자체 값), `body`는 `#070808`(공통 CSS의 About 전용
오버라이드)로 서로 달랐고, `theme-color`도 `#090909` 하나만 있었다. 사이트 테마 토글
(`localStorage gaeo_theme`)과 OS 다크 설정 어느 쪽도 About에는 적용되지 않았다.

## 원인

1. `editorial-accessibility.css`의 `html.about-page{ --editorial-page:#070808; … color-scheme:dark }`
   블록이 About에서만 편집형 토큰을 통째로 다크 값으로 바꿨다.
2. `about.html` 자체 `:root` 토큰이 다크 전용(`--background:#090909` 등)이었고 `html{color-scheme:dark}`였다.
3. `about.html` 안에 다크 배경을 전제로 한 하드코딩 색 6곳(`#101824`, `#75A7F8`, `#C4CBD7`, `#73A7F8`,
   `#C8D9F8`, `#121C2A`, `rgba(59,130,246,…)`)이 있었다.
4. 홈이 첫 페인트 전에 붙이는 테마 클래스(`html.gdark`) 스크립트가 About에는 없었다.

## 수정 (집중 범위)

- `about.html`
  - `<html class="about-page">` → `<html>` (강제 다크 훅 제거)
  - index.html과 같은 사전 스크립트로 `gaeo_theme==='dark'`면 `html.gdark` 부여
  - `theme-color` 2개: 밝음 `#F7F7F5`, 어두움 `#0D0E10`
  - `:root` = 편집형 밝은 토큰, `html.gdark` 및 `@media (prefers-color-scheme: dark){ html:not(.glight) }` = 편집형 어두운 토큰
  - 하드코딩 색 6곳을 토큰으로 교체 (`--surface-subtle`, `--border-strong`, `--accent`, `--text-secondary`)
  - `.about-card:hover`의 `white 4%` 혼합 → `var(--text) 3%` (두 화면에서 같은 방향으로 동작)
- `editorial-accessibility.css`: 죽은 `html.about-page{…}` 블록 제거 (다른 규칙 무변경)
- `test_editorial_accessibility_browser.js`: About 대기 조건을 옛 다크 값 `#8b8b94`에서
  편집형 subtle 토큰 `#606873`으로 갱신 (대비 ≥ 4.5:1 단언은 그대로)
- 버전 문자열 `editorial-accessibility.css?v=20260903-v1`과 `sw.js` CACHE는 바꾸지 않았다.
  about.html은 service worker에서 network-first(HTML)이고, 제거한 CSS 블록은 클래스가 사라져
  옛 캐시본이 남아 있어도 효과가 없다.

## 실측 (로컬 정적 서버, Playwright Chromium, 외부 요청 차단)

`getComputedStyle(document.body).backgroundColor` 기준.

| 화면 | 수정 전 body | 수정 후 body | 수정 후 html | color-scheme | 규격 |
|---|---|---|---|---|---|
| 홈 밝음 데스크톱 1440 | `#F7F7F5` | `#F7F7F5` | `#F7F7F5` | light | `#F7F7F5` |
| 홈 밝음 모바일 390 | `#F7F7F5` | `#F7F7F5` | `#F7F7F5` | light | `#F7F7F5` |
| 홈 어두움 모바일 390 | `#0D0E10` | `#0D0E10` | `#0D0E10` | dark | `#0D0E10` |
| **About 밝음 모바일 390** | **`#070808`** (html `#090909`, color-scheme dark) | `#F7F7F5` | `#F7F7F5` | light | `#F7F7F5` |
| About 어두움 모바일 390 (참고) | `#070808` | `#0D0E10` | `#0D0E10` | dark | `#0D0E10` |
| About 밝음 데스크톱 1440 (참고) | `#070808` | `#F7F7F5` | `#F7F7F5` | light | `#F7F7F5` |
| 기사 스냅샷(news/63) 밝음 390 | `#F7F7F5` | `#F7F7F5` | transparent | light | `#F7F7F5` |

수정 후 정확한 토큰 값(`about.html`):

- 밝음: `--background:#F7F7F5 --surface:#FFFFFF --surface-subtle:#F0F1EF --border:#E4E6EA --border-strong:#CCD1D8 --text:#111214 --text-secondary:#555B66 --text-muted:#606873 --accent:#245A70 --accent-soft:rgba(36,90,112,.10) --hover:rgba(17,18,20,.04) color-scheme:light`
- 어두움(`html.gdark` / OS 다크): `--background:#0D0E10 --surface:#14161A --surface-subtle:#1B1E22 --border:#2B2F35 --border-strong:#3B414A --text:#F4F5F7 --text-secondary:#B2B8C2 --text-muted:#AAB1BA --accent:#9ED8EC --accent-soft:rgba(158,216,236,.12) --hover:rgba(255,255,255,.05) color-scheme:dark`
- About 보조 텍스트 대비(`--text-muted` 위 `--background`): 밝음 5.256:1 (테스트 실측)

스크린샷: `before/`(수정 전 About 밝음 390, 홈 밝음 390), `after/`(홈 밝음 데스크톱·홈 밝음 390·홈 어두움 390·About 밝음 390·기사 스냅샷 밝음 390 + 참고용 About 어두움 390·About 밝음 데스크톱).
모든 화면에서 horizontal overflow 0, pageerror 0.

## 테스트

- 정적: `test_editorial_accessibility.js`, `test_design_contract.py`, `test_brand_assets.js`, `test_growth_claims.js` PASS
- 브라우저: `test_editorial_accessibility_browser.js` 전체 통과(312 PASS, About 보조 텍스트 대비 5.256:1)
- CI 동일 회귀: Python 57/57 PASS, Node(비브라우저) 34/34 PASS
- `git diff --check` PASS, diff 안 비밀값 패턴 0
- `test_performance_budget_browser.js`: Home `long-task proxy` 801ms(단독 실행)·929ms(동시 실행) > 500ms 로 실패.
  **핫픽스를 stash로 걷어낸 순정 main에서도 같은 샌드박스에서 871ms로 동일하게 실패** → 이 PR과 무관한
  실행 환경(느린 CPU) 문제. CI(`ci.yml`)는 브라우저 테스트를 돌리지 않는다. 다른 경로 예산은 모두 통과.

## 범위 밖(보고만, 승인 전 추가 시각 변경 금지)

- `404.html`도 같은 강제 다크 패턴(`--background:#090909`, `color-scheme:dark`)이다.
- `index.html`의 `theme-color`가 `#FFFFFF`/`#000000`으로 캔버스 토큰(`#F7F7F5`/`#0D0E10`)과 다르다.
- 생성 기사 스냅샷은 자체 팔레트(`--bg:#F4FAFC`, `--card:#fff`, `--sky:#286B83`)를 편집형 body 위에 얹는다.

## 롤백

PR revert 1건. service worker 버전 변경 없음.
