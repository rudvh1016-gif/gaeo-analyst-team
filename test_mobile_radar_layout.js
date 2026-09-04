const assert = require('node:assert/strict');
const fs = require('node:fs');
const { readAppDocument } = require('./app_test_source');

const html = readAppDocument();

// Compact screens should use a consistent two-column radar category grid,
// with smaller one-line controls instead of a tall, ragged flex layout.
const radarStart = html.indexOf('.gaeo-radar{margin:');
const mobileStart = html.indexOf('@media(max-width:620px){', radarStart);
const mobileEnd = html.indexOf('@media(prefers-reduced-motion:reduce)', mobileStart);
assert.ok(radarStart >= 0 && mobileStart > radarStart && mobileEnd > mobileStart, 'mobile radar media query should exist');
const mobile = html.slice(mobileStart, mobileEnd);
/* ⭐ 2026-09-04: 예전에는 gap:5px까지 함께 봤다. 그런데 그 값은 화면에 적용된 적이 없다 —
   editorial-foundation.css가 나중에 읽히면서 같은 미디어에 gap:6px를 주기 때문이다.
   레이아웃 계약(2열 그리드)은 그대로 지키고, 간격은 실제로 이기는 파일에서 확인한다.
   (죽은 선언 탐지는 test_css_layering.py가 맡는다.) */
assert.match(mobile, /\.gr-chips\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
const editorialCss = fs.readFileSync('editorial-foundation.css', 'utf8');
assert.match(editorialCss, /\.gr-chips\{gap:6px\}/,
  '레이더 칩 간격의 실제 값은 editorial-foundation.css가 정한다');
/* ⭐ 2026-09-04: 예전에는 min-height:32px · font-size:9.5px · padding:5px 6px까지 함께 봤다.
   그 세 값은 화면에 적용된 적이 없다 — editorial-foundation.css가 나중에 읽히면서 같은
   미디어에 min-height:38px · font-size:12px · padding:7px 8px를 주기 때문이다. 실측
   렌더값은 12px / min-height 45px(접근성 보정 포함)였다. 즉 이 테스트는 "화면에 없는 값"을
   지키고 있었다. 레이아웃 계약(가로 꽉 채움·줄바꿈 없음)만 여기서 보고, 크기·간격은
   실제로 이기는 파일에서 확인한다. (죽은 선언 탐지는 test_css_layering.py가 맡는다.) */
assert.match(mobile, /\.gr-chip\{width:100%;min-width:0;justify-content:center;gap:3px;[^}]*white-space:nowrap/);
assert.match(editorialCss, /\.gr-chip\{min-height:38px;font-size:12px;padding:7px 8px\}/,
  '레이더 칩의 실제 크기·간격은 editorial-foundation.css가 정한다');
/* 같은 이유로 아이콘 크기도 app-shell.css의 8px가 아니라 editorial-foundation.css의
   10px가 실제로 적용된다. */
assert.match(editorialCss, /\.gr-chip \.gr-ico\{font-size:10px\}/,
  '레이더 칩 아이콘의 실제 크기는 editorial-foundation.css가 정한다');

console.log('mobile radar layout tests passed');
