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
*{box-sizing:border-box}html{background:var(--paper);color:var(--ink);font-family:"Wanted Sans Variable","Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Segoe UI","Noto Sans KR","Malgun Gothic",sans-serif;word-break:keep-all;overflow-wrap:anywhere}/* 브라우저 기본 굵기(bold=700)로 새는 것을 막는다 — 사이트 전체가 400/500/600 세 단계다. */b,strong{font-weight:600}h1,h2,h3,h4,h5,h6{font-weight:600;text-wrap:balance}th{font-weight:600}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono","Courier New",monospace;font-size:.92em}body{margin:0}.da-shell{width:min(920px,calc(100% - 40px));margin:0 auto;padding:34px 0 80px}.da-brand{display:flex;align-items:center;justify-content:space-between;padding-bottom:22px;border-bottom:1px solid var(--line);font-size:13px}.da-brand a,.da-breadcrumb a,.da-back,.da-index-row,.da-pager a{color:inherit;text-decoration:none}.da-wordmark{font-weight:600;letter-spacing:-.03em}.da-breadcrumb{display:flex;flex-wrap:wrap;gap:7px;margin:26px 0 40px;color:var(--muted);font-size:12px}.da-kicker{margin:0 0 12px;color:var(--accent);font-size:11px;font-weight:600;letter-spacing:.12em}.da-title{max-width:760px;margin:0;font-size:clamp(32px,6vw,54px);font-weight:600;line-height:1.12;letter-spacing:-.055em}.da-deck{max-width:720px;margin:18px 0 0;color:var(--muted);font-size:15px;line-height:1.75}.da-context{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:42px 0 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--line)}.da-context>div{padding:18px 16px 18px 0}.da-context>div+div{padding-left:16px;border-left:1px solid var(--line)}.da-context span{display:block;margin-bottom:8px;color:var(--muted);font-size:11px}.da-context strong{font-size:18px;font-weight:600}.da-note{margin:26px 0 0;padding:14px 0;border-bottom:1px solid var(--line);color:var(--muted);font-size:13px;line-height:1.7}.da-section{display:grid;grid-template-columns:150px minmax(0,1fr);gap:40px;padding:42px 0;border-bottom:1px solid var(--line)}.da-section h2{margin:0;font-size:15px;font-weight:600}.da-section-score{display:block;margin-top:6px;color:var(--muted);font-size:12px;font-weight:500}.da-findings{margin:0;padding:0;list-style:none}.da-findings li{position:relative;padding:0 0 16px 18px;font-size:15px;line-height:1.72}.da-findings li:last-child{padding-bottom:0}.da-findings li::before{position:absolute;top:.72em;left:0;width:4px;height:4px;border-radius:50%;background:var(--accent);content:""}.da-chief{padding-top:48px}.da-chief h2{margin:0 0 18px;font-size:24px;letter-spacing:-.035em}.da-chief p{margin:0 0 18px;font-size:16px;line-height:1.8}.da-target{padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);color:var(--muted);font-size:14px}.da-footer-links{display:flex;justify-content:space-between;gap:20px;margin-top:44px;font-size:13px;font-weight:600}.da-index-head{padding:54px 0 30px;border-bottom:1px solid var(--ink)}.da-index-head h1{margin:0;font-size:clamp(34px,6vw,54px);letter-spacing:-.055em}.da-index-head p{margin:14px 0 0;color:var(--muted);line-height:1.7}.da-index-list{margin-top:12px}.da-index-row{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:24px;align-items:center;padding:22px 4px;border-bottom:1px solid var(--line)}.da-index-row:hover .da-index-name,.da-index-row:focus-visible .da-index-name{color:var(--accent)}.da-index-date{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}/* 🐛 두 줄은 위아래로 쌓여야 한다. inline이면 margin-top이 먹지 않아
   "금호건설건설·건자재"처럼 한 줄로 붙어버린다. */
