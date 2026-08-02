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
  "id": 63,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-02",
  "title": "기준금리와 주가의 관계: 금통위·FOMC 읽는 법",
  "featured": false
 },
 {
  "id": 62,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-02",
  "title": "레버리지·인버스 ETF, 지수가 원위치해도 내 계좌는 왜 마이너스일까",
  "featured": false
 },
 {
  "id": 61,
  "mode": "lesson",
  "label": "주식공부",
  "date": "2026-08-02",
  "title": "일목균형표·스토캐스틱·OBV 완전정복: 보조지표 심화편",
  "featured": false
 },
 {
  "id": 17,
  "mode": "estate",
  "label": "부동산공부",
  "date": "2026-08-02",
  "title": "생애최초 대출 완전정복",
  "featured": false
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
 }
];
const CONTENT_STATS = {
 "news": 35,
 "study": 35,
 "lesson": 63,
 "estate": 17,
 "calc": 14
};
