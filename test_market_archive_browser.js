const assert = require('assert');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const { chromium } = require('./test_playwright');

const server = spawn(process.execPath, ['test_static_server.js'], {
  cwd: __dirname,
  stdio: 'ignore',
  windowsHide: true,
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:8877/index.html');
      if (response.ok) return;
    } catch (error) {
      // The local server may need another moment to bind.
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('static test server did not start');
}

(async () => {
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    const pageErrors = [];
    const failedLocalRequests = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('requestfailed', request => {
      if (request.url().startsWith('http://127.0.0.1:8877/')) {
        failedLocalRequests.push(request.url());
      }
    });
    await page.goto('http://127.0.0.1:8877/index.html');
    await page.waitForLoadState('networkidle');
    // 2026-09-03 소유자 지시: 시장 분석은 홈에서 빠지고 전체 메뉴 '오늘 시장'(?m=market) 화면에서 본다.
    assert.equal(await page.locator('.home-dashboard #marketBox').count(), 0, '홈에 시장분석 상자가 다시 들어갔습니다');
    assert.equal(await page.locator('#marketBox').isVisible(), false, '홈에서 시장분석 상자가 보이면 안 됩니다');
    await page.goto('http://127.0.0.1:8877/?m=market');
    await page.waitForLoadState('networkidle');
    await page.locator('#marketBox').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#mode-market').getAttribute('aria-current'), 'page', '메뉴에 현재 화면(오늘 시장) 표시가 있어야 합니다');

    assert.equal(await page.locator('#marketBox .mk-an').count(), 0, '현재 시장분석 본문이 메인에 노출됐습니다');
    await page.locator('#mkHistBtn').click();
    assert.equal(await page.locator('#mkHistBody .mk-day').count(), 4, '첫 페이지는 시장분석 4건이어야 합니다');
    const firstPageDate = await page.locator('#mkHistBody .mk-day-head b').first().innerText();
    await page.getByRole('button', { name: '2페이지', exact: true }).click();
    const secondPageDate = await page.locator('#mkHistBody .mk-day-head b').first().innerText();
    assert.notEqual(secondPageDate, firstPageDate, '다음 페이지에서 날짜 목록이 바뀌어야 합니다');
    assert.equal(await page.locator('#mkHistBody .mk-day').count(), 4, '두 번째 페이지도 시장분석 4건이어야 합니다');

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await mobile.goto('http://127.0.0.1:8877/?m=market');
    await mobile.waitForLoadState('networkidle');
    await mobile.locator('#marketBox').waitFor({ state: 'visible' });
    assert.equal(await mobile.locator('#marketBox .mk-an').count(), 0, '모바일에 현재 시장분석 본문이 노출됐습니다');
    await mobile.locator('#mkHistBtn').click();
    assert.equal(await mobile.locator('#mkHistBody .mk-day').count(), 4, '모바일 첫 페이지는 시장분석 4건이어야 합니다');
    await mobile.close();

    assert.deepEqual(pageErrors, []);
    assert.deepEqual(failedLocalRequests, []);
    console.log('market archive browser tests passed');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
