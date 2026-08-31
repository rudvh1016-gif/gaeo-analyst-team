/**
 * 등락 색 계약 테스트 (2026-08-31 신설)
 *
 * 왜 이 테스트가 있나
 * ────────────────────
 * 한국 증시는 오르면 빨강·내리면 파랑이다. 그런데 이 저장소는 기능을 붙일 때마다
 * 미국식(오르면 초록·내리면 빨강)이나 --market-up 파랑 같은 제3의 규칙이 하나씩
 * 섞여 들어왔고, 그때마다 사람이 눈으로 찾아 고쳐야 했다(2026-08-14 44e5141,
 * 2026-08-28 qchart, 2026-08-30 BUG-1 73ea140). 같은 버그가 세 번 반복됐다는 뜻이다.
 *
 * 이 파일은 "등락·손익·수익률처럼 부호가 있는 숫자의 색"을 계약으로 고정한다.
 * 앞으로 누가 실수로 미국식 색을 다시 넣으면 테스트가 먼저 막는다.
 *
 * 계약에서 제외되는 것 (색을 써도 되지만 '방향'이 아닌 것들)
 * ─────────────────────────────────────────────────────────
 *  · BUY / SELL 판단 색      : 판단이지 등락이 아니다
 *  · 적중 / 빗나감 · 적중률   : 품질(좋음·나쁨)이지 방향이 아니다
 *  · RSI · MACD 지표 구간색   : 지표 해석용
 *  · 경고 · 삭제 · 익절/손절 라벨
 *  · 작은 가격 꺾은선(스파크라인) : 화면 안내문에서 "이 작은 꺾은선만은 세계 공통
 *    방식대로 오르면 초록·내리면 빨강"이라고 사용자에게 명시적으로 설명하고 있는
 *    의도된 예외다. 아래 5번에서 그 설명이 사라지지 않았는지를 함께 지킨다.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
let checks = 0;
const ok = (msg) => { checks++; };

/* ── 1. 토큰 자체가 한국식인가 (라이트·다크 모두) ──────────────────────── */
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });

