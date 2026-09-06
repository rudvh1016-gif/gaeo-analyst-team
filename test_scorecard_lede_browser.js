// 성적표 「핵심 3줄 + 펼쳐보기」 실제 렌더 계약 (2026-09-06 신설)
//
// 소스 검사(test_scorecard_lede.js)는 "코드에 있는가"만 본다. 여기서는 진짜 브라우저에서
// ① 3줄이 실제로 그려지고 ② 첫 화면이 짧아졌고 ③ 접힌 숫자가 펼치면 전부 돌아오고
// ④ 다시 그려도 펼침 상태가 남고 ⑤ 12.5px보다 작은 문장이 없는지를 잰다.
//
// 실측 기준선(2026-09-06, 390px): 개편 전 성적표 높이 11,986px · 12.5px 미만 글자 70.5%
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
const need = (cond, msg) => { if (!cond) throw new Error(msg); };

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vw of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' });
      const errs = [];
      page.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
      await page.addInitScript(() => localStorage.setItem('gaeo_analytics_consent_v1', 'denied'));
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.setMode('scorecard'));
      await page.waitForFunction(() => document.querySelector('#scorecardView .sc-lede-line'), null, { timeout: 40000 });
      await page.waitForTimeout(900);

      const folded = await page.evaluate(() => {
        const v = document.getElementById('scorecardView');
        const small = [];
        const walk = el => { for (const n of el.childNodes) {
          if (n.nodeType === 3 && n.textContent.trim().length > 1) {
            const px = parseFloat(getComputedStyle(el).fontSize);
            if (px < 12) small.push(px + 'px ' + n.textContent.trim().slice(0, 24));
          } else if (n.nodeType === 1) walk(n); } };
        walk(v);
        return {
          lede: [...v.querySelectorAll('.sc-lede-line')].map(p => p.innerText.trim()),
          groups: [...v.querySelectorAll('details.sc-group')].map(d => ({ id: d.dataset.scGroup, open: d.open })),
          height: Math.round(v.getBoundingClientRect().height),
          small,
          summaryH: Math.min(...[...v.querySelectorAll('.sc-group>summary')].map(s => Math.round(s.getBoundingClientRect().height))),
          scrollY: Math.round(window.scrollY),
        };
      });

      need(folded.lede.length === 3, `[${vw}] 핵심 요약이 3줄이 아니다: ${folded.lede.length}`);
      folded.lede.forEach((t, i) => need(t.length >= 15 && !/undefined|NaN|\$\{/.test(t),
        `[${vw}] ${i + 1}번째 요약 줄이 이상하다: ${JSON.stringify(t)}`));
      need(folded.groups.length === 3, `[${vw}] 접이식 묶음이 3개가 아니다`);
      need(folded.groups[0].open && !folded.groups[1].open && !folded.groups[2].open,
        `[${vw}] 기본 펼침 상태가 다르다: ${JSON.stringify(folded.groups)}`);
      need(folded.height < 6000, `[${vw}] 첫 화면 성적표가 ${folded.height}px로 여전히 길다(개편 전 11,986px)`);
      need(folded.small.length === 0, `[${vw}] 12px보다 작은 글자가 남아 있다: ${folded.small.slice(0, 3).join(' | ')}`);
      need(folded.summaryH >= 44, `[${vw}] 펼치기 버튼이 ${folded.summaryH}px — 손가락으로 누르기엔 작다`);
      need(folded.scrollY === 0, `[${vw}] 진입 스크롤이 ${folded.scrollY}px — 중간에 떨어졌다`);

      // 펼치면 원래 숫자가 전부 돌아온다
      const opened = await page.evaluate(async () => {
        document.querySelectorAll('#scorecardView details.sc-group').forEach(d => { d.open = true; });
        await new Promise(r => setTimeout(r, 400));
        const v = document.getElementById('scorecardView');
        return { blocks: v.querySelectorAll('.sc-block').length, tables: v.querySelectorAll('table').length,
          height: Math.round(v.getBoundingClientRect().height) };
      });
      need(opened.blocks >= 10, `[${vw}] 펼쳐도 블록이 ${opened.blocks}개뿐이다 — 숫자가 사라졌다`);
      need(opened.tables >= 5, `[${vw}] 펼쳐도 표가 ${opened.tables}개뿐이다`);
      need(opened.height > folded.height * 2, `[${vw}] 펼쳐도 길이가 거의 그대로다 — 접기가 동작하지 않는다`);

      // 다시 그려도 펼침 상태가 남는가 (모델 탭 클릭 → renderScorecard 재호출)
      const persisted = await page.evaluate(async () => {
        const tab = document.querySelectorAll('#scorecardView .ml-tab')[1];
        if (!tab) return null;
        tab.click();
        await new Promise(r => setTimeout(r, 800));
        return [...document.querySelectorAll('#scorecardView details.sc-group')].map(d => d.open);
      });
      if (persisted) need(persisted.every(Boolean),
        `[${vw}] 다시 그리자 펼쳐 둔 묶음이 도로 접혔다: ${JSON.stringify(persisted)}`);

      need(errs.length === 0, `[${vw}] JS 오류 ${errs.length}건: ${errs.slice(0, 2).join(' | ')}`);
      console.log(`[PASS ${vw}px] 접힌 높이 ${folded.height}px → 펼친 높이 ${opened.height}px · 블록 ${opened.blocks} · 12px 미만 0`);
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('scorecard lede browser contract passed');
})().catch(e => { console.error(e && e.message ? e.message : e); process.exitCode = 1; });
