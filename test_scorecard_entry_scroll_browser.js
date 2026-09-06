// 성적표 첫 진입 착지 계약 (2026-09-06 신설, /gaeo-design DESIGN-P0-2)
//
// 왜 있나
//   성적표는 자료(history.js 등)를 지연 로딩한다. 홈에서 메뉴로 성적표를 처음 열면 로딩 중에는
//   빈 화면이 홈 아래(y≈4,700)에 있어 그리로 스크롤됐다가, 로딩이 끝나 홈이 숨겨지면 화면은
//   y≈211로 올라오는데 스크롤은 그대로 남아 페이지 중간(애널리스트 카드·판단 사례)에 착지했다
//   (390·1440 모두 세션 첫 진입 100% 재현). 첫 화면을 아무리 잘 만들어도 첫 방문자는 못 본다.
//
// 계약
//   ① 홈을 스크롤한 상태에서 메뉴 → 성적표를 처음 열면, 자료 로딩이 끝난 뒤 성적표 상단이
//      화면 안(뷰 top ≥ -8px)이고 첫 블록(h3)이 보인다.
//   ② 같은 세션 두 번째 진입도 같다.
//   ③ 딥링크(?m=scorecard)는 그대로 맨 위에서 시작한다.
const { chromium } = require('./test_playwright');

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

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto('http://127.0.0.1:8877/index.html');
  await page.waitForLoadState('networkidle');

  // ① 첫 진입: 홈을 아래로 내려 본 상태에서 메뉴 → 성적표
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);
  await page.locator('#navMenuToggle').click();
  await page.waitForTimeout(400);
  await page.locator('#mode-scorecard').click();
  await scorecardReady(page);
  const first = await landing(page);
  requireState(first.viewTop >= -8, `first entry must land at the scorecard top (viewTop ${first.viewTop}px, scrollY ${first.scrollY})`);
  requireState(first.firstHeadingVisible, 'first entry must show the first scorecard heading');

  // ② 두 번째 진입
  await page.evaluate(() => { document.querySelector('.global-link[data-nav-home]')?.click(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);
  await page.locator('#navMenuToggle').click();
  await page.waitForTimeout(400);
  await page.locator('#mode-scorecard').click();
  await scorecardReady(page);
  const second = await landing(page);
  requireState(second.viewTop >= -8, `second entry must land at the scorecard top (viewTop ${second.viewTop}px)`);

  // ③ 딥링크
  await page.goto('http://127.0.0.1:8877/index.html?m=scorecard');
  await scorecardReady(page);
  const deep = await landing(page);
  requireState(deep.viewTop >= -8, `deep link must start at the top (viewTop ${deep.viewTop}px)`);

  requireState(pageErrors.length === 0, 'page errors: ' + pageErrors.join(' | '));
  await browser.close();
  console.log('scorecard entry scroll browser tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
