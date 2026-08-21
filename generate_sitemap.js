// sitemap.xml 재생성 스크립트 — 뉴스분석/종목공부/주식공부/부동산공부에 글이 늘어날 때마다
// `node generate_sitemap.js`로 다시 실행해 최신 목록을 반영한다.
const fs = require('fs');

// 글의 id와 실제 작성일을 함께 읽는다 — lastmod에 글의 진짜 날짜를 써야 구글이 신뢰한다.
function entries(file, varname) {
  try {
    const arr = new Function(fs.readFileSync(file, 'utf8') + ';return ' + varname + ';')();
    return Array.isArray(arr) ? arr.map(x => ({ id: x.id, date: x.updated || x.date })) : [];
  } catch (e) { return []; }
}

function readDeepAnalysisManifest() {
  try {
    const value = JSON.parse(fs.readFileSync('deep_analysis_manifest.json', 'utf8'));
    if (!value || typeof value !== 'object') return { records: [], archivePages: [], stockHubs: [] };
    return { records: [], archivePages: [], stockHubs: [], ...value };
  } catch (e) { return { records: [], archivePages: [], stockHubs: [] }; }
}

const BASE = 'https://gaeoteam.com/';
const today = new Date().toISOString().slice(0, 10);
const ymd = d => (/^\d{4}-\d{2}-\d{2}$/.test(String(d || '')) ? d : today);
const urls = [{ loc: BASE, prio: '1.0', mod: today }, { loc: BASE + 'snap/index.html', prio: '0.5', mod: today },
  { loc: BASE + 'about.html', prio: '0.4', mod: today }, { loc: BASE + 'contact.html', prio: '0.3', mod: today },
  { loc: BASE + 'privacy.html', prio: '0.3', mod: today },
  { loc: BASE + 'changelog.html', prio: '0.4', mod: today }];
// 자바스크립트를 실행하지 않는 검색봇도 읽을 수 있는 정적 스냅샷(/snap/...)을 sitemap에 올린다.
// sitemap, 스냅샷 canonical, 관련 글 내부 링크가 모두 같은 정적 URL을 가리키도록 유지한다.
// lastmod는 매번 "오늘"로 찍으면 구글이 신뢰하지 않고 무시하므로, 각 글의 실제 작성일을 쓴다.
const add = (m, folder, list, prio) => list.forEach(x =>
  urls.push({ loc: BASE + 'snap/' + folder + '/' + x.id + '.html', prio, mod: ymd(x.date) }));
add('news', 'news', entries('news_analysis.js', 'NEWS_ANALYSIS'), '0.7');
add('study', 'study', entries('stock_study.js', 'STOCK_STUDY'), '0.6');
add('lesson', 'lesson', entries('stock_lessons.js', 'STOCK_LESSONS'), '0.6');
add('estate', 'estate', entries('estate_lessons.js', 'ESTATE_LESSONS'), '0.6');
add('calc', 'calc', entries('calculators.js', 'CALCULATORS'), '0.7');
const deepManifest = readDeepAnalysisManifest();
deepManifest.archivePages.forEach(x => urls.push({ loc: x.loc, prio: '0.7', mod: ymd(x.lastmod) }));
// 종목별 대표 페이지가 "종목명 주가 전망" 검색의 착지점이다. 같은 종목의 날짜별
// 스냅샷보다 우선순위를 높게 줘서, 구글이 옛 기록 대신 대표 페이지를 고르게 한다.
deepManifest.stockHubs.forEach(x => urls.push({ loc: x.loc, prio: '0.9', mod: ymd(x.lastmod) }));
deepManifest.records.forEach(x => urls.push({ loc: x.loc, prio: '0.8', mod: ymd(x.lastmod) }));
// 개별 종목 자동분석 스냅샷(snap/stock/<code>.html, tickers.js 전체)은 룰엔진이 숫자만 바꿔 찍어내는
// 템플릿 페이지라 구글 애드센스 품질심사에서 "가치가 별로 없는 콘텐츠"로 잡힐 위험이 커서
// sitemap·색인 대상에서 제외한다(generate_snapshots.js에서 noindex 메타도 함께 넣음).
// 사이트 내부 링크(?m=single&code=)로는 계속 접근 가능하며, 검색엔진 색인만 빠진다.

const body = urls.map(u =>
  '  <url>\n    <loc>' + u.loc.replace(/&/g, '&amp;') + '</loc>\n    <lastmod>' + u.mod + '</lastmod>\n    <priority>' + u.prio + '</priority>\n  </url>'
).join('\n');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n';
fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml 갱신 완료 —', urls.length, '개 URL');
