// 정적 스냅샷 생성기 — 자바스크립트를 실행하지 않는 크롤러/AI 도구도 글 내용을
// 바로 읽을 수 있도록, 각 글의 "읽기 전용 정적 HTML 사본"을 /snap/ 아래에 만든다.
// 각 스냅샷의 정적 주소 자체가 검색 대표 주소(canonical)이며, 인터랙티브 화면으로
// 이동하는 버튼을 함께 제공한다. 두 화면의 본문은 100% 동일해야 한다(클로킹 금지).
// 새 글을 등록할 때마다 `node generate_snapshots.js`로 다시 실행한다(generate_sitemap.js와 세트).
const fs = require('fs');
const path = require('path');
const { contentUrl, interactiveContentUrl } = require('./growth_urls.js');

const HERE = __dirname;
const BASE = 'https://gaeoteam.com/';
const SITE_NAME = 'Gaeo · 개오 애널리스트팀';
const SHARE_IMAGE = BASE + 'gaeo-share-v3.jpg';
const SHARE_ALT = 'GAEO';
// <title> 뒤에 붙이는 짧은 브랜드 꼬리표. 검색결과 제목은 대략 60자를 넘으면 뒷부분이 잘리는데,
// 전체 사이트명(19자)을 다 붙이면 글 제목 자체가 멀쩡해도 브랜드 때문에 잘려나갔다.
// 글 제목은 그대로 두고 꼬리표만 줄여 34건 → 11건으로 해결한다(og:title에는 원래 안 붙는다).
const TITLE_SUFFIX = 'Gaeo';

function load(file, varname) {
  try {
    return new Function(fs.readFileSync(path.join(HERE, file), 'utf8') + ';return ' + varname + ';')();
  } catch (error) {
    throw new Error(`${file} ${varname} load failed: ${error.message}`);
  }
}

function productionDate(value, label) {
  const match = /^(\d{4}-\d{2}-\d{2})(?:\s|$)/.exec(String(value == null ? '' : value));
  if (!match) throw new Error(`${label}: YYYY-MM-DD production date is required`);
  return match[1];
}

const SITE_AS_OF = productionDate((load('data.js', 'LIVE_DATA') || {}).date, 'data.js LIVE_DATA.date');
const ARCHIVE_AFTER_DAYS = 30;

