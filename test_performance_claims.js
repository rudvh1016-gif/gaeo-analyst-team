/**
 * 성과 주장 정직성 계약 테스트 (2026-08-31 신설)
 *
 * 왜 이 테스트가 있나
 * ────────────────────
 * Constitution(gaeo_evolution/evolution_constitution.json)에 두 조항이 있다.
 *
 *   statisticalPolicy.independenceUnit = "decision_date"
 *     "같은 날 600종목은 서로 독립이 아니다. 표본 크기는 raw N이 아니라
 *      unique decision days 기준으로 판단한다."
 *
 *   publicClaimPolicy
 *     "성능 숫자는 실측값만 표시한다."
 *
 * 그런데 2026-08-31 점검에서 홈 화면 KPI가 "팀 적중률 59.9% · 3,463건"이라고만
 * 적고 있었다. 그 3,463건은 실제로는 **판단일 6일치**였다. 같은 저장소의 Evolution
 * 성적표는 똑같은 구간을 "판단일이 6일뿐입니다(최소 20일 필요)"라며 결론을 거부하고
 * 있었는데, 정작 사용자가 가장 먼저 보는 화면만 그 기준을 안 지키고 있었던 것이다.
 *
 * 이 파일은 "화면이 실제 근거보다 세게 말하는" 상태로 되돌아가지 못하게 막는다.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync('index.html', 'utf8');

function loadJsObject(file, varname) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\s*\/\/.*$/gm, '');
  const m = raw.match(new RegExp('(?:const|window\\.)\\s*' + varname + '\\s*=\\s*(\\{[\\s\\S]*\\})\\s*;'));
  return m ? JSON.parse(m[1]) : null;
}

let checks = 0;
const ok = () => { checks++; };

/* ── 1. 홈 KPI가 '건수'만 말하지 않고 '판단일수'를 함께 말하는가 ────────── */
assert.match(
  html, /const gradedDays=new Set\(\);/,
  '홈 KPI가 판단일수를 세지 않는다. 건수만 보여주면 6일치가 3천 건처럼 읽힌다.'
);
assert.match(
  html, /gradedDays\.add\(String\(e\.date\)\.slice\(0,10\)\)/,
  '채점된 판단의 날짜를 모으는 코드가 사라졌다.'
);
assert.match(
  html, /5거래일 뒤 종가 · 판단 \$\{days\}일 · \$\{graded\.toLocaleString\(\)\}건/,
  'KPI 보조 문구가 판단일수를 빼먹었다.'
);
ok();

/* ── 2. 근거가 얇을 때 화면이 스스로 그렇다고 말하는가 ─────────────────── */
assert.match(
  html, /const thin=days>0&&days<minDays;/,
  '판단일수가 기준 미만인지 판정하는 코드가 없다.'
);
assert.match(
  html, /아직 \$\{minDays\}일치가 안 돼 참고용이에요/,
  '표본이 얇을 때의 경고 문구가 사라졌다.'
);
// 기준값을 화면에서 지어내지 않고 러너가 내려준 값을 쓰는지 (하드코딩 방지).
assert.match(
  html, /const minDays=\(teamSummary&&Number\(teamSummary\.minDaysForConclusion\)\)\|\|20;/,
  '결론 기준일수를 team_weights가 아니라 화면이 임의로 정하고 있다.'
);
ok();

/* ── 3. 지연 로딩 폴백 경로에서도 판단일수를 잃지 않는가 ───────────────── */
// history.js가 아직 안 왔을 때 team_weights 요약으로 대체하는데, 이때 날짜를
// 안 가져오면 "판단 0일 · 3,463건"이라는 더 나쁜 문구가 나온다.
assert.match(
  html, /days=Number\(teamSummary\.uniqueDecisionDays\)\|\|0;/,
  '폴백 경로가 판단일수를 가져오지 않는다.'
);
ok();

/* ── 4. team_weights.js가 판단일수를 실제로 싣고 있는가 ────────────────── */
const twPath = path.join(process.cwd(), 'team_weights.js');
if (fs.existsSync(twPath)) {
  const tw = loadJsObject(twPath, 'TEAM_WEIGHTS');
  const team = tw && tw.global && tw.global.team;
  assert.ok(team, 'team_weights.js에 global.team이 없다.');
  assert.equal(typeof team.uniqueDecisionDays, 'number',
    'team.uniqueDecisionDays가 없다 — 화면이 판단일수를 알 방법이 없어진다.');
  assert.equal(typeof team.minDaysForConclusion, 'number',
    'team.minDaysForConclusion이 없다.');
  assert.ok(team.uniqueDecisionDays <= team.n,
    '판단일수가 채점 건수보다 많을 수는 없다.');
  ok();
}

/* ── 5. 소개문이 검증을 '끝난 일'처럼 말하지 않는가 ────────────────────── */
// noscript 소개문은 검색엔진과 자바스크립트 없는 방문자가 읽는 첫 문장이다.
assert.doesNotMatch(
  html, /모의투자 계좌로 성과를 검증합니다/,
  '"검증합니다"는 검증이 끝났다는 뜻으로 읽힌다. 모의투자는 현재 '
  + 'INSUFFICIENT_EVIDENCE 상태다(청산 표본 부족).'
);
assert.match(
  html, /모의투자 계좌로 성과를 검증하고 있습니다/,
  '소개문에서 모의투자 설명이 통째로 사라졌다.'
);
assert.match(
  html, /아직 결론을 말할 만큼 기록이 쌓이지 않았습니다/,
  '소개문에 진행 중이라는 단서가 없다.'
);
ok();

