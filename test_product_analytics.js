const assert = require('assert');
const analytics = require('./product_analytics.js');

function harness(options = {}) {
  const calls = [];
  const tracker = analytics.createAnalytics({
    gtag: options.blocked ? null : (...args) => calls.push(args),
    consentRequired: options.consentRequired,
    initialConsent: options.initialConsent,
    location: options.location || 'https://gaeoteam.com/?m=news&id=63&utm_source=threads&utm_medium=social',
  });
  return { calls, tracker };
}

{
  const { calls, tracker } = harness({ consentRequired: true, initialConsent: 'denied' });
  assert.strictEqual(tracker.track('landing_view', { page_type: 'content_query' }), false);
  assert.strictEqual(calls.length, 0);
}

{
  const { calls, tracker } = harness({ consentRequired: true, initialConsent: 'denied' });
  tracker.setConsent('granted');
  assert.strictEqual(tracker.track('landing_view', { page_type: 'content_query' }), true);
  assert.strictEqual(calls.length, 1);
}

{
  const { tracker } = harness({ blocked: true });
  assert.doesNotThrow(() => tracker.track('landing_view', {}));
  assert.strictEqual(tracker.track('landing_view', {}), false);
}

{
  const { calls, tracker } = harness();
  assert.strictEqual(tracker.track('share_generate', { page_type: 'content_query' }, { dedupeKey: 'share:63' }), true);
  assert.strictEqual(tracker.track('share_generate', { page_type: 'content_query' }, { dedupeKey: 'share:63' }), false);
  assert.strictEqual(calls.length, 1);
}

{
  const { calls, tracker } = harness();
  assert.strictEqual(tracker.track('made_up_event', {}), false);
  assert.strictEqual(tracker.track('stock_search_submit', { search_term: '삼성전자' }), false);
  assert.strictEqual(tracker.track('stock_analysis_open', { email: 'person@example.com' }), false);
  assert.strictEqual(tracker.track('landing_view', { utm_campaign: 'person@example.com' }), false);
  assert.strictEqual(tracker.track('landing_view', { utm_campaign: '010-1234-5678' }), false);
  assert.strictEqual(tracker.track('calculator_complete', { salary: 100000000 }), false);
  assert.strictEqual(calls.length, 0);
}

{
  const { calls, tracker } = harness();
  assert.strictEqual(tracker.track('stock_analysis_open', { stock_code: '005930', topic: undefined }), true);
  assert.deepStrictEqual(calls[0], ['event', 'stock_analysis_open', { stock_code: '005930' }]);
}

assert.deepStrictEqual(analytics.parseUtm('https://gaeoteam.com/?utm_source=threads&utm_medium=social&utm_campaign=w36&utm_content=news_63&email=x'), {
  utm_source: 'threads', utm_medium: 'social', utm_campaign: 'w36', utm_content: 'news_63',
});
assert.deepStrictEqual(analytics.parseUtm('https://gaeoteam.com/?utm_source=person%40example.com&utm_campaign=010-1234-5678'), {});
assert.strictEqual(analytics.classifyRoute('https://gaeoteam.com/snap/news/63.html').pageType, 'content_snapshot');
assert.strictEqual(analytics.classifyRoute('https://gaeoteam.com/?m=news&id=63').pageType, 'content_query');

console.log('test_product_analytics: PASS');
