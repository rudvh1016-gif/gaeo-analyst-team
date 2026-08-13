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
  "id": 46,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-13",
  "title": "2026년 8월13일 종가, 코스피 4일째 상승했지만 반은 여전히 빨간불",
  "featured": false
 },
 {
  "id": 45,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-12",
  "title": "2026년 8월12일 종가, 코스피 3.68% 급등했는데 상승 종목은 더 적었던 이유",
  "featured": false
 },
 {
  "id": 44,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-11",
  "title": "2026년 8월11일 종가, 삼성전자 반등과 방산 급락이 갈린 날",
  "featured": false
 },
 {
  "id": 43,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-10",
  "title": "2026년 8월10일 종가, 삼성전자는 잠잠한데 코스닥은 왜 7% 뛰었나",
  "featured": false
 },
 {
  "id": 42,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-07",
  "title": "2026년 8월7일 종가, 어제 급락 딛고 낙폭 줄인 코스피·코스닥",
  "featured": false
 },
 {
  "id": 41,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-08-06",
  "title": "2026년 8월6일 종가, 반도체 두 종목에 코스피 -4.58% 흔들린 날",
  "featured": false
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
 }
];
const CONTENT_STATS = {
 "news": 46,
 "study": 35,
 "lesson": 72,
 "estate": 19,
 "calc": 14
};
