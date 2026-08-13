# GAEO 정밀분석 발행 시스템 설계

## 목표

기존 종목 상세의 `정밀분석 기록`에 저장되는 완료된 Deep Analysis만 장기 Research Asset으로 발행한다. 종목공부, Study, 자동분석, 일반 AI 분석은 이 파이프라인에 절대 포함하지 않는다.

완료된 한 개의 정밀분석 기록은 별도 DB나 수동 배열로 복사하지 않고 `analysis_archive.js`를 단일 원본으로 삼아 다음 파생물을 자동 생성한다.

- 종목 상세의 기존 정밀분석 기록
- 홈의 최근 정밀분석 5건
- 전체 정밀분석 Archive
- 개별 Historical Snapshot permalink
- Sitemap 항목

## 현재 구조와 제약

- 사이트는 GitHub Pages에 배포되는 순수 정적 사이트이며 서버·SSR·DB가 없다.
- `archive_analysis.py`가 `analysis.js`의 정밀분석 원문을 `analysis_archive.js`에 누적한다.
- `analysis_archive.js`는 기술·재무·확률통계·수급·CHIEF 원문과 당시 기준가를 보존한다.
- 기존 `snap/stock/<ticker>.html`은 현재 종목 상태를 보여주는 `noindex` 페이지이며 Historical Snapshot이 아니다.
- 기존 Workflow는 `archive_analysis.py`를 실행하지만 `analysis_archive.js`를 자동 커밋 목록에 포함하지 않는다.
- 기존 원문 Archive는 종목당 30건 상한이 있어 장기 Historical Record 원칙과 충돌한다.

## 선택한 접근

전용 정적 생성기 `generate_deep_analysis.js`를 추가한다. 이 생성기는 `analysis_archive.js`와 `tickers.js`만 읽어 발행 가능한 기록을 선별하고 모든 화면·링크·SEO 파생물을 생성한다.

기존 `generate_snapshots.js`에 기능을 합치지 않는다. 해당 파일은 이미 뉴스·공부·계산기·현재 종목 스냅샷을 담당하므로 정밀분석 Historical 발행까지 추가하면 책임과 회귀 범위가 지나치게 커진다.

브라우저 전용 라우팅도 사용하지 않는다. 초기 HTML, 고유 메타데이터, 실제 404, 크롤링 가능한 링크를 보장하려면 GitHub Pages가 직접 제공하는 정적 파일이 필요하다.

## 데이터 모델과 발행 조건

### 단일 원본

`ANALYSIS_ARCHIVE[ticker][]`가 Source of Truth다. 홈·Archive·Snapshot·Sitemap은 모두 여기서 재생성 가능한 파생물이다.

### 안정 식별자

현재 고유 ID가 없으므로 `ticker + updated`를 안정 키로 사용한다. URL용 시각은 `YYYY-MM-DD-HHmm` 형식으로 정규화한다. 동일 완료 이벤트가 재실행되면 같은 경로를 덮어써 중복이 생기지 않는다.

미래 Snapshot에는 다음 정보를 함께 보존한다.

- `snapshotId`
- `ticker`
- 당시 `stockName`
- 당시 `sector`
- `analysisCreatedAt`
- `dateModified` 또는 `revision`이 필요한 경우의 수정 정보

기존 기록에는 당시 종목명·업종이 없으므로 Backfill 시 현재 `tickers.js` 값을 사용한다. 앞으로 생성되는 기록부터 당시 값을 Archive 자체에 저장한다.

### 완료 조건

다음 조건을 모두 만족하는 실제 정밀분석만 발행한다.

- 6자리 ticker와 유효한 `updated`
- 당시 기준가 `base` 및 기준 시각 `baseAt`
- `taro`, `diana`, `nova`, `flow` 네 축이 존재하고 각 축에 점수·성향·공개 findings가 존재
- `chief`에 유효한 `BUY|HOLD|SELL`, 점수, 신뢰도, 공개 설명이 존재
- `tier:auto`, fixture, mock, test, incomplete, corrupted 표식이 없음

문자열 제목을 추측해 정밀분석으로 분류하지 않는다. 입력 원본 자체가 `analysis_archive.js`인 것이 1차 type guard다.

