const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

// The market summary should use text-only status copy and a restrained
// blue/red direction system instead of the old emoji/green treatment.
assert.doesNotMatch(html, /emoji='🚀'/);
assert.match(html, /--market-up:#2563EB/);
assert.match(html, /--market-down:#DC2626/);
assert.match(html, /\.mood-up\s*\{color:var\(--market-up\)/);
assert.match(html, /\.mood-down\s*\{color:var\(--market-down\)/);
assert.match(html, /\.kpi \.v\.ok\{color:var\(--market-up\)\}/);
assert.match(html, /\.kpi \.v\.bad\{color:var\(--market-down\)\}/);

// Desktop keeps all seven quote metrics together; compact screens retain
// the full-width 52-week range for readability.
assert.match(html, /@media\(min-width:1180px\)[\s\S]*?\.qmetrics \.qm-wide\{grid-column:auto/);
assert.match(html, /@media\(min-width:1180px\)[\s\S]*?\.qmetrics \.qm-wide\{grid-column:auto;min-width:140px\}/);
assert.match(html, /\.qm-wide\{grid-column:1\/-1\}/);

console.log('market summary style tests passed');
