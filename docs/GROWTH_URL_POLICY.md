# GAEO 공개 URL 정책

## 목적

사람이 쓴 콘텐츠 하나에는 검색과 공유에 쓰는 대표 URL 하나만 둔다. 앱 query URL은 기존 사용자의 상호작용 상태를 열기 위한 호환 주소다.

## 대표 URL

| 콘텐츠 | 검색·공유 대표 URL | 앱 호환 URL |
|---|---|---|
| 뉴스분석 | `https://gaeoteam.com/snap/news/<id>.html` | `https://gaeoteam.com/?m=news&id=<id>` |
| 종목공부 | `https://gaeoteam.com/snap/study/<id>.html` | `https://gaeoteam.com/?m=study&id=<id>` |
| 주식공부 | `https://gaeoteam.com/snap/lesson/<id>.html` | `https://gaeoteam.com/?m=lesson&id=<id>` |
| 부동산공부 | `https://gaeoteam.com/snap/estate/<id>.html` | `https://gaeoteam.com/?m=estate&id=<id>` |
| 계산기 | `https://gaeoteam.com/snap/calc/<id>.html` | `https://gaeoteam.com/?m=calc&id=<id>` |
| AI 보조 정밀분석 | 기존 `/research/deep-analysis/.../` permalink | 종목 앱 CTA만 별도 |

`growth_urls.js`가 이 매핑의 단일 코드 소스다. mode는 위 5개만 허용하고 id는 1~6자리 양의 숫자만 허용한다. 잘못된 값은 URL 문자열에 넣지 않고 `null`을 반환한다.

## 색인 신호

- static human snapshot: self canonical, robots meta 없음, sitemap 포함.
- human content query: static snapshot canonical, robots meta 없음, sitemap 제외.
- automatic stock snapshot: self canonical, `noindex,follow`, sitemap 제외, robots.txt 접근 허용.
- `?m=single&code=`와 그 밖의 도구형 앱 query: `noindex,follow`, canonical 없음.
- deep-analysis permalink: self canonical, sitemap 포함.
- invalid content/query route: `noindex,follow`, canonical 없음.

관련 없는 앱 화면을 홈페이지로 canonical 처리하지 않는다. canonical과 noindex를 억지로 함께 써서 어느 신호가 우선인지 검색엔진에 맡기지 않는다. [Google의 canonical 통합 안내](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)에 따라 sitemap, 내부 링크, head 신호를 같은 대표 URL에 맞춘다.

## 링크 용도

- share, copy link, Threads/Naver Blog 홍보, RSS item, crawlable related-content는 static canonical URL을 쓴다.
- static snapshot의 “인터랙티브 화면에서 이 글 보기” CTA만 query URL을 쓸 수 있고 `rel=nofollow`를 유지한다.
- deep-analysis에서 종목 앱으로 이동하는 CTA도 앱 기능 링크이므로 query URL을 유지한다.
- 기존 query deep link는 redirect하거나 삭제하지 않는다. 앱의 원래 mode, id, code 상태를 계속 연다.

## UTM 규칙

UTM은 대표 URL 뒤에 붙인다. canonical 자체에는 UTM을 포함하지 않는다. 허용 키는 `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` 네 개다. 값은 80자 이하의 문자, 숫자, `_`, `-`만 사용한다.

예시:

`https://gaeoteam.com/snap/news/63.html?utm_source=threads&utm_medium=social&utm_campaign=weekly_2026w36&utm_content=news_63`

앱 head와 공유 helper는 UTM을 제거한 대표 URL을 canonical/share 기본값으로 사용한다.

## 변경 절차

URL 형식을 바꿔야 할 때는 `growth_urls.js`와 테스트를 먼저 바꾼 뒤 snapshot, RSS, sitemap을 재생성한다. 파일별 문자열 조합을 새로 추가하지 않는다.

