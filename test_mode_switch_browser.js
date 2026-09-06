// 화면 전환 계약 — 지연 로딩 중 이탈·중간 점프 (2026-09-06 신설)
//
// 왜 있나
//   성적표·기록처럼 큰 자료를 3~5초 받아오는 화면은 `setMode`가 지연 분기를 타고 나중에
//   `.then`에서 자기 화면을 다시 켠다. 두 가지가 문제였다(PR #512 검수가 기존 문제로 기록).
//
//   ① 로딩 중 홈이나 다른 메뉴를 눌러도, 늦게 끝난 쪽이 화면을 빼앗았다
//      (실측: 홈을 눌렀는데 최종 화면이 성적표, 홈은 안 보임).
//   ② 로딩 중 "불러오는 중" 안내가 홈 아래(y≈4,859)에 있어 스크롤이 거기까지 내려갔다가,
//      자료가 도착해 홈이 접히는 순간 위로 되돌아왔다(1.9~3.7초 뒤 복귀 — 아래로 갔다 오는 점프).
//
// 계약
//   ① 로딩 중 홈으로 이탈 → 최종 화면은 홈(body[data-mode]=single, 홈 보임, 성적표 꺼짐)
//   ② 로딩 중 다른 화면으로 이탈 → 그 화면이 최종
//   ③ 성적표를 눌러 다 그려질 때까지 스크롤이 아래로 크게 내려갔다 오지 않는다
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

async function openHome(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  return page;
}

async function tapScorecard(page) {
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);
  await page.locator('#navMenuToggle').click();
  await page.waitForTimeout(400);
  await page.locator('#mode-scorecard').click();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    // ① 로딩 중 홈으로 이탈
    let page = await openHome(browser);
    await tapScorecard(page);
    await page.waitForTimeout(800);                       // 아직 로딩 중
    await page.evaluate(() => { document.querySelector('.global-link[data-nav-home]')?.click(); });
    await page.waitForTimeout(9000);                      // 성적표 로딩이 끝나고도 남을 시간
    const home = await page.evaluate(() => ({
      bodyMode: document.body.dataset.mode,
      homeVisible: !!document.getElementById('homeDashboard')?.offsetParent,
      scorecardOn: document.getElementById('scorecardView').classList.contains('on'),
    }));
    requireState(home.bodyMode === 'single' && home.homeVisible && !home.scorecardOn,
      '로딩 중 홈을 눌렀는데 나중에 끝난 화면이 홈을 빼앗았다: ' + JSON.stringify(home));
    await page.close();

    // ② 로딩 중 다른 화면으로 이탈
    page = await openHome(browser);
    await tapScorecard(page);
    await page.waitForTimeout(800);
    await page.evaluate(() => window.setMode('market'));
    await page.waitForTimeout(9000);
    const market = await page.evaluate(() => ({
      bodyMode: document.body.dataset.mode,
      scorecardOn: document.getElementById('scorecardView').classList.contains('on'),
    }));
    requireState(market.bodyMode === 'market' && !market.scorecardOn,
      '로딩 중 다른 화면을 눌렀는데 성적표가 화면을 빼앗았다: ' + JSON.stringify(market));
    await page.close();

    // ③ 중간 점프 — 클릭 뒤 스크롤이 아래로 크게 내려갔다 오지 않는다
    page = await openHome(browser);
    await tapScorecard(page);
    let peak = 0;
    for (let i = 0; i < 70; i += 1) {
      peak = Math.max(peak, await page.evaluate(() => Math.round(window.scrollY)));
      const done = await page.evaluate(() => {
        const v = document.getElementById('scorecardView');
        return v && v.querySelectorAll('.sc-block').length >= 3;
      });
      if (done && i > 5) break;
      await page.waitForTimeout(100);
    }
    requireState(peak <= 400, `로딩 중 스크롤이 ${peak}px까지 내려갔다 — 아래로 갔다 오는 점프가 남아 있다`);
    await page.close();
  } finally {
    await browser.close();
  }
  console.log('mode switch browser tests passed');
})().catch(error => {
  console.error(error && error.message ? error.message : error);
  process.exitCode = 1;
});
