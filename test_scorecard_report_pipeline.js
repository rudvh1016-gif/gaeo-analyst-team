/**
 * 성적표 정기 공개 보고서 — 정적 URL 발행 배관 계약 (2026-09-09 신설, Task #52)
 *
 * ## 왜 필요한가
 *
 * 앱의 성적표 화면은 history.js·analysis_archive.js를 매번 다시 읽어 숫자를 **그때그때
 * 계산**한다. 그래서 링크로 남길 수도, "그때 그렇게 말했다"고 인용할 수도 없다.
 * 성적표 보고서는 발행 시점 숫자를 동결해 영구 주소에 박는 글이고, 그러려면
 * URL 규칙 · 스냅샷 생성 · sitemap · SEO 게이트 **네 곳이 전부** 이 모드를 알아야 한다.
 * 한 곳만 빠져도 증상이 제각각이다.
 *
 *   growth_urls.js 누락      → canonicalUrl이 null이라 생성기가 통째로 예외를 던진다
 *   generate_snapshots 누락  → 파일이 안 만들어진다(조용히)
 *   generate_sitemap 누락    → 검색엔진이 영영 못 찾는다(조용히)
 *   seo_publish_gate 누락    → 얇은 글이 그대로 발행된다(조용히)
 *
 * 뒤 세 개는 **조용히 실패**한다 — 그래서 테스트로 잡는다.
 *
 * ## 되돌아가는 링크가 다른 이유
 *
 * 다른 콘텐츠는 앱에 1:1로 대응하는 상세 화면이 있어서 `?mode=news&id=3` 같은 주소로
 * 돌아간다. 성적표는 그런 화면이 없다 — 앱에는 숫자를 매번 다시 계산하는 성적표 화면이
 * 하나 있을 뿐이다. 그래서 `?mode=report&id=N`으로 보내면 앱이 빈 화면을 띄운다.
 * 되돌아가는 링크는 반드시 기존 성적표 화면이어야 한다.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const read = f => fs.readFileSync(path.join(HERE, f), 'utf8');
let passed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log(`  ok  ${name}`); }
  catch (e) { console.error(`  FAIL ${name}\n       ${e.message}`); process.exitCode = 1; }
}

console.log('성적표 보고서 발행 배관 계약');

const { contentUrl, classifyUrl } = require('./growth_urls.js');

check('report 모드가 정적 canonical URL을 만든다', () => {
  assert.strictEqual(contentUrl('report', 1), 'https://gaeoteam.com/snap/report/1.html');
});

check('발행된 주소를 콘텐츠 스냅샷으로 인식한다', () => {
  const r = classifyUrl('https://gaeoteam.com/snap/report/7.html');
  assert.strictEqual(r.pageType, 'content_snapshot', `pageType=${r.pageType}`);
  assert.strictEqual(r.mode, 'report');
  assert.strictEqual(r.id, '7');
});

check('데이터 파일이 있고 append-only 규율이 적혀 있다', () => {
  const src = read('scorecard_reports.js');
  assert.ok(/const SCORECARD_REPORTS\s*=\s*\[/.test(src), 'SCORECARD_REPORTS 배열이 없다');
  assert.ok(src.includes('append-only'),
    '발행된 항목의 frozen을 고치지 말라는 규율이 사라졌다 — 이게 없으면 ' +
    '"그때 그렇게 말했다"를 증명할 수 없어 이 파일의 존재 이유가 없어진다');
  assert.ok(src.includes('frozen'), 'frozen(동결 숫자) 스키마 설명이 없다');
});

check('스냅샷 생성기가 report를 만든다', () => {
  const src = read('generate_snapshots.js');
  assert.ok(src.includes("'snap/report'"), 'outDirs에 snap/report가 없다 — 폴더가 안 생긴다');
  assert.ok(/build\(load\('scorecard_reports\.js', 'SCORECARD_REPORTS'\), 'report'/.test(src),
    'scorecard_reports.js를 빌드하지 않는다 — 파일이 조용히 안 만들어진다');
});

check('되돌아가는 링크가 앱의 기존 성적표 화면이다', () => {
  const src = read('generate_snapshots.js');
  assert.ok(src.includes("backHref: BASE + '?mode=scorecard'"),
    'report의 backHref가 성적표 화면이 아니다 — ?mode=report&id=N은 앱에 없는 화면이라 ' +
    '독자가 빈 화면을 본다');
});

check('sitemap이 report를 싣는다', () => {
  const src = read('generate_sitemap.js');
  assert.ok(/variable: 'SCORECARD_REPORTS', mode: 'report'/.test(src),
    'sitemap SOURCES에 report가 없다 — 검색엔진이 영영 못 찾는다(조용한 실패)');
});

check('SEO 게이트가 report의 얇은 글을 막는다', () => {
  const src = read('seo_publish_gate.py');
  assert.ok(src.includes('"snap/report": 800'),
    'seo_publish_gate에 snap/report 최소 분량이 없다 — 얇은 글이 그대로 발행된다');
  assert.ok(src.includes('"/snap/report"'),
    'seo_publish_gate의 내부링크 허용 목록에 /snap/report가 없다');
});

check('사전등록 창 안에서는 첫 호를 먼저 내지 않는다', () => {
  const src = read('scorecard_reports.js');
  assert.ok(src.includes('2026-10-19'),
    '첫 호가 2026-10-19 사전등록 확정 평가라는 표시가 사라졌다 — 결과를 먼저 보고 ' +
    '발행하면 사전등록이 소멸한다');
});

console.log(`\n통과 ${passed}건${process.exitCode ? ' · 실패 있음' : ''}`);
