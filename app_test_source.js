const fs = require('node:fs');
const path = require('node:path');

// 화면을 열 때만 받는 지연 로딩 UI 파일. 브라우저에서는 GaeoFeatures가 <script>로
// 주입하지만, 소스 계약 테스트에는 "app.js 안에 있는가"가 아니라 "화면 코드에 있는가"가
// 중요하므로 문서 순서 뒤에 이어 붙인다.
// ⚠️ 이 목록이 비면, 분리된 화면(성적표·순환매·전체시장)의 계약이 조용히 사라진다 —
//    테스트는 통과하는데 정작 화면 코드가 없어지는 상태가 된다. 새 *-ui.js를 만들면 여기 추가할 것.
const LAZY_UI = ['scorecard-ui.js', 'rotation-ui.js', 'full-market-ui.js'];

/**
 * Reconstruct the browser document for source-level contract tests.
 * Production keeps the large CSS and app program in cacheable static files;
 * tests inspect the assembled source in the same execution order.
 */
function readAppDocument(root = __dirname) {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const lazy = LAZY_UI
    .filter(file => fs.existsSync(path.join(root, file)))
    .map(file => `<script>\n${read(file)}</script>`)
    .join('\n');
  return read('index.html')
    .replace(/<link rel="stylesheet" href="app-shell\.css\?v=[^"]+">/,
      `<style>\n${read('app-shell.css')}</style>`)
    .replace(/<script src="app\.js\?v=[^"]+"[^>]*><\/script>/,
      `<script>\n${read('app.js')}</script>\n${lazy}`);
}

module.exports = { readAppDocument, LAZY_UI };
