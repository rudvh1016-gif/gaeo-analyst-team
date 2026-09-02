const { chromium } = require('./test_playwright');

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
  await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.goto('http://127.0.0.1:8877/index.html');
  await page.waitForLoadState('networkidle');

  const card = page.locator('.home-daily-brief');
  await card.waitFor({ state: 'visible' });
  let contextBox = await page.locator('.home-daily-brief .hdb-context').boundingBox();
  let decisionBox = await page.locator('.home-daily-brief .hdb-decisions').boundingBox();
  requireState(contextBox && decisionBox, 'desktop brief columns must render');
  requireState(decisionBox.x > contextBox.x, 'decisions must remain to the right on desktop');
  requireState(await page.locator('.home-daily-brief .tly').count() === 0, 'legacy signal pills must not remain');
  requireState(await page.locator('.home-daily-brief .brief-line').count() === 3, 'three editorial context rows must render');
  requireState(await page.locator('.home-daily-brief .hdb-preview .hdb-stock-row').count() <= 3, 'BUY preview must be capped at three');

  let toggle = page.locator('#hdbBuyToggle');
  if (await toggle.count()) {
    const match = (await toggle.innerText()).match(/(\d+)종목/);
    const expectedCount = Number(match && match[1]);
    const previewCount = await page.locator('.home-daily-brief .hdb-preview .hdb-stock-row').count();
    await toggle.click();
    const panel = page.locator('#hdbBuyPanel');
    requireState(await panel.isVisible(), 'desktop BUY list must open inline');
    requireState(await page.locator('#hdbSheetBackdrop').isHidden(), 'desktop list must not use a backdrop');
    // 2026-08-14 지정 UX: PC에서는 미리보기 1~3위가 계속 보인 채 패널이 4위부터 이어진다.
    // 따라서 "전체 N종목"은 미리보기+패널 합계와 같아야 한다(잘림 금지 불변식).
    const panelCount = await page.locator('#hdbBuyPanel .hdb-stock-row').count();
    requireState(previewCount + panelCount === expectedCount,
      `desktop preview(${previewCount}) + panel(${panelCount}) must equal full BUY count(${expectedCount})`);
    // 2026-08-27 회귀 고정: 패널을 열 때만 innerHTML로 채워지는 4위 이후 종목은
    // 클릭 바인딩이 그 안까지 다시 걸리지 않으면 눌러도 아무 반응이 없었다(실사용자 신고).
    if (panelCount > 0) {
      const firstPanelRow = page.locator('#hdbBuyPanel .hdb-stock-row').first();
      const targetName = await firstPanelRow.getAttribute('data-hdb-stock');
      await firstPanelRow.click();
      await page.waitForTimeout(300);
      requireState(await page.locator('#ticker').inputValue() === targetName,
        'clicking a BUY list row beyond the top-3 preview must jump to that stock');
      requireState(await page.locator('#mode-single').evaluate(el => el.classList.contains('on')),
        'clicking a BUY list row must switch into single-stock mode');
    }
    await page.locator('#hdbPanelClose').click();
    requireState(await panel.isHidden(), 'desktop BUY list must close');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await card.waitFor({ state: 'visible' });
  contextBox = await page.locator('.home-daily-brief .hdb-context').boundingBox();
  decisionBox = await page.locator('.home-daily-brief .hdb-decisions').boundingBox();
  requireState(decisionBox.y > contextBox.y, 'mobile brief must stack into one column');
  toggle = page.locator('#hdbBuyToggle');
  if (await toggle.count()) {
    const mobileMatch = (await toggle.innerText()).match(/(\d+)종목/);
    const mobileExpected = Number(mobileMatch && mobileMatch[1]);
    await toggle.click();
    const panel = page.locator('#hdbBuyPanel');
    requireState(await panel.isVisible(), 'mobile BUY bottom sheet must open');
    // 모바일 시트는 미리보기가 가려지므로 1위부터 전체를 그대로 보여준다.
    requireState(await page.locator('#hdbBuyPanel .hdb-stock-row').count() === mobileExpected,
      'mobile BUY sheet must list the full BUY set');
    requireState(await page.locator('#hdbSheetBackdrop').isVisible(), 'mobile bottom sheet must show backdrop');
    requireState(await page.locator('body').evaluate(el => el.classList.contains('hdb-sheet-open')), 'mobile body scroll must lock');
    await page.keyboard.press('Escape');
    requireState(await panel.isHidden(), 'Escape must close the mobile BUY bottom sheet');
  }

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  await page.waitForLoadState('networkidle');
  requireState(await card.evaluate(el => el.scrollWidth <= el.clientWidth + 1), '360px brief must not overflow horizontally');
  requireState(pageErrors.length === 0, 'page errors: ' + pageErrors.join(' | '));
  await browser.close();
  console.log('home daily brief browser tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
