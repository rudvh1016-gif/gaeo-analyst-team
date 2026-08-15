# GAEO 공개 콘텐츠 SEO 발행 규칙 (2026-08-16 제정)

AdSense 2차 심사 "Low value content" 거절 대응으로 만든 **글 단위 경량 규칙**이다.
사이트 전체 SEO 감사를 글 올릴 때마다 반복하자는 게 아니다 — 새 발행물 한 편이
지켜야 할 최소 계약만 확인한다.

## 적용 대상

시장분석 · 정밀분석(Deep Analysis) · 뉴스분석 · 종목공부 · 주식공부 · 부동산공부 ·
분석 방법론 등 **공개 Publisher Content를 만들거나 고칠 때**.

주가 업데이트, 자동분석 사이클, 시세 스냅샷 갱신에는 적용하지 않는다
(그때마다 전체 감사를 돌리지 않는다).

## 발행 전 체크리스트

- [ ] 읽을 가치가 있는 실제 내용인가? (광고 승인용 filler가 아닌가)
- [ ] 고유 제목인가? (다른 글과 겹치지 않는가)
- [ ] 의미 있는 H1이 정확히 1개 있는가?
- [ ] meta description이 실제 내용과 맞는가?
- [ ] canonical이 자기 자신을 가리키는가?
- [ ] Google이 따라갈 실제 `<a href>` 내부링크가 있는가?
- [ ] 관련 GAEO 콘텐츠와 연결되는가?
- [ ] "분석 중 / Loading / undefined" 같은 placeholder가 남지 않았는가?
- [ ] 같은 글이 여러 URL로 중복 발행되지 않았는가?
- [ ] 인용·수치에 필요한 출처가 있는가?
- [ ] sitemap에 반영되는가? (noindex 페이지는 sitemap 금지 — 모순)

## 기계 검사 — `seo_publish_gate.py`

위 체크리스트 중 기계로 걸 수 있는 항목은 전부 자동화돼 있다:

```
python3 seo_publish_gate.py      # 저장소 전체 발행물 검사 (exit 0/1)
python3 test_seo_publishing.py   # 게이트 자체 계약 테스트 + 발행 시뮬레이션
```

검사 범위: `snap/{news,study,lesson,estate,calc}/*.html` ·
`snap/stock/*.html`(noindex 계약) · `research/deep-analysis/**` ·
`sitemap.xml` · `robots.txt` · `ads.txt` · `index.html` 머리말
(정적 "분석 범위 N종목" 폴백 ↔ `tickers.js` 개수 동기화 포함).

**검사 실패 시 절대 하지 말 것**: 자동으로 내용을 채워 넣기(filler),
글자 수 늘리려 무의미한 문장 붙이기, noindex로 도망가기.
발행을 보류하고 내용을 사람이 고친다.

## 원칙 (Google 공식 문서 기준)

1. **AdSense를 속이지 않는다.** filler 대량생성, 종목명만 바꾼 동일 글,
   가짜 작성자/전문가, keyword stuffing, cloaking 전부 금지.
2. **모든 URL을 색인하지 않는다.** 자동 종목 페이지(`snap/stock/`)는
   noindex + robots 차단 + sitemap 제외를 유지한다. 발행 글(뉴스분석·공부·
   정밀분석)은 반대로 **절대 noindex를 걸지 않는다**.
3. **크롤러에게 별도 콘텐츠를 제공하지 않는다.** 사용자와 크롤러는 같은 것을 본다.
4. **역사 기록은 고치지 않는다.** 과거 글 속 "500종목" 같은 당시 사실은 그대로 둔다.
   현재를 설명하는 문구만 현재 숫자로 유지한다.
5. 새 글은 반드시 정적 스냅샷(`generate_snapshots.js`)과 sitemap
   (`generate_sitemap.js`)에 태워 발행한다 — 새 발행 시스템을 만들지 않는다.

## 파이프라인 연결

- `update-analysis.yml`이 스냅샷·sitemap 생성 직후 `seo_publish_gate.py`를
  **advisory**(경고만)로 실행한다 — 게이트 오류가 시세 파이프라인을 멈추지 않게 한다.
- 커밋 전 차단 검사는 `test_seo_publishing.py`가 맡는다(테스트 스위트의 일부).
