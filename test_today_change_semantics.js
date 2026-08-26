#!/usr/bin/env node
/**
 * TODAY'S CHANGE(관심종목 변화 보드) 의미 계약 테스트.
 *
 * 왜 있나 (2026-08-26 감사)
 *   이 보드는 지금까지 자동 테스트가 하나도 없었다. 그 사이에 두 가지가 자리를 잡았다.
 *
 *   ① 근거 없는 점수 임계값. '의미 있는 변화' 판정이
 *      callChanged || |종합점수 변화| >= 4 || |개별 분석가 점수 변화| >= 8 였는데,
 *      4와 8의 근거가 설계 문서·테스트 어디에도 없었다. 점수는 매일 흔들리므로
 *      근거 없는 선을 그으면 아무 판단도 안 바뀐 날에도 "오늘 크게 바뀐 종목"이
 *      매일 몇 개씩 만들어진다.
 *
 *   ② 변화 아닌 것을 변화처럼. 변화가 0건이면 representativeSignals()로 시가총액
 *      상위 종목을 끌어와 같은 '변화 카드'에 "→" 화살표를 붙여 그렸다.
 *
 *   둘 다 걷어냈고, 이 파일이 다시 들어오지 못하게 고정한다.
 *
 * 실행: node test_today_change_semantics.js   (브라우저 불필요)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const HTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ok  ${name}`); }
  catch (e) { console.error(`  FAIL ${name}\n       ${e.message}`); process.exitCode = 1; }
}

/** index.html 안의 함수 하나를 이름으로 떼어내 실제로 실행 가능한 형태로 만든다. */
function extractFn(name) {
  const start = HTML.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `index.html에서 ${name}()을 찾지 못했다`);
  let depth = 0, i = HTML.indexOf('{', start);
  const open = i;
  for (; i < HTML.length; i++) {
    if (HTML[i] === '{') depth++;
    else if (HTML[i] === '}' && --depth === 0) break;
  }
  return HTML.slice(start, i + 1);
}

// 판정에 쓰이는 함수들만 떼어내 한 스코프에 올린다.
const scope = new Function(
  `${extractFn('callChanged')}\n${extractFn('conditionChanged')}\n${extractFn('meaningful')}\n` +
  `return {callChanged, conditionChanged, meaningful};`
)();

const sig = (prevCall, nowCall, extra = {}) => ({
  code: '005930',
  previous: prevCall === null ? null : Object.assign({ call: prevCall, total: 50 }, extra.prev || {}),
  latest: Object.assign({ call: nowCall, total: 50 }, extra.now || {}),
});

console.log('\n[1] 임의 점수 임계값이 판정 기준에서 빠졌는가');

test('종합점수가 크게 움직여도 판단이 그대로면 변화가 아니다', () => {
  // 예전 기준이면 |50-70| = 20 >= 4 라 '변화'로 잡혔다.
  const s = sig('HOLD', 'HOLD', { prev: { total: 50 }, now: { total: 70 } });
  assert.strictEqual(scope.meaningful(s), false);
});

test('개별 분석가 점수가 크게 움직여도 판단이 그대로면 변화가 아니다', () => {
  const s = sig('BUY', 'BUY', {
    prev: { taro: { score: 30 }, diana: { score: 30 }, nova: { score: 30 }, flow: { score: 30 } },
    now: { taro: { score: 90 }, diana: { score: 30 }, nova: { score: 30 }, flow: { score: 30 } },
  });
  assert.strictEqual(scope.meaningful(s), false);
});

test('소스에 4·8 임계값 표현이 남아 있지 않다', () => {
  const body = extractFn('meaningful');
  assert.ok(!/>=\s*4\b/.test(body), `meaningful()에 >=4가 남아 있다:\n${body}`);
  assert.ok(!/>=\s*8\b/.test(body), `meaningful()에 >=8이 남아 있다:\n${body}`);
  assert.ok(!/totalDelta/.test(body), 'meaningful()이 아직 점수 델타로 선정하고 있다');
});

console.log('\n[2] CHIEF 판단 변화는 정상적으로 잡히는가');

for (const [before, after] of [['SELL', 'BUY'], ['BUY', 'SELL'], ['HOLD', 'BUY'],
                               ['BUY', 'HOLD'], ['SELL', 'HOLD'], ['HOLD', 'SELL']]) {
  test(`${before} → ${after} 는 변화다`, () => {
    assert.strictEqual(scope.meaningful(sig(before, after)), true);
  });
}

test('같은 판단이면 변화가 아니다', () => {
  assert.strictEqual(scope.meaningful(sig('BUY', 'BUY')), false);
});