## URL과 정적 출력

- Archive 첫 페이지: `/research/deep-analysis/`
- Archive 다음 페이지: `/research/deep-analysis/page/2/`
- Snapshot: `/research/deep-analysis/{ticker}/{YYYY-MM-DD-HHmm}/`

각 경로에는 `index.html`을 생성해 GitHub Pages에서 확장자 없는 실제 경로로 제공한다. 존재하지 않는 경로에는 파일을 만들지 않으므로 GitHub Pages가 정상 404를 반환한다.

Snapshot URL은 발행 후 변경하지 않는다. 같은 종목을 같은 날 여러 번 분석해도 분 단위 시각이 달라 별도 기록이 된다.

## 생성 파이프라인

정밀분석 완료 시 다음 순서로 실행한다.

1. `analysis.js`에 정상 완료 결과 저장
2. `archive_analysis.py`로 기존 기록과 원문 Archive 갱신
3. `generate_deep_analysis.js`로 Snapshot·Archive·홈 경량 목록 생성
4. `generate_sitemap.js`로 발행 Snapshot canonical URL 자동 포함
5. 필요한 기존 Snapshot·RSS 생성 절차 실행
6. 생성물과 원본을 함께 커밋·배포

GitHub Actions의 자동 분석 사이클에도 2~4단계를 연결한다. 파생 단계 실패 시 `analysis_archive.js`를 삭제하거나 되돌리지 않는다. 다음 실행에서 동일 원본으로 재생성할 수 있다.

Workflow 자동 커밋 대상에는 다음을 포함한다.

- `analysis_archive.js`
- 홈 최신 5건 경량 manifest
- `research/deep-analysis/**`
- `sitemap.xml`

원본 Archive의 종목당 30건 상한은 제거한다. UI와 전송량은 정적 Pagination 및 홈 5건 manifest로 제한하며, 원본 Historical Record는 보존한다.

## 홈 최근 정밀분석

`deep_analysis_latest.js`에는 발행 가능한 기록을 `analysisCreatedAt DESC`로 정렬한 최신 5건만 저장한다. `modifiedAt` 때문에 과거 기록이 최신 목록에 올라오지 않는다.

홈의 현재 기준 브리핑 왼쪽 열에서 시장·확산·업종·시세 기준·기존 Action 아래에 표시한다. 오른쪽의 오늘의 판단과 BUY Universe는 그대로 유지한다.

표시는 카드가 아닌 Editorial List다.

- 제목: 최근 정밀분석
- 설명: 직접 지정해 더 깊게 확인한 종목이에요
- 각 행: 종목명 + 분석 날짜
- 실제 `<a href>`로 Snapshot permalink 연결
- 하단 실제 링크: 정밀분석 전체 보기
- 기록이 없으면 조용한 Empty State 표시

모바일에서도 같은 위치와 동일 URL을 사용하며 세로 목록으로 표시한다. 홈에서는 전체 `analysis_archive.js`를 내려받지 않는다.

## Archive

한 페이지당 20건을 최신순으로 출력한다. 날짜·종목명·업종·정밀분석이라는 최소 정보만 보여주고 실제 Snapshot 링크를 제공한다.

이전·다음 페이지는 실제 URL을 가진 `<a>`로 제공한다. JavaScript 무한스크롤에 의존하지 않는다. 이번 범위에는 별도 검색 기능을 넣지 않는다.

## 개별 Snapshot

초기 HTML에 다음 공개 정보가 포함된다.

- 종목명과 ticker
- 분석 생성 날짜·시간
- 당시 가격과 가격 기준 시각
- BUY/HOLD/SELL, 정밀 점수, 신뢰도
- 기술·재무·확률통계·수급 findings
- CHIEF reason, target, report
- 이 분석이 당시 시점의 Historical Record라는 안내
- 현재 종목 분석으로 이동하는 실제 링크
- Archive와 홈으로 이동하는 Breadcrumb

내부 prompt, system instruction, debug log, secret, API key, private metadata는 출력하지 않는다.

종목 상세의 기존 `정밀분석 기록` UI는 유지하고 각 기록에 `이 분석만 보기` 실제 링크를 추가한다.

## SEO

각 Snapshot은 다음을 가진다.

