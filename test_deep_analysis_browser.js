const { chromium } = require('./test_playwright');

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8891';
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));

  // 2026-09-03 소유자 지시: 홈에는 최근 정밀분석이 없고, 전체 메뉴 '최근 정밀분석'(?m=deep) 화면에서 본다.
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  requireState(await page.locator('.home-dashboard #homeDeepAnalysis').count() === 0, 'home must not embed the recent deep-analysis section');
  requireState(!(await page.locator('#homeDeepAnalysis').isVisible()), 'recent deep-analysis section must stay hidden on home');

  await page.goto(`${base}/?m=deep`, { waitUntil: 'networkidle' });
  const homeRows = page.locator('#homeDeepAnalysis .hda-row');
  await homeRows.first().waitFor({ state: 'visible' });
  requireState(await homeRows.count() === 5, 'deep view must show exactly five recent analyses');
  requireState((await homeRows.first().getAttribute('href') || '').startsWith('/research/deep-analysis/'), 'deep view row must use a permanent URL');
  requireState(await page.locator('#homeDeepAnalysis').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'desktop deep view list must not overflow');
  requireState(await page.locator('#mode-deep').getAttribute('aria-current') === 'page', 'menu must mark 최근 정밀분석 as the current screen');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  // 별도 화면에서는 모바일에서도 접지 않고 바로 펼쳐 보여준다(홈 브리핑 안에 있을 때만 접혔다).
  requireState(await page.locator('#hdaToggle').getAttribute('aria-expanded') === 'true', 'deep view must start expanded on mobile');
  await homeRows.first().waitFor({ state: 'visible' });
  requireState(await homeRows.count() === 5, 'mobile deep view must show exactly five recent analyses');
  requireState(await page.locator('#homeDeepAnalysis').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'mobile deep view list must not overflow');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/research/deep-analysis/index.html`, { waitUntil: 'networkidle' });
  requireState(await page.locator('.da-index-row').count() === 20, 'archive first page must show 20 records');
  requireState(await page.locator('a[rel="next"]').getAttribute('href') === 'https://gaeoteam.com/research/deep-analysis/page/2/', 'archive next link must be a real URL');

  await page.goto(`${base}/research/deep-analysis/002990/2026-08-13-2137/index.html`, { waitUntil: 'networkidle' });
  requireState((await page.title()).includes('21:37'), 'snapshot title must include analysis time');
  requireState(await page.locator('.da-section').count() === 4, 'snapshot initial HTML must contain all four analysis axes');
  requireState(await page.locator('link[rel="canonical"]').getAttribute('href') === 'https://gaeoteam.com/research/deep-analysis/002990/2026-08-13-2137/', 'snapshot canonical must be self-referential');
  requireState(await page.locator('script[type="application/ld+json"]').count() === 2, 'snapshot must expose truthful Article and breadcrumb data');
  requireState(errors.length === 0, `page errors: ${errors.join(' | ')}`);

  await browser.close();
  console.log('deep analysis browser tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
