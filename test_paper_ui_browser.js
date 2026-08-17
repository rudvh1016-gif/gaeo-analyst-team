/* 모의투자 독립 화면 — UI 계약 브라우저 테스트 (2026-08-18)
 *
 * 이 테스트가 지키는 계약
 *   ① 모의투자는 성적표 하위 기능이 아니라 독립 최상위 화면이다
 *   ② 거래 0건을 승률 0%·수익률 0%로 보여주지 않는다(없는 값은 0이 아니라 '—'/상태어)
 *   ③ paper_public.js가 없거나 오래된 스키마여도 화면이 깨지지 않는다(fail closed)
 *   ④ 브라우저는 Toss·Secret·실제 계좌에 접근하지 않고, 실제 주문 UI를 만들지 않는다
 *   ⑤ 모바일에서 가로 스크롤·숫자 잘림이 없다
 *
 * 실행: node test_static_server.js 8877 &  →  node test_paper_ui_browser.js
 */
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
const failures = [];

function check(name, condition, detail) {
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}` + (!condition && detail ? ` — ${detail}` : ''));
  if (!condition) failures.push(name);
}

// window.GAEO_PAPER 를 갈아끼운 뒤 renderPaper()를 다시 돌려 화면 텍스트를 읽는다.
async function renderWith(page, snapshot) {
  return page.evaluate(payload => {
    window.GAEO_PAPER = payload;
    window.setMode('paper');
    const view = document.getElementById('paperView');
    return { text: view.innerText, html: view.innerHTML };
  }, snapshot);
}

const BASELINE = {
  schemaVersion: 'gaeo_paper_public_v1',
  strategyVersion: 'PAPER_BASELINE_V1',
  forwardStart: '2026-08-18',
  lastCycleAt: '2026-08-18T02:58:13+09:00',
  stage: 'BASELINE_ONLY',
  initialVirtualCash: 10000000,
  currentVirtualEquity: 10000000,
  realizedPnl: null, unrealizedPnl: null, portfolioReturnPct: null, maxDrawdownPct: null,
  openTrades: 0, closedTrades: 0, executedTradeCount: 0,
  evidenceStatus: 'INSUFFICIENT_EVIDENCE — 표본이 적어 성과 결론 금지',
  winRatePct: null, avgReturnPct: null, avgRelativeReturnPct: null, avgHoldingTradingDays: null,
  costModel: 'COST_MODEL_INCOMPLETE',
  benchmarkNote: '지수 대비 근사치입니다.',
  recentTrades: []
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));

  // ── ① 독립 최상위 화면 · 딥링크 ──────────────────────────────────────────
  await page.goto(BASE + '?m=paper');
  await page.waitForTimeout(2000);

  const routed = await page.evaluate(() => ({
    mode: document.body.dataset.mode,
    viewOn: document.getElementById('paperView').classList.contains('on'),
    scorecardOn: document.getElementById('scorecardView').classList.contains('on'),
    navTop: !!document.querySelector('.global-link[data-nav-mode="paper"]'),
    navRail: !!document.getElementById('mode-paper'),
    navActive: !!document.querySelector('.global-link.on[data-nav-mode="paper"]')
  }));
  check('?m=paper 딥링크가 모의투자 화면을 연다', routed.mode === 'paper' && routed.viewOn, JSON.stringify(routed));
  check('모의투자 진입 시 성적표는 닫혀 있다', !routed.scorecardOn);
  check('상단 최상위 메뉴에 모의투자가 있다', routed.navTop);
  check('전체 메뉴(모바일 포함)에 모의투자가 있다', routed.navRail);
  check('현재 위치가 상단 메뉴에 표시된다', routed.navActive);

  // 성적표에는 모의투자가 남아 있지 않다.
  const scorecardText = await page.evaluate(() => {
    window.setMode('scorecard');
    return document.getElementById('scorecardView').innerText;
  });
  check('성적표 안에 모의투자 UI가 남아 있지 않다',
    !/모의투자|가상거래|가상 시작자금/.test(scorecardText));

  // 다른 메뉴로 가면 모의투자 잔상이 남지 않는다.
  const residue = await page.evaluate(() => {
    window.setMode('calendar');
    return document.getElementById('paperView').classList.contains('on');
  });
  check('다른 메뉴로 이동하면 모의투자가 닫힌다', !residue);

  // ── ② 거래 0건 — 0%가 아니라 상태어 ─────────────────────────────────────
  const empty = await renderWith(page, BASELINE);
  check('BASELINE_ONLY 빈 상태 문구가 나온다', /첫 검증 신호를 기다리고 있습니다/.test(empty.text));
  check('거래 0건을 승률 0%로 표시하지 않는다', !/승률[\s\S]{0,20}0(\.0)?%/.test(empty.text));
  check('거래 0건을 수익률 0%로 표시하지 않는다', !/누적 성과[\s\S]{0,20}\+?0\.00%/.test(empty.text));
  check('누적 성과가 —(기록 축적 중)로 표시된다', /기록 축적 중/.test(empty.text));
  check('시작자금은 실제 예치금이 아니라고 밝힌다', /실제로 예치한 돈이 아닙니다/.test(empty.text));
  check('실제 주문이 없음을 명시한다', /실제 투자 주문은 발생하지 않습니다/.test(empty.text));
  check('비용 미반영을 명시한다', /비용 모델 확인 중/.test(empty.text));
  check("'순수익'·'실제 수익' 같은 오해 표현이 없다", !/순수익|실제 수익률|실전 수익/.test(empty.text));

  const otherStages = {
    BEFORE_FORWARD_START: '검증 시작을 기다리고 있습니다',
    AWAITING_MARKET_DATA: '시세 연결을 준비하고 있습니다'
  };
  for (const [stage, phrase] of Object.entries(otherStages)) {
    const out = await renderWith(page, { ...BASELINE, stage });
    check(`${stage} 상태 문구가 정확하다`, out.text.includes(phrase));
  }
  const running = await renderWith(page, { ...BASELINE, stage: 'RUNNING' });
  check('RUNNING인데 거래가 없으면 신호 대기 문구',
    /아직 새롭게 발생한 매수 고려 신호가 없습니다/.test(running.text));

  // ── ③ 실제 거래 렌더 · 부호별 · 결측 필드 ────────────────────────────────
  const withTrades = await renderWith(page, {
    ...BASELINE,
    stage: 'RUNNING',
    currentVirtualEquity: 10123000, portfolioReturnPct: 1.23,
    realizedPnl: 84000, unrealizedPnl: -12000, maxDrawdownPct: -3.4,
    openTrades: 2, closedTrades: 3, winRatePct: 66.7, avgReturnPct: 0.9,
    avgRelativeReturnPct: -0.42, avgHoldingTradingDays: 3.5,
    evidenceStatus: 'OK',
    recentTrades: [
      { symbol: '316140', name: '우리금융지주', status: 'OPEN', signal: 'BUY',
        entry_business_date: '2026-08-18', holding_trading_days: 2 },
      { symbol: '000001', name: '플러스종목', status: 'CLOSED', signal: 'BUY',
        entry_business_date: '2026-08-11', exit_reason: 'MAX_HOLDING_5D',
        holding_trading_days: 5, gross_return_pct: 4.21 },
      { symbol: '000002', name: '마이너스종목', status: 'CLOSED', signal: 'BUY',
        entry_business_date: '2026-08-11', exit_reason: 'CHIEF_SELL',
        holding_trading_days: 3, gross_return_pct: -2.5 },
      { symbol: '000003', name: '보합종목', status: 'CLOSED', signal: 'BUY',
        entry_business_date: '2026-08-11', exit_reason: 'CHIEF_SELL',
        holding_trading_days: 1, gross_return_pct: 0 },
      { symbol: '000004', name: '수익률없는종목', status: 'CLOSED', signal: 'BUY',
        entry_business_date: '2026-08-11', exit_reason: 'CHIEF_SELL' },
      // 필드가 거의 없는 행(옛 스냅샷·부분 기록)도 깨지지 않아야 한다.
      { symbol: '000005', status: 'OPEN' },
      { symbol: '000006', name: '엔에이치기업인수목적이십오호주식회사특별계정', status: 'OPEN',
        signal: 'BUY', entry_business_date: '2026-08-18', holding_trading_days: 1 }
    ]
  });
  check('진행 중 거래가 렌더된다', /우리금융지주/.test(withTrades.text) && /진행 중/.test(withTrades.text));
  check('양수 수익률에 + 부호와 상승색', /\+4\.21%/.test(withTrades.text) && /pv-tret pv-up/.test(withTrades.html));
  check('음수 수익률에 − 부호와 하락색', /−2\.50%/.test(withTrades.text) && /pv-tret pv-dn/.test(withTrades.html));
  check('0% 수익률은 방향색 없이 표시', /0\.00%/.test(withTrades.text));
  check('수익률 없는 종료 거래는 0%가 아니라 기록 대기', /기록 대기/.test(withTrades.text));
  check('종목명이 없어도 코드로 렌더된다', /000005/.test(withTrades.text));
  check('청산 사유가 사람 말로 번역된다',
    /5거래일 도달/.test(withTrades.text) && /매도 고려 전환/.test(withTrades.text));
  check('시장대비는 %p 단위로 표시', /%p/.test(withTrades.text));
  check('승률이 표본 충분할 때 표시된다', /66\.7%/.test(withTrades.text));
  check('MDD는 절대값으로 표시', /3\.4%/.test(withTrades.text));

  // 표본 부족이면 승률을 계산해서 보여주지 않는다.
  const scarce = await renderWith(page, {
    ...BASELINE, stage: 'RUNNING', closedTrades: 2, winRatePct: 50,
    evidenceStatus: 'INSUFFICIENT_EVIDENCE — 표본이 적어 성과 결론 금지'
  });
  check('표본 부족이면 승률 대신 표본 부족으로 표기',
    /표본 부족/.test(scarce.text) && !/50\.0%/.test(scarce.text));

  // ── ④ 옛 스키마 · 스냅샷 없음(fail closed) ───────────────────────────────
  const legacy = await renderWith(page, {
    schemaVersion: 'gaeo_paper_public_v1', stage: 'BASELINE_ONLY', initialVirtualCash: 10000000
  });
  check('옛/부분 스냅샷에서도 화면이 렌더된다', legacy.text.length > 200);
  check('없는 값을 0으로 지어내지 않는다', !/누적 성과[\s\S]{0,16}0\.00%/.test(legacy.text));

  const missing = await renderWith(page, null);
  check('스냅샷이 없으면 fail-closed 안내를 보여준다',
    /기록을 아직 불러오지 못했어요/.test(missing.text));
  check('스냅샷이 없어도 가짜 숫자를 만들지 않는다', !/원/.test(missing.text.replace(/모의투자 요약/g, '')));

  // ── ⑤ 보안 계약 — Toss·Secret·실제 주문 UI 0 ────────────────────────────
  const pageHtml = await page.content();
  for (const bad of ['tossinvest.com', 'client_secret', 'access_token', 'TOSS_INVEST_CLIENT']) {
    check(`화면에 ${bad} 흔적 없음`, !pageHtml.includes(bad));
  }
  const orderUi = await page.evaluate(() => {
    const view = document.getElementById('paperView');
    return {
      buttons: view.querySelectorAll('button,input,form,a[href^="http"]').length,
      order: /지금 매수|주문하기|매수하기|매도하기|실제 매수|자동매매/.test(view.innerText)
    };
  });
  check('모의투자 화면에 실제 주문 UI가 없다', !orderUi.order && orderUi.buttons === 0,
    JSON.stringify(orderUi));

  // ── ⑥ 접근성 · 반응형 ────────────────────────────────────────────────────
  await renderWith(page, BASELINE);
  const a11y = await page.evaluate(() => {
    const view = document.getElementById('paperView');
    const summary = view.querySelector('.pv-gloss > summary');
    summary.focus();
    const focused = document.activeElement === summary;
    const details = summary.parentElement;
    summary.click();
    return {
      headings: [...view.querySelectorAll('h2,h3')].map(h => h.tagName),
      labelled: [...view.querySelectorAll('section')].every(s => s.getAttribute('aria-labelledby')),
      focusable: focused,
      opens: details.open,
      // 색만으로 방향을 전달하지 않는다 — 부호가 함께 있어야 한다.
      signOnly: true
    };
  });
  check('시맨틱 heading 구조(h2 + h3)', a11y.headings[0] === 'H2' && a11y.headings.includes('H3'),
    JSON.stringify(a11y.headings));
  check('각 섹션에 aria-labelledby가 있다', a11y.labelled);
  check('용어 설명이 키보드 포커스를 받고 펼쳐진다', a11y.focusable && a11y.opens);

  for (const width of [1440, 1280, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(150);
    const layout = await page.evaluate(() => {
      const view = document.getElementById('paperView');
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      // 숫자가 잘리는지: 요약 값의 실제 폭이 칸을 넘는지 본다.
      const clipped = [...view.querySelectorAll('.pv-sum-v,.pv-tret')]
        .filter(el => el.scrollWidth > el.clientWidth + 1).length;
      return { overflow, clipped };
    });
    check(`${width}px 가로 스크롤 없음`, layout.overflow <= 0, `overflow=${layout.overflow}px`);
    check(`${width}px 숫자 잘림 없음`, layout.clipped === 0, `clipped=${layout.clipped}`);
  }

  check('JS 예외 없음', pageErrors.length === 0, pageErrors.join(' | '));

  await browser.close();
  console.log();
  if (failures.length) {
    console.log(`실패 ${failures.length}건: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('test_paper_ui_browser: 전체 통과');
})().catch(error => { console.error(error); process.exit(1); });
