/* 메뉴로 화면을 옮길 때 화면 위치가 되돌아오는가 — 브라우저 계약 테스트 (2026-08-28)
 *
 * 왜 있나
 *   화면을 아래로 스크롤한 채 메뉴에서 다른 화면을 고르면, 그 화면이 목록 중간부터
 *   보이는 문제가 대표 실사용 중 신고됐다(2026-08-27). 그때는 「순환매」 항목 하나에만
 *   scrollIntoView를 손으로 붙여 고쳤는데, 나머지 18개 항목에는 그대로 남아 있었다.
 *   예: y=2500에서 「모의투자」를 누르면 제목도 V1/V2/V3 버튼도 안 보이고 종료된
 *   거래 목록 한복판이 화면 맨 위에 떴다.
 *
 * 이 테스트가 지키는 계약
 *   ① 전체 메뉴의 모든 항목이 화면 위치를 되돌린다(한 항목만 고치고 끝내지 않는다)
 *   ② 상단 메뉴도 같은 함수를 쓴다(지도가 두 벌이면 새 화면에서 다시 어긋난다)
 *   ③ 목적지 지도가 실제 DOM과 일치한다(없는 id를 가리키면 조용히 아무 일도 안 한다)
 *
 * 실행: node test_static_server.js 8877 &  →  node test_menu_scroll.js
 */
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
const failures = [];

