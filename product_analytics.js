(function (root, factory) {
  const urls = typeof module === 'object' && module.exports ? require('./growth_urls.js') : root.GaeoUrls;
  const api = factory(urls);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GaeoProductAnalytics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (urls) {
  'use strict';

  const EVENTS = new Set([
    'landing_view', 'stock_search_submit', 'stock_analysis_open', 'evidence_expand',
    'source_click', 'watchlist_add', 'calculator_start', 'calculator_complete',
    'content_to_product_click', 'share_generate', 'return_visit', 'stale_data_warning_seen',
    'scorecard_view',   // 2026-09-06: 성적표 열람(entry_cluster로 진입 경로 구분). 성적표에는 그동안 계측이 0개였다.
  ]);
  const PARAMETERS = new Set([
    'page_type', 'content_type', 'content_id', 'entry_cluster', 'stock_code', 'topic',
    'referrer_group', 'data_age_bucket', 'utm_source', 'utm_medium', 'utm_campaign',
    'utm_content', 'experiment_id', 'variant', 'method', 'calculator_id',
    'visit_gap_bucket', // 2026-09-06: 재방문 간격 구간(same_day/1d/2-7d/8-30d/30d+/unknown)만. 시각·횟수는 보내지 않는다.
  ]);
  const PII_LIKE = /(?:^|_)(?:name|email|e_mail|phone|mobile|address|ip|search_term|query|salary|income|principal|amount|token|secret)(?:_|$)/i;
  const SAFE_TEXT = /^[a-zA-Z0-9가-힣_-]{1,100}$/;
  const PII_VALUE = /(?:[^\s@]+@[^\s@]+\.[^\s@]+)|(?:\+?\d[\d ()-]{8,}\d)/;

  function parseUtm(value) {
    const result = {};
    let url;
    try { url = new URL(String(value), urls.BASE); } catch (_) { return result; }
    for (const key of urls.UTM_KEYS) {
      const raw = url.searchParams.get(key);
      if (raw != null && SAFE_TEXT.test(raw) && !PII_VALUE.test(raw)) result[key] = raw.slice(0, 80);
    }
    return result;
  }

  function classifyRoute(value) {
    return urls.classifyUrl(value);
  }

  function createAnalytics(options) {
    options = options || {};
    let consent = options.initialConsent || (options.consentRequired ? 'denied' : 'granted');
    const dedupe = new Set();
    const gtag = typeof options.gtag === 'function' ? options.gtag : null;

    function setConsent(next) {
      if (next === 'granted' || next === 'denied') consent = next;
      return consent;
    }

    function sanitize(params) {
      const clean = {};
      for (const [key, value] of Object.entries(params || {})) {
        if (value === undefined) continue;
        if (PII_LIKE.test(key) || !PARAMETERS.has(key)) return null;
        if (!['string', 'number', 'boolean'].includes(typeof value)) return null;
        if (typeof value === 'string' && PII_VALUE.test(value)) return null;
        clean[key] = typeof value === 'string' ? value.slice(0, 100) : value;
      }
      if (clean.stock_code != null && !urls.validStockCode(clean.stock_code)) return null;
      return clean;
    }

    function track(name, params, trackOptions) {
      if (!EVENTS.has(name) || consent !== 'granted' || !gtag) return false;
      const clean = sanitize(params);
      if (!clean) return false;
      const key = trackOptions && trackOptions.dedupeKey;
      if (key && dedupe.has(key)) return false;
      try {
        gtag('event', name, clean);
        if (key) dedupe.add(key);
        return true;
      } catch (_) {
        return false;
      }
    }

    return Object.freeze({ track, setConsent, getConsent: () => consent });
  }

  return Object.freeze({ EVENTS, PARAMETERS, parseUtm, classifyRoute, createAnalytics });
});
