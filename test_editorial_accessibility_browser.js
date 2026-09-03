const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_ORIGIN || 'http://127.0.0.1:23003';
const pages = [
  ['home', '/'],
  ['stock', '/?m=single&code=005930'],
  ['calculator', '/?m=calc&id=14'],
  ['lesson', '/?m=lesson&id=1'],
  ['rotation', '/?m=rotation'],
  ['fullmarket', '/?m=rotation'],
  ['community', '/?m=community'],
  ['about', '/about.html'],
  ['research', '/snap/index.html'],
  ['article', '/snap/news/63.html'],
];

const check = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`[PASS] ${message}`);
};

async function settle(page, name) {
  await page.waitForLoadState('domcontentloaded');
  if (name === 'stock') {
    await page.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('삼성전자'), null, { timeout: 15000 });
  }
  if (name === 'calculator') await page.waitForSelector('#calcView.on', { timeout: 15000 });
  if (name === 'lesson') await page.waitForSelector('#lessonView.on', { timeout: 15000 });
  if (name === 'rotation') await page.waitForSelector('#rotationView.on', { timeout: 15000 });
  if (name === 'fullmarket') {
    await page.waitForSelector('#fmTabHost.on', { timeout: 15000 });
    await page.locator('#fmTab-fullmarket').click();
    await page.waitForSelector('#fullMarketView.on', { timeout: 15000 });
  }
  if (name === 'community') await page.waitForSelector('#communityView.on', { timeout: 15000 });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(250);
}

