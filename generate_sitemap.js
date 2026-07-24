// sitemap.xml 재생성 스크립트 — 뉴스분석/종목공부/주식공부/부동산공부에 글이 늘어날 때마다
// `node generate_sitemap.js`로 다시 실행해 최신 목록을 반영한다.
const fs = require('fs');

function ids(file, varname) {
  try {
    const arr = new Function(fs.readFileSync(file, 'utf8') + ';return ' + varname + ';')();
    return Array.isArray(arr) ? arr.map(x => x.id) : [];
  } catch (e) { return []; }
}

const BASE = 'https://gaeoteam.com/';
const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: BASE, prio: '1.0' }, { loc: BASE + 'snap/index.html', prio: '0.5' }];
// 크롤러(특히 자바스크립트를 실행하지 않는 봇)向으로는 정적 스냅샷(/snap/...)을 sitemap에 올린다.
// 스냅샷 페이지의 <link rel="canonical">이 아래 인터랙티브 URL(?m=...)을 가리켜 검색 순위 신호를 그쪽으로 모아준다.
const add = (m, folder, list, prio) => list.forEach(id => urls.push({ loc: BASE + 'snap/' + folder + '/' + id + '.html', prio }));
add('news', 'news', ids('news_analysis.js', 'NEWS_ANALYSIS'), '0.7');
add('study', 'study', ids('stock_study.js', 'STOCK_STUDY'), '0.6');
add('lesson', 'lesson', ids('stock_lessons.js', 'STOCK_LESSONS'), '0.6');
add('estate', 'estate', ids('estate_lessons.js', 'ESTATE_LESSONS'), '0.6');
// 500종목 개별 정밀/자동분석 스냅샷 — "OO 전망/주가" 검색 유입용 랜딩페이지(snap/stock/<code>.html)
try {
  const TICKERS = new Function(fs.readFileSync('tickers.js', 'utf8') + ';return TICKERS;')();
  TICKERS.forEach(t => urls.push({ loc: BASE + 'snap/stock/' + t.code + '.html', prio: '0.5' }));
} catch (e) {}

const body = urls.map(u =>
  '  <url>\n    <loc>' + u.loc.replace(/&/g, '&amp;') + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <priority>' + u.prio + '</priority>\n  </url>'
).join('\n');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n';
fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml 갱신 완료 —', urls.length, '개 URL');