function archiveNotice(date) {
  const published = productionDate(date, 'human content date');
  const ageDays = Math.floor((Date.parse(`${SITE_AS_OF}T00:00:00Z`) - Date.parse(`${published}T00:00:00Z`)) / 86400000);
  if (ageDays < ARCHIVE_AFTER_DAYS) return '';
  const [year, month, day] = published.split('-');
  return `<div class="archive-notice"><strong>과거 시점의 기록</strong>이 글은 ${year}년 ${month}월 ${day}일 당시 정보와 자료를 기준으로 작성됐습니다.</div>`;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

// 검색결과 설명문(meta description)용으로만 요약을 줄인다.
// 화면에 보이는 요약(.summary)은 원문 그대로 쓰므로 글 내용은 전혀 바뀌지 않는다.
// 구글은 대략 155자 부근에서 설명을 자르는데, 그냥 두면 문장 한가운데서 "..."로 끊겨
// 무슨 말인지 알 수 없게 된다. 그래서 문장부호 → 어절 순으로 자연스러운 지점을 찾아 끊는다.
const META_DESC_MAX = 155;
function metaDesc(s) {
  const t = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  if (t.length <= META_DESC_MAX) return t;
  const head = t.slice(0, META_DESC_MAX);
  // ① 문장이 끝나는 자리(。. ! ?)가 뒤쪽에 있으면 거기서 깔끔하게 끊는다
  const sentence = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '), head.lastIndexOf('요. '), head.lastIndexOf('다. '));
  if (sentence > META_DESC_MAX * 0.6) return head.slice(0, sentence + 1).trim();
  // ② 없으면 마지막 띄어쓰기에서 끊고 말줄임표를 붙인다(단어 중간에서 안 끊기게)
  const space = head.lastIndexOf(' ');
  return (space > META_DESC_MAX * 0.5 ? head.slice(0, space) : head).trim() + '…';
}

// 본문 미니 마크다운(## / - / **굵게** / [링크](URL) / [[img:..]]) → 읽기용 평범한 HTML로 변환
function bodyToHtml(raw) {
  const lines = String(raw || '').split('\n');
  let html = '', para = [], list = [];
  const flushPara = () => { if (para.length) { html += '<p>' + para.join('<br>') + '</p>\n'; para = []; } };
  const flushList = () => { if (list.length) { html += '<ul>' + list.map(li => '<li>' + li + '</li>').join('') + '</ul>\n'; list = []; } };
  const inline = (t) => esc(t)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  for (const raw0 of lines) {
    const line = raw0.trim();
    if (!line) { flushList(); flushPara(); continue; }
    if (/^\[\[img:/.test(line)) {
      flushList(); flushPara();
      const m = line.match(/^\[\[img:[^|]+\|(.+?)\]\]$/);
      if (m) html += '<p class="cap">' + inline(m[1]) + '</p>\n';
      continue;
    }
    if (line.startsWith('## ')) { flushList(); flushPara(); html += '<h2>' + inline(line.slice(3)) + '</h2>\n'; continue; }
    if (line.startsWith('- ')) { flushPara(); list.push(inline(line.slice(2))); continue; }
    flushList(); para.push(inline(line));
  }
  flushList(); flushPara();
  return html;
}

function page({ canonicalUrl, title, desc, date, updated, articleType, bodyHtml, backHref, sourcesHtml, tag, relatedHtml, noindex, archiveHtml }) {
  const modified = updated || date;
  // 검색엔진에 보내는 설명은 잘리지 않게 줄이고, 화면에 보이는 요약(.summary)은 원문 그대로 쓴다.
  const sdesc = metaDesc(desc);
  const ld = {
    "@context": "https://schema.org",
    "@type": articleType || "Article",
    "headline": title,
    "image": SHARE_IMAGE,
    "datePublished": date,
    "dateModified": modified,
    "description": sdesc,
    "inLanguage": "ko-KR",
    "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": BASE },
    "author": { "@type": "Organization", "name": "Gaeo 리서치팀", "url": BASE + "about.html" },
    "publisher": { "@type": "Organization", "name": SITE_NAME, "url": BASE },
    "mainEntityOfPage": canonicalUrl
  };
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/assets/fonts/wanted-sans/WantedSansVariable.css">
<title>${esc(title)} · ${esc(TITLE_SUFFIX)}</title>
<meta name="description" content="${esc(sdesc)}">
${noindex ? '<meta name="robots" content="noindex,follow">\n' : ''}<link rel="canonical" href="${esc(canonicalUrl)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(sdesc)}">
<meta property="og:image" content="${SHARE_IMAGE}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${SHARE_ALT}">
<meta property="og:url" content="${esc(canonicalUrl)}">
<meta property="og:site_name" content="GAEO">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(sdesc)}">
<meta name="twitter:image" content="${SHARE_IMAGE}">
<meta name="twitter:image:alt" content="${SHARE_ALT}">
<script type="application/ld+json">${safeJson(ld)}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3152692263439634"
     crossorigin="anonymous"></script>
<style>
:root{--bg:#F4FAFC;--ink:#13242C;--t2:#607782;--sky:#286B83;--soft:#CCE9F3;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#101A1F;--ink:#F3F8FA;--t2:#A5BBC5;--sky:#9CD5E8;--soft:#193742;--card:#17252C}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Wanted Sans Variable","Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Segoe UI","Noto Sans KR","Malgun Gothic",sans-serif;line-height:1.7;word-break:keep-all;overflow-wrap:anywhere}/* 브라우저 기본 굵기(bold=700)로 새는 것을 막는다 — 사이트 전체가 400/500/600 세 단계다. */b,strong{font-weight:600}h1,h2,h3,h4,h5,h6{font-weight:600;text-wrap:balance}th{font-weight:600}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono","Courier New",monospace;font-size:.92em}
.wrap{max-width:720px;margin:0 auto;padding:28px 20px 60px}
.top{font-size:13px;margin-bottom:18px}
.top a{color:var(--sky);text-decoration:none;font-weight:600}
.card{min-width:0;overflow:hidden;background:var(--card);border-radius:16px;padding:26px 24px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
h1{font-size:22px;margin:0 0 8px;line-height:1.4}
.meta{color:var(--t2);font-size:13px;margin-bottom:18px}
.tag{display:inline-block;background:rgba(0,113,227,.1);color:var(--sky);font-size:12px;font-weight:600;padding:3px 10px;border-radius:99px;margin-bottom:10px}
.summary{color:var(--t2);font-size:14.5px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid rgba(128,128,128,.2)}
.archive-notice{margin:0 0 20px;padding:13px 15px;border-radius:12px;background:var(--soft);color:var(--t2);font-size:13px}
.archive-notice strong{display:block;color:var(--ink);margin-bottom:2px}
h2{font-size:17px;margin:22px 0 8px}
p{margin:0 0 12px;font-size:15px}
p.cap{color:var(--t2);font-style:italic;font-size:13.5px}
ul{margin:0 0 12px;padding-left:20px}
li{margin-bottom:6px;font-size:15px}
.cta{display:inline-block;margin-top:22px;background:var(--sky);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:99px}
.trust{margin-top:22px;padding:14px 16px;border-radius:13px;background:var(--soft);font-size:12.5px;color:var(--t2)}
.trust strong{display:block;color:var(--ink);margin-bottom:3px}
.related{margin-top:24px;padding-top:18px;border-top:1px solid rgba(128,128,128,.2)}
.related h2{margin:0 0 8px}
.related a{display:block;padding:7px 0;color:var(--sky);font-size:13.5px;text-decoration:none}
.sources{margin-top:26px;font-size:12.5px;color:var(--t2)}
.sources a{color:var(--t2)}
.disc{margin-top:20px;font-size:12px;color:var(--t2)}
</style>
<link rel="stylesheet" href="/editorial-accessibility.css?v=20260903-v1">
</head>
<body>
<a class="skip-link" href="#main-content">본문으로 바로가기</a>
<div class="wrap">
  <div class="top"><a href="${BASE}">← ${esc(SITE_NAME)} 홈</a></div>
  <main class="card" id="main-content" tabindex="-1">
${tag ? '    <span class="tag">' + esc(tag) + '</span>' : ''}
    <h1 class="daum-wm-title">${esc(title)}</h1>
    <div class="meta daum-wm-datetime">작성: 개오 애널리스트팀 · 발행 ${esc(date)} · 수정 ${esc(modified)}</div>
${archiveHtml ? '    ' + archiveHtml : ''}
    <div class="summary">${esc(desc)}</div>
    <div class="daum-wm-content">
    ${bodyHtml}
    </div>
    <a class="cta" href="${esc(backHref)}" rel="nofollow">인터랙티브 화면에서 이 글 보기 →</a>
    <div class="trust"><strong>자료를 읽기 전에</strong>시세 기준과 분석 기준을 구분해 표시하며, 자동분석은 규칙 기반 참고자료예요. 투자 권유가 아닙니다.</div>
${relatedHtml ? '    ' + relatedHtml : ''}
${sourcesHtml ? '    ' + sourcesHtml : ''}
    <footer class="disc">이 글은 개오팀의 분석 의견이며 투자 권유가 아니에요. 투자 판단과 그 책임은 투자자 본인에게 있습니다. <a href="${BASE}disclaimer.html">데이터 출처·면책조항</a> · <a href="${BASE}about.html">사이트 소개</a></footer>
  </main>
</div>
</body>
</html>
`;
}

function sourcesToHtml(sources) {
  if (!Array.isArray(sources) || !sources.length) return '';
  const items = sources.map(s => {
    if (s.url) return '<li><a href="' + esc(s.url) + '" rel="nofollow">' + esc(s.name || s.t || s.url) + '</a></li>';
    const nm = s.t ? (s.t + (s.p ? ', ' + s.p : '') + (s.d ? ' (' + s.d + ')' : '')) : (s.name || '');
    return '<li>' + esc(nm) + '</li>';
  }).join('');
  return '<div class="sources"><strong>출처</strong><ul>' + items + '</ul></div>';
}

function relatedToHtml(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return '<div class="related"><h2>이어서 볼 자료</h2>' +
    items.slice(0, 3).map(x => '<a href="' + esc(x.url) + '">' + esc(x.title) + '</a>').join('') +
    '</div>';
}

const outDirs = ['snap/news', 'snap/study', 'snap/lesson', 'snap/estate', 'snap/calc', 'snap/stock'];
for (const d of outDirs) fs.mkdirSync(path.join(HERE, d), { recursive: true });

const index = [];

function build(list, kind, folder, titleKey, tagPrefix) {
  for (const item of list) {
    const title = item[titleKey] || item.title || item.name;
    const canonicalUrl = contentUrl(kind, item.id);
    const interactiveUrl = interactiveContentUrl(kind, item.id, { entry: 'snapshot' });
    if (!canonicalUrl || !interactiveUrl) throw new Error(`${kind}#${item.id}: invalid public URL fields`);
    const html = page({
      canonicalUrl,
      title,
      desc: item.summary || '',
      date: item.date,
      updated: item.updated || item.date,
      articleType: 'Article',
      bodyHtml: bodyToHtml(item.body),
      backHref: interactiveUrl,
      sourcesHtml: sourcesToHtml(item.sources),
      tag: item.tag,
      archiveHtml: archiveNotice(item.date),
      relatedHtml: relatedToHtml([
        ...list.filter(x => x.id !== item.id && item.cat && x.cat === item.cat),
        ...list.filter(x => x.id !== item.id && (!item.cat || x.cat !== item.cat))
      ].slice(0, 3).map(x => ({
        url: contentUrl(kind, x.id),
        title: x[titleKey] || x.title || x.name
      }))),
    });
    fs.writeFileSync(path.join(HERE, `snap/${folder}/${item.id}.html`), html);
    // href는 snap/index.html(= /snap/ 하위)에서 쓰이므로 반드시 절대 URL이어야 한다.
    // 상대경로('snap/news/1.html')로 두면 /snap/snap/news/1.html 로 잘못 풀려 전 링크가 404가 된다.
    index.push({ href: canonicalUrl, title, date: item.date, cat: tagPrefix, mode: kind, id: item.id });
  }
}

build(load('news_analysis.js', 'NEWS_ANALYSIS'), 'news', 'news', 'title', '뉴스분석');
build(load('stock_study.js', 'STOCK_STUDY'), 'study', 'study', 'name', '종목공부');
build(load('stock_lessons.js', 'STOCK_LESSONS'), 'lesson', 'lesson', 'name', '주식공부');
build(load('estate_lessons.js', 'ESTATE_LESSONS'), 'estate', 'estate', 'name', '부동산공부');
build(load('calculators.js', 'CALCULATORS'), 'calc', 'calc', 'name', '계산기');
if (index.length < 213) throw new Error(`human-authored snapshot count below baseline: ${index.length} < 213`);

// ── 600종목 규칙 기반 자동분석 스냅샷. 검색 색인에서는 제외하고 앱 호환용으로만 유지한다. ──
// 뉴스·공부 콘텐츠와 달리 매일 시세·분석이 바뀌므로, 러너(update-analysis.yml)가 매 사이클
// generate_snapshots.js를 다시 실행해 자동 갱신한다(토큰 0 — 이미 계산된 데이터를 템플릿에 채울 뿐).
function stockFindingsHtml(block) {
  if (!block) return '';
  const names = { taro: 'TARO(기술)', diana: 'DIANA(재무)', nova: 'QUANT(확률·통계)', flow: 'FLOW(수급)' };
  let html = '';
  for (const k of ['taro', 'diana', 'nova', 'flow']) {
    const a = block[k];
    if (!a || !Array.isArray(a.findings) || !a.findings.length) continue;
    html += '<h2>' + esc(names[k]) + (a.score != null ? ' (' + a.score + '점)' : '') + '</h2>\n';
    html += '<ul>' + a.findings.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul>\n';
  }
  return html;
}

function buildStocks() {
  const TICKERS = load('tickers.js', 'TICKERS');
  const DATA = load('data.js', 'LIVE_DATA') || {};
  const AN = load('analysis.js', 'LIVE_ANALYSIS') || {};
  const AUTO = load('auto_analysis.js', 'LIVE_AUTO') || {};
  const HISTORY = load('history.js', 'LIVE_HISTORY') || {};
  const autoStocks = AUTO.stocks || {};
  const tickerNames = Object.fromEntries(TICKERS.map(t => [t.code, t.name]));
  const calls = { BUY: 0, HOLD: 0, SELL: 0 };
  const ranked = [];
  for (const [code, item] of Object.entries(autoStocks)) {
    const chief = item && item.chief;
    if (!chief || calls[chief.call] == null) continue;
    calls[chief.call]++;
    if (chief.call !== 'SELL' && typeof chief.total === 'number') {
      ranked.push({
        code, name: tickerNames[code] || code, total: chief.total, call: chief.call,
        confidence: typeof chief.confidence === 'number' ? chief.confidence : null
      });
    }
  }
  // ⭐ 2026-08-14: 홈 「오늘의 판단」 BUY 상위 종목이 판단 확신도순으로 바뀌었는데, 이 목록은
  // 상위 30개만 잘라서 홈 첫 화면에 내려보낸다. 예전처럼 종합점수순으로 자르면 "종합점수는
  // 낮지만 확신도가 가장 높은" 종목이 30위 밖으로 밀려나서, 전체 자동분석(auto_analysis.js)이
  // 백그라운드로 다 내려오기 전까지 첫 화면이 확신도 1~3위를 잘못 보여준다. 그래서 자를 때부터
  // 화면과 같은 기준(BUY 먼저 · 판단 확신도 높은 순 · 동률이면 종합점수)으로 정렬한다.
  // (ranked를 code→row 맵으로만 쓰는 스크리너에는 순서가 영향을 주지 않는다.)
  const conf = row => (typeof row.confidence === 'number' ? row.confidence : -1);
  ranked.sort((a, b) =>
    (a.call === 'BUY' ? 0 : 1) - (b.call === 'BUY' ? 0 : 1) ||
    conf(b) - conf(a) ||
    b.total - a.total ||
    a.name.localeCompare(b.name, 'ko'));
  const sourceInsight = AUTO.marketInsight || {};
  const marketInsight = {
    ...sourceInsight,
    generatedAt: sourceInsight.generatedAt || AUTO.generatedAt || '',
    sourceAsOf: sourceInsight.sourceAsOf || AUTO.priceLabel || '',
    calls: Object.values(calls).some(Boolean) ? calls : (sourceInsight.calls || calls),
    ranked: ranked.slice(0, 30)
  };
  // 홈에서 5.5MB history.js를 내려받지 않고도 "어제 → 오늘" 변화를 보여주기 위한
  // 500종목 경량 판단 스냅샷. 키를 짧게 유지해 첫 화면 전송량을 줄인다.
  // d/c/t=최신 날짜·판단·종합점수, pd/pc/pt=직전 기록, a/pa=분석가 점수, s/ps=성향.
  const axisKeys = ['taro', 'diana', 'nova', 'flow'];
  const compactAxes = (row, field) => axisKeys.map(key => {
    const value = row && row[key] && row[key][field];
    return value == null ? null : value;
  });
  const signals = {};
  for (const [code, item] of Object.entries(autoStocks)) {
    const chief = item && item.chief;
    if (!chief) continue;
    const rows = Array.isArray(HISTORY[code])
      ? HISTORY[code].slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
      : [];
    let previous = rows[rows.length - 1] || null;
    const currentDay = String(item.updated || AUTO.generatedAt || '').slice(0, 10);
    if (previous && String(previous.date || '').slice(0, 10) === currentDay &&
        previous.call === chief.call && Number(previous.total) === Number(chief.total)) {
      previous = rows[rows.length - 2] || null;
    }
    signals[code] = {
      d: item.updated || AUTO.generatedAt || '',
      c: chief.call || 'HOLD',
      t: chief.total,
      pd: previous && previous.date || '',
      pc: previous && previous.call || null,
      pt: previous && previous.total,
      a: compactAxes(item, 'score'),
      pa: compactAxes(previous, 'score'),
      s: compactAxes(item, 'stance'),
      ps: compactAxes(previous, 'stance')
    };
  }
  fs.writeFileSync(
    path.join(HERE, 'snap/home_brief.js'),
    '// 첫 화면 전용 경량 브리핑 · generate_snapshots.js 자동 생성\nconst HOME_BRIEF = ' +
      JSON.stringify({ generatedAt: AUTO.generatedAt || '', marketInsight, signals }) +
      ';\n'
  );
  const stocksData = DATA.stocks || {};
  let n = 0;
  for (const t of TICKERS) {
    const code = t.code, name = t.name;
    const isPrecision = AN[code] && typeof AN[code] === 'object';
    const block = isPrecision ? AN[code] : autoStocks[code];
    if (!block || !block.chief) continue;
    const sd = stocksData[code] || {};
    const chief = block.chief;
    const tierLabel = isPrecision ? 'AI 보조 정밀분석' : '규칙 기반 자동분석';
    const callKr = { BUY: '매수', HOLD: '보유', SELL: '매도' }[chief.call] || chief.call || '—';
    const priceDate = productionDate(DATA.date, 'data.js LIVE_DATA.date');
    const analysisRaw = block.updated || block.baseAt || AUTO.generatedAt || '';
    const analysisDate = analysisRaw ? productionDate(analysisRaw, `${code} analysis date`) : priceDate;
    const date = priceDate; // JSON-LD·메타에는 더 최신인 시세 기준일을 쓴다
    const title = `${name}(${code}) 주가: ${tierLabel} 판단 ${callKr}(${chief.call || '—'})`;
    const priceLine = sd.price ? `현재가 ${sd.price.toLocaleString('ko-KR')}원 (${sd.rate > 0 ? '+' : ''}${sd.rate}%)` : '';
    const desc = `${name}(${code}) ${priceLine}. ${tierLabel} 종합판단 ${chief.call || '—'}(${chief.total ?? '—'}점, 확신도 ${chief.confidence ?? '—'}%). ${(chief.reason || '').slice(0, 80)}`;
    let bodyHtml = '';
    bodyHtml += '<p>' + esc(`${tierLabel} · ${t.sector || ''} 업종`) + '</p>\n';
    bodyHtml += '<p>' + esc(`시세 기준 ${priceDate}${analysisDate !== priceDate ? ' · 분석 기준 ' + analysisDate : ''}`) + '</p>\n';
    if (priceLine) bodyHtml += '<p><strong>' + esc(priceLine) + '</strong></p>\n';
    const metrics = [];
    if (sd.per) metrics.push('PER ' + sd.per + '배');
    if (sd.pbr) metrics.push('PBR ' + sd.pbr + '배');
    if (sd.roe) metrics.push('ROE ' + sd.roe + '%');
    if (sd.cap) metrics.push('시가총액 ' + sd.cap);
    if (metrics.length) bodyHtml += '<p>' + esc(metrics.join(' · ')) + '</p>\n';
    bodyHtml += '<h2>개오팀 종합 판단</h2>\n';
    bodyHtml += '<p><strong>' + esc(`${chief.call || '—'} (종합 ${chief.total ?? '—'}점 · 확신도 ${chief.confidence ?? '—'}%)`) + '</strong></p>\n';
    if (chief.reason) bodyHtml += '<p>' + esc(chief.reason) + '</p>\n';
    if (chief.target) bodyHtml += '<p>' + esc(chief.target) + '</p>\n';
    if (chief.report) bodyHtml += '<p>' + esc(chief.report) + '</p>\n';
    bodyHtml += stockFindingsHtml(block);
    const canonicalUrl = `${BASE}snap/stock/${code}.html`;
    const interactiveUrl = `${BASE}?m=single&code=${code}`;
    const html = page({
      canonicalUrl, title, desc, date, updated: analysisDate,
      articleType: 'Article',
      bodyHtml,
      backHref: interactiveUrl,
      sourcesHtml: '',
      tag: `${tierLabel} · ${name}`,
      relatedHtml: relatedToHtml([
        ...TICKERS.filter(x => x.code !== code && x.sector === t.sector).slice(0, 2)
          .map(x => ({ url: `${BASE}snap/stock/${x.code}.html`, title: `${x.name} 주가와 오늘 판단 보기` })),
        { url: `${BASE}snap/index.html`, title: `${t.sector || '시장'} 관련 최신 뉴스 보기` }
      ]),
      // 600종목 자동/정밀 스냅샷은 룰엔진이 숫자만 바꿔 찍어내는 템플릿 페이지라
      // 구글 애드센스가 "가치가 별로 없는 콘텐츠(자동 생성)"로 판단할 위험이 커서 색인 제외한다.
      // 뉴스분석·주식공부·부동산공부·종목공부·계산기처럼 사람이 직접 쓴 글만 색인되게 유지.
      noindex: true,
    });
    fs.writeFileSync(path.join(HERE, `snap/stock/${code}.html`), html);
    n++;
  }
  console.log(`종목 스냅샷 생성 완료 — ${n}건 (snap/stock/*.html)`);
  if (n < 600) throw new Error(`stock snapshot count below baseline: ${n} < 600`);
}
buildStocks();

index.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
const latestLabels = { news: '뉴스분석', study: '종목공부', lesson: '주식공부', estate: '부동산공부' };
// 시장 급변기에 꼭 먼저 읽었으면 하는 글은 새 글이 생겨도 첫 번째에 유지한다.
// 고정을 해제할 때는 아래 값만 null로 바꾸면 된다.
const featuredLatestKey = { mode: 'lesson', id: 35 };
const latestPool = index.filter(x => latestLabels[x.mode]);
const featuredLatest = latestPool.find(x =>
  x.mode === featuredLatestKey.mode && Number(x.id) === featuredLatestKey.id
);
const orderedLatest = featuredLatest
  ? [featuredLatest, ...latestPool.filter(x => x !== featuredLatest)]
  : latestPool;
const latestPosts = orderedLatest
  .slice(0, 10)
  .map(x => ({
    id: x.id,
    mode: x.mode,
    label: latestLabels[x.mode],
    date: x.date,
    title: x.title,
    featured: Boolean(featuredLatest && x === featuredLatest)
  }));
const contentStats = index.reduce((stats, item) => {
  stats[item.mode] = (stats[item.mode] || 0) + 1;
  return stats;
}, { news: 0, study: 0, lesson: 0, estate: 0, calc: 0 });
fs.writeFileSync(
  path.join(HERE, 'snap/latest_posts.js'),
  '// generate_snapshots.js가 자동 생성하는 최신 글 10개 목록과 콘텐츠 수\n' +
    '// (히어로의 "최근 뉴스, 공부 자료 확인하기" 패널이 10개를 세로로 펼쳐 쓰고,\n' +
    '//  "지금 많이 보는 글"은 이 중 앞 5개만 골라 쓴다)\nconst LATEST_POSTS = ' +
    JSON.stringify(latestPosts, null, 1) + ';\nconst CONTENT_STATS = ' +
    JSON.stringify(contentStats, null, 1) + ';\n'
);
// ══════════════════════════════════════════════════════════════════════
// GAEO Research Hub — snap/index.html
// 원칙(docs/gaeo_design_system.md · Research Hub 항목):
//  · Generator-first — 이 파일이 다시 돌아도 허브 구조가 그대로 유지된다
//  · Research(news/study/lesson/estate)와 Utility(calc)를 숫자·화면 모두 분리
//  · 자동 종목페이지(snap/stock)는 index[]에 들어오지 않으므로 허브에도 없다
//  · 정밀분석은 기존 구조화 소스(deep_analysis_latest.js)를 재사용 — HTML 스크래핑 금지
//  · Featured는 인기·AI 판단이 아니라 아래의 결정적 규칙 하나뿐이다
//  · 홈의 featuredLatestKey(latest_posts.js)와는 무관 — 허브는 허브 규칙만 쓴다
// ══════════════════════════════════════════════════════════════════════
// 화면 표시용 라벨 — 원본 데이터의 emoji 태그(cat)는 그대로 두고 표시만 분리한다.
const HUB_LABELS = { news: '뉴스분석', study: '종목공부', lesson: '주식공부', estate: '부동산공부', calc: '계산기' };
const RESEARCH_MODES = ['news', 'study', 'lesson', 'estate'];
const researchItems = index.filter(x => RESEARCH_MODES.includes(x.mode));
const calcItems = index.filter(x => x.mode === 'calc');
const hubCount = index.reduce((m, x) => { m[x.mode] = (m[x.mode] || 0) + 1; return m; }, {});

// Featured 규칙(결정적): ① 발행일 최신 ② 같은 날짜면 news → study → lesson → estate
// ③ 그래도 같으면 id가 큰 글(나중 발행). calc·snap/stock은 후보 자체가 아니다.
const HUB_MODE_PRIORITY = { news: 0, study: 1, lesson: 2, estate: 3 };
const hubRecentPool = researchItems.slice().sort((a, b) =>
  (b.date || '').localeCompare(a.date || '') ||
  HUB_MODE_PRIORITY[a.mode] - HUB_MODE_PRIORITY[b.mode] ||
  (Number(b.id) || 0) - (Number(a.id) || 0));
const hubFeatured = hubRecentPool[0];
const hubRecentRows = hubRecentPool.slice(1, 5);

// 정밀분석 최신 3건 — generate_deep_analysis.js가 이미 만들어 두는 구조화 데이터 재사용.
// 파일이 없거나 비어 있으면 목록 없이 Archive 진입 링크만 남는다.
const deepLatestRaw = load('deep_analysis_latest.js', 'DEEP_ANALYSIS_LATEST');
const deepRows = (Array.isArray(deepLatestRaw) ? deepLatestRaw : []).slice(0, 3);
const DEEP_ARCHIVE_URL = BASE + 'research/deep-analysis/';

const hubRow = x =>
  `<li><a href="${esc(x.href)}"><span class="rt">${esc(x.title)}</span><span class="rm">${esc(HUB_LABELS[x.mode])} · ${esc(x.date)}</span></a></li>`;

// 카테고리 Section — 최근 몇 건만 보여주고 나머지는 하단 전체 기록에서 잇는다.
function hubSection(mode, anchor, blurb, n) {
  const items = researchItems.filter(x => x.mode === mode);
  const rows = items.slice(0, n).map(hubRow).join('\n');
  return `<section class="sec" id="${anchor}">
  <div class="sec-head"><h2>${esc(HUB_LABELS[mode])}</h2><p class="cnt">${items.length}건</p><p class="blurb">${esc(blurb)}</p></div>
  <div class="sec-body"><ul class="rows">
${rows}
  </ul>
  <a class="more" href="#archive">전체 기록에서 모두 보기 ↓</a></div>
</section>`;
}

const featuredHtml = hubFeatured ? `<div class="featured">
    <p class="fmeta">${esc(HUB_LABELS[hubFeatured.mode])} · ${esc(hubFeatured.date)}</p>
    <a class="ftitle" href="${esc(hubFeatured.href)}">${esc(hubFeatured.title)}</a>
  </div>` : '';

const deepListHtml = deepRows.length ? `<ul class="rows">
${deepRows.map(r =>
  `<li><a href="${esc(BASE + String(r.permalink || '').replace(/^\//, ''))}"><span class="rt">${esc(r.stockName)}${r.summary ? ' — ' + esc(r.summary) : ''}</span><span class="rm">정밀분석 · ${esc(r.date)}</span></a></li>`
).join('\n')}
  </ul>\n  ` : '';

const archiveListHtml = index.map(x =>
  `<li><span class="cat">${esc(HUB_LABELS[x.mode] || x.cat)}</span> <a href="${esc(x.href)}">${esc(x.title)}</a> <span class="d">${esc(x.date)}</span></li>`
).join('\n');

const HUB_TITLE = 'GAEO Research | 시장·기업 분석과 투자 공부';
const HUB_DESC = '뉴스분석·종목공부·주식공부·부동산공부 글과 정밀분석 기록, 투자 계산기를 한곳에서 찾아볼 수 있는 개오 애널리스트팀의 리서치 허브입니다.';

const indexPage = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/assets/fonts/wanted-sans/WantedSansVariable.css">
<title>${esc(HUB_TITLE)}</title>
<meta name="description" content="${esc(HUB_DESC)}">
<link rel="canonical" href="${BASE}snap/index.html">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(HUB_TITLE)}">
<meta property="og:description" content="${esc(HUB_DESC)}">
<meta property="og:image" content="${SHARE_IMAGE}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${SHARE_ALT}">
<meta property="og:url" content="${BASE}snap/index.html">
<meta property="og:site_name" content="GAEO">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(HUB_TITLE)}">
<meta name="twitter:description" content="${esc(HUB_DESC)}">
<meta name="twitter:image" content="${SHARE_IMAGE}">
<meta name="twitter:image:alt" content="${SHARE_ALT}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3152692263439634"
     crossorigin="anonymous"></script>
