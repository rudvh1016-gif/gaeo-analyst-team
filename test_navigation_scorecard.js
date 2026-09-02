const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} 함수가 있어야 합니다.`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i += 1) {
    if (html[i] === '{') depth += 1;
    if (html[i] === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  throw new Error(`${name} 함수 끝을 찾지 못했습니다.`);
}

function runFunction(name, args) {
  const context = { args, result: null };
  vm.createContext(context);
  vm.runInContext(`${extractFunction(name)}; result=${name}(...args);`, context);
  return JSON.parse(JSON.stringify(context.result));
}

// A legacy link must open the single, unified scorecard view.
assert.equal(runFunction('normalizeGaeoMode', ['leaderboard']), 'scorecard');
assert.equal(runFunction('normalizeGaeoMode', ['scorecard']), 'scorecard');

// The analyst ranking must use the verified aggregate, retain sample counts,
// and sort by accuracy before sample size.
const teamWeights = {
  global: {
    weights: { taro: 0.27, diana: 0.09, nova: 0.33, flow: 0.31 },
    acc: {
      taro: { n: 9035, acc: 52.5 },
      diana: { n: 2418, acc: 45.8 },
      nova: { n: 8041, acc: 61.6 },
      flow: { n: 1605, acc: 56.4 },
    },
  },
};
const agents = [
  { id: 'taro', name: 'TARO', role: '기술적 분석가', color: '#22d3ee' },
  { id: 'diana', name: 'DIANA', role: '재무 분석가', color: '#a78bfa' },
  { id: 'nova', name: 'QUANT', role: '확률 분석가', color: '#fb923c' },
  { id: 'flow', name: 'FLOW', role: '수급 분석가', color: '#34d399' },
];
const rows = runFunction('scorecardAnalystRows', [teamWeights, agents]);
assert.deepEqual(rows.map(row => row.id), ['nova', 'flow', 'taro', 'diana']);
assert.deepEqual(rows.map(row => row.n), [8041, 1605, 9035, 2418]);
assert.deepEqual(rows.map(row => row.acc), [61.6, 56.4, 52.5, 45.8]);

const scorecardMetrics = runFunction('scorecardMetrics', [[
  { code: 'A', verdict: 'hit' },
  { code: 'A', verdict: 'miss' },
  { code: 'B', verdict: 'mid' },
  { code: 'C', verdict: 'miss' },
]]);
// withheldN: 판단 보류(JUDGMENT_WITHHELD)는 채점 분모에서 빠지고 별도 카운트로만
// 집계된다(2026-08-15 기본모델 구조 수정). 이 픽스처에는 보류 건이 없으므로 0.
assert.deepEqual(scorecardMetrics, {
  total: 4, hitN: 1, missN: 2, midN: 1, withheldN: 0, uniqueN: 3, uniqueMissN: 2, acc: 33,
});
assert.match(html, /최근 7개 달력일/);
assert.match(html, /적중률 = 적중/);
assert.match(html, /고유 종목/);
assert.match(html, /모델 버전별/);

// The refresh control is placed between search and profile and carries the
// approved always-visible notice.
const searchAt = html.indexOf('id="navSearchToggle"');
const refreshAt = html.indexOf('id="navRefresh"');
const profileAt = html.indexOf('id="navProfileToggle"');
assert.ok(searchAt >= 0 && searchAt < refreshAt && refreshAt < profileAt);
assert.match(html, /id="refreshNotice"/);
assert.ok(html.includes('주가는 장중 약 10분마다, 자동 분석은 약 30분마다 갱신됩니다. 꼭 자주 새로고침을 진행해주세요!'));
assert.match(html, /window\.location\.reload\(\)/);

// Navigation is consolidated and weekday statistics live in their own view.
assert.match(html, /data-nav-mode="scorecard">성적표<\/button>/);
assert.doesNotMatch(html, /id="mode-leaderboard"/);
assert.match(html, /id="mode-rates"[^>]*>[\s\S]*?등락률 확인<\/button>/);
assert.match(html, /id="rateView"[\s\S]*?id="dowbar"/);
assert.equal((html.match(/id="dowbar"/g) || []).length, 1);

// Decorative emoji are removed while both market labels use the KR prefix.
assert.match(html, /KOSPI:\{label:'KR 코스피'\}/);
assert.match(html, /KOSDAQ:\{label:'KR 코스닥'\}/);
assert.doesNotMatch(html, /idx-panels-head">📈/);

console.log('navigation and scorecard tests passed');
