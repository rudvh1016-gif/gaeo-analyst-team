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
  "id": 60,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-01",
  "title": "공매도가 있어야 주가가 오른다는 말, 진짜일까: 장단점 쉽게 정리",
  "featured": false
 },
 {
  "id": 59,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-01",
  "title": "IPO(기업공개)가 뭐길래: 오픈AI·앤트로픽은 상장하려 하고, SK하이닉스는 왜 미국에도 상장했을까",
  "featured": false
 },
 {
  "id": 35,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-31",
  "title": "2026년 7월31일 종가, 코스피 하루 만에 17.91% 폭등한 이유와 7월 총정리",
  "featured": false
 },
 {
  "id": 34,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-31",
  "title": "호텔신라 2분기 영업이익 606% 급증, 밑지던 면세점이 흑자로 돌아선 이유",
  "featured": false
 },
 {
  "id": 33,
  "mode": "news",
  "label": "뉴스분석",
  "date": "2026-07-31",
  "title": "애플 팀 쿡의 마지막 실적발표, 역대급 매출에도 주가가 급락한 이유",
  "featured": false
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
 }
];
const CONTENT_STATS = {
 "news": 35,
 "study": 35,
 "lesson": 60,
 "estate": 16,
 "calc": 14
};
