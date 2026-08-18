/* 사이트 표준 글꼴(Wanted Sans) 계약 — 2026-08-18
 *
 * 왜 이 파일이 필요한가
 *   CSS에 글꼴 "이름"만 적어 두고 끝내면, 그 글꼴이 사용자 기기에 설치돼 있지 않은 한
 *   화면에는 아무 변화가 없다. 실제로 브라우저가 웹폰트 파일을 내려받아 그 글꼴로
 *   그렸는지까지 확인해야 "적용됐다"고 말할 수 있다. 그래서 이 테스트는 CSS 문자열이
 *   아니라 **런타임 실측**만 본다: document.fonts.check · 네트워크 응답 · computedStyle.
 *
 * 계약
 *   ① 저장소에 self-host된 폰트 자산이 실제로 존재하고 200으로 응답한다(404 0건).
 *   ② document.fonts가 Wanted Sans Variable을 loaded 상태로 갖는다.
 *   ③ 모의투자 화면의 대표 요소 + **JS가 나중에 그린 요소**의 computed 첫 글꼴이 그것이다.
 *   ④ button도 브라우저 기본 글꼴로 새지 않는다.
 *   ⑤ 사이트의 다른 화면도 같은 글꼴이다(2026-08-18 전체 통일 — 화면별 글꼴 금지).
 *   ⑥ 폰트를 못 받아도 글자가 사라지거나 레이아웃이 무너지지 않는다(fallback).
 *   ⑦ 폰트 로드 전/후 모두 가로 스크롤·잘림이 없다.
 *
 * 실행: node test_static_server.js 8877 &  →  node test_paper_font.js
 */
