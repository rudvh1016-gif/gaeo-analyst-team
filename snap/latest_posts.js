// generate_snapshots.js가 자동 생성하는 첫 화면 최신 글 5개 목록과 콘텐츠 수
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
  "id": 24,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-29",
  "title": "코카콜라 2분기 실적 서프라이즈로 사상 최고가 — 반도체 폭락장에 홀로 오르는 이유",
  "featured": false
 },
 {
  "id": 23,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-29",
  "title": "2026년 7월29일 종가 코스피·코스닥 분석 — 이틀 연속 시장 안정장치, 반등은 왜 실패했나",
  "featured": false
 },
 {
  "id": 22,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-29",
  "title": "새벽엔 파월 대신 워시, 아침엔 삼성전자 — 7월 30일 하루에 다 몰린 이유",
  "featured": false
 },
 {
  "id": 21,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-29",
  "title": "SK하이닉스 2분기 영업이익 60.5조 '역대 최대'인데 컨센서스는 못 넘겼다 — 어제 폭락 이후 반등까지",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 24,
 "study": 35,
 "lesson": 52,
 "estate": 15,
 "calc": 14
};
