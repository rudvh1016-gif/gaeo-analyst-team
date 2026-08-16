const { chromium } = require('./test_playwright');
const fs = require('fs');
const pathMod = require('path');
// 스크린샷은 실행 환경에 상관없이 저장되도록 로컬 폴더에 남긴다.
// (예전에는 Windows 경로가 박혀 있어서 리눅스에서 'C:/' 디렉터리가 생겼다.)
function shotPath(name) {
  const dir = process.env.GAEO_SHOT_DIR || pathMod.join(__dirname, '.test-screenshots');
  fs.mkdirSync(dir, { recursive: true });
  return pathMod.join(dir, name);
}


(async () => {
  const baseUrl = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
  const browser = await chromium.launch({
    headless: true,
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
  // ⭐ 2026-08-16 계약 변경: 예전에는 "패널을 열어도 본문 좌표가 변하지 않을 것"을 요구했는데,
  // 그건 곧 패널이 본문 위를 덮는다는 뜻이었다. 실제 사용자 환경(브라우저 확대 = CSS 뷰포트 축소)에서
  // 레일·패널이 본문 왼쪽을 가려버리는 문제가 보고돼(2026-08-16), 이제는 셸이 차지한 폭만큼
  // 본문이 실제로 자리를 비우는 app-shell 방식으로 바꿨다. 그래서 검증 기준도 "좌표 불변"이 아니라
  // "본문을 절대 덮지 않는다 + 레이아웃이 여전히 멀쩡하다"로 바꾼다.
  if (!wrapBeforeOpen || !wrapAfterOpen) throw new Error('wrap geometry missing');
  if (panelBox.x + panelBox.width > wrapAfterOpen.x + 0.5) {
    throw new Error('insight panel overlaps main content: ' + JSON.stringify({ panelBox, wrapAfterOpen }));
  }
  if (railBox.width > wrapBeforeOpen.x + 0.5) {
    throw new Error('icon rail overlaps main content when closed: ' + JSON.stringify({ railBox, wrapBeforeOpen }));
  }
  if (wrapAfterOpen.width < 800) {
    throw new Error('main content became too narrow with the panel open: ' + JSON.stringify(wrapAfterOpen));
  }
  const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (hOverflow > 1) throw new Error('opening the insight panel caused horizontal overflow: ' + hOverflow);
  if (await page.evaluate(() => localStorage.getItem('gaeo-insight-panel-open')) !== 'true') throw new Error('open state not stored');
  if (await page.evaluate(() => localStorage.getItem('gaeo-insight-panel-tab')) !== 'rotation') throw new Error('tab state not stored');
  await page.locator('#homeDashboard').click({ position: { x: 900, y: 10 }, force: true });
  if (await page.locator('.gir-panel').getAttribute('aria-hidden') !== 'false') throw new Error('body click closed panel');
  await page.screenshot({ path: shotPath('gaeo-insight-rail-1920.png') });

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
    await page.screenshot({ path: shotPath(`gaeo-insight-rail-${width}.png`) });
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
