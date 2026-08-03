// generate_snapshots.js가 자동 생성하는 최신 글 10개 목록과 콘텐츠 수
// (히어로의 "최근 뉴스, 공부 자료 확인하기" 패널이 10개를 세로로 펼쳐 쓰고,
//  "지금 많이 보는 글"은 이 중 앞 5개만 골라 쓴다)
const LATEST_POSTS = [
 {
  "id": 35,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-07-28",
  "title": "폭락장에서 살아남는 법 — 오늘 같은 날 마음을 다잡는 주식 격언들",
  "featured": true
 },
 {
  "id": 36,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-03",
  "title": "2026년 8월3일 종가, 코스피 5% 빠졌는데 코스닥은 나홀로 강세인 이유",
  "featured": false
 },
 {
  "id": 71,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "포트폴리오 만드는 법: 초보자 자산배분 실전 가이드",
  "featured": false
 },
 {
  "id": 70,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "상장폐지 완전정복: 거래정지부터 정리매매까지",
  "featured": false
 },
 {
  "id": 69,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "국내주식 세금: 매매·배당·대주주 과세 한 번에 정리",
  "featured": false
 },
 {
  "id": 68,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "DART 공시 보는 법: 10분 기업 점검 순서",
  "featured": false
 },
 {
  "id": 67,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "재무제표 보는 법: 손익·재무상태·현금흐름 연결하기",
  "featured": false
 },
 {
  "id": 66,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "S&P500 vs 나스닥100: 초보자를 위한 완전 비교",
  "featured": false
 },
 {
  "id": 65,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "주식 주문 넣는 법: 시장가·지정가부터 체결까지",
  "featured": false
 },
 {
  "id": 64,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-03",
  "title": "미국주식 사는 법: 계좌 개설부터 첫 매수까지",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 36,
 "study": 35,
 "lesson": 71,
 "estate": 19,
 "calc": 14
};
