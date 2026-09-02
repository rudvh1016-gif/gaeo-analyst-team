const assert = require('assert');
const fs = require('fs');

function read(file) { return fs.readFileSync(file, 'utf8'); }
const index = read('index.html');
const about = read('about.html');
const manifest = read('manifest.json');
const snapshots = read('generate_snapshots.js');
const rss = read('generate_rss.js');
const claude = read('CLAUDE.md');
const readme = read('README.md');
const overview = read('docs/PROJECT_OVERVIEW.md');

const prohibited = [
  ['about AI team label', about, /AI ANALYST TEAM/],
  ['about live analyst implication', about, /다섯 명의 애널리스트/],
  ['index live analyst implication', index, /5인의 애널리스트가[^<\n]*분석합니다/],
  ['stale 500-stock RSS claim', rss, /500종목/],
  ['stale 500-stock generator claim', snapshots, /500종목 정밀\/자동분석/],
  ['query URL promotional rule', claude, /https:\/\/gaeoteam\.com\/\?m=<mode>&id=<id>/],
  ['README live AI team implication', readme, /## 팀 구성 \(5인/],
  ['overview live AI team implication', overview, /AI 애널리스트 5인 캐릭터/],
];
for (const [name, text, pattern] of prohibited) assert.doesNotMatch(text, pattern, name);

assert.match(index, /600종목[^<\n]*(규칙 기반 자동분석)|규칙 기반 자동분석[^<\n]*600종목/);
assert.match(about, /분석 역할 체계/);
assert.match(manifest, /규칙 기반 자동분석/);
assert.match(snapshots, /AI 보조 정밀분석/);

console.log('test_growth_claims: PASS');
