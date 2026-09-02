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
  "id": 63,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-02",
  "title": "2026년 9월2일 종가, 유가발 확전 공포에 코스피 4%·코스닥 2% 급락",
  "featured": false
 },
 {
  "id": 62,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-01",
  "title": "2026년 9월1일 종가, 코스피만 버틴 날 코스닥은 왜 1.56% 빠졌나",
  "featured": false
 },
 {
  "id": 61,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-31",
  "title": "2026년 8월31일 종가, 지수를 올린 건 회사가 산 자기 주식이었다",
  "featured": false
 },
 {
  "id": 60,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-28",
  "title": "2026년 8월28일 종가, 지수는 1.79% 빠졌는데 왜 종목은 올랐을까",
  "featured": false
 },
 {
  "id": 59,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-27",
  "title": "2026년 8월27일 종가, 엔비디아 훈풍에 코스피·코스닥 동반 상승",
  "featured": false
 },
 {
  "id": 58,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-27",
  "title": "9월 유동성 리스크, 세금·국채·FOMC 몰리는 이유는?",
  "featured": false
 },
 {
  "id": 57,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-27",
  "title": "엔비디아 2분기 실적 매출 133조 원, 가이던스는 얼마나 셌을까",
  "featured": false
 },
 {
  "id": 56,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-26",
  "title": "2026년 8월26일 종가, 건설·원전 급등에 코스피 0.97% 상승, 코스닥은 제자리",
  "featured": false
 },
 {
  "id": 55,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-25",
  "title": "2026년 8월25일 종가, 원전주 랠리에 코스피·코스닥 모처럼 동반 상승",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 63,
 "study": 35,
 "lesson": 82,
 "estate": 19,
 "calc": 14
};