.da-index-name{display:block;font-size:18px;font-weight:600;letter-spacing:-.02em}.da-index-sector{display:block;margin-top:4px;color:var(--muted);font-size:12px}.da-index-kind{color:var(--muted);font-size:12px}.da-pager{display:flex;justify-content:space-between;min-height:48px;margin-top:32px;font-size:13px;font-weight:600}.da-empty{padding:54px 0;color:var(--muted)}
@media(max-width:640px){.da-shell{width:min(100% - 28px,920px);padding-top:22px}.da-breadcrumb{margin:20px 0 30px}.da-title{font-size:36px}.da-context{grid-template-columns:1fr 1fr}.da-context>div:nth-child(3){padding-left:0;border-left:0;border-top:1px solid var(--line)}.da-context>div:nth-child(4){border-top:1px solid var(--line)}.da-section{grid-template-columns:1fr;gap:18px;padding:32px 0}.da-index-row{grid-template-columns:84px minmax(0,1fr);gap:14px}.da-index-kind{display:none}.da-footer-links{align-items:flex-start;flex-direction:column}.da-brand span:last-child{display:none}}`;
}

function renderSnapshotPage(record, options = {}) {
  const baseUrl = cleanBaseUrl(options.baseUrl);
  const canonical = absoluteUrl(baseUrl, record.permalink);
  const archiveUrl = absoluteUrl(baseUrl, `${BASE_PATH}/`);
  const hubUrl = absoluteUrl(baseUrl, stockHubPath(record.ticker));
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
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/fonts/wanted-sans/WantedSansVariable.css">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(title.replace(' | GAEO', ''))}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:site_name" content="GAEO"><meta property="og:locale" content="ko_KR"><meta property="og:image" content="${baseUrl}gaeo-share-v3.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title.replace(' | GAEO', ''))}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${baseUrl}gaeo-share-v3.jpg">
<script type="application/ld+json">${safeJson(article)}</script><script type="application/ld+json">${safeJson(breadcrumb)}</script><style>${publicPageStyle()}</style></head>
<body><main class="da-shell"><header class="da-brand"><a class="da-wordmark" href="${baseUrl}">GAEO</a><span>Historical Research Record</span></header>
<nav class="da-breadcrumb" aria-label="현재 위치"><a href="${baseUrl}">홈</a><span>›</span><a href="${archiveUrl}">정밀분석 기록</a><span>›</span><a href="${hubUrl}">${escapeHtml(record.stockName)}</a><span>›</span><span>${escapeHtml(dotDate(record.analysisCreatedAt))}</span></nav>
<p class="da-kicker">DEEP ANALYSIS · ${escapeHtml(record.ticker)}</p><h1 class="da-title">${escapeHtml(record.stockName)} 정밀분석</h1><p class="da-deck">${escapeHtml(koreanDate(record.analysisCreatedAt, true))} 당시 기술·재무·확률통계·수급을 함께 검토해 남긴 분석 기록입니다.</p>
<div class="da-context"><div><span>정밀판단</span><strong>${escapeHtml(record.chief.call)} · ${record.chief.total}점</strong></div><div><span>신뢰도</span><strong>${record.chief.confidence}%</strong></div><div><span>당시 기준가</span><strong>${Number(record.base).toLocaleString('ko-KR')}원</strong></div><div><span>가격 기준</span><strong>${escapeHtml(record.baseAt)}</strong></div></div>
<p class="da-note">이 페이지는 ${escapeHtml(koreanDate(record.analysisCreatedAt, true))} 당시 분석입니다. 현재 시세나 최신 판단과 다를 수 있으므로 분석 시점과 가격 기준을 함께 확인해 주세요. <a href="${baseUrl}disclaimer.html">데이터 출처·면책조항</a></p>
${axes}<section class="da-chief"><p class="da-kicker">CHIEF CONCLUSION</p><h2>종합 판단</h2><p>${escapeHtml(record.chief.reason || record.chief.report)}</p>${record.chief.target ? `<div class="da-target"><b>당시 확인 구간</b><br>${escapeHtml(record.chief.target)}</div>` : ''}${record.chief.report && record.chief.report !== record.chief.reason ? `<p>${escapeHtml(record.chief.report)}</p>` : ''}</section>
<div class="da-footer-links"><a class="da-back" href="${hubUrl}">${escapeHtml(record.stockName)} 최신 판단·전체 기록 →</a><a class="da-back" href="${stockUrl}">실시간 종목 분석 보기 →</a><a class="da-back" href="${archiveUrl}">전체 정밀분석 보기 →</a></div></main></body></html>`;
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
  // 종목별 대표 페이지로 가는 길을 목록 1페이지에 둔다. sitemap에만 있고 사이트
  // 어디서도 링크되지 않는 페이지는 구글이 잘 색인하지 않는다.
  const hubs = page === 1
    ? [...groupRecordsByTicker(records).entries()]
      .sort((a, b) => b[1][0].analysisCreatedAt.localeCompare(a[1][0].analysisCreatedAt))
      .map(([ticker, list]) => `<a class="da-hub-chip" href="${absoluteUrl(baseUrl, stockHubPath(ticker))}">${escapeHtml(list[0].stockName)}<span>${list.length}건</span></a>`).join('')
    : '';
  const hubSection = hubs
    ? `<section class="da-hub-block"><h2>종목별 전체 기록</h2><p class="da-hub-lead">한 종목의 판단이 시간에 따라 어떻게 바뀌었는지 한 페이지에서 볼 수 있습니다.</p><div class="da-hub-chips">${hubs}</div></section>`
    : '';
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/fonts/wanted-sans/WantedSansVariable.css"><title>${title}</title><meta name="description" content="GAEO가 특정 시점에 남긴 종목별 정밀분석 Historical Research Record를 최신순으로 확인하세요.${page > 1 ? ` 전체 기록 중 ${page}페이지입니다.` : ' 각 기록은 나중 판단으로 덮어쓰지 않고 날짜별로 보존합니다.'}"><link rel="canonical" href="${canonical}">${prevPath ? `<link rel="prev" href="${absoluteUrl(baseUrl, prevPath)}">` : ''}${nextPath ? `<link rel="next" href="${absoluteUrl(baseUrl, nextPath)}">` : ''}<style>${publicPageStyle()}${hubExtraStyle()}</style></head><body><main class="da-shell"><header class="da-brand"><a class="da-wordmark" href="${baseUrl}">GAEO</a><span>Research Library</span></header><section class="da-index-head"><p class="da-kicker">HISTORICAL RESEARCH</p><h1>정밀분석 기록</h1><p>직접 지정해 더 깊게 확인한 종목의 당시 분석을 시간순으로 보존합니다.<br>각 기록은 최신 판단으로 덮어쓰지 않습니다.</p></section><div class="da-index-list">${rows.length ? rows.map((record) => `<a class="da-index-row" href="${absoluteUrl(baseUrl, record.permalink)}"><span class="da-index-date">${dotDate(record.analysisCreatedAt)}</span><span><span class="da-index-name">${escapeHtml(record.stockName)}</span><span class="da-index-sector">${escapeHtml(record.sector || record.ticker)}</span></span><span class="da-index-kind">정밀분석</span></a>`).join('') : '<p class="da-empty">최근 정밀분석이 아직 없습니다.</p>'}</div>${hubSection}<nav class="da-pager" aria-label="정밀분석 기록 페이지 이동">${prevPath ? `<a href="${absoluteUrl(baseUrl, prevPath)}" rel="prev">← 이전 페이지</a>` : '<span></span>'}${nextPath ? `<a href="${absoluteUrl(baseUrl, nextPath)}" rel="next">다음 페이지 →</a>` : '<span></span>'}</nav></main></body></html>`;
}

