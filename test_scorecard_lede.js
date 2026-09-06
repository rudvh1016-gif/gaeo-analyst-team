// 성적표 「핵심 3줄 + 펼쳐보기」 · 글자 크기 하한 계약 (2026-09-06 신설, 소스 검사)
//
// 왜 있나
//   성적표는 블록 11개가 한 줄로 늘어서 있어서, 첫 화면만 봐서는 "그래서 결론이 뭔데"를
//   알 수 없었다(모바일 390px 실측 높이 11,986px). 게다가 화면 글자의 70.5%가 12.5px
//   미만이라 대표가 "너무 작다"고 지적했다.
//   숫자는 하나도 지우지 않고 ① 맨 위 핵심 3줄 ② 세 묶음 접이식 ③ 글자 크기 하한으로 바꿨다.
//
// 이 계약이 막는 것
//   · 핵심 3줄이 하드코딩된 성과 숫자로 바뀌는 것 (헌법 publicClaimPolicy)
//   · 신뢰 구간을 "채점 건수" 기준으로 되돌리는 것 — 같은 날 600종목이 한꺼번에 채점되므로
//     건수 기준은 실제보다 훨씬 좁게 나와 실력이 확실한 것처럼 보인다
//   · 구간이 매번 달라 보이게 만드는 Math.random 되돌리기
//   · 접었다 편 상태를 안 남겨서 클릭 한 번에 도로 접히는 것
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const ui = fs.readFileSync(path.join(root, 'scorecard-ui.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app-shell.css'), 'utf8');

// ① 핵심 3줄이 있고, 세 줄 모두 실측값에서 만들어진다
assert.match(ui, /class="sc-block sc-lede"/, '성적표 맨 위 요약 카드가 없다.');
const ledeCount = (ui.match(/class="sc-lede-line"/g) || []).length;
assert.equal(ledeCount, 3, `핵심 요약은 3줄이어야 한다(지금 ${ledeCount}줄).`);
for (const name of ['ledeWeek', 'ledeMarket', 'ledeTrust']) {
  assert.ok(ui.includes(`const ${name}=`), `${name} 계산이 없다.`);
}
// 세 줄 안에 성과 숫자가 글자로 박혀 있으면 안 된다(값은 전부 ${...}로 들어와야 한다)
const ledeBlock = ui.slice(ui.indexOf('const ledeWeek='), ui.indexOf('const confRowsAll='));
// 문장 경계(.)를 넘지 않게 한다 — "…맞혔어요. 50%는 동전 던지기"의 50%는 성과 주장이 아니라
// 기준선 설명이고, 그 문장은 바로 아래에서 따로 있는지 확인한다.
const hardcoded = [...ledeBlock.matchAll(/(적중률|맞혔|성적은|성적이)[^`$.]{0,12}[0-9]{1,3}(\.[0-9])?%/g)];
assert.equal(hardcoded.length, 0,
  `핵심 3줄에 성과 숫자가 글자로 박혀 있다: ${hardcoded.map(m => m[0]).join(' | ')}`);
// "50%는 동전 던지기"는 성과 주장이 아니라 기준선 설명이므로 위 정규식에 안 걸린다.
assert.ok(ledeBlock.includes('동전 던지기'), '기준선(50%)이 무슨 뜻인지 설명하는 문장이 사라졌다.');

// ② 신뢰 구간은 판단일 블록 부트스트랩이고, 결과가 흔들리지 않는다
assert.ok(ui.includes('function scDayBootstrapCI('), '신뢰 구간 계산기가 없다.');
const ci = ui.slice(ui.indexOf('function scDayBootstrapCI('), ui.indexOf('// offset주 전의'));
assert.ok(!/Math\.random\(/.test(ci),   // 호출만 본다(주석에 이름이 나오는 건 설명이다)
  'Math.random을 쓰면 다시 그릴 때마다 구간이 달라져 숫자가 흔들리는 것처럼 보인다.');
assert.match(ci, /byDay/, '판단일로 묶지 않고 있다 — 건수 기준 구간은 실제보다 좁게 나온다.');
assert.match(ci, /days\.length<10/, '판단일이 너무 적을 때 구간을 말하지 않는 가드가 없다.');
assert.match(ui, /scDayBootstrapCI\(cumBS,'exc',true\)/,
  '핵심 3줄의 구간이 시장 대비(exc) 기준이 아니다.');

// ③ 세 묶음 접이식 + 상태 보존
for (const id of ['week', 'cumulative', 'research']) {
  assert.ok(ui.includes(`group('${id}'`), `'${id}' 묶음이 없다.`);
}
assert.match(ui, /const SC_GROUP_OPEN=new Set\(\['week'\]\)/,
  "기본은 '이번 주'만 펼쳐져 있어야 한다 — 첫 화면이 다시 길어지거나, 반대로 숫자가 통째로 숨으면 안 된다.");
assert.match(ui, /addEventListener\('toggle'[\s\S]{0,400}?SC_GROUP_OPEN\.add[\s\S]{0,200}?\}, true\)/,
  'details의 toggle은 버블링하지 않는다 — capture로 받아 펼침 상태를 남겨야 재렌더에도 유지된다.');
// 원래 블록이 하나도 사라지지 않았는가
for (const part of ['${callBlock}', '${confBlock}', '${leaderboardHTML()}', '${weeklyExamples}',
  '${versionHtml}', '${deepDive}', '${modelLabHTML()}', '${modelBoardHTML()}', '${modelDive}',
  '${rotationShadow}', '${confModelShadow}', '${weekNav}', '${statRow}']) {
  assert.ok(ui.includes(part), `${part} 가 화면에서 빠졌다 — 접는 것이지 지우는 게 아니다.`);
}

// ④ 글자 크기 하한
assert.match(css, /#scorecardView[\s\S]{0,4000}?\{font-size:12\.5px\}/,
  '성적표 문장의 12.5px 하한 규칙이 없다.');
const floorStart = css.indexOf('/* ── 글자 크기 하한');
const floorEnd = css.indexOf('.mb-pairs b{font-size:12.5px}', floorStart);
assert.ok(floorStart > 0 && floorEnd > floorStart, '글자 크기 하한 블록을 찾지 못했다.');
const floorBlock = css.slice(floorStart, floorEnd);
const tooSmall = [...floorBlock.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
  .map(m => Number(m[1])).filter(px => px < 12);
assert.deepEqual(tooSmall, [],
  `하한 블록 자체가 12px보다 작은 값을 쓰고 있다: ${tooSmall.join(', ')}`);
assert.match(css, /\.sc-lede \.sc-lede-line\{[^}]*font-size:14\.5px/,
  '핵심 3줄은 본문보다 커야 위계가 생긴다.');
assert.match(css, /\.sc-group>summary\{[^}]*min-height:44px/,
  '펼치기 버튼은 손가락으로 누를 수 있는 44px 이상이어야 한다.');

console.log('scorecard lede contract passed');
