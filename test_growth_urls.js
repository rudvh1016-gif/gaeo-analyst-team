const assert = require('assert');
const urls = require('./growth_urls.js');

const BASE = 'https://gaeoteam.com/';

for (const mode of ['news', 'study', 'lesson', 'estate', 'calc']) {
  assert.strictEqual(urls.contentUrl(mode, 17), `${BASE}snap/${mode}/17.html`);
  assert.strictEqual(urls.contentUrl(mode, '000017'), `${BASE}snap/${mode}/000017.html`);
  assert.strictEqual(urls.shareUrl(`${BASE}?m=${mode}&id=17`), `${BASE}snap/${mode}/17.html`);
  const policy = urls.signalPolicy(`${BASE}?m=${mode}&id=17`);
  assert.deepStrictEqual(policy, {
    pageType: 'content_query',
    canonical: `${BASE}snap/${mode}/17.html`,
    robots: null,
    ogUrl: `${BASE}snap/${mode}/17.html`,
  });
}

for (const invalid of [null, '', '0', '-1', '1.5', '1234567', '1"><script>']) {
  assert.strictEqual(urls.contentUrl('news', invalid), null, `invalid id must be rejected: ${invalid}`);
}
assert.strictEqual(urls.contentUrl('single', '1'), null);
assert.strictEqual(urls.contentUrl('../news', '1'), null);

assert.strictEqual(
  urls.interactiveContentUrl('lesson', 3, { entry: 'snapshot' }),
  `${BASE}?m=lesson&id=3&entry=snapshot`,
);
assert.strictEqual(urls.interactiveContentUrl('lesson', 'bad'), null);

assert.deepStrictEqual(urls.signalPolicy(`${BASE}?m=single&code=005930`), {
  pageType: 'stock_query', canonical: null, robots: 'noindex,follow', ogUrl: `${BASE}?m=single&code=005930`,
});
assert.strictEqual(
  urls.signalPolicy('http://127.0.0.1:8891/?m=single&code=005930').ogUrl,
  `${BASE}?m=single&code=005930`,
);
assert.deepStrictEqual(urls.signalPolicy(`${BASE}?m=guide`), {
  pageType: 'app_query', canonical: null, robots: 'noindex,follow', ogUrl: `${BASE}?m=guide`,
});
assert.deepStrictEqual(urls.signalPolicy(`${BASE}?m=news&id=bad`), {
  pageType: 'invalid_content_query', canonical: null, robots: 'noindex,follow', ogUrl: `${BASE}?m=news&id=bad`,
});
assert.strictEqual(urls.signalPolicy(`${BASE}snap/news/17.html`).canonical, `${BASE}snap/news/17.html`);
assert.strictEqual(urls.signalPolicy(`${BASE}snap/stock/005930.html`).robots, 'noindex,follow');
assert.strictEqual(
  urls.signalPolicy(`${BASE}research/deep-analysis/005930/2026-09-02-0900/`).canonical,
  `${BASE}research/deep-analysis/005930/2026-09-02-0900/`,
);

assert.strictEqual(
  urls.addUtm(`${BASE}snap/news/17.html`, {
    utm_source: 'threads', utm_medium: 'social', utm_campaign: 'weekly_2026w36', utm_content: 'news_17', ignored: 'x',
  }),
  `${BASE}snap/news/17.html?utm_source=threads&utm_medium=social&utm_campaign=weekly_2026w36&utm_content=news_17`,
);
assert.strictEqual(urls.addUtm(`${BASE}snap/news/17.html`, { utm_source: 'bad value!' }), null);

console.log('test_growth_urls: PASS');
