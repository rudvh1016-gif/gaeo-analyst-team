const { chromium } = require('./test_playwright');

(async () => {
  const baseUrl = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseUrl).origin });
  const page = await context.newPage();
  const writes = [];
  const errors = [];
  page.on('request', request => {
    if (request.method() !== 'GET') writes.push(`${request.method()} ${request.url()}`);
  });
  page.on('pageerror', error => errors.push(String(error)));
  await page.addInitScript(() => {
    localStorage.removeItem('gaeo_analytics_consent_v1');
    localStorage.removeItem('gaeo_admin_overrides');
  });

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('.consent-prompt').waitFor();
  if (!(await page.locator('.consent-prompt').isVisible())) throw new Error('동의 선택창이 첫 방문에 보이지 않는다.');
  await page.getByRole('button', { name: '필수 기능만' }).click();
  if (await page.evaluate(() => localStorage.getItem('gaeo_analytics_consent_v1')) !== 'denied') {
    throw new Error('통계 거부 선택이 저장되지 않았다.');
  }
  if (writes.some(row => row.includes('kvdb.io'))) throw new Error('동의 전 KVdb 쓰기가 발생했다: ' + writes.join(' | '));

  await page.evaluate(() => window.setMode('community'));
  await page.getByText('안전한 서버 인증을 갖출 때까지 읽기 전용입니다').waitFor();
  if (await page.locator('#communityView input, #communityView textarea').count()) {
    throw new Error('읽기 전용 커뮤니티에 방문자 입력 필드가 남아 있다.');
  }

  await page.evaluate(() => { location.hash = '#admin'; location.reload(); });
  await page.locator('.adminbar.on').waitFor();
  await page.locator('.consent-prompt').waitFor();
  await page.getByRole('button', { name: '필수 기능만' }).click();
  await page.getByRole('button', { name: '📋 발행 요청' }).click();
  if (await page.locator('.adminbar input[type="password"]').count()) throw new Error('로컬 초안 도구에 자격 증명 입력이 남아 있다.');
  await page.getByRole('button', { name: '📋 PR 발행 요청 복사' }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  if (!copied.includes('별도 브랜치') || !copied.includes('PR') || !copied.includes('CI')) {
    throw new Error('복사된 발행 요청에 브랜치/PR/CI 경계가 없다.');
  }
  if (/ghp_|github_pat_|Bearer|Authorization/i.test(copied)) throw new Error('발행 요청에 자격 증명 문구가 포함됐다.');
  if (writes.some(row => row.includes('api.github.com/repos/'))) throw new Error('공개 브라우저가 GitHub API에 썼다.');

  await page.locator('.adminbar .ab-x').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '개인정보 설정' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error('모바일 동의 UI가 가로 스크롤을 만들었다: ' + overflow);
  if (errors.length) throw new Error('페이지 오류: ' + errors.join(' | '));

  await browser.close();
  console.log('public release safety browser tests passed');
})().catch(error => { console.error(error); process.exit(1); });
