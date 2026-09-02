const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();
const sectionStart = html.indexOf('/* ---------- 요일별 평균 등락률 (2026) ----------');
assert.notEqual(sectionStart, -1, '요일별 등락률 렌더링 영역이 있어야 합니다.');

const scriptStart = html.indexOf('(function(){', sectionStart);
const scriptEnd = html.indexOf('\n})();', scriptStart);
assert.notEqual(scriptStart, -1, '요일별 등락률 렌더링 함수가 있어야 합니다.');
assert.notEqual(scriptEnd, -1, '요일별 등락률 렌더링 함수 끝이 있어야 합니다.');

const element = { innerHTML: '', style: { display: 'none' } };
const context = {
  document: {
    getElementById(id) {
      return id === 'dowbar' ? element : null;
    },
  },
  DOW_STATS: {
    from: '2026-01-02',
    to: '2026-08-10',
    days: 150,
    universe: 500,
    dow: {
      1: { avg: 0.21, n: 30 },
      2: { avg: -0.11, n: 30 },
      3: { avg: 0.08, n: 30 },
      4: { avg: 0.04, n: 30 },
      5: { avg: -0.06, n: 30 },
    },
  },
};

vm.createContext(context);
vm.runInContext(html.slice(scriptStart, scriptEnd + '\n})();'.length), context);

assert.equal(element.style.display, '', '요일별 등락률 영역이 표시되어야 합니다.');
assert.match(element.innerHTML, /class="dow-grid"/, '요일별 통계 표가 바로 렌더링되어야 합니다.');
assert.doesNotMatch(element.innerHTML, /<details\b/, '요일별 등락률은 details에 접히지 않아야 합니다.');
assert.doesNotMatch(element.innerHTML, /<summary\b/, '요일별 등락률은 접기 버튼을 만들지 않아야 합니다.');

// 시가총액 상위 10위는 홈의 시장 분석이 아니라 등락률 확인 안에서 항상 펼쳐 보인다.
assert.match(html, /id="rateView"[\s\S]*?id="dowbar"[\s\S]*?id="capTop10"/, '등락률 확인 안에 시가총액 상위 10위 영역이 있어야 합니다.');
const capFunction = html.match(/function renderCapTop10\(\)\{[\s\S]*?\n\}/);
assert.ok(capFunction, '시가총액 상위 10위를 렌더링하는 함수가 있어야 합니다.');
const capElement = { innerHTML: '', querySelectorAll() { return []; } };
const capContext = {
  document: { getElementById(id) { return id === 'capTop10' ? capElement : null; } },
  rankCls(index) { return index === 0 ? ' rank1' : ''; },
  CAP_TOP10: Array.from({ length: 10 }, (_, index) => ({ name: `종목${index + 1}`, capStr: `${10 - index}조` })),
};
vm.createContext(capContext);
vm.runInContext(`${capFunction[0]}; renderCapTop10();`, capContext);
assert.match(capElement.innerHTML, /시가총액 상위 10위/);
assert.equal((capElement.innerHTML.match(/data-cap-stock/g) || []).length, 10, '10개 종목을 기본으로 모두 보여야 합니다.');
assert.doesNotMatch(capElement.innerHTML, /<details\b|<summary\b/, '시가총액 상위 10위는 접히면 안 됩니다.');

console.log('weekday rates expanded test passed');
