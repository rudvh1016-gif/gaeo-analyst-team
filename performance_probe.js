/**
 * Repeatable GAEO lab performance probe.
 * Usage: node performance_probe.js [origin] [runs]
 * Example: node performance_probe.js https://gaeoteam.com 3
 *
 * This is a lab measurement, not field Core Web Vitals. Known advertising and
 * font-CDN hosts are blocked so the first-party product can be compared without
 * auction variance. Cold and warm visits use separate tabs in one browser
 * context so the warm visit can reuse the HTTP cache.
 */
const { chromium } = require('./test_playwright');

const origin = (process.argv[2] || 'http://127.0.0.1:8877').replace(/\/$/, '');
const runs = Number(process.argv[3] || 3);
const scenarios = [
  ['home', '/', async page => page.locator('#homeDashboard').waitFor({ state: 'visible' })],
  ['stock-search', '/', async page => {
    await page.locator('#homeTicker').fill('삼성전자');
    await page.locator('#homeRun').click();
    await page.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('삼성전자'));
  }],
  ['research-hub', '/snap/index.html', async page => page.locator('main').waitFor()],
  ['research-article', '/snap/news/63.html', async page => page.locator('main').waitFor()],
  ['calculator', '/?m=calc&id=14', async page => page.locator('#calcView.on').waitFor()],
  ['rotation', '/?m=rotation', async page => page.locator('#rotationView.on').waitFor()],
  ['full-market', '/?m=rotation', async page => {
    await page.locator('#rotationView.on').waitFor();
    await page.locator('#fmTab-fullmarket').click();
    await page.locator('#fullMarketView.on .fm-shell').waitFor();
  }],
  ['about', '/about.html', async page => page.locator('main').waitFor()],
];

const median = values => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
};
const round = value => Number.isFinite(value) ? Math.round(value * 100) / 100 : null;

async function prepare(context, page) {
  const session = await context.newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.setBlockedURLs', { urls: [
    'https://cdn.jsdelivr.net/*',
    'https://pagead2.googlesyndication.com/*',
    'https://t1.kakaocdn.net/*',
    'https://*.doubleclick.net/*',
    'https://*.googlesyndication.com/*',
  ] });
}

async function installObservers(context) {
  await context.addInitScript(() => {
    localStorage.setItem('gaeo_analytics_consent_v1', 'denied');
    window.__gaeoPerf = { lcp: 0, cls: 0, longTasks: [] };
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__gaeoPerf.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__gaeoPerf.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__gaeoPerf.longTasks.push(entry.duration);
      }).observe({ type: 'longtask', buffered: true });
    } catch (_) {}
  });
}

async function visit(page, path, settle) {
  const started = Date.now();
  const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (!response?.ok()) throw new Error(`${path} HTTP ${response?.status()}`);
  const interactionStart = performance.now();
  await settle(page);
  const interactionMs = performance.now() - interactionStart;
  await page.waitForTimeout(1200);
  return page.evaluate(({ interactionMs, wallMs }) => {
    const nav = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const total = key => resources.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
    const scripts = resources.filter(item => item.initiatorType === 'script' || /\.js(?:\?|$)/.test(item.name));
    const styles = resources.filter(item => item.initiatorType === 'css' || /\.css(?:\?|$)/.test(item.name));
    const dataPattern = /\/(?:data|auto_analysis|analysis|indicators(?:_home)?|history|price_history|radar(?:_series)?|rotation_snapshot|rotation_picks|paper_public|market_context|calculators)\.js(?:\?|$)/;
    const longTasks = window.__gaeoPerf?.longTasks || [];
    return {
      lcpMs: window.__gaeoPerf?.lcp || 0,
      cls: window.__gaeoPerf?.cls || 0,
      interactionMs,
      tbtProxyMs: longTasks.reduce((sum, duration) => sum + Math.max(0, duration - 50), 0),
      longTasks: longTasks.length,
      domNodes: document.getElementsByTagName('*').length,
      htmlTransferBytes: nav?.transferSize || 0,
      requests: resources.length + 1,
      transferBytes: total('transferSize') + (nav?.transferSize || 0),
      jsTransferBytes: scripts.reduce((sum, item) => sum + (item.transferSize || 0), 0),
      cssTransferBytes: styles.reduce((sum, item) => sum + (item.transferSize || 0), 0),
      loadedData: resources.filter(item => dataPattern.test(item.name)).map(item => item.name.split('/').pop().split('?')[0]),
      wallMs,
    };
  }, { interactionMs, wallMs: Date.now() - started });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const samples = {};
  try {
    for (const [name, path, settle] of scenarios) {
      samples[name] = { cold: [], warm: [] };
      for (let index = 0; index < runs; index += 1) {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
        await installObservers(context);
        const cold = await context.newPage();
        await prepare(context, cold);
        samples[name].cold.push(await visit(cold, path, settle));
        const warm = await context.newPage();
        await prepare(context, warm);
        samples[name].warm.push(await visit(warm, path, settle));
        await context.close();
      }
      console.error(`measured ${name}`);
    }
  } finally {
    await browser.close();
  }

  const numeric = ['lcpMs', 'cls', 'interactionMs', 'tbtProxyMs', 'longTasks', 'domNodes',
    'htmlTransferBytes', 'requests', 'transferBytes', 'jsTransferBytes', 'cssTransferBytes', 'wallMs'];
  const result = { origin, runs, profile: 'Chromium 390x844 / third parties blocked / lab only', scenarios: {} };
  for (const [name, phases] of Object.entries(samples)) {
    result.scenarios[name] = {};
    for (const [phase, rows] of Object.entries(phases)) {
      const summary = {};
      for (const key of numeric) summary[key] = round(median(rows.map(row => row[key])));
      summary.loadedData = [...new Set(rows.flatMap(row => row.loadedData))].sort();
      result.scenarios[name][phase] = summary;
    }
  }
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
