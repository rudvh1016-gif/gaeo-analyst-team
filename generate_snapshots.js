// 정적 스냅샷 생성기 — 자바스크립트를 실행하지 않는 크롤러/AI 도구도 글 내용을
// 바로 읽을 수 있도록, 각 글의 "읽기 전용 정적 HTML 사본"을 /snap/ 아래에 만든다.
// 실제 인터랙티브 화면(index.html?m=...)이 정답(canonical)이고, 이 스냅샷은
// 검색엔진·AI 크롤러向 보조 사본이다 — 화면에 보이는 내용과 100% 동일해야 한다(클로킹 금지).
// 새 글을 등록할 때마다 `node generate_snapshots.js`로 다시 실행한다(generate_sitemap.js와 세트).
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const BASE = 'https://gaeoteam.com/';
const SITE_NAME = 'Gaeo · 개오 애널리스트팀';

function load(file, varname) {
  try {
    return new Function(fs.readFileSync(path.join(HERE, file), 'utf8') + ';return ' + varname + ';')();
  } catch (e) { return []; }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 본문 미니 마크다운(## / - / **굵게** / [[img:..]]) → 읽기용 평범한 HTML로 변환
function bodyToHtml(raw) {
  const lines = String(raw || '').split('\n');
  let html = '', para = [], list = [];
  const flushPara = () => { if (para.length) { html += '<p>' + para.join('<br>') + '</p>\n'; para = []; } };
  const flushList = () => { if (list.length) { html += '<ul>' + list.map(li => '<li>' + li + '</li>').join('') + '</ul>\n'; list = []; } };
  const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  for (const raw0 of lines) {
    const line = raw0.trim();
    if (!line) { flushList(); flushPara(); continue; }
    if (/^\[\[img:/.test(line)) {
      flushList(); flushPara();
      const m = line.match(/^\[\[img:[^|]+\|(.+?)\]\]$/);
      if (m) html += '<p class="cap">🖼️ ' + inline(m[1]) + '</p>\n';
      continue;
    }
    if (line.startsWith('## ')) { flushList(); flushPara(); html += '<h2>' + inline(line.slice(3)) + '</h2>\n'; continue; }
    if (line.startsWith('- ')) { flushPara(); list.push(inline(line.slice(2))); continue; }
    flushList(); para.push(inline(line));
  }
  flushList(); flushPara();
  return html;
}

function page({ url, title, desc, date, articleType, bodyHtml, backHref, sourcesHtml, tag }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": articleType || "Article",
    "headline": title,
    "datePublished": date,
    "dateModified": date,
    "description": desc,
    "inLanguage": "ko-KR",
    "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": BASE },
    "publisher": { "@type": "Organization", "name": SITE_NAME, "url": BASE },
    "mainEntityOfPage": url
  };
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(SITE_NAME)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${BASE}og-image.png">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
:root{--bg:#F5F5F7;--ink:#1D1D1F;--t2:#6E6E73;--sky:#0071E3;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#000;--ink:#F5F5F7;--t2:#98989D;--sky:#0A84FF;--card:#1C1C1E}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;line-height:1.7;word-break:keep-all}
.wrap{max-width:720px;margin:0 auto;padding:28px 20px 60px}
.top{font-size:13px;margin-bottom:18px}
.top a{color:var(--sky);text-decoration:none;font-weight:600}
.card{background:var(--card);border-radius:16px;padding:26px 24px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
h1{font-size:22px;margin:0 0 8px;line-height:1.4}
.meta{color:var(--t2);font-size:13px;margin-bottom:18px}
.tag{display:inline-block;background:rgba(0,113,227,.1);color:var(--sky);font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px;margin-bottom:10px}
.summary{color:var(--t2);font-size:14.5px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid rgba(128,128,128,.2)}
h2{font-size:17px;margin:22px 0 8px}
p{margin:0 0 12px;font-size:15px}
p.cap{color:var(--t2);font-style:italic;font-size:13.5px}
ul{margin:0 0 12px;padding-left:20px}
li{margin-bottom:6px;font-size:15px}
.cta{display:inline-block;margin-top:22px;background:var(--sky);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:99px}
.sources{margin-top:26px;font-size:12.5px;color:var(--t2)}
.sources a{color:var(--t2)}
.disc{margin-top:20px;font-size:12px;color:var(--t2)}
</style>
</head>
<body>
<div class="wrap">
  <div class="top"><a href="${BASE}">← ${esc(SITE_NAME)} 홈</a></div>
  <div class="card">
    ${tag ? '<span class="tag">' + esc(tag) + '</span>' : ''}
    <h1 class="daum-wm-title">${esc(title)}</h1>
    <div class="meta daum-wm-datetime">📅 ${esc(date)}</div>
    <div class="summary">${esc(desc)}</div>
    <div class="daum-wm-content">
    ${bodyHtml}
    </div>
    <a class="cta" href="${esc(backHref)}">📊 인터랙티브 화면에서 이 글 보기 →</a>
    ${sourcesHtml || ''}
    <div class="disc">이 글은 개오팀의 분석 의견이며 투자 권유가 아니에요. 투자 판단과 그 책임은 투자자 본인에게 있습니다.</div>
  </div>
</div>
</body>
</html>
`;
}

function sourcesToHtml(sources) {
  if (!Array.isArray(sources) || !sources.length) return '';
  const items = sources.map(s => {
    if (s.url) return '<li><a href="' + esc(s.url) + '" rel="nofollow">' + esc(s.name || s.t || s.url) + '</a></li>';
    const nm = s.t ? (s.t + (s.p ? ' — ' + s.p : '') + (s.d ? ' (' + s.d + ')' : '')) : (s.name || '');
    return '<li>' + esc(nm) + '</li>';
  }).join('');
  return '<div class="sources">📎 출처<ul>' + items + '</ul></div>';
}

const outDirs = ['snap/news', 'snap/study', 'snap/lesson', 'snap/estate'];
for (const d of outDirs) fs.mkdirSync(path.join(HERE, d), { recursive: true });

const index = [];

function build(list, kind, folder, titleKey, tagPrefix) {
  for (const item of list) {
    const title = item[titleKey] || item.title || item.name;
    const url = `${BASE}?m=${kind}&id=${item.id}`;
    const html = page({
      url,
      title,
      desc: item.summary || '',
      date: item.date,
      articleType: 'Article',
      bodyHtml: bodyToHtml(item.body),
      backHref: url,
      sourcesHtml: sourcesToHtml(item.sources),
      tag: item.tag,
    });
    fs.writeFileSync(path.join(HERE, `snap/${folder}/${item.id}.html`), html);
    index.push({ href: `snap/${folder}/${item.id}.html`, title, date: item.date, cat: tagPrefix });
  }
}

build(load('news_analysis.js', 'NEWS_ANALYSIS'), 'news', 'news', 'title', '📰 뉴스분석');
build(load('stock_study.js', 'STOCK_STUDY'), 'study', 'study', 'name', '📚 종목공부');
build(load('stock_lessons.js', 'STOCK_LESSONS'), 'lesson', 'lesson', 'name', '🎓 주식공부');
build(load('estate_lessons.js', 'ESTATE_LESSONS'), 'estate', 'estate', 'name', '🏠 부동산공부');

index.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
const listHtml = index.map(x =>
  `<li><span class="cat">${esc(x.cat)}</span> <a href="${esc(x.href)}">${esc(x.title)}</a> <span class="d">${esc(x.date)}</span></li>`
).join('\n');

const indexPage = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>전체 글 목록 — ${esc(SITE_NAME)}</title>
<meta name="description" content="개오 애널리스트팀 뉴스분석·종목공부·주식공부·부동산공부 전체 글 목록입니다.">
<link rel="canonical" href="${BASE}">
<style>
body{margin:0;background:#F5F5F7;color:#1D1D1F;font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.8}
@media (prefers-color-scheme:dark){body{background:#000;color:#F5F5F7}}
.wrap{max-width:720px;margin:0 auto;padding:28px 20px 60px}
a{color:#0071E3;text-decoration:none;font-weight:600}
ul{list-style:none;padding:0}
li{padding:10px 0;border-bottom:1px solid rgba(128,128,128,.15);font-size:14.5px}
.cat{display:inline-block;font-size:11.5px;color:#6E6E73;margin-right:6px}
.d{display:block;font-size:12px;color:#6E6E73;margin-top:2px}
</style>
</head>
<body>
<div class="wrap">
  <p><a href="${BASE}">← ${esc(SITE_NAME)} 홈</a></p>
  <h1 style="font-size:20px">전체 글 목록 (${index.length}건)</h1>
  <ul>${listHtml}</ul>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'snap/index.html'), indexPage);

console.log(`스냅샷 생성 완료 — ${index.length}건 (news_analysis/stock_study/stock_lessons/estate_lessons) + snap/index.html`);