function stockHubPath(ticker) {
  return `${BASE_PATH}/${ticker}/`;
}

// 한 종목의 기록을 최신순으로 묶는다. 종목별 대표 URL이 없으면 같은 종목의
// 날짜별 스냅샷들이 서로 경쟁해서, "종목명 주가 전망"으로 검색했을 때 구글이
// 옛날 기록을 보여줄 수 있다. 그 대표 자리를 이 묶음이 맡는다.
function groupRecordsByTicker(records) {
  const groups = new Map();
  (records || []).forEach((record) => {
    if (!groups.has(record.ticker)) groups.set(record.ticker, []);
    groups.get(record.ticker).push(record);
  });
  groups.forEach((list) => list.sort((a, b) =>
    b.analysisCreatedAt.localeCompare(a.analysisCreatedAt)));
  return groups;
}

function hubDescription(latest, count) {
  const lead = `${latest.stockName}(${latest.ticker})에 대한 GAEO 정밀분석 ${count}건의 전체 기록입니다. `
    + `가장 최근 판단은 ${koreanDate(latest.analysisCreatedAt)} ${latest.chief.call} `
    + `${latest.chief.total}점이며, 기술·재무·확률통계·수급 근거를 함께 확인할 수 있습니다.`;
  return lead.length <= 155 ? lead : `${lead.slice(0, 154).trim()}…`;
}

