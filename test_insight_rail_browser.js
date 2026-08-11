const { chromium } = require('C:/Users/개오/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('requestfailed', request => failedRequests.push(request.url() + ': ' + (request.failure()?.errorText || 'failed')));
  await page.goto('http://127.0.0.1:8877/index.html');
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

  await page.getByRole('tab', { name: '순환' }).click();
  try {
    await page.getByText('추천 관찰 기간').waitFor({ timeout: 30000 });
  } catch (error) {
    throw new Error('rotation panel did not render: ' + await page.locator('.gir-content').innerText() + ' | requests: ' + failedRequests.join(' | '), { cause: error });
  }
  await page.waitForTimeout(400);
  const railBox = await page.locator('.gir-rail').boundingBox();
  const panelBox = await page.locator('.gir-panel').boundingBox();
  if (!railBox || railBox.x !== 0 || railBox.width < 60) throw new Error('rail geometry is incorrect: ' + JSON.stringify(railBox));
  if (!panelBox || panelBox.x < 60 || panelBox.width < 280 || panelBox.width > 320) throw new Error('panel geometry is incorrect: ' + JSON.stringify(panelBox));
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
  const firstStock = page.locator('.gir-content [data-gir-stock]').first();
  const firstName = await firstStock.getAttribute('data-gir-name');
  await firstStock.click();
  await page.getByRole('tab', { name: '최근 본' }).click();
  if (await page.locator('.gir-content').getByText(firstName, { exact: true }).count() < 1) throw new Error('recent stock not recorded');
  await page.evaluate(() => showQuote(resolveStock('삼성전자')));
  await page.locator('.gir-content').getByText('삼성전자', { exact: true }).waitFor();
  if (await page.locator('.gir-content').getByText('삼성전자', { exact: true }).count() < 1) throw new Error('standard quote path not recorded');
  const topTab = page.getByRole('tab', { name: '상위 30' });
  await topTab.focus();
  await page.keyboard.press('ArrowDown');
  if (await page.getByRole('tab', { name: '오늘의 변화' }).getAttribute('aria-selected') !== 'true') throw new Error('arrow-key tab navigation failed');
  await page.evaluate(() => document.documentElement.classList.add('gdark'));
  const darkPanel = await page.locator('.gir-panel').evaluate(element => getComputedStyle(element).backgroundColor);
  if (darkPanel === 'rgb(255, 255, 255)') throw new Error('panel ignored dark theme');
  await page.evaluate(() => document.documentElement.classList.remove('gdark'));

  await page.setViewportSize({ width: 1280, height: 900 });
  if (!(await shell.isVisible())) throw new Error('rail hidden at desktop breakpoint');
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
  await mobile.goto('http://127.0.0.1:8877/index.html');
  await mobile.waitForLoadState('networkidle');
  if (mobileRequests.some(url => url.includes('rotation_snapshot.js'))) throw new Error('mobile loaded hidden rotation data');
  await mobile.close();
  await browser.close();
  console.log('insight rail browser tests passed');
})().catch(error => { console.error(error); process.exit(1); });
