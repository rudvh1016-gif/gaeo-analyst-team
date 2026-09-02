// rss.xml 생성 스크립트 — 뉴스분석/종목공부/주식공부/부동산공부/계산기의 최신 글을 RSS 2.0으로 뽑는다.
//
// 왜 필요한가:
//   네이버 서치어드바이저는 "콘텐츠 업데이트가 잦은 사이트는 RSS를 제출하라"고 안내한다.
//   RSS를 제출해 두면 네이버 검색로봇이 사이트를 훑으러 오기 전에도 새 글을 먼저 알아채서
//   검색결과 반영이 빨라진다. sitemap.xml과 역할이 겹치는 것 같지만 sitemap은 "이런 주소가 있다"는
//   목록이고 RSS는 "방금 이런 글이 새로 올라왔다"는 알림이라 네이버 쪽에선 둘 다 받는다.
//
// 실행: node generate_rss.js  (generate_sitemap.js와 같은 타이밍에 함께 돌린다)
const fs = require('fs');
const { contentUrl } = require('./growth_urls.js');

const BASE = 'https://gaeoteam.com/';
const SITE_NAME = 'Gaeo · 개오 애널리스트팀';
const SITE_DESC = '한국 주식 600종목의 규칙 기반 자동분석과 달라진 이유, 그리고 주식·부동산 기초를 초보자 눈높이로 풀어주는 리서치입니다.';
const MAX_ITEMS = 50; // 네이버 권장 범위. 너무 많으면 오히려 수집이 느려진다.

function load(file, varname) {
  try {
    const arr = new Function(fs.readFileSync(file, 'utf8') + ';return ' + varname + ';')();
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

// XML에 그대로 넣으면 깨지는 문자 처리. 본문 요약은 CDATA를 쓰지 않고 이스케이프로 통일한다.
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// RSS의 pubDate는 RFC-822 형식이어야 한다. 글에는 날짜(YYYY-MM-DD)만 있으므로
// 한국시간 09:00로 고정해 UTC로 변환한다(순서만 정확하면 되므로 시각 자체는 중요치 않다).
function rfc822(dateStr) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || ''));
  if (!m) throw new Error(`RSS item has invalid publication date: "${dateStr || ''}"`);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 0, 0, 0));
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() + 1 !== +m[2] || d.getUTCDate() !== +m[3]) {
    throw new Error(`RSS item has invalid publication date: "${dateStr}"`);
  }
  return d.toUTCString();
}

const SOURCES = [
  { file: 'news_analysis.js', varname: 'NEWS_ANALYSIS', folder: 'news', titleKey: 'title', cat: '뉴스분석' },
  { file: 'stock_study.js', varname: 'STOCK_STUDY', folder: 'study', titleKey: 'name', cat: '종목공부' },
  { file: 'stock_lessons.js', varname: 'STOCK_LESSONS', folder: 'lesson', titleKey: 'name', cat: '주식공부' },
  { file: 'estate_lessons.js', varname: 'ESTATE_LESSONS', folder: 'estate', titleKey: 'name', cat: '부동산공부' },
  { file: 'calculators.js', varname: 'CALCULATORS', folder: 'calc', titleKey: 'name', cat: '계산기' },
];

const items = [];
for (const s of SOURCES) {
  for (const x of load(s.file, s.varname)) {
    const title = x[s.titleKey] || x.title || x.name;
    if (!title) continue;
    items.push({
      title,
      link: contentUrl(s.folder, x.id),
      desc: x.summary || '',
      date: x.updated || x.date,
      cat: s.cat,
    });
  }
}

// 최신 글이 위로. 같은 날짜면 순서는 상관없다.
items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
const picked = items.slice(0, MAX_ITEMS);
for (const item of picked) {
  if (!item.link) throw new Error(`RSS item has invalid canonical fields: ${item.cat}`);
}

const body = picked.map(it => `  <item>
    <title>${esc(it.title)}</title>
    <link>${esc(it.link)}</link>
    <guid isPermaLink="true">${esc(it.link)}</guid>
    <category>${esc(it.cat)}</category>
    <description>${esc(it.desc)}</description>
    <pubDate>${rfc822(it.date)}</pubDate>
  </item>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(SITE_NAME)}</title>
  <link>${BASE}</link>
  <description>${esc(SITE_DESC)}</description>
  <language>ko</language>
  <lastBuildDate>${picked.length ? rfc822(picked[0].date) : 'Thu, 01 Jan 1970 00:00:00 GMT'}</lastBuildDate>
  <atom:link href="${BASE}rss.xml" rel="self" type="application/rss+xml" />
${body}
</channel>
</rss>
`;

fs.writeFileSync('rss.xml', xml);
console.log('rss.xml 생성 완료 —', picked.length, '건 (전체', items.length, '건 중 최신)');
