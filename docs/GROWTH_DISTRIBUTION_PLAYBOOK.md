# GAEO 콘텐츠 배포 플레이북

이 문서는 수동 편집·배포 규칙이다. 이 작업에서는 외부 서비스에 자동 게시하지 않는다.

## 채널과 링크

Primary channels:

- Google/Naver organic search
- Threads
- Naver Blog

외부 콘텐츠 링크는 항상 static canonical snapshot을 쓴다. query URL은 외부 홍보 기본 링크로 쓰지 않는다. UTM은 canonical 뒤에 붙이고 head canonical에는 포함하지 않는다.

`utm_source`: `google`, `naver`, `threads`, `naver_blog`, `partner`

`utm_medium`: `organic`, `social`, `referral`

`utm_campaign` 예시: `weekly_2026w36`, `close_2026w36`, `evergreen_beginner_2026q3`

`utm_content`: `<content_type>_<content_id>`, `stock_<code>`, `calculator_<id>`

## 반복 형식

### 1. 이번 주 확인할 시장 일정

- 날짜와 한국 시간
- 이벤트가 바꿀 수 있는 변수
- 확인할 공식 source
- 결과가 나오기 전 확정 표현 금지
- 관련 static lesson/news canonical

### 2. 오늘 달라진 종목 3개

- 기준 시각
- 종목 코드와 바뀐 규칙 기반 신호
- 바뀌지 않은 위험 요소
- 수익 보장 또는 매수 유도 금지
- 관련 static content가 있을 때만 canonical 연결

### 3. 초보자 질문 하나 완전정복

- 질문 한 문장
- 쉬운 답 세 줄
- 숫자 예시 하나
- 흔한 오해와 한계
- evergreen lesson canonical

## Threads 템플릿

```text
[관찰한 변화 한 문장]

왜 달라졌는지 숫자와 근거 2~3개
지금 확정할 수 없는 점 1개

기준: YYYY-MM-DD HH:MM KST
출처: 공식 source 이름

https://gaeoteam.com/snap/<mode>/<id>.html?utm_source=threads&utm_medium=social&utm_campaign=<campaign>&utm_content=<type_id>
```

## Naver Blog 적응 템플릿

```text
제목: 검색 질문을 그대로 쓰되 과장하지 않기

1. 세 줄 요약
2. 용어 설명
3. 공식 source와 기준일
4. GAEO에서 확인한 변화
5. 해석의 한계와 투자 권유 아님 안내
6. 더 자세한 원문 canonical 링크
```

원문 전체를 똑같이 복사하지 않는다. Blog에는 채널 독자를 위한 요약과 추가 맥락을 쓰고, 전체 근거는 canonical 원문으로 연결한다.

## 편집·안전 규칙

- 숫자와 사건에는 실제 source와 기준일을 표시한다.
- 언론 보도는 매체명과 원문 링크, 공시는 DART, 제도는 담당 기관 원문을 우선한다.
- 제목과 본문에 clickbait를 쓰지 않는다.
- 수익 보장, 확정 상승, 무조건 매수/매도 표현을 쓰지 않는다.
- 커뮤니티 자동 spam, 구매 backlink, link scheme을 하지 않는다.
- 광고 클릭을 요청하거나 보상하지 않는다.
- 게시 전 사람이 날짜, source, canonical/UTM, 금지 표현, 오탈자를 검토한다.
- 발행 후 static canonical이 200이고 self canonical인지 한 번 확인한다.

