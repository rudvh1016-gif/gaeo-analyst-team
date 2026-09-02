/**
 * 공개 배포 안전 경계 계약.
 *
 * 잡아야 하는 회귀:
 * 1) 공개 브라우저가 자격 증명을 보관하거나 GitHub/KVdb에 운영 콘텐츠를 직접 쓴다.
 * 2) 동의를 하지 않은 방문자의 이용 신호를 자체 집계 또는 제품 분석으로 보낸다.
 * 3) 로컬 초안 도구를 서버 인증 관리자 기능처럼 다시 포장한다.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const safety = require('./public_release_safety.js');
const { readAppDocument } = require('./app_test_source');

function storage(value) {
  return { getItem: key => key === 'gaeo_analytics_consent_v1' ? value : null };
}

// 사용자가 선택하지 않았거나 거부했으면 어떠한 익명 집계도 증가시키지 않는다.
assert.equal(safety.hasMeasurementConsent(storage(null)), false);
assert.equal(safety.hasMeasurementConsent(storage('denied')), false);
assert.equal(safety.hasMeasurementConsent(storage('granted')), true);

// 브라우저 발행의 결과는 네트워크 요청이 아니라 검토 가능한 PR 요청문이다.
const request = safety.buildPublishRequest({
  'site_config.js': 'const SITE_CONFIG = {};\n',
  'community.js': 'const COMMUNITY = {};\n',
});
assert.match(request, /별도 브랜치/);
assert.match(request, /계약 테스트/);
assert.match(request, /PR/);
assert.match(request, /CI/);
assert.match(request, /site_config\.js/);
assert.doesNotMatch(request, /(?:ghp_|github_pat_|Authorization|Bearer)/i);

// Production app logic is split into app.js; inspect the assembled public source so
// moving code out of index.html cannot create a static-safety blind spot.
const html = readAppDocument();

// 공개 산출물에서 다시 생기면 실제 원격 쓰기 권한이 생기는 경로들이다.
const forbidden = [
  [/https:\/\/api\.github\.com\/repos\//, '공개 페이지의 GitHub Contents API 호출'],
  [/gaeo_gh_token/, '브라우저 자격 증명 저장'],
  [/id=["']abToken["']/, 'GitHub 토큰 입력 UI'],
  [/['"]Authorization['"]\s*:\s*['"]Bearer/, '브라우저 Authorization 헤더'],
  [/fetch\([^\n]+\/post:[^\n]+method\s*:\s*['"](?:PUT|POST|DELETE)['"]/, '무인증 방문자 게시글 쓰기'],
  [/id=["'](?:gbName|gbPw|gbText|gbAdd)["']/, '공개 방문자 쓰기 폼'],
  [/(?:PWHASH|gaeo_admin_ok)/, '정적 해시를 인증으로 사용하는 가짜 관리자 경계'],
];
for (const [pattern, label] of forbidden) {
  assert.doesNotMatch(html, pattern, `${label}가 공개 산출물에 남아 있다.`);
}

// 제품 분석 로더와 자체 카운터가 같은 명시적 동의 경계를 사용한다.
const consentFlag = html.indexOf('window.GAEO_ANALYTICS_CONSENT_REQUIRED=true');
const analyticsLoader = html.indexOf('src="product_analytics.js');
assert.ok(consentFlag >= 0 && consentFlag < analyticsLoader,
  '제품 분석 동의 필요 플래그가 로더보다 먼저 설정되지 않았다.');
assert.match(html, /GaeoReleaseSafety\.hasMeasurementConsent\(localStorage\)/,
  '자체 집계 증가가 제품 분석 동의 상태를 확인하지 않는다.');
assert.doesNotMatch(html, /<script[^>]+src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js/i,
  'Google Analytics 로더가 동의 전에 정적으로 로드된다.');
assert.match(html, /function gaeoLoadAnalytics\(\)/,
  '동의 뒤에만 Google Analytics를 불러오는 로더가 없다.');

const serviceWorker = fs.readFileSync('sw.js', 'utf8');
assert.match(serviceWorker, /['"]\.\/public_release_safety\.js['"]/,
  '오프라인 셸에 안전 모듈이 없어 기존 서비스 워커 사용자가 빈 화면을 볼 수 있다.');

// 공개 정책은 실제 외부 처리자와 닫힌 방문자 게시판 상태를 설명한다.
const privacy = fs.readFileSync('privacy.html', 'utf8');
for (const provider of ['Google Analytics', 'Google AdSense', 'Kakao AdFit', 'KVdb']) {
  assert.match(privacy, new RegExp(provider), `개인정보처리방침에서 ${provider}가 빠졌다.`);
}
assert.doesNotMatch(privacy, /자유게시판 게시글.*보유 기간/s,
  '닫힌 방문자 게시판의 개인정보 보유를 계속 안내한다.');

const disclaimer = fs.readFileSync('disclaimer.html', 'utf8');
assert.match(disclaimer, /이용료|회비|구독료/,
  '이용자에게서 직접 받는 대가가 없다는 현재 사실이 빠졌다.');
assert.match(disclaimer, /광고 수익/,
  '광고 수익 가능성이 빠졌다.');
assert.match(disclaimer, /1대1|개인별/,
  '개인별 또는 쌍방향 자문이 아니라는 경계가 빠졌다.');

console.log('test_public_release_safety_gate: PASS');
