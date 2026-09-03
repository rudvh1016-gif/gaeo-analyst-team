const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
const VIEWPORTS = [
  { width: 1440, height: 1100 },
  { width: 1280, height: 900 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
];

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function channel(value) {
  const match = value.match(/[\d.]+/g);
  return match ? match.slice(0, 3).map(Number) : [0, 0, 0];
}

function luminance(rgb) {
  const linear = rgb.map(value => {
    const normalized = value / 255;
    return normalized <= .03928 ? normalized / 12.92 : ((normalized + .055) / 1.055) ** 2.4;
  });
  return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
}

function contrast(foreground, background) {
  const a = luminance(channel(foreground));
  const b = luminance(channel(background));
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage({ viewport });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1).*/, route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('gaeo_analytics_consent_v1', 'denied');
    });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);

    const result = await page.evaluate(() => {
      const style = selector => {
        const computed = getComputedStyle(document.querySelector(selector));
        return {
          radius: parseFloat(computed.borderTopLeftRadius),
          shadow: computed.boxShadow,
          backgroundImage: computed.backgroundImage,
          fontSize: parseFloat(computed.fontSize),
        };
      };
      const root = getComputedStyle(document.documentElement);
      const input = document.querySelector('#homeTicker').getBoundingClientRect();
      const button = document.querySelector('#homeRun').getBoundingClientRect();
      const intro = getComputedStyle(document.querySelector('.home-dashboard .hero-intro'));
      const actionHeights = [...document.querySelectorAll('.hero-action')]
        .map(element => element.getBoundingClientRect().height);
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        searchTop: input.top,
        searchBottom: input.bottom,
        buttonHeight: button.height,
        hero: style('.home-dashboard header'),
        search: style('.hero-search-card'),
        brief: style('.home-dashboard .start-step'),
        searchHelp: style('.home-search-help'),
        briefDate: style('.home-daily-brief .hdb-date'),
        introFontSize: parseFloat(intro.fontSize),
        introColor: intro.color,
        editorialText: root.getPropertyValue('--editorial-text').trim(),
        actionHeights,
      };
    });

    check(!result.overflow, `${viewport.width}: horizontal overflow`);
    check(result.hero.radius === 0 && result.search.radius === 0 && result.brief.radius === 0,
      `${viewport.width}: decorative surface radius remains`);
    check([result.hero, result.search, result.brief].every(item => item.shadow === 'none'),
      `${viewport.width}: decorative surface shadow remains`);
    check([result.hero, result.search, result.brief].every(item => item.backgroundImage === 'none'),
      `${viewport.width}: gradient remains`);
    check(result.buttonHeight >= 44, `${viewport.width}: search target below 44px`);
    check(result.searchHelp.fontSize >= 12 && result.briefDate.fontSize >= 12,
      `${viewport.width}: essential metadata below 12px`);
    check(result.actionHeights.every(height => height >= 44),
      `${viewport.width}: secondary hero target below 44px (${result.actionHeights.join(', ')})`);
    if (viewport.width <= 620) {
      const expectedText = await page.evaluate(color => {
        const probe = document.createElement('span');
        probe.style.color = color;
        document.body.appendChild(probe);
        const resolved = getComputedStyle(probe).color;
        probe.remove();
        return resolved;
      }, result.editorialText);
      // 2026-09-03 소유자 지시(3차 글자 축소)로 모바일 히어로 설명은 14px. 본문 최소선 12px은 그대로 지킨다.
      check(result.introFontSize >= 14, `${viewport.width}: key hero explanation below 14px`);
      check(result.introColor === expectedText,
        `${viewport.width}: key hero explanation uses secondary color (${result.introColor} != ${expectedText})`);
    }
    if (viewport.width <= 430) {
      check(result.searchTop >= 0 && result.searchBottom <= viewport.height,
        `${viewport.width}: search is not visible in the first viewport (${result.searchTop}-${result.searchBottom})`);
    }

    await page.locator('#homeRun').focus();
    const focus = await page.locator('#homeRun').evaluate(element => {
      const computed = getComputedStyle(element);
      return { style: computed.outlineStyle, width: parseFloat(computed.outlineWidth), color: computed.outlineColor };
    });
    check(focus.style !== 'none' && focus.width >= 2 && !/rgba\([^)]*,\s*0\)/.test(focus.color),
      `${viewport.width}: primary search focus indicator is not visible`);

    if (viewport.width === 390) {
      await page.locator('#homeTicker').fill('삼성전자');
      await page.locator('#homeRun').click();
      await page.waitForFunction(() => document.querySelector('#qname')?.textContent.includes('삼성전자'));
      check(await page.locator('#watchToggle').isVisible(), 'search no longer opens stock analysis');
    }
    await page.close();
  }

  const dark = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await dark.route(/^https?:\/\/(?!127\.0\.0\.1).*/, route => route.abort());
  await dark.addInitScript(() => {
    localStorage.setItem('gaeo_theme', 'dark');
    localStorage.removeItem('gaeo_analytics_consent_v1');
  });
  await dark.goto(BASE, { waitUntil: 'load' });
  const darkState = await dark.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const accept = document.querySelector('[data-consent="granted"]');
    const acceptStyle = getComputedStyle(accept);
    return {
      canvas: root.getPropertyValue('--editorial-canvas').trim().toUpperCase(),
      bodyBackground: body.backgroundColor,
      heading: root.getPropertyValue('--editorial-heading').trim().toUpperCase(),
      acceptColor: acceptStyle.color,
      acceptBackground: acceptStyle.backgroundColor,
    };
  });
  check(darkState.canvas === '#0D0E10' && darkState.heading === '#F4F5F7', 'dark editorial tokens not applied');
  check(darkState.bodyBackground === 'rgb(13, 14, 16)',
    `dark body canvas does not use editorial token: ${darkState.bodyBackground}`);
  check(contrast(darkState.acceptColor, darkState.acceptBackground) >= 4.5,
    `dark consent accept contrast ${contrast(darkState.acceptColor, darkState.acceptBackground).toFixed(2)}:1`);
  check(await dark.locator('[data-consent="denied"]').evaluate(element => document.activeElement === element),
    'first-visit consent choice does not receive focus');
  check(await dark.locator('.consent-settings').getAttribute('aria-expanded') === 'true',
    'first-visit consent expanded state is not synchronized');
  check(await dark.locator('.global-nav').evaluate(element => element.inert),
    'first-visit consent does not make the background inert');
  await dark.locator('.gaeo-insight-shell').waitFor({ state: 'attached' });
  check(await dark.locator('.gaeo-insight-shell').evaluate(element => element.inert),
    'first-visit consent does not inert dynamically inserted background content');
  let backgroundClickBlocked = false;
  try {
    await dark.locator('#gir-tab-news').click({ timeout: 750 });
  } catch (error) {
    backgroundClickBlocked = true;
  }
  check(backgroundClickBlocked, 'consent allows a real pointer click on inert background content');
  await dark.locator('[data-consent="granted"]').focus();
  await dark.keyboard.press('Tab');
  check(await dark.locator('#gaeoConsentPrompt a[href]').evaluate(element => document.activeElement === element),
    'consent focus does not wrap forward');
  await dark.keyboard.press('Shift+Tab');
  check(await dark.locator('[data-consent="granted"]').evaluate(element => document.activeElement === element),
    'consent focus does not wrap backward');
  await dark.locator('[data-consent="denied"]').click();
  check(!await dark.locator('.global-nav').evaluate(element => element.inert),
    'consent close does not restore background interaction');
  await dark.locator('#navProfileToggle').click();
  await dark.locator('#trustInfoToggle').click();
  check(await dark.locator('#trustStrip').getAttribute('role') === 'dialog', 'trust information is not exposed as a dialog');
  await dark.waitForFunction(() => document.activeElement?.id === 'trustClose');
  const dialogFocus = await dark.evaluate(() => ({
    id: document.activeElement?.id || '',
    trustHidden: document.querySelector('#trustStrip').hidden,
    expanded: document.querySelector('#trustInfoToggle').getAttribute('aria-expanded'),
  }));
  check(dialogFocus.id === 'trustClose', `trust dialog does not receive focus: ${JSON.stringify(dialogFocus)}`);
  check(await dark.locator('.global-nav').evaluate(element => element.inert),
    'trust dialog does not make the background inert');
  const trustLinks = dark.locator('#trustStrip a[href]');
  await trustLinks.last().focus();
  await dark.keyboard.press('Tab');
  check(await dark.locator('#trustClose').evaluate(element => document.activeElement === element),
    'trust dialog focus does not wrap forward');
  await dark.keyboard.press('Shift+Tab');
  check(await trustLinks.last().evaluate(element => document.activeElement === element),
    'trust dialog focus does not wrap backward');
  await dark.keyboard.press('Escape');
  check(await dark.locator('#trustStrip').isHidden(), 'Escape does not close trust dialog');
  await dark.waitForFunction(() => document.activeElement?.id === 'navProfileToggle');
  check(await dark.locator('#navProfileToggle').evaluate(element => document.activeElement === element),
    'focus does not return to the visible profile trigger');
  check(!await dark.locator('.global-nav').evaluate(element => element.inert),
    'trust dialog close does not restore background interaction');
  await dark.close();

  await browser.close();
  console.log('test_editorial_foundation_browser: 전체 통과');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
