(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GaeoUrls = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const BASE = 'https://gaeoteam.com/';
  const CONTENT_MODES = Object.freeze(['news', 'study', 'lesson', 'estate', 'calc']);
  const MODE_SET = new Set(CONTENT_MODES);
  const UTM_KEYS = Object.freeze(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']);
  const SAFE_CAMPAIGN_VALUE = /^[a-zA-Z0-9가-힣_-]{1,80}$/;

  function validContentId(value) {
    const text = String(value == null ? '' : value);
    return /^\d{1,6}$/.test(text) && Number(text) > 0;
  }

  function validStockCode(value) {
    return /^\d{6}$/.test(String(value == null ? '' : value));
  }

  function contentUrl(mode, id) {
    const safeMode = String(mode || '');
    const safeId = String(id == null ? '' : id);
    if (!MODE_SET.has(safeMode) || !validContentId(safeId)) return null;
    return `${BASE}snap/${safeMode}/${safeId}.html`;
  }

  function interactiveContentUrl(mode, id, options) {
    if (!contentUrl(mode, id)) return null;
    const url = new URL(BASE);
    url.searchParams.set('m', String(mode));
    url.searchParams.set('id', String(id));
    if (options && options.entry === 'snapshot') url.searchParams.set('entry', 'snapshot');
    return url.toString();
  }

  function cleanUrl(value) {
    try {
      const url = new URL(String(value), BASE);
      url.hash = '';
      return url;
    } catch (_) {
      return new URL(BASE);
    }
  }

  function classifyUrl(value) {
    const url = cleanUrl(value);
    const mode = url.searchParams.get('m');
    const id = url.searchParams.get('id');
    const code = url.searchParams.get('code');
    if (mode) {
      if (MODE_SET.has(mode)) {
        return validContentId(id)
          ? { pageType: 'content_query', mode, id: String(id) }
          : { pageType: 'invalid_content_query', mode, id: id || null };
      }
      if (mode === 'single') {
        return validStockCode(code)
          ? { pageType: 'stock_query', mode, stockCode: String(code) }
          : { pageType: 'invalid_app_query', mode, stockCode: code || null };
      }
      return { pageType: 'app_query', mode };
    }

    const content = /^\/snap\/(news|study|lesson|estate|calc)\/(\d{1,6})\.html$/.exec(url.pathname);
    if (content && validContentId(content[2])) {
      return { pageType: 'content_snapshot', mode: content[1], id: content[2] };
    }
    const stock = /^\/snap\/stock\/(\d{6})\.html$/.exec(url.pathname);
    if (stock) return { pageType: 'stock_snapshot', stockCode: stock[1] };
    if (/^\/research\/deep-analysis(?:\/|$)/.test(url.pathname)) return { pageType: 'deep_analysis' };
    if (url.pathname === '/' || url.pathname === '/index.html') return { pageType: 'home' };
    return { pageType: 'static_page' };
  }

  function pageUrl(url) {
    const clean = new URL(url.toString());
    const publicBase = new URL(BASE);
    clean.protocol = publicBase.protocol;
    clean.hostname = publicBase.hostname;
    clean.port = publicBase.port;
    clean.hash = '';
    for (const key of UTM_KEYS) clean.searchParams.delete(key);
    return clean.toString();
  }

  function signalPolicy(value) {
    const url = cleanUrl(value);
    const route = classifyUrl(url);
    if (route.pageType === 'content_query') {
      const canonical = contentUrl(route.mode, route.id);
      return { pageType: route.pageType, canonical, robots: null, ogUrl: canonical };
    }
    if (route.pageType === 'stock_query' || route.pageType === 'app_query'
        || route.pageType === 'invalid_app_query' || route.pageType === 'invalid_content_query') {
      return { pageType: route.pageType, canonical: null, robots: 'noindex,follow', ogUrl: pageUrl(url) };
    }
    if (route.pageType === 'stock_snapshot') {
      return { pageType: route.pageType, canonical: pageUrl(url), robots: 'noindex,follow', ogUrl: pageUrl(url) };
    }
    const canonical = route.pageType === 'home' ? BASE : pageUrl(url);
    return { pageType: route.pageType, canonical, robots: null, ogUrl: canonical };
  }

  function shareUrl(value) {
    const policy = signalPolicy(value);
    return policy.canonical || policy.ogUrl;
  }

  function addUtm(value, params) {
    let url;
    try { url = new URL(String(value)); } catch (_) { return null; }
    for (const key of UTM_KEYS) {
      if (!params || params[key] == null || params[key] === '') continue;
      const field = String(params[key]);
      if (!SAFE_CAMPAIGN_VALUE.test(field)) return null;
      url.searchParams.set(key, field);
    }
    return url.toString();
  }

  return Object.freeze({
    BASE, CONTENT_MODES, UTM_KEYS, validContentId, validStockCode, contentUrl,
    interactiveContentUrl, classifyUrl, signalPolicy, shareUrl, addUtm,
  });
});
