const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');

// The market summary should use text-only status copy and a restrained
// direction system instead of the old emoji/green treatment.
assert.doesNotMatch(html, /emoji='🚀'/);

// 2026-08-31: --market-up was #2563EB (blue) and --market-down #DC2626 (red),
// which is the exact inverse of the Korean convention the rest of the site uses
// (up = red, down = blue). The home "오늘 시장 상승" badge and the "오늘 평균 등락"
// KPI therefore rendered a rising market in blue. The tokens now alias the
// Korean direction tokens so there is a single source of truth for the values.
// The detailed contract lives in test_market_direction_colors.js.
assert.match(html, /--market-up:var\(--krup\)/);
assert.match(html, /--market-down:var\(--krdn\)/);
assert.match(html, /\.mood-up\s*\{color:var\(--market-up\)/);
assert.match(html, /\.mood-down\s*\{color:var\(--market-down\)/);

// Direction (.up/.dn) and quality (.ok/.bad) must stay separate classes: they
// used to share .ok/.bad, so correcting the direction tokens would have turned
// a good hit-rate red as a side effect.
assert.match(html, /\.kpi \.v\.up\{color:var\(--krup\)\} \.kpi \.v\.dn\{color:var\(--krdn\)\}/);
assert.match(html, /\.kpi \.v\.bad\{color:var\(--red\)\} \.kpi \.v\.ok\{color:var\(--green\)\}/);
assert.match(html, /const avgCls=MOOD\.avg<-0\.4\?'dn':MOOD\.avg>0\.4\?'up':'navy';/);
assert.match(html, /const accCls=acc===null\?'navy':\(acc>=60\?'ok':\(acc<45\?'bad':'navy'\)\);/);

// Desktop keeps all seven quote metrics together; compact screens retain
// the full-width 52-week range for readability.
assert.match(html, /@media\(min-width:1180px\)[\s\S]*?\.qmetrics \.qm-wide\{grid-column:auto/);
assert.match(html, /@media\(min-width:1180px\)[\s\S]*?\.qmetrics\{grid-template-columns:repeat\(6,minmax\(88px,1fr\)\) minmax\(190px,1\.5fr\)\}/);
assert.match(html, /\.qm-wide\{grid-column:1\/-1\}/);

console.log('market summary style tests passed');
