// 📖 가이드북 계약 테스트 (요구 40번)
//
// 지키는 것:
//   - 12개 섹션이 정해진 순서대로 있는가
//   - 현재 서비스 규모가 낡은 숫자로 굳어 있지 않은가 (500 → 동적)
//   - 화면에 없는 예전 버튼명을 안내하지 않는가
//   - 사용자 화면에 개발자 용어(Proxy·PAPER_EXACT 등)가 노출되지 않는가
//   - 순환매 안내의 필수 문구가 그대로 남아 있는가
//   - DART의 한계를 정확히 설명하는가 (공시 없음 ≠ 뉴스 없음)
//   - 자동승격이 없다고 설명하는가
const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');

// ── 1. 12개 섹션 순서 ────────────────────────────────────────────────────────
const ORDER = [
  ['01', 'GAEO가 무엇인가요?'],
  ['02', '데이터는 언제 업데이트되나요?'],
  ['03', '분석가들은 무엇을 하나요?'],
  ['04', '최종 판단은 어떻게 읽나요?'],
  ['05', 'DART 공시는 어떻게 쓰나요?'],
  ['06', '순환매와 업종 흐름은 무엇인가요?'],
  ['07', '성적표는 어떻게 보나요?'],
  ['08', '모델 실험실은 무엇인가요?'],
  ['09', '판단 확신도와 정확도는 어떻게 다른가요?'],
  ['10', '데이터가 부족하면 어떻게 되나요?'],
  ['11', '실제로 이 순서대로 써보세요'],
  ['12', '꼭 알아두실 점'],
];
let cursor = 0;
ORDER.forEach(([num, title]) => {
  const marker = `<span class="gb-num">${num}</span><span class="gb-t">${title}`;
  const at = html.indexOf(marker);
  assert(at !== -1, `가이드북 섹션 누락: ${num} ${title}`);
  assert(at > cursor, `가이드북 섹션 순서가 어긋남: ${num} ${title}`);
  cursor = at;
});

// ── 2. 순환매 안내 필수 문구 (기존 계약 유지) ────────────────────────────────
assert(
  html.includes('2026년 8월 10일 시행'),
  '가이드북에 순환매 시행일이 표시되어야 합니다.'
);
assert(
  /<details class="gb-sec gb-rotation-guide" id="gb-sec-rotation" open>/.test(html),
  '순환매 가이드는 찾기 쉽도록 펼친 상태여야 합니다.'
);
[
  '순환매란 무엇인가요?',
  '예측 화면이 아닙니다',
  '1일·3일·5일·20일',
  '60일·120일·200일',
  '업종 순환 지도',
  '5거래일 업종 순위',
  '선행 흐름',
  '과거 유사 국면',
  '매수·매도 추천이 아닙니다',
  '새로고침',
  '분석 보기'
].forEach(text => assert(html.includes(text), `가이드북 필수 문구 누락: ${text}`));

// ── 3. 일곱 가지 역할 ────────────────────────────────────────────────────────
['TARO', 'DIANA', 'QUANT', 'FLOW', 'RISK', 'ROTATION', 'CHIEF'].forEach(role => {
  assert(html.includes(`<b>${role} ·`), `가이드북 역할 소개 누락: ${role}`);
});
assert(
  !html.includes('여섯 역할'),
  'ROTATION을 포함해 일곱 역할이므로 "여섯 역할"이라고 쓰면 안 됩니다.'
);

// ── 4. DART 한계 ─────────────────────────────────────────────────────────────
assert(html.includes('공시가 없다 ≠ 뉴스가 없다'), 'DART 한계 설명 누락');
assert(html.includes('DART는 점수를 바꾸지 않아요'),
  'DART가 실제로 점수에 쓰이지 않는다는 사실을 정확히 밝혀야 합니다.');

// ── 5. 모델 실험실 · 자동승격 없음 ───────────────────────────────────────────
['연구모델 A', '연구모델 B', '연구모델 C', '구형 그림자모델'].forEach(name => {
  assert(html.includes(name), `모델 실험실 설명 누락: ${name}`);
});
assert(
  html.includes('실제 서비스가 자동으로 바뀌지 않아요'),
  '자동승격이 없다는 설명이 있어야 합니다.'
);
assert(
  !/사용자 화면[^]{0,200}Legacy 모델/.test(html),
  '사용자 화면에 "Legacy 모델"이라는 이름을 쓰지 않습니다.'
);

// ── 6. 판단 보류 · 신뢰도 vs 정확도 ──────────────────────────────────────────
assert(html.includes('판단 보류'), '판단 보류 설명 누락');
assert(html.includes('판단 확신도가 높다고 해서 이번에 맞는다는 뜻이'),
  '판단 확신도와 정확도의 차이를 설명해야 합니다.');

// ── 7. 낡은 문구가 다시 생기지 않았는지 ──────────────────────────────────────
assert(
  !html.includes('[분석 시작 ▶]'),
  '현재 화면에 없는 예전 버튼명을 안내하면 안 됩니다.'
);
// 현재 서비스 규모는 tickers.js 하나에서만 가져온다.
assert(
  html.includes('const COVERAGE_N=') && html.includes('const COVERAGE_TXT='),
  '분석 종목 수는 COVERAGE_N/COVERAGE_TXT 단일 원천을 써야 합니다.'
);
const guideStart = html.indexOf('function renderGuide()');
const guideEnd = html.indexOf('// tickers.js 배열 순서 그대로', guideStart);
const guideSrc = html.slice(guideStart, guideEnd > 0 ? guideEnd : guideStart + 40000);
assert(
  !/500종목|500개 종목/.test(guideSrc),
  '가이드북에 현재 서비스 규모가 "500종목"으로 굳어 있으면 안 됩니다.'
);

// ── 8. 사용자 화면에 개발자 용어 노출 금지 (요구 6·64-E번) ───────────────────
['PAPER_EXACT', 'GAEO_PROXY', 'CASH_FLOW_PROXY', 'NOT_READY',
 'POTENTIALLY_AVAILABLE', 'JUDGMENT_WITHHELD', 'EVENT_COVERAGE_INCOMPLETE',
 'research_v1.0', 'research_v1.1', 'research_v2.0', 'calibrated-ensemble-v3',
 'PROMOTION_REVIEW_AVAILABLE'].forEach(term => {
  assert(!guideSrc.includes(term), `가이드북에 개발자 용어가 노출됨: ${term}`);
});

// ── 9. 투자 권유 아님 ────────────────────────────────────────────────────────
assert(html.includes('수익을 <b>보장하지 않아요.</b>'), '수익 보장 부인 문구 누락');
assert(html.includes('최종 판단과 책임은 투자하시는 본인에게 있어요'),
  '최종 책임 안내 문구 누락');

console.log('guidebook contract passed — 12개 섹션 순서 · 7역할 · DART 한계 · 자동승격 없음 · 개발용어 미노출');
