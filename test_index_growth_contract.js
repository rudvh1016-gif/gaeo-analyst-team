const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
assert.strictEqual((html.match(/googletagmanager\.com\/gtag\/js/g) || []).length, 1, 'one deferred GA loader');
assert.strictEqual((html.match(/gtag\('config',\s*'G-D6PYQ4TXY4'\)/g) || []).length, 1, 'one GA config');
assert.match(html, /growth_urls\.js[^]*product_analytics\.js[^]*function gaeoLoadAnalytics\(\)[^]*googletagmanager\.com\/gtag\/js/);
assert.match(html, /GAEO_ANALYTICS_CONSENT_REQUIRED/);
assert.match(html, /gaeoSetAnalyticsConsent/);
assert.match(html, /if\(sent&&name==='stock_search_submit'/);
assert.doesNotMatch(html, /gaeoTrack\('search'/);
assert.doesNotMatch(html, /gaeoTrack\('analysis_start'/);
assert.doesNotMatch(html, /search_term\s*:/);
assert.doesNotMatch(html, /stock_name\s*:/);

for (const event of [
  'landing_view', 'stock_search_submit', 'stock_analysis_open', 'evidence_expand', 'source_click',
  'watchlist_add', 'calculator_start', 'calculator_complete', 'content_to_product_click',
  'share_generate', 'return_visit', 'stale_data_warning_seen',
]) assert.match(html, new RegExp(`gaeoTrack\\('${event}'`), `${event} must be wired`);

assert.match(html, /GaeoUrls\.signalPolicy\(location\.href\)/);
assert.match(html, /GaeoUrls\.shareUrl\(location\.href\)/);
assert.match(html, /clipboard\.writeText\(publicUrl\)/);
assert.doesNotMatch(html, /clipboard\.writeText\(location\.href\)/);

console.log('test_index_growth_contract: PASS');
