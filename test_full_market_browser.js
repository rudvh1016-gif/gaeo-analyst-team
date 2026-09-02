const { chromium } = require('./test_playwright');

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}

// FULL MARKET 실측 스키마를 그대로 본뜬 Fixture. collect_market_universe.py 실제 상수값
// (READY / FULL_MARKET_PARTIAL 아닌 값 / SOURCE_ERROR, sectorBreadth READY / SECTOR_MAPPING_PARTIAL)
// 문자열을 그대로 사용한다 — index.html·full-market-ui.js가 "PARTIAL" 같은 짐작값이 아니라
// 실제 파이프라인이 쓰는 문자열을 처리하는지 검증하기 위함이다.
function baseFixture(overrides) {
  const fixture = {
    schemaVersion: 'gaeo_market_context_v1',
    universeSource: 'FULL_MARKET',
    generatedAt: '2026-08-16T01:42:45+00:00',
    dataAsOf: '2026-08-16T01:42:45+00:00',
    kstDay: '2026-08-16',
    sourceStatus: 'READY',
    quality: { eligibleCount: 2410 },
    market: {
      eligibleCount: 2410, advancers: 1443, decliners: 893, unchanged: 74,
      advanceRatio: 0.5988, medianReturn: 0.54, equalWeightReturn: 0.826, capWeightedReturn: 2.311,
      turnoverTop5Share: 0.4745, turnoverTop30Share: 0.6264
    },
    kospi: {
      eligibleCount: 777, advancers: 578, decliners: 180, unchanged: 19,
      advanceRatio: 0.7439, medianReturn: 1.11, equalWeightReturn: 1.352, capWeightedReturn: 2.455,
      turnoverTop5Share: 0.6112, turnoverTop30Share: 0.769
    },
    kosdaq: {
      eligibleCount: 1633, advancers: 865, decliners: 713, unchanged: 55,
      advanceRatio: 0.5297, medianReturn: 0.19, equalWeightReturn: 0.575, capWeightedReturn: 0.597,
      turnoverTop5Share: 0.1825, turnoverTop30Share: 0.4995
    },
    history: 'HISTORY_ACCUMULATING',
    sectorBreadth: {
      status: 'READY', mappedCount: 2340, unmappedCount: 70,
      sectors: {
        '보험': { count: 13, advancers: 12, decliners: 1, advanceRatio: 0.9231, medianReturn: 4.23, equalWeightReturn: 4.602, capWeightedReturn: 3.503, capTop1Share: 0.5053, capTop3Share: 0.8329, breadthDivergence: -0.727 },
        '반도체': { count: 68, advancers: 23, decliners: 43, advanceRatio: 0.3382, medianReturn: -0.39, equalWeightReturn: -0.713, capWeightedReturn: 3.183, capTop1Share: 0.9773, capTop3Share: 0.9836, breadthDivergence: 3.573 },
        // 정렬 버그(문자열 정렬) 검증용 — advanceRatio가 9.9%와 10.1%처럼 "9"로 시작하는 값과
        // 두 자릿수 값을 함께 두어, 숫자 비교가 아니라 문자열 비교면 순서가 틀리게 만든다.
        '테스트업종A': { count: 20, advancers: 2, decliners: 18, advanceRatio: 0.099, medianReturn: -1.0, equalWeightReturn: -1.0, capWeightedReturn: -1.0 },
        '테스트업종B': { count: 20, advancers: 2, decliners: 18, advanceRatio: 0.101, medianReturn: -0.9, equalWeightReturn: -0.9, capWeightedReturn: -0.9 }
      }
    },
    note: 'test fixture'
  };
  return Object.assign(fixture, overrides);
}

