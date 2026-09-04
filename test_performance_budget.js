const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

assert.ok(fs.existsSync('app-shell.css'), 'app-shell.css가 없다 — 큰 인라인 CSS는 재방문 캐시를 쓸 수 없다.');
assert.ok(fs.existsSync('app.js'), 'app.js가 없다 — 큰 인라인 앱 코드는 재방문 캐시를 쓸 수 없다.');
assert.ok(fs.existsSync('performance-budgets.json'), '경로별 성능 예산 파일이 없다.');

const css = fs.readFileSync('app-shell.css', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const budgets = JSON.parse(fs.readFileSync('performance-budgets.json', 'utf8'));

assert.ok(Buffer.byteLength(html) <= budgets.assets.indexHtmlRawBytes,
  `index.html이 ${budgets.assets.indexHtmlRawBytes}B 예산을 넘었다.`);
assert.ok(Buffer.byteLength(css) <= budgets.assets.appCssRawBytes,
  `app-shell.css가 ${budgets.assets.appCssRawBytes}B 예산을 넘었다.`);
assert.ok(Buffer.byteLength(app) <= budgets.assets.appJsRawBytes,
  `app.js가 ${budgets.assets.appJsRawBytes}B 예산을 넘었다.`);

const inlineStyles = [...html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)]
  .map(match => Buffer.byteLength(match[1]));
const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => Buffer.byteLength(match[1]));
assert.ok(Math.max(0, ...inlineStyles) <= budgets.assets.maxInlineStyleBytes,
  '큰 인라인 CSS가 돌아왔다. 정적 CSS 파일로 캐시 가능하게 유지해야 한다.');
assert.ok(Math.max(0, ...inlineScripts) <= budgets.assets.maxInlineScriptBytes,
  '큰 인라인 JS가 돌아왔다. 정적 JS 파일로 캐시 가능하게 유지해야 한다.');

assert.match(html, /<link rel="stylesheet" href="app-shell\.css\?v=[^"]+">/,
  'app-shell.css가 문서 순서에 포함되지 않았다.');
assert.match(html, /<script src="app\.js\?v=[^"]+"[^>]*><\/script>/,
  'app.js가 문서 순서에 포함되지 않았다.');
assert.match(html, /!window\.__GAEO_APP_EXECUTED__&&document\.documentElement\.classList\.contains\('route-pending'\)/,
  '부트 watchdog은 느린 경로가 아니라 app.js 실행 실패만 감지해야 한다.');
assert.match(app, /window\.__GAEO_APP_EXECUTED__\s*=\s*true/,
  'app.js 정상 실행을 부트 watchdog에 알리는 완료 표식이 필요하다.');
assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard/,
  '중복 Pretendard CDN이 남아 있다. self-host Wanted Sans만 사용한다.');

for (const asset of ['./app-shell.css', './app.js']) {
  assert.ok(sw.includes(`'${asset}?v=20260904-p9'`),
    `${asset}가 문서와 같은 정확한 버전 URL로 오프라인 shell에 없다.`);
}
assert.match(sw, /gaeo-shell-v26/, 'shell asset 변경 시 service worker cache 버전을 올려야 한다.');
const versionedShellPolicy = sw.match(/if \(versionedAppShell\) \{([\s\S]*?)\n  \}\n\n  const freshRequest/);
assert.match(sw, /url\.searchParams\.has\('v'\)[\s\S]*app\.js[\s\S]*app-shell\.css/,
  '재방문 cache-first는 버전 쿼리가 있는 앱 JS/CSS로만 한정해야 한다.');
assert.ok(versionedShellPolicy &&
  /caches\.match\(request\)\.then\(cached =>/.test(versionedShellPolicy[1]) &&
  /if \(cached\) return cached;/.test(versionedShellPolicy[1]) &&
  /return fetch\(request\)/.test(versionedShellPolicy[1]) &&
  /catch\(\(\) => caches\.match\(request, \{ ignoreSearch: true \}\)\)/.test(versionedShellPolicy[1]) &&
  !/no-store|freshRequest/.test(versionedShellPolicy[1]),
  '정확한 버전 hit만 재사용하고, 새 버전은 네트워크에서 저장한 뒤 실패 시에만 last-good을 써야 한다.');
const shellSource = sw.match(/const SHELL\s*=\s*\[([\s\S]*?)\];/)?.[1] || '';
const shellEntries = [...shellSource.matchAll(/['"]\.\/[^'"]+['"]/g)].length;
assert.ok(shellEntries <= budgets.assets.serviceWorkerShellEntries,
  `service worker shell이 ${shellEntries}개다 — ${budgets.assets.serviceWorkerShellEntries}개 예산을 넘었다.`);
assert.ok(Array.isArray(budgets.routes) && budgets.routes.length >= 8,
  '성능 예산은 홈·종목·허브·기사·계산기·순환매·전체시장·About을 모두 포함해야 한다.');
for (const route of budgets.routes) {
  assert.ok(route.name && route.path, '각 경로 예산에는 name과 path가 필요하다.');
  assert.ok(route.cls <= 0.1, `${route.name}: CLS 예산은 0.1 이하여야 한다.`);
  assert.ok(route.requests > 0 && route.transferBytes > 0 && route.localRawTransferBytes > 0 &&
    route.domNodes > 0 && route.lcpMs > 0 && route.interactionMs > 0 && route.tbtProxyMs > 0,
    `${route.name}: 요청·전송·DOM·LCP·준비시간·long-task 예산을 모두 적어야 한다.`);
}
const fullMarketBudget = budgets.routes.find(route => route.name === 'full-market');
assert.equal(fullMarketBudget?.path, '/?m=rotation',
  '전체시장 예산은 실제 순환매 진입 경로에서 측정해야 한다.');
assert.equal(fullMarketBudget?.action, 'open-full-market-tab',
  '전체시장 예산은 진입 후 전체시장 탭 동작을 명시해야 한다.');

const eagerHeavyData = /<script[^>]+src=["'][^"']*(?:auto_analysis|history|price_history|indicators|radar_series)\.js/i;
assert.doesNotMatch(html, eagerHeavyData,
  '전체 분석·가격 이력·상세 지표 파일을 첫 화면에서 eager load하면 안 된다.');

console.log('performance budget contract passed');
