/* GAEO Typography 품질 계약 — 2026-08-18
 *
 * 왜 필요한가
 *   "가로 스크롤 0" 만으로는 디자인 품질을 보장하지 못한다. 글자가 화면 안에
 *   들어가더라도 제목이 3줄로 무너지거나, 마지막 줄에 한 단어만 외톨이로 떨어지거나,
 *   탭·버튼이 2줄이 되면 그건 실패다. 이 파일은 그 "보기 좋음"을 기계로 검사한다.
 *
 * 계약
 *   ① 사이트 전역 서체가 하나다(화면마다 다른 글꼴 금지).
 *   ② 굵기 체계는 400/500/600 + 브랜드 예외뿐이다(700 남발 금지).
 *   ③ 제목이 3줄 이상으로 무너지지 않는다.
 *   ④ 마지막 줄에 한 단어만 남는 고아 줄바꿈이 없다.
 *   ⑤ 탭·버튼이 2줄로 접히지 않는다.
 *   ⑥ 좁은 화면에서 제목이 과도하게 크지 않다.
 *   ⑦ 가로 스크롤·글자 잘림이 없다.
 *
 * 실행: node test_static_server.js 8877 &  →  node test_typography_quality.js
 */
const { chromium } = require('./test_playwright');

const BASE = process.env.GAEO_TEST_URL || 'http://127.0.0.1:8877/index.html';
// 화면(mode)마다 검사할 컨테이너를 명시적으로 못박는다.
// `.on`이 붙은 view를 자동으로 고르면 직전 화면이 남아 다른 화면 내용을 엉뚱하게
// 그 모드의 문제로 보고한다(모드별 귀속이 어긋남). 그래서 매핑을 고정한다.
const MODE_VIEW = {
  home: '#homeDashboard', rotation: '#rotationView', scorecard: '#scorecardView',
  paper: '#paperView', calendar: '#calendarView', rates: '#rateView',
  news: '#newsView', study: '#studyView', lesson: '#lessonView', estate: '#estateView',
  calc: '#calcView', guide: '#guideView', screener: '#screenerView',
  community: '#communityView', changelog: '#changelogView'
};
const MODES = Object.keys(MODE_VIEW);
const failures = [];

