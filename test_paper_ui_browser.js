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
// live: 표시용 신선화 소스(data.js 역할) — null이면 차단해 결정적으로 엔진 스냅샷만 쓰게 한다.
async function renderWith(page, snapshot, live = null) {
  return page.evaluate(({ payload, live }) => {
    window.GAEO_PAPER = payload;
    window.GAEO_PAPER_LIVE = live;   // undefined가 아니면 전역 LIVE_DATA 대신 이 값을 쓴다
    // 시나리오마다 깨끗한 상태에서 시작한다(펼침 유지 자체는 C12에서 따로 검증)
    if (typeof PV_VIEW !== 'undefined') { PV_VIEW = 'holdings'; PV_DAY = null; PV_OPEN.clear(); }
    window.setMode('paper');
    window.renderPaper();
    const view = document.getElementById('paperView');
    return { text: view.innerText, html: view.innerHTML };
  }, { payload: snapshot, live });
}


// 보유 종목 상세는 눌러야 열린다 — 상세 내용을 검증할 땐 전부 펼친 뒤 읽는다.
async function expandAll(page) {
  return page.evaluate(() => {
    document.querySelectorAll('.pv-pos-hd[aria-expanded="false"]').forEach(b => b.click());
    const v = document.getElementById('paperView');
    return { text: v.innerText, html: v.innerHTML };
  });
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
  // 거래 0건이면 손익을 0원/0%로 만들어내지 않고 "아직 기록 전"이라고 말한다.
  check('거래 0건이면 현재 손익을 숫자로 만들어내지 않는다', /기록 전/.test(empty.text));
  check('시작자금은 실제 예치금이 아니라고 밝힌다', /실제로 예치한 돈이 아니에요/.test(empty.text));
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
    /첫 검증 신호를 기다리고 있습니다/.test(running.text)
    && /가상으로 보유 중인 종목이 아직 없어요/.test(running.text));

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
  check('진행 중 거래가 렌더된다', /우리금융지주/.test(withTrades.text)
    && /현재 보유 중/.test(withTrades.text) && /class="pv-pos-hd"/.test(withTrades.html));
  check('양수 수익률에 + 부호와 상승색', /\+4\.21%/.test(withTrades.text) && /pv-tret pv-up/.test(withTrades.html));
  check('음수 수익률에 − 부호와 하락색', /−2\.50%/.test(withTrades.text) && /pv-tret pv-dn/.test(withTrades.html));
  check('0% 수익률은 방향색 없이 표시', /0\.00%/.test(withTrades.text));
  check('수익률 없는 종료 거래는 0%가 아니라 기록 대기', /기록 대기/.test(withTrades.text));
  check('종목명이 없어도 코드로 렌더된다', /000005/.test(withTrades.text));
  check('청산 사유가 사람 말로 번역된다',
    /최대 보유기간 도달/.test(withTrades.text)
    && /GAEO 판단이 매도 고려로 변경/.test(withTrades.text)
    && !/MAX_HOLDING_5D|CHIEF_SELL/.test(withTrades.text));
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

  // ── ⑥ 현재 보유 중 — 이 화면의 핵심. 무슨 종목을 몇 주, 얼마에, 지금 얼마인지. ──
  const OPEN_ONE = {
    ...BASELINE, stage: 'RUNNING', openTrades: 1, closedTrades: 0, executedTradeCount: 1,
    maxHoldingTradingDays: 5, lastCycleOk: true, currentVirtualEquity: 10010400,
    unrealizedPnl: 10400, portfolioReturnPct: 0.1,
    recentTrades: [{
      status: 'OPEN', symbol: '005930', name: '삼성전자', entry_price: 72300, quantity: 13,
      entry_business_date: '2026-08-18', cost_basis: 939900, current_price: 73100,
      market_value: 950300, unrealized_pnl: 10400, unrealized_return_pct: 1.11,
      holding_trading_days: 2, remaining_trading_days: 3
    }]
  };
  const one = await renderWith(page, OPEN_ONE);
  check('보유 종목 섹션이 존재한다', one.text.includes('현재 보유 중'));
  check('종목명 표시', one.text.includes('삼성전자'));
  const oneOpen = await expandAll(page);
  check('종목코드 표시(상세)', oneOpen.text.includes('005930'));
  check('수량 표시', one.text.includes('13주'));
  check('매수가 표시', one.text.includes('72,300원'));
  check('현재가 표시', one.text.includes('73,100원'));
  check('투자금액 표시(상세)', oneOpen.text.includes('939,900원'));
  check('평가금액 표시', one.text.includes('950,300원'));
  check('가상 손익금액 표시', one.text.includes('10,400원'));
  check('가상 수익률 표시', one.text.includes('+1.11%'));
  check('보유 거래일 표시(상세)', oneOpen.text.includes('2거래일 경과'));
  check('최대 보유기간 표시', one.text.includes('최대 5거래일'));
  check('남은 최대 보유일 정확(상세)', oneOpen.text.includes('3거래일'));
  check('종료 조건 설명(상세)', oneOpen.text.includes('종료 조건')
    && oneOpen.text.includes('매도 고려'));
  check('양수 수익률 방향색(상승)', /pv-pos-r pv-up/.test(one.html));
  check('수익률이 종목명 바로 옆에 있다',
    /삼성전자<em class="pv-pos-r[^"]*">\+1\.11%<\/em>/.test(one.html));
  check('손익금액이 요약 줄의 보조 정보다',
    /pv-pos-pl[^>]*>\+10,400원/.test(one.html));
  check('오른쪽 끝 수익률 블록(pv-pos-ret)이 사라졌다', !one.html.includes('pv-pos-ret'));
  check('보유 섹션이 종료 거래 섹션보다 먼저 나온다',
    one.html.indexOf('pvHoldH') >= 0 && (one.html.indexOf('pvClosedH') < 0
      || one.html.indexOf('pvHoldH') < one.html.indexOf('pvClosedH')));
  // 진입 당일은 "0거래일째"가 아니라 "오늘 진입"으로 읽힌다(표시 문구만 — 규칙은 불변)
  const day0 = await renderWith(page, { ...OPEN_ONE, recentTrades: [
    { ...OPEN_ONE.recentTrades[0], holding_trading_days: 0, remaining_trading_days: 5 }] });
  const day0Open = await expandAll(page);
  check('진입 당일은 "오늘 진입"으로 표시(상세)', day0Open.text.includes('오늘 진입'));
  check('진입 당일에 "0거래일째"라고 쓰지 않는다', !/0거래일/.test(day0Open.text));
  check('진입 당일에도 최대 보유기간은 그대로 표시', day0Open.text.includes('5거래일'));

  // ── ⑥-2 포트폴리오 전체 시야 — "1,000만원 중 얼마가 들어가 있나"를 바로 답하는가 ──
  const PORT = {
    ...OPEN_ONE, openTrades: 10, executedTradeCount: 10,
    initialVirtualCash: 10000000, currentVirtualEquity: 9994300,
    investedCostBasis: 9663055, availableVirtualCash: 336945,
    markedPositionsValue: 9657355, unrealizedPnl: -5700, realizedPnl: 0,
    portfolioReturnPct: -0.057, allocationInvestedPct: 96.6, allocationCashPct: 3.4,
    valuationStatus: 'MARKED', valuationObservedAt: '2026-08-18T11:05:14+09:00',
    lastCycleAt: '2026-08-18T11:05:14+09:00', positionSizeKrw: 1000000,
    skippedInsufficientCash: 7, skippedPriceAbovePositionSize: 0,
    skippedMarketDataUnavailable: 0
  };
  const port = await renderWith(page, PORT);
  check('P1. 현재 가상자산 표시', port.text.includes('9,994,300원'));
  check('P2. 현재 투자원금 표시', port.text.includes('9,663,055원'));
  check('P3. 남은 가상현금 표시', port.text.includes('336,945원'));
  check('P4. 보유 평가금액 표시', port.text.includes('9,657,355원'));
  check('P5. 현재 손익 금액·수익률 표시',
    port.text.includes('5,700원') && port.text.includes('0.06%'));
  check('P6. 투자/현금 비중 표시', port.text.includes('96.6%') && port.text.includes('3.4%'));
  check('P7. 자산구성 띠가 실제 비중대로 그려진다',
    /pv-alloc-bar[\s\S]{0,120}width:96\.6%/.test(port.html));
  check('P8. 현재 가상자산의 뜻을 설명한다',
    port.text.includes('가상현금 + 보유종목 현재 평가액'));
  check('P9. 평가 기준 시각을 상단에 한 번 표시', port.text.includes('11:05 기준'));
  check('P10. 시작자금이 실제 예치금이 아님을 밝힌다',
    port.text.includes('실제로 예치한 돈이 아니에요'));
  check('P11. 손익 방향색(하락)이 부호와 함께 쓰인다',
    /pv-port-pv[^"]*pv-dn/.test(port.html) && port.text.includes('−5,700원'));
  // 종료 거래가 0건이면 '확정 손익' 칸을 띄우지 않는다 → 기존 4칸보다 오히려 줄어든다.
  // ('확정 손익'은 아래 「검증 상태」 목록에도 나오므로 상단 띠 안만 따로 본다)
  const bandOf = html => (html.match(/<div class="pv-summary[^"]*">([\s\S]*?)<\/div><\/div>/) || [])[0] || '';
  check('P12. 상단 카드가 늘지 않고 오히려 줄었다(종료 0건 → 2칸)',
    /pv-summary pv-summary-2/.test(port.html) && !bandOf(port.html).includes('확정 손익'));
  const withClosed = await renderWith(page, { ...PORT, closedTrades: 3, realizedPnl: 41000 });
  check('P12b. 종료 거래가 생기면 확정 손익 칸이 나타난다(3칸)',
    /pv-summary pv-summary-3/.test(withClosed.html) && withClosed.text.includes('확정 손익'));
  check('P12c. 확정 손익 금액이 정확히 표시된다', withClosed.text.includes('+41,000원'));
  // 건너뛴 신호 설명은 메인 화면이 아니라 「상세 정보」 펼침 안에만 있어야 한다.
  check('P13. 자금 부족으로 진입하지 않은 신호를 쉬운 말로 설명',
    port.html.includes('가상 투자 여력이 부족해 진입하지 않은 신호'));
  check('P14. 건너뛴 신호를 시스템 장애처럼 말하지 않는다',
    port.html.includes('기록이 잘못된 게 아닙니다'));
  check('P14b. 건너뛴 신호 설명이 접힌 상세 안에 있다(메인 화면에 크게 띄우지 않음)',
    !port.text.includes('가상 투자 여력이 부족해 진입하지 않은 신호')
    && port.html.indexOf('pv-skip') > port.html.indexOf('<details'));
  check('P15. 내부 상태 코드(SKIPPED_*)를 화면에 노출하지 않는다',
    !/SKIPPED_/.test(port.html));
  check('P16. 개발자 필드명을 화면에 노출하지 않는다',
    !/cost_basis|market_value|unrealized_pnl|realized_pnl|valuationStatus|investedCostBasis|availableVirtualCash|markedPositionsValue/.test(port.text));
  check("P17. '순수익'·'순이익' 표현을 쓰지 않는다", !/순수익|순이익|실제 수익/.test(port.text));
  check('P18. 수수료·세금 미반영을 고지한다',
    port.text.includes('수수료') && port.text.includes('세금'));

  // 시세 일부 누락 → 부분합을 전체 평가금액처럼 보여주지 않는다(fail closed)
  const PART = { ...PORT, currentVirtualEquity: null, markedPositionsValue: null,
    unrealizedPnl: null, portfolioReturnPct: null, allocationInvestedPct: null,
    allocationCashPct: null, valuationStatus: 'VALUATION_UNAVAILABLE' };
  const part = await renderWith(page, PART);
  check('P19. 일부 시세 누락 시 전체 평가금액을 부분합으로 채우지 않는다',
    !part.text.includes('9,657,355원'));
  check('P20. 일부 시세 누락 시 현재 손익을 지어내지 않는다',
    part.text.includes('평가 대기') && !part.text.includes('−5,700원'));
  check('P21. 일부 시세 누락 시 자산구성 띠를 그리지 않는다',
    !/pv-alloc-bar/.test(part.html));
  check('P22. 일부 시세 누락이어도 투자원금·가상현금은 계속 보여준다',
    part.text.includes('9,663,055원') && part.text.includes('336,945원'));

  // ── ⑥-3 표시용 현재가 신선화 — data.js가 러너 mark보다 신선하면 화면 값만 재평가 ──
  /* ⚠️ 날짜를 하드코딩하지 않는다. 화면은 관측일이 "오늘"이 아니면 기준시각 앞에 날짜를
     붙인다(어제 시세를 오늘 것처럼 보이지 않게 하는 안전장치). 픽스처 날짜를 고정하면
     그 날이 지나는 순간 L4·L5가 실패한다 — 실제로 2026-08-19에 그렇게 깨졌다.
     그래서 "오늘(KST)"을 매번 계산해서 픽스처에 넣고, 같은 날 동작을 검사한다. */
  const TODAY_KST = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  const LIVE_BASE = {
    ...BASELINE, stage: 'RUNNING', openTrades: 2, closedTrades: 0, executedTradeCount: 2,
    maxHoldingTradingDays: 5, lastCycleOk: true, lastCycleAt: `${TODAY_KST}T11:05:14+09:00`,
    initialVirtualCash: 10000000,
    investedCostBasis: 1939900, availableVirtualCash: 8060100,
    markedPositionsValue: 1923000, currentVirtualEquity: 9983100,
    unrealizedPnl: -16900, realizedPnl: 0, portfolioReturnPct: -0.169,
    allocationInvestedPct: 19.3, allocationCashPct: 80.7,
    valuationStatus: 'MARKED', valuationObservedAt: `${TODAY_KST}T11:05:14+09:00`,
    positionSizeKrw: 1000000,
    recentTrades: [
      { status: 'OPEN', symbol: '005930', name: '삼성전자', entry_price: 72300, quantity: 13,
        cost_basis: 939900, current_price: 71000, market_value: 923000, unrealized_pnl: -16900,
        unrealized_return_pct: -1.8, holding_trading_days: 1, remaining_trading_days: 4 },
      { status: 'OPEN', symbol: '000660', name: 'SK하이닉스', entry_price: 200000, quantity: 5,
        cost_basis: 1000000, current_price: 200000, market_value: 1000000, unrealized_pnl: 0,
        unrealized_return_pct: 0, holding_trading_days: 1, remaining_trading_days: 4 }
    ]
  };
  const LIVE_OK = { date: `${TODAY_KST} 11:46 장중`, stocks: {
    '005930': { price: 74000, stale: false }, '000660': { price: 199000, stale: false } } };

  const lv = await renderWith(page, LIVE_BASE, LIVE_OK);
  check('L1. 더 신선한 시세로 행 현재가가 갱신된다', lv.text.includes('74,000원'));
  check('L2. 행 평가금액·수익률·손익도 같은 가격으로 재계산',
    lv.text.includes('962,000원') && lv.text.includes('+2.35%') && lv.text.includes('+22,100원'));
  check('L3. 총계도 같은 가격 세트로 재계산(행·합계 소스 단일)',
    lv.text.includes('10,017,100원') && lv.text.includes('1,957,000원')
    && lv.text.includes('+17,100원'));
  check('L4. 기준시각이 실제 관측 시각(11:46)으로 표시', lv.text.includes('11:46 기준'));
  check('L5. 보유 섹션 머리에 현재가 기준 시각 1회 표시',
    lv.text.includes('현재가 기준 11:46')
    && (lv.text.match(/현재가 기준/g) || []).length === 1);
  check("L6. '실시간'이라고 쓰지 않는다", !lv.text.includes('실시간'));

  // 신선하지 않으면(더 오래된 live) 러너 mark 값 그대로
  const lvOld = await renderWith(page, LIVE_BASE,
    { date: '2026-08-18 10:00 장중', stocks: LIVE_OK.stocks });
  check('L7. live가 mark보다 오래되면 엔진 값 유지',
    lvOld.text.includes('71,000원') && lvOld.text.includes('9,983,100원')
    && lvOld.text.includes('11:05 기준') && !lvOld.text.includes('74,000원'));

  // 한 종목이라도 없으면 전체 폴백 — 행은 신선, 합계는 낡은 "섞인 화면" 금지
  const lvMiss = await renderWith(page, LIVE_BASE,
    { date: '2026-08-18 11:46 장중', stocks: { '005930': { price: 74000, stale: false } } });
  check('L8. live에 한 종목 누락 → 전부 엔진 값(부분 혼합 금지)',
    lvMiss.text.includes('71,000원') && !lvMiss.text.includes('74,000원')
    && lvMiss.text.includes('9,983,100원'));

  // stale 종목이 있으면 그 세트를 신선한 것처럼 쓰지 않는다
  const lvStale = await renderWith(page, LIVE_BASE,
    { date: '2026-08-18 11:46 장중', stocks: {
      '005930': { price: 74000, stale: false }, '000660': { price: 199000, stale: true } } });
  check('L9. stale 종목 포함 → 전부 엔진 값(오래된 가격을 최신처럼 쓰지 않음)',
    lvStale.text.includes('71,000원') && !lvStale.text.includes('74,000원'));

  // 러너가 평가 불가(fail closed)여도 live가 전 종목을 덮으면 표시는 복구된다
  const lvRecover = await renderWith(page, { ...LIVE_BASE,
    markedPositionsValue: null, currentVirtualEquity: null, unrealizedPnl: null,
    portfolioReturnPct: null, allocationInvestedPct: null, allocationCashPct: null,
    valuationStatus: 'VALUATION_UNAVAILABLE', valuationObservedAt: null,
    recentTrades: LIVE_BASE.recentTrades.map(r => ({ ...r,
      current_price: undefined, market_value: undefined,
      unrealized_pnl: undefined, unrealized_return_pct: undefined })) }, LIVE_OK);
  check('L10. 러너 평가 불가 상태여도 완전한 live 세트로 표시 복구',
    lvRecover.text.includes('10,017,100원') && lvRecover.text.includes('74,000원'));

  // 여러 건 + 음수 + 0% + null + 현재가 없음 + 긴 종목명
  const OPEN_MANY = {
    ...BASELINE, stage: 'RUNNING', openTrades: 4, closedTrades: 1, executedTradeCount: 5,
    maxHoldingTradingDays: 5, lastCycleOk: true,
    recentTrades: [
      { status: 'OPEN', symbol: '005930', name: '삼성전자', entry_price: 72300, quantity: 13,
        cost_basis: 939900, current_price: 71000, market_value: 923000, unrealized_pnl: -16900,
        unrealized_return_pct: -1.8, holding_trading_days: 4, remaining_trading_days: 1 },
      { status: 'OPEN', symbol: '373220', name: '엘지에너지솔루션우선주디알테스트종목명',
        entry_price: 400000, quantity: 2, cost_basis: 800000, current_price: 400000,
        market_value: 800000, unrealized_pnl: 0, unrealized_return_pct: 0,
        holding_trading_days: 1, remaining_trading_days: 4 },
      { status: 'OPEN', symbol: '000660', name: 'SK하이닉스', entry_price: 200000, quantity: 5,
        cost_basis: 1000000, holding_trading_days: 0, remaining_trading_days: 5 },
      { status: 'OPEN', symbol: '035420', name: 'NAVER', entry_price: 200000, quantity: 5,
        cost_basis: 1000000, current_price: 210000, market_value: 1050000,
        unrealized_pnl: 50000, unrealized_return_pct: 5 },
      { status: 'CLOSED', symbol: '005380', name: '현대차', entry_price: 244000, exit_price: 259500,
        quantity: 4, exit_reason: 'CHIEF_SELL', holding_trading_days: 9, gross_return_pct: 6.35,
        cost_basis: 976000, realized_pnl: 62000 }
    ]
  };
  const many = await renderWith(page, OPEN_MANY);
  check('보유 여러 건 렌더', (many.html.match(/class="pv-pos"/g) || []).length === 4);
  check('음수 수익률 방향색(하락)', /pv-pos-r pv-dn/.test(many.html));
  check('0% 수익률은 방향색 없이 표시', many.text.includes('0.00%'));
  const manyOpen = await expandAll(page);
  check('현재가 없으면 지어내지 않고 안내(상세)',
    manyOpen.text.includes('현재가를 아직 받지 못해'));
  check('현재가 없는 종목에 가짜 평가금액 0원 없음', !manyOpen.text.includes('평가금액\n0원'));
  check('보유일 정보 없어도 렌더 유지(null 허용)', many.text.includes('NAVER'));
  check('긴 종목명 렌더', many.text.includes('엘지에너지솔루션우선주디알테스트종목명'));

  // ── ⑦ 종료 거래는 보유와 분리 ─────────────────────────────────────────────
  check('종료 거래 섹션 분리', many.text.includes('최근 종료 거래'));
  check('종료 거래 렌더', many.text.includes('현대차'));
  check('종료 사유를 한국어로 변환', many.text.includes('GAEO 판단이 매도 고려로 변경'));
  check('종료 사유 raw enum 미노출', !many.text.includes('CHIEF_SELL') && !many.text.includes('MAX_HOLDING_5D'));
  check('확정 손익 표시', many.text.includes('62,000원'));

  // ── ⑧ 개발자 용어가 사용자 화면에 노출되지 않는다 ─────────────────────────
  for (const raw of ['PAPER_BASELINE_V1', 'BASELINE_ONLY', 'COST_MODEL_INCOMPLETE',
                     'INSUFFICIENT_EVIDENCE', 'Forward', 'schemaVersion', 'lastCycleAt',
                     'engineStartedAt', 'RUNNING']) {
    check(`개발자 용어 미노출: ${raw}`, !many.text.includes(raw) && !one.text.includes(raw));
  }
  // ⚠️ MFI(Money Flow Index)는 전혀 다른 지표 — MFE와 혼동해서 쓰면 안 된다.
  check('MFI/MFE 혼동 없음', !many.text.includes('MFI'));
  check('전문 지표는 한국어를 먼저 쓴다',
    many.text.includes('최대 낙폭') && many.text.includes('보유 중 최고 상승폭')
    && many.text.includes('보유 중 최대 하락폭'));
  check('MDD/MFE/MAE 설명이 펼침 안에 있다',
    many.html.includes('이전 최고점') && many.html.includes('가장 많이 올랐던')
    && many.html.includes('가장 많이 내렸던'));
  check('자동 기록 상태 줄 표시', one.text.includes('자동 기록 진행 중'));
  /* 문구를 그대로 박아 검사하지 않고 "정상이라 단정하지 않는가"라는 계약 자체를 본다. */
  const unconfirmed = (await renderWith(page, { ...OPEN_ONE, lastCycleOk: null })).text;
  check('사이클 성공 미확인이면 정상이라 단정하지 않음',
    !unconfirmed.includes('자동 기록 진행 중') && unconfirmed.includes('최근 시도'));

  /* 🐛 2026-08-19 회귀 방지: 시세 연결이 끊긴 사유 안내가 "보유 0건"일 때만 나오는
     빈 상태 문구 안에만 있어서, 보유 종목이 하나라도 있으면 화면 어디에도 표시되지
     않던 버그. 사용자는 어제 숫자만 보며 왜 오늘 기록이 없는지 알 수 없었다.
     ⚠️ 반드시 보유가 있는 픽스처(OPEN_ONE)로 검사한다 — 보유 0건으로 검사하면
        예전 코드도 통과해 버려서 이 버그를 다시 놓친다. */
  const stalled = (await renderWith(page,
    { ...OPEN_ONE, lastCycleOk: false, stage: 'AWAITING_MARKET_DATA' })).text;
  check('시세 중단 시 보유 종목이 있어도 사유가 보인다',
    stalled.includes('시세 연결이 끊겨') && stalled.includes('가격을 추측해서 기록하지 않아요'));
  check('시세 중단 시 기록이 남은 것처럼 말하지 않는다',
    !stalled.includes('자동 기록 진행 중') && stalled.includes('마지막 시도'));

  await renderWith(page, OPEN_MANY);
  for (const width of [1440, 1280, 430, 390, 360]) {

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

  // ── ⑨ Compact 보유 목록 + 눌러서 펼치기 (Progressive Disclosure) ─────────
  const COMPACT = {
    ...BASELINE, stage: 'RUNNING', openTrades: 3, closedTrades: 0, executedTradeCount: 3,
    maxHoldingTradingDays: 5, lastCycleOk: true, lastCycleAt: '2026-08-18T13:05:00+09:00',
    valuationObservedAt: '2026-08-18T13:05:00+09:00', valuationStatus: 'MARKED',
    initialVirtualCash: 10000000, investedCostBasis: 2939900, availableVirtualCash: 7060100,
    markedPositionsValue: 2960300, currentVirtualEquity: 10020400, unrealizedPnl: 20400,
    realizedPnl: 0, portfolioReturnPct: 0.204, allocationInvestedPct: 29.5,
    allocationCashPct: 70.5,
    recentTrades: [
      { status: 'OPEN', symbol: '005930', name: '삼성전자', entry_price: 72300, quantity: 13,
        cost_basis: 939900, current_price: 73100, market_value: 950300, unrealized_pnl: 10400,
        unrealized_return_pct: 1.11, holding_trading_days: 0, remaining_trading_days: 5,
        entry_business_date: '2026-08-18', detected_at: '2026-08-18T10:05:00+09:00' },
      { status: 'OPEN', symbol: '011200', name: 'HMM', entry_price: 20000, quantity: 50,
        cost_basis: 1000000, current_price: 20000, market_value: 1000000, unrealized_pnl: 0,
        unrealized_return_pct: 0, holding_trading_days: 2, remaining_trading_days: 3,
        entry_business_date: '2026-08-14', detected_at: '2026-08-14T10:05:00+09:00' },
      { status: 'OPEN', symbol: '000660', name: '에스케이하이닉스우선주디알특별계정테스트',
        entry_price: 200000, quantity: 5, cost_basis: 1000000,
        holding_trading_days: 1, remaining_trading_days: 4, entry_business_date: '2026-08-15' }
    ]
  };
  const cmp = await renderWith(page, COMPACT);
  check('C1. 보유 종목이 compact 목록으로 나온다',
    (cmp.html.match(/class="pv-pos-hd"/g) || []).length === 3);
  check('C2. compact에 종목명·수익률·수량·현재가·평가금액·손익이 보인다',
    cmp.text.includes('삼성전자') && cmp.text.includes('+1.11%') && cmp.text.includes('13주')
    && cmp.text.includes('현재가 73,100원') && cmp.text.includes('950,300원')
    && cmp.text.includes('+10,400원'));
  check('C3. 기본은 모두 접혀 있다',
    !/aria-expanded="true"/.test(cmp.html)
    && (cmp.html.match(/class="pv-pos-body"[^>]*hidden/g) || []).length === 3);
  check('C4. 종목코드는 상세 안에만 있다(첫 화면 아님)', !cmp.text.includes('005930'));
  check('C5. 현재가 없는 종목도 목록이 깨지지 않는다',
    cmp.text.includes('에스케이하이닉스우선주디알특별계정테스트') && cmp.text.includes('평가 대기'));

  const expandOne = await page.evaluate(() => {
    const btn = document.querySelectorAll('.pv-pos-hd')[0];
    btn.click();
    const body = document.getElementById(btn.getAttribute('aria-controls'));
    return { aria: btn.getAttribute('aria-expanded'), shown: !body.hidden, text: body.innerText };
  });
  check('C6. 누르면 펼쳐지고 aria-expanded가 바뀐다',
    expandOne.aria === 'true' && expandOne.shown);
  check('C7. 상세에 기존 정보가 그대로 있다',
    ['종목코드', '매수가', '현재가', '수량', '투자원금', '평가금액', '가상 손익', '수익률',
     '진입일', '진입시각', '보유기간', '남은 최대 보유', '종료 조건', '현재가 기준']
      .every(k => expandOne.text.includes(k)), expandOne.text.slice(0, 200));
  check('C8. 상세에 종목코드가 표시된다', expandOne.text.includes('005930'));
  check('C9. 진입 당일은 "오늘 진입"으로 읽힌다', expandOne.text.includes('오늘 진입'));

  const collapsed = await page.evaluate(() => {
    const btn = document.querySelectorAll('.pv-pos-hd')[0];
    btn.click();
    return { aria: btn.getAttribute('aria-expanded'),
             hidden: document.getElementById(btn.getAttribute('aria-controls')).hidden };
  });
  check('C10. 다시 누르면 닫힌다', collapsed.aria === 'false' && collapsed.hidden);

  const kbd = await page.evaluate(() => {
    const btn = document.querySelectorAll('.pv-pos-hd')[1];
    btn.focus();
    const focused = document.activeElement === btn;
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    btn.click();                                   // 브라우저 기본 동작과 동일
    return { focused, aria: btn.getAttribute('aria-expanded') };
  });
  check('C11. 키보드 포커스를 받고 Enter로 열린다', kbd.focused && kbd.aria === 'true');

  // 자동 재조회(2분)로 다시 그려도 펼쳐 둔 종목이 닫히지 않는다
  const afterRerender = await page.evaluate(() => {
    window.renderPaper();
    const btns = [...document.querySelectorAll('.pv-pos-hd')];
    return btns.map(b => b.getAttribute('aria-expanded'));
  });
  check('C12. 재렌더 후에도 펼침 상태가 유지된다',
    afterRerender[1] === 'true' && afterRerender[0] === 'false',
    JSON.stringify(afterRerender));
  const fastTap = await page.evaluate(() => {
    const btn = document.querySelectorAll('.pv-pos-hd')[2];
    for (let i = 0; i < 7; i++) btn.click();       // 연타 + 중간 재렌더
    window.renderPaper();
    const again = document.querySelectorAll('.pv-pos-hd')[2];
    return { aria: again.getAttribute('aria-expanded'),
             hidden: document.getElementById(again.getAttribute('aria-controls')).hidden };
  });
  check('C13. 연타/재렌더 경합에도 상태가 어긋나지 않는다',
    (fastTap.aria === 'true') === (fastTap.hidden === false), JSON.stringify(fastTap));

  // ── ⑩ 오늘 거래 ─────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  const mkTrades = (buys, sells) => ({
    ...COMPACT, openTrades: buys.length, closedTrades: sells.length,
    recentTrades: [
      ...buys.map((b, i) => ({
        status: 'OPEN', symbol: '10000' + i, name: b, entry_price: 1000 * (i + 1),
        quantity: 10, cost_basis: 10000, current_price: 1000 * (i + 1),
        market_value: 10000, unrealized_pnl: 0, unrealized_return_pct: 0,
        entry_business_date: today, detected_at: today + 'T10:05:00+09:00',
        holding_trading_days: 0, remaining_trading_days: 5 })),
      ...sells.map((x, i) => ({
        status: 'CLOSED', symbol: '20000' + i, name: x, entry_price: 1000, exit_price: 1100,
        quantity: 10, exit_business_date: today, exit_reason: 'CHIEF_SELL',
        holding_trading_days: 3, gross_return_pct: 10, realized_pnl: 1000 }))
    ]
  });
  const none = await renderWith(page, { ...COMPACT, recentTrades: [
    { status: 'OPEN', symbol: '005930', name: '어제산종목', entry_price: 100, quantity: 1,
      cost_basis: 100, current_price: 100, market_value: 100, unrealized_pnl: 0,
      unrealized_return_pct: 0, entry_business_date: '2026-01-02',
      holding_trading_days: 3, remaining_trading_days: 2 }], openTrades: 1, closedTrades: 0 });
  check('T1. 오늘 거래 섹션이 존재한다', none.text.includes('오늘 거래'));
  check('T2. 매수 0·매도 0을 오류가 아니라 문장으로 말한다',
    none.text.includes('오늘 새로 가상 매수한 종목이 없어요')
    && none.text.includes('오늘 종료된 거래가 없어요'));
  check('T3. 어제 산 보유 종목을 오늘 매수로 세지 않는다',
    /오늘 거래[\s\S]{0,40}매수 0 · 매도 0/.test(none.text), none.text.slice(0, 200));

  const b1 = await renderWith(page, mkTrades(['가나다전자'], []));
  check('T4. 오늘 매수 1건이 집계·표시된다',
    /매수 1 · 매도 0/.test(b1.text) && b1.text.includes('가나다전자'));
  const bMany = await renderWith(page, mkTrades(
    ['가전자', '나전자', '다전자', '라전자', '마전자', '바전자', '사전자'], []));
  check('T5. 매수가 많으면 이름을 다 늘어놓지 않고 "외 N종목"으로 줄인다',
    /매수 7 · 매도 0/.test(bMany.text) && bMany.text.includes('외 3종목'));
  check('T6. 전체 보기로 펼칠 수 있다', bMany.html.includes('전체 보기'));
  const s1 = await renderWith(page, mkTrades([], ['판다전자']));
  check('T7. 오늘 매도 1건이 상세와 함께 표시된다',
    /매수 0 · 매도 1/.test(s1.text) && s1.text.includes('판다전자')
    && s1.text.includes('1,000원 → 1,100원') && s1.text.includes('+10.00%')
    && s1.text.includes('보유 3거래일') && s1.text.includes('GAEO 판단이 매도 고려로 변경'));
  check('T8. 매도 표시에 내부 사유 코드가 없다', !/CHIEF_SELL|MAX_HOLDING/.test(s1.html));
  const both = await renderWith(page, mkTrades(['산종목'], ['판종목', '또판종목']));
  check('T9. 같은 날 매수·매도가 함께 집계된다',
    /매수 1 · 매도 2/.test(both.text) && both.text.includes('산종목')
    && both.text.includes('또판종목'));

  // ── ⑪ 기록(History) 화면 ────────────────────────────────────────────────
  const HIST = {
    schemaVersion: 'gaeo_paper_history_v1', reviewVersion: 'paper_review_v1',
    initialVirtualCash: 10000000, maxHoldingTradingDays: 5,
    days: [
      { date: '2026-08-19', lastRecordAt: '12:35', inProgress: true, equity: 9941190,
        cash: 336945, investedCostBasis: 9663055, markedPositionsValue: 9604245,
        realizedPnl: 0, unrealizedPnl: -58810, openCount: 10,
        cumulativeReturnPct: -0.59, dailyChangePct: -0.12, marketChangePct: -0.4,
        buyCount: 0, sellCount: 1,
        buys: [],
        sells: [{ symbol: '072710', name: '농심홀딩스', quantity: 10, entryPrice: 93700,
          exitPrice: 96000, realizedPnl: 23000, returnPct: 2.45, holdingTradingDays: 3,
          exitReason: 'GAEO 판단이 「매도 고려」로 변경', exitAt: '11:20' }],
        skipped: [{ reason: '가상 투자 여력 부족', count: 2 }],
        contributions: [{ symbol: 'A', name: '가전자', pnl: 5000, returnPct: 1.2 }],
        review: { version: 'paper_review_v1', inProgress: true, headline: '가상자산 -0.59%',
          sections: [{ key: 'result', title: '결과',
            lines: [{ text: '가상자산 9,941,190원 · 시작자금 대비 -0.59%', fact: 'markedEquity' }] },
            { key: 'impact', title: '주요 영향',
              lines: [{ text: '가전자 +1.20%가 가장 크게 만회했습니다.', fact: 'largestContributor' }] }] } },
      { date: '2026-08-18', lastRecordAt: '15:05', inProgress: false, equity: 9934850,
        cash: 336945, investedCostBasis: 9663055, markedPositionsValue: 9597905,
        realizedPnl: 0, unrealizedPnl: -65150, openCount: 10,
        cumulativeReturnPct: -0.65, dailyChangePct: null, marketChangePct: null,
        buyCount: 2, sellCount: 0,
        buys: [{ symbol: '072710', name: '농심홀딩스', quantity: 10, entryPrice: 93700,
          entryAt: '11:05', costBasis: 937000 },
          { symbol: '034120', name: 'SBS', quantity: 78, entryPrice: 12660,
            entryAt: '11:05', costBasis: 987480 }],
        sells: [], skipped: [], contributions: null,
        review: { version: 'paper_review_v1', inProgress: false, headline: '가상자산 -0.65%',
          sections: [{ key: 'result', title: '결과',
            lines: [{ text: '이전 기록일이 없어 일간 변화는 비교하지 않았습니다.',
              fact: 'noPreviousRecord' }] }] } }
    ],
    strategy: { buckets: [
      { key: 'same_day', label: '당일형', desc: '진입한 날 바로 종료', tradeCount: 0,
        enough: false, avgReturnPct: null, winRatePct: null },
      { key: 'swing', label: '스윙', desc: '3~5거래일 보유', tradeCount: 3, enough: false,
        avgReturnPct: 1.4, winRatePct: 66.7 }],
      totalClosed: 3, minSample: 20, enough: false, otherCount: 0,
      unsupported: [{ label: '중기' }, { label: '장기' }],
      note: '현재 검증 중인 전략은 한 종목을 최대 5거래일까지만 보유합니다.' }
  };
  const showHistory = async (payload, day) => page.evaluate(({ h, d }) => {
    window.PV_HISTORY_SET(h);
    PV_VIEW = 'history'; PV_DAY = d || null;
    window.renderPaper();
    const v = document.getElementById('paperView');
    return { text: v.innerText, html: v.innerHTML };
  }, { h: payload, d: day });

  const hist = await showHistory(HIST, null);
  check('H1. 기록 탭이 날짜 목록을 보여준다',
    hist.text.includes('8월 19일 모의투자 기록') && hist.text.includes('8월 18일 모의투자 기록'));
  check('H2. 최근 날짜가 위', hist.text.indexOf('8월 19일') < hist.text.indexOf('8월 18일'));
  check('H3. 월별로 묶인다', hist.text.includes('2026년 8월'));
  check('H4. 목록에 자산·성과·거래수·마지막 기록시각이 있다',
    hist.text.includes('9,941,190원') && hist.text.includes('−0.59%')
    && hist.text.includes('매수 0 · 매도 1 · 보유 10') && hist.text.includes('마지막 기록 12:35'));
  check('H5. 오늘은 진행 중으로 표시', hist.text.includes('진행 중'));
  check('H6. 전략 인사이트가 함께 있다', hist.text.includes('전략 인사이트'));
  check('H7. 표본 부족이면 우승 전략을 선언하지 않는다',
    hist.text.includes('최소 20건이 필요') && !/최고|가장 좋은 전략|우수 전략/.test(hist.text));
  check('H8. 표본 없는 구간은 "기록 축적 중"', hist.text.includes('기록 축적 중'));
  check('H9. 미지원 구간을 실행 중 전략처럼 보여주지 않는다',
    hist.text.includes('아직 검증 대상이 아닌 구간'));
  check('H10. 분석이 매매 규칙을 자동 변경하지 않는다고 밝힌다',
    hist.text.includes('자동으로 바뀌지 않습니다'));

  const det = await showHistory(HIST, '2026-08-18');
  check('H11. 날짜를 열면 그날 상세가 나온다', det.text.includes('8월 18일 모의투자 기록'));
  check('H12. 상세에 자산·현금·투자원금·평가금액·손익·누적·일간이 있다',
    ['가상자산', '가상현금', '투자원금', '평가금액', '보유 손익', '확정 손익', '누적 성과',
     '일간 변화', '마지막 기록'].every(k => det.text.includes(k)));
  check('H13. 첫 기록일의 일간 변화는 0%가 아니라 없음',
    det.text.includes('—(이전 기록일 없음)'));
  check('H14. 이날 매수한 종목이 수량·가격·시각과 함께 남는다',
    det.text.includes('이날 매수한 종목') && det.text.includes('농심홀딩스')
    && det.text.includes('10주 · 93,700원 · 11:05'));
  check('H15. 매도 0건이면 그 사실을 명시', det.text.includes('이날 종료된 거래가 없어요'));
  check('H16. 종료된 날은 "이날의 종합 평가"로 표시', det.text.includes('이날의 종합 평가'));
  check('H17. 평가 문장이 그대로 렌더된다',
    det.text.includes('이전 기록일이 없어 일간 변화는 비교하지 않았습니다'));
  check('H18. 근거 없는 시장 원인을 쓰지 않는다',
    det.text.includes('기록으로 증명할 수 없는 시장 원인')
    && !/외국인|금리|실적 발표|시장 심리/.test(det.text));
  const det19 = await showHistory(HIST, '2026-08-19');
  check('H19. 진행 중인 날은 "현재까지의 평가"로 표시',
    det19.text.includes('현재까지의 평가') && det19.text.includes('아직 확정된 결과가 아니에요'));
  check('H20. 이날 매도 종목이 손익·수익률·보유기간·사유와 함께 남는다',
    det19.text.includes('93,700원 → 96,000원') && det19.text.includes('+23,000원')
    && det19.text.includes('+2.45%') && det19.text.includes('보유 3거래일')
    && det19.text.includes('매도 고려'));
  check('H21. 진입하지 않은 신호를 쉬운 말로 남긴다',
    det19.text.includes('가상 투자 여력 부족 2건'));
  const back = await page.evaluate(() => {
    document.querySelector('.pv-back').click();
    return document.getElementById('paperView').innerText;
  });
  check('H22. 뒤로 누르면 목록으로 돌아온다',
    back.includes('8월 19일 모의투자 기록') && back.includes('8월 18일 모의투자 기록'));

  const histFail = await showHistory(null, null);
  check('H23. 기록을 못 불러와도 fail closed 문구만 나온다',
    histFail.text.includes('기록을 불러오지 못했습니다'));
  const stillOk = await renderWith(page, COMPACT);
  check('H24. 기록이 깨져도 보유 현황은 정상이다',
    stillOk.text.includes('삼성전자') && stillOk.text.includes('현재 보유 중'));
  const histEmpty = await showHistory({ ...HIST, days: [] }, null);
  check('H25. 기록이 비어 있으면 "아직 쌓인 기록이 없어요"',
    histEmpty.text.includes('아직 쌓인 기록이 없어요'));
  const histOld = await showHistory({ days: [{ date: '2026-08-18' }] }, null);
  check('H26. 옛 스키마(필드 없음)에도 깨지지 않는다',
    histOld.text.includes('8월 18일 모의투자 기록'));

  await renderWith(page, COMPACT);   // 뷰포트 측정 전 보유 현황으로 복귀

  check('JS 예외 없음', pageErrors.length === 0, pageErrors.join(' | '));

  await browser.close();
  console.log();
  if (failures.length) {
    console.log(`실패 ${failures.length}건: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('test_paper_ui_browser: 전체 통과');
})().catch(error => { console.error(error); process.exit(1); });
