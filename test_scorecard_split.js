// 성적표 코드 분리 계약 (2026-09-06 신설)
//
// 왜 있나
//   app.js가 832KB 예산에 142B만 남긴 채 붙어 있어서 성적표를 고칠 자리가 없었다.
//   성적표 화면 코드(약 88KB)를 scorecard-ui.js로 떼어 "그 화면을 열 때만" 받게 했다.
//   이 분리는 조용히 되돌아가기 쉽다 — 누가 renderScorecard를 app.js에 다시 붙이거나,
//   GaeoFeatures 배선을 빼면 성적표가 영영 안 뜨는데 다른 테스트는 전부 통과한다.
//
// 잠그는 계약
//   ① 파일이 있고 문법이 맞다
//   ② index.html의 GaeoFeatures 'history' 키가 이 파일을 함께 받는다(별도 키 금지)
//   ③ app.js에는 성적표 렌더가 없고, 있을 때만 부르는 가드가 있다
//   ④ 성적표 밖에서도 쓰는 것(LB_IDS·scoreStance·SC_WEEK_OFFSET·goToGuideSection)은 app.js에 남아 있다
//   ⑤ 두 파일의 최상위 선언 이름이 겹치지 않는다 (겹치면 로드 즉시 SyntaxError로 화면이 죽는다)
//   ⑥ 지연 로딩 파일이므로 service worker가 미리 받지 않는다
//   ⑦ 분리로 번 여유가 실제로 남아 있다
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const app = read('app.js');
const html = read('index.html');
const sw = read('sw.js');
const budgets = JSON.parse(read('performance-budgets.json'));

// ① 파일이 있고 문법이 맞다
assert.ok(fs.existsSync(path.join(root, 'scorecard-ui.js')),
  'scorecard-ui.js가 없다 — 성적표 화면이 통째로 사라진다.');
const ui = read('scorecard-ui.js');
new vm.Script(ui, { filename: 'scorecard-ui.js' });   // 문법 오류면 여기서 던진다

// ② GaeoFeatures 배선 — history 키에 함께 실린다
assert.match(html, /history:\['history\.js','price_history\.js','scorecard-ui\.js\?v=[^']+'\]/,
  "GaeoFeatures 'history' 키가 scorecard-ui.js를 받지 않는다 — 성적표를 눌러도 아무 일도 안 일어난다.");
assert.doesNotMatch(html, /scorecard:\s*\[/,
  '성적표를 별도 feature 키로 나누면 GaeoFeatures가 키마다 따로 기억해 history.js를 두 번 받는다.');

// ③ 렌더는 옮겨갔고, app.js에는 존재할 때만 부르는 가드가 있다
assert.doesNotMatch(app, /^function renderScorecard\(/m,
  'renderScorecard가 app.js로 되돌아왔다 — 첫 화면이 다시 88KB 무거워진다.');
assert.match(ui, /^function renderScorecard\(/m, 'scorecard-ui.js에 renderScorecard가 없다.');
assert.match(app, /if\(scorecard\s*&&\s*typeof renderScorecard===['"]function['"]\)\s*renderScorecard\(\)/,
  '지연 파일이 도착하기 전에 눌리면 ReferenceError로 화면이 멈춘다 — typeof 가드가 필요하다.');

// ④ 성적표 밖에서도 쓰는 것은 app.js에 남는다
for (const [needle, why] of [
  ["const LB_IDS=", '월간 캘린더(renderCalendar)가 쓴다'],
  ["function scoreStance(", '월간 캘린더가 쓴다'],
  ["let SC_WEEK_OFFSET=", 'app.js가 딥링크·모드 전환에서 0으로 되돌린다'],
  ["function goToGuideSection(", '가이드북 이동 — 성적표 리스너가 이름으로 부른다'],
]) {
  assert.ok(app.includes(needle), `app.js에 ${needle} 이(가) 없다 — ${why}.`);
  assert.ok(!ui.includes(needle), `${needle} 이(가) scorecard-ui.js로 옮겨갔다 — ${why}.`);
}

// ⑤ 최상위 선언 이름 충돌 금지
const topNames = src => {
  const out = new Set();
  for (const m of src.matchAll(/^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm)) out.add(m[1]);
  return out;
};
const clash = [...topNames(ui)].filter(n => topNames(app).has(n));
assert.deepEqual(clash, [],
  `두 파일이 같은 이름을 최상위에 선언한다: ${clash.join(', ')} — 일반 script라 전역이 겹쳐 로드 즉시 화면이 죽는다.`);

// ⑥ 지연 파일이므로 미리 받지 않는다
assert.ok(!sw.includes('scorecard-ui.js'),
  'service worker가 scorecard-ui.js를 precache하면 첫 화면에서 다시 받게 된다.');

// ⑦ 여유가 실제로 남았다
const appBytes = Buffer.byteLength(app);
const headroom = budgets.assets.appJsRawBytes - appBytes;
assert.ok(headroom >= 40000,
  `app.js 여유가 ${headroom}B밖에 없다 — 분리로 번 자리를 다시 다 써버렸다.`);

console.log(`scorecard split contract passed (app.js ${appBytes.toLocaleString()}B · 여유 ${headroom.toLocaleString()}B · scorecard-ui.js ${Buffer.byteLength(ui).toLocaleString()}B)`);