const { chromium } = require('./test_playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
const ROOT = __dirname;
const FONT_DIR = path.join(ROOT, 'assets', 'fonts', 'wanted-sans');
const failures = [];

function check(name, condition, detail) {
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}` + (!condition && detail ? ` — ${detail}` : ''));
  if (!condition) failures.push(name);
}
const first = f => (f || '').split(',')[0].replace(/["']/g, '').trim();
const FAM = 'Wanted Sans Variable';

(async () => {
  // ── ① 자산 정적 검사 (파일이 repo에 실제로 있는가) ────────────────────────
  const cssPath = path.join(FONT_DIR, 'WantedSansVariable.css');
  check('A1. 폰트 CSS가 저장소에 존재', fs.existsSync(cssPath), cssPath);
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';
  check('A2. @font-face 선언이 실제로 있다', (css.match(/@font-face/g) || []).length > 0,
    `${(css.match(/@font-face/g) || []).length}건`);
  check('A3. font-display:swap (글자가 안 보이는 구간 방지)', /font-display:\s*swap/.test(css));
  check('A4. unicode-range 서브셋(필요한 조각만 내려받기)', /unicode-range/.test(css));
  check('A5. 라이선스 파일 동봉(SIL OFL 1.1)',
    fs.existsSync(path.join(FONT_DIR, 'OFL.txt'))
    && /SIL Open Font License/.test(fs.readFileSync(path.join(FONT_DIR, 'OFL.txt'), 'utf-8')));

  // CSS가 참조하는 파일이 전부 실재하는가 — GitHub Pages는 대소문자를 구분하므로
  // 파일명 철자/대소문자가 하나라도 다르면 Production에서만 404가 난다.
  const refs = [...new Set((css.match(/url\("\.\/woff2\/([^"]+)"\)/g) || [])
    .map(m => m.replace(/^url\("\.\/woff2\//, '').replace(/"\)$/, '')))];
  const missing = refs.filter(f => !fs.existsSync(path.join(FONT_DIR, 'woff2', f)));
  check('A6. CSS가 참조하는 woff2가 전부 실재(대소문자 포함 정확)',
    refs.length > 0 && missing.length === 0, `참조 ${refs.length}개 · 누락 ${missing.length}개 ${missing.slice(0, 3)}`);
  const bad = refs.filter(f => {
    const b = fs.readFileSync(path.join(FONT_DIR, 'woff2', f));
    return b.slice(0, 4).toString('latin1') !== 'wOF2';      // WOFF2 매직넘버
  });
  check('A7. 모든 woff2가 유효한 WOFF2 파일', bad.length === 0, `손상 ${bad.length}개`);
  check('A8. index.html이 이 CSS를 실제로 불러온다',
    /assets\/fonts\/wanted-sans\/WantedSansVariable\.css/.test(
      fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8')));

  // ── ② 런타임 실측 ────────────────────────────────────────────────────────
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const resp = [];
  page.on('response', r => { if (/wanted-sans/.test(r.url())) resp.push({ s: r.status(), u: r.url().split('/').pop() }); });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));

  await page.goto(BASE + '?m=paper', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  const loaded = await page.evaluate(fam => ({
    check: document.fonts.check(`16px "${fam}"`),
    fams: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))]
  }), FAM);
  check('R1. document.fonts.check 통과(브라우저가 이 글꼴을 실제로 쓸 수 있다)', loaded.check);
  check('R2. Wanted Sans Variable이 loaded 상태', loaded.fams.includes(FAM), JSON.stringify(loaded.fams));
  const w2 = resp.filter(r => r.u.endsWith('.woff2'));
  check('R3. 폰트 파일이 실제로 네트워크로 내려받아졌다', w2.length > 0, `${w2.length}개`);
  check('R4. 폰트 응답에 404/오류 0건', resp.length > 0 && resp.every(r => r.s === 200),
    JSON.stringify(resp.filter(r => r.s !== 200)));
  check('R5. 서브셋이라 전부 받지 않는다(필요한 조각만)', w2.length < refs.length,
    `${w2.length}/${refs.length}`);

  // 대표 요소 + 동적 렌더 요소
  const sels = {
    '화면 루트': '#paperView', '제목': '.pv-title', '현재 가상자산': '.pv-port-v',
    '종목명': '.pv-pos-nm', '종목 펼침 버튼': '.pv-pos-hd', '탭 버튼': '.pv-tab',
    '섹션 제목': '.pv-sec-h', '오늘 거래 보조문구': '.pv-td-meta'
  };
  const comp = await page.evaluate(map => {
    const out = {};
    for (const [k, s] of Object.entries(map)) {
      const e = document.querySelector(s);
      out[k] = e ? getComputedStyle(e).fontFamily : null;
    }
    return out;
  }, sels);
  for (const [k, v] of Object.entries(comp)) {
    check(`R6. ${k} 실제 적용 글꼴 = ${FAM}`, first(v) === FAM, String(v).slice(0, 60));
  }

  // 기록 탭(완전히 JS로 그려지는 화면)
  await page.click('.pv-tab[data-pview="history"]');
  await page.waitForTimeout(1600);
  const hist = await page.evaluate(() => {
    const g = s => { const e = document.querySelector(s); return e ? getComputedStyle(e).fontFamily : null; };
    return { '기록 행': g('.pv-hd-row'), '기록 날짜': g('.pv-hd-t'), '기록 금액': g('.pv-hd-eq') };
  });
  for (const [k, v] of Object.entries(hist)) {
    check(`R7. ${k}(동적 렌더) 실제 적용 글꼴 = ${FAM}`, first(v) === FAM, String(v).slice(0, 60));
  }
  const rows = await page.$$('.pv-hd-row');
  if (rows.length) {
    await rows[0].click();
    await page.waitForTimeout(500);
    const rv = await page.evaluate(() => {
      const e = document.querySelector('.pv-rv-sec li');
      return e ? getComputedStyle(e).fontFamily : null;
    });
    check(`R8. 종합평가 본문 실제 적용 글꼴 = ${FAM}`, first(rv) === FAM, String(rv).slice(0, 60));
  }

  // 2026-08-18 전체 sweep: 이 글꼴은 이제 모의투자 전용이 아니라 사이트 표준이다.
  // 그래서 계약이 뒤집힌다 — "다른 화면은 그대로"가 아니라 "다른 화면도 같아야" 한다.
  // (화면마다 글꼴이 다르면 한 회사 제품으로 보이지 않는다는 게 이번 작업의 출발점)
  await page.evaluate(() => window.setMode('home'));
  await page.waitForTimeout(400);
  const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  check('R9. 사이트 전체가 같은 글꼴(홈도 동일)', first(body) === FAM, String(body).slice(0, 60));
  check('R10. JS 예외 0', errs.length === 0, errs.join(' | '));
  await ctx.close();

  // ── ③ 폰트를 못 받는 상황(fallback) ──────────────────────────────────────
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 900 }, serviceWorkers: 'block' });
  const p2 = await ctx2.newPage();
  const errs2 = [];
  p2.on('pageerror', e => errs2.push(String(e).slice(0, 120)));
  await p2.route('**/assets/fonts/**', r => r.abort());
  await p2.goto(BASE + '?m=paper', { waitUntil: 'load' });
  await p2.evaluate(() => document.fonts.ready.catch(() => {}));
  await p2.waitForTimeout(1200);
  const fb = await p2.evaluate(() => {
    const v = document.getElementById('paperView');
    const t = document.querySelector('.pv-title');
    return { len: v.innerText.trim().length, h: t ? Math.round(t.getBoundingClientRect().height) : 0,
             ov: document.documentElement.scrollWidth > window.innerWidth + 1 };
  });
  check('D1. 폰트를 못 받아도 글자가 보인다(빈 화면·투명 글자 없음)', fb.len > 200, `len=${fb.len}`);
  check('D2. 폰트를 못 받아도 제목이 정상 높이로 그려진다', fb.h > 10 && fb.h < 120, `h=${fb.h}`);
  check('D3. 폰트를 못 받아도 가로 스크롤이 생기지 않는다', !fb.ov);
  check('D4. 폰트를 못 받아도 JS 예외 0', errs2.length === 0, errs2.join(' | '));
  await ctx2.close();

  // ── ④ 뷰포트별 (폰트 적용 상태) ──────────────────────────────────────────
  for (const w of [320, 360, 390, 430, 1280, 1440]) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 }, serviceWorkers: 'block' });
    const p = await c.newPage();
    await p.goto(BASE + '?m=paper', { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(800);
    const m = await p.evaluate(() => {
      const v = document.getElementById('paperView');
      const bad = [];
      v.querySelectorAll('*').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto')
          bad.push((el.className || el.tagName) + ' ' + el.scrollWidth + '>' + el.clientWidth);
      });
      return { ov: document.documentElement.scrollWidth > window.innerWidth + 1, clip: bad.slice(0, 3) };
    });
    check(`V1.${w}px 가로 스크롤·글자 잘림 0`, !m.ov && m.clip.length === 0,
      `ov=${m.ov} clip=${JSON.stringify(m.clip)}`);
    await c.close();
  }

  await browser.close();
  console.log();
  if (failures.length) {
    console.log(`실패 ${failures.length}건: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('test_paper_font: 전체 통과 (웹폰트 실제 로드·적용 계약)');
})().catch(error => { console.error(error); process.exit(1); });