function check(name, condition, detail) {
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}` + (!condition && detail ? ` — ${detail}` : ''));
  if (!condition) failures.push(name);
}

// 브랜드 로고·히어로 타이틀은 굵기 예외를 허용한다(디자인 계약과 동일 기준).
const WEIGHT_EXEMPT = ['global-brand-word', 'hero-brand', 'hero-title'];

async function auditMode(page, mode, width) {
  await page.evaluate(m => { try { window.setMode(m); } catch (e) {} }, mode);
  // 성적표·모의투자는 자료를 나중에 내려받아 그린다(지연 로딩). 다 그려질 때까지 기다린다.
  const sel = MODE_VIEW[mode];
  for (let i = 0; i < 40; i++) {
    const ready = await page.evaluate(s => {
      const v = document.querySelector(s);
      return !!v && v.offsetParent !== null && (v.innerText || '').trim().length > 200
        && !/불러오는 중/.test(v.innerText);
    }, sel);
    if (ready) break;
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  return page.evaluate(([exempt, sel, HUGE]) => {
    const view = document.querySelector(sel);
    // 그 화면이 실제로 보이지 않으면 검사 결과가 무의미하므로 그대로 알린다.
    if (!view || view.offsetParent === null || (view.innerText || '').trim().length < 40)
      return { missing: true, fams: [], weights: {}, tall: [], orphans: [], wrapped: [],
               huge: [], clip: [], overflow: false, genericMono: [] };

    // 줄 수는 "높이 ÷ 줄높이"로 재면 안 된다 — padding이 들어간 버튼은 한 줄인데도
    // 두 줄로 잡힌다. 글자 자체가 실제로 몇 줄에 그려졌는지(Range의 사각형 개수)를 센다.
    const lineCount = el => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter(x => x.width > 0 && x.height > 0);
      if (!rects.length) return 1;
      const tops = new Set(rects.map(x => Math.round(x.top / 2)));   // 2px 오차 허용
      return Math.max(1, tops.size);
    };
    // 마지막 줄에 한 단어만 남는지: 실제로 그려진 줄들의 너비를 비교한다.
    // (원문에서 "마지막 띄어쓰기 뒤"를 재면, 줄바꿈이 잘 된 문장도 마지막 단어가
    //  짧다는 이유만으로 고아로 잘못 잡힌다.)
    const orphan = el => {
      const t = (el.textContent || '').trim();
      if (t.split(/\s+/).length < 3 || t.length > 120) return false;
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter(x => x.width > 0 && x.height > 0);
      if (rects.length < 2) return false;
      const lines = [];
      rects.forEach(x => {
        const row = lines.find(l => Math.abs(l.top - x.top) < 3);
        if (row) { row.right = Math.max(row.right, x.right); row.left = Math.min(row.left, x.left); }
        else lines.push({ top: x.top, left: x.left, right: x.right });
      });
      if (lines.length < 2) return false;
      const w = lines.map(l => l.right - l.left);
      const last = w[w.length - 1], widest = Math.max(...w);
      return last < widest * 0.34;                 // 마지막 줄이 한 토막만 남았다
    };

    const fams = new Set(), weights = {};
    const tall = [], orphans = [], wrapped = [], huge = [], genericMono = [];
    view.querySelectorAll('*').forEach(el => {
      if (el.children.length !== 0) return;
      const t = (el.textContent || '').trim();
      if (!t) return;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      // 코드·식별자는 고정폭이 맞다. 다만 브라우저 기본(generic monospace)이면
      // 기기마다 다른 글꼴이 되므로 그건 통일 실패로 잡는다.
      if (/^(CODE|KBD|SAMP|PRE)$/.test(el.tagName)) {
        if (s.fontFamily.split(',')[0].replace(/["']/g, '') === 'monospace') genericMono.push(t.slice(0, 16));
      } else {
        fams.add(s.fontFamily.split(',')[0].replace(/["']/g, ''));
      }
      const cls = typeof el.className === 'string' ? el.className : '';
      const isExempt = exempt.some(x => cls.includes(x));
      const w = parseInt(s.fontWeight);
      if (!isExempt) weights[w] = (weights[w] || 0) + 1;
      const px = parseFloat(s.fontSize);
      const lines = lineCount(el);
      const isHeading = /^H[1-6]$/.test(el.tagName) || px >= 17;
      if (isHeading && lines >= 3 && t.length < 80) tall.push(`${t.slice(0, 26)}(${lines}줄/${Math.round(px)}px)`);
      if (px >= 17 && orphan(el)) orphans.push(t.slice(0, 26));
      const btn = el.closest('button,[role="tab"]');
      const isCtl = btn !== null && (btn.textContent || '').trim() === t;
      if (isCtl && lines >= 2 && t.length < 30) wrapped.push(t.slice(0, 20));
      // 좁은 화면에서 제목이 과도하게 큰지를 본다(데스크톱 히어로는 커도 된다).
      // 브랜드 히어로(사이트 대표 H1)는 한 줄에 들어가는 한 크기 예외를 허용한다.
      if (px > HUGE && !isExempt) huge.push(`${t.slice(0, 18)}(${Math.round(px)}px)`);
    });
    const scrollable = el => {
      let n = el, d = 0;
      while (n && d < 4) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
        n = n.parentElement; d++;
      }
      return false;
    };
    // 잘림은 "글자가 자기 상자 밖으로 나갔는가"로만 판정한다.
    // scrollWidth 비교만 쓰면 숨은 툴팁(::after)·절대배치 장식까지 잘림으로 잡혀
    // 진짜 문제가 묻힌다. 그래서 텍스트의 실제 사각형과 내용상자를 직접 비교한다.
    const bad = [];
    view.querySelectorAll('*').forEach(el => {
      if (typeof el.className !== 'string') return;          // SVG 등 제외
      if (el.children.length !== 0) return;                   // 글자를 직접 가진 요소만
      const t = (el.textContent || '').trim();
      if (!t) return;
      const s2 = getComputedStyle(el);
      if (s2.textOverflow === 'ellipsis') return;             // 말줄임은 설계된 축약
      if (scrollable(el)) return;                             // 옆으로 스크롤되는 영역
      const box = el.getBoundingClientRect();
      if (box.width === 0) return;
      const padL = parseFloat(s2.paddingLeft) || 0, padR = parseFloat(s2.paddingRight) || 0;
      const left = box.left + padL, right = box.right - padR;
      const r = document.createRange();
      r.selectNodeContents(el);
      // pre-wrap 문단은 줄 끝의 공백이 상자 밖으로 몇 px 걸쳐 그려진다 —
      // 글자가 잘리는 게 아니므로 아주 얇은 조각(5px 미만)은 세지 않는다.
      const over = [...r.getClientRects()].some(x =>
        x.width >= 5 && (x.right > right + 2 || x.left < left - 2));
      if (over) bad.push(`${el.className || el.tagName}:${t.slice(0, 10)}`.slice(0, 34));
    });
    return {
      missing: false,
      fams: [...fams], weights, genericMono: genericMono.slice(0, 3),
      tall: tall.slice(0, 5), orphans: orphans.slice(0, 5),
      wrapped: wrapped.slice(0, 5), huge: huge.slice(0, 4),
      clip: bad.slice(0, 3),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  }, [WEIGHT_EXEMPT, MODE_VIEW[mode], width <= 430 ? 30 : 46]);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const allFams = new Set();

  for (const width of [360, 390, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);

    for (const mode of MODES) {
      const r = await auditMode(page, mode, width);
      r.fams.forEach(f => allFams.add(f));
      const tag = `${mode}@${width}`;
      check(`${tag} 화면이 실제로 그려짐(검사 대상 확보)`, !r.missing, MODE_VIEW[mode]);
      if (r.missing) continue;
      check(`${tag} 제목이 3줄 이상으로 무너지지 않음`, r.tall.length === 0, r.tall.join(' '));
      check(`${tag} 마지막 줄 한 단어 고아 없음`, r.orphans.length === 0, r.orphans.join(' '));
      check(`${tag} 탭·버튼이 2줄로 접히지 않음`, r.wrapped.length === 0, r.wrapped.join(' '));
      check(`${tag} 좁은 화면에서 과도하게 큰 글자 없음`, r.huge.length === 0, r.huge.join(' '));
      check(`${tag} 가로 스크롤·잘림 0`, !r.overflow && r.clip.length === 0,
        `ov=${r.overflow} clip=${r.clip.join(',')}`);
      const heavy = Object.entries(r.weights).filter(([w]) => +w >= 700)
        .reduce((s, [, c]) => s + c, 0);
      check(`${tag} 굵기 700+ 남발 없음(브랜드 예외 제외)`, heavy === 0, `${heavy}곳`);
      check(`${tag} 코드 글꼴이 기기 기본값으로 새지 않음`, r.genericMono.length === 0,
        r.genericMono.join(' '));
    }
    await ctx.close();
  }

  check('사이트 전역 서체가 하나로 통일됨', allFams.size === 1, [...allFams].join(' / '));
  check('그 서체가 Wanted Sans Variable', allFams.has('Wanted Sans Variable'), [...allFams].join(' / '));

  await browser.close();
  console.log();
  if (failures.length) {
    console.log(`실패 ${failures.length}건: ${failures.join(', ')}`);
    process.exit(1);
  }
  console.log('test_typography_quality: 전체 통과');
})().catch(error => { console.error(error); process.exit(1); });
