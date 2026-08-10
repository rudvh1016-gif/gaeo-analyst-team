const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');

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

assert(
  !html.includes('[분석 시작 ▶]'),
  '현재 화면에 없는 예전 버튼명을 안내하면 안 됩니다.'
);

console.log('guidebook contract passed');
