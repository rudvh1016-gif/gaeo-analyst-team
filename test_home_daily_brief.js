const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < html.length; i += 1) {
    if (html[i] === '{') depth += 1;
    if (html[i] === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(start, i + 1);
    }
  }
  throw new Error(`${name} body is incomplete`);
}

function runFunction(name, args) {
  const context = { args, result: null };
  vm.createContext(context);
  vm.runInContext(`${extractFunction(name)}; result=${name}(...args);`, context);
  return JSON.parse(JSON.stringify(context.result));
}

const tally = {
  counts: { BUY: 5, HOLD: 9, SELL: 2 },
  total: 16,
  asOf: '2026-08-13 15:23',
  buy: [
    { code: 'A', name: 'Alpha', total: 82, call: 'BUY' },
    { code: 'B', name: 'Beta', total: 80, call: 'BUY' },
    { code: 'C', name: 'Gamma', total: 80, call: 'BUY' },
    { code: 'D', name: 'Delta', total: 77, call: 'BUY' },
    { code: 'E', name: 'Epsilon', total: 75, call: 'BUY' },
  ],
};

const model = runFunction('homeBriefDecisionModel', [tally]);
assert.deepEqual(model.counts, tally.counts);
assert.equal(model.total, 16);
assert.equal(model.asOf, tally.asOf);
assert.deepEqual(model.preview.map(row => row.code), ['A', 'B', 'C']);
assert.deepEqual(model.buy.map(row => row.code), ['A', 'B', 'C', 'D', 'E']);
assert.equal(model.buy.length, model.counts.BUY);

assert.match(html, /class="start-step start-step-summary home-daily-brief"/);
assert.match(html, /class="hdb-layout"/);
assert.match(html, /class="hdb-context"/);
assert.match(html, /class="hdb-decisions"/);
assert.match(html, /const labels=\['시장','확산','업종'\]/);
assert.match(html, /data-brief-label="\$\{labels\[i\]\|\|'메모'\}"/);
assert.match(html, /id="homeBriefDecision"/);
assert.match(html, /\.home-daily-brief \.hdb-layout\{display:grid;grid-template-columns:minmax\(0,3fr\) minmax\(300px,2fr\)/);
assert.match(html, /@media\(max-width:900px\)[\s\S]*?\.home-daily-brief \.hdb-layout\{grid-template-columns:1fr\}/);
assert.doesNotMatch(
  html.slice(html.indexOf('<article class="start-step start-step-summary home-daily-brief"'), html.indexOf('</article>', html.indexOf('<article class="start-step start-step-summary home-daily-brief"'))),
  /class="tly/
);

console.log('home daily brief view-model tests passed');
