#!/usr/bin/env node
/**
 * 내 포트폴리오 "위험 겹침" 계산 계약 테스트.
 *
 * 왜 있나
 *   상관계수는 조용히 틀리기 쉬운 계산이다. 특히 두 가지가 흔한 함정이다.
 *     ① 가격 수준끼리 상관을 내면 둘 다 우상향이기만 해도 0.9가 나온다.
 *        반드시 일간 수익률로 바꿔서 재야 한다.
 *     ② 두 종목의 날짜를 안 맞추고 배열 순서대로 짝지으면 엉뚱한 날끼리 비교된다.
 *   둘 다 화면에는 그럴듯한 숫자로 나오기 때문에 눈으로는 못 잡는다. 그래서
 *   계산식을 결과 보기 전에 고정하고, 여기서 계약으로 묶는다.
 *
 * 실행: node test_portfolio_risk_overlap.js   (브라우저 불필요)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { readAppDocument } = require('./app_test_source');

const HTML = readAppDocument(__dirname);

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ok  ${name}`); }
  catch (e) { console.error(`  FAIL ${name}\n       ${e.message}`); process.exitCode = 1; }
}

function extractFn(name) {
  const start = HTML.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `index.html에서 ${name}()을 찾지 못했다`);
  let depth = 0, i = HTML.indexOf('{', start);
  for (; i < HTML.length; i++) {
    if (HTML[i] === '{') depth++;
    else if (HTML[i] === '}' && --depth === 0) break;
  }
  return HTML.slice(start, i + 1);
}
function extractConst(name) {
  const m = HTML.match(new RegExp(`const ${name}\\s*=\\s*([0-9.]+)`));
  assert.ok(m, `${name} 상수를 찾지 못했다`);
  return Number(m[1]);
}

const PF_CORR_WINDOW = extractConst('PF_CORR_WINDOW');
const PF_MIN_PAIR_OBS = extractConst('PF_MIN_PAIR_OBS');

// 계산 함수들을 떼어내 PRICE_HISTORY/STOCKS를 주입한 스코프에서 실행한다.
function makeScope(priceHistory, stocks) {
  // 캐시는 스코프마다 새로 만든다 — 테스트끼리 같은 종목코드를 써도 섞이지 않는다.
  return new Function('PRICE_HISTORY', 'STOCKS',
    `const PF_CORR_WINDOW=${PF_CORR_WINDOW}, PF_MIN_PAIR_OBS=${PF_MIN_PAIR_OBS};\n` +
    `const PF_CLOSES_CACHE={};\n` +
    `${extractFn('pfCloses')}\n${extractFn('pfClosesUncached')}\n` +
    `${extractFn('pfCorrelation')}\n` +
    `${extractFn('pfOverlapLabel')}\n${extractFn('pfSectorConcentration')}\n` +
    `return {pfCloses,pfCorrelation,pfOverlapLabel,pfSectorConcentration};`
  )(priceHistory, stocks);
}

/** 종가 배열 → PRICE_HISTORY 형태(5일 1페이지)로 감싼다. */
function pages(closes, startDay = 1) {
  const days = closes.map((c, i) => ({
    date: `2026-0${1 + Math.floor((startDay + i - 1) / 28)}-${String((startDay + i - 1) % 28 + 1).padStart(2, '0')}`,
    close: c,
  }));
  const out = [];
  for (let i = 0; i < days.length; i += 5) {
    out.push({ page: out.length + 1, days: days.slice(i, i + 5) });
  }
  return out;
}

const N = 70;
const rand = (seed => () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)(7);

console.log('\n[1] 수익률 기반인가 (가격 수준 상관 금지)');

