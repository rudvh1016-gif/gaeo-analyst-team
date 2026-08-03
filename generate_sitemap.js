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
const urls = [{ loc: BASE, prio: '1.0' }, { loc: BASE + 'snap/index.html', prio: '0.5' },
  { loc: BASE + 'about.html', prio: '0.4' }, { loc: BASE + 'contact.html', prio: '0.3' }, { loc: BASE + 'privacy.html', prio: '0.3' }];
// 자바스크립트를 실행하지 않는 검색봇도 읽을 수 있는 정적 스냅샷(/snap/...)을 sitemap에 올린다.
// sitemap, 스냅샷 canonical, 관련 글 내부 링크가 모두 같은 정적 URL을 가리키도록 유지한다.
const add = (m, folder, list, prio) => list.forEach(id => urls.push({ loc: BASE + 'snap/' + folder + '/' + id + '.html', prio }));
add('news', 'news', ids('news_analysis.js', 'NEWS_ANALYSIS'), '0.7');
add('study', 'study', ids('stock_study.js', 'STOCK_STUDY'), '0.6');
add('lesson', 'lesson', ids('stock_lessons.js', 'STOCK_LESSONS'), '0.6');
add('estate', 'estate', ids('estate_lessons.js', 'ESTATE_LESSONS'), '0.6');
add('calc', 'calc', ids('calculators.js', 'CALCULATORS'), '0.7');
// 500종목 개별 정밀/자동분석 스냅샷(snap/stock/<code>.html)은 룰엔진이 숫자만 바꿔 찍어내는
// 템플릿 페이지라 구글 애드센스 품질심사에서 "가치가 별로 없는 콘텐츠"로 잡힐 위험이 커서
// sitemap·색인 대상에서 제외한다(generate_snapshots.js에서 noindex 메타도 함께 넣음).
// 사이트 내부 링크(?m=single&code=)로는 계속 접근 가능하며, 검색엔진 색인만 빠진다.

const body = urls.map(u =>
  '  <url>\n    <loc>' + u.loc.replace(/&/g, '&amp;') + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <priority>' + u.prio + '</priority>\n  </url>'
).join('\n');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n';
fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml 갱신 완료 —', urls.length, '개 URL');
