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
  "id": 53,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-07-30",
  "title": "급등락 반복장에서 살아남기: 전조증상 파악하고 매수·매도 타이밍 잡는 법",
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
 "news": 30,
 "study": 35,
 "lesson": 53,
 "estate": 15,
 "calc": 14
};
