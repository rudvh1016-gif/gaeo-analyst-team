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
  "id": 32,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "SK하이닉스 목표주가 470만원 vs 148만원, 같은 실적 보고 왜 갈렸을까",
  "featured": false
 },
 {
  "id": 31,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "SK하이닉스 1주가 부른 826억 원 청산 사고, 무슨 일이었을까",
  "featured": false
 },
 {
  "id": 30,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "코스피, 삼성전자 깜짝 실적에 장중 6% 급등했다가 결국 하락 마감한 이유",
  "featured": false
 },
 {
  "id": 29,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-30",
  "title": "삼성전기 2분기 영업이익 107% 급증인데 주가는 왜 11% 넘게 빠졌을까",
  "featured": false
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
 },
 {
  "id": 58,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-07-30",
  "title": "RSI·MACD·볼린저밴드 완전정복: 보조지표 3인방 제대로 읽는 법",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 32,
 "study": 35,
 "lesson": 58,
 "estate": 16,
 "calc": 14
};
