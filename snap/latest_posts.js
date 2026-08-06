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
  "id": 40,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-06",
  "title": "SK하이닉스 1주 하한가, NXT 프리마켓은 왜 자꾸 흔들릴까?",
  "featured": false
 },
 {
  "id": 39,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-05",
  "title": "2026년 8월5일 종가, 외국인 컴백에 코스피 6600 코앞",
  "featured": false
 },
 {
  "id": 38,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-04",
  "title": "2026년 8월4일 종가, 반도체 대신 바이오·방산·통신이 오른 날",
  "featured": false
 },
 {
  "id": 37,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-04",
  "title": "한국판 IRA 국내생산세액공제, 반도체·2차전지엔 뭐가 달라지나",
  "featured": false
 },
 {
  "id": 72,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-04",
  "title": "생산적금융 ISA 신설, 이자·배당 전액 비과세 뭐가 달라지나",
  "featured": false
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
 }
];
const CONTENT_STATS = {
 "news": 40,
 "study": 35,
 "lesson": 72,
 "estate": 19,
 "calc": 14
};
