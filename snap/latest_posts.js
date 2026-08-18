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
 },
 {
  "id": 78,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "동시호가와 VI, 장 시작·마감에 가격이 튀는 이유",
  "featured": false
 },
 {
  "id": 77,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "자사주 매입과 소각, 회사가 제 주식을 사는 이유",
  "featured": false
 },
 {
  "id": 76,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "우선주와 보통주, 같은 회사인데 가격은 왜 다를까",
  "featured": false
 },
 {
  "id": 75,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-18",
  "title": "복리와 72의 법칙, 장기투자가 강력한 진짜 이유",
  "featured": false
 }
];
const CONTENT_STATS = {
 "news": 49,
 "study": 35,
 "lesson": 82,
 "estate": 19,
 "calc": 14
};
