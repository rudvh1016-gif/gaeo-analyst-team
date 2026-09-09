// 개오 성적표 — 정기 공개 보고서 (정적 URL 발행용 데이터)
//
// ## 이게 뭔가
//
// 앱의 성적표 화면은 history.js·analysis_archive.js를 매번 다시 읽어 숫자를 **그때그때
// 계산**한다. 그래서 어제 본 숫자와 오늘 본 숫자가 다르고, 남에게 링크로 보여줄 수도,
// "그때 그렇게 말했다"고 인용할 수도 없다.
//
// 이 파일은 그 반대다. 발행 시점의 숫자를 **동결해서** 영구 주소
// `https://gaeoteam.com/snap/report/<id>.html` 에 박아 둔다. 나중에 데이터가 바뀌어도
// 이 글의 숫자는 안 바뀐다 — 그게 이 파일의 존재 이유다.
//
// ## 철칙
//
// 1. **append-only.** 발행된 항목의 `frozen` 블록을 나중에 고치지 않는다. 숫자가 틀렸으면
//    새 항목을 발행하고 정정 사실을 본문에 적는다(`append_only_guard.py`와 같은 규율).
// 2. **`frozen`의 숫자는 발행 스크립트가 채운다.** 사람이 손으로 적지 않는다 —
//    `publish_scorecard_report.py`가 실제 증거에서 뽑아 넣는다.
// 3. **사전등록 창(docs/PREREGISTRATION_BUY_FILTERS_20260905.md) 안에서는 중간 결과를
//    발행하지 않는다.** 평가 스크립트 자체가 판단일 20일 미만이면 효과 크기를 내주지
//    않도록 막혀 있다(훔쳐보기 방지). 첫 호는 2026-10-19 사전등록 확정 평가다.
//
// ## 스키마
//
//   id       숫자. 1부터. 재사용 금지.
//   title    글 제목. 앞에 "YYYY년 M월D일 기준, " 을 붙인다.
//   date     발행일 YYYY-MM-DD
//   updated  마지막 수정일(본문 오탈자 정정 등). frozen은 못 고친다.
//   tag      고정 "성적표 · 검증 기록"
//   summary  첫 150자가 그대로 읽히게 쓴다(메타 설명으로 잘린다)
//   body     본문. 백틱과 ${} 금지(다른 콘텐츠 파일과 같은 규칙).
//   frozen   발행 시점 동결 숫자 { asOf, source, metrics: {...} }
//   sources  근거 링크/파일 목록
//
// 첫 호는 2026-10-19 예정이라 지금은 비어 있다. 배관(정적 URL·sitemap·SEO 게이트·
// 계약 테스트)은 이미 다 연결돼 있고, 항목을 넣으면 바로 발행된다.
const SCORECARD_REPORTS = [
];

if (typeof module !== 'undefined' && module.exports) module.exports = { SCORECARD_REPORTS };
