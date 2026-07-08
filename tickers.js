// 개오 애널리스트팀 — 대상 종목 단일 소스(Single Source of Truth)
// ★ 종목을 추가/삭제하려면 "이 파일만" 고치면 된다:
//    1) 아래 TICKERS 배열 수정
//    2) 시세갱신.command 실행 → data.js 갱신
//    3) 재분석(Claude Code에게 요청) → analysis.js / history.js 갱신
// update_prices.py(파이썬)와 index.html(브라우저)이 모두 이 목록을 읽는다.
// (배열 부분은 유효한 JSON이라 파이썬도 그대로 파싱한다 — 키를 큰따옴표로 유지할 것)
const TICKERS = [
 {"code":"080220","name":"제주반도체"},
 {"code":"005930","name":"삼성전자"},
 {"code":"000660","name":"SK하이닉스"},
 {"code":"402340","name":"SK스퀘어"},
 {"code":"009150","name":"삼성전기"},
 {"code":"009155","name":"삼성전기우"},
 {"code":"011070","name":"LG이노텍"},
 {"code":"267260","name":"HD현대일렉트릭"}
];
