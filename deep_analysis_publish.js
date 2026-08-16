const BASE_PATH = '/research/deep-analysis';
const AXES = ['taro', 'diana', 'nova', 'flow'];
const CALLS = new Set(['BUY', 'HOLD', 'SELL']);
const AXIS_LABELS = { taro: '기술', diana: '재무', nova: '확률통계', flow: '수급' };

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizedMinute(value) {
  const match = text(value).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
  return match ? `${match[1]} ${match[2]}:${match[3]}` : '';
}

function snapshotSlug(snapshot) {
  const minute = normalizedMinute(snapshot && (snapshot.analysisCreatedAt || snapshot.updated));
  if (!minute) return '';
  return minute.replace(' ', '-').replace(':', '');
}

function snapshotPath(record) {
  const ticker = text(record && (record.ticker || record.code));
  const slug = snapshotSlug(record);
  return /^\d{6}$/.test(ticker) && slug ? `${BASE_PATH}/${ticker}/${slug}/` : '';
}

function validAxis(axis) {
  return axis && Number.isFinite(Number(axis.score)) &&
    ['bull', 'neu', 'bear'].includes(axis.stance) &&
    Array.isArray(axis.findings) && axis.findings.some((finding) => text(finding));
}

function isPublishableSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return false;
  if (snapshot.tier === 'auto' || snapshot.mock || snapshot.fixture || snapshot.test ||
      snapshot.incomplete || snapshot.corrupted || snapshot.status === 'failed') return false;
  if (!normalizedMinute(snapshot.analysisCreatedAt || snapshot.updated)) return false;
  if (!Number.isFinite(Number(snapshot.base)) || Number(snapshot.base) <= 0 || !text(snapshot.baseAt)) return false;
  if (!AXES.every((key) => validAxis(snapshot[key]))) return false;
  const chief = snapshot.chief;
  return Boolean(chief && CALLS.has(chief.call) &&
    Number.isFinite(Number(chief.total)) && Number.isFinite(Number(chief.confidence)) &&
    text(chief.reason || chief.report));
}

function tickerLookup(tickers) {
  const map = new Map();
  const list = Array.isArray(tickers) ? tickers : Object.values(tickers || {});
  list.forEach((ticker) => {
    const code = text(ticker && (ticker.code || ticker.ticker));
    if (code) map.set(code, ticker);
  });
  return map;
}

function publicAxis(axis) {
  const result = {
    score: Number(axis.score),
    stance: axis.stance,
    findings: axis.findings.map(text).filter(Boolean),
  };
  if (Array.isArray(axis.sources)) {
    result.sources = axis.sources.map((source) => ({
      t: text(source && source.t),
      p: text(source && source.p),
      d: text(source && source.d),
      u: text(source && source.u),
    })).filter((source) => source.t || source.u);
  }
  return result;
}

function publicChief(chief) {
  return {
    call: chief.call,
    total: Number(chief.total),
    confidence: Number(chief.confidence),
    reason: text(chief.reason),
    target: text(chief.target),
    report: text(chief.report),
    modelVersion: text(chief.modelVersion),
  };
}

