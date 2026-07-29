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
 }
];
const CONTENT_STATS = {
 "news": 26,
 "study": 35,
 "lesson": 52,
 "estate": 15,
 "calc": 14
};