// 답변형 검색엔진(AI 검색)이 그대로 인용할 수 있도록, 데이터에서 바로 나오는
// 사실만 질문·답변 형태로 정리한다. 없는 내용을 지어내지 않는다.
function hubFaq(latest, list) {
  const oldest = list[list.length - 1];
  return [
    {
      q: `GAEO는 ${latest.stockName}을 지금 어떻게 판단하나요?`,
      a: `${koreanDate(latest.analysisCreatedAt, true)} 기준 종합 판단은 ${latest.chief.call}, `
        + `종합점수 ${latest.chief.total}점, 확신도 ${latest.chief.confidence}%입니다. `
        + `${latest.summary || latest.chief.reason || ''}`.trim(),
    },
    {
      q: `그 판단은 어느 가격을 기준으로 한 건가요?`,
      a: `${Number(latest.base).toLocaleString('ko-KR')}원(${latest.baseAt} 기준)을 놓고 분석했습니다. `
        + `현재 시세와 다를 수 있으니 분석 시점과 가격 기준을 함께 확인해 주세요.`,
    },
    {
      q: `${latest.stockName}의 과거 판단 기록도 볼 수 있나요?`,
      a: list.length > 1
        ? `${koreanDate(oldest.analysisCreatedAt)}부터 ${koreanDate(latest.analysisCreatedAt)}까지 `
          + `총 ${list.length}건의 정밀분석 기록이 남아 있습니다. 각 기록은 최신 판단으로 덮어쓰지 않고 그대로 보존합니다.`
        : `현재 ${koreanDate(latest.analysisCreatedAt)} 기록 1건이 있습니다. 이후 분석도 덮어쓰지 않고 시간순으로 쌓입니다.`,
    },
  ];
}

function renderStockHubPage(list, options = {}) {
  const baseUrl = cleanBaseUrl(options.baseUrl);
  const latest = list[0];
  const canonical = absoluteUrl(baseUrl, stockHubPath(latest.ticker));
  const archiveUrl = absoluteUrl(baseUrl, `${BASE_PATH}/`);
  const stockUrl = `${baseUrl}?m=single&amp;code=${escapeHtml(latest.ticker)}`;
  const title = `${latest.stockName}(${latest.ticker}) 주가 전망 · 정밀분석 전체 기록 | GAEO`;
  const description = hubDescription(latest, list.length);
  const faq = hubFaq(latest, list);
  const article = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${latest.stockName}(${latest.ticker}) 주가 전망 · GAEO 정밀분석 기록`,
    description, datePublished: isoKst(list[list.length - 1].analysisCreatedAt),
    dateModified: isoKst(latest.dateModified || latest.analysisCreatedAt),
    inLanguage: 'ko-KR', mainEntityOfPage: canonical,
    about: { '@type': 'Corporation', name: latest.stockName, tickerSymbol: latest.ticker },
    isPartOf: { '@type': 'WebSite', name: 'GAEO', url: baseUrl },
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: '정밀분석 기록', item: archiveUrl },
      { '@type': 'ListItem', position: 3, name: latest.stockName, item: canonical },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question', name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const axes = AXES.map((key) => {
    const axis = latest[key];
    return `<section class="da-section"><h2>${AXIS_LABELS[key]}<span class="da-section-score">${axis.score}점 · ${escapeHtml(axis.stance)}</span></h2><ul class="da-findings">${axis.findings.map((finding) => `<li>${escapeHtml(finding)}</li>`).join('')}</ul></section>`;
  }).join('');
  const timeline = list.map((record) => `<a class="da-index-row" href="${absoluteUrl(baseUrl, record.permalink)}"><span class="da-index-date">${dotDate(record.analysisCreatedAt)}</span><span><span class="da-index-name">${escapeHtml(record.chief.call)} · 종합 ${record.chief.total}점</span><span class="da-index-sector">${escapeHtml(record.summary || `확신도 ${record.chief.confidence}%`)}</span></span><span class="da-index-kind">${Number(record.base).toLocaleString('ko-KR')}원</span></a>`).join('');
  const faqHtml = faq.map((item) => `<div class="da-faq-item"><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></div>`).join('');
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/fonts/wanted-sans/WantedSansVariable.css">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(title.replace(' | GAEO', ''))}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:site_name" content="GAEO"><meta property="og:locale" content="ko_KR"><meta property="og:image" content="${baseUrl}gaeo-share-v3.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title.replace(' | GAEO', ''))}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${baseUrl}gaeo-share-v3.jpg">
<script type="application/ld+json">${safeJson(article)}</script><script type="application/ld+json">${safeJson(breadcrumb)}</script><script type="application/ld+json">${safeJson(faqSchema)}</script><style>${publicPageStyle()}${hubExtraStyle()}</style></head>
<body><main class="da-shell"><header class="da-brand"><a class="da-wordmark" href="${baseUrl}">GAEO</a><span>Research Record</span></header>
<nav class="da-breadcrumb" aria-label="현재 위치"><a href="${baseUrl}">홈</a><span>›</span><a href="${archiveUrl}">정밀분석 기록</a><span>›</span><span>${escapeHtml(latest.stockName)}</span></nav>
<p class="da-kicker">DEEP ANALYSIS · ${escapeHtml(latest.ticker)}</p><h1 class="da-title">${escapeHtml(latest.stockName)}(${escapeHtml(latest.ticker)}) 주가 전망</h1><p class="da-deck">GAEO가 ${escapeHtml(latest.stockName)}에 대해 남긴 정밀분석 ${list.length}건의 전체 기록입니다. 아래는 가장 최근 분석이고, 과거 기록은 그대로 보존해 아래 목록에서 확인할 수 있습니다.</p>
<div class="da-context"><div><span>최신 판단</span><strong>${escapeHtml(latest.chief.call)} · ${latest.chief.total}점</strong></div><div><span>확신도</span><strong>${latest.chief.confidence}%</strong></div><div><span>분석 기준가</span><strong>${Number(latest.base).toLocaleString('ko-KR')}원</strong></div><div><span>분석 시점</span><strong>${escapeHtml(dotDate(latest.analysisCreatedAt))}</strong></div></div>
<p class="da-note">아래 분석은 ${escapeHtml(koreanDate(latest.analysisCreatedAt, true))} 기준입니다. 현재 시세와 다를 수 있으니 분석 시점과 가격 기준을 함께 확인해 주세요. 이 페이지는 투자 권유가 아니며 판단과 책임은 투자자 본인에게 있습니다. <a href="${baseUrl}disclaimer.html">데이터 출처·면책조항</a></p>
${axes}<section class="da-chief"><p class="da-kicker">CHIEF CONCLUSION</p><h2>종합 판단</h2><p>${escapeHtml(latest.chief.reason || latest.chief.report)}</p>${latest.chief.target ? `<div class="da-target"><b>확인 구간</b><br>${escapeHtml(latest.chief.target)}</div>` : ''}${latest.chief.report && latest.chief.report !== latest.chief.reason ? `<p>${escapeHtml(latest.chief.report)}</p>` : ''}</section>
<section class="da-hub-block"><h2>${escapeHtml(latest.stockName)} 정밀분석 이력 ${list.length}건</h2><div class="da-index-list">${timeline}</div></section>
<section class="da-hub-block"><h2>자주 묻는 질문</h2>${faqHtml}</section>
<div class="da-footer-links"><a class="da-back" href="${stockUrl}">실시간 종목 분석 보기 →</a><a class="da-back" href="${archiveUrl}">전체 정밀분석 보기 →</a></div></main></body></html>`;
}

