/* DART 공시 노출 계약 — 2026-08-18
 *
 * 왜 필요한가
 *   공시 수집기는 잘 돌고 있었는데, 화면에서는 「종목분석 → 종합 판단 탭 → 상세 분석
 *   근거」 안쪽 3단계에만 있어서 사용자가 "어디에도 안 보인다"고 했다. 그래서
 *   ① 홈에서 제목만 훑을 수 있고 ② 종목 화면에서 관련 분석가에 매칭돼 뜨는지를
 *   실제 렌더로 고정한다. 데이터가 있는데 화면에 안 나오면 실패로 잡는다.
 *
 * 계약
 *   A. 소형 스냅샷(dart_today.js)이 존재하고 스키마가 맞다.
 *   B. 홈이 3MB짜리 auto_analysis.js를 받지 않고도 공시를 보여준다.
 *   C. 홈 목록은 한 장에 5건이고 앞뒤로 넘길 수 있다.
 *   D. 공시 → 분석가 매칭이 결정적이다(같은 제목이면 언제나 같은 축).
 *   E. 종목 화면에서 그 축의 분석가 카드에 실제로 보인다.
 *   F. 공시가 없는 종목에는 "공시 없음"을 단정하는 블록을 만들지 않는다.
 *
 * 실행: node test_static_server.js 8877 &  →  node test_dart_exposure.js
 */
