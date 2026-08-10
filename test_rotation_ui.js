const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert.match(html, /data-nav-mode="rotation"[^>]*>순환매</);
assert.match(html, /id="mode-rotation"/);
assert.match(html, /id="rotationView"/);
assert.match(html, /rotation:\['rotation_snapshot\.js','rotation-ui\.js'\]/);
assert.match(html, /m==='rotation'/);

const source = fs.readFileSync(path.join(root, 'rotation-ui.js'), 'utf8');
const context = { window: {}, console };
vm.runInNewContext(source, context);
assert.strictEqual(typeof context.window.GaeoRotation.formatPercent, 'function');
assert.strictEqual(context.window.GaeoRotation.formatPercent(3.456), '+3.5%');
assert.strictEqual(context.window.GaeoRotation.formatPercent(-1.24), '-1.2%');
assert.strictEqual(context.window.GaeoRotation.confidenceLabel('high', false), '검증 중');
assert.strictEqual(context.window.GaeoRotation.confidenceLabel('moderate', false), '중간');

const periods = {};
for (const horizon of [1, 3, 5, 20, 60, 120, 200]) {
  periods[String(horizon)] = {
    score: 61, signal: '관찰 후보', confidence: '보통', validCount: 20,
    return: { adjusted: 2.1 }, breadth: { adjustedUpRate: 60 },
    flow: { medianRelativeVolume: 1.1 }, taro: { score: 55 },
    concentration: { top3: 20 }, components: {}
  };
}
const rendered = context.window.GaeoRotation.renderView({
  generatedAt: '2026-08-10 16:10', dataCutoff: '2026-08-10 종가',
  universe: { valid: 20, configured: 20 }, model: { highConfidenceUnlocked: false },
  marketRegime: {}, summary: { leaders: [], candidate: null },
  sectors: [{ name: '반도체', periods }], leadLagEdges: [], similarMarkets: {}
}, { horizon: 5, selected: '반도체' });
assert.match(rendered, /상승 종목 비율을 함께 봅니다\.<br class="rot-hero-break">예측이 아니라 현재 어디로 힘이 모이는지 확인하는 참고 화면입니다\./);
for (const horizon of [60, 120, 200]) {
  assert.match(rendered, new RegExp(`data-horizon="${horizon}"[^>]*>${horizon}일</button>`));
}

console.log('rotation UI contract passed');
