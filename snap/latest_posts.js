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
  "id": 28,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "역대급 실적 행진에도 왜 코스피·코스닥은 계속 흔들릴까",
  "featured": false
 },
 {
  "id": 27,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "삼성전자 2분기 확정실적, 영업이익 89.4조로 3분기 연속 역대 최대",
  "featured": false
 },
 {
  "id": 26,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "마이크로소프트 2분기 실적, 애저 43% 성장인데 주가는 왜 잠잠해졌을까",
  "featured": false
 },
 {
  "id": 25,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "새벽 3시 FOMC, 금리는 그대로인데 말투가 매파적이었던 이유",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 28,
 "study": 35,
 "lesson": 53,
 "estate": 15,
 "calc": 14
};