const { chromium } = require('./test_playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877';
const failures = [];
function check(name, condition, detail) {
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}` + (!condition && detail ? ` — ${detail}` : ''));
  if (!condition) failures.push(name);
}

(async () => {
  // ── A. 소형 스냅샷 ────────────────────────────────────────────────────────
  const snapPath = path.join(__dirname, 'dart_today.js');
  check('A1. dart_today.js가 저장소에 존재', fs.existsSync(snapPath));
  const raw = fs.existsSync(snapPath) ? fs.readFileSync(snapPath, 'utf-8') : '';
  const snap = raw ? new Function(raw + ';return DART_TODAY;')() : null;
  check('A2. DART_TODAY 스키마(generatedAt·count·items)',
    !!snap && typeof snap.generatedAt === 'string' && Array.isArray(snap.items),
    JSON.stringify(Object.keys(snap || {})));
  check('A3. items가 종목명까지 담는다(화면에서 조회 안 해도 되게)',
    !!snap && snap.items.every(i => i.code && i.name && i.title));
  check('A4. count와 items 길이가 일치', !!snap && snap.count === snap.items.length,
    snap ? `${snap.count} vs ${snap.items.length}` : '');
  // 홈에서 받는 파일이므로 작아야 한다(auto_analysis.js는 3MB).
  const kb = raw.length / 1024;
  check('A5. 홈에서 받아도 될 만큼 작다(200KB 미만)', kb < 200, `${kb.toFixed(1)}KB`);
  check('A6. analyze_auto.py가 이 파일을 만든다(수동 파일이 아님)',
    /open\(os\.path\.join\(HERE, "dart_today\.js"\)/.test(
      fs.readFileSync(path.join(__dirname, 'analyze_auto.py'), 'utf-8')));
  // 생성기만 고치고 커밋 목록에 넣는 걸 잊으면, 러너가 만들어도 사이트에는 영원히 안 올라간다.
  check('A7. 워크플로가 dart_today.js를 커밋한다',
    /dart_today\.js/.test(fs.readFileSync(
      path.join(__dirname, '.github', 'workflows', 'update-analysis.yml'), 'utf-8')));

  const browser = await chromium.launch({ headless: true });

  // ── B·C. 홈 위젯 ──────────────────────────────────────────────────────────
  // ⚠️ 홈은 「오늘의 판단」 순위를 다듬으려고 auto_analysis.js(3MB)를 백그라운드로 받는다.
  //    그래서 "안 받는다"가 아니라 **그걸 기다리지 않고도 공시가 뜬다**가 진짜 계약이다.
  //    아래에서 auto_analysis.js를 아예 막아 두고도 위젯이 뜨는지 확인한다.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 1000 }, serviceWorkers: 'block' });
  await ctx.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
  const page = await ctx.newPage();
  const errs = [], snapReq = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  page.on('request', r => { if (/dart_today\.js/.test(r.url())) snapReq.push(r.url()); });
  await page.route('**/auto_analysis.js*', r => r.abort());
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  for (let i = 0; i < 48; i++) {
    const on = await page.evaluate(() => document.querySelectorAll('.db-item').length > 0);
    if (on) break;
    await page.waitForTimeout(250);
  }
  const home = await page.evaluate(() => ({
    shown: !document.getElementById('dartBoard').hidden,
    items: document.querySelectorAll('.db-item').length,
    page: (document.getElementById('dartPageLabel') || {}).textContent || '',
    prevDisabled: (document.getElementById('dartPrev') || {}).disabled,
    hasTitleOnly: [...document.querySelectorAll('.db-item')].every(
      el => el.querySelector('.db-nm') && el.querySelector('.db-tt')),
    clickable: [...document.querySelectorAll('.db-item')].every(el => !!el.dataset.go)
  }));
  check('B1. 홈에 「오늘의 공시」가 보인다', home.shown);
  check('B2. 3MB auto_analysis.js 없이도 공시가 뜬다(소형 스냅샷 경로)',
    home.shown && home.items > 0, `shown=${home.shown} items=${home.items}`);
  check('B3. 소형 스냅샷을 실제로 내려받았다', snapReq.length > 0, String(snapReq.length));
  check('C1. 한 장에 5건', home.items === 5, String(home.items));
  check('C2. 제목만 노출(종목명 + 공시 제목)', home.hasTitleOnly);
  check('C3. 항목마다 이동 대상이 있다', home.clickable);
  check('C4. 첫 장에서 이전 버튼 비활성', home.prevDisabled === true);
  check('C5. 페이지 표시가 1/N 꼴', /^1 \/ \d+$/.test(home.page.trim()), home.page);

  const pages = Number((home.page.split('/')[1] || '1').trim());
  if (pages > 1) {
    await page.click('#dartNext');
    await page.waitForTimeout(350);
    const p2 = await page.evaluate(() => ({
      page: document.getElementById('dartPageLabel').textContent,
      prevDisabled: document.getElementById('dartPrev').disabled,
      first: document.querySelector('.db-item').innerText
    }));
    check('C6. 다음 장으로 넘어간다', /^2 \//.test(p2.page.trim()), p2.page);
    check('C7. 다음 장에서 이전 버튼 활성', p2.prevDisabled === false);
    await page.click('#dartPrev');
    await page.waitForTimeout(350);
    const back = await page.evaluate(() => document.getElementById('dartPageLabel').textContent);
    check('C8. 이전 장으로 되돌아온다', /^1 \//.test(back.trim()), back);
  }

  // ── D. 매칭 규칙이 결정적인가 (같은 제목 → 항상 같은 축) ────────────────────
  const axis = await page.evaluate(() => {
    const cases = {
      '주요사항보고서(유상증자결정)': 'diana',
      '반기보고서 (2026.06)': 'diana',
      '현금ㆍ현물배당결정': 'diana',
      '단일판매ㆍ공급계약체결': 'diana',
      '주식등의대량보유상황보고서(일반)': 'flow',
      '임원ㆍ주요주주특정증권등소유상황보고서': 'flow',
      '주주총회소집결의': 'flow',
      '자기주식처분결과보고서': 'flow',
      '[기재정정]일괄신고서': 'risk',
      '풍문또는보도에대한해명(미확정)': 'risk'
    };
    const got = {}, twice = {};
    for (const k of Object.keys(cases)) {
      got[k] = dartAxisOf(k).axis;
      twice[k] = dartAxisOf(k).axis;              // 같은 입력 두 번 → 같은 결과여야 한다
    }
    return { cases, got, stable: Object.keys(cases).every(k => got[k] === twice[k]) };
  });
  const wrong = Object.keys(axis.cases).filter(k => axis.got[k] !== axis.cases[k]);
  check('D1. 공시 제목 → 분석가 축 매칭이 기대와 일치', wrong.length === 0,
    wrong.map(k => `${k}: ${axis.got[k]}≠${axis.cases[k]}`).join(' | '));
  check('D2. 같은 제목은 항상 같은 축(결정적)', axis.stable);
  const unknown = await page.evaluate(() => dartAxisOf('듣도보도못한새로운공시').axis);
  check('D3. 규칙에 없는 제목도 축을 잃지 않는다', !!unknown, unknown);
  await ctx.close();

  // ── E·F. 종목 화면 매칭 ───────────────────────────────────────────────────
  // ⚠️ 2026-08-26: 예전에는 종목코드와 기대 축을 코드에 박아 뒀다
  //    (실리콘투 → diana·flow / KB금융 → risk). 공시는 **매일 바뀐다** — 그 종목의
  //    그 공시가 사라지는 순간 검사가 실패하는데, 정작 기능은 멀쩡하다.
  //    실제로 origin/main에서 3건이 그렇게 실패하고 있었다(실리콘투는 오늘 공시 0건,
  //    KB금융은 그 사이 수급 축 공시가 새로 붙었다).
  //    그래서 대상 종목을 **오늘 실제 공시에서 고른다.** 기대 축도 박아넣지 않고
  //    dartAxisOf()로 그때그때 계산한다 — 그 함수 자체는 위 D1이 고정된 예시로
  //    이미 검증하므로, 여기서는 "데이터 → 화면 배치"라는 배선만 본다.
  const tickerCodes = new Set(JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tickers.js'), 'utf-8')
      .match(/const\s+TICKERS\s*=\s*(\[[\s\S]*?\])\s*;/)[1]).map(x => x.code));
  const byCode = new Map();
  for (const it of (snap ? snap.items : [])) {
    if (!tickerCodes.has(it.code)) continue;
    if (!byCode.has(it.code)) byCode.set(it.code, []);
    byCode.get(it.code).push(it.title);
  }
  // 공시가 많이 붙은 종목부터 2개 — 축이 여러 개라 배선을 더 넓게 본다.
  const targets = [...byCode.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 2);
  check('E0. 오늘 공시가 붙은 검사 대상 종목을 찾았다', targets.length > 0,
    `분석 대상 종목 중 공시 보유 ${byCode.size}개 / 전체 공시 ${(snap ? snap.items.length : 0)}건`);
  for (const [code, titles] of targets) {
    const c2 = await browser.newContext({ viewport: { width: 390, height: 1200 }, serviceWorkers: 'block' });
    await c2.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    const p2 = await c2.newPage();
    const e2 = [];
    p2.on('pageerror', e => e2.push(String(e).slice(0, 160)));
    await p2.goto(`${BASE}/index.html?m=single&code=${code}`, { waitUntil: 'load' });
    await p2.evaluate(() => document.fonts.ready);
    for (let i = 0; i < 60; i++) {
      const n = await p2.evaluate(() => document.querySelectorAll('.card.on').length);
      if (n >= 4) break;
      await p2.waitForTimeout(250);
    }
    await p2.waitForTimeout(1200);
    const got = await p2.evaluate(() => [...document.querySelectorAll('.dart-match')]
      .map(el => { const card = el.closest('.card'); return card ? card.id.replace('card-', '')
        : ((el.previousElementSibling || {}).id || '').replace('fx-', ''); }));
    // 기대 축 = 오늘 그 종목 공시들의 축 ∩ 이 화면이 실제로 가진 축 슬롯.
    // 슬롯이 없는 축까지 요구하면 기능이 멀쩡해도 실패한다(그건 검사의 잘못이다).
    const want = await p2.evaluate(ts => {
      const slots = new Set([...document.querySelectorAll('[id^="card-"],[id^="fx-"]')]
        .map(el => el.id.replace(/^card-|^fx-/, '')));
      return [...new Set(ts.map(t => dartAxisOf(t).axis))].filter(a => slots.has(a));
    }, titles);
    check(`E1.${code} 오늘 공시의 축마다 분석가 카드에 실제로 붙는다`,
      want.length > 0 && want.every(a => got.includes(a)),
      `공시 ${titles.length}건 / 기대축 ${JSON.stringify(want)} / 실제 ${JSON.stringify(got)}`);
    check(`E2.${code} 관계없는 축에는 붙지 않는다`,
      got.every(a => want.includes(a)), `기대축 ${JSON.stringify(want)} / 실제 ${JSON.stringify(got)}`);
    check(`E3.${code} 분석가별 근거 탭에서 실제로 보인다`,
      await p2.evaluate(() => {
        const t = [...document.querySelectorAll('[data-analysis-tab]')].find(x => x.dataset.analysisTab === 'agents');
        if (t) t.click();
        return true;
      }) && await (async () => {
        await p2.waitForTimeout(400);
        const first = got[0];
        await p2.evaluate(ax => { const t = [...document.querySelectorAll('[data-analyst-tab]')]
          .find(x => x.dataset.analystTab === ax); if (t) t.click(); }, first);
        await p2.waitForTimeout(600);
        return p2.evaluate(() => [...document.querySelectorAll('.dart-match')].some(d => d.offsetParent !== null));
      })());
    check(`E4.${code} JS 예외 0`, e2.length === 0, e2.join(' | '));
    await c2.close();
  }

  // F. 공시가 없는 종목엔 블록 자체를 만들지 않는다("공시 없음"이라고 단정하지 않기)
  const noneCode = snap ? (() => {
    const has = new Set(snap.items.map(i => i.code));
    const t = fs.readFileSync(path.join(__dirname, 'tickers.js'), 'utf-8');
    const arr = JSON.parse(t.match(/const\s+TICKERS\s*=\s*(\[[\s\S]*?\])\s*;/)[1]);
    const hit = arr.find(x => !has.has(x.code));
    return hit ? hit.code : null;
  })() : null;
  if (noneCode) {
    const c3 = await browser.newContext({ viewport: { width: 390, height: 1200 }, serviceWorkers: 'block' });
    await c3.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    const p3 = await c3.newPage();
    await p3.goto(`${BASE}/index.html?m=single&code=${noneCode}`, { waitUntil: 'load' });
    await p3.evaluate(() => document.fonts.ready);
    for (let i = 0; i < 60; i++) {
      const n = await p3.evaluate(() => document.querySelectorAll('.card.on').length);
      if (n >= 4) break;
      await p3.waitForTimeout(250);
    }
    await p3.waitForTimeout(1000);
    const n = await p3.evaluate(() => document.querySelectorAll('.dart-match').length);
    check(`F1. 공시 없는 종목(${noneCode})엔 매칭 블록을 만들지 않는다`, n === 0, `${n}개`);
    await c3.close();
  }

  check('G1. 홈 JS 예외 0', errs.length === 0, errs.join(' | '));
  await browser.close();
  console.log();
  if (failures.length) {
    console.log(`실패 ${failures.length}건: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('test_dart_exposure: 전체 통과 (공시 노출 계약)');
})().catch(error => { console.error(error); process.exit(1); });