const krupHexes = [...html.matchAll(/--krup:(#[0-9A-Fa-f]{6})/g)].map(m => m[1]);
const krdnHexes = [...html.matchAll(/--krdn:(#[0-9A-Fa-f]{6})/g)].map(m => m[1]);

assert.equal(krupHexes.length, 2, `--krup은 라이트/다크 2곳에 정의돼야 한다 (실제 ${krupHexes.length}곳)`);
assert.equal(krdnHexes.length, 2, `--krdn은 라이트/다크 2곳에 정의돼야 한다 (실제 ${krdnHexes.length}곳)`);

for (const h of krupHexes) {
  const c = hex(h);
  assert.ok(c.r > c.b + 30, `상승색 --krup(${h})은 파랑보다 빨강이 뚜렷해야 한다 (R=${c.r}, B=${c.b})`);
  assert.ok(c.r > c.g + 30, `상승색 --krup(${h})은 초록보다 빨강이 뚜렷해야 한다 (R=${c.r}, G=${c.g})`);
  ok();
}
for (const h of krdnHexes) {
  const c = hex(h);
  assert.ok(c.b > c.r + 30, `하락색 --krdn(${h})은 빨강보다 파랑이 뚜렷해야 한다 (R=${c.r}, B=${c.b})`);
  ok();
}

/* ── 2. --market-up/--market-down이 한국식 토큰을 가리키는가 ───────────── */
// 독립된 hex 값을 다시 넣으면 등락 색이 두 갈래로 갈라진다. 별칭만 허용한다.
assert.match(html, /--market-up:var\(--krup\)/, '--market-up은 var(--krup)이어야 한다');
assert.match(html, /--market-down:var\(--krdn\)/, '--market-down은 var(--krdn)이어야 한다');
assert.doesNotMatch(html, /--market-up:\s*#/, '--market-up에 hex를 직접 넣지 말 것 (--krup 별칭만)');
assert.doesNotMatch(html, /--market-down:\s*#/, '--market-down에 hex를 직접 넣지 말 것 (--krdn 별칭만)');
ok();

/* ── 3. 부호로 색을 고르는 JS는 반드시 한국식 토큰을 쓴다 ──────────────── */
// "0보다 큰가/작은가"로 색을 고르는 자리 = 등락·손익·수익률. 여기서 --green/--red를
// 쓰면 미국식이 된다. 조건식 뒤 첫 색만 검사하면 되므로 아래 한 줄로 충분하다.
const signGreenRed = [...html.matchAll(/[><]=?\s*0\s*\?\s*'var\(--(green|red)\)'/g)];
assert.equal(
  signGreenRed.length, 0,
  `부호(>0 / <0)로 색을 고르면서 var(--green)/var(--red)를 쓴 곳이 ${signGreenRed.length}군데 있다. ` +
  `등락·손익·수익률 색은 var(--krup)/var(--krdn)을 써야 한다: ` +
  signGreenRed.map(m => m[0]).join(' | ')
);
ok();

// 반대로, 부호 기반 색 선택이 실제로 존재하고 한국식을 쓰고 있는지도 확인한다
// (전부 지워버려서 테스트가 공허하게 통과하는 상황을 막는다).
const signKr = [...html.matchAll(/[><]=?\s*0\s*\?\s*'var\(--(krup|krdn)\)'/g)];
assert.ok(signKr.length >= 8, `부호 기반 한국식 색 지정이 최소 8곳은 있어야 한다 (실제 ${signKr.length}곳)`);
ok();

/* ── 4. 등락을 표시하는 CSS 선택자는 한국식 토큰을 쓴다 ────────────────── */
// [선택자 정규식, 사람이 읽을 이름] — 값 부분은 --krup/--krdn 중 하나여야 한다.
const directionSelectors = [
  [/\.tape \.up\{color:var\(--krup\)\} \.tape \.down\{color:var\(--krdn\)\}/, '시세 티커(.tape)'],
  [/\.chip \.up\{color:var\(--krup\)/, '종목 칩 등락률(.chip .up)'],
  [/\.chip \.down\{color:var\(--krdn\)/, '종목 칩 등락률(.chip .down)'],
  [/\.fx-flow-card\.up\{border-left-color:var\(--krup\)\}/, '수급 순매수 카드'],
  [/\.fx-flow-card\.dn\{border-left-color:var\(--krdn\)\}/, '수급 순매도 카드'],
  [/\.fx-flow-card\.up \.fx-flow-dir\{color:var\(--krup\)\}/, '수급 방향 ▲'],
  [/\.fx-flow-card\.dn \.fx-flow-dir\{color:var\(--krdn\)\}/, '수급 방향 ▼'],
  [/\.vlevels \.up\{color:var\(--krup\)/, '가격 레벨 괴리율(위)'],
  [/\.vlevels \.dn\{color:var\(--krdn\)/, '가격 레벨 괴리율(아래)'],
  [/\.tv-up\{color:var\(--krup\)\}\.tv-down\{color:var\(--krdn\)\}/, 'TARO 전일대비 등락%'],
  [/\.tv-regime-up\{background:#FDF1F2;color:var\(--krup\)\}/, 'TARO 상승 정렬 배지'],
  [/\.tv-regime-down\{background:#EFF4FB;color:var\(--krdn\)\}/, 'TARO 하락 정렬 배지'],
  [/\.qchart-summary\[data-trend="up"\]\{--trend:var\(--krup\)\}/, '종목 차트 요약(상승)'],
  [/\.qchart-summary\[data-trend="down"\]\{--trend:var\(--krdn\)\}/, '종목 차트 요약(하락)'],
  [/\.qrate\.up\{color:var\(--krup\)\} \.qrate\.down\{color:var\(--krdn\)\}/, '종목 등락률'],
];
for (const [re, name] of directionSelectors) {
  assert.match(html, re, `${name}의 색이 한국식(--krup/--krdn)이 아니다`);
  ok();
}

/* ── 5. 무드 배지의 글자색과 배경 틴트가 같은 방향인가 ─────────────────── */
// 글자만 고치고 배경 틴트를 두면 "빨간 글씨 + 파란 배경" 같은 어긋난 조합이 남는다.
assert.match(html, /\.mood-up\s+\{color:var\(--market-up\);background:#FDF1F2\}/, '상승 무드 배경은 빨강 계열이어야 한다');
assert.match(html, /\.mood-down \{color:var\(--market-down\);background:#EFF4FB\}/, '하락 무드 배경은 파랑 계열이어야 한다');
assert.match(html, /\.mood-crash\{color:var\(--market-down\);background:#EFF4FB\}/, '급락 무드 배경은 파랑 계열이어야 한다');
assert.match(html, /\.mood-surge\{color:var\(--market-up\);background:#FDF1F2\}/, '급등 무드 배경은 빨강 계열이어야 한다');
ok();

/* ── 6. 의도된 예외(스파크라인)의 안내문이 살아 있는가 ─────────────────── */
// 작은 꺾은선만 초록/빨강인 것은 의도다. 다만 그 사실을 사용자에게 알려주는
// 문장이 사라지면 "설명 없는 예외"가 되어 오해를 낳는다. 둘은 같이 가야 한다.
assert.match(
  html, /한국 증시는 오르면 빨강·내리면 파랑이지만, 이 <b>작은 꺾은선만은<\/b>/,
  '스파크라인이 세계 공통 방식이라는 안내 문장이 사라졌다. 색을 바꾸든 문장을 되살리든 둘 중 하나를 해야 한다.'
);
assert.match(html, /const up=closes\[n-1\]>=closes\[0\], col=up\?'#2F8B73':'#D5535D';/,
  '스파크라인 색이 바뀌었다면 위 안내 문장도 함께 고쳐야 한다.');
ok();

console.log(`market direction color contract passed (${checks} checks)`);
