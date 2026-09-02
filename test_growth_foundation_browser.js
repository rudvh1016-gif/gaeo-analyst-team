const { chromium } = require('./test_playwright');
const fs = require('fs');
let browser;
const SHELL_CACHE = /const CACHE\s*=\s*['"]([^'"]+)['"]/.exec(fs.readFileSync('sw.js', 'utf8'))?.[1];

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function head(page) {
  return page.evaluate(() => ({
    canonical: document.querySelector('link[rel="canonical"]')?.href || null,
    robots: document.querySelector('meta[name="robots"]')?.content || null,
    title: document.title,
    ogUrl: document.querySelector('meta[property="og:url"]')?.content || null,
    shareUrl: window.GaeoUrls ? window.GaeoUrls.shareUrl(location.href) : null,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
}

(async () => {
  const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8891';
  browser = await chromium.launch({ headless: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1680, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1).*/, (route) => route.abort());

    await page.goto(`${base}/snap/news/63.html`, { waitUntil: 'networkidle' });
    let value = await head(page);
    check(value.canonical === 'https://gaeoteam.com/snap/news/63.html', 'news snapshot canonical');
    check(value.robots === null, 'news snapshot indexable');
    check(value.ogUrl === value.canonical, 'news snapshot OG');
    check(!value.overflow, `news snapshot overflow at ${viewport.width}`);
    check((await page.locator('.cta').getAttribute('href')) === 'https://gaeoteam.com/?m=news&id=63&entry=snapshot', 'snapshot app CTA');
    check((await page.locator('.cta').getAttribute('rel')) === 'nofollow', 'snapshot CTA nofollow');

    await page.goto(`${base}/snap/lesson/1.html`, { waitUntil: 'networkidle' });
    check(await page.locator('.archive-notice').isVisible(), 'old lesson archive notice visible');

    await page.addInitScript(() => {
      localStorage.setItem('gaeo_analytics_consent_v1', 'granted');
      Object.defineProperty(navigator, 'share', { configurable: true, value: async (data) => { window.__shared = data; } });
    });
    await page.goto(`${base}/?m=news&id=63`, { waitUntil: 'networkidle' });
    await page.locator('#nw-63.open').waitFor({ state: 'visible', timeout: 15000 });
    value = await head(page);
    check(value.canonical === 'https://gaeoteam.com/snap/news/63.html', 'query news canonical');
    check(value.robots === null, 'query news indexable signal');
    check(value.ogUrl === value.canonical, 'query news OG canonical');
    check(value.title.includes('2026년 9월2일 종가'), 'query news document title');
    check(value.shareUrl === value.canonical, 'query news share URL');
    await page.locator('.share-fab').click();
    check(await page.evaluate(() => window.__shared?.url) === value.canonical, 'native share receives canonical URL');

    await page.goto(`${base}/?m=single&code=005930`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    value = await head(page);
    check(value.canonical === null, 'stock query has no unrelated canonical');
    check(value.robots === 'noindex,follow', 'stock query noindex');
    check(value.ogUrl === 'https://gaeoteam.com/?m=single&code=005930', `stock query OG: ${value.ogUrl}`);
    check(value.title.includes('삼성전자') && value.title.includes('종목 분석'), 'stock query title');

    await page.goto(`${base}/snap/stock/000070.html`, { waitUntil: 'networkidle' });
    value = await head(page);
    check(value.robots === 'noindex,follow', 'stock snapshot noindex');
    check(!value.overflow, `stock snapshot overflow at ${viewport.width}`);

    if (viewport.width === 1680) {
      await page.goto(`${base}/`, { waitUntil: 'networkidle' });
      check((await page.locator('body').getAttribute('data-mode')) === 'single', 'home loads in single mode');
      await page.locator('#homeTicker').fill('삼성전자');
      await page.locator('#homeRun').click();
      await page.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('삼성전자'));
      check(await page.locator('#watchToggle').isVisible(), 'watchlist toggle visible after stock search');
      await page.locator('#watchToggle').click();
      check(await page.evaluate(() => JSON.parse(localStorage.getItem('gaeo_watchlist_v1') || '[]').includes('005930')), 'watchlist persists stock code');
      const eventCounts = await page.evaluate(() => Object.fromEntries([
        'landing_view', 'stock_search_submit', 'stock_analysis_open', 'watchlist_add',
      ].map(name => [name, dataLayer.filter(row => row && row[0] === 'event' && row[1] === name).length])));
      check(eventCounts.landing_view === 1, `landing_view duplicate: ${eventCounts.landing_view}`);
      check(eventCounts.stock_search_submit === 1, `stock_search_submit count: ${eventCounts.stock_search_submit}`);
      check(eventCounts.stock_analysis_open === 1, `stock_analysis_open count: ${eventCounts.stock_analysis_open}`);
      check(eventCounts.watchlist_add === 1, `watchlist_add count: ${eventCounts.watchlist_add}`);
      const stockText = await page.locator('body').innerText();
      check(!/\bundefined\b|\bNaN\b/.test(stockText), 'stock view exposes undefined/NaN');

      await page.locator('button[data-nav-mode="lesson"]').first().click();
      await page.waitForFunction(() => document.body.dataset.mode === 'lesson');
      check(await page.locator('#lessonView').isVisible(), 'lesson navigation works');
      await page.locator('#navMenuToggle').click();
      await page.locator('#mode-study').click();
      await page.waitForFunction(() => document.body.dataset.mode === 'study');
      check(await page.locator('#studyView').isVisible(), 'study navigation works');

      await page.goto(`${base}/?m=lesson&id=1`, { waitUntil: 'networkidle' });
      await page.locator('#ls-1.open').waitFor({ state: 'visible' });
      await page.goto(`${base}/?m=study&id=34`, { waitUntil: 'networkidle' });
      await page.locator('#st-34.open').waitFor({ state: 'visible' });
      await page.goto(`${base}/?m=calc&id=14`, { waitUntil: 'networkidle' });
      await page.locator('#calc-14.open').waitFor({ state: 'visible' });
      await page.locator('#calc-14 .nw-head').click();
      await page.locator('#calc-14 .nw-head').click();
      await page.locator('#c14-btn').click();
      check(await page.locator('#c14-result').isVisible(), 'calculator result visible');
      check(!/undefined|NaN/.test(await page.locator('#c14-result').innerText()), 'calculator result is finite');
      const calculatorEvents = await page.evaluate(() => ({
        start: dataLayer.filter(row => row && row[0] === 'event' && row[1] === 'calculator_start').length,
        complete: dataLayer.filter(row => row && row[0] === 'event' && row[1] === 'calculator_complete').length,
        completeParams: dataLayer.find(row => row && row[0] === 'event' && row[1] === 'calculator_complete')?.[2] || {},
      }));
      check(calculatorEvents.start === 1 && calculatorEvents.complete === 1, 'calculator analytics event counts');
      check(!Object.keys(calculatorEvents.completeParams).some(key => /amount|income|salary|principal|query|search/i.test(key)), 'calculator analytics includes personal inputs');

      // 서비스워커는 외부 요청 차단용 page.route와 분리한 새 context에서 확인한다.
      // Playwright routing이 서비스워커 등록을 가로막는 환경 차이를 제품 실패로 오인하지 않는다.
      const swContext = await browser.newContext({ serviceWorkers: 'allow' });
      const swPage = await swContext.newPage();
      await swPage.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
      await swPage.goto(`${base}/`, { waitUntil: 'load' });
      const swState = await swPage.evaluate(async () => {
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise(resolve => setTimeout(() => resolve(null), 10000)),
        ]);
        const registrations = await navigator.serviceWorker.getRegistrations();
        return {
          active: Boolean(registration && registration.active),
          caches: await caches.keys(),
          isSecureContext,
          registrations: registrations.map(item => ({
            scope: item.scope,
            installing: item.installing?.state || null,
            waiting: item.waiting?.state || null,
            active: item.active?.state || null,
          })),
        };
      });
      await swContext.close();
      check(swState.active && swState.caches.includes(SHELL_CACHE),
        `service worker current shell cache expected=${SHELL_CACHE} state=${JSON.stringify(swState)}`);
    }
    await page.close();
  }

  const consentPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await consentPage.route(/^https?:\/\/(?!127\.0\.0\.1).*/, route => route.abort());
  await consentPage.addInitScript(() => {
    window.GAEO_ANALYTICS_CONSENT_REQUIRED = true;
    localStorage.removeItem('gaeo_analytics_consent_v1');
  });
  await consentPage.goto(`${base}/`, { waitUntil: 'networkidle' });
  check(await consentPage.evaluate(() => GaeoAnalytics.getConsent()) === 'denied', 'browser consent defaults denied when required');
  check(await consentPage.evaluate(() => dataLayer.filter(row => row && row[0] === 'event').length) === 0, 'events blocked before consent');
  const consentResult = await consentPage.evaluate(() => {
    gaeoSetAnalyticsConsent('granted');
    gaeoTrack('landing_view', { page_type: 'home' }, { dedupeKey: 'browser-consent' });
    gaeoTrack('landing_view', { page_type: 'home' }, { dedupeKey: 'browser-consent' });
    return dataLayer.filter(row => row && row[0] === 'event' && row[1] === 'landing_view').length;
  });
  check(consentResult === 1, 'consent-granted dedupe behavior');
  await consentPage.close();
  await browser.close();
  browser = null;
  console.log('test_growth_foundation_browser: PASS');
})().catch(async (error) => {
  if (browser) await browser.close().catch(() => {});
  console.error(error);
  process.exitCode = 1;
});