- 고유 `<title>`
- 실제 내용 기반 고유 meta description
- self canonical
- `index,follow`
- 올바른 `datePublished`와 `dateModified`
- `Article` JSON-LD
- 화면과 일치하는 `BreadcrumbList` JSON-LD
- 홈·Archive·종목 상세와 연결된 crawlable internal links

가짜 rating, review, author 경력, 금융 추천 정보는 만들지 않는다. Sitemap에는 indexable Snapshot canonical URL과 Archive 페이지를 절대 URL로 넣고 실제 분석 날짜를 `lastmod`에 사용한다.

이 설계는 Google Search Central의 다음 공식 지침을 따른다.

- Sitemap에는 검색 노출을 원하는 canonical URL만 포함하고 정확한 `lastmod`를 사용한다.
- Google이 발견할 링크는 `href`가 있는 `<a>`여야 하며 fragment-only URL을 콘텐츠 주소로 사용하지 않는다.
- 초기 HTML 또는 prerendered HTML은 사용자와 크롤러 모두에게 핵심 내용을 바로 제공한다.
- Structured Data는 화면에 실제 표시되는 내용과 일치해야 한다.

참고:

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies

## 영구 작업 규칙

`docs/DEEP_ANALYSIS_PUBLISHING.md`를 운영 규칙의 단일 문서로 만든다. `AGENTS.md`, `CLAUDE.md`, `.claude/skills/종목분석 스킬/SKILL.md`에는 짧은 pointer만 추가한다.

향후 “OOO 정밀분석해줘” 요청의 완료 정의는 SAVE → PUBLISH → LINK → ARCHIVE → SURFACE ON HOME → ADD TO SITEMAP이다. 종목공부와 일반 분석은 이 규칙을 Trigger하지 않는다.

## 오류 처리

- 불완전 기록은 발행하지 않고 생성 로그에 제외 사유를 표시한다.
- 생성 중 오류가 나면 기존 원본 Archive와 이미 발행된 Snapshot을 삭제하지 않는다.
- 생성기는 현재 유효한 원본으로 전체 파생물을 재현할 수 있어야 한다.
- 동일 안정 키 재실행은 idempotent하다.
- 오래된 Snapshot 수정은 원래 분석 생성 시각을 보존하고 필요한 경우에만 `dateModified`를 바꾼다.

## 검증

### 데이터·단위 테스트

- 완료 조건이 정밀분석만 통과시키는지 확인
- fixture·auto·불완전 기록 제외 확인
- 동일 이벤트 재실행 시 URL·개수 불변 확인
- 동일 종목 하루 복수 기록의 URL 충돌 없음 확인
- 최신 5건이 `analysisCreatedAt` 기준인지 확인
- Pagination 경계와 실제 이전·다음 URL 확인
- 기존 Archive Backfill 수와 생성 Snapshot 수 일치 확인

### SEO·정적 검증

- 모든 Snapshot의 고유 title·description·canonical 확인
- canonical과 Sitemap loc 일치 확인
- 정확한 ticker·종목명·날짜·초기 본문 확인
- noindex·robots 차단 없음 확인
- JSON-LD 파싱 및 화면 내용 일치 확인
- 존재하지 않는 경로가 생성되지 않음 확인

### UI·회귀 검증

- PC 홈 왼쪽 빈 공간에 5건 목록 노출
- 모바일에서 목록과 touch target 확인
- 홈 전체 높이가 불필요하게 증가하지 않음 확인
- 기존 브리핑, 오늘의 판단, BUY 목록 정상 동작 확인
- 종목 상세의 정밀분석 기록과 새 permalink 링크 정상 동작 확인
- Archive와 Snapshot을 JavaScript 없이 읽을 수 있는지 확인

### 전체 코드 점검

- 생성 파일을 제외한 예상치 못한 삭제·전역 디자인 변경 없음 확인
- `analysis.js`, 자동분석 로직, TARO·BUY/HOLD/SELL 계산 변경 없음 확인
- 보안 문자열과 내부 prompt가 발행 HTML에 없는지 검색
- Workflow 자동 생성·커밋 경로와 수동 정밀분석 절차가 같은 명령을 사용하는지 확인

