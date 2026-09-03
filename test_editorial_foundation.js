const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const cssPath = 'editorial-foundation.css';
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const failures = [];

function check(name, condition) {
  console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}`);
  if (!condition) failures.push(name);
}

check('편집형 foundation stylesheet가 존재함', Boolean(css));
check('foundation stylesheet가 insight rail 뒤에 로드됨',
  /insight-rail\.css[^>]*>\s*<link[^>]+editorial-foundation\.css/.test(html));
check('foundation stylesheet가 offline shell에 포함됨',
  serviceWorker.includes("'./editorial-foundation.css'"));
check('홈 제목이 한국 주식과 판단 변화를 직접 설명함',
  html.includes('한국 주식, 달라진 판단부터'));
check('최근 거래일·근거·기준 시각 범위를 명시함',
  html.includes('최근 거래일') && html.includes('판단이 달라진 근거') && html.includes('기준 시각'));
check('규칙 기반 600종목과 일부 AI 보조 경계를 명시함',
  /코스피·코스닥[^<]*600종목/.test(html) && /일부[^<]*정밀[^<]*AI 보조/.test(html));
check('검색이 직접적인 제목과 안내를 가짐',
  html.includes('회사 이름으로 바로 찾기') && html.includes('회사 이름 일부나 업종'));

for (const id of [
  'homeTicker', 'homeRun', 'homeWatchlist', 'briefSectorBtn', 'briefNewsBtn',
  'briefFullMarketBtn', 'heroLatestBtn', 'heroChangesBtn', 'hdaToggle',
  'homeDeepAnalysisList', 'navSearchToggle', 'navMenuToggle', 'trustStrip', 'activityBoard',
]) {
  check(`기능 연결 ID #${id} 보존`, html.includes(`id="${id}"`));
}

for (const token of [
  '--editorial-canvas:#FFFFFF', '--editorial-surface:#FFFFFF',
  '--editorial-heading:#111214', '--editorial-text:#24262B',
  '--editorial-secondary:#555B66', '--editorial-muted:#6B7280',
  '--editorial-divider:#E4E6EA', '--editorial-control-radius:8px',
  '--editorial-overlay-radius:12px',
]) {
  check(`semantic token ${token} 정의`, css.replace(/\s/g, '').includes(token));
}

check('dark semantic tokens 정의',
  /html\.gdark\s*\{[^}]*--editorial-canvas:\s*#0D0E10/i.test(css) &&
  /--editorial-heading:\s*#F4F5F7/i.test(css));
check('장식 효과를 foundation에 새로 넣지 않음',
  !/gradient\s*\(|\bglow\b/i.test(css) &&
  !/backdrop-filter:\s*(?!none\b)/i.test(css));
check('홈 lead 읽기 surface를 평탄화함',
  /\.home-dashboard>\.home-lead>header[^}]*border-radius:\s*0/i.test(css.replace(/\s/g, '')) &&
  /\.hero-search-card[^}]*border-radius:\s*0/i.test(css));
check('daily brief 읽기 surface를 평탄화함',
  /\.home-dashboard\s+\.start-step[^}]*border-radius:\s*0/i.test(css));
check('입력과 primary search control 경계를 유지함',
  /\.home-dashboard\s+\.home-search-row\s+input[^}]*border:/i.test(css) &&
  /\.home-dashboard\s+\.home-search-go[^}]*border-radius:\s*var\(--editorial-control-radius\)/i.test(css));
check('대표 브랜드 외 700 굵기를 foundation에 추가하지 않음',
  !/font-weight:\s*700\b/i.test(css));

if (failures.length) {
  console.error(`\n실패 ${failures.length}건: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('\ntest_editorial_foundation: 전체 통과');
