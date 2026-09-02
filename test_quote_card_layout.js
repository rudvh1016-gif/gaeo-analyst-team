const fs = require('fs');
const assert = require('assert');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

assert.match(html, /\.qrate\.up\{color:var\(--krup\)\}\s*\.qrate\.down\{color:var\(--krdn\)\}/,
  '상승은 빨강, 하락은 파랑이어야 합니다.');
assert.match(html, /\.qrate\.flat\{color:var\(--dim\)\}/,
  '보합은 중립색이어야 합니다.');
assert.match(html, /\.qm\{[^}]*min-width:0/s,
  '지표 카드가 그리드 폭 안에서 줄어들 수 있어야 합니다.');
assert.match(html, /\.qm-label\{font-size:9px/,
  '지표 제목 글자 크기는 9px이어야 합니다.');
assert.match(html, /\.qm-val\{[^}]*font-size:12px/s,
  '지표 값 글자 크기는 12px이어야 합니다.');
assert.match(html, /@media\(min-width:1180px\)\{\s*\.qmetrics\{grid-template-columns:repeat\(6,minmax\(88px,1fr\)\) minmax\(190px,1\.5fr\)\}/,
  '데스크톱에서 52주 칸에 전용 넓은 열을 배정해야 합니다.');
assert.match(html, /\.qm-wide \.qm-val\{font-size:11\.5px/,
  '52주 범위 값은 긴 숫자도 카드 안에 들어가도록 더 작아야 합니다.');
assert.match(html, /const rateTone=st\.rate>0\?'up':st\.rate<0\?'down':'flat';/,
  '등락률은 상승·하락·보합을 구분해야 합니다.');

console.log('quote card layout contract: ok');