<style>
:root{--paper:#fff;--bg:#fafafa;--ink:#171a20;--muted:#707783;--line:#e7e9ed;--accent:#233b62}
@media (prefers-color-scheme:dark){:root{--paper:#101315;--bg:#0b0d0f;--ink:#f3f5f7;--muted:#9aa4ad;--line:#2a2f34;--accent:#a9c1e8}}
*{box-sizing:border-box}
html{background:var(--paper)}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Wanted Sans Variable","Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Segoe UI","Noto Sans KR","Malgun Gothic",sans-serif;line-height:1.7;word-break:keep-all;overflow-wrap:anywhere}/* 브라우저 기본 굵기(bold=700)로 새는 것을 막는다 — 사이트 전체가 400/500/600 세 단계다. */b,strong{font-weight:600}h1,h2,h3,h4,h5,h6{font-weight:600;text-wrap:balance}th{font-weight:600}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono","Courier New",monospace;font-size:.92em}
.shell{width:min(1040px,calc(100% - 40px));margin:0 auto;padding:30px 0 80px}
a{color:inherit;text-decoration:none}
.brand{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid var(--line);font-size:13px}
.brand a{font-weight:600;letter-spacing:-.02em}
.brand span{color:var(--muted)}
header.hero{padding:44px 0 0}
h1{margin:0;font-size:clamp(30px,5vw,42px);font-weight:600;letter-spacing:-.045em;line-height:1.12}
.intro{max-width:640px;margin:14px 0 0;color:var(--muted);font-size:15px;line-height:1.75}
nav.toc{display:flex;flex-wrap:wrap;gap:4px 20px;margin:30px 0 0;padding:14px 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--line);font-size:13px;font-weight:600}
nav.toc a{color:var(--muted);padding:2px 0;border-bottom:2px solid transparent}
nav.toc a:hover,nav.toc a:focus-visible{color:var(--ink);border-bottom-color:var(--ink)}
.sec{display:grid;grid-template-columns:180px minmax(0,1fr);gap:36px;padding:38px 0;border-bottom:1px solid var(--line)}
.sec-head h2{margin:0;font-size:19px;font-weight:600;letter-spacing:-.02em}
.cnt{margin:6px 0 0;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.blurb{margin:10px 0 0;color:var(--muted);font-size:13px;line-height:1.7}
.rows{margin:0;padding:0;list-style:none}
.rows li{border-bottom:1px solid var(--line)}
.rows li:last-child{border-bottom:0}
.rows a{display:block;padding:12px 2px}
.rows a:hover .rt,.rows a:focus-visible .rt{color:var(--accent)}
.rt{display:block;font-size:15.5px;font-weight:600;line-height:1.5;letter-spacing:-.01em}
.rm{display:block;margin-top:3px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.more{display:inline-block;margin-top:14px;color:var(--muted);font-size:13px;font-weight:600}
.more:hover,.more:focus-visible{color:var(--ink)}
.featured{padding-bottom:20px;margin-bottom:8px;border-bottom:1px solid var(--line)}
.fmeta{margin:0 0 8px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.ftitle{display:block;font-size:clamp(20px,3vw,26px);font-weight:600;line-height:1.35;letter-spacing:-.025em}
.ftitle:hover,.ftitle:focus-visible{color:var(--accent)}
.entry{display:inline-block;margin-top:14px;color:var(--accent);font-size:13.5px;font-weight:600}
#archive .rowsarchive{margin:0;padding:0;list-style:none;max-width:760px}
#archive li{padding:10px 2px;border-bottom:1px solid var(--line);font-size:14.5px;line-height:1.6}
#archive li:last-child{border-bottom:0}
#archive li>a{font-weight:600}
#archive li>a:hover,#archive li>a:focus-visible{color:var(--accent)}
.cat{display:inline-block;margin-right:6px;color:var(--muted);font-size:11.5px}
.d{display:block;margin-top:2px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
footer.foot{margin-top:40px;color:var(--muted);font-size:12.5px;line-height:1.7}
@media(max-width:760px){
.shell{width:min(100% - 32px,1040px);padding-top:22px}
header.hero{padding-top:30px}
.sec{grid-template-columns:1fr;gap:16px;padding:30px 0}
}
</style>
<link rel="stylesheet" href="/editorial-accessibility.css?v=20260903-v1">
</head>
<body>
<a class="skip-link" href="#main-content">본문으로 바로가기</a>
<main class="shell" id="main-content" tabindex="-1">
  <header class="brand"><a href="${BASE}">GAEO</a><span>Research</span></header>
  <header class="hero">
    <h1>GAEO Research</h1>
    <p class="intro">시장과 기업을 이해하기 위한 개오 애널리스트팀의 분석과 학습 기록입니다.
    리서치 글 ${researchItems.length}건과 정밀분석 기록, 투자 계산기를 한곳에서 볼 수 있어요.</p>
  </header>
  <nav class="toc" aria-label="리서치 허브 목차">
    <a href="#recent">최근 분석</a>
    <a href="#news">뉴스분석</a>
    <a href="#study">종목공부</a>
    <a href="#lesson">주식공부</a>
    <a href="#deep">정밀분석</a>
    <a href="#estate">부동산공부</a>
    <a href="#tools">계산기</a>
    <a href="#archive">전체 기록</a>
  </nav>

  <section class="sec" id="recent">
    <div class="sec-head"><h2>최근 분석</h2><p class="blurb">가장 최근에 발행된 리서치 글이에요. 최신 발행일 순으로 자동 선정됩니다.</p></div>
    <div class="sec-body">
  ${featuredHtml}
  <ul class="rows">
${hubRecentRows.map(hubRow).join('\n')}
  </ul>
    </div>
  </section>

${hubSection('news', 'news', '시장을 움직인 기사와 이슈를 초보자 눈높이로 풀어쓴 심층 분석입니다.', 6)}

${hubSection('study', 'study', '한 기업을 처음 공부하는 사람을 위한 종목별 기초 리서치입니다.', 6)}

${hubSection('lesson', 'lesson', '주식 투자에 필요한 개념과 제도를 하나씩 배우는 학습 글입니다.', 6)}

  <section class="sec" id="deep">
    <div class="sec-head"><h2>정밀분석 기록</h2><p class="blurb">직접 지정해 더 깊게 분석한 종목의 당시 기록입니다. 각 기록은 최신 판단으로 덮어쓰지 않고 보존합니다.</p></div>
    <div class="sec-body">${deepListHtml}<a class="entry" href="${DEEP_ARCHIVE_URL}">정밀분석 기록 보기 →</a></div>
  </section>

${hubSection('estate', 'estate', '전세·청약·대출 등 부동산과 주거 재무를 공부하는 글입니다.', 6)}

  <section class="sec" id="tools">
    <div class="sec-head"><h2>계산기</h2><p class="cnt">${calcItems.length}개</p><p class="blurb">계산기 등 도구 페이지입니다. 위 리서치 글 수에는 포함하지 않아요.</p></div>
    <div class="sec-body"><ul class="rows">
${calcItems.map(x => `<li><a href="${esc(x.href)}"><span class="rt">${esc(x.title)}</span></a></li>`).join('\n')}
    </ul></div>
  </section>

  <section class="sec" id="archive">
    <div class="sec-head"><h2>전체 기록</h2><p class="cnt">전체 ${index.length}건 · 리서치 ${researchItems.length} · 도구 ${calcItems.length}</p><p class="blurb">발행한 모든 글을 최신순으로 담은 목록입니다.</p></div>
    <div class="sec-body"><ul class="rowsarchive">
${archiveListHtml}
    </ul></div>
  </section>

  <footer class="foot">개오 애널리스트팀의 분석 의견이며 투자 권유가 아니에요. 투자 판단과 그 책임은 투자자 본인에게 있습니다. <a href="${BASE}disclaimer.html">데이터 출처·면책조항</a> · <a href="${BASE}about.html">사이트 소개</a> · <a href="${BASE}privacy.html">개인정보처리방침</a></footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'snap/index.html'), indexPage);

console.log(`스냅샷 생성 완료 — ${index.length}건 (news_analysis/stock_study/stock_lessons/estate_lessons/calculators) + snap/index.html`);
