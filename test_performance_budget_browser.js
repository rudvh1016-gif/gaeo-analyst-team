const { chromium } = require('./test_playwright');
const budgets = require('./performance-budgets.json');

const origin = process.env.GAEO_TEST_ORIGIN || 'http://127.0.0.1:8877';
const routes = ['home', 'stock-search', 'research-hub', 'research-article',
  'calculator', 'rotation', 'full-market', 'about'];
const sampleCount = 3;
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const check = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`[PASS] ${message}`);
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const name of routes) {
      const budget = budgets.routes.find(route => route.name === name);
      const samples = [];
      for (let run = 0; run < sampleCount; run += 1) {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
        await context.addInitScript(() => {
          localStorage.setItem('gaeo_analytics_consent_v1', 'denied');
          window.__gaeoBudget = { cls: 0, lcp: 0, longTasks: [] };
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.__gaeoBudget.cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) window.__gaeoBudget.lcp = entry.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) window.__gaeoBudget.longTasks.push(entry.duration);
          }).observe({ type: 'longtask', buffered: true });
        });
        const page = await context.newPage();
        const firstPartyScripts = [];
        page.on('request', request => {
          const url = new URL(request.url());
          if (url.origin === new URL(origin).origin && url.pathname.endsWith('.js')) firstPartyScripts.push(url.pathname);
        });
        await page.route(/^https?:\/\/(?!127\.0\.0\.1).*/, route => route.abort());
        const response = await page.goto(origin + budget.path, { waitUntil: 'domcontentloaded' });
        check(response?.ok(), `${name} run ${run + 1}: 문서가 성공 응답함`);
        const interactionStarted = performance.now();
        if (name === 'stock-search') {
          await page.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('삼성전자'));
        } else if (name === 'calculator') {
          await page.locator('#calcView.on').waitFor();
        } else if (name === 'rotation' || name === 'full-market') {
          await page.locator('#rotationView.on').waitFor();
          if (budget.action === 'open-full-market-tab') {
            await page.locator('#fmTab-fullmarket').click();
            await page.locator('#fullMarketView.on .fm-shell').waitFor();
          }
        } else if (name === 'home') {
          await page.locator('#homeDashboard').waitFor({ state: 'visible' });
        } else {
          await page.locator('main').waitFor({ state: 'visible' });
        }
        const interactionMs = performance.now() - interactionStarted;
        await page.waitForTimeout(1200);
        const state = await page.evaluate(interactionMs => {
          const nav = performance.getEntriesByType('navigation')[0];
          const resources = performance.getEntriesByType('resource');
          const longTasks = window.__gaeoBudget.longTasks || [];
          return {
            cls: window.__gaeoBudget.cls,
            lcpMs: window.__gaeoBudget.lcp,
            interactionMs,
            tbtProxyMs: longTasks.reduce((sum, duration) => sum + Math.max(0, duration - 50), 0),
            domNodes: document.getElementsByTagName('*').length,
            requests: resources.length + 1,
            transferBytes: (nav?.transferSize || 0) + resources.reduce((sum, item) => sum + (item.transferSize || 0), 0),
            adHeight: document.querySelector('.ad-slot-home')?.getBoundingClientRect().height || 0,
            chartPeriod: document.querySelector('.qchart-sub')?.textContent?.trim() || '',
          };
        }, interactionMs);
        if (name === 'home') {
          const heavy = firstPartyScripts.filter(path => /\/(?:auto_analysis|history|price_history|indicators|radar_series)\.js$/.test(path));
          check(heavy.length === 0, `home run ${run + 1}: 전체 분석 파일을 미리 받지 않음 (${heavy.join(', ')})`);
          check(state.adHeight >= 270, `home run ${run + 1}: 300×250 광고 공간 사전 예약 (${state.adHeight}px)`);
        } else if (name === 'stock-search') {
          const eagerHistory = firstPartyScripts.filter(path => /\/(?:history|price_history)\.js$/.test(path));
          check(eagerHistory.length === 0,
            `stock-search run ${run + 1}: 과거 기록을 미리 받지 않음 (${eagerHistory.join(', ')})`);
          const fullChart = page.locator('.qchart-history-load');
          check(await fullChart.isVisible(), `stock-search run ${run + 1}: 전체 기간 진입점이 보임`);
          check(/\d{2}\/\d{2}\s*~\s*\d{2}\/\d{2}/.test(state.chartPeriod),
            `stock-search run ${run + 1}: 경량 차트 기간이 비지 않음 (${state.chartPeriod})`);
          if (run === sampleCount - 1) {
            await fullChart.click();
            await page.waitForFunction(() => typeof PRICE_HISTORY !== 'undefined' && typeof LIVE_HISTORY !== 'undefined', null,
              { timeout: 20000 });
            await fullChart.waitFor({ state: 'detached', timeout: 20000 });
            const requestedHistory = firstPartyScripts.filter(path => /\/(?:history|price_history)\.js$/.test(path));
            check(requestedHistory.length === 2, 'stock-search: 사용자 요청 후 전체 가격·판단 기록을 모두 불러옴');
          }
        }
        samples.push(state);
        await context.close();
      }
      const state = Object.fromEntries(['cls', 'lcpMs', 'interactionMs', 'tbtProxyMs', 'domNodes',
        'requests', 'transferBytes'].map(key => [key, median(samples.map(sample => sample[key]))]));
      check(state.cls <= budget.cls + 0.0001, `${name}: lab CLS ${state.cls.toFixed(3)} ≤ ${budget.cls}`);
      check(state.lcpMs <= budget.lcpMs, `${name}: lab LCP ${Math.round(state.lcpMs)}ms ≤ ${budget.lcpMs}ms`);
      check(state.interactionMs <= budget.interactionMs,
        `${name}: ready ${Math.round(state.interactionMs)}ms ≤ ${budget.interactionMs}ms`);
      check(state.tbtProxyMs <= budget.tbtProxyMs,
        `${name}: long-task proxy ${Math.round(state.tbtProxyMs)}ms ≤ ${budget.tbtProxyMs}ms`);
      check(state.domNodes <= budget.domNodes, `${name}: DOM ${state.domNodes} ≤ ${budget.domNodes}`);
      check(state.requests <= budget.requests, `${name}: requests ${state.requests} ≤ ${budget.requests}`);
      check(state.transferBytes <= budget.localRawTransferBytes,
        `${name}: local raw transfer ${state.transferBytes}B ≤ ${budget.localRawTransferBytes}B`);
    }

    const failedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const failedPage = await failedContext.newPage();
    await failedPage.route('**/app.js*', route => route.abort());
    await failedPage.goto(origin + '/?m=calc&id=14', { waitUntil: 'domcontentloaded' });
    await failedPage.locator('.app-load-fallback').waitFor({ state: 'visible' });
    const failedState = await failedPage.evaluate(() => ({
      pending: document.documentElement.classList.contains('route-pending'),
      visibility: getComputedStyle(document.body).visibility,
    }));
    check(!failedState.pending && failedState.visibility === 'visible',
      'app.js 실패 시 딥링크가 빈 화면에 갇히지 않고 복구 안내를 표시함');
    await failedContext.close();
  } finally {
    await browser.close();
  }
  console.log('performance budget browser contract passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
