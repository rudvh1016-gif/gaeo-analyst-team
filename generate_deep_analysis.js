#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const {
  normalizePublishedRecords,
  renderSnapshotPage,
  renderArchivePage,
  renderStockHubPage,
  groupRecordsByTicker,
  stockHubPath,
  buildLatestRecords,
  buildManifest,
} = require('./deep_analysis_publish');

const HERE = __dirname;
const BASE_URL = 'https://gaeoteam.com/';
const PAGE_SIZE = 20;

function loadJsValue(file, variableName) {
  const source = fs.readFileSync(file, 'utf8');
  return new Function(`${source}\n;return ${variableName};`)();
}

function writeOutput(root, relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function generateAll(options) {
  const outDir = options.outDir;
  const baseUrl = options.baseUrl || BASE_URL;
  const pageSize = Number(options.pageSize) || PAGE_SIZE;
  const records = normalizePublishedRecords(options.archive, options.tickers);
  const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
  const latest = buildLatestRecords(records, 5);
  const manifest = buildManifest(records, { baseUrl, pageSize });
  const outputs = new Map();

  records.forEach((record) => {
    const relativePath = path.join(record.permalink.replace(/^\//, ''), 'index.html');
    outputs.set(relativePath, renderSnapshotPage(record, { baseUrl }));
  });
  const hubs = groupRecordsByTicker(records);
  hubs.forEach((list, ticker) => {
    const relativePath = path.join(stockHubPath(ticker).replace(/^\//, ''), 'index.html');
    outputs.set(relativePath, renderStockHubPage(list, { baseUrl }));
  });
  for (let page = 1; page <= pageCount; page += 1) {
    const relativePath = page === 1
      ? path.join('research', 'deep-analysis', 'index.html')
      : path.join('research', 'deep-analysis', 'page', String(page), 'index.html');
    outputs.set(relativePath, renderArchivePage(records, { page, pageSize, baseUrl }));
  }
  outputs.set(
    'deep_analysis_latest.js',
    '// generate_deep_analysis.js 자동 생성 · 홈 최근 정밀분석 5건\n' +
      `const DEEP_ANALYSIS_LATEST = ${JSON.stringify(latest, null, 1)};\n`,
  );
  outputs.set('deep_analysis_manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

  outputs.forEach((content, relativePath) => writeOutput(outDir, relativePath, content));
  return { recordCount: records.length, pageCount, latestCount: latest.length, hubCount: hubs.size };
}

function main() {
  const archive = loadJsValue(path.join(HERE, 'analysis_archive.js'), 'ANALYSIS_ARCHIVE');
  const tickers = loadJsValue(path.join(HERE, 'tickers.js'), 'TICKERS');
  const result = generateAll({ archive, tickers, outDir: HERE, baseUrl: BASE_URL, pageSize: PAGE_SIZE });
  console.log(`정밀분석 발행 완료 — Snapshot ${result.recordCount}건 · 종목 대표 ${result.hubCount}건 · Archive ${result.pageCount}페이지 · 홈 ${result.latestCount}건`);
}

if (require.main === module) main();

module.exports = { loadJsValue, generateAll };
