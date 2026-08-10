const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
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

console.log('weekday rates expanded test passed');
