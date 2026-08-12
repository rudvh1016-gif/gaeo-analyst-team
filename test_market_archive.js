const assert = require('assert');
const { mergeMarketEntries, paginateMarketEntries } = require('./market_archive.js');

const history = {
  '2026-08-10': { updated: '2026-08-10 16:20', text: '기존 10일 분석', points: [] },
  '2026-08-11': { updated: '2026-08-11 16:20', text: '교체 전 분석', points: ['이전'] },
  '2026-08-08': { updated: '2026-08-08 16:20', text: '8일 분석', points: [] },
};
const originalHistory = JSON.parse(JSON.stringify(history));
const live = {
  updated: '2026-08-11 18:05',
  kospi: { value: 6345.53, rate: 0.73 },
  kosdaq: { value: 857.84, rate: 0.39 },
  text: '교체된 최신 분석',
  points: ['최신'],
};

const merged = mergeMarketEntries(history, live);
assert.deepEqual(history, originalHistory, '입력 history를 변경하면 안 됩니다');
assert.deepEqual(merged.map(entry => entry.day), ['2026-08-11', '2026-08-10', '2026-08-08']);
assert.equal(merged[0].text, '교체된 최신 분석');
assert.deepEqual(merged[0].points, ['최신']);
assert.equal(merged.filter(entry => entry.day === '2026-08-11').length, 1);

const entries = Array.from({ length: 9 }, (_, index) => ({
  day: `2026-08-${String(12 - index).padStart(2, '0')}`,
  text: `분석 ${index + 1}`,
}));
const secondPage = paginateMarketEntries(entries, 2, 4);
assert.deepEqual(secondPage.items.map(entry => entry.text), ['분석 5', '분석 6', '분석 7', '분석 8']);
assert.deepEqual(
  { page: secondPage.page, pageSize: secondPage.pageSize, total: secondPage.total, totalPages: secondPage.totalPages },
  { page: 2, pageSize: 4, total: 9, totalPages: 3 },
);

const clamped = paginateMarketEntries(entries, 99, 4);
assert.equal(clamped.page, 3);
assert.deepEqual(clamped.items.map(entry => entry.text), ['분석 9']);

const empty = paginateMarketEntries([], 3, 4);
assert.deepEqual(empty, { items: [], page: 1, pageSize: 4, total: 0, totalPages: 0 });

console.log('market archive unit tests passed');
