const fs = require('fs');
const assert = require('assert');
const vm = require('vm');
const { readAppDocument } = require('./app_test_source');

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
assert.strictEqual(core.formatNumber(72), '72');
assert.strictEqual(core.formatNumber(72.0), '72');
assert.strictEqual(core.formatNumber(72.5), '72.5');
assert.strictEqual(core.formatNumber(null), '');
assert.strictEqual(core.formatScore(31), '+31점');
assert.strictEqual(core.formatScore(-6.5), '-6.5점');
assert.strictEqual(core.formatPanelTime('2026-08-13 15:23', 'header'), '08.13 · 15:23 기준');
assert.strictEqual(core.formatPanelTime('2026-08-13 15:23', 'recent'), '08.13 · 15:23');
assert.deepStrictEqual(JSON.parse(JSON.stringify(core.signalMetric({ type: 'rsi_oversold_exit', currentValue: 30.2 }))), { label: 'RSI', value: '30.2' });
assert.deepStrictEqual(JSON.parse(JSON.stringify(core.signalMetric({ type: 'volume_surge', currentValue: 4.8, unit: '배' }))), { label: '거래량', value: '4.8배' });
assert.deepStrictEqual(JSON.parse(JSON.stringify(core.signalMetric({ type: 'band_lower_break', currentValue: 41100, unit: '원' }))), { label: '밴드 하단', value: '41,100원' });
assert.deepStrictEqual(JSON.parse(JSON.stringify(core.signalMetric({ type: 'band_upper_break', currentValue: 55000, unit: '원' }))), { label: '밴드 상단', value: '55,000원' });
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

const html = readAppDocument();
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
for (const className of ['gir-ranking-row','gir-change-row','gir-signal-row','gir-history-row','gir-article-row','gir-metric-label','gir-metric-value']) {
  assert(source.includes(className), `${className} shared row grammar is required`);
}
assert(source.includes('종합점수'));
assert(source.includes('>종합<'));
assert(source.includes('위'));
assert(source.includes("core.signalMetric(e)"));
for (const phrase of ['gir-rotation-section','추천기간 기준','다음 순환 후보','오늘 주도 업종','대표 확인종목','summary.shortTerm']) {
  assert(source.includes(phrase), `${phrase} rotation hierarchy is required`);
}
assert(source.includes("'ArrowDown','ArrowUp','Home','End'"));
assert(css.includes('@media (min-width:1280px)'));
assert(css.includes('@media (prefers-reduced-motion:reduce)'));
assert(css.includes('--gir-ink:#1d1d1f'));
assert(css.includes('--gir-panel:300px'));
assert(css.includes('border-left:2px solid var(--gir-ink)'));
assert(css.includes('.gir-ranking-row'));
assert(css.includes('.gir-change-row'));
assert(css.includes('.gir-signal-row'));
assert(css.includes('.gir-history-row'));
assert(css.includes('.gir-article-row'));
assert(!/\.gir-row:hover\{[^}]*transform/.test(css), 'row hover must not move');
assert(!css.includes('linear-gradient'), 'insight rail must not use gradients');
assert(source.includes('.slice(0,8)'), 'news panel should stay editorially concise');
assert(source.includes("function nameLine(code,name,showPrice=true)"), 'recent rows must be able to place price on the secondary line');
assert(source.includes("core.formatPanelTime(v,'header')"), 'panel header dates must use the shared date formatter');
assert(source.includes('전체 종목 보기 →'));
assert(css.includes('.gir-sector-line'));
assert(css.includes('.gir-rotation-stocks'));

console.log('insight rail tests passed');
