const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(file) { return fs.readFileSync(path.join(__dirname, file), 'utf8'); }

const oldLesson = read('snap/lesson/1.html');
const currentNews = read('snap/news/63.html');
const stock = read('snap/stock/000070.html');
const rss = read('rss.xml');

assert.match(oldLesson, /<div class="archive-notice">/);
assert.match(oldLesson, /2026년 07월 16일 당시 정보와 자료를 기준으로 작성됐습니다/);
assert.doesNotMatch(currentNews, /<div class="archive-notice">/);
assert.match(currentNews, /href="https:\/\/gaeoteam\.com\/\?m=news&amp;id=63&amp;entry=snapshot" rel="nofollow"/);
assert.doesNotMatch(currentNews, /name="robots" content="noindex/);
assert.match(stock, /name="robots" content="noindex,follow"/);
assert.match(stock, /규칙 기반 자동분석/);
assert.match(stock, /overflow-wrap:anywhere/);
assert.doesNotMatch(rss, /\?m=/);
assert.match(rss, /<guid isPermaLink="true">https:\/\/gaeoteam\.com\/snap\//);

console.log('test_snapshot_growth_contract: PASS');
