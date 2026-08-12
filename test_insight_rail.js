const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const source = fs.readFileSync('insight-rail.js', 'utf8');
const moduleSource = `${source}\n;globalThis.__tested = GaeoInsightRailCore;`;
const context = { globalThis: {}, console };
vm.createContext(context);
vm.runInContext(moduleSource, context);
const core = context.globalThis.__tested;

assert(core, 'insight rail core must be exposed for deterministic tests');

assert.strictEqual(core.formatWon(14600), '14,600원');
assert.strictEqual(core.formatWon(14600.4), '14,600원');
assert.strictEqual(core.formatWon(null), '');
assert.strictEqual(core.resolveTotalScore('005930', { signals: { '005930': { t: 64 } } }), 64);
assert.strictEqual(core.resolveTotalScore('005930', { marketInsight: { ranked: [{ code: '005930', total: 62 }] } }), 62);
assert.strictEqual(core.resolveTotalScore('005930', {}), null);

assert.deepStrictEqual(
  JSON.parse(JSON.stringify(core.nextPanelState({ open: false, tab: 'top30' }, 'rotation'))),
  { open: true, tab: 'rotation' }
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(core.nextPanelState({ open: true, tab: 'rotation' }, 'rotation'))),
  { open: false, tab: 'rotation' }
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(core.nextPanelState({ open: true, tab: 'rotation' }, 'news'))),
  { open: true, tab: 'news' }
);

const signals = {
  A: { t: 70, pt: 40, c: 'BUY', pc: 'HOLD' },
  B: { t: 60, pt: 80, c: 'HOLD', pc: 'BUY' },
  C: { t: 50, pt: 50, c: 'SELL', pc: 'SELL' }
};
const ranks = core.rankSnapshots(signals);
assert.strictEqual(ranks.current.A, 1);
assert.strictEqual(ranks.previous.A, 3);
assert.strictEqual(ranks.current.B, 2);
assert.strictEqual(ranks.previous.B, 1);

let recent = [];
recent = core.addRecent(recent, { code: '005930', name: '삼성전자' }, 3, 100);
recent = core.addRecent(recent, { code: '035420', name: 'NAVER' }, 3, 200);
recent = core.addRecent(recent, { code: '005930', name: '삼성전자' }, 3, 300);
assert.deepStrictEqual(JSON.parse(JSON.stringify(recent.map(item => item.code))), ['005930', '035420']);
assert.strictEqual(recent[0].visitedAt, 300);
recent = core.addRecent(recent, { code: '000660', name: 'SK하이닉스' }, 2, 400);
assert.deepStrictEqual(JSON.parse(JSON.stringify(recent.map(item => item.code))), ['000660', '005930']);

assert.strictEqual(core.marketFlowLabel(new Date('2026-08-12T01:00:00Z')), '실시간');
assert.strictEqual(core.marketFlowLabel(new Date('2026-08-12T08:00:00Z')), '마감 흐름');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('insight-rail.css', 'utf8');
assert(html.includes('insight-rail.css'));
assert(html.includes('insight-rail.js'));
assert(html.includes('GaeoInsightRail.recordRecent'));
assert(/function showQuote\(st\)\{[\s\S]{0,250}GaeoInsightRail\.recordRecent\(st\)/.test(html));
assert(source.includes("gaeo-insight-panel-open"));
assert(source.includes("gaeo-insight-panel-tab"));
assert(source.includes("gaeo-recent-stocks"));
assert(source.includes("GaeoFeatures.load('rotation')"));
assert(source.includes("GaeoFeatures.load('news')"));
assert(source.includes("role=\"tabpanel\""));
assert(source.includes("'ArrowDown','ArrowUp','Home','End'"));
assert(css.includes('@media (min-width:1280px)'));
assert(css.includes('@media (prefers-reduced-motion:reduce)'));

console.log('insight rail tests passed');
