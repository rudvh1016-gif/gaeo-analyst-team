const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const check = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`[PASS] ${message}`);
};

const index = read('index.html');
const about = read('about.html');
const snapshots = read('generate_snapshots.js');
const deep = read('deep_analysis_publish.js');
const sw = read('sw.js');
const cssPath = path.join(ROOT, 'editorial-accessibility.css');

check(fs.existsSync(cssPath), '공통 editorial accessibility stylesheet가 존재함');
const css = read('editorial-accessibility.css');
check(index.includes('editorial-accessibility.css?v=20260903-v1'), '앱 화면이 공통 stylesheet를 로드함');
check(about.includes('editorial-accessibility.css?v=20260903-v1'), 'About이 공통 stylesheet를 로드함');
check(snapshots.includes('/editorial-accessibility.css?v=20260903-v1'), 'snapshot 생성기가 공통 stylesheet를 출력함');
check(deep.includes('/editorial-accessibility.css?v=20260903-v1'), 'deep-analysis 생성기가 공통 stylesheet를 출력함');
check(sw.includes("'./editorial-accessibility.css'"), 'offline shell이 공통 stylesheet를 포함함');

check(/<a class="skip-link" href="#main-content">본문으로/.test(index), '앱 skip link가 main landmark를 가리킴');
check(/<main id="main-content" class="wrap" tabindex="-1">/.test(index), '앱 전체 콘텐츠가 하나의 main landmark 안에 있음');
check(!/<main class="main">/.test(index), '중첩 main landmark가 없음');
check((index.replace(/<noscript>[\s\S]*?<\/noscript>/, '').match(/<h1\b/g) || []).length === 1,
  '실행 화면의 H1이 하나임');
check(/id="qname"[^>]+role="heading"[^>]+aria-level="1"[^>]+aria-hidden="true"/.test(index),
  '종목명은 선택 뒤 활성화할 동적 level-1 heading임');

for (const id of ['homeTicker', 'navTicker', 'ticker', 'cmpA', 'cmpB']) {
  check(new RegExp(`<input[^>]+id="${id}"[^>]+aria-(?:label|labelledby)=`).test(index), `${id} 검색 입력에 접근 가능한 이름이 있음`);
}
check(/id="analysisTabOverview"[^>]+tabindex="0"/.test(index), '첫 분석 tab이 tab 순서에 포함됨');
check(/id="analysisTabAgents"[^>]+tabindex="-1"/.test(index), '비활성 분석 tab이 roving tabindex를 사용함');
check(/role="tabpanel"[^>]+tabindex="0"/.test(index), '분석 tabpanel을 키보드로 읽을 수 있음');
check(/<button[^>]+class="cat-card"[^>]+data-cat=/.test(index), '콘텐츠 카테고리는 native button으로 생성됨');
check(/<button[^>]+class="nw-head"[^>]+aria-expanded=/.test(index), '아코디언 제목은 상태를 노출하는 native button임');
check(/role','combobox'/.test(index) && /aria-activedescendant/.test(index), '자동완성 검색은 combobox 상태와 활성 option을 노출함');
check(/label\.htmlFor=control\.id/.test(index) && /aria-invalid/.test(index), '계산기는 label 연결과 오류 상태를 제공함');
check((index.match(/focusContentHeading\(box\)/g) || []).length >= 13,
  '모든 콘텐츠 카테고리 진입·복귀·검색 초기화가 heading focus를 복구함');
check(/<footer class="foot"/.test(index), '앱 사이트 정보가 footer landmark임');
check(!/<(?:div|span)[^>]+class="(?:cat-card|nw-head)"/.test(index), '클릭 전용 div/span 패턴이 없음');
check(!/tabindex="[1-9]/.test(index), '양수 tabindex를 사용하지 않음');

check(css.includes(':focus-visible'), '공통 visible focus 규칙이 있음');
check(/min-(?:width|height):44px/.test(css), '핵심 포인터 target 44px 규칙이 있음');
check(css.includes('@media (prefers-reduced-motion: reduce)'), 'reduced motion 규칙이 있음');
check(css.includes('@media (max-width: 320px)'), '320px reflow 보정이 있음');
check(!/font-weight\s*:\s*(?:700|800|900|bold)/.test(css), '공통 확장 CSS는 400·500·600 굵기만 사용함');
check(css.includes('body .rotation-view .rot-card') && css.includes('body .fullmarket-view .fm-panel'),
  '고밀도 화면 평탄화 규칙이 legacy class보다 높은 specificity를 가짐');
check(/\.gir-delete\{[^}]*width:44px[^}]*height:44px/.test(read('insight-rail.css')),
  '최근 본 개별 삭제 control이 44×44 target을 가짐');
check(!index.includes('📌 주요 이슈') && !/<span class="mb-icon">/.test(index),
  '캘린더와 모델 상태의 중복 장식 emoji가 없음');
check(!index.includes('>📌 현재 흐름<') && !index.includes('<p class="rd-intro">📡') && !index.includes('>📡 레이더 포착 변화'),
  '비어 있지 않은 레이더 결과에 장식용 emoji가 없음');

for (const file of ['snap/index.html', 'snap/news/63.html', 'snap/stock/005930.html']) {
  const html = read(file);
  check(html.includes('/editorial-accessibility.css?v=20260903-v1'), `${file}에 공통 stylesheet가 생성됨`);
  check(/<a class="skip-link" href="#main-content">/.test(html), `${file}에 skip link가 생성됨`);
  check(/<main[^>]+id="main-content"/.test(html), `${file}의 main landmark에 id가 있음`);
  check((html.match(/<h1\b/g) || []).length === 1, `${file}에 H1이 하나임`);
  check(!/[📰📚🎓🏠🧮📈💰🔮🌊🕒🔎🧭🎯🖼]/u.test(html), `${file}에 장식용 emoji가 없음`);
}

const deepManifest = JSON.parse(read('deep_analysis_manifest.json'));
const latestDeep = deepManifest.records[0];
const latestDeepUrl = new URL(latestDeep.loc);
const deepSnapshot = path.join(latestDeepUrl.pathname.replace(/^\//, ''), 'index.html');
check(Boolean(deepSnapshot), '검증할 deep-analysis snapshot이 존재함');
const deepHtml = read(deepSnapshot);
check(deepHtml.includes('/editorial-accessibility.css?v=20260903-v1'), 'deep-analysis snapshot에 공통 stylesheet가 생성됨');
check(/<a class="skip-link" href="#main-content">/.test(deepHtml), 'deep-analysis snapshot에 skip link가 생성됨');
check(/<main[^>]+id="main-content"/.test(deepHtml), 'deep-analysis main landmark에 id가 있음');

const deepArchive = read('research/deep-analysis/index.html');
check(/<footer>\s*<nav class="da-pager"/.test(deepArchive), 'deep-analysis archive의 페이지 이동이 footer landmark 안에 있음');
const latestTicker = latestDeep.snapshotId.split('-')[0];
const deepHub = read(path.join('research', 'deep-analysis', latestTicker, 'index.html'));
check(/<main[^>]+id="main-content"/.test(deepHub), 'deep-analysis 종목 대표 페이지에 main landmark가 있음');

console.log('test_editorial_accessibility: 전체 통과');