async function audit(page, name, width) {
  const result = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const mains = [...document.querySelectorAll('main,[role="main"]')].filter(visible);
    const levelOnes = [...document.querySelectorAll('h1,[role="heading"][aria-level="1"]')]
      .filter(element => element.getAttribute('aria-hidden') !== 'true').filter(visible);
    const accessibleName = element => {
      const labelledBy = (element.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean)
        .map(id => document.getElementById(id)?.textContent || '').join(' ');
      const labels = [...(element.labels || [])].map(label => label.textContent || '').join(' ');
      return (element.getAttribute('aria-label') || labelledBy || labels || element.innerText ||
        element.getAttribute('alt') || element.getAttribute('title') || '').trim();
    };
    const unnamed = [...document.querySelectorAll('button,a[href],input,select,textarea')].filter(visible).filter(element => {
      return !accessibleName(element);
    });
    const badImages = [...document.querySelectorAll('img,svg[role="img"]')].filter(visible).filter(element => {
      if (element.getAttribute('aria-hidden') === 'true') return false;
      return !(element.getAttribute('alt') || element.getAttribute('aria-label') || element.getAttribute('aria-labelledby'));
    });
    const tinyProductTargets = [...document.querySelectorAll('button,input,select,textarea,[role="button"],[role="tab"],.cta,.global-link')].filter(visible).filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 43.5 || rect.height < 43.5;
    });
    const tinyStandaloneLinks = [...document.querySelectorAll('a[href]')].filter(visible).filter(element => {
      if (getComputedStyle(element).display === 'inline' || element.closest('p,li')) return false;
      const rect = element.getBoundingClientRect();
      return rect.width < 24 || rect.height < 24;
    });
    const tinyText = [...document.querySelectorAll('#rotationView *,#fullMarketView *')]
      .filter(element => element.namespaceURI !== 'http://www.w3.org/2000/svg')
      .filter(element => element.childElementCount === 0 && (element.textContent || '').trim())
      .filter(visible)
      .filter(element => parseFloat(getComputedStyle(element).fontSize) < 11.99);
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      mains: mains.length,
      levelOnes: levelOnes.length,
      levelOneMarkup: levelOnes.map(element => element.outerHTML.slice(0, 180)),
      unnamed: unnamed.slice(0, 5).map(element => element.outerHTML.slice(0, 140)),
      badImages: badImages.slice(0, 5).map(element => element.outerHTML.slice(0, 140)),
      tinyProductTargets: tinyProductTargets.slice(0, 5).map(element => {
        const rect = element.getBoundingClientRect();
        return `${Math.round(rect.width)}x${Math.round(rect.height)} ${element.outerHTML.slice(0, 120)}`;
      }),
      tinyStandaloneLinks: tinyStandaloneLinks.slice(0, 5).map(element => {
        const rect = element.getBoundingClientRect();
        return `${Math.round(rect.width)}x${Math.round(rect.height)} ${element.outerHTML.slice(0, 120)}`;
      }),
      tinyText: tinyText.slice(0, 8).map(element => `${getComputedStyle(element).fontSize} ${element.outerHTML.slice(0, 140)}`),
    };
  });
  check(!result.overflow, `${name}@${width}는 가로 스크롤 없이 reflow됨`);
  check(result.mains === 1, `${name}@${width}에 보이는 main landmark가 하나임`);
  check(result.levelOnes === 1, `${name}@${width}에 현재 문맥의 level-1 heading이 하나임: ${result.levelOnes} ${result.levelOneMarkup.join(' | ')}`);
  check(result.unnamed.length === 0, `${name}@${width}의 보이는 control에 이름이 있음: ${result.unnamed.join(' | ')}`);
  check(result.badImages.length === 0, `${name}@${width}의 정보 이미지에 이름이 있음: ${result.badImages.join(' | ')}`);
  check(result.tinyProductTargets.length === 0, `${name}@${width}의 제품 control이 44px target을 충족함: ${result.tinyProductTargets.join(' | ')}`);
  check(result.tinyStandaloneLinks.length === 0, `${name}@${width}에 24px 미만 독립 link target이 없음: ${result.tinyStandaloneLinks.join(' | ')}`);
  if (name === 'rotation' || name === 'fullmarket') {
    check(result.tinyText.length === 0, `${name}@${width}에 12px 미만 가독 텍스트가 없음: ${result.tinyText.join(' | ')}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [320, 390, 1280]) {
      for (const [name, route] of pages) {
        const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 900 }, serviceWorkers: 'block' });
        await page.route(/^https?:\/\/(?!127\.0\.0\.1).*/, request => request.abort());
        await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
        await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
        await settle(page, name);
        await audit(page, name, width);
        await page.addStyleTag({ content: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
        check(!await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
          `${name}@${width}는 사용자 text spacing에서도 가로 overflow가 없음`);
        await page.close();
      }
    }

    const home320 = await browser.newPage({ viewport: { width: 320, height: 844 }, serviceWorkers: 'block' });
    await home320.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await home320.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    const heroBounds = await home320.evaluate(() => {
      const heading = document.querySelector('.hero-title');
      const container = heading.closest('header');
      const h = heading.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      return { left: h.left, right: h.right, containerLeft: c.left, containerRight: c.right, clipped: container.scrollWidth > container.clientWidth };
    });
    check(heroBounds.left >= heroBounds.containerLeft - 1 && heroBounds.right <= heroBounds.containerRight + 1 && !heroBounds.clipped,
      `home@320 hero heading이 컨테이너 안에서 잘리지 않음: ${JSON.stringify(heroBounds)}`);
    check(await home320.locator('#contextTitle').isHidden(), 'single mode의 중복 context heading은 숨김');
    check(await home320.locator('.hero-title').getAttribute('aria-hidden') !== 'true', 'single mode hero가 접근 가능한 H1으로 유지됨');
    check(await home320.locator('#qname').getAttribute('aria-hidden') === 'true', '종목을 고르기 전 빈 종목 heading은 접근성 트리에서 숨김');
    await home320.close();

    const app = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await app.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await app.goto(BASE + '/?m=single&code=005930', { waitUntil: 'domcontentloaded' });
    await app.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('삼성전자'), null, { timeout: 15000 });
    await app.waitForFunction(() => document.activeElement?.id === 'qname');
    check(await app.locator('#qname').getAttribute('role') === 'heading' && await app.locator('#qname').getAttribute('aria-level') === '1',
      '종목명이 현재 종목 분석의 level-1 heading임');
    check(await app.locator('#qname').getAttribute('aria-hidden') !== 'true' && await app.locator('.hero-title').getAttribute('aria-hidden') === 'true',
      '종목 결과에서는 종목 heading만 접근 가능한 level-1 heading임');
    check(await app.locator('#qname').evaluate(element => document.activeElement === element), '종목 결과로 이동하면 종목 heading으로 focus가 이동함');
    await app.locator('#analysisTabOverview').focus();
    await app.keyboard.press('ArrowRight');
    await app.waitForFunction(() => document.activeElement?.id === 'analysisTabAgents');
    check(await app.locator('#analysisTabAgents').evaluate(element => document.activeElement === element), '분석 tablist가 오른쪽 화살표를 지원함');
    check(await app.locator('#analysisTabAgents').getAttribute('tabindex') === '0', '선택된 분석 tab의 tabindex가 0으로 동기화됨');
    await app.waitForFunction(() => document.querySelector('#card-nova')?.classList.contains('on'), null, { timeout: 15000 });
    // 근거 줄 앞의 신호 표시(·/!/★, class fmk, aria-hidden="true")는 접근성 트리 밖의 장식 마커라
    // 콘텐츠 emoji 검사 대상이 아니다. 어떤 종목의 근거 문장에 '급등·신고가' 같은 키워드가 있는 날만
    // ★가 렌더돼 이 검사가 데이터에 따라 흔들렸다(2026-09-03 확인). aria-hidden 요소는 제외한다.
    const findingEmoji = await app.locator('#analysisPanelAgents').evaluate(panel => [...panel.querySelectorAll('*')]
      .filter(element => !element.children.length && element.getClientRects().length && !element.closest('[aria-hidden="true"]'))
      .map(element => (element.textContent || '').replace(/⚠️|▶/gu, ''))
      .filter(text => /[\p{Extended_Pictographic}]/u.test(text)));
    check(findingEmoji.length === 0, `분석 근거에 장식용 emoji가 없음: ${findingEmoji.join(' | ')}`);
    await app.locator('#navProfileToggle').click();
    await app.locator('#trustInfoToggle').click();
    await app.waitForFunction(() => document.activeElement?.id === 'trustClose');
    const trustCloseSize = await app.locator('#trustClose').evaluate(element => { const rect = element.getBoundingClientRect(); return [rect.width, rect.height]; });
    check(trustCloseSize[0] >= 44 && trustCloseSize[1] >= 44, `trust close target이 44×44 이상임: ${trustCloseSize.join('×')}`);
    await app.keyboard.press('Escape');
    await app.waitForFunction(() => document.activeElement?.id === 'navProfileToggle');
    check(await app.locator('#navProfileToggle').evaluate(element => document.activeElement === element), 'modal을 Escape로 닫으면 focus가 trigger로 복귀함');

    await app.locator('#navSearchToggle').click();
    await app.locator('#navTicker').fill('존재하지않는종목');
    await app.locator('#navTicker').press('Enter');
    check(await app.locator('#navTicker').getAttribute('aria-invalid') === 'true', '검색 실패가 입력을 invalid로 표시함');
    check(await app.locator('#navSearchError').isVisible(), '검색 실패 설명이 보이는 live alert로 제공됨');
    check((await app.locator('#navTicker').getAttribute('aria-describedby') || '').split(/\s+/).includes('navSearchError'), '검색 입력이 오류 설명을 참조함');
    await app.locator('#navTicker').fill('삼성');
    check(await app.locator('#navTicker').getAttribute('aria-invalid') !== 'true' && await app.locator('#navSearchError').isHidden(), '검색값 수정 시 이전 오류 상태를 지움');
    await app.waitForFunction(() => document.querySelector('#navTicker')?.getAttribute('aria-expanded') === 'true');
    check(await app.locator('#navAcbox [role="option"]').count() > 0, '검색 combobox가 listbox option을 노출함');
    await app.locator('#navTicker').press('ArrowDown');
    check(Boolean(await app.locator('#navTicker').getAttribute('aria-activedescendant')), '검색 combobox가 활성 option을 전달함');
    await app.keyboard.press('Escape');

    const sheetToggle = app.locator('#hdbBuyToggle');
    await sheetToggle.click();
    check(await app.locator('#hdbBuyPanel').getAttribute('role') === 'dialog', '모바일 BUY 목록이 dialog로 열림');
    check(await app.locator('#hdbBuyPanel').getAttribute('aria-modal') === 'true', '모바일 BUY dialog가 배경을 차단함');
    check(await app.locator('#globalHome').evaluate(element => element.inert), '모바일 BUY dialog 밖의 control이 inert 처리됨');
    check(await app.locator('#globalNav').evaluate(element => element.inert), '모바일 BUY dialog와 분리된 navigation 전체가 inert 처리됨');
    const sheetCloseSize = await app.locator('#hdbPanelClose').evaluate(element => { const rect = element.getBoundingClientRect(); return [rect.width, rect.height]; });
    check(sheetCloseSize[0] >= 44 && sheetCloseSize[1] >= 44, `BUY dialog close target이 44×44 이상임: ${sheetCloseSize.join('×')}`);
    const dynamicInert = await app.evaluate(() => {
      const button = document.createElement('button');
      button.id = 'lateBackgroundControl';
      button.textContent = '늦게 추가된 배경 버튼';
      document.body.appendChild(button);
      return new Promise(resolve => requestAnimationFrame(() => resolve(button.inert)));
    });
    check(dynamicInert, 'dialog가 열린 뒤 추가된 배경 control도 inert 처리됨');
    await app.locator('#lateBackgroundControl').evaluate(element => element.focus());
    check(await app.locator('#hdbPanelClose').evaluate(element => document.activeElement === element), 'dialog 밖 focus 시도를 내부로 회수함');
    await app.keyboard.press('Escape');
    await app.waitForFunction(() => document.activeElement?.id === 'hdbBuyToggle');
    check(await sheetToggle.evaluate(element => document.activeElement === element), '모바일 BUY dialog를 닫으면 focus가 trigger로 복귀함');
    await app.locator('#lateBackgroundControl').evaluate(element => element.remove());

    await app.locator('.consent-settings').focus();
    await app.keyboard.press('Enter');
    check(await app.locator('#gaeoConsentPrompt').isVisible(), '개인정보 설정 dialog를 다시 열 수 있음');
    await app.keyboard.press('Escape');
    await app.waitForFunction(() => document.querySelector('#gaeoConsentPrompt')?.hidden === true);
    check(await app.locator('#gaeoConsentPrompt').isHidden(), '개인정보 설정 dialog가 Escape로 닫힘');
    await app.waitForFunction(() => document.activeElement?.classList.contains('consent-settings'));
    check(await app.locator('.consent-settings').evaluate(element => document.activeElement === element), '개인정보 설정 dialog가 닫힌 뒤 trigger로 focus가 복귀함');

    await app.emulateMedia({ reducedMotion: 'reduce' });
    check(await app.evaluate(() => window.GaeoMotionBehavior() === 'auto'), 'reduced-motion에서는 programmatic smooth scroll을 끔');
    await app.evaluate(() => document.documentElement.classList.add('gdark'));
    const darkRatios = await app.evaluate(() => {
      const rgb = value => {
        const hex = value.trim().replace('#', '');
        if (hex.length === 3) return [...hex].map(x => parseInt(x + x, 16));
        return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
      };
      const lum = value => rgb(value).map(n => n / 255).map(n => n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
        .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
      const style = getComputedStyle(document.documentElement);
      const page = style.getPropertyValue('--editorial-page');
      return {
        body: ratio(style.getPropertyValue('--editorial-body'), page),
        subtle: ratio(style.getPropertyValue('--editorial-subtle'), page),
      };
    });
    check(darkRatios.body >= 4.5 && darkRatios.subtle >= 4.5, 'dark mode 편집 텍스트 대비가 4.5:1 이상임');
    await app.goto(BASE + '/about.html', { waitUntil: 'domcontentloaded' });
    // About은 다른 화면과 같은 편집형 밝은 토큰을 기본으로 쓴다(--editorial-subtle #606873).
    // 예전 값 #8b8b94는 About만 강제 다크로 두던 html.about-page 오버라이드의 흔적이었다.
    await app.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() === '#606873');
    const aboutMutedRatio = await app.evaluate(() => {
      const parse = value => {
        const hex = value.trim().replace('#', '');
        return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map(n => n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
          .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
      };
      const style = getComputedStyle(document.documentElement);
      const foreground = parse(style.getPropertyValue('--text-muted'));
      const background = parse(style.getPropertyValue('--background'));
      return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
    });
    check(aboutMutedRatio >= 4.5, `About 보조 텍스트 대비가 4.5:1 이상임: ${aboutMutedRatio.toFixed(3)}`);
    await app.close();

    const radar = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await radar.route(/^https?:\/\/(?!127\.0\.0\.1).*/, request => request.abort());
    await radar.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await radar.goto(BASE + '/?m=single&code=000270', { waitUntil: 'domcontentloaded' });
    await radar.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('기아'), null, { timeout: 15000 });
    await radar.locator('#analysisTabRadar').click();
    await radar.locator('#analysisPanelRadar .rd-head').waitFor({ state: 'visible', timeout: 15000 });
    const radarEmoji = await radar.locator('#analysisPanelRadar').evaluate(panel => [...panel.querySelectorAll('*')]
      .filter(element => !element.children.length && element.getClientRects().length)
      .map(element => (element.textContent || '').replace(/⚠️|▶/gu, ''))
      .filter(text => /[\p{Extended_Pictographic}]/u.test(text)));
    check(radarEmoji.length === 0, `비어 있지 않은 레이더 결과에 장식용 emoji가 없음: ${radarEmoji.join(' | ')}`);
    await radar.close();

    const navigation = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await navigation.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await navigation.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await navigation.locator('#navMenuToggle').click();
    await navigation.locator('#mode-news').click();
    await navigation.waitForFunction(() => document.activeElement?.id === 'contextTitle');
    check(await navigation.locator('#contextTitle').evaluate(element => document.activeElement === element), '전체 메뉴로 화면 전환 후 새 문맥 heading으로 focus가 이동함');
    const category = navigation.locator('#newsView [data-cat]').first();
    await category.focus();
    await navigation.keyboard.press('Enter');
    await navigation.waitForSelector('#newsView .cat-back');
    await navigation.waitForFunction(() => document.activeElement === document.querySelector('#newsView .nw-hero h2'));
    check(await navigation.locator('#newsView .nw-hero h2').evaluate(element => document.activeElement === element), '뉴스 카테고리 진입 재렌더 후 heading으로 focus가 이동함');
    await navigation.locator('#newsView .cat-back').focus();
    await navigation.keyboard.press('Enter');
    await navigation.waitForFunction(() => document.activeElement === document.querySelector('#newsView .nw-hero h2'));
    check(await navigation.locator('#newsView .nw-hero h2').evaluate(element => document.activeElement === element), '뉴스 목록 재렌더 후 heading으로 focus가 이동함');
    await navigation.locator('#newsView [data-cat="__all__"]').focus();
    await navigation.keyboard.press('Enter');
    await navigation.waitForFunction(() => document.activeElement === document.querySelector('#newsView .nw-hero h2'));
    await navigation.locator('#newsView').getByRole('button', { name: '2', exact: true }).focus();
    await navigation.keyboard.press('Enter');
    await navigation.waitForFunction(() => document.activeElement === document.querySelector('#newsView .nw-hero h2'));
    check(await navigation.locator('#newsView .nw-hero h2').evaluate(element => document.activeElement === element), '뉴스 page 재렌더 후 heading으로 focus가 이동함');
    await navigation.close();

    for (const [mode, viewId] of [['study', 'studyView'], ['lesson', 'lessonView'], ['estate', 'estateView'], ['calc', 'calcView']]) {
      const content = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
      await content.route(/^https?:\/\/(?!127\.0\.0\.1).*/, request => request.abort());
      await content.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
      await content.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
      await content.evaluate(nextMode => document.getElementById(`mode-${nextMode}`).click(), mode);
      await content.waitForSelector(`#${viewId}.on [data-cat]`, { timeout: 15000 });
      await content.waitForFunction(() => document.activeElement?.id === 'contextTitle');
      await content.locator(`#${viewId} [data-cat]`).first().focus();
      await content.keyboard.press('Enter');
      await content.waitForSelector(`#${viewId} .cat-back`);
      await content.waitForFunction(id => document.activeElement === document.querySelector(`#${id} .nw-hero h2`), viewId);
      check(await content.locator(`#${viewId} .nw-hero h2`).evaluate(element => document.activeElement === element),
        `${mode} 카테고리 진입 재렌더 후 heading으로 focus가 이동함`);
      await content.locator(`#${viewId} .cat-back`).focus();
      await content.keyboard.press('Enter');
      await content.waitForFunction(id => document.activeElement === document.querySelector(`#${id} .nw-hero h2`), viewId);
      check(await content.locator(`#${viewId} .nw-hero h2`).evaluate(element => document.activeElement === element),
        `${mode} 카테고리 복귀 재렌더 후 heading으로 focus가 이동함`);
      await content.locator(`#${viewId} [data-cat="__all__"]`).focus();
      await content.keyboard.press('Enter');
      await content.waitForFunction(id => document.activeElement === document.querySelector(`#${id} .nw-hero h2`), viewId);
      await content.locator(`#${viewId}`).getByRole('button', { name: '2', exact: true }).focus();
      await content.keyboard.press('Enter');
      await content.waitForFunction(id => document.activeElement === document.querySelector(`#${id} .nw-hero h2`), viewId);
      check(await content.locator(`#${viewId} .nw-hero h2`).evaluate(element => document.activeElement === element),
        `${mode} page 재렌더 후 heading으로 focus가 이동함`);
      await content.close();
    }

    const rotation = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await rotation.route(/^https?:\/\/(?!127\.0\.0\.1).*/, request => request.abort());
    await rotation.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await rotation.goto(BASE + '/?m=rotation', { waitUntil: 'domcontentloaded' });
    await rotation.waitForSelector('#rotationView.on .rot-horizon[role="tab"]', { timeout: 15000 });
    const flatRotation = await rotation.locator('.rot-card').first().evaluate(element => {
      const style = getComputedStyle(element);
      return { radius: style.borderRadius, background: style.backgroundColor, shadow: style.boxShadow };
    });
    check(parseFloat(flatRotation.radius) === 0 && flatRotation.shadow === 'none', `순환매 요약 surface가 flat editorial 규칙을 사용함: ${JSON.stringify(flatRotation)}`);
    const rank = rotation.locator('.rot-rank').first();
    await rank.focus();
    await rotation.keyboard.press('Enter');
    check(await rotation.locator('.rot-rank').first().evaluate(element => document.activeElement === element), '순환매 rank 선택 후 같은 rank control로 focus가 유지됨');
    const activeHorizon = rotation.locator('.rot-horizon[role="tab"][tabindex="0"]');
    const originalHorizon = await activeHorizon.getAttribute('data-horizon');
    await activeHorizon.focus();
    await rotation.keyboard.press('ArrowRight');
    check(await rotation.locator('.rot-horizon[role="tab"][tabindex="0"]').getAttribute('data-horizon') !== originalHorizon,
      '순환매 기간 tablist가 화살표 이동과 roving tabindex를 지원함');
    await rotation.locator('#fmTab-rotation').focus();
    await rotation.keyboard.press('ArrowRight');
    await rotation.waitForSelector('#fullMarketView.on', { timeout: 15000 });
    check(await rotation.locator('#fmTab-fullmarket').evaluate(element => document.activeElement === element),
      '전체시장 tablist가 화살표 이동 뒤 focus를 유지함');
    check(await rotation.locator('.fm-mode-title').isHidden(), '전체시장 내부 중복 제목은 숨김');
    const flatMarket = await rotation.locator('.fm-panel').first().evaluate(element => {
      const style = getComputedStyle(element);
      return { radius: style.borderRadius, background: style.backgroundColor, shadow: style.boxShadow };
    });
    check(parseFloat(flatMarket.radius) === 0 && flatMarket.shadow === 'none', `전체시장 panel이 flat editorial 규칙을 사용함: ${JSON.stringify(flatMarket)}`);
    await rotation.close();

    const insight = await browser.newPage({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    await insight.addInitScript(() => {
      localStorage.setItem('gaeo_analytics_consent_v1', 'denied');
      localStorage.setItem('gaeo-recent-stocks', JSON.stringify([{ code: '005930', name: '삼성전자', visitedAt: Date.now() }]));
    });
    await insight.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await insight.waitForSelector('.gaeo-insight-shell');
    await insight.locator('[data-gir-tab]').first().click();
    const insightAudit = await insight.evaluate(() => {
      const rgba = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = value => rgba(value).map(n => n / 255).map(n => n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
        .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
      const background = getComputedStyle(document.querySelector('.gir-rail')).backgroundColor;
      const close = document.querySelector('[data-gir-close]').getBoundingClientRect();
      const secondaryColor = getComputedStyle(document.querySelector('.gir-caption,.gir-panel footer button')).color;
      const mutedColor = getComputedStyle(document.querySelector('.gir-panel time')).color;
      return {
        secondary: ratio(secondaryColor, background),
        muted: ratio(mutedColor, background),
        close: { width: close.width, height: close.height },
      };
    });
    check(insightAudit.secondary >= 4.5 && insightAudit.muted >= 4.5, `desktop insight rail 텍스트 대비가 4.5:1 이상임: ${JSON.stringify(insightAudit)}`);
    check(insightAudit.close.width >= 44 && insightAudit.close.height >= 44, `insight close target이 44×44 이상임: ${JSON.stringify(insightAudit.close)}`);
    await insight.locator('[data-gir-tab="recent"]').click();
    await insight.waitForSelector('.gir-delete');
    const recentDeleteSize = await insight.locator('.gir-delete').first().evaluate(element => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    check(recentDeleteSize.width >= 44 && recentDeleteSize.height >= 44,
      `최근 본 개별 삭제 target이 44×44 이상임: ${JSON.stringify(recentDeleteSize)}`);
    await insight.close();

    const darkContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block', colorScheme: 'dark' });
    const deep = await darkContext.newPage();
    await deep.goto(BASE + '/research/deep-analysis/005930/2026-08-12-1215/index.html', { waitUntil: 'domcontentloaded' });
    const deepRatio = await deep.locator('.da-deck').evaluate(element => {
      const rgba = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = value => rgba(value).map(n => n / 255).map(n => n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
        .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
      const fg = lum(getComputedStyle(element).color);
      const bg = lum(getComputedStyle(document.body).backgroundColor);
      return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
    });
    check(deepRatio >= 4.5, `deep-analysis dark mode 보조 텍스트 대비가 4.5:1 이상임: ${deepRatio.toFixed(3)}`);
    await darkContext.close();

    const calculator = await browser.newPage({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await calculator.route(/^https?:\/\/(?!127\.0\.0\.1).*/, request => request.abort());
    await calculator.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    await calculator.goto(BASE + '/?m=calc&id=14', { waitUntil: 'domcontentloaded' });
    await calculator.waitForSelector('#calcView.on .calc-wrap', { timeout: 15000 });
    check(await calculator.locator('.nw-item.open .nw-head').getAttribute('aria-expanded') === 'true', '딥링크로 펼친 계산기의 aria-expanded가 실제 상태와 일치함');
    check(await calculator.locator('.calc-wrap input').first().evaluate(element => element.labels?.length > 0), '계산기 입력이 실제 label과 연결됨');
    await calculator.locator('#c14-btn').click();
    const resultRole = await calculator.locator('#c14-result').getAttribute('role');
    check(resultRole === 'alert' || resultRole === 'status', '계산 결과와 오류가 live status로 전달됨');
    await calculator.locator('#c14-qty').fill('0');
    await calculator.locator('#c14-btn').click();
    const invalidIds = await calculator.locator('.calc-wrap [aria-invalid="true"]').evaluateAll(elements => elements.map(element => element.id));
    check(invalidIds.length === 1 && invalidIds[0] === 'c14-qty', `계산 오류가 실제 잘못된 필드에만 연결됨: ${invalidIds.join(',')}`);
    check((await calculator.locator('#c14-qty').getAttribute('aria-describedby') || '').split(/\s+/).includes('c14-result'), '잘못된 계산 입력이 오류 설명을 참조함');
    await calculator.locator('#c14-qty').fill('100');
    await calculator.locator('#c14-btn').click();
    check(await calculator.locator('.calc-wrap [aria-invalid="true"]').count() === 0, '정상 재계산 시 invalid 상태를 지움');
    check(await calculator.locator('.calc-wrap [aria-describedby~="c14-result"]').count() === 0, '정상 재계산 시 오류 설명 참조를 지움');
    await calculator.close();
  } finally {
    await browser.close();
  }
  console.log('test_editorial_accessibility_browser: 전체 통과');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