function hubExtraStyle() {
  return `.da-hub-block{padding:42px 0 0;border-top:1px solid var(--line)}.da-hub-block h2{margin:0 0 6px;font-size:20px;letter-spacing:-.03em}.da-faq-item{padding:20px 0;border-bottom:1px solid var(--line)}.da-faq-item h3{margin:0 0 8px;font-size:15px;font-weight:600}.da-faq-item p{margin:0;color:var(--muted);font-size:14px;line-height:1.75}.da-hub-lead{margin:0 0 18px;color:var(--muted);font-size:14px;line-height:1.7}.da-hub-chips{display:flex;flex-wrap:wrap;gap:8px}.da-hub-chip{display:inline-flex;align-items:baseline;gap:7px;padding:9px 14px;border:1px solid var(--line);border-radius:999px;color:inherit;font-size:14px;font-weight:600;text-decoration:none}.da-hub-chip:hover,.da-hub-chip:focus-visible{border-color:var(--accent);color:var(--accent)}.da-hub-chip span{color:var(--muted);font-size:12px;font-weight:500}`;
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
    // 종목별 대표 페이지. sitemap에서 개별 스냅샷보다 높은 우선순위를 준다.
    stockHubs: [...groupRecordsByTicker(records).entries()].map(([ticker, list]) => ({
      ticker,
      loc: absoluteUrl(baseUrl, stockHubPath(ticker)),
      lastmod: list[0].analysisCreatedAt.slice(0, 10),
    })).sort((a, b) => b.lastmod.localeCompare(a.lastmod) || a.ticker.localeCompare(b.ticker)),
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
  renderStockHubPage,
  groupRecordsByTicker,
  stockHubPath,
  buildLatestRecords,
  buildManifest,
  archivePagePath,
};
