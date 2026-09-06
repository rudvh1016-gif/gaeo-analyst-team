// 제품 계측 이벤트 계약 (2026-09-06 신설) — 로컬 8877 정적 서버 + Chromium, CI에서는 돌지 않는다(playwright).
//
// 왜 있나
//   2026-09-06 계측 3개(entry_cluster·scorecard_view·visit_gap_bucket)를 넣으면서 검수(gaeo-qa)가
//   "딥링크 ?m=scorecard에서 scorecard_view가 2번 찍힌다"(라우터가 setMode를 두 번 부름)를 찾았다.
//   허용목록 단위 테스트(test_product_analytics.js)는 이런 호출 횟수 문제를 못 잡는다. 여기서는
//   동의 granted 상태의 dataLayer를 그대로 세어 "몇 번, 어떤 라벨로" 나가는지를 고정한다.
//
// 계약
//   ① 홈 BUY 행 → stock_analysis_open{entry_cluster:home_buy_list} 1회, stock_search_submit 0회
//   ② 검색창 → stock_search_submit 1회 + stock_analysis_open{entry_cluster:search} 1회
//   ③ 홈 성적표 링크 → scorecard_view{entry_cluster:home_note} 정확히 1회
//   ④ 딥링크 ?m=scorecard → scorecard_view{entry_cluster:deeplink} 정확히 1회
//   ⑤ 재방문 → return_visit에 visit_gap_bucket 포함
//   ⑥ 동의 denied → event 항목 0건, 마지막 방문 키(gaeo_product_analytics_last_v1)도 남기지 않음
const { chromium } = require('./test_playwright');

function requireState(condition, message) {
  if (!condition) throw new Error(message);
}
const BASE = 'http://127.0.0.1:8877/index.html';
const events = page => page.evaluate(() => (window.dataLayer || [])
  .map(a => Array.from(a)).filter(a => a[0] === 'event').map(a => [a[1], a[2] || {}]));
const count = (list, name) => list.filter(e => e[0] === name);

async function scorecardRendered(page) {
  await page.waitForFunction(() => {
    const v = document.getElementById('scorecardView');
    return v && v.classList.contains('on') && v.querySelectorAll('.sc-block').length >= 3;
  }, null, { timeout: 60000 });
  await page.waitForTimeout(600);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  // ⚠️ 단언이 실패해도 브라우저를 반드시 닫는다 — 안 닫으면 node가 살아 있어 CI·로컬에서 실패가
  //    "무한 대기"로 보이고 원인 메시지가 묻힌다(2026-09-06 실측으로 겪음).
  try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('gaeo_analytics_consent_v1', 'granted'); } catch (e) {} });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));

  // ① 홈 BUY 행
  await page.goto(BASE); await page.waitForLoadState('networkidle');
  let before = (await events(page)).length;
  const row = page.locator('.home-daily-brief .hdb-preview .hdb-stock-row').first();
  if (await row.count()) {
    await row.click();
    await page.waitForFunction(() => window.GaeoAnalysisReady === true, null, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(400);
    const got = (await events(page)).slice(before);
    const open = count(got, 'stock_analysis_open');
    requireState(open.length === 1 && open[0][1].entry_cluster === 'home_buy_list',
      'home BUY row must send one stock_analysis_open with entry_cluster=home_buy_list: ' + JSON.stringify(got));
    requireState(count(got, 'stock_search_submit').length === 0, 'home BUY row must not count as a search');
  }

  // ② 검색창 — 앞 분석이 끝나 검색 버튼이 다시 눌리는 상태가 될 때까지 기다린다(분석 중에는 disabled).
  await page.waitForFunction(() => { const r = document.getElementById('run'); return r && !r.disabled; }, null, { timeout: 60000 });
  before = (await events(page)).length;
  await page.evaluate(() => { document.getElementById('ticker').value = '삼성전자'; document.getElementById('run').click(); });
  await page.waitForFunction(() => { const r = document.getElementById('run'); return r && !r.disabled; }, null, { timeout: 60000 });
  await page.waitForTimeout(400);
  let got = (await events(page)).slice(before);
  requireState(count(got, 'stock_search_submit').length === 1, 'search must send one stock_search_submit: ' + JSON.stringify(got));
  const searchOpen = count(got, 'stock_analysis_open');
  requireState(searchOpen.length === 1 && searchOpen[0][1].entry_cluster === 'search', 'search must open with entry_cluster=search');

  // ③ 홈 성적표 링크
  await page.goto(BASE); await page.waitForLoadState('networkidle');
  before = (await events(page)).length;
  await page.locator('.home-daily-brief .hdb-score-link').click();
  await scorecardRendered(page);
  got = (await events(page)).slice(before);
  let views = count(got, 'scorecard_view');
  requireState(views.length === 1 && views[0][1].entry_cluster === 'home_note',
    'home link must send exactly one scorecard_view{home_note}: ' + JSON.stringify(views));

  // ④ 딥링크
  await page.goto(BASE + '?m=scorecard'); await scorecardRendered(page);
  views = count(await events(page), 'scorecard_view');
  requireState(views.length === 1 && views[0][1].entry_cluster === 'deeplink',
    'deep link must send exactly one scorecard_view{deeplink}: ' + JSON.stringify(views));

  // ⑤ 재방문 구간
  await page.goto(BASE); await page.waitForLoadState('networkidle');
  const returns = count(await events(page), 'return_visit');
  requireState(returns.length === 1 && typeof returns[0][1].visit_gap_bucket === 'string',
    'return visit must carry visit_gap_bucket: ' + JSON.stringify(returns));

  // ⑥ 동의 denied
  const denied = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await denied.addInitScript(() => { try { localStorage.setItem('gaeo_analytics_consent_v1', 'denied'); } catch (e) {} });
  const dpage = await denied.newPage();
  await dpage.goto(BASE); await dpage.waitForLoadState('networkidle');
  const drow = dpage.locator('.home-daily-brief .hdb-preview .hdb-stock-row').first();
  if (await drow.count()) { await drow.click(); await dpage.waitForTimeout(1500); }
  const deniedEvents = await events(dpage);
  requireState(deniedEvents.length === 0, 'denied consent must send no events: ' + JSON.stringify(deniedEvents));
  const lastKey = await dpage.evaluate(() => localStorage.getItem('gaeo_product_analytics_last_v1'));
  requireState(lastKey === null, 'denied consent must not store the last-visit key');

  requireState(pageErrors.length === 0, 'page errors: ' + pageErrors.join(' | '));
  } finally {
    await browser.close();
  }
  console.log('analytics events browser tests passed');
})().catch(error => {
  console.error(error && error.message ? error.message : error);
  process.exitCode = 1;
});
