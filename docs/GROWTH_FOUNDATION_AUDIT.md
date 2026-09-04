# Growth Foundation P0 기준선 감사

> ## ⚠️ 이 문서는 "고치기 전" 기준선이다 (2026-09-04 재확인)
>
> 아래 내용은 **수정 전 상태를 기록한 역사 문서**다. 할 일 목록으로 읽으면 안 된다.
> 2026-09-04에 로컬 서버 + Chromium으로 다시 실측해 확인한 현재 상태는 이렇다.
>
> | 기준선 결론 | 현재 상태 (2026-09-04 실측) |
> |---|---|
> | 2. stock noindex가 robots 차단 때문에 충돌 | **해결.** `robots.txt`에 `/snap/stock/` 차단이 없다. `/snap/stock/005930.html`이 `noindex,follow` + self canonical로 응답한다 |
> | 3. query 글 canonical과 OG/title 불일치 | **해결.** `/?m=news&id=63`이 canonical·og:url 모두 `…/snap/news/63.html`이고 title/og:title이 글 제목과 일치한다 |
> | 4. 앱 전용 query가 홈페이지로 canonical | **해결.** `/?m=single&code=005930`·`/?m=guide`·`/?m=rotation` 모두 canonical 없이 `noindex,follow`만 쓴다. 종목 query는 title/og도 종목명으로 바뀐다 |
> | 5. sitemap이 "오늘"을 만들어 거짓 신선도 | **해결.** `generate_sitemap.js` 2행에 "There is deliberately no 'today' fallback"이 명시돼 있고, 날짜가 없으면 `lastmod`를 생략하거나 오류를 낸다 |
>
> 대부분 커밋 `77386167 fix: harden growth foundation contracts`에서 처리됐다.
> 남은 항목(6번 제품 문구, 7번 analytics 계약)은 별도로 다룬다.

기준 시점은 2026-09-02이며, 시작 커밋은 `d016195cfcd229b54869b27fd791444bcb1e6380`이다. 이 문서는 수정 전 저장소와 운영 사이트 `https://gaeoteam.com`을 직접 조사한 결과다.

## 조사 방법

- 저장소의 생성기, 원본 데이터, 생성 결과물, robots, sitemap, RSS, 분석 코드를 함께 확인했다.
- Chromium/Playwright로 운영 페이지 10종을 390px에서 렌더링해 최종 URL, canonical, robots, 제목, H1, OG URL, 링크와 가로 넘침을 확인했다.
- `sitemap.xml`은 XML로 파싱해 URL 수, 중복, 질의 문자열, 로컬 파일 존재 여부를 계산했다.
- 현재-facing 문구와 과거 콘텐츠를 분리해 조사했다. 과거 인용문은 현재 제품 주장으로 분류하지 않았다.
- 성능은 같은 모바일 조건에서 3회 측정했다. 상호작용 값은 현장 INP가 아닌 Event Timing 기반 실험실 프록시다.

## A. URL 클래스

| URL 클래스 | 개수 | 의도한 색인 | robots 접근 | robots meta | canonical | sitemap | 대표 내부 링크 | 대표 공유 링크 | 질의형 대안 |
|---|---:|---|---|---|---|---|---|---|---|
| `/` | 1 | 색인 | 허용 | 없음 | `/` | 포함 | 전역 로고와 홈 링크 | 현재 주소 | 앱 상태별 `?m=` |
| 정적 신뢰 페이지 | 5 | 색인 | 허용 | 없음 | 각 페이지 자체 | about/contact/privacy/disclaimer 및 snap hub 포함 | footer, trust 링크 | 각 페이지 자체 | 없음 |
| `/snap/news/` | 63 | 색인 | 허용 | 없음 | 각 스냅샷 자체 | 포함 | `/snap/index.html`, 관련 글 | 스냅샷 자체 | `/?m=news&id=` |
| `/snap/study/` | 35 | 색인 | 허용 | 없음 | 각 스냅샷 자체 | 포함 | `/snap/index.html`, 관련 글 | 스냅샷 자체 | `/?m=study&id=` |
| `/snap/lesson/` | 82 | 색인 | 허용 | 없음 | 각 스냅샷 자체 | 포함 | `/snap/index.html`, 관련 글 | 스냅샷 자체 | `/?m=lesson&id=` |
| `/snap/estate/` | 19 | 색인 | 허용 | 없음 | 각 스냅샷 자체 | 포함 | `/snap/index.html`, 관련 글 | 스냅샷 자체 | `/?m=estate&id=` |
| `/snap/calc/` | 14 | 색인 | 허용 | 없음 | 각 스냅샷 자체 | 포함 | `/snap/index.html`, 관련 글 | 스냅샷 자체 | `/?m=calc&id=` |
| `/snap/stock/` | 600 | 색인 제외 | **차단** | `noindex,follow` | 각 스냅샷 자체 | 제외 | 앱 및 종목 관련 링크 | 기본 공유 대상 아님 | `/?m=single&code=` |
| `/research/deep-analysis/` | sitemap 62 URL | 색인 | 허용 | 없음 | 영구 research URL 자체 | 포함 | 리서치 허브와 종목 기록 | 영구 research URL | 종목 앱 CTA만 존재 |
| 글 질의 라우트 `?m=&id=` | 앱 호환 | 정적 글로 통합 | 허용 | 없음 | JS 렌더 후 정적 스냅샷 | 제외 | 앱 안 글 열기 | **현재 주소를 그대로 공유** | 정적 스냅샷 |
| 종목 질의 라우트 `?m=single&code=` | 앱 전용 | 색인 제외 | 허용 | 없음 | **관련 없는 홈페이지** | 제외 | 검색, 종목 링크, 정밀분석 CTA | **현재 주소를 그대로 공유** | noindex stock 스냅샷 |
| 그 밖의 `?m=` 앱 라우트 | 앱 전용 | 색인 제외가 적합 | 허용 | 없음 | **관련 없는 홈페이지** | 제외 | 메뉴와 PWA shortcut | 현재 주소 | 없음 |

