const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sitemap = require('./generate_sitemap.js');

assert.strictEqual(sitemap.requireDate('2026-09-02', 'news#63'), '2026-09-02');
assert.strictEqual(sitemap.productionDate('2026-09-02 종가 (16:03 수집)', 'LIVE_DATA.date'), '2026-09-02');
assert.throws(() => sitemap.productionDate('종가 데이터 없음', 'LIVE_DATA.date'), /LIVE_DATA\.date.*invalid/i);
assert.throws(() => sitemap.requireDate('', 'news#1'), /news#1.*missing/i);
assert.throws(() => sitemap.requireDate('2026-02-30', 'news#1'), /news#1.*invalid/i);
assert.strictEqual(sitemap.humanLastmod({ date: '2026-08-01', updated: '2026-08-04' }, 'lesson#1'), '2026-08-04');
assert.strictEqual(sitemap.humanLastmod({ date: '2026-08-01' }, 'lesson#1'), '2026-08-01');
assert.throws(() => sitemap.humanLastmod({ date: 'bad' }, 'lesson#1'), /lesson#1.*invalid/i);

const xml = sitemap.renderSitemap([
  { loc: 'https://gaeoteam.com/', prio: '1.0', mod: '2026-09-02' },
  { loc: 'https://gaeoteam.com/about.html', prio: '0.4', mod: null },
]);
assert.match(xml, /<lastmod>2026-09-02<\/lastmod>/);
assert.match(xml, /<loc>https:\/\/gaeoteam\.com\/about\.html<\/loc>\n    <priority>/);
assert.doesNotMatch(xml, /undefined|null/);
assert.throws(() => sitemap.validateUrls([
  { loc: 'https://gaeoteam.com/snap/news/1.html' },
  { loc: 'https://gaeoteam.com/snap/news/1.html' },
]), /duplicate/i);
assert.throws(() => sitemap.validateUrls([{ loc: 'https://gaeoteam.com/?m=news&id=1' }]), /query/i);
assert.throws(() => sitemap.validateUrls([{ loc: 'https://gaeoteam.com/snap/stock/005930.html' }]), /noindex/i);

const committed = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
assert.doesNotMatch(committed, /<loc>[^<]*\?/);
assert.doesNotMatch(committed, /\/snap\/stock\//);
const locs = [...committed.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert.strictEqual(new Set(locs).size, locs.length);

console.log('test_sitemap_contract: PASS');