test('이전 기록이 없으면 변화로 치지 않는다(첫 기록은 비교 대상이 아니다)', () => {
  assert.strictEqual(scope.meaningful(sig(null, 'BUY')), false);
});

test('한쪽 판단이 비어 있으면 변화로 단정하지 않는다', () => {
  assert.strictEqual(scope.meaningful(sig('', 'BUY')), false);
  assert.strictEqual(scope.meaningful(sig('BUY', '')), false);
});

console.log('\n[3] 모델·Universe가 바뀐 비교는 제외하는가');

test('modelVersion이 다르면 판단이 바뀌어도 오늘 변화에서 뺀다', () => {
  const s = sig('HOLD', 'BUY', { prev: { modelVersion: 'm1' }, now: { modelVersion: 'm2' } });
  assert.strictEqual(scope.conditionChanged(s), true);
  assert.strictEqual(scope.meaningful(s), false);
});

test('coverageVersion이 다르면 오늘 변화에서 뺀다', () => {
  const s = sig('HOLD', 'BUY', { prev: { coverageVersion: 'c1' }, now: { coverageVersion: 'c2' } });
  assert.strictEqual(scope.meaningful(s), false);
});

test('같은 버전이면 정상적으로 변화로 잡힌다', () => {
  const s = sig('HOLD', 'BUY', {
    prev: { modelVersion: 'm1', coverageVersion: 'c1' },
    now: { modelVersion: 'm1', coverageVersion: 'c1' },
  });
  assert.strictEqual(scope.meaningful(s), true);
});

test('버전 정보가 없으면 달라졌다고 단정하지 않는다(옛 기록 호환)', () => {
  // history.js의 오래된 항목에는 modelVersion이 아예 없다. 그걸 '조건 변화'로
  // 읽으면 정상 변화까지 전부 사라진다.
  assert.strictEqual(scope.conditionChanged(sig('HOLD', 'BUY')), false);
  assert.strictEqual(scope.meaningful(sig('HOLD', 'BUY')), true);
  const oneSided = sig('HOLD', 'BUY', { now: { modelVersion: 'm2' } });
  assert.strictEqual(scope.conditionChanged(oneSided), false);
});

console.log('\n[4] 변화가 없을 때 없는 변화를 지어내지 않는가');

test('representativeSignals() 함수 정의가 제거됐다', () => {
  assert.ok(!/function\s+representativeSignals\s*\(/.test(HTML),
    'representativeSignals()가 아직 정의돼 있다');
});

test('변화 보드가 MEGA_CAP 대체 목록을 끌어오지 않는다', () => {
  // 주석에 이름이 남아 있는 건 괜찮다(왜 뺐는지 설명). 실제 호출만 본다.
  const code = extractFn('renderChanges').replace(/\/\/[^\n]*/g, '');
  assert.ok(!/representativeSignals\s*\(/.test(code),
    'renderChanges()가 아직 대체 목록을 부른다');
  assert.ok(!/MEGA_CAP/.test(code), 'renderChanges()가 MEGA_CAP을 직접 참조한다');
});

test('변화 0건일 때 보여줄 카드가 없으면 빈 상태로 간다', () => {
  const body = extractFn('renderChanges');
  // marketChanges는 실제로 판단이 바뀐 종목이라 대체로 써도 거짓이 아니다.
  assert.ok(/marketChanges\s*\(/.test(body), 'marketChanges 대체 경로가 사라졌다');
  assert.ok(/오늘은 관심종목도 시장도 판단이 바뀐 곳이 없어요/.test(body),
    '아무 변화도 없을 때의 정직한 문구가 없다');
});

test('빈 상태 문구가 그대로 있다', () => {
  assert.ok(/오늘은 큰 판단 변화가 없어요/.test(HTML), '빈 상태 문구가 사라졌다');
});

test('노출 개수는 최대 3개로 유지된다', () => {
  const body = extractFn('renderChanges');
  assert.ok(/shown\s*=\s*shown\.slice\(0,\s*3\)/.test(body), '3개 제한이 사라졌다');
});

console.log('\n[5] 중복 UI를 만들지 않았는가');

test('변화 보드는 하나뿐이다', () => {
  const boards = (HTML.match(/class="change-board"/g) || []).length;
  assert.strictEqual(boards, 1, `change-board가 ${boards}개다(중복 UI 금지)`);
  const lists = (HTML.match(/id="homeChangeList"/g) || []).length;
  assert.strictEqual(lists, 1, `homeChangeList가 ${lists}개다`);
});

test('기존 change-item 카드 구조를 그대로 쓴다', () => {
  assert.ok(/class="change-item"/.test(HTML), 'change-item 카드가 사라졌다');
});

console.log(`\n${process.exitCode ? '실패 있음' : '전체 통과'} — ${passed}건 통과\n`);