(async () => {
  const baseUrl = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8878/index.html';
  const browser = await chromium.launch({ headless: true });

  // index.html은 PWA Service Worker(sw.js)를 등록한다. SW는 자체 fetch()로 응답을 캐시에
  // 저장해두고 실패 시 캐시로 폴백하는데, 이 fetch가 Playwright page.route() 인터셉션을
  // 우회할 수 있다(Fail-safe 테스트에서 404 mock을 걸어도 SW 캐시의 과거 정상 응답이 새는
  // 문제를 실측으로 확인함). 테스트 컨텍스트는 항상 SW를 꺼서 라우트 mock이 실제로 먹히게 한다.
  async function newTestPage(browser, viewport) {
    const context = await browser.newContext({ serviceWorkers: 'block', viewport });
    await context.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
    return context.newPage();
  }

  // 이 정적 서버(127.0.0.1)가 아닌 모든 외부 호출(GA·폰트·guestbook API 등)은 샌드박스 egress에서
  // 어차피 막히므로 애초에 요청 자체를 중단시켜 콘솔에 403/ERR_TUNNEL 잡음이 남지 않게 한다.
  async function blockExternal(page) {
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.hostname === '127.0.0.1') route.continue();
      else route.abort();
    });
  }

  // ---------- 공통: 순환매 모드 + 전체시장 탭까지 진입해 GaeoFullMarket 모듈을 로드해 둔다 ----------
  async function openFullMarketTab(page) {
    await blockExternal(page);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.setMode && window.setMode('rotation'));
    await page.locator('#fmTabHost.on').waitFor({ state: 'visible', timeout: 15000 });
    await page.evaluate(() => document.getElementById('fmTab-fullmarket').click());
    await page.waitForFunction(() => !!(window.GaeoFullMarket && typeof window.GaeoFullMarket.mount === 'function'), { timeout: 20000 });
  }

  async function mountFixture(page, fixture) {
    await page.evaluate((data) => {
      window.GaeoFullMarket.mount(document.getElementById('fullMarketView'), data);
    }, fixture);
  }

  // ---------- TEST 1/9/10 — 실제 데이터로 정상 렌더 + Home 내비게이션 + 기존 순환매 무변경 ----------
  {
    const page = await newTestPage(browser, { width: 1280, height: 900 });
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(String(e)));
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await blockExternal(page);

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    // BROWSER TEST 9 — 홈 "전체시장 흐름 보기 →" 클릭 한 번으로 순환매 모드 + 전체시장 탭까지 진입.
    await page.waitForSelector('#briefFullMarketBtn', { timeout: 15000 });
    await page.click('#briefFullMarketBtn');
    await page.locator('.fullmarket-view.on .fm-shell').waitFor({ state: 'visible', timeout: 20000 });
    requireState(await page.locator('#fmTab-fullmarket').getAttribute('aria-selected') === 'true', 'Home 진입 후 전체시장 탭이 선택 상태가 아님');
    requireState(await page.evaluate(() => !document.getElementById('rotationView').classList.contains('on')), 'Home 진입 후 순환매 판단 뷰가 여전히 보임(전체시장 탭과 동시 표시)');
    // Header Sync — 홈 direct navigation의 최종 상태는 처음부터 전체시장 Header여야 한다.
    requireState((await page.locator('#modeSectionTitle').innerText()).trim() === '전체시장 흐름', 'Home 진입 후 상단 Section Title이 전체시장 흐름이 아님');
    requireState(await page.evaluate(() => { const el = document.getElementById('fmModeTitle'); return !!el.offsetParent && el.textContent.trim() === '전체시장 흐름'; }), 'Home 진입 후 보이는 상단 헤더(fmModeTitle)가 전체시장 흐름이 아니거나 안 보임');
    requireState((await page.locator('#modeSectionDesc').innerText()).includes('KOSPI·KOSDAQ 전체 적격기업'), 'Home 진입 후 상단 Description이 전체시장 설명이 아님');
    requireState((await page.locator('#fmSegDesc').innerText()).includes('현재 선택 · 전체시장 흐름'), 'selector 아래 현재 선택 설명이 전체시장으로 안 바뀜');

    // 실측 데이터 정상 렌더 확인 — eligibleCount는 window.GAEO_MARKET_CONTEXT에서 동적으로 읽혀야 한다.
    const ctx = await page.evaluate(() => window.GAEO_MARKET_CONTEXT);
    requireState(ctx && ctx.market && Number.isFinite(ctx.market.eligibleCount), 'GAEO_MARKET_CONTEXT.market.eligibleCount를 읽지 못함');
    const heroCount = await page.locator('.fm-asof strong').innerText();
    requireState(heroCount.includes(ctx.market.eligibleCount.toLocaleString('ko-KR')), `헤더 종목수가 동적 eligibleCount와 다름: ${heroCount}`);
    requireState(await page.locator('.fm-participation-counts').count() === 1, '시장 참여도 섹션 없음');
    requireState(await page.locator('.fm-compare-table').count() === 1, 'KOSPI/KOSDAQ 비교 표 없음');
    requireState(await page.locator('.fm-feel-grid').count() === 1, '지수체감 vs 종목체감 섹션 없음');
    requireState(await page.locator('.fm-conc-grid').count() === 1, '거래대금 집중도 섹션 없음');
    const sectorRows = await page.locator('.fm-sector-row').count();
    requireState(sectorRows === Object.keys(ctx.sectorBreadth.sectors).length, `업종 Row 개수(${sectorRows})가 실제 업종 수와 다름`);

    // 하드코딩 금지 — 실제 동적 렌더 여부는 아래 TEST 2(eligibleCount=2500 Fixture → "2,500종목" 반영)로 검증한다.
    // 여기서는 렌더된 화면이 실제 GAEO_MARKET_CONTEXT 값과 정확히 일치하는지만 재확인한다(이미 위에서 확인 완료).

    // BROWSER TEST 10 — 순환매 판단 탭으로 되돌아가도 기존 화면이 그대로 동작해야 한다.
    await page.click('#fmTab-rotation');
    await page.locator('.rotation-view.on .rot-shell').waitFor({ state: 'visible', timeout: 20000 });
    requireState(await page.locator('#fmTab-rotation').getAttribute('aria-selected') === 'true', '순환매 판단 탭 복귀 후 aria-selected 갱신 안 됨');
    requireState(await page.evaluate(() => !document.getElementById('fullMarketView').classList.contains('on')), '순환매 판단 탭 복귀 후 전체시장 뷰가 계속 보임');
    // Header Sync — 순환매 복귀 시 상단 Header도 즉시 순환매 설명으로 복원.
    requireState((await page.locator('#modeSectionTitle').innerText()).trim() === '순환매', '순환매 복귀 후 상단 Section Title이 순환매로 복원 안 됨');
    requireState(await page.evaluate(() => document.getElementById('fmModeTitle').textContent.trim() === '순환매'), '순환매 복귀 후 보이는 상단 헤더가 순환매로 복원 안 됨');
    requireState((await page.locator('#modeSectionDesc').innerText()).includes('GAEO 추적 종목'), '순환매 복귀 후 Description이 GAEO 추적 종목 설명이 아님');
    requireState((await page.locator('#fmSegDesc').innerText()).includes('현재 선택 · 순환매 판단'), 'selector 아래 현재 선택 설명이 순환매로 복원 안 됨');

    // Header Sync 왕복 5회 — 매번 Title/active 버튼/보이는 뷰가 삼위일체로 일치해야 한다.
    for (let i = 0; i < 5; i++) {
      await page.click('#fmTab-fullmarket');
      requireState(await page.evaluate(() => document.getElementById('fmModeTitle').textContent.trim() === '전체시장 흐름' && document.getElementById('modeSectionTitle').textContent.trim() === '전체시장 흐름'), `왕복 ${i + 1}회차: 전체시장 선택인데 Title 불일치`);
      requireState(await page.evaluate(() => document.getElementById('fullMarketView').classList.contains('on') && !document.getElementById('rotationView').classList.contains('on')), `왕복 ${i + 1}회차: 전체시장 선택인데 뷰 표시 불일치`);
      await page.click('#fmTab-rotation');
      requireState(await page.evaluate(() => document.getElementById('fmModeTitle').textContent.trim() === '순환매' && document.getElementById('modeSectionTitle').textContent.trim() === '순환매'), `왕복 ${i + 1}회차: 순환매 복귀인데 Title 불일치`);
      requireState(await page.evaluate(() => document.getElementById('rotationView').classList.contains('on') && !document.getElementById('fullMarketView').classList.contains('on')), `왕복 ${i + 1}회차: 순환매 복귀인데 뷰 표시 불일치`);
    }
    // 빠른 연타 6회 후에도 최종 상태(버튼·Header·뷰)가 일치해야 한다.
    for (let i = 0; i < 6; i++) await page.click(i % 2 ? '#fmTab-rotation' : '#fmTab-fullmarket');
    const finalState = await page.evaluate(() => ({
      active: document.getElementById('fmTab-fullmarket').classList.contains('on') ? 'fullmarket' : 'rotation',
      title: document.getElementById('fmModeTitle').textContent.trim(),
      fmOn: document.getElementById('fullMarketView').classList.contains('on'),
      rotOn: document.getElementById('rotationView').classList.contains('on')
    }));
    const expectTitle = finalState.active === 'fullmarket' ? '전체시장 흐름' : '순환매';
    requireState(finalState.title === expectTitle && finalState.fmOn === (finalState.active === 'fullmarket') && finalState.rotOn === (finalState.active === 'rotation'),
      `연타 후 상태 불일치: ${JSON.stringify(finalState)}`);

    requireState(pageErrors.length === 0, `pageerror 발생: ${pageErrors.join(' | ')}`);
    // blockExternal()로 의도적으로 중단시킨 외부 리소스는 "Failed to load resource: net::ERR_FAILED"를
    // 정상적으로 남긴다(이 샌드박스에서 외부 egress 자체가 막혀 있는 환경 특성 — 기존 rotation 테스트도
    // 이 소음은 검사하지 않고 pageerror만 본다). 우리 코드가 만드는 실제 JS 에러만 걸러 확인한다.
    const realErrors = consoleErrors.filter(t => !/favicon/i.test(t) && !/net::ERR_FAILED/.test(t) && !/Failed to load resource/i.test(t));
    requireState(realErrors.length === 0, `console.error 발생: ${realErrors.join(' | ')}`);
    await page.close();
    console.log('TEST 1/9/10 (실측 렌더·Home 내비게이션·순환매 무변경) 통과');
  }

  // ---------- TEST 2 — 동적 종목수(하드코딩 아님) ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    const fixture = baseFixture({ market: Object.assign({}, baseFixture().market, { eligibleCount: 2500 }) });
    await mountFixture(page, fixture);
    const heroCount = await page.locator('.fm-asof strong').innerText();
    requireState(heroCount.includes('2,500'), `eligibleCount=2500 Fixture인데 화면에 반영 안 됨: ${heroCount}`);
    await page.close();
    console.log('TEST 2 (동적 종목수) 통과');
  }

  // ---------- TEST 3 — PARTIAL(FULL_MARKET_PARTIAL 실제 문자열) ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture({ sourceStatus: 'FULL_MARKET_PARTIAL' }));
    const status = await page.locator('.fm-status').innerText();
    requireState(status.includes('일부 데이터 확인 중'), `PARTIAL 상태 문구가 없음: ${status}`);
    requireState(!status.includes('정상') || status.includes('일부'), `PARTIAL인데 정상처럼 표시됨: ${status}`);
    await page.close();
    console.log('TEST 3 (PARTIAL) 통과');
  }

  // ---------- TEST 4 — SOURCE_ERROR: last-good dataAsOf 표시, 현재시각 위장 금지 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    const staleAsOf = '2026-08-10T01:00:00+00:00';   // 오늘(2026-08-16)보다 훨씬 이전 — "마지막 정상"임을 뚜렷하게 함
    await mountFixture(page, baseFixture({ sourceStatus: 'SOURCE_ERROR', dataAsOf: staleAsOf }));
    const status = await page.locator('.fm-status').innerText();
    requireState(status.includes('마지막 정상 데이터 기준'), `SOURCE_ERROR 문구 없음: ${status}`);
    requireState(status.includes('8월 10일'), `SOURCE_ERROR 상태에서 dataAsOf(8월 10일) 대신 다른 시각 표시: ${status}`);
    await page.close();
    console.log('TEST 4 (SOURCE_ERROR + last-good dataAsOf) 통과');
  }

  // ---------- TEST 5 — sectorBreadth 미준비: 가짜 순위 생성 금지 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture({ sectorBreadth: { status: 'SECTOR_MAPPING_PARTIAL', sectors: {} } }));
    requireState(await page.locator('.fm-sector-row').count() === 0, 'sectorBreadth 미준비인데 업종 Row가 생성됨(가짜 순위)');
    const sectorSection = await page.locator('.fm-sectors').innerText();
    requireState(sectorSection.includes('업종 데이터 확인 중'), `업종 미준비 안내 문구 없음: ${sectorSection}`);
    await page.close();
    console.log('TEST 5 (sectorBreadth 미준비) 통과');
  }

  // ---------- TEST 6 — 결측값은 '—', 0%로 위장 금지 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    const market = Object.assign({}, baseFixture().market, { medianReturn: null, equalWeightReturn: null, capWeightedReturn: null });
    await mountFixture(page, baseFixture({ market }));
    const feelText = await page.locator('.fm-feel-grid').innerText();
    requireState(feelText.includes('—'), 'medianReturn=null인데 —(대시) 표시 없음');
    requireState(!feelText.includes('0.00%') && !feelText.includes('NaN') && !feelText.includes('null') && !feelText.includes('undefined'),
      `결측값이 0%/NaN/null/undefined로 새어나감: ${feelText}`);
    await page.close();
    console.log('TEST 6 (결측값 —) 통과');
  }

  // ---------- TEST 7 — 정렬은 문자열이 아니라 숫자 비교 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture());
    await page.selectOption('#fmSortSelect', 'advanceRatio');
    const names = await page.locator('.fm-sector-name').allInnerTexts();
    const idxA = names.indexOf('테스트업종A'), idxB = names.indexOf('테스트업종B');
    requireState(idxA >= 0 && idxB >= 0, '정렬 테스트용 업종을 찾지 못함');
    // A(9.9%) < B(10.1%) → 내림차순 정렬이면 B가 A보다 앞에 와야 한다. 문자열 정렬이면 "10.1%" < "9.9%"로 뒤집힌다.
    requireState(idxB < idxA, `숫자 정렬 실패 — 상승참여율 10.1%(B)가 9.9%(A)보다 뒤에 옴 (문자열 정렬 의심): ${names.join(',')}`);
    await page.close();
    console.log('TEST 7 (숫자 정렬) 통과');
  }

  // ---------- TEST 8 — 업종 펼치기는 집계만, 개별 종목명 생성 금지 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture());
    await page.locator('.fm-sector-row[data-sector="보험"]').click();
    const detail = page.locator('.fm-sector-item', { has: page.locator('[data-sector="보험"]') }).locator('.fm-sector-detail');
    await detail.waitFor({ state: 'visible', timeout: 5000 });
    const detailText = await detail.innerText();
    requireState(detailText.includes('전체 종목수') && detailText.includes('13'), '업종 집계(종목수 13) 표시 안 됨');
    // ⭐ 2026-08-16 계약 갱신: 사용자 요청으로 "GAEO 추적 종목 참고 TOP3"를 업종 펼침에 표시한다.
    // 단 전체시장 구성종목 목록으로 오인되지 않도록, 픽이 보이면 반드시
    // ① 'GAEO 추적' 출처 라벨과 ② '구성종목 목록이 아니' 면책이 함께 있어야 한다.
    const pickCount = await page.locator('.fm-pick').count();
    if (pickCount > 0) {
      requireState(detailText.includes('GAEO 추적'), '참고 종목이 있는데 GAEO 추적 출처 라벨이 없음');
      requireState(detailText.includes('구성종목 목록이 아니'), '참고 종목이 있는데 전체시장 구성종목 아님 면책이 없음');
      requireState(detailText.includes('판단 확신도'), '참고 종목에 판단 확신도 표기가 없음');
      requireState(pickCount <= 3, `참고 종목이 3개를 초과: ${pickCount}`);
    }
    await page.close();
    console.log(`TEST 8 (업종 상세 집계 + GAEO 참고 ${pickCount}종목 라벨) 통과`);
  }

  // ---------- TEST 14 — Segmented Control 어포던스 (390px 실측) ----------
  {
    const page = await newTestPage(browser, { width: 390, height: 844 });
    await openFullMarketTab(page);
    const seg = await page.evaluate(() => {
      const bar = document.getElementById('fmTabBar');
      const r = document.getElementById('fmTab-rotation'), f = document.getElementById('fmTab-fullmarket');
      const barCs = getComputedStyle(bar), onCs = getComputedStyle(f), offCs = getComputedStyle(r);
      return {
        barBg: barCs.backgroundColor, barBorder: barCs.borderTopWidth, barRadius: barCs.borderRadius,
        onBg: onCs.backgroundColor, offBg: offCs.backgroundColor,
        onWeight: onCs.fontWeight, offWeight: offCs.fontWeight,
        onShadow: onCs.boxShadow, sameRow: Math.abs(r.getBoundingClientRect().top - f.getBoundingClientRect().top) < 2,
        heights: [r.getBoundingClientRect().height, f.getBoundingClientRect().height],
        rClipped: r.scrollWidth > r.clientWidth + 1, fClipped: f.scrollWidth > f.clientWidth + 1,
        smallCount: bar.querySelectorAll('small').length,
        label: (document.getElementById('fmSegLabel') || {}).textContent || ''
      };
    });
    requireState(seg.barBg !== 'rgba(0, 0, 0, 0)' && seg.barBorder !== '0px', 'selector container가 배경/테두리 없는 텍스트 메뉴처럼 보임');
    requireState(seg.onBg !== seg.offBg, '선택/미선택 버튼 배경이 동일 — active state 식별 불가');
    requireState(seg.onShadow !== 'none', '선택 버튼에 surface 구분(shadow) 없음');
    requireState(Number(seg.onWeight) > Number(seg.offWeight) || seg.onBg !== seg.offBg, '선택 상태가 색상만으로 표현됨');
    requireState(seg.sameRow, '390px에서 두 버튼이 한 줄에 있지 않음');
    requireState(seg.heights.every(h => h >= 38 && h <= 50), `버튼 높이가 40~44px 범위를 벗어남: ${seg.heights}`);
    requireState(!seg.rClipped && !seg.fClipped, '버튼 Label이 잘림(clipping)');
    requireState(seg.smallCount === 0, '버튼 내부에 small 설명문이 남아 있음');
    requireState(seg.label.includes('화면 선택'), '"화면 선택" 안내 라벨 없음');
    await page.close();
    console.log('TEST 14 (Segmented Control 어포던스, 390px) 통과');
  }

  // ---------- TEST 15 — HISTORY_ACCUMULATING 문구: 기간별 분리 + 이동평균선/무정의 평균 금지 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture());   // history = 'HISTORY_ACCUMULATING'
    const text = await page.locator('#fullMarketView').innerText();
    requireState(text.includes('시장 흐름 추세'), 'History 섹션 제목(시장 흐름 추세) 없음');
    requireState(text.includes('최근 5거래일') && text.includes('최근 20거래일'), '5거래일/20거래일 기간 분리 표시 없음');
    requireState((text.match(/데이터 기록 중/g) || []).length >= 2, '기간별 "데이터 기록 중" 표시가 2개 미만');
    requireState(text.includes('아직 충분한 기록이 없어'), '평균/추세 미표시 사유 설명 없음');
    for (const banned of ['5일선', '20일선', '5일 평균', '20일 평균', '5일 / 20일 흐름']) {
      requireState(!text.includes(banned), `금지 문구 발견: "${banned}"`);
    }
    // 기준시각 명시(2026-08-16): fixture의 dataAsOf는 일요일 10:42 KST(휴장 시간).
    // '수집' 표기와 '마지막 거래일 기준' 안내가 함께 나와야 한다(현재시각 위장 금지).
    const asof = await page.locator('.fm-asof').innerText();
    requireState(asof.includes('수집'), `수집 시각 표기 없음: ${asof.slice(0, 80)}`);
    requireState(asof.includes('마지막 거래일 기준'), `휴장 시간 수집인데 시세 기준 안내 없음: ${asof.slice(0, 80)}`);
    await page.close();
    console.log('TEST 15 (History 문구 + 휴장 수집 기준 명시) 통과');
  }

  // ---------- TEST 12 — sectorBreadth 키 자체가 없음(구 스키마) → 업종 데이터 확인 중, 크래시 없음 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(String(e)));
    await openFullMarketTab(page);
    const fixture = baseFixture();
    delete fixture.sectorBreadth;
    await mountFixture(page, fixture);
    requireState(await page.locator('.fm-sector-row').count() === 0, 'sectorBreadth 키가 없는데 업종 Row가 생성됨');
    requireState((await page.locator('.fm-sectors').innerText()).includes('업종 데이터 확인 중'), 'sectorBreadth 없음 안내 문구 없음');
    requireState(pageErrors.length === 0, `sectorBreadth 없음 상황에서 pageerror 발생: ${pageErrors.join(' | ')}`);
    await page.close();
    console.log('TEST 12 (sectorBreadth 키 자체 없음) 통과');
  }

  // ---------- TEST 13 — 업종명이 매우 길어도 가로 오버플로우 없음 ----------
  {
    const page = await newTestPage(browser, { width: 375, height: 800 });
    await openFullMarketTab(page);
    const fixture = baseFixture();
    fixture.sectorBreadth.sectors['아주아주아주아주아주아주아주아주아주아주긴업종이름테스트'] =
      { count: 9, advancers: 5, decliners: 4, advanceRatio: 0.5556, medianReturn: 0.1, equalWeightReturn: 0.1, capWeightedReturn: 0.1 };
    await mountFixture(page, fixture);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    requireState(overflow <= 1, `긴 업종명 렌더 후 375px 가로 오버플로우 ${overflow}px`);
    await page.close();
    console.log('TEST 13 (매우 긴 업종명) 통과');
  }

  // ---------- TEST 11 — window.GAEO_MARKET_CONTEXT 자체가 없을 때 조용한 Empty State ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(String(e)));
    await blockExternal(page);
    // blockExternal보다 나중에 등록해야 market_context.js에 한해 이 404 응답이 우선 적용된다.
    await page.route('**/market_context.js*', route => route.fulfill({ status: 404, body: 'not found' }));
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.setMode && window.setMode('rotation'));
    await page.click('#fmTab-fullmarket');
    await page.locator('.fullmarket-view.on .fm-empty').waitFor({ state: 'visible', timeout: 20000 });
    const emptyText = await page.locator('.fm-empty').innerText();
    requireState(emptyText.includes('전체시장 데이터를 불러오지 못했습니다'), `Fail-safe 문구 다름: ${emptyText}`);
    // 순환매 판단 탭은 별도 번들이라 여전히 정상 작동해야 한다.
    await page.click('#fmTab-rotation');
    await page.locator('.rotation-view.on .rot-shell').waitFor({ state: 'visible', timeout: 20000 });
    requireState(pageErrors.length === 0, `market_context.js 404 상황에서 pageerror 발생: ${pageErrors.join(' | ')}`);
    await page.close();
    console.log('TEST 11 (GAEO_MARKET_CONTEXT 없음 → Fail-safe, 순환매 탭 무영향) 통과');
  }

  // ---------- 시각/접근성 — 375/390/430/768/1024/1280/1440, overflow=0, console error=0 ----------
  {
    const page = await newTestPage(browser, { width: 1280, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture());
    for (const width of [375, 390, 430, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: width <= 430 ? 900 : 1000 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      requireState(overflow <= 1, `${width}px 전체시장 화면 가로 오버플로우 ${overflow}px`);
    }
    // 접근성: role/aria, 키보드로 탭 전환
    requireState(await page.locator('#fmTabBar[role="tablist"]').count() === 1, 'tablist role 없음');
    requireState(await page.locator('#fmTab-fullmarket[role="tab"]').count() === 1, 'tab role 없음');
    await page.locator('#fmTab-rotation').focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.getElementById('fmTab-fullmarket').getAttribute('aria-selected') === 'true', { timeout: 5000 });
    await page.close();
    console.log('시각/접근성 QA(375~1440px, 키보드 탭 전환) 통과');
  }

  // ---------- 다크모드 ----------
  {
    const page = await newTestPage(browser, { width: 1024, height: 900 });
    await openFullMarketTab(page);
    await mountFixture(page, baseFixture());
    await page.evaluate(() => document.documentElement.classList.add('gdark'));
    const bg = await page.locator('.fm-panel').first().evaluate(el => getComputedStyle(el).backgroundColor);
    requireState(bg !== 'rgb(255, 255, 255)', `다크모드에서도 패널 배경이 흰색(${bg}) — gdark 스타일 미적용`);
    await page.close();
    console.log('다크모드 배경 전환 확인 통과');
  }

  await browser.close();
  console.log('full market browser tests passed');
})().catch(err => {
  console.error(err && err.stack || err);
  process.exit(1);
});
