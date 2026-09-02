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

  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  const homeRows = page.locator('#homeDeepAnalysis .hda-row');
  await homeRows.first().waitFor({ state: 'visible' });
  requireState(await homeRows.count() === 5, 'home must show exactly five recent analyses');
  requireState((await homeRows.first().getAttribute('href') || '').startsWith('/research/deep-analysis/'), 'home row must use a permanent URL');
  requireState(await page.locator('#homeDeepAnalysis').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'desktop home list must not overflow');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  // 모바일(≤900px)은 2026-08-14 설계대로 접힘 상태로 시작한다. 접힘을 확인한 뒤
  // 헤더를 눌러 펼치고 나서 목록을 검증한다.
  requireState(await page.locator('#hdaToggle').getAttribute('aria-expanded') === 'false', 'mobile deep-analysis section must start collapsed');
  await page.locator('#hdaToggle').click();
  await homeRows.first().waitFor({ state: 'visible' });
  requireState(await page.locator('#homeDeepAnalysis').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'mobile home list must not overflow');

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
