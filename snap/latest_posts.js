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
  "id": 70,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-11",
  "title": "2026년 9월11일 종가, 유가·금리 겹악재에 코스피 1.76%·코스닥 1.95% 급락",
  "featured": false
 },
 {
  "id": 69,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-10",
  "title": "2026년 9월10일 종가, 네 마녀의 날 외국인 2.7조 팔아도 7000선은 지켰다",
  "featured": false
 },
 {
  "id": 68,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-09",
  "title": "2026년 9월9일 종가, 33거래일 만에 7000선 회복, 기관이 9005억 샀다",
  "featured": false
 },
 {
  "id": 67,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-08",
  "title": "2026년 9월8일 종가, 장중 7171까지 갔다가 반납, 4곳 중 3곳이 내렸다",
  "featured": false
 },
 {
  "id": 66,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-07",
  "title": "2026년 9월7일 종가, 코스피 4.61% 급등했는데 왜 내 종목은 조용했나",
  "featured": false
 },
 {
  "id": 65,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-04",
  "title": "2026년 9월4일 종가, 로봇·반도체가 이끈 코스피 1.64%·코스닥 2.95% 랠리",
  "featured": false
 },
 {
  "id": 64,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-09-03",
  "title": "2026년 9월3일 종가, 자사주가 떠받친 코스피 0.26% 반등, 코스닥은 800 반납",
  "featured": false
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
 }
];
const CONTENT_STATS = {
 "news": 70,
 "study": 35,
 "lesson": 82,
 "estate": 19,
 "calc": 14
};
