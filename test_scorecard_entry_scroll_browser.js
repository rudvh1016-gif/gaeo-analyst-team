// 성적표 첫 진입 착지 계약 (2026-09-06 신설, /gaeo-design DESIGN-P0-2)
//
// 왜 있나
//   성적표는 자료(history.js 등)를 지연 로딩한다. 홈에서 메뉴로 성적표를 처음 열면 로딩 중에는
//   빈 화면이 홈 아래(y≈4,700)에 있어 그리로 스크롤됐다가, 로딩이 끝나 홈이 숨겨지면 화면은
//   y≈211로 올라오는데 스크롤은 그대로 남아 페이지 중간(애널리스트 카드·판단 사례)에 착지했다
//   (390px −4,648 / 1440px −2,972, 세션 첫 진입 100% 재현). 첫 화면을 아무리 잘 만들어도 첫 방문자는 못 본다.
//   기존 test_menu_scroll.js는 한 세션에서 메뉴를 순회하느라 성적표에 올 땐 이미 자료가 로드된
//   "두 번째 진입"을 재고 있어서 이 결함을 통과시켰다 — 그래서 파일을 따로 뒀다.
//
// 계약 (390·1440 각각)
//   ① 전체 메뉴 → 성적표 첫 진입: 자료 로딩이 끝난 뒤 성적표 상단이 화면 안(top ≥ -8)이고 첫 블록 제목이 보인다
//   ② 같은 세션 두 번째 진입도 같다
//   ③ 홈 「성적표에서 실제 성적 자세히 보기」 링크 경로도 같다(별도 바인딩이라 갈라질 수 있다)
//   ④ 딥링크(?m=scorecard)는 그대로 맨 위에서 시작한다
//
// 기준선 대조: GAEO_TEST_URL=http://127.0.0.1:8879/index.html node test_scorecard_entry_scroll_browser.js
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

async function scorecardReady(page) {
  await page.waitForFunction(() => {
    const v = document.getElementById('scorecardView');
    return v && v.classList.contains('on') && v.querySelectorAll('.sc-block').length >= 3;
  }, null, { timeout: 60000 });
  await page.waitForTimeout(900);
}

async function landing(page) {
  return page.evaluate(() => {
    const v = document.getElementById('scorecardView');
    const r = v.getBoundingClientRect();
    const firstH3 = v.querySelector('h3');
    const h = firstH3 ? firstH3.getBoundingClientRect() : null;
    return { scrollY: Math.round(window.scrollY), viewTop: Math.round(r.top),
      firstHeadingVisible: !!h && h.top >= 0 && h.top < window.innerHeight };
  });
}

// 전체 메뉴(모바일 햄버거·PC 공통)로 성적표를 연다.
async function openViaMenu(page) {
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);
  const toggle = page.locator('#navMenuToggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.waitForTimeout(400);
    await page.locator('#mode-scorecard').click();
  } else {
    // PC 폭에서는 햄버거가 숨고 상단 링크가 노출된다.
    await page.locator('.global-link[data-nav-mode="scorecard"]').first().click();
  }
  await scorecardReady(page);
}

async function goHome(page) {
  await page.evaluate(() => { document.querySelector('.global-link[data-nav-home]')?.click(); });
  await page.waitForTimeout(600);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  // ⚠️ 단언이 실패해도 브라우저를 닫는다 — 안 닫으면 node가 살아 있어 실패가 "무한 대기"로 보인다.
  try {
    for (const [width, height] of [[390, 844], [1440, 900]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(String(error)));
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');

      // ① 첫 진입(자료를 아직 안 받은 상태)
      await openViaMenu(page);
      const first = await landing(page);
      requireState(first.viewTop >= -8,
        `${width}px first entry must land at the scorecard top (viewTop ${first.viewTop}px, scrollY ${first.scrollY})`);
      requireState(first.firstHeadingVisible, `${width}px first entry must show the first scorecard heading`);

      // ② 두 번째 진입(자료가 이미 로드된 경로)
      await goHome(page);
      await openViaMenu(page);
      const second = await landing(page);
      requireState(second.viewTop >= -8, `${width}px second entry must land at the top (viewTop ${second.viewTop}px)`);

      // ③ 홈의 성적표 링크(renderHomeBriefDecision 안에서 따로 바인딩된 경로)
      await goHome(page);
      await page.evaluate(() => window.scrollTo(0, 1200));
      await page.waitForTimeout(200);
      await page.locator('.home-daily-brief .hdb-score-link').click();
      await scorecardReady(page);
      const viaLink = await landing(page);
      requireState(viaLink.viewTop >= -8, `${width}px home link must land at the top (viewTop ${viaLink.viewTop}px)`);

      // ④ 딥링크
      const url = new URL(BASE);
      url.searchParams.set('m', 'scorecard');
      await page.goto(url.href);
      await scorecardReady(page);
      const deep = await landing(page);
      requireState(deep.viewTop >= -8, `${width}px deep link must start at the top (viewTop ${deep.viewTop}px)`);

      requireState(pageErrors.length === 0, `${width}px page errors: ` + pageErrors.join(' | '));
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log('scorecard entry scroll browser tests passed');
})().catch(error => {
  console.error(error && error.message ? error.message : error);
  process.exitCode = 1;
});
