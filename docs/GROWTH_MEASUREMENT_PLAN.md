# GAEO 제품 분석 측정 계획

## 목표

North-star metric은 **주간 근거 확인 완료 사용자**다. 한 주 안에 다음 행동 중 하나 이상을 완료한 익명 사용자가 해당한다.

- `evidence_expand`
- `source_click`
- `calculator_complete`
- `watchlist_add`
- `share_generate`

GA4 export에서 가능한 경우 pseudonymous user 기준으로 주간 unique를 계산한다. export가 없으면 숫자를 추정하지 않는다.

## 구현된 이벤트

| 이벤트 | 의미 | 주요 안전 파라미터 |
|---|---|---|
| `landing_view` | 페이지 첫 진입 | page_type, content_type/id, referrer_group, UTM |
| `stock_search_submit` | 유효한 종목으로 검색 실행 | stock_code, page_type |
| `stock_analysis_open` | 종목 분석 화면 열기 | stock_code, page_type |
| `evidence_expand` | 분석 근거 details 최초 펼침 | route 공통 파라미터 |
| `source_click` | 콘텐츠 출처 링크 클릭 | route 공통 파라미터 |
| `watchlist_add` | 관심종목 추가 | stock_code, page_type |
| `calculator_start` | 계산기 열기 | calculator_id, content_type/id |
| `calculator_complete` | 유효/오류 결과를 렌더링하는 계산 실행 | calculator_id, content_type/id |
| `content_to_product_click` | snapshot CTA로 앱 콘텐츠 진입 | content_type/id, entry_cluster |
| `share_generate` | native share 완료 또는 copy 성공 | method, route 공통 파라미터 |
| `return_visit` | 같은 브라우저의 후속 방문 | route 공통 파라미터 |
| `stale_data_warning_seen` | stale warning 노출 | page_type, data_age_bucket |

`product_analytics.js`의 allowlist 밖 이벤트와 파라미터는 전송하지 않는다. undefined를 제거하고 PII-like key가 하나라도 있으면 이벤트 전체를 거부한다. 이름, 이메일, 전화번호, 주소, IP, 자유 검색어, 종목명, 계산기의 연봉·원금·금액, token/secret은 보내지 않는다. stock은 공개 6자리 코드만 보낸다.

## 동의와 장애

- 기존 GA loader와 measurement ID를 한 번만 재사용한다.
- 기본 배포는 기존 분석 상태를 보존한다.
- `window.GAEO_ANALYTICS_CONSENT_REQUIRED === true`인 배포에서는 초기 analytics storage를 denied로 두고 `gaeoSetAnalyticsConsent('granted')` 전에는 이벤트를 보내지 않는다.
- 사용자가 명시적으로 denied를 저장한 경우 GA consent default와 wrapper를 모두 denied로 둔다.
- analytics script/gtag가 막히면 wrapper는 false를 반환하고 UI 기능은 계속 동작한다.
- dedupe key가 같은 논리 이벤트는 한 번만 전송한다.

Google Analytics에 PII를 보내지 않는 정책은 [Google Analytics PII 안내](https://support.google.com/analytics/answer/6366371?hl=en)를 따르고, consent 상태 전달은 [Google consent mode reference](https://support.google.com/analytics/answer/13802165)를 기준으로 한다.

## 지원 지표

| 지표 | 계산 | 현재 상태 |
|---|---|---|
| canonical organic landing sessions | organic referrer의 static content landing session | 이벤트 구현, GA4/Search Console export 필요 |
| landing-to-stock-search activation | stock_search_submit users / landing users | 이벤트 구현, export 필요 |
| evidence expansion rate | evidence_expand users / stock_analysis_open users | 이벤트 구현, export 필요 |
| source click rate | source_click users / content landing users | 이벤트 구현, export 필요 |
| content-to-product rate | content_to_product_click users / content snapshot landing users | 이벤트 구현, export 필요 |
| calculator completion rate | calculator_complete users / calculator_start users | 이벤트 구현, export 필요 |
| watchlist add rate | watchlist_add users / stock_analysis_open users | 이벤트 구현, export 필요 |
| share rate | share_generate users / landing users | 이벤트 구현, export 필요 |
| 7-day return | 첫 관측 뒤 7일 창 내 return_visit | 이벤트는 구현, 정확한 cohort query 필요 |
| 28-day return | 첫 관측 뒤 28일 창 내 return_visit | 이벤트는 구현, 정확한 cohort query 필요 |
| stale-data exposure | stale warning users / landing users | 이벤트 구현, export 필요 |
| error exposure | 오류 사용자 / landing users | 아직 이벤트 없음, future hypothesis |

## 측정과 가설 구분

- measured foundation: 위 이벤트가 consent와 데이터 최소화 계약 안에서 발생할 수 있다.
- unavailable data: 이 작업에는 GA4 raw export, Search Console performance export, Naver Search Advisor export가 없다. traffic, conversion, rank 수치를 만들지 않는다.
- future hypotheses: 근거 펼침 사용자가 더 자주 돌아오는지, snapshot 유입이 종목 검색으로 이어지는지, stale warning이 행동을 줄이는지는 데이터가 쌓인 뒤 검증한다.
- 기존 `gaeo-data-analyst`는 forecast와 paper-performance 분석 책임을 유지한다. acquisition, activation, retention, content-to-product, campaign, analytics quality는 `gaeo-product-analytics` 책임이다.

