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
 },
 {
  "id": 49,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-18",
  "title": "2026년 8월18일 종가, 코스피 오전 강세 반납하고 코스닥은 3.5% 급락",
  "featured": false
 },
 {
  "id": 82,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "공모주 락업이 뭐길래, 만기 되면 주가가 흔들릴까",
  "featured": false
 },
 {
  "id": 81,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "시간외 거래, 정규장 끝나고도 주식을 살 수 있다고",
  "featured": false
 },
 {
  "id": 80,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "인적분할과 물적분할, 왜 물적분할에 주가가 빠질까",
  "featured": false
 },
 {
  "id": 79,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "물타기와 불타기, 평단가 관리는 정말 좋은 전략일까",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 53,
 "study": 35,
 "lesson": 82,
 "estate": 19,
 "calc": 14
};
