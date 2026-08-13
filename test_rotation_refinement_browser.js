const { chromium } = require('C:/Users/개오/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') route.continue();
    else route.abort();
  });

  for (const width of [1920, 1440, 1280, 1024, 768, 390, 360]) {
    console.log(`checking ${width}px`);
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1080 });
    await page.goto('http://127.0.0.1:8878/index.html?m=rotation', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.setMode && window.setMode('rotation'));
    const shell = page.locator('.rotation-view.on .rot-shell');
    await shell.waitFor({ state: 'visible', timeout: 30000 });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    requireState(overflow <= 1, `${width}px page overflowed horizontally by ${overflow}px`);
    requireState(await page.getByText('업종의 순환 흐름을 한눈에', { exact: true }).count() === 1, `${width}px hero copy missing`);
    requireState((await page.locator('.rot-card-today').innerText()).includes('오늘의 변화'), `${width}px TODAY summary missing`);

    if (width > 920) {
      const mapBox = await page.locator('.rot-map').boundingBox();
      const svgBox = await page.locator('.rot-map svg').boundingBox();
      const panelBox = await page.locator('.rot-map-panel').boundingBox();
      const sideBox = await page.locator('.rot-side').boundingBox();
      requireState(mapBox && mapBox.height >= 615, `${width}px map did not use expanded height: ${JSON.stringify(mapBox)}`);
      requireState(svgBox && Math.abs(svgBox.height - mapBox.height) <= 2, `${width}px SVG did not fill map height`);
      requireState(panelBox && sideBox && Math.abs(panelBox.height - sideBox.height) <= 2, `${width}px map and right stack heights diverged`);
      const nodeBoxes = await page.locator('.rot-node circle').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { width: box.width, height: box.height };
      }));
      requireState(nodeBoxes.every(box => Math.abs(box.width - box.height) <= 0.5), `${width}px circular nodes were distorted`);
    }

    if (width <= 390) {
      const mapPanel = await page.locator('.rot-map-panel').boundingBox();
      const rankPanel = await page.locator('.rot-rank-panel').boundingBox();
      const detailPanel = await page.locator('.rot-detail').boundingBox();
      requireState(mapPanel && rankPanel && detailPanel && mapPanel.y < rankPanel.y && rankPanel.y < detailPanel.y, `${width}px mobile section order is wrong`);
      requireState(await page.locator('.rot-map svg').getAttribute('viewBox') === '0 0 620 620', `${width}px mobile map geometry changed`);
    }
    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: `C:/Users/개오/.codex/visualizations/2026/08/11/019ff111-7a1a-7d72-aa74-0337da13b467/rotation-refinement-${width}.png`,
        fullPage: true
      });
    }
  }

  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto('http://127.0.0.1:8878/index.html?m=rotation', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.setMode && window.setMode('rotation'));
  await page.locator('.rotation-view.on .rot-shell').waitFor({ state: 'visible' });
  requireState((await page.locator('.rot-card').nth(1).innerText()).includes('79.1'), 'latest 20-day leader score changed');
  requireState((await page.locator('.rot-card-today').innerText()).includes('-1.2%'), 'latest one-day move is not separated');
  await page.locator('[data-horizon="5"]').first().click();
  requireState((await page.locator('.rot-rank-panel h3').innerText()).startsWith('5거래일'), 'ranking did not follow selected horizon');
  requireState((await page.locator('.rot-detail-sub').innerText()).includes('선택 5거래일'), 'detail mislabeled selected horizon as recommendation');
  requireState((await page.locator('.rot-summary').innerText()).includes('추천 20거래일 기준'), 'recommended horizon changed when selecting a reference tab');
  requireState(pageErrors.length === 0, 'page errors: ' + pageErrors.join(' | '));

  await browser.close();
  console.log('rotation refinement browser tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
