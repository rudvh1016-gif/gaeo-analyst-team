// Playwright 로더 — 실행 환경마다 설치 위치가 달라서 후보를 차례로 시도한다.
// (Codex 런타임 / 전역 node_modules / NODE_PATH / 로컬 설치)
// 브라우저 테스트가 "환경이 달라서" 실패하는 걸 막기 위한 공용 헬퍼다.
const os = require('os');
const path = require('path');

const CANDIDATES = [
  path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),
  '/opt/node22/lib/node_modules/playwright',
  'playwright',
];

function loadPlaywright() {
  const tried = [];
  for (const candidate of CANDIDATES) {
    try {
      return require(candidate);
    } catch (error) {
      tried.push(`${candidate}: ${error.code || error.message}`);
    }
  }
  throw new Error(`playwright를 찾지 못했습니다.\n시도한 경로:\n  ${tried.join('\n  ')}`);
}

// 전역 설치 Chromium을 쓰는 환경(PLAYWRIGHT_BROWSERS_PATH)에서도 동작하도록
// launch 옵션에 executablePath 후보를 얹어준다.
function launchOptions(extra = {}) {
  const fs = require('fs');
  const options = { ...extra };
  if (!options.executablePath) {
    for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome', '/opt/pw-browsers/chromium']) {
      try {
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
          options.executablePath = p;
          break;
        }
      } catch (error) {
        // 후보가 없으면 playwright 기본 탐색에 맡긴다.
      }
    }
  }
  return options;
}

module.exports = { loadPlaywright, launchOptions, ...loadPlaywright() };