function normalizePublishedRecords(archive, tickers) {
  const tickerMap = tickerLookup(tickers);
  const records = new Map();
  Object.entries(archive || {}).forEach(([ticker, snapshots]) => {
    if (!/^\d{6}$/.test(ticker) || !Array.isArray(snapshots)) return;
    const current = tickerMap.get(ticker) || {};
    snapshots.forEach((snapshot) => {
      if (!isPublishableSnapshot(snapshot)) return;
      const analysisCreatedAt = normalizedMinute(snapshot.analysisCreatedAt || snapshot.updated);
      const snapshotId = `${ticker}-${snapshotSlug({ analysisCreatedAt })}`;
      const normalized = {
        snapshotId,
        ticker,
        stockName: text(snapshot.stockName) || text(current.name) || ticker,
        sector: text(snapshot.sector) || text(current.sector),
        analysisCreatedAt,
        updated: text(snapshot.updated) || analysisCreatedAt,
        dateModified: text(snapshot.dateModified) || analysisCreatedAt,
        base: Number(snapshot.base),
        baseAt: text(snapshot.baseAt),
        taro: publicAxis(snapshot.taro),
        diana: publicAxis(snapshot.diana),
        nova: publicAxis(snapshot.nova),
        flow: publicAxis(snapshot.flow),
        chief: publicChief(snapshot.chief),
        summary: text(snapshot.summary),
      };
      normalized.permalink = snapshotPath(normalized);
      records.set(snapshotId, normalized);
    });
  });
  return [...records.values()].sort((a, b) =>
    b.analysisCreatedAt.localeCompare(a.analysisCreatedAt) || a.ticker.localeCompare(b.ticker));
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function cleanBaseUrl(value) {
  return `${String(value || 'https://gaeoteam.com/').replace(/\/+$/, '')}/`;
}

function absoluteUrl(baseUrl, pathname) {
  return `${cleanBaseUrl(baseUrl).replace(/\/$/, '')}${pathname}`;
}

function dateParts(value) {
  const match = normalizedMinute(value).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  return { y: match[1], m: match[2], d: match[3], hh: match[4], mm: match[5] };
}

function koreanDate(value, withTime = false) {
  const p = dateParts(value);
  if (!p) return '';
  return `${p.y}년 ${Number(p.m)}월 ${Number(p.d)}일${withTime ? ` ${p.hh}:${p.mm}` : ''}`;
}

function dotDate(value) {
  const p = dateParts(value);
  return p ? `${p.y}.${p.m}.${p.d}` : '';
}

function isoKst(value) {
  const minute = normalizedMinute(value);
  return minute ? `${minute.replace(' ', 'T')}:00+09:00` : '';
}

function metaDescription(record) {
  const lead = `${record.stockName}(${record.ticker})의 기술·재무·확률통계·수급과 종합 판단을 담은 GAEO 정밀분석 기록입니다. ${koreanDate(record.analysisCreatedAt, true)} 당시 분석 내용을 확인하세요.`;
  return lead.length <= 155 ? lead : `${lead.slice(0, 154).trim()}…`;
}

function publicPageStyle() {
  return `:root{--paper:#fff;--ink:#171a20;--muted:#707783;--line:#e7e9ed;--soft:#f6f7f8;--accent:#233b62;--up:#9f3340;--down:#315f98}
*{box-sizing:border-box}html{background:var(--paper);color:var(--ink);font-family:"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Segoe UI","Noto Sans KR","Malgun Gothic",sans-serif;word-break:keep-all;overflow-wrap:anywhere}body{margin:0}.da-shell{width:min(920px,calc(100% - 40px));margin:0 auto;padding:34px 0 80px}.da-brand{display:flex;align-items:center;justify-content:space-between;padding-bottom:22px;border-bottom:1px solid var(--line);font-size:13px}.da-brand a,.da-breadcrumb a,.da-back,.da-index-row,.da-pager a{color:inherit;text-decoration:none}.da-wordmark{font-weight:760;letter-spacing:-.03em}.da-breadcrumb{display:flex;flex-wrap:wrap;gap:7px;margin:26px 0 40px;color:var(--muted);font-size:12px}.da-kicker{margin:0 0 12px;color:var(--accent);font-size:11px;font-weight:760;letter-spacing:.12em}.da-title{max-width:760px;margin:0;font-size:clamp(32px,6vw,54px);font-weight:720;line-height:1.12;letter-spacing:-.055em}.da-deck{max-width:720px;margin:18px 0 0;color:var(--muted);font-size:15px;line-height:1.75}.da-context{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:42px 0 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--line)}.da-context>div{padding:18px 16px 18px 0}.da-context>div+div{padding-left:16px;border-left:1px solid var(--line)}.da-context span{display:block;margin-bottom:8px;color:var(--muted);font-size:11px}.da-context strong{font-size:18px;font-weight:680}.da-note{margin:26px 0 0;padding:14px 0;border-bottom:1px solid var(--line);color:var(--muted);font-size:13px;line-height:1.7}.da-section{display:grid;grid-template-columns:150px minmax(0,1fr);gap:40px;padding:42px 0;border-bottom:1px solid var(--line)}.da-section h2{margin:0;font-size:15px;font-weight:700}.da-section-score{display:block;margin-top:6px;color:var(--muted);font-size:12px;font-weight:500}.da-findings{margin:0;padding:0;list-style:none}.da-findings li{position:relative;padding:0 0 16px 18px;font-size:15px;line-height:1.72}.da-findings li:last-child{padding-bottom:0}.da-findings li::before{position:absolute;top:.72em;left:0;width:4px;height:4px;border-radius:50%;background:var(--accent);content:""}.da-chief{padding-top:48px}.da-chief h2{margin:0 0 18px;font-size:24px;letter-spacing:-.035em}.da-chief p{margin:0 0 18px;font-size:16px;line-height:1.8}.da-target{padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);color:var(--muted);font-size:14px}.da-footer-links{display:flex;justify-content:space-between;gap:20px;margin-top:44px;font-size:13px;font-weight:650}.da-index-head{padding:54px 0 30px;border-bottom:1px solid var(--ink)}.da-index-head h1{margin:0;font-size:clamp(34px,6vw,54px);letter-spacing:-.055em}.da-index-head p{margin:14px 0 0;color:var(--muted);line-height:1.7}.da-index-list{margin-top:12px}.da-index-row{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:24px;align-items:center;padding:22px 4px;border-bottom:1px solid var(--line)}.da-index-row:hover .da-index-name,.da-index-row:focus-visible .da-index-name{color:var(--accent)}.da-index-date{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}.da-index-name{font-size:18px;font-weight:660;letter-spacing:-.02em}.da-index-sector{margin-top:4px;color:var(--muted);font-size:12px}.da-index-kind{color:var(--muted);font-size:12px}.da-pager{display:flex;justify-content:space-between;min-height:48px;margin-top:32px;font-size:13px;font-weight:650}.da-empty{padding:54px 0;color:var(--muted)}
@media(max-width:640px){.da-shell{width:min(100% - 28px,920px);padding-top:22px}.da-breadcrumb{margin:20px 0 30px}.da-title{font-size:36px}.da-context{grid-template-columns:1fr 1fr}.da-context>div:nth-child(3){padding-left:0;border-left:0;border-top:1px solid var(--line)}.da-context>div:nth-child(4){border-top:1px solid var(--line)}.da-section{grid-template-columns:1fr;gap:18px;padding:32px 0}.da-index-row{grid-template-columns:84px minmax(0,1fr);gap:14px}.da-index-kind{display:none}.da-footer-links{align-items:flex-start;flex-direction:column}.da-brand span:last-child{display:none}}`;
}

function renderSnapshotPage(record, options = {}) {
  const baseUrl = cleanBaseUrl(options.baseUrl);
  const canonical = absoluteUrl(baseUrl, record.permalink);
  const archiveUrl = absoluteUrl(baseUrl, `${BASE_PATH}/`);
  const stockUrl = `${baseUrl}?m=single&amp;code=${escapeHtml(record.ticker)}`;
  const title = `${record.stockName}(${record.ticker}) 정밀분석 · ${koreanDate(record.analysisCreatedAt, true)} | GAEO`;
  const description = metaDescription(record);
  const article = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${record.stockName}(${record.ticker}) 정밀분석 · ${koreanDate(record.analysisCreatedAt, true)}`,
    description, datePublished: isoKst(record.analysisCreatedAt),
    dateModified: isoKst(record.dateModified || record.analysisCreatedAt),
    inLanguage: 'ko-KR', mainEntityOfPage: canonical,
    isPartOf: { '@type': 'WebSite', name: 'GAEO', url: baseUrl },
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: '정밀분석 기록', item: archiveUrl },
      { '@type': 'ListItem', position: 3, name: `${record.stockName} ${dotDate(record.analysisCreatedAt)}`, item: canonical },
    ],
  };
  const axes = AXES.map((key) => {
    const axis = record[key];
    return `<section class="da-section"><h2>${AXIS_LABELS[key]}<span class="da-section-score">${axis.score}점 · ${escapeHtml(axis.stance)}</span></h2><ul class="da-findings">${axis.findings.map((finding) => `<li>${escapeHtml(finding)}</li>`).join('')}</ul></section>`;
  }).join('');
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(title.replace(' | GAEO', ''))}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:site_name" content="GAEO"><meta property="og:locale" content="ko_KR"><meta property="og:image" content="${baseUrl}gaeo-share-v3.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title.replace(' | GAEO', ''))}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${baseUrl}gaeo-share-v3.jpg">
<script type="application/ld+json">${safeJson(article)}</script><script type="application/ld+json">${safeJson(breadcrumb)}</script><style>${publicPageStyle()}</style></head>
<body><main class="da-shell"><header class="da-brand"><a class="da-wordmark" href="${baseUrl}">GAEO</a><span>Historical Research Record</span></header>
<nav class="da-breadcrumb" aria-label="현재 위치"><a href="${baseUrl}">홈</a><span>›</span><a href="${archiveUrl}">정밀분석 기록</a><span>›</span><span>${escapeHtml(record.stockName)}</span></nav>
<p class="da-kicker">DEEP ANALYSIS · ${escapeHtml(record.ticker)}</p><h1 class="da-title">${escapeHtml(record.stockName)} 정밀분석</h1><p class="da-deck">${escapeHtml(koreanDate(record.analysisCreatedAt, true))} 당시 기술·재무·확률통계·수급을 함께 검토해 남긴 분석 기록입니다.</p>
<div class="da-context"><div><span>정밀판단</span><strong>${escapeHtml(record.chief.call)} · ${record.chief.total}점</strong></div><div><span>신뢰도</span><strong>${record.chief.confidence}%</strong></div><div><span>당시 기준가</span><strong>${Number(record.base).toLocaleString('ko-KR')}원</strong></div><div><span>가격 기준</span><strong>${escapeHtml(record.baseAt)}</strong></div></div>
<p class="da-note">이 페이지는 ${escapeHtml(koreanDate(record.analysisCreatedAt, true))} 당시 분석입니다. 현재 시세나 최신 판단과 다를 수 있으므로 분석 시점과 가격 기준을 함께 확인해 주세요.</p>
${axes}<section class="da-chief"><p class="da-kicker">CHIEF CONCLUSION</p><h2>종합 판단</h2><p>${escapeHtml(record.chief.reason || record.chief.report)}</p>${record.chief.target ? `<div class="da-target"><b>당시 확인 구간</b><br>${escapeHtml(record.chief.target)}</div>` : ''}${record.chief.report && record.chief.report !== record.chief.reason ? `<p>${escapeHtml(record.chief.report)}</p>` : ''}</section>
<div class="da-footer-links"><a class="da-back" href="${stockUrl}">현재 종목 분석 보기 →</a><a class="da-back" href="${archiveUrl}">전체 정밀분석 보기 →</a></div></main></body></html>`;
}

function archivePagePath(page) {
  return page <= 1 ? `${BASE_PATH}/` : `${BASE_PATH}/page/${page}/`;
}

function renderArchivePage(records, options = {}) {
  const baseUrl = cleanBaseUrl(options.baseUrl);
  const page = Math.max(1, Number(options.page) || 1);
  const pageSize = Math.max(1, Number(options.pageSize) || 20);
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const canonical = absoluteUrl(baseUrl, archivePagePath(page));
  const rows = records.slice((page - 1) * pageSize, page * pageSize);
  const prevPath = page > 1 ? archivePagePath(page - 1) : '';
  const nextPath = page < totalPages ? archivePagePath(page + 1) : '';
  const title = page === 1 ? '정밀분석 기록 | GAEO' : `정밀분석 기록 ${page}페이지 | GAEO`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><title>${title}</title><meta name="description" content="GAEO가 특정 시점에 남긴 종목별 정밀분석 Historical Research Record를 최신순으로 확인하세요."><link rel="canonical" href="${canonical}">${prevPath ? `<link rel="prev" href="${absoluteUrl(baseUrl, prevPath)}">` : ''}${nextPath ? `<link rel="next" href="${absoluteUrl(baseUrl, nextPath)}">` : ''}<style>${publicPageStyle()}</style></head><body><main class="da-shell"><header class="da-brand"><a class="da-wordmark" href="${baseUrl}">GAEO</a><span>Research Library</span></header><section class="da-index-head"><p class="da-kicker">HISTORICAL RESEARCH</p><h1>정밀분석 기록</h1><p>직접 지정해 더 깊게 확인한 종목의 당시 분석을 시간순으로 보존합니다.<br>각 기록은 최신 판단으로 덮어쓰지 않습니다.</p></section><div class="da-index-list">${rows.length ? rows.map((record) => `<a class="da-index-row" href="${absoluteUrl(baseUrl, record.permalink)}"><span class="da-index-date">${dotDate(record.analysisCreatedAt)}</span><span><span class="da-index-name">${escapeHtml(record.stockName)}</span><span class="da-index-sector">${escapeHtml(record.sector || record.ticker)}</span></span><span class="da-index-kind">정밀분석</span></a>`).join('') : '<p class="da-empty">최근 정밀분석이 아직 없습니다.</p>'}</div><nav class="da-pager" aria-label="정밀분석 기록 페이지 이동">${prevPath ? `<a href="${absoluteUrl(baseUrl, prevPath)}" rel="prev">← 이전 페이지</a>` : '<span></span>'}${nextPath ? `<a href="${absoluteUrl(baseUrl, nextPath)}" rel="next">다음 페이지 →</a>` : '<span></span>'}</nav></main></body></html>`;
}

function buildLatestRecords(records, limit = 5) {
  return records.slice(0, Math.max(0, limit)).map((record) => ({
    ticker: record.ticker,
    stockName: record.stockName,
    analysisCreatedAt: record.analysisCreatedAt,
    date: record.analysisCreatedAt.slice(0, 10),
    permalink: record.permalink,
    summary: record.summary || '',
  }));
}

function buildManifest(records, options = {}) {
  const baseUrl = cleanBaseUrl(options.baseUrl);
  const pageSize = Math.max(1, Number(options.pageSize) || 20);
  const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
  return {
    generatedFrom: records[0] ? records[0].analysisCreatedAt : '',
    records: records.map((record) => ({
      snapshotId: record.snapshotId,
      loc: absoluteUrl(baseUrl, record.permalink),
      lastmod: record.analysisCreatedAt.slice(0, 10),
    })),
    archivePages: Array.from({ length: pageCount }, (_, index) => ({
      loc: absoluteUrl(baseUrl, archivePagePath(index + 1)),
      lastmod: records[0] ? records[0].analysisCreatedAt.slice(0, 10) : '',
    })),
  };
}

module.exports = {
  BASE_PATH,
  AXES,
  isPublishableSnapshot,
  normalizePublishedRecords,
  snapshotSlug,
  snapshotPath,
  renderSnapshotPage,
  renderArchivePage,
  buildLatestRecords,
  buildManifest,
  archivePagePath,
};
