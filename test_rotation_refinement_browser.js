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


function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

// 요약 카드 기대값은 rotation_snapshot.js에서 직접 계산한다.
// 예전처럼 '79.1' 같은 당시 숫자를 박아두면 데이터가 갱신될 때마다 테스트가 낡는다.
// 검증하려는 불변식은 "카드가 스냅샷의 1위 업종 값을 그대로 보여준다"이다.
global.window = global.window || {};
require('./rotation_snapshot.js');
const rotationSnapshot = global.window.ROTATION_SNAPSHOT;
const rotationLeader = (rotationSnapshot.summary && rotationSnapshot.summary.leaders || [])[0] || {};
const leaderScoreText = `${Number(rotationLeader.score || 0).toFixed(1)}점`;
const leaderSector = (rotationSnapshot.sectors || []).find(s => s.name === rotationLeader.name) || {};
const leaderPeriod1 = (leaderSector.periods || {})['1'] || {};
const leaderReturn = Number(leaderPeriod1.return && leaderPeriod1.return.adjusted) || 0;
// rotation-ui.js formatPercent와 같은 형식: 양수만 + 접두, 소수 1자리
const leaderTodayText = `${leaderReturn > 0 ? '+' : ''}${leaderReturn.toFixed(1)}%`;

(async () => {
  const baseUrl = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8878/index.html';
  const rotationUrl = baseUrl.includes('?') ? baseUrl : `${baseUrl}?m=rotation`;
  const browser = await chromium.launch({
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
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
    await page.goto(rotationUrl, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.setMode && window.setMode('rotation'));
    const shell = page.locator('.rotation-view.on .rot-shell');
    await shell.waitFor({ state: 'visible', timeout: 30000 });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    requireState(overflow <= 1, `${width}px page overflowed horizontally by ${overflow}px`);
    requireState(await page.getByText('업종의 순환 흐름을 한눈에', { exact: true }).count() === 1, `${width}px hero copy missing`);
    requireState((await page.locator('.rot-card-today').innerText()).includes('오늘의 변화'), `${width}px TODAY summary missing`);
    const leaderSubject = (await page.locator('.rot-card').nth(1).locator('.rot-card-primary').innerText()).trim();
    const todayCard = page.locator('.rot-card-today');
    const todayText = await todayCard.innerText();
    requireState((await todayCard.locator('.rot-card-subject').innerText()).trim() === leaderSubject, `${width}px TODAY subject differs from the recommended leader`);
    requireState(todayText.indexOf(leaderSubject) < todayText.indexOf('%'), `${width}px TODAY return appears before its sector subject`);
    requireState(todayText.includes('구성 종목 중앙값 등락 · 표본 보정'), `${width}px adjusted return meaning is missing`);
    const leadType = await page.locator('.rot-card-lead .rot-card-primary').evaluate(element => {
      const style = getComputedStyle(element);
      return { height: element.getBoundingClientRect().height, lineHeight: parseFloat(style.lineHeight) };
    });
    requireState(leadType.height <= leadType.lineHeight * 2.25, `${width}px lead title exceeds two lines: ${JSON.stringify(leadType)}`);
    /* ⭐ 2026-09-04 소유자 지시(가독성): "권장 N거래일 기준"과 계산기간이 카드 6개에
       각각 반복돼 있었다. 공통 전제는 위 한 줄로 모으고 카드에는 고유한 것만 남겼다.
       계약의 뜻은 그대로다 — 근거를 지우지 않는다. 다만 같은 근거를 여러 번 쓰지 않는다.
       그래서 개수(10개)가 아니라 "공통 줄 + 고유 근거"가 모두 있는지로 확인한다. */
    const basisText = await page.locator('.rot-summary-basis').innerText();
    requireState(/거래일 기준/.test(basisText) && basisText.includes('계산기간'),
      `${width}px summary basis line lost the horizon or calculation period: ${basisText.slice(0, 80)}`);
    requireState(await page.locator('.rot-summary .rot-meta-block').count() >= 6,
      `${width}px card-specific metadata was removed`);
    requireState(await page.locator('.rot-summary .rot-meta-block dt').evaluateAll(
      nodes => nodes.filter(n => n.textContent.trim() === '계산기간').length) === 0,
      `${width}px calculation period is repeated inside cards again`);
    requireState(await page.locator('.rot-workspace').count() === 1 && await page.locator('.rot-analysis-grid').count() === 1 && await page.locator('.rot-method').count() === 1, `${width}px lower rotation sections changed`);

    if (width > 920) {
      // 지도 높이는 데이터 로드 뒤 뷰 전체가 다시 렌더되며 늦게 확정된다.
      // locator 호출 사이에 DOM이 교체되는 경합이 있어(2026-08-16 콜드 컨테이너 실측),
      // 한 번의 evaluate 안에서 네 상자를 함께 재고 안정화될 때까지 폴링한다.
      // 시간 안에 기대 상태에 도달하지 못하면 실패하므로 검증 의도는 동일하다.
      const layout = await page.waitForFunction(() => {
        const map = document.querySelector('.rot-map');
        const svg = document.querySelector('.rot-map svg');
        const panel = document.querySelector('.rot-map-panel');
        const side = document.querySelector('.rot-side');
        if (!map || !svg || !panel || !side) return null;
        const m = map.getBoundingClientRect();
        const ok = m.height >= 615
          && Math.abs(svg.getBoundingClientRect().height - m.height) <= 2
          && Math.abs(panel.getBoundingClientRect().height - side.getBoundingClientRect().height) <= 2;
        return ok ? { mapHeight: Math.round(m.height) } : null;
      }, { timeout: 25000 }).then(handle => handle.jsonValue()).catch(() => null);
      requireState(layout && layout.mapHeight >= 615,
        `${width}px map/SVG/side-stack layout did not stabilize at expanded height`);
      const nodeBoxes = await page.locator('.rot-node circle').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { width: box.width, height: box.height };
      }));
      requireState(nodeBoxes.every(box => Math.abs(box.width - box.height) <= 0.5), `${width}px circular nodes were distorted`);
    }

    if (width <= 390) {
      // 데스크톱 측정과 같은 이유(재렌더 경합)로 한 evaluate 안에서 폴링 측정한다.
      const order = await page.waitForFunction(() => {
        const mapPanel = document.querySelector('.rot-map-panel');
        const rankPanel = document.querySelector('.rot-rank-panel');
        const detailPanel = document.querySelector('.rot-detail');
        if (!mapPanel || !rankPanel || !detailPanel) return null;
        const m = mapPanel.getBoundingClientRect();
        const r = rankPanel.getBoundingClientRect();
        const d = detailPanel.getBoundingClientRect();
        return (m.height > 0 && m.top < r.top && r.top < d.top) ? true : null;
      }, { timeout: 25000 }).then(() => true).catch(() => false);
      requireState(order, `${width}px mobile section order is wrong`);
      requireState(await page.locator('.rot-map svg').getAttribute('viewBox') === '0 0 620 620', `${width}px mobile map geometry changed`);
    }
    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: shotPath(`rotation-refinement-${width}.png`),
        fullPage: true
      });
    }
  }

  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto(rotationUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.setMode && window.setMode('rotation'));
  await page.locator('.rotation-view.on .rot-shell').waitFor({ state: 'visible' });
  requireState((await page.locator('.rot-card').nth(1).innerText()).includes(leaderScoreText), `leader card must show the snapshot leader score ${leaderScoreText}`);
  requireState((await page.locator('.rot-card-today').innerText()).includes(leaderTodayText), `today card must show the snapshot one-day move ${leaderTodayText}`);
  await page.locator('[data-horizon="5"]').first().click();
  requireState((await page.locator('.rot-rank-panel h3').innerText()).startsWith('5거래일'), 'ranking did not follow selected horizon');
  requireState((await page.locator('.rot-detail-sub').innerText()).includes('선택 5거래일'), 'detail mislabeled selected horizon as recommendation');
  /* 권장 기간 표기는 2026-09-04부터 카드가 아니라 요약 위 공통 줄(.rot-summary-basis)에 있다.
     계약의 뜻은 그대로다 — 참고용 기간 탭을 눌러도 '권장' 기간은 흔들리면 안 된다. */
  requireState((await page.locator('.rot-summary-basis').innerText()).includes('권장 20거래일 기준'), 'recommended horizon changed when selecting a reference tab');
  const resourceUrls = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
  // 2026-08-18 Typography Sweep에서 v13 → v14, 2026-08-20 접이식 심화 섹션에서 v15로 올렸다.
  // ⚠️ 캐시 버전이 박혀 있는 곳이 여기 말고 test_rotation_ui.js에도 있다. 올릴 때 둘 다
  //    고쳐야 한다 — 이 파일은 playwright가 필요해 CI에서 건너뛰므로, 안 고치면 조용히
  //    깨진 채로 남는다(2026-08-20에 실제로 그렇게 됐고 검수에서 잡혔다).
  requireState(resourceUrls.some(url => url.includes('rotation.css?v=20260821-v20')), 'rotation CSS cache version was not refreshed');
  requireState(resourceUrls.some(url => url.includes('rotation-ui.js?v=20260821-v16')), 'rotation UI cache version was not refreshed');
  await page.evaluate(() => document.documentElement.classList.add('gdark'));
  const darkColors = await page.locator('.rot-card-today').evaluate(element => {
    const subject = element.querySelector('.rot-card-subject');
    const meta = element.querySelector('.rot-meta dd');
    return [getComputedStyle(element).backgroundColor, getComputedStyle(subject).color, getComputedStyle(meta).color];
  });
  requireState(darkColors[0] !== 'rgb(255, 255, 255)' && darkColors[1] !== darkColors[0] && darkColors[2] !== darkColors[0], `dark summary text is unreadable: ${darkColors.join(' | ')}`);
  await page.evaluate(() => document.documentElement.classList.remove('gdark'));
  requireState(pageErrors.length === 0, 'page errors: ' + pageErrors.join(' | '));

  await browser.close();
  console.log('rotation refinement browser tests passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
