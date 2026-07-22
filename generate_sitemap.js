// sitemap.xml 재생성 스크립트 — 뉴스분석/종목공부/주식공부/부동산공부에 글이 늘어날 때마다
// `node generate_sitemap.js`로 다시 실행해 최신 목록을 반영한다.
const fs = require('fs');

function ids(file, varname) {
  try {
    const arr = new Function(fs.readFileSync(file, 'utf8') + ';return ' + varname + ';')();
    return Array.isArray(arr) ? arr.map(x => x.id) : [];
  } catch (e) { return []; }
}

const BASE = 'https://rudvh1016-gif.github.io/gaeo-analyst-team/';
const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: BASE, prio: '1.0' }];
const add = (m, list, prio) => list.forEach(id => urls.push({ loc: BASE + '?m=' + m + '&id=' + id, prio }));
add('news', ids('news_analysis.js', 'NEWS_ANALYSIS'), '0.7');
add('study', ids('stock_study.js', 'STOCK_STUDY'), '0.6');
add('lesson', ids('stock_lessons.js', 'STOCK_LESSONS'), '0.6');
add('estate', ids('estate_lessons.js', 'ESTATE_LESSONS'), '0.6');

const body = urls.map(u =>
  '  <url>\n    <loc>' + u.loc.replace(/&/g, '&amp;') + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <priority>' + u.prio + '</priority>\n  </url>'
).join('\n');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n';
fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml 갱신 완료 —', urls.length, '개 URL');
