const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

function extractFunction(name) {
  const start = html.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const brace = html.indexOf('{', start);
  let depth = 0;
  for (let index = brace; index < html.length; index += 1) {
    if (html[index] === '{') depth += 1;
    if (html[index] === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  throw new Error(`${name} body is incomplete`);
}

assert.match(html, /'deep_analysis_latest\.js':'window\.DEEP_ANALYSIS_LATEST=window\.DEEP_ANALYSIS_LATEST\|\|\[\]'/);
assert.match(html, /w\('deep_analysis_latest\.js'\)/);
assert.match(html, /archive:\['analysis_archive\.js'\]/, '전체 원문 Archive는 계속 지연 로드한다');

// 2026-09-03 소유자 지시: '최근 정밀분석'은 홈 브리핑에서 빠지고, 전체 메뉴의 별도 화면(#deepView, ?m=deep)에서 본다.
const contextStart = html.indexOf('<div class="hdb-context">');
const contextEnd = html.indexOf('</div>\n          <aside class="hdb-decisions"', contextStart);
const contextMarkup = html.slice(contextStart, contextEnd);
assert.match(contextMarkup, /id="briefActions"/);
assert.doesNotMatch(contextMarkup, /id="homeDeepAnalysis"/, '홈 브리핑 안에 최근 정밀분석 섹션을 다시 넣지 않는다');
const deepStart = html.indexOf('id="deepView"');
assert.notEqual(deepStart, -1, '최근 정밀분석 화면(#deepView)이 있어야 한다');
const deepMarkup = html.slice(deepStart, deepStart + 2000);
assert.match(deepMarkup, /id="homeDeepAnalysis"/);
assert.match(deepMarkup, /최근 정밀분석/);
assert.match(deepMarkup, /직접 지정해 더 깊게 확인한 종목이에요/);
assert.match(html, /id="mode-deep"/, '전체 메뉴에 최근 정밀분석 항목이 있어야 한다');
assert.match(html, /\.deepView \.hda-list\{display:flex;flex-direction:column/, '별도 화면에서도 목록 문법을 유지한다');

assert.match(html, /function renderHomeDeepAnalysis\(/);
assert.match(html, /class="hda-row" href="\$\{esc\(item\.permalink\)\}"/);
assert.match(html, /href="\/research\/deep-analysis\/" class="hda-more"/);
assert.match(html, /\.home-daily-brief \.hda-list\{display:flex;flex-direction:column/);
assert.doesNotMatch(html, /\.hda-row\{[^}]*border-radius/, '최근 정밀분석 항목을 카드로 만들지 않는다');

// 한 줄 Summary — 저장된 값이 있을 때만 조용히 붙이고, 없으면 undefined/빈 줄 없이 이름·날짜만 남긴다.
assert.match(html, /class="hda-summary"/, '최근 정밀분석에 한 줄 Summary 표시 영역이 있어야 한다');
assert.match(html, /summary\?`<span class="hda-summary">\$\{esc\(summary\)\}<\/span>`:''/,
  'summary가 없는 기록은 undefined나 빈 문구 대신 그 줄 자체를 생략한다');
assert.doesNotMatch(html, /\.hda-summary\{[^}]*color:\s*#(2563EB|0071E3|0A84FF)/i,
  'Summary 문장에 Brand Blue를 강제하지 않는다');

const permalinkContext = { result: null, args: null };
vm.createContext(permalinkContext);
vm.runInContext(`${extractFunction('deepAnalysisPermalink')}; result=deepAnalysisPermalink('002990','2026-08-13 21:37');`, permalinkContext);
assert.equal(permalinkContext.result, '/research/deep-analysis/002990/2026-08-13-2137/');

assert.match(html, /class="pa-permalink" href="\$\{esc\(deepAnalysisPermalink\(code,snap\.updated\)\)\}"/);
assert.match(html, />이 분석만 보기 →<\/a>/);
assert.match(html, /paSnapshotHTML\(list\[idx\],code\)/);

console.log('deep analysis home and stock-detail UI tests passed');
