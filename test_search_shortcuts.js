// 초성검색 + 기본 단축키('/'·ESC) 계약 테스트 (2026-08-16)
// - 초성 판정/변환 로직이 index.html에 존재하고 규칙대로 동작하는지
// - 단축키는 '/'와 ESC만: J/K 내비게이션 금지, 입력 중 가로채기 금지 조건 존재
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

// ── 초성검색 코어가 존재 ──
assert.match(html, /function chosungKey\(/, '초성 변환 함수가 있어야 합니다.');
assert.match(html, /const isChosungQuery=/, '초성 질의 판정이 있어야 합니다.');
assert.match(html, /LATIN_CHOSUNG/, '영문 회사명(SK 등) 초성 근사 표가 있어야 합니다.');

// 판정 규칙: 자음 2자 이상만 초성검색으로 취급(한 글자는 일반 검색 그대로)
assert.match(html, /\^\[ㄱ-ㅎ\]\{2,\}\$/, '초성 질의는 자음 2자 이상 규칙이어야 합니다.');

// ── 초성 로직 실행 검증 (index.html에서 해당 블록만 추출해 실행) ──
const start = html.indexOf('const CHOSUNG_LIST');
const end = html.indexOf('const isChosungQuery');
assert.ok(start !== -1 && end > start, '초성 블록을 찾을 수 있어야 합니다.');
const endLine = html.indexOf('\n', end);
const block = html.slice(start, endLine);
const sandbox = new Function(block + `
  return { chosungKey, isChosungQuery };
`)();
assert.equal(sandbox.chosungKey('삼성전자'), 'ㅅㅅㅈㅈ');
assert.equal(sandbox.chosungKey('카카오'), 'ㅋㅋㅇ');
assert.equal(sandbox.chosungKey('SK하이닉스'), 'ㅅㅋㅎㅇㄴㅅ');
assert.equal(sandbox.isChosungQuery('ㅅㅅㅈㅈ'), true);
assert.equal(sandbox.isChosungQuery('ㅅ'), false, '자음 1자는 초성검색 아님');
assert.equal(sandbox.isChosungQuery('삼성'), false, '완성형 한글은 초성검색 아님');

// ── 단축키 계약 ──
const kd = html.indexOf("기본 단축키 (2026-08-16)");
assert.notEqual(kd, -1, '단축키 핸들러 주석 블록이 있어야 합니다.');
const kdBlock = html.slice(kd, html.indexOf('});', kd) + 3);
assert.match(kdBlock, /event\.key!=='\/'/, "'/' 단축키가 있어야 합니다.");
assert.match(kdBlock, /Escape/, 'ESC 단축키가 있어야 합니다.');
assert.match(kdBlock, /INPUT.*TEXTAREA.*SELECT/s, '입력창 타이핑 중에는 가로채지 않아야 합니다.');
assert.match(kdBlock, /isComposing/, '한글 조합(IME) 중에는 가로채지 않아야 합니다.');
assert.doesNotMatch(kdBlock, /key==='j'|key==='k'|key==='J'|key==='K'/,
  'J/K 내비게이션 단축키는 금지(2026-08-16 사용자 지정).');

console.log('search shortcuts contract test passed');
