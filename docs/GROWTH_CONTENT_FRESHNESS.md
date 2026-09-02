# 콘텐츠 신선도 안전 규칙

## 범위

기본 감사 대상은 검색에 노출되는 사람이 쓴 원본 5개다.

- `news_analysis.js`
- `stock_study.js`
- `stock_lessons.js`
- `estate_lessons.js`
- `calculators.js`

자동 종목 snapshot, 생성 HTML, deep-analysis 기록, 내부 문서는 기본 스캔에서 제외한다.

## 실행

사람이 읽는 보고서:

```bash
python3 content_freshness_audit.py
```

JSON:

```bash
python3 content_freshness_audit.py --json
```

현재 브랜치에서 새로 추가하거나 수정한 content id만 차단 대상으로 검사:

```bash
python3 content_freshness_audit.py --strict --base-ref origin/main
```

기본 모드는 후보가 있어도 exit 0인 warning/report다. strict mode는 base ref와 비교해 새로 추가되거나 내용이 바뀐 id의 비인용 후보가 있으면 exit 1이다. 읽기/비교 자체가 실패하면 exit 2다.

## 보고 항목

각 후보는 source file, mode, content id, publication date, field, phrase, surrounding context, age in days, quoted context 여부를 포함한다. “오늘날”의 “오늘”은 상대시점 표현으로 보지 않는다. 인용부호 안 문장은 감사 결과에는 맥락과 함께 남기지만 strict 차단에서 제외한다.

## 편집 규칙

1. 전역 find/replace를 하지 않는다.
2. 제목이나 문장에 `2026년 9월 2일`, `오늘(9/2)`처럼 절대 날짜가 이미 있으면 무조건 바꾸지 않는다.
3. 일반 개념인 “내일을 맞힐 수 없다”, “현재가” 같은 표현은 문맥을 읽는다.
4. 오래된 전망이 지금도 유효한 것처럼 읽히고 절대 날짜가 없다면 그 문장만 수동 편집한다.
5. 출처 인용문은 원문을 왜곡하지 않는다. 필요하면 바깥 문장에 “당시”와 날짜를 추가한다.
6. 수동 변경은 PR과 최종 보고서에 content id, 전/후 표현, 이유를 기록한다.

## snapshot archive 안내

검증된 `LIVE_DATA.date`와 발행일 차이가 30일 이상인 human snapshot은 다음 형식의 보이는 안내를 제목 아래에 렌더링한다.

> 이 글은 YYYY년 MM월 DD일 당시 정보와 자료를 기준으로 작성됐습니다.

runner 현재 시각이 아니라 실제 콘텐츠 날짜와 production data 날짜를 사용하므로 결과가 같은 입력에서 항상 같다. fresh 글에는 안내를 표시하지 않는다. 안내는 과거 원문을 현재 사실로 다시 쓰지 않는다.

