const { chromium } = require('C:/Users/개오/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const baseUrl = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('requestfailed', request => failedRequests.push(request.url() + ': ' + (request.failure()?.errorText || 'failed')));
  await page.goto(baseUrl);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    localStorage.removeItem('gaeo-insight-panel-open');
    localStorage.removeItem('gaeo-insight-panel-tab');
    localStorage.removeItem('gaeo-recent-stocks');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');

  const shell = page.locator('.gaeo-insight-shell');
  if (!(await shell.isVisible())) throw new Error('rail must be visible on desktop');
  if (await page.locator('.gir-panel').getAttribute('aria-hidden') !== 'true') throw new Error('panel must default closed');

  const wrapBeforeOpen = await page.locator('.wrap').boundingBox();
  const railLabels = await page.locator('.gir-rail button span').evaluateAll(elements => elements.map(element => ({
    whiteSpace: getComputedStyle(element).whiteSpace,
    height: element.getBoundingClientRect().height,
    lineHeight: parseFloat(getComputedStyle(element).lineHeight)
  })));
  if (railLabels.some(label => label.whiteSpace !== 'nowrap' || label.height > label.lineHeight * 1.25)) {
    throw new Error('rail labels must stay on one horizontal line: ' + JSON.stringify(railLabels));
  }

  await page.getByRole('tab', { name: '순환' }).click();
  try {
    await page.getByText('추천 관찰기간').waitFor({ timeout: 30000 });
  } catch (error) {
    throw new Error('rotation panel did not render: ' + await page.locator('.gir-content').innerText() + ' | requests: ' + failedRequests.join(' | '), { cause: error });
  }
  await page.waitForTimeout(400);
  const railBox = await page.locator('.gir-rail').boundingBox();
  const panelBox = await page.locator('.gir-panel').boundingBox();
  const wrapAfterOpen = await page.locator('.wrap').boundingBox();
  if (!railBox || railBox.x !== 0 || railBox.width < 60) throw new Error('rail geometry is incorrect: ' + JSON.stringify(railBox));
  if (!panelBox || panelBox.x < 60 || panelBox.width < 280 || panelBox.width > 320) throw new Error('panel geometry is incorrect: ' + JSON.stringify(panelBox));
  if (!wrapBeforeOpen || !wrapAfterOpen || Math.abs(wrapBeforeOpen.x - wrapAfterOpen.x) > 0.5 || Math.abs(wrapBeforeOpen.width - wrapAfterOpen.width) > 0.5) {
    throw new Error('opening the insight panel changed main layout geometry: ' + JSON.stringify({ wrapBeforeOpen, wrapAfterOpen }));
  }
  if (await page.evaluate(() => localStorage.getItem('gaeo-insight-panel-open')) !== 'true') throw new Error('open state not stored');
  if (await page.evaluate(() => localStorage.getItem('gaeo-insight-panel-tab')) !== 'rotation') throw new Error('tab state not stored');
  await page.locator('#homeDashboard').click({ position: { x: 900, y: 10 }, force: true });
  if (await page.locator('.gir-panel').getAttribute('aria-hidden') !== 'false') throw new Error('body click closed panel');
  await page.screenshot({ path: 'C:/Users/개오/.codex/visualizations/2026/08/11/019ff111-7a1a-7d72-aa74-0337da13b467/gaeo-insight-rail-1920.png' });

  await page.reload();
  await page.waitForLoadState('networkidle');
  if (await page.locator('.gir-panel').getAttribute('aria-hidden') !== 'false') throw new Error('open state not restored');
  if (await page.getByRole('tab', { name: '순환' }).getAttribute('aria-selected') !== 'true') throw new Error('tab not restored');
  await page.keyboard.press('Escape');
  if (await page.locator('.gir-panel').getAttribute('aria-hidden') !== 'true') throw new Error('Escape did not close');

  await page.getByRole('tab', { name: '상위 30' }).click();
  if (await page.locator('.gir-content .gir-price').count() < 1) throw new Error('top 30 rows must show current prices');
  const firstStock = page.locator('.gir-content [data-gir-stock]').first();
  const firstName = await firstStock.getAttribute('data-gir-name');
  await firstStock.click();
  await page.getByRole('tab', { name: '최근 본' }).click();
  if (await page.locator('.gir-content').getByText(firstName, { exact: true }).count() < 1) throw new Error('recent stock not recorded');
  if (await page.locator('.gir-content .gir-price').count() < 1) throw new Error('recent rows must show current prices');
  if (await page.locator('.gir-content .gir-total-score').count() < 1) throw new Error('recent rows must show current aggregate scores');
  await page.evaluate(() => showQuote(resolveStock('삼성전자')));
  await page.locator('.gir-content').getByText('삼성전자', { exact: true }).waitFor();
  if (await page.locator('.gir-content').getByText('삼성전자', { exact: true }).count() < 1) throw new Error('standard quote path not recorded');
  await page.locator('[data-gir-tab="changes"]').click();
  if (await page.locator('.gir-content .gir-price').count() < 1) throw new Error('today changes rows must show current prices');
  await page.locator('[data-gir-tab="live"]').click();
  if (await page.locator('.gir-content .gir-price').count() < 1) throw new Error('realtime rows must show current prices');
  if (/\d+\.0원/.test(await page.locator('.gir-content').innerText())) throw new Error('whole-won realtime values must not include .0원');
  const topTab = page.getByRole('tab', { name: '상위 30' });
  await topTab.focus();
  await page.keyboard.press('ArrowDown');
  if (await page.getByRole('tab', { name: '오늘의 변화' }).getAttribute('aria-selected') !== 'true') throw new Error('arrow-key tab navigation failed');
  await page.evaluate(() => document.documentElement.classList.add('gdark'));
  const darkPanel = await page.locator('.gir-panel').evaluate(element => getComputedStyle(element).backgroundColor);
  if (darkPanel === 'rgb(255, 255, 255)') throw new Error('panel ignored dark theme');
  await page.evaluate(() => document.documentElement.classList.remove('gdark'));

  for (const width of [1440, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    if (!(await shell.isVisible())) throw new Error(`rail hidden at ${width}px desktop viewport`);
    const responsivePanel = await page.locator('.gir-panel').boundingBox();
    if (!responsivePanel || responsivePanel.x < 60 || responsivePanel.width < 280 || responsivePanel.width > 320) {
      throw new Error(`panel geometry is incorrect at ${width}px: ` + JSON.stringify(responsivePanel));
    }
    await page.screenshot({ path: `C:/Users/개오/.codex/visualizations/2026/08/11/019ff111-7a1a-7d72-aa74-0337da13b467/gaeo-insight-rail-${width}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  if (await shell.isVisible()) throw new Error('rail visible on mobile');
  if (pageErrors.length) throw new Error('page errors: ' + pageErrors.join(' | '));
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobileRequests = [];
  mobile.on('request', request => mobileRequests.push(request.url()));
  await mobile.addInitScript(() => {
    localStorage.setItem('gaeo-insight-panel-open', 'true');
    localStorage.setItem('gaeo-insight-panel-tab', 'rotation');
  });
  await mobile.goto(baseUrl);
  await mobile.waitForLoadState('networkidle');
  if (mobileRequests.some(url => url.includes('rotation_snapshot.js'))) throw new Error('mobile loaded hidden rotation data');
  await mobile.close();
  await browser.close();
  console.log('insight rail browser tests passed');
})().catch(error => { console.error(error); process.exit(1); });
