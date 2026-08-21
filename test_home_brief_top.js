// snap/home_brief.js의 marketInsight.ranked 계약 테스트.
//
// 왜 있나: 홈 「오늘의 판단」 BUY 상위 3종목은 이 30개짜리 목록만 보고 그린다.
// 2026-08-14까지는 목록을 종합점수순으로 잘라놓고 화면은 확신도순으로 정렬해서,
// "확신도는 1위인데 종합점수가 낮은" 종목이 30위 밖으로 밀리는 문제가 있었다.
// 그때는 전체 자동분석(auto_analysis.js · 3MB)을 홈에서 백그라운드로 받아 다시 그렸다.
//
// 같은 날 generate_snapshots.js가 "자를 때부터 화면과 같은 기준으로 정렬"하도록 고쳐지면서
// 그 재로드는 불필요해졌고, 2026-08-21에 홈에서 제거했다(첫 화면 3MB 절약).
// 그래서 이제 이 계약이 깨지면 화면이 조용히 틀린 순위를 보여준다. 여기서 못 박는다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;

function loadJsValue(file, expr) {
  return new Function(`${fs.readFileSync(path.join(root, file), 'utf8')}\n;return ${expr};`)();
}

// 화면(index.html)이 BUY 상위를 정렬하는 기준과 글자 그대로 같아야 한다.
const conf = row => (typeof row.confidence === 'number' ? row.confidence : -1);
const compare = (a, b) =>
  (a.call === 'BUY' ? 0 : 1) - (b.call === 'BUY' ? 0 : 1) ||
  conf(b) - conf(a) ||
  b.total - a.total ||
  a.name.localeCompare(b.name, 'ko');

const brief = loadJsValue('snap/home_brief.js', 'HOME_BRIEF');
const ranked = (brief.marketInsight || {}).ranked || [];

assert.ok(ranked.length > 0, 'marketInsight.ranked가 비어 있습니다');
assert.ok(ranked.length <= 30, `ranked는 30개 이하여야 합니다 (현재 ${ranked.length})`);

// ① 이미 화면과 같은 기준으로 정렬되어 있어야 한다.
const resorted = [...ranked].sort(compare);
assert.deepEqual(ranked.map(r => r.code), resorted.map(r => r.code),
  'ranked가 화면 정렬 기준과 다른 순서로 저장돼 있습니다 — generate_snapshots.js의 정렬을 확인하세요');

// ② SELL은 애초에 들어오지 않는다(홈은 BUY/HOLD만 보여준다).
for (const row of ranked) {
  assert.notEqual(row.call, 'SELL', `${row.name}: SELL이 ranked에 들어 있습니다`);
  assert.equal(typeof row.total, 'number', `${row.name}: total이 숫자가 아닙니다`);
}

// ③ ⭐ 핵심 계약 — 이 30개만으로 뽑은 상위 3이 전체 자동분석으로 뽑은 상위 3과 같아야 한다.
//    이게 성립해야 홈이 3MB를 받지 않아도 된다.
const autoPath = path.join(root, 'auto_analysis.js');
if (fs.existsSync(autoPath)) {
  const auto = loadJsValue('auto_analysis.js', 'LIVE_AUTO');
  const tickers = loadJsValue('tickers.js', 'TICKERS');
  const names = Object.fromEntries(tickers.map(t => [t.code, t.name]));
  const all = [];
  for (const [code, v] of Object.entries(auto.stocks || {})) {
    const chief = v && v.chief;
    if (!chief || chief.call === 'SELL' || typeof chief.total !== 'number') continue;
    all.push({
      code, name: names[code] || code, total: chief.total, call: chief.call,
      confidence: typeof chief.confidence === 'number' ? chief.confidence : null,
    });
  }
  if (all.length) {
    const fromFull = all.sort(compare).slice(0, 3).map(r => r.code);
    const fromSnapshot = [...ranked].sort(compare).slice(0, 3).map(r => r.code);
    assert.deepEqual(fromSnapshot, fromFull,
      '홈 스냅샷 상위 3이 전체 자동분석 상위 3과 다릅니다 — 홈이 틀린 순위를 보여주게 됩니다');
  }
}

// ④ 홈에서 전체 자동분석(3MB)을 다시 받지 않는다.
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const homeBlock = index.slice(index.indexOf('window.renderGaeoHomeSignals=renderAll;'));
assert.doesNotMatch(homeBlock.slice(0, 1500), /ensureAutoAnalysis\(\)\.then/,
  '홈 첫 화면에서 auto_analysis.js(3MB)를 다시 받고 있습니다');

console.log(`home_brief ranked 계약 통과 — ${ranked.length}건, 상위 3 일치, 홈 3MB 재로드 없음`);
