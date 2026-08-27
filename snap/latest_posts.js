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
 },
 {
  "id": 54,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-24",
  "title": "2026년 8월24일 종가, 삼성전자 8.7% 급락에도 429종목은 올랐다",
  "featured": false
 },
 {
  "id": 53,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-21",
  "title": "2026년 8월21일 종가, 코스피 오르고 코스닥 사이드카, 494종목 하락",
  "featured": false
 },
 {
  "id": 52,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-20",
  "title": "2026년 8월20일 종가, 코스피 5.89% 반등시킨 SK하이닉스 40조 자사주 소각",
  "featured": false
 },
 {
  "id": 51,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-19",
  "title": "2026년 8월19일 종가, 코스피 5.8% 급락하고 24개 업종이 전부 내렸다",
  "featured": false
 },
 {
  "id": 50,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-19",
  "title": "외국인은 아직 안 팔았다, 코스피 7주 수급 데이터 해부",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 58,
 "study": 35,
 "lesson": 82,
 "estate": 19,
 "calc": 14
};
