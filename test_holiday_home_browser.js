// 휴장일에 홈이 거짓 경고를 내지 않는가 (2026-09-06 신설)
//
// 왜 있나
//   2026-09-06부터 러너가 휴장일에 아예 돌지 않는다(PR #513). 그 전에는 휴장일에도
//   수집이 돌아 data.js에 그날 날짜가 찍혀서 화면이 휴장일을 몰라도 아무 일이 없었다.
//   이제 모르면 공휴일마다 홈에
//       ⚠️ 마지막 갱신은 2026-09-23입니다 (약 1일 전)
//       DAILY BRIEF … · 새 시세 확인 중
//   이 뜬다. 시장이 안 열린 날이니 고장이 아니라 정상인데 경고가 뜨는 것이다(검수 m1).
//
// 어떻게 재현하나
//   브라우저 시계를 2026-09-24(목, 추석) 11:00 KST로 바꿔 놓고 홈을 연다.
//   대조군으로 2026-09-23(수, 거래일) 11:00에는 평소대로 동작하는지도 같이 본다.
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
const need = (cond, msg) => { if (!cond) throw new Error(msg); };

// 브라우저 안에서 Date를 통째로 갈아끼운다(Intl.DateTimeFormat도 이 Date를 본다).
const freeze = iso => {
  const fixed = new Date(iso).getTime();
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [fixed])); }
    static now() { return fixed; }
  }
  window.Date = FakeDate;
};

async function probe(browser, iso) {
  // ⚠️ 반드시 KST로 돌린다. snapshotStaleDays의 '개장 전(09시)' 판정은 브라우저 **현지**
  //    시각을 쓴다 — 실제 이용자는 한국에 있으므로 KST가 맞는 조건이다. UTC 컨테이너
  //    기본값으로 돌리면 11:00 KST가 02:00으로 읽혀 늘 '개장 전'이 된다.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce',
    timezoneId: 'Asia/Seoul' });
  await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
  await page.addInitScript(freeze, iso);
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);
  const out = await page.evaluate(() => ({
    executed: !!window.__GAEO_APP_EXECUTED__,
    meta: document.getElementById('briefMeta')?.innerText.replace(/\n/g, ' ') || '',
    date: document.getElementById('briefDate')?.innerText || '',
    // ⚠️ 이 저장소 사본의 data.js 날짜는 실행 시점마다 다르다. "며칠 전 갱신" 경고가
    //    맞는지 보려면 기준 날짜를 직접 넣고 순수 함수로 재야 한다.
    stale: (day => { const keep = SNAP_DATE; SNAP_DATE = day; const n = snapshotStaleDays(); SNAP_DATE = keep; return n; }),
  }));
  return { page, out };
}

// SNAP_DATE를 바꿔 가며 snapshotStaleDays()를 직접 잰다.
async function staleFor(page, dataDay) {
  return page.evaluate(day => {
    const keep = SNAP_DATE;
    SNAP_DATE = day;
    const n = snapshotStaleDays();
    SNAP_DATE = keep;
    return n;
  }, dataDay);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    // ① 휴장일 (2026-09-24 목요일, 추석) 11:00 KST = 02:00 UTC
    const h = await probe(browser, '2026-09-24T02:00:00Z');
    need(h.out.executed, '휴장일 시계에서 app.js가 실행되지 않았다');
    need(!/새 시세 확인 중/.test(h.out.meta),
      `휴장일에 '새 시세 확인 중'이 떴다: ${JSON.stringify(h.out.meta)}`);
    need(/휴장일/.test(h.out.date), `휴장일 표시가 없다: ${JSON.stringify(h.out.date)}`);
    const hStale = await staleFor(h.page, '2026-09-23');   // 직전 거래일 자료
    need(hStale === 0, `휴장일에 직전 거래일 자료가 ${hStale}일 늦었다고 나온다 — 거짓 경고다`);
    const hStale2 = await staleFor(h.page, '2026-09-22');  // 하루 더 옛날 자료 = 진짜 지연
    need(hStale2 === 1, `휴장일이라도 진짜 지연(9/22 자료)은 1일로 잡혀야 한다: ${hStale2}`);
    console.log(`[PASS] 휴장일 2026-09-24 11:00 — 9/23 자료 ${hStale}일 · 9/22 자료 ${hStale2}일 · ${h.out.date}`);
    await h.page.close();

    // ② 연휴 다음 거래일 (2026-09-28 월) — 9/24·9/25가 휴장이라 9/23 자료는 이제 진짜 낡았다
    const m = await probe(browser, '2026-09-28T02:00:00Z');
    need(!/휴장일/.test(m.out.date), `거래일인데 휴장일이라고 한다: ${JSON.stringify(m.out.date)}`);
    const mStale = await staleFor(m.page, '2026-09-23');
    need(mStale === 5, `연휴 뒤 월요일에 9/23 자료는 5일 전이어야 한다: ${mStale}`);
    const mFresh = await staleFor(m.page, '2026-09-28');
    need(mFresh === 0, `당일 자료가 낡았다고 나온다: ${mFresh}`);
    console.log(`[PASS] 거래일 2026-09-28 11:00 — 9/23 자료 ${mStale}일 · 당일 자료 ${mFresh}일`);
    await m.page.close();

    // ③ 주말(2026-09-26 토) — 예전부터 조용해야 하는 날. 회귀 확인용
    const w = await probe(browser, '2026-09-26T02:00:00Z');
    need(!/새 시세 확인 중/.test(w.out.meta), `주말에 '새 시세 확인 중'이 떴다: ${w.out.meta}`);
    const wStale = await staleFor(w.page, '2026-09-23');   // 9/24·9/25 휴장 → 직전 거래일은 9/23
    need(wStale === 0, `토요일에 9/23 자료가 ${wStale}일 늦었다고 나온다 — 그날이 직전 거래일이다`);
    console.log(`[PASS] 토요일 2026-09-26 — 9/23 자료 ${wStale}일 · ${w.out.date}`);
    await w.page.close();
  } finally {
    await browser.close();
  }
  console.log('holiday home browser contract passed');
})().catch(e => { console.error(e && e.message ? e.message : e); process.exitCode = 1; });