수정 전 sitemap은 총 281 URL이다. 구성은 news 63, study 35, lesson 82, estate 19, calc 14, deep-analysis 62, 정적 URL 6이다. 질의 URL 0개, 중복 0개, 누락 로컬 파일 0개다. stock URL은 없다.

핵심 충돌은 `robots.txt`가 `/snap/stock/`을 막으면서 각 페이지의 `noindex,follow`를 크롤러가 읽지 못하게 하는 점이다. Google은 noindex를 읽으려면 robots.txt에서 그 URL을 차단하지 않아야 한다고 설명한다. 참고: [Google Search Central, noindex로 색인 생성 차단하기](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

## B. 실제 운영 렌더링 표본

| 표본 | HTTP/기능 | 렌더된 신호 | 관찰 |
|---|---|---|---|
| `/` | 200 | canonical/OG 모두 `/` | 모바일 가로 넘침 없음, 리소스 404 콘솔 오류 3건 |
| `/snap/index.html` | 200 | self canonical, self OG | 정상 |
| `/snap/news/63.html` | 200 | self canonical, self OG, indexable | 앱 CTA는 query URL과 `nofollow` |
| `/snap/lesson/1.html` | 200 | self canonical, self OG, indexable | 2026-07-16 글이지만 archive 안내 없음 |
| `/snap/study/34.html` | 200 | self canonical, self OG | 정상 |
| `/snap/calc/14.html` | 200 | self canonical, self OG | 정상 |
| `/?m=lesson&id=1` | 기능 동작 | canonical은 snapshot | OG와 document title은 홈페이지 값 |
| `/?m=news&id=63` | 기능 동작 | canonical은 snapshot | OG와 document title은 홈페이지 값 |
| `/?m=single&code=005930` | 기능 동작 | canonical은 홈페이지 | noindex 없음. 내용과 canonical이 무관함 |
| `/snap/stock/005930.html` | 200 | self canonical, self OG, `noindex,follow` | 390px에서 가로 넘침 확인 |

Google은 canonical URL을 sitemap, 내부 링크, `<link rel="canonical">`에서 일관되게 사용하고, client-side 렌더링에서도 신호가 충돌하지 않게 하라고 설명한다. 참고: [Google Search Central, 중복 URL 통합](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## C. URL 생성 및 복사 경로

| 코드 경로 | 만드는 URL | 현재 역할 | 위험 |
|---|---|---|---|
| `generate_snapshots.js` human build | `/snap/<mode>/<id>.html`, `/?m=<mode>&id=<id>` | self canonical, related 정적 링크, interactive query CTA | 문자열 조합이 별도 구현 |
| `generate_snapshots.js` stock build | `/snap/stock/<code>.html`, `/?m=single&code=<code>` | stock noindex와 앱 CTA | robots가 meta 확인을 막음 |
| `generate_snapshots.js` hub | 각 정적 snapshot 및 deep permalink | crawlable hub | 정상 |
| `generate_sitemap.js` | snapshot/research canonical | sitemap | `today` fallback과 정적 페이지 날짜 거짓 갱신 |
| `generate_rss.js` | snapshot URL | RSS item link/guid | 정적 URL은 정상, 사이트 설명의 500종목 문구는 낡음 |
| `index.html` head IIFE | query 글 canonical | SPA canonical 동기화 | 비글 query를 모두 홈페이지로 canonical 처리, OG/title 불일치 |
| `index.html` 글 열기 | `?m=<mode>&id=<id>` | history state와 legacy 앱 링크 | 정상 호환용이나 외부 공유 기본값으로 부적합 |
| `index.html` 종목 연결 | `?m=single&code=<code>` | 앱 전용 종목 화면 | 색인 억제 신호 없음 |
| `index.html` share FAB | `location.href` | native share/clipboard | query URL을 외부 기본 URL로 확산 |
| `deep_analysis_publish.js` | research permalink 및 종목 query CTA | 영구 deep canonical과 앱 이동 | 영구 URL은 정상, 앱 CTA는 호환 목적 |
| `CLAUDE.md`, `docs/CURRENT_STATUS.md` | Threads query 링크 규칙 | 홍보 문구 지침 | 외부 배포 canonical 정책과 충돌 |

관련 글은 human snapshot에서 정적 URL을 쓰며, interactive CTA만 query URL을 쓴다. 이 구분은 유지 대상이다. deep-analysis는 기존 영구 permalink가 대표 URL이다.

## D. 기존 분석 계측

- GA4 loader는 `index.html`에 1회 있고 측정 ID는 `G-D6PYQ4TXY4`다. `gtag('config', ...)`도 1회다.
- 별도 익명 집계인 `GaeoMetrics`가 방문, 새 기기, 검색, 콘텐츠 열기/30초 참여, 계산기 실행, 광고 loaded/visible/failed를 KVdb에 집계한다. GA4와 다른 시스템이다.
- consent manager 또는 `gtag('consent', ...)` 구현은 없다. 따라서 “동의가 필요한 배포 모드”를 표현하는 코드 계약도 없다.
- `window.gaeoTrack`은 임의 이벤트명과 임의 파라미터를 그대로 GA4에 전달한다. allowlist, 중복 방지, PII-like key 차단이 없다.
- 기존 GA4 custom events: `search`, `analysis_start`, `tutorial_begin`, `tutorial_complete`, `calculator_run`, `app_install`, `install_prompt_result`, `select_content`, `share`, `briefing_share`, `article_share`, `add_to_wishlist`, `remove_from_wishlist`, `search_open`.
- `search`는 회사명 또는 자유 입력 `search_term`을 보내고 `analysis_start`와 wishlist는 `stock_name`을 보낸다. 이 작업의 데이터 최소화 계약에 맞지 않는다.
- share는 같은 한 번의 행동에 `share`와 `briefing_share` 또는 `article_share`를 연속 전송해 행동 수가 중복 해석될 수 있다.
- config 기본 page_view는 1회 발생할 수 있다. SPA 이동에서 별도 page_view는 보내지 않아 중복 page_view 코드는 확인되지 않았다.
- 계산기는 `calculator_run`, watchlist는 Google 권장 ecommerce 이름의 add/remove 이벤트를 사용한다. 제품 행동 분류와 이름이 통일되지 않았다.
- 분석 스크립트가 차단돼도 `gaeoTrack` try/catch로 UI는 계속 동작한다.

Google Analytics는 개인 식별 정보를 보내지 못하게 금지한다. 참고: [Google Analytics 정책, PII 방지](https://support.google.com/analytics/answer/6366371?hl=en). 동의 상태 전달 방식은 [Google consent mode reference](https://support.google.com/analytics/answer/13802165)를 기준으로 삼는다.

## E. 현재 제품 주장

지정된 현재-facing 파일 11개에서 확인한 문자열 발생 수는 `AI 분석` 2, `AI 애널리스트` 2, `AI 팀` 0, `5인` 15, `7인` 0, `토론` 1, `600종목` 19, `자동분석` 56, `정밀분석` 83, `규칙 기반` 13이다. 과거 콘텐츠 원본 5개에서는 각각 0, 0, 0, 1, 0, 1, 10, 0, 2, 0이다.

| 위치 | 문구/맥락 | 분류 | 근거와 조치 |
|---|---|---|---|
| `index.html` metadata/JSON-LD | 600종목 판단, 규칙 기반 자동분석 | 대체로 정확하나 일부 모호 | title/description에도 규칙 기반을 일관되게 표시 |
| `index.html` footer | “5인의 애널리스트가 ... 분석” | 모호 | 실제 실행 주체처럼 보이지 않게 “분석 역할 체계”로 명확화 |
| `index.html` 내부 주석 | 실제 AI 분석, Claude 정밀분석 | internal-only | 사용자 화면은 아니지만 유지보수 오해를 줄이도록 용어 정리 |
| `about.html` visible | “AI ANALYST TEAM”, 다섯 명의 애널리스트 | 모호 | 역할 체계로 변경 |
| `about.html` 설명 | 여러 AI가 토론하지 않으며 AI API 미사용 | 정확 | 유지 |
| `about.html`/JSON-LD | 600개 주요 종목 규칙 기반 자동분석 | 정확 | 유지 |
| `generate_snapshots.js` stock title/comment | 500종목 정밀/자동분석 | 낡고 모호 | stock 페이지는 규칙 기반 자동분석으로 통일 |
| `generate_rss.js` site description | 500종목 | 낡음 | 실제 600종목으로 수정하고 방식 명시 |
| deep-analysis 생성기와 research 기록 | 정밀분석 | 정확한 AI 보조 선별 기록 | “AI 보조 정밀분석” 구분을 current 설명에 추가하되 기록 canonical 유지 |
| 과거 content 배열 | 당시 5인/600종목/토론 등 | historical archive | 자동 일괄 수정 금지, 날짜 안내로 맥락 제공 |
| `docs/CURRENT_STATUS.md` | 500종목, 당시 상태 | historical/internal stale | 현재 상태가 아님을 표시하고 관련 규칙 최신화 |

## F. 상대시점 언어 기준선

indexable human source 5개, 총 213건을 2026-09-02 기준으로 스캔했다. 단순 기준선은 923개 후보를 찾았다.

| 표현 | 후보 수 |
|---|---:|
| 오늘 | 511 |
| 내일 | 43 |
| 어제 | 120 |
| 이번 주 | 55 |
| 다음 주 | 8 |
| 금주 | 0 |
| 이번 달 | 15 |
| 다음 달 | 5 |
| 방금 | 1 |
| 곧 | 47 |
| 현재 | 118 |

이 수치는 위험 글 수가 아니라 문자열 후보 수다. “오늘날”, 지표 계산 예시, 인용문, 과거 장 마감 기사처럼 문제가 아닌 사례가 많이 포함된다. 예를 들어 lesson 1의 “내일을 맞히는 건 불가능”은 예측 한계를 설명하는 일반 문장이고, news 35의 “오늘(7/31)”은 절대 날짜가 이미 붙어 있다. 반면 오래된 기사에서 날짜 없이 보이는 상대 표현은 독자가 현재 사실로 오해할 수 있으므로, 전체 글을 바꾸는 대신 30일이 지난 snapshot에 실제 발행일 archive 안내를 표시하는 것이 안전하다. 최종 도구는 source file, id, publication date, phrase, context, age를 보고하고, 인용부호 안 표현은 quoted context로 구분한다.

기준선 검토에서는 archive 안내 없이 직접 문장을 바꿔야 할 만큼 확실한 고위험 표현을 확정하지 않았다. 따라서 과거 원문 일괄 치환은 하지 않는다. 구현 후 strict 감사가 새로 수정된 콘텐츠만 막는다.

## G. 모바일 성능 기준선

운영 홈, Chromium headless, viewport 390x844, network idle 후 측정:

| run | LCP | CLS | 상호작용 프록시 | initial HTML transfer | JS transfer | JS resources | blocking resources |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 568ms | 0.0352 | 16ms | 351,182B | 467,166B | 25 | 23 |
| 2 | 172ms | 0.0236 | 32ms | 351,182B | 466,555B | 25 | 23 |
| 3 | 472ms | 0.0236 | 24ms | 351,182B | 467,166B | 25 | 23 |

상호작용 프록시는 상단 검색 버튼 클릭에서 Event Timing이 기록한 가장 긴 duration이다. 실제 사용자 INP나 Search Console field data가 아니므로 서로 대체할 수 없다. 이 P0는 성능 프레임워크 변경을 하지 않는다.

## 기준선 결론

1. human snapshot과 research permalink 자체는 canonical/sitemap 일관성이 좋다.
2. stock noindex는 생성됐지만 robots 차단 때문에 실제 크롤러 계약이 충돌한다.
3. query 글 canonical은 최근 보완됐으나 OG/title/share가 canonical과 어긋난다.
4. 앱 전용 query는 관련 없는 홈페이지 canonical을 사용한다.
5. sitemap은 정적 페이지와 invalid date에서 “오늘”을 만들어 거짓 신선도를 보낼 수 있다. Google은 lastmod가 실제로 유의미하게 바뀐 때만 정확하게 쓰라고 안내한다. 참고: [Google Search Central, sitemap 만들기](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
6. 제품 설명은 정확한 문장도 많지만 “AI 애널리스트/5인 분석”이 실행 구조처럼 읽힐 수 있고, 500종목 낡은 문구가 남아 있다.
7. 기존 analytics loader는 재사용할 수 있으나 이벤트·동의·데이터 최소화 계약이 없다.

