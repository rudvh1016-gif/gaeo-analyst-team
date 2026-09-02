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
      if ((await fetch('http://127.0.0.1:8877/index.html')).ok) return;
    } catch (error) {
      // Wait until the local server is ready.
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
    await page.goto('http://127.0.0.1:8877/index.html');
    await page.waitForLoadState('networkidle');

    /* 🚀 2026-08-28: 수급(flow)은 indicators.js에 들어 있고, 그 파일은 이제 홈에서
       받지 않는다(1,056KB → 홈은 경량본 79KB만). 종목 화면을 열 때 받는다.
       그래서 먼저 "홈에서는 수급을 지어내지 않는다"를 확인하고,
       그다음 앱과 같은 순서(전체 지표 확보 → 카드 렌더)로 계약을 검사한다. */
    const atHome = await page.evaluate(() => ({
      flow: getFlowInterpretation('005930', { score: 24, findings: [] }),
      indLoaded: typeof INDICATORS !== 'undefined',
    }));
    assert.equal(atHome.indLoaded, false, '홈이 전체 지표(1MB)를 다시 받고 있습니다');
    assert.equal(atHome.flow, null, '자료가 없는데 수급 숫자를 만들어내면 안 됩니다');

    // 앱의 실제 경로: 종목 화면이 열릴 때 전체 지표를 확보한다(analyze()가 await한다).
    await page.evaluate(() => window.ensureIndicators());
    await page.waitForFunction(
      () => typeof INDICATORS !== 'undefined' && !!(INDICATORS && INDICATORS.stocks),
      { timeout: 15000 });

    const flow = await page.evaluate(() => getFlowInterpretation('005930', { score: 24, findings: [] }));
    assert.ok(flow && flow.rows, '전체 지표가 온 뒤에는 수급 표가 나와야 합니다');
    assert.deepEqual(flow.rows.map(row => row.label), ['외국인', '기관', '개인']);
    // Flow values are live market aggregates, so verify their contract instead
    // of freezing a prior trading day's three account totals.
    assert.equal(flow.rows.length, 3);
    assert.ok(flow.rows.every(row => Number.isFinite(row.val)));
    assert.equal(new Set(flow.rows.map(row => row.period)).size, 1, '세 투자자 카드의 비교기간이 달라서는 안 됩니다');
    assert.match(flow.rows[0].period, /\d{1,2}\/\d{1,2}~\d{1,2}\/\d{1,2}/);
    console.log('flow browser test passed');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
