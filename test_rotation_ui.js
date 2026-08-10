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

console.log('rotation UI contract passed');