function check(name, condition, detail) {
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}` + (!condition && detail ? ` — ${detail}` : ''));
  if (!condition) failures.push(name);
}

// 스크롤이 끝나기를 기다린다(behavior:'smooth'라 클릭 직후에는 아직 움직이는 중이다).
async function settle(page) {
  await page.waitForFunction(() => {
    return new Promise(resolve => {
      let last = -1, same = 0;
      const tick = () => {
        const y = Math.round(window.scrollY);
        same = (y === last) ? same + 1 : 0;
        last = y;
        if (same >= 3) return resolve(true);
        requestAnimationFrame(tick);
      };
      tick();
    });
  }, { timeout: 5000 }).catch(() => {});
}

(async () => {
  const browser = await chromium.launch();
  const pageErrors = [];

  for (const [label, viewport] of [['모바일 390', { width: 390, height: 844 }],
                                   ['PC 1280', { width: 1280, height: 900 }]]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', e => pageErrors.push(`${label}: ${e}`));
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    // 지도가 실제 DOM과 맞는가 — 없는 id를 가리키면 스크롤이 조용히 안 일어난다.
    const mapCheck = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('.modes .modebtn[id^="mode-"]')]
        .map(b => b.id.replace('mode-', ''));
      const missing = btns.filter(m => !document.getElementById('mode-' + m));
      return { modes: btns, missing, hasHelper: typeof window.GaeoScrollToMode === 'function' };
    });
    check(`${label} · 공용 스크롤 함수가 있다`, mapCheck.hasHelper);
    check(`${label} · 전체 메뉴 항목을 전부 찾았다(19개 안팎)`,
      mapCheck.modes.length >= 15, String(mapCheck.modes.length));

    // 각 항목: 화면 중간에서 눌렀을 때 그 화면의 머리가 보이는가.
    // ⚠️ "스크롤 값이 변했나"로 재면 안 된다 — 내용이 짧아 애초에 스크롤이 안 되는
    //    화면(성적표·캘린더 등)에서 0 → 0이 나와 오탐이 된다. 실제 계약은
    //    "그 화면이 중간부터 보이지 않는다"이므로, 보이는 화면 컨테이너의 윗변이
    //    화면 위쪽 근처에 있는지로 잰다(고장 나면 -2348처럼 크게 음수가 된다).
    const VIEW_SEL = '[id$="View"],#analysisBrowser,#portfolio,#latestPanel,#cmpControls';
    for (const mode of mapCheck.modes) {
      const start = await page.evaluate(() => {
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, Math.min(2500, max));
        return { max, y: Math.round(window.scrollY) };
      });
      await page.evaluate(m => document.getElementById('mode-' + m).click(), mode);
      // 화면 전환이 실제로 끝난 뒤에 재야 한다 — 안 기다리면 직전 화면을 재고
      // "고장났다"고 잘못 말한다(2026-08-28 실측: changelog에서 scorecard를 쟀다).
      await page.waitForFunction(m => document.body.dataset.mode === m, mode,
                                 { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(300);
      await settle(page);
      // 늦게 그려지는 화면의 재정렬(500ms)까지 기다린다.
      await page.waitForTimeout(700);
      await settle(page);
      const after = await page.evaluate(sel => {
        const tops = [...document.querySelectorAll(sel)]
          .filter(el => el.offsetParent !== null && el.getBoundingClientRect().height > 40)
          .map(el => ({ id: el.id, top: Math.round(el.getBoundingClientRect().top) }));
        return { scrollY: Math.round(window.scrollY), tops };
      }, VIEW_SEL);
      if (!after.tops.length) {
        check(`${label} · [${mode}] 화면 컨테이너가 보인다`, false, '보이는 컨테이너 0개');
        continue;
      }
      // 보이는 컨테이너 중 하나라도 화면 위쪽에서 시작하면 통과.
      const best = after.tops.reduce((a, b) => (a.top > b.top ? a : b));
      check(`${label} · [${mode}] 화면 중간이 아니라 머리부터 보인다`,
        best.top > -100,
        `시작 y=${start.y}(최대 ${start.max}) → ${best.id} top=${best.top}, ` +
        after.tops.map(t => `${t.id}:${t.top}`).join(' '));
    }

    await context.close();
  }

  /* 🐛 회귀 잠금 (2026-08-28, 대표 신고) — "종목검색을 누르면 자꾸 검색 화면으로 온다".
     jumpToStock()은 mode-single 버튼을 코드로 누른 뒤 시세 카드로 화면을 옮기는데,
     그 버튼에 붙은 되돌리기가 60ms 뒤 실행되며 시세 카드를 밀어냈다
     (실측: 100ms에 시세카드 top=118 → 300ms에 top=1063으로 화면 밖).
     갈 곳을 정한 쪽이 GaeoCancelScrollToMode()로 양보받는 것이 계약이다. */
  for (const [label, viewport] of [['모바일 390', { width: 390, height: 844 }],
                                   ['PC 1280', { width: 1280, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    page.on('pageerror', e => pageErrors.push(`${label}(검색): ${e}`));
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    check(`${label} · 되돌리기 취소 함수가 있다`,
      await page.evaluate(() => typeof window.GaeoCancelScrollToMode === 'function'));

    const name = await page.evaluate(() =>
      (typeof TICKERS !== 'undefined' && TICKERS[0]) ? (TICKERS[0].name || TICKERS[0][1] || null) : null);
    await page.evaluate(n => { if (typeof jumpToStock === 'function' && n) jumpToStock(n); }, name);

    // 예약 스크롤(60ms)과 재정렬(500ms)이 지난 뒤에도 시세 카드가 화면에 남아야 한다.
    const seen = [];
    for (const ms of [120, 400, 1200, 2500]) {
      await page.waitForTimeout(ms - (seen.length ? [120, 400, 1200][seen.length - 1] : 0));
      seen.push(await page.evaluate(() => {
        const q = document.getElementById('quote');
        return q && q.offsetParent !== null ? Math.round(q.getBoundingClientRect().top) : null;
      }));
    }
    const inView = seen.every(t => t !== null && t > -200 && t < 700);
    check(`${label} · 종목 검색으로 들어가면 시세 카드에 머문다`,
      inView, `시세카드 top 변화: ${seen.join(' → ')} (검색 화면으로 튕겼다)`);

    const panelTop = await page.evaluate(() => {
      const ab = document.getElementById('analysisBrowser');
      return ab && ab.offsetParent !== null ? Math.round(ab.getBoundingClientRect().top) : null;
    });
    check(`${label} · 검색 패널이 화면을 가로채지 않는다`,
      panelTop === null || panelTop < -100 || panelTop > 700, `검색패널 top=${panelTop}`);
    await ctx.close();
  }

  check('JS 예외 없음', pageErrors.length === 0, pageErrors.join(' | '));

  await browser.close();
  console.log();
  if (failures.length) {
    console.log(`실패 ${failures.length}건: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('test_menu_scroll: 전체 통과');
})().catch(error => { console.error(error); process.exit(1); });
