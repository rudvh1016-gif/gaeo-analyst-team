const { chromium } = require('./test_playwright');
const fs = require('node:fs');
const budgets = require('./performance-budgets.json');

const base = process.env.GAEO_TEST_ORIGIN || 'http://127.0.0.1:8877';
const check = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`[PASS] ${message}`);
};

(async () => {
  const swSource = fs.readFileSync('sw.js', 'utf8');
  const appShellBranch = swSource.match(/if \(versionedAppShell\) \{([\s\S]*?)\n  \}\n\n  const freshRequest/);
  check(/url\.searchParams\.has\('v'\)/.test(swSource) &&
    /app\.js/.test(swSource) && /app-shell\.css/.test(swSource),
  '버전 쿼리가 있는 app.js/app-shell.css만 재방문 cache-first 대상임');
  check(Boolean(appShellBranch) &&
    /caches\.match\(request\)\.then\(cached =>/.test(appShellBranch[1]) &&
    /if \(cached\) return cached;/.test(appShellBranch[1]) &&
    /return fetch\(request\)/.test(appShellBranch[1]) &&
    /catch\(\(\) => caches\.match\(request, \{ ignoreSearch: true \}\)\)/.test(appShellBranch[1]) &&
    !/no-store|freshRequest/.test(appShellBranch[1]),
  '정확한 버전 hit만 즉시 반환하고, 새 버전은 network 저장 후 실패 시에만 last-good을 쓰');

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: 'allow', viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.evaluate(async () => Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('service worker timeout')), 10000)),
    ]));
    if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
      await page.reload({ waitUntil: 'load' });
    }

    const shell = await page.evaluate(async () => {
      const keys = await caches.keys();
      const key = keys.find(value => value === 'gaeo-shell-v32');
      const cache = key ? await caches.open(key) : null;
      const requests = cache ? await cache.keys() : [];
      return { key, paths: requests.map(request => new URL(request.url).pathname) };
    });
    check(shell.key === 'gaeo-shell-v32', 'service worker v32 shell이 활성화됨');
    check(shell.paths.includes('/app.js') && shell.paths.includes('/app-shell.css'),
      '분리된 앱 JS/CSS가 last-good shell에 저장됨');
    check(shell.paths.length <= budgets.assets.serviceWorkerShellEntries,
      `precache ${shell.paths.length}개 ≤ ${budgets.assets.serviceWorkerShellEntries}개`);

    const versionUpdate = await page.evaluate(async () => {
      const cache = await caches.open('gaeo-shell-v32');
      const staleUrl = new URL('/app.js?v=stale-contract', location.origin).href;
      const nextUrl = new URL('/app.js?v=20260904-p14-contract', location.origin).href;
      await cache.put(staleUrl, new Response('STALE_V20_SENTINEL', {
        headers: { 'Content-Type': 'text/javascript' },
      }));
      const text = await fetch(nextUrl, { cache: 'no-store' }).then(response => response.text());
      const exactStored = Boolean(await cache.match(nextUrl));
      await cache.delete(staleUrl);
      await cache.delete(nextUrl);
      return { staleReturned: text === 'STALE_V20_SENTINEL', currentReturned: text.includes('__GAEO_APP_EXECUTED__'), exactStored };
    });
    check(!versionUpdate.staleReturned && versionUpdate.currentReturned && versionUpdate.exactStored,
      '새 ?v= 앱 요청은 구버전 cache를 무시하고 네트워크 현재본을 정확한 키로 저장함');

    await context.setOffline(true);
    const offlineResponse = await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.locator('#homeDashboard').waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForFunction(() => {
      const value = document.querySelector('#trustDataAsOf')?.textContent?.trim() || '';
      return value.includes('기준') && !value.includes('확인');
    }, null, { timeout: 15000 });
    const offline = await page.evaluate(() => ({
      controlled: Boolean(navigator.serviceWorker.controller),
      title: document.title,
      priceAsOf: document.querySelector('#trustDataAsOf')?.textContent?.trim() || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    }));
    check(Boolean(offlineResponse), 'offline navigation이 service worker 응답을 받음');
    check(offline.controlled && offline.title.includes('Gaeo'), 'offline repeat가 제어된 앱 shell을 렌더함');
    check(offline.priceAsOf.includes('기준') && !offline.priceAsOf.includes('확인'),
      'offline last-good 화면도 실제 데이터 기준 시각을 표시함');
    check(offline.canonical === 'https://gaeoteam.com/', 'offline shell도 공개 canonical을 유지함');
    await context.close();
  } finally {
    await browser.close();
  }
  console.log('performance service worker contract passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
