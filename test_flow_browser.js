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
    await page.goto('http://127.0.0.1:8877/index.html');
    await page.waitForLoadState('networkidle');

    const flow = await page.evaluate(() => getFlowInterpretation('005930', { score: 24, findings: [] }));
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
