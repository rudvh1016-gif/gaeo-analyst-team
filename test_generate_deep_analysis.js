const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  normalizePublishedRecords,
  renderSnapshotPage,
  renderArchivePage,
  buildLatestRecords,
  buildManifest,
} = require('./deep_analysis_publish');
const { generateAll } = require('./generate_deep_analysis');

function snapshot(updated, name = '공개 보고서') {
  return {
    updated,
    base: 14370,
    baseAt: '2026-08-13 종가',
    taro: { score: 45, stance: 'bear', findings: ['기술 근거 <확인>'] },
    diana: { score: 50, stance: 'neu', findings: ['재무 근거'] },
    nova: { score: 35, stance: 'bear', findings: ['확률통계 근거'] },
    flow: { score: 42, stance: 'bear', findings: ['수급 근거'] },
    chief: {
      call: 'SELL', total: 34, confidence: 65,
      reason: `${name} 종합 판단 근거`, target: '당시 확인 구간', report: '당시 공개 본문',
    },
  };
}

const tickers = [{ code: '002990', name: '금호건설', sector: '건설·건자재' }];
const record = normalizePublishedRecords({ '002990': [snapshot('2026-08-13 21:37')] }, tickers)[0];
const html = renderSnapshotPage(record, { baseUrl: 'https://gaeoteam.com/' });

const hostile = normalizePublishedRecords({
  '002990': [snapshot('2026-08-13 21:37')],
}, [{ code: '002990', name: '</title><script>alert(1)</script>', sector: '<img src=x onerror=alert(1)>' }])[0];
const hostileHtml = renderSnapshotPage(hostile, { baseUrl: 'https://gaeoteam.com/' });
assert.doesNotMatch(hostileHtml, /<script>alert\(1\)<\/script>/);
assert.doesNotMatch(hostileHtml, /<img src=x onerror=alert\(1\)>/);

const sameDayMorning = normalizePublishedRecords({
  '002990': [snapshot('2026-08-13 09:30')],
}, tickers)[0];
const sameDayEvening = normalizePublishedRecords({
  '002990': [snapshot('2026-08-13 21:37')],
}, tickers)[0];
const morningHtml = renderSnapshotPage(sameDayMorning, { baseUrl: 'https://gaeoteam.com/' });
const eveningHtml = renderSnapshotPage(sameDayEvening, { baseUrl: 'https://gaeoteam.com/' });
const headValue = (source, pattern) => source.match(pattern)?.[1];
assert.notEqual(headValue(morningHtml, /<title>([^<]+)<\/title>/), headValue(eveningHtml, /<title>([^<]+)<\/title>/));
assert.notEqual(
  headValue(morningHtml, /<meta name="description" content="([^"]+)">/),
  headValue(eveningHtml, /<meta name="description" content="([^"]+)">/),
);

assert.match(html, /<title>금호건설\(002990\) 정밀분석 · 2026년 8월 13일 21:37 \| GAEO<\/title>/);
assert.match(html, /<link rel="canonical" href="https:\/\/gaeoteam\.com\/research\/deep-analysis\/002990\/2026-08-13-2137\/">/);
assert.doesNotMatch(html, /noindex/i, '정상 Snapshot은 indexable이어야 한다');
assert.match(html, /2026년 8월 13일 21:37 당시 분석/);
assert.match(html, /당시 기준가/);
assert.match(html, /기술 근거 &lt;확인&gt;/, '공개 본문은 초기 HTML에 안전하게 출력한다');
assert.match(html, /href="https:\/\/gaeoteam\.com\/\?m=single&amp;code=002990"/);
assert.match(html, /href="https:\/\/gaeoteam\.com\/research\/deep-analysis\/"/);

const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));
assert.deepEqual(scripts.map((item) => item['@type']), ['Article', 'BreadcrumbList']);
assert.equal(scripts[0].datePublished, '2026-08-13T21:37:00+09:00');
assert.equal(scripts[0].mainEntityOfPage, 'https://gaeoteam.com/research/deep-analysis/002990/2026-08-13-2137/');
assert.equal(scripts[1].itemListElement.at(-1).name, '금호건설 2026.08.13');

const manyArchive = { '002990': [] };
for (let day = 1; day <= 23; day += 1) {
  manyArchive['002990'].push(snapshot(`2026-07-${String(day).padStart(2, '0')} 10:00`, `보고서 ${day}`));
}
const many = normalizePublishedRecords(manyArchive, tickers);
const first = renderArchivePage(many, { page: 1, pageSize: 20, baseUrl: 'https://gaeoteam.com/' });
const second = renderArchivePage(many, { page: 2, pageSize: 20, baseUrl: 'https://gaeoteam.com/' });
assert.equal((first.match(/class="da-index-row"/g) || []).length, 20);
assert.equal((second.match(/class="da-index-row"/g) || []).length, 3);
assert.match(first, /href="https:\/\/gaeoteam\.com\/research\/deep-analysis\/page\/2\/" rel="next"/);
assert.match(second, /href="https:\/\/gaeoteam\.com\/research\/deep-analysis\/" rel="prev"/);
assert.match(first, /<a class="da-index-row" href="https:\/\/gaeoteam\.com\/research\/deep-analysis\/002990\//);

const latest = buildLatestRecords(many, 5);
assert.equal(latest.length, 5);
assert.deepEqual(latest.map((item) => item.analysisCreatedAt), many.slice(0, 5).map((item) => item.analysisCreatedAt));
assert.deepEqual(Object.keys(latest[0]).sort(), ['analysisCreatedAt', 'date', 'permalink', 'stockName', 'ticker'].sort());

const manifest = buildManifest(many, { baseUrl: 'https://gaeoteam.com/' });
assert.equal(manifest.records.length, 23);
assert.equal(manifest.records[0].loc, `https://gaeoteam.com${many[0].permalink}`);
assert.equal(manifest.records[0].lastmod, many[0].analysisCreatedAt.slice(0, 10));
assert.equal(manifest.archivePages.length, 2);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gaeo-deep-analysis-'));
try {
  const result = generateAll({
    archive: manyArchive,
    tickers,
    outDir: tempRoot,
    baseUrl: 'https://gaeoteam.com/',
    pageSize: 20,
  });
  assert.equal(result.recordCount, 23);
  assert.equal(result.pageCount, 2);
  assert.equal(result.latestCount, 5);
  assert.equal(
    fs.existsSync(path.join(tempRoot, 'research', 'deep-analysis', '002990', '2026-07-23-1000', 'index.html')),
    true,
  );
  assert.equal(fs.existsSync(path.join(tempRoot, 'research', 'deep-analysis', 'page', '2', 'index.html')), true);
  assert.match(fs.readFileSync(path.join(tempRoot, 'deep_analysis_latest.js'), 'utf8'), /const DEEP_ANALYSIS_LATEST = /);
  assert.equal(JSON.parse(fs.readFileSync(path.join(tempRoot, 'deep_analysis_manifest.json'), 'utf8')).records.length, 23);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('deep analysis static publishing tests passed');