test('추세만 같고 일간 움직임은 반대인 두 종목은 높게 나오지 않는다', () => {
  // 둘 다 100 → 우상향하지만, 하루하루는 서로 반대로 흔들린다.
  // 가격 수준 Pearson이면 ~+1.0이 나온다. 수익률 기반이면 음수여야 한다.
  const a = [], b = [];
  let pa = 100, pb = 100;
  for (let i = 0; i < N; i++) {
    const w = (i % 2 ? 1 : -1) * 0.02;
    pa *= (1 + 0.001 + w); pb *= (1 + 0.001 - w);
    a.push(pa); b.push(pb);
  }
  const s = makeScope({ A: pages(a), B: pages(b) }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.strictEqual(r.status, 'OK');
  assert.ok(r.r < 0, `수익률 기반이 아니다 — r=${r.r.toFixed(3)} (가격 수준이면 +1에 가깝다)`);
});

test('완전히 같이 움직이면 +1에 가깝다', () => {
  const a = [], b = [];
  let pa = 100, pb = 500;
  for (let i = 0; i < N; i++) {
    const w = (rand() - 0.5) * 0.04;
    pa *= (1 + w); pb *= (1 + w);      // 같은 수익률
    a.push(pa); b.push(pb);
  }
  const s = makeScope({ A: pages(a), B: pages(b) }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.ok(r.r > 0.99, `r=${r.r}`);
});

test('정확히 반대로 움직이면 -1에 가깝다', () => {
  const a = [], b = [];
  let pa = 100, pb = 100;
  for (let i = 0; i < N; i++) {
    const w = (rand() - 0.5) * 0.04;
    pa *= (1 + w); pb *= (1 - w);
    a.push(pa); b.push(pb);
  }
  const s = makeScope({ A: pages(a), B: pages(b) }, {});
  assert.ok(s.pfCorrelation('A', 'B').r < -0.98);
});

console.log('\n[2] 날짜를 실제로 맞추는가');

test('날짜가 겹치는 관측치만 쓴다', () => {
  const a = pages(Array.from({ length: N }, (_, i) => 100 + i), 1);
  const b = pages(Array.from({ length: N }, (_, i) => 200 + i), 1);
  const s = makeScope({ A: a, B: b }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.strictEqual(r.status, 'OK');
  // 두 종목 날짜가 완전히 같으므로 관측치는 (겹친 날 - 1)이다.
  assert.ok(r.obs >= PF_MIN_PAIR_OBS, `obs=${r.obs}`);
});

test('한쪽에만 있는 날짜는 짝이 되지 않는다', () => {
  // B를 30일 뒤에 시작시키면 겹치는 구간이 짧아져 관측치가 부족해야 한다.
  const a = pages(Array.from({ length: 50 }, () => 100 + rand() * 10), 1);
  const b = pages(Array.from({ length: 50 }, () => 100 + rand() * 10), 45);
  const s = makeScope({ A: a, B: b }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.notStrictEqual(r.status, 'OK', '겹치지 않는 구간까지 짝지었다');
});

test('중간에 뚫린 구멍 구간은 버린다 (거래정지 후 재개)', () => {
  // 2026-08-26 퀀트 감사에서 실측한 시나리오. 서로 무관한 두 종목에 정지 후 재개
  // 구간 하나(A -25% · B -20%)를 그대로 이어 붙이면 상관계수가 0.96으로 뒤집힌다.
  // 그 하나의 변동폭이 평소의 10배라 분산 기여가 100배가 되기 때문이다.
  const n = 60;
  const A = [], B = [];
  let pa = 100, pb = 100;
  for (let i = 0; i < n; i++) {
    pa *= (1 + (rand() - 0.5) * 0.02); pb *= (1 + (rand() - 0.5) * 0.02);
    A.push(pa); B.push(pb);
  }
  const flatA = [], flatB = [];
  pages(A).forEach(pg => pg.days.forEach(d => flatA.push({ ...d })));
  pages(B).forEach(pg => pg.days.forEach(d => flatB.push({ ...d })));
  const wrap = arr => { const o = []; for (let k = 0; k < arr.length; k += 5) o.push({ page: o.length + 1, days: arr.slice(k, k + 5) }); return o; };

  // A만 중간 5일이 빠진다(거래정지). 재개 이후 전 구간을 25% 낮춘 수준으로 옮겨서,
  // '구멍을 건너뛴 그 한 구간만' -25%가 되게 한다. 이후 구간의 수익률은 그대로다
  // — 그래야 구멍 구간이 포함됐는지 여부만 순수하게 잰다.
  const cut = 30;
  const shifted = flatA.map((d, k) => k >= cut + 5 ? { ...d, close: d.close * 0.75 } : d);
  const holedA = shifted.filter((_, k) => k < cut || k >= cut + 5);

  const s = makeScope({ A: wrap(holedA), B: wrap(flatB) }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.strictEqual(r.status, 'OK');

  // 구멍 구간이 빠졌다면, 같은 데이터에서 그 구간을 빼고 계산한 값과 같아야 한다.
  // A에서 5일을 뺐으니 구간은 54개, 그중 구멍 구간 1개가 빠져 53개여야 한다.
  assert.strictEqual(r.obs, holedA.length - 2,
    `구멍을 건너뛴 구간이 관측치에 남아 있다 — obs=${r.obs}, 기대 ${holedA.length - 2}`);

  // 그리고 그 -25% 한 방이 상관계수를 지배하지 않아야 한다.
  const clean = makeScope({ A: wrap(flatA), B: wrap(flatB) }, {}).pfCorrelation('A', 'B');
  assert.ok(Math.abs(r.r - clean.r) < 0.25,
    `구멍 구간이 상관계수를 흔들었다 — r=${r.r.toFixed(3)} vs 정상 ${clean.r.toFixed(3)}`);
});

test('구멍을 건너뛴 구간을 하루 수익률로 쓰지 않는다', () => {
  // A는 매일, B는 하루 걸러 하루만 있는 경우. 겹치는 날짜는 많지만 그중
  // '양쪽 모두 바로 다음 날'인 구간은 거의 없으므로 관측치가 모자라야 한다.
  const n = 100;
  const A = Array.from({ length: n }, () => 100 + rand() * 10);
  const flatA = []; pages(A).forEach(pg => pg.days.forEach(d => flatA.push(d)));
  const everyOther = flatA.filter((_, k) => k % 2 === 0);
  const wrap = arr => { const o = []; for (let k = 0; k < arr.length; k += 5) o.push({ page: o.length + 1, days: arr.slice(k, k + 5) }); return o; };
  const s = makeScope({ A: wrap(flatA), B: wrap(everyOther.map(d => ({ ...d, close: d.close * 2 }))) }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.notStrictEqual(r.status, 'OK',
    'A쪽에 구멍이 있는 구간을 하루 수익률로 이어 붙였다');
});

test('배열 순서가 아니라 날짜로 정렬한다', () => {
  const asc = pages(Array.from({ length: N }, (_, i) => 100 + i), 1);
  const shuffled = { A: [...asc].reverse(), B: pages(Array.from({ length: N }, (_, i) => 100 + i), 1) };
  const s = makeScope(shuffled, {});
  const r = s.pfCorrelation('A', 'B');
  assert.strictEqual(r.status, 'OK', '페이지 순서가 뒤집히면 계산을 못 한다');
  assert.ok(r.r > 0.99, `날짜 정렬이 안 됐다 — r=${r.r}`);
});

console.log('\n[3] 데이터가 모자라면 숫자를 만들지 않는가');

test(`짝 관측치가 ${PF_MIN_PAIR_OBS}일 미만이면 INSUFFICIENT`, () => {
  const short = Array.from({ length: PF_MIN_PAIR_OBS }, () => 100 + rand() * 5);
  const s = makeScope({ A: pages(short), B: pages(short) }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.strictEqual(r.status, 'INSUFFICIENT');
  assert.strictEqual(r.r, undefined, '부족한데 숫자를 만들었다');
});

test('경계에서 정확히 갈린다', () => {
  const mk = n => Array.from({ length: n + 1 }, () => 100 + rand() * 5);
  const below = makeScope({ A: pages(mk(PF_MIN_PAIR_OBS - 1)), B: pages(mk(PF_MIN_PAIR_OBS - 1)) }, {});
  assert.strictEqual(below.pfCorrelation('A', 'B').status, 'INSUFFICIENT');
});

test('가격 이력이 아예 없으면 NO_DATA', () => {
  const s = makeScope({ A: pages(Array.from({ length: N }, () => 100)) }, {});
  assert.strictEqual(s.pfCorrelation('A', 'ZZZ').status, 'NO_DATA');
  assert.strictEqual(s.pfCorrelation('QQQ', 'A').status, 'NO_DATA');
});

test('한 종목이 전혀 안 움직이면 숫자를 만들지 않는다(0으로 나누기)', () => {
  const flat = Array.from({ length: N }, () => 100);
  const move = Array.from({ length: N }, () => 100 + rand() * 10);
  const s = makeScope({ A: pages(flat), B: pages(move) }, {});
  const r = s.pfCorrelation('A', 'B');
  assert.notStrictEqual(r.status, 'OK');
  assert.ok(!Number.isNaN(r.r), 'NaN이 새어 나왔다');
});

test('다른 종목 데이터로 대체하지 않는다', () => {
  const body = extractFn('pfCorrelation');
  assert.ok(!/fallback|대체/.test(body), 'pfCorrelation에 대체 경로가 있다');
});

console.log('\n[4] 겹침 등급 경계');

test('등급 경계가 고정 기준대로다', () => {
  const s = makeScope({}, {});
  assert.strictEqual(s.pfOverlapLabel(0.70).key, 'high');
  assert.strictEqual(s.pfOverlapLabel(0.6999).key, 'mid');
  assert.strictEqual(s.pfOverlapLabel(0.40).key, 'mid');
  assert.strictEqual(s.pfOverlapLabel(0.3999).key, 'low');
  assert.strictEqual(s.pfOverlapLabel(0).key, 'low');
  assert.strictEqual(s.pfOverlapLabel(-0.0001).key, 'inv');
});

console.log('\n[5] 업종 집중도');

test('수량·현재가가 다 있으면 평가금액 기준', () => {
  const stocks = { A: { sector: '반도체', price: 100 }, B: { sector: '반도체', price: 100 },
                   C: { sector: '자동차', price: 100 } };
  const pf = { A: { qty: 8 }, B: { qty: 1 }, C: { qty: 1 } };
  const s = makeScope({}, stocks);
  const r = s.pfSectorConcentration(['A', 'B', 'C'], pf);
  assert.strictEqual(r.basis, 'value');
  assert.strictEqual(r.rows[0].sector, '반도체');
  assert.ok(Math.abs(r.rows[0].pct - 90) < 0.01, `${r.rows[0].pct}`);
});

test('수량이 없으면 종목 수 기준으로 떨어지고 그렇게 표시된다', () => {
  const stocks = { A: { sector: '반도체', price: 100 }, B: { sector: '반도체', price: 100 },
                   C: { sector: '자동차', price: 100 } };
  const s = makeScope({}, stocks);
  const r = s.pfSectorConcentration(['A', 'B', 'C'], { A: {}, B: {}, C: {} });
  assert.strictEqual(r.basis, 'count');
  assert.ok(Math.abs(r.rows[0].pct - 66.67) < 0.1, `${r.rows[0].pct}`);
  // 화면이 기준을 실제로 밝히는지
  assert.ok(/종목 수 기준/.test(extractFn('renderPfRisk')), '종목 수 기준임을 표시하지 않는다');
});

test('가격이 없는 종목이 하나라도 있으면 평가금액 기준으로 속이지 않는다', () => {
  const stocks = { A: { sector: '반도체', price: 100 }, B: { sector: '자동차', price: 0 } };
  const s = makeScope({}, stocks);
  assert.strictEqual(s.pfSectorConcentration(['A', 'B'], { A: { qty: 1 }, B: { qty: 1 } }).basis, 'count');
});

console.log('\n[6] 안전 경계');

test('보유 종목이 서버로 전송되지 않는다', () => {
  for (const fn of ['renderPfRisk', 'pfCorrelation', 'pfCloses', 'pfSectorConcentration']) {
    const body = extractFn(fn);
    assert.ok(!/fetch\s*\(|sendBeacon|XMLHttpRequest|gaeoTrack/.test(body),
      `${fn}()에 외부 전송 코드가 있다`);
  }
});

test('CHIEF 점수·매매 판단에 영향을 주지 않는다', () => {
  const body = extractFn('renderPfRisk') + extractFn('pfCorrelation');
  assert.ok(!/chief|riskScore|LIVE_AUTO|\bcall\b/i.test(body),
    '판단 관련 값을 건드린다');
});

test('Goldman 이름이 노출되지 않는다', () => {
  const body = extractFn('renderPfRisk') + extractFn('pfCorrelation') + extractFn('pfOverlapLabel');
  assert.ok(!/goldman/i.test(body));
});

test('전체 시장 상관행렬을 만들지 않는다(보유 종목만)', () => {
  const body = extractFn('renderPfRisk');
  assert.ok(/loadPortfolio\s*\(/.test(body), '보유 목록에서 출발하지 않는다');
  assert.ok(!/Object\.keys\(\s*STOCKS/.test(body), '전체 종목을 훑고 있다');
  assert.ok(!/tickers|TICKERS/.test(body));
});

test('최대 3개 조합만 보여준다', () => {
  assert.ok(/slice\(0,\s*3\)/.test(extractFn('renderPfRisk')), '3개 제한이 없다');
});

test('28MB 가격 이력을 첫 화면에서 받지 않는다', () => {
  const body = extractFn('renderPfRisk');
  assert.ok(/typeof PRICE_HISTORY==='undefined'/.test(body), '미로딩 분기가 없다');
  assert.ok(/GaeoFeatures\.load\('priceHistory'\)/.test(body), '요청 시 로딩 경로가 없다');
});

test('새 메뉴를 만들지 않고 기존 포트폴리오 안에 들어간다', () => {
  assert.strictEqual((HTML.match(/id="pfRisk"/g) || []).length, 1);
  // 키 입력마다 O(N²)를 돌지 않도록 디바운스를 거쳐 부른다.
  assert.ok(/schedulePfRisk\(\);/.test(extractFn('recalcPf')), 'recalcPf가 부르지 않는다');
  assert.ok(/renderPfRisk/.test(extractFn('schedulePfRisk')), '디바운스가 렌더를 부르지 않는다');
});

test('키 입력마다 전체 재계산하지 않는다 (디바운스 + 캐시)', () => {
  assert.ok(/setTimeout\(renderPfRisk/.test(extractFn('schedulePfRisk')),
    '타이핑이 멈춘 뒤 한 번만 계산하지 않는다');
  assert.ok(/PF_CLOSES_CACHE/.test(extractFn('pfCloses')),
    '같은 종목 종가를 쌍마다 다시 파싱한다');
});

test('종목이 아주 많아도 쌍 계산에 상한이 있다', () => {
  const body = extractFn('renderPfRisk');
  assert.ok(/PF_MAX_PAIR_CODES/.test(body), '쌍 계산 상한이 없다');
  assert.ok(/상위 \$\{PF_MAX_PAIR_CODES\}개만 비교했어요/.test(body),
    '잘라낸 사실을 화면에 알리지 않는다');
});

test('필요 없는 판단 이력(13.6MB)까지 받지 않는다', () => {
  const body = extractFn('renderPfRisk');
  assert.ok(/GaeoFeatures\.load\('priceHistory'\)/.test(body),
    "history 키를 쓰면 필요 없는 history.js까지 42.5MB를 받는다");
  assert.ok(!/GaeoFeatures\.load\('history'\)/.test(body));
  assert.ok(/priceHistory:\['price_history\.js'\]/.test(HTML),
    'priceHistory 전용 번들 키가 없다');
  assert.ok(/약 29MB/.test(body), '내려받는 용량을 사용자에게 알리지 않는다');
});

console.log(`\n${process.exitCode ? '실패 있음' : '전체 통과'} — ${passed}건 통과\n`);
