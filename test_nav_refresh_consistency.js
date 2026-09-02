const assert = require('node:assert/strict');
const fs = require('node:fs');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();
const refreshId = html.indexOf('id="navRefresh"');
const start = html.lastIndexOf('<button', refreshId);
const end = html.indexOf('</button>', refreshId);

assert.notEqual(refreshId, -1, '새로고침 버튼이 있어야 합니다.');
assert.notEqual(start, -1, '새로고침 버튼이 있어야 합니다.');
assert.notEqual(end, -1, '새로고침 버튼 마크업이 닫혀 있어야 합니다.');

const refreshMarkup = html.slice(start, end + '</button>'.length);

assert.match(
  refreshMarkup,
  /class="global-icon-btn nav-refresh-btn"/,
  '새로고침 버튼은 주변 메뉴와 같은 공용 아이콘 버튼 크기를 사용해야 합니다.'
);
assert.doesNotMatch(
  refreshMarkup,
  /nav-refresh-circle|nav-refresh-label/,
  '새로고침 버튼에만 적용되는 원형 강조 장식이 없어야 합니다.'
);
assert.match(refreshMarkup, /<span>새로고침<\/span>/);
assert.match(html, /nav-refresh-btn\.is-refreshing svg\{animation:navRefreshSpin/);
assert.match(html, /window\.location\.reload\(\)/);

console.log('navigation refresh consistency test passed');
