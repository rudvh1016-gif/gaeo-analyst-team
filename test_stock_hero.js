// 종목 화면 Hero 순서·성적 한 줄 계약 (2026-09-06 신설, 소스 검사)
//
// 왜 있나
//   화면을 열면 큰 글씨 "BUY/SELL"이 먼저 나오고, **어느 종목인지·얼마인지**는 그 아래
//   작은 회색 글씨였다. 그리고 그 판단이 그동안 얼마나 맞았는지는 종목 화면 어디에도 없었다.
//   순서를 "무슨 종목인가 → 무슨 판단인가 → 그 판단이 그동안 얼마나 맞았나"로 바꾼다.
//
// 이 계약이 막는 것
//   · 종목명·현재가가 다시 판단 아래로 내려가는 것
//   · 큰 판단 글자가 다시 34~48px로 커져 종목명을 눌러버리는 것
//   · 종목 화면이 홈과 **다른 함수**로 성적을 계산해 두 화면이 서로 다른 숫자를 말하는 것
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app-shell.css'), 'utf8');

// ① Hero 안에서 종목명 줄이 큰 판단 글자보다 위에 있다
const hero = html.slice(html.indexOf('<div class="vhero">'), html.indexOf('<div class="vmetrics"'));
assert.ok(hero.includes('id="vconf"'), 'Hero에 종목명·현재가 줄(#vconf)이 없다.');
assert.ok(hero.indexOf('id="vconf"') < hero.indexOf('id="vcall"'),
  '종목명·현재가(#vconf)가 큰 판단 글자(#vcall)보다 아래에 있다 — 무슨 종목인지가 먼저 보여야 한다.');
assert.ok(hero.indexOf('id="vcall"') < hero.indexOf('id="vrecord"'),
  '성적 한 줄(#vrecord)은 판단 아래에 와야 한다.');

// ② 큰 판단 글자는 28~32px 사이 (종목명을 눌러버리지 않게)
const callSizes = [...css.matchAll(/\.verdict \.call\{[^}]*font-size:(\d+(?:\.\d+)?)px/g)].map(m => Number(m[1]));
assert.ok(callSizes.length >= 3, `.verdict .call 크기 규칙을 찾지 못했다(${callSizes.length}개).`);
for (const px of callSizes) {
  assert.ok(px >= 28 && px <= 32,
    `큰 판단 글자가 ${px}px다 — 28~32px 안이어야 종목명이 먼저 읽힌다.`);
}
assert.match(css, /#vconf\{[^}]*font-size:15px/, '종목명 줄이 본문 크기(15px)로 올라오지 않았다.');

// ③ 성적은 홈과 **같은 함수**로 만든다
assert.ok(app.includes('function gaeoCallNoteHTML()'), '성적 문구 함수가 없다.');
assert.equal((app.match(/gaeoCallNoteHTML\(\)/g) || []).length >= 3, true,
  'gaeoCallNoteHTML이 홈·종목 두 곳에서 호출돼야 한다(정의 1 + 호출 2 이상).');
const record = app.slice(app.indexOf("const vRec=document.getElementById('vrecord')"),
  app.indexOf("const aof=analysisAsOf(stock.code);"));
assert.ok(record.includes('gaeoCallNoteHTML()'),
  '종목 화면이 홈과 다른 방식으로 성적을 계산하고 있다 — 두 화면이 서로 다른 숫자를 말하게 된다.');
assert.match(record, /data-v-scorecard/, '성적 한 줄 옆에 성적표로 가는 링크가 없다.');
assert.match(record, /__gaeoScorecardEntry='stock_hero'/,
  '어디서 들어온 성적표인지 계측 라벨이 없다.');

// ④ 홈 BUY 목록은 '추천'이 아니라 '참고'라고 말한다 (전략 검토 재포지셔닝)
assert.match(app, /<strong>매수 우위\(BUY\) 판단<\/strong>/,
  "홈 BUY 목록 이름표가 '매수 우위(BUY) 판단'이 아니다.");
assert.match(app, /추천이 아니라 참고예요/,
  'BUY 목록이 추천이 아니라는 안내가 없다.');
// 소유자 지정 기능은 지우지 않는다 — 확신도순 정렬과 전체 보기는 그대로 있어야 한다
assert.match(app, /확신도순/, '확신도순 정렬 안내가 사라졌다(소유자 지정 기능).');
assert.match(app, /id="hdbBuyToggle"[^>]*>매수 우위 판단 전체 \$\{model\.buy\.length\}종목 보기/,
  "'전체 보기' 버튼이 사라졌다(소유자 지정 기능).");

console.log('stock hero contract passed');
