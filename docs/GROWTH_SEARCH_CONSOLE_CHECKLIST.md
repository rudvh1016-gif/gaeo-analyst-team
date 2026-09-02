# Google Search Console 후속 체크리스트

배포 뒤 사람이 Search Console에서 수행하는 작업이다. Removals 도구는 임시 숨김 수단일 뿐 올바른 `noindex`를 대신하지 않는다.

## 1. URL Inspection 표본

- [ ] `https://gaeoteam.com/snap/news/63.html`: 색인 허용, self canonical 확인
- [ ] `https://gaeoteam.com/snap/lesson/1.html`: 색인 허용, self canonical, 발행일 안내 확인
- [ ] `https://gaeoteam.com/snap/study/34.html`: 색인 허용, self canonical 확인
- [ ] `https://gaeoteam.com/snap/calc/14.html`: 색인 허용, self canonical 확인
- [ ] `https://gaeoteam.com/?m=news&id=63`: Google-selected canonical이 static news snapshot으로 수렴하는지 확인
- [ ] `https://gaeoteam.com/?m=single&code=005930`: 앱 기능은 열리지만 `noindex,follow`와 canonical 없음 확인
- [ ] `https://gaeoteam.com/snap/stock/005930.html`: live test에서 robots.txt로 수집 가능하고 HTML의 `noindex,follow`를 읽는지 확인
- [ ] 대표 deep-analysis permalink: self canonical과 색인 가능 상태 확인

## 2. stock 제외 상태

- [ ] Pages report에서 기존 `/snap/stock/` 표본이 “Excluded by noindex” 또는 같은 의미의 상태로 이동하는지 확인
- [ ] “Blocked by robots.txt”에 `/snap/stock/` 신규 증가가 없는지 확인
- [ ] 기존에 이미 색인된 stock URL 수를 주 1회 기록하고 감소 추세만 관찰
- [ ] human `/snap/news|study|lesson|estate|calc/`가 noindex로 제외되지 않는지 확인

Google은 crawler가 URL에 접근해야 page-level noindex를 읽을 수 있다고 설명한다. [Google Search Central noindex 문서](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

## 3. sitemap

- [ ] `https://gaeoteam.com/sitemap.xml` 재제출
- [ ] 성공적으로 읽은 URL 수가 현재 생성 수와 맞는지 확인
- [ ] query URL과 `/snap/stock/`이 제출된 URL에 없는지 확인
- [ ] lastmod가 콘텐츠 실제 날짜와 맞는 표본 5개 확인
- [ ] invalid date 또는 “매일 모든 정적 페이지가 오늘로 갱신”되는 패턴이 없는지 다음 배포에서도 확인

## 4. 주의사항

- [ ] Removals를 permanent deindex 수단으로 쓰지 않는다.
- [ ] robots.txt로 `/snap/stock/`을 다시 막지 않는다.
- [ ] 제거 속도를 높이려고 human 콘텐츠를 대량 noindex하지 않는다.
- [ ] canonical만으로 앱 전용 URL의 색인 제외를 대신하지 않는다.
- [ ] 상태 변화에는 재수집 시간이 필요하므로 당일 수치만으로 실패를 단정하지 않는다.