/* ── 6. 은퇴한 구간의 성적을 오늘 성적처럼 보여주지 않는가 ─────────────── */
// 표본이 가장 많이 익은 구간(500종목 시절)의 숫자를 쓰되, 지금 추적 중인 구간이
// 아직 결론을 못 낸다면 그 사실을 같은 문장에서 밝혀야 한다.
assert.match(
  html, /String\(cur\.status\|\|''\)\.startsWith\('INSUFFICIENT'\)/,
  '현재 추적 구간의 근거 부족 상태를 확인하지 않는다.'
);
assert.match(
  html, /아직 판단 '\s*\+nf\(cur\.uniqueDates\)\+'일치뿐이라 따로 성적을 말하지 않아요/,
  '현재 구간이 아직 결론을 못 낸다는 안내가 사라졌다.'
);
ok();

/* ── 7. 모의투자 근거 게이트가 살아 있는가 (기존 보호장치 회귀 방지) ───── */
assert.match(html, /const insufficient=String\(P\.evidenceStatus\|\|''\)\.startsWith\('INSUFFICIENT'\);/,
  '모의투자 근거 게이트가 사라졌다.');
const paperPath = path.join(process.cwd(), 'paper_public.js');
if (fs.existsSync(paperPath)) {
  // 파일에 window.* 대입이 여러 개라 정규식으로 자르면 어긋난다. 가짜 window에
  // 그대로 실행시켜 실제 값을 읽는다(외부 접근 없는 순수 데이터 파일이다).
  const vm = require('node:vm');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(paperPath, 'utf8'), sandbox);

  // 근거가 부족하다고 선언한 계좌는 승률·평균수익률을 숫자로 내면 안 된다.
  const check = (o, where) => {
    if (!o || typeof o !== 'object') return 0;
    if (!String(o.evidenceStatus || '').startsWith('INSUFFICIENT')) return 0;
    for (const k of ['winRatePct', 'avgReturnPct', 'medianReturnPct']) {
      assert.equal(o[k], null,
        `${where}: 근거 부족(INSUFFICIENT_EVIDENCE)인데 ${k}에 숫자가 들어 있다.`);
    }
    return 1;
  };
  let gated = 0;
  gated += check(sandbox.window.GAEO_PAPER, 'PAPER 기본');
  const versions = sandbox.window.GAEO_PAPER_V || {};
  for (const [k, v] of Object.entries(versions)) {
    gated += check(v, `PAPER ${k}`);
    for (const [k2, v2] of Object.entries((v && v.versions) || {})) gated += check(v2, `PAPER ${k}.${k2}`);
  }
  // 게이트가 걸린 계좌가 하나도 없으면 이 검사가 공허하게 통과한 것이다.
  // (모두 근거를 채워 게이트가 풀렸다면 그때 이 줄을 지우면 된다.)
  assert.ok(gated > 0, '근거 부족 상태인 모의투자 계좌가 하나도 없다 — 검사 대상 확인 필요.');
  ok();
}

/* ── 8. 성능 숫자를 화면에 하드코딩하지 않는가 ─────────────────────────── */
// Constitution publicClaimPolicy: "성능 숫자는 실측값만 표시한다."
// 주석은 이력 기록이므로 대상에서 뺀다 — 실제로 그려지는 문자열만 본다.
const withoutComments = html
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/^\s*\/\/.*$/gm, '');
const bannedClaim = /(적중률|정확도|승률)\s*(?:는|은|이|가)?\s*[0-9]{1,3}(?:\.[0-9])?%/g;
// GAEO 자신의 성적을 말하는 게 아니라 '개념을 가르치는' 문장은 예외다.
// 예외는 여기에만 적고, 새로 추가할 때는 반드시 "이건 우리 성적 주장이 아니다"를
// 확인한 뒤 넣는다. 목록을 늘려 검사를 무력화하지 말 것.
const EDUCATIONAL = [
  // 승률과 평균수익률이 다른 지표라는 일반 설명. 특정 성과를 주장하지 않는다.
  '승률이 50% 근처여도',
];
// 실측값으로 채워지는 자리(${…} / '+변수+')는 애초에 숫자가 없어 위 정규식에 안 걸린다.
// 그러니 주변에 템플릿이 보인다는 이유로 봐주면 안 된다 — 실제로 그렇게 했더니
// "팀 적중률 59.9%"를 옆의 ${accCls} 때문에 놓쳤다(2026-08-31 고의실패 검사에서 발견).
const hits = [...withoutComments.matchAll(bannedClaim)].filter(m => {
  const around = withoutComments.slice(Math.max(0, m.index - 60), m.index + 60);
  return !EDUCATIONAL.some(e => around.includes(e));
});
assert.equal(hits.length, 0,
  `화면 문구에 성과 숫자가 하드코딩돼 있다(실측값만 표시해야 한다): ${hits.map(h => h[0]).join(' | ')}`);
ok();

console.log(`performance claim contract passed (${checks} groups)`);
