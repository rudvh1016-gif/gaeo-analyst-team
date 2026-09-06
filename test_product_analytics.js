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

// 2026-09-06 계측 3개: 성적표 열람 이벤트, 종목 열기의 진입 경로, 재방문 간격 구간이 허용목록에 있어 실제로 전송된다.
{
  const { calls, tracker } = harness();
  assert.strictEqual(tracker.track('scorecard_view', { page_type: 'scorecard', content_type: 'scorecard', entry_cluster: 'home_note' }), true);
  assert.strictEqual(tracker.track('stock_analysis_open', { stock_code: '005930', page_type: 'stock_analysis', entry_cluster: 'home_buy_list' }), true);
  assert.strictEqual(tracker.track('return_visit', { page_type: 'home', visit_gap_bucket: '2-7d' }), true);
  assert.strictEqual(calls.length, 3);
  // 여전히 허용목록 밖 이벤트·파라미터는 조용히 버려진다(홈 select_content 호출은 전송되지 않는다).
  assert.strictEqual(tracker.track('select_content', { content_type: 'home_section' }), false);
  assert.strictEqual(tracker.track('return_visit', { visit_timestamp: '2026-09-06T00:00:00Z' }), false);
  assert.strictEqual(calls.length, 3);
}

console.log('test_product_analytics: PASS');
