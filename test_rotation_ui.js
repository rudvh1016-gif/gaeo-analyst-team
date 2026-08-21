const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

// 캐시 버전은 배포마다 올라간다. 특정 숫자를 못박으면 버전을 올릴 때마다 테스트가
// 낡으므로, "버전 형식이 유지되고 v12 아래로 되돌아가지 않는다"만 검증한다.
const cacheVersion = serviceWorker.match(/const CACHE = 'gaeo-shell-v(\d+)'/);
assert.ok(cacheVersion, 'sw.js must declare a gaeo-shell-vN cache name');
assert.ok(Number(cacheVersion[1]) >= 12, 'service worker cache version must not roll back below v12');
assert.match(serviceWorker, /\(\?:html\|css\|js\|json\)\$/);

assert.match(html, /data-nav-mode="rotation"[^>]*>순환매</);
assert.match(html, /id="mode-rotation"/);
assert.match(html, /id="rotationView"/);
// ⚠️ 캐시 버전이 박힌 곳이 test_rotation_refinement_browser.js에도 있다. 올릴 때 둘 다 고칠 것.
assert.match(html, /rotation:\['rotation_snapshot\.js\?v=20260812-v6','rotation-ui\.js\?v=20260821-v16'\]/);
// ⚠️ CSS를 고치면 이 버전을 올려야 재방문자가 옛 스타일을 계속 보지 않는다.
//    (2026-08-18 sweep 전까지 이 줄이 v12에 멈춰 있어 테스트가 깨진 상태였다)
assert.match(html, /rotation\.css\?v=20260821-v20/);
assert.match(html, /m==='rotation'/);

const source = fs.readFileSync(path.join(root, 'rotation-ui.js'), 'utf8');
const context = { window: {}, console };
vm.runInNewContext(source, context);
const snapshotContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'rotation_snapshot.js'), 'utf8'), snapshotContext);
const snapshot = snapshotContext.window.ROTATION_SNAPSHOT;
const snapshotLeader = snapshot.sectors.find(sector => sector.name === snapshot.summary.leaders[0].name);
// 스냅샷의 '당시 숫자'(예: 79.1점)를 못박으면 시세가 갱신될 때마다 테스트가 낡는다.
// 검증할 불변식은 "요약 카드가 쓰는 필드가 올바른 구조·형식으로 존재한다"이다.
const validHorizons = [1, 3, 5, 20, 60, 120, 200];
assert.ok(validHorizons.includes(snapshot.recommendedHorizon.horizon), 'recommended horizon must be a real observation window');
const leaderHorizonKey = String(snapshot.recommendedHorizon.horizon);
assert.ok(Number.isFinite(snapshotLeader.periods[leaderHorizonKey].score), 'leader must carry a numeric score for the recommended horizon');
assert.ok(Number.isFinite(snapshotLeader.periods['1'].return.adjusted), 'leader must carry a numeric adjusted 1-day return');
assert.ok(Number.isFinite(snapshotLeader.periods['1'].relativeStrength), 'leader must carry numeric 1-day relative strength');
assert.ok(Number.isFinite(snapshotLeader.periods['1'].breadth.adjustedUpRate), 'leader must carry numeric adjusted up-rate');
assert.strictEqual(typeof context.window.GaeoRotation.formatPercent, 'function');
assert.strictEqual(context.window.GaeoRotation.formatPercent(3.456), '+3.5%');
assert.strictEqual(context.window.GaeoRotation.formatPercent(-1.24), '-1.2%');
assert.strictEqual(context.window.GaeoRotation.confidenceLabel('high', false), '검증 중');
assert.strictEqual(context.window.GaeoRotation.confidenceLabel('moderate', false), '중간');

const periods = {};
for (const horizon of [1, 3, 5, 20, 60, 120, 200]) {
  periods[String(horizon)] = {
    score: 61, signal: '관찰 후보', confidence: '보통', validCount: 20,
    return: { adjusted: 2.1 }, breadth: { adjustedUpRate: 60 },
    flow: { medianRelativeVolume: 1.1 }, taro: { score: 55 },
    concentration: { top3: 20 }, components: { momentum: 70, flow: 60 },
    scoreExplanation: { meaning: '24개 업종 상대 위치이며 확률이 아닙니다.', weights: { momentum: .5, flow: .5 }, contributions: { momentum: 35, flow: 30 } },
    modelAgreement: { positive: 5, total: 8, label: '다수 지표 동의' },
    scoreChange: { status: 'ready', value: 2.4, direction: '강화', baseDate: '2026-08-09', previousScore: 58.6, currentScore: 61, componentStatus: 'ready', componentDeltas: { momentum: 1.5, flow: .9 } }
  };
}
periods['1'] = {
  ...periods['1'],
  score: 48.6,
  signal: '관찰',
  return: { adjusted: -1.24 },
  relativeStrength: -4.33,
  breadth: { adjustedUpRate: 25.8 },
  scoreChange: { status: 'ready', value: -3.1, direction: '약화', baseDate: '2026-08-09', previousScore: 51.7, currentScore: 48.6, componentStatus: 'ready', componentDeltas: { momentum: -1.8, breadth: -1.3 } }
};
const fixture = {
  generatedAt: '2026-08-10 16:10', dataCutoff: '2026-08-10 종가',
  universe: { valid: 20, configured: 20 }, model: { highConfidenceUnlocked: false, version: 'rotation-shadow-v2' },
  marketRegime: {
    direction: '하락', volatility: '확대', leadership: 'KOSDAQ', breadthRate: 90.2,
    directionPeriod: { periodStart: '2026-01-02', periodEnd: '2026-01-22', tradingDays: 20 },
    breadthPeriod: { periodStart: '2026-01-17', periodEnd: '2026-01-22', tradingDays: 5 }
  }, summary: {
    horizon: 20,
    period: { periodStart: '2026-01-02', periodEnd: '2026-01-22', tradingDays: 20 },
    shortTerm: { horizon: 5, name: '화장품·미용', score: 69.3, signal: '주도', period: { periodStart: '2026-01-17', periodEnd: '2026-01-22', tradingDays: 5 } },
    leaders: [{ name: '반도체', score: 61, signal: '관찰 후보' }],
    candidate: { name: '바이오·제약', score: 59.4, signal: '관찰 후보' },
    candidateObservationPeriod: { periodStart: '2026-08-12', periodEnd: '2026-09-09', tradingDays: 20 },
    interpretation: '현재 반도체에 힘이 모입니다. 종합점수 61점은 업종 간 상대 위치이며 확률이 아닙니다.',
    disclaimer: '예측 화면이 아니라 현재 흐름 참고 화면입니다.'
  },
  componentGuide: [{ key: 'momentum', label: '상승 탄력', description: '업종 수익 흐름' }],
  horizonPerformance: {
    '5': { status: 'ready', sampleCount: 80, hitRate: 43.8, averageExcessReturn: -0.43, stability: 82, recentReproduction: 30, benchmark: '500종목 업종 중앙값', periodStart: '2025-06-11', periodEnd: '2026-08-03' },
    '20': { status: 'ready', sampleCount: 251, hitRate: 53.0, averageExcessReturn: 1.19, stability: 80.5, recentReproduction: 85, benchmark: '500종목 업종 중앙값', periodStart: '2025-07-02', periodEnd: '2026-07-10' }
  },
  recommendedHorizon: { status: 'ready', horizon: 20, reason: '표본과 안정성 비교' },
  sectors: [{ name: '반도체', configuredCount: 20, validCount: 20, sampleReliability: '높음', periods, candidateExcludedCount: 2, candidateStocks: [{ code: '005930', name: '삼성전자', price: 80000, taroScore: 88, taroSource: 'auto-analysis', rotationRankScore: 84, rotationRankReasons: ['TARO 기술 확인','거래량 증가'], movingAverages: { '20': 72000, '60': 70000, '120': 68000, '200': 65000 }, maStatus: { '20': '20일선 위', '60': '60일선 위', '120': '120일선 위', '200': '200일선 위' }, volumeRatio: 1.4, volumeBaseline: { label: '직전 20거래일 일평균 대비', periodStart: '2026-01-02', periodEnd: '2026-01-21', tradingDays: 20 }, reasons: ['거래량 확인'], overheat: false, source: 'existing-indicators' }] }], leadLagEdges: [], similarMarkets: { horizon: 20, bySector: { '반도체': { status: 'ready', periodStart: '2021-01-04', periodEnd: '2026-01-02', tradingDays: 1230, horizon: 20, benchmark: '500종목 업종 중앙값', successDefinition: '향후 20거래일 업종수익률 > 500종목 업종 중앙값', sampleCount: 3, successCount: 2, failureCount: 1, reproductionRate: 66.7, averageExcessReturn: 1.2, medianExcessReturn: .9, currentSimilarity: 81, sampleReliability: '낮음', cases: [] } } }
};
const rendered = context.window.GaeoRotation.renderView(fixture, { horizon: 20, selected: '반도체' });
const shortRendered = context.window.GaeoRotation.renderView(fixture, { horizon: 5, selected: '반도체' });
assert.match(shortRendered, /선택 5거래일/);
assert.doesNotMatch(shortRendered, /권장 5거래일/);
assert.match(shortRendered, /권장 기간<\/span><strong>20거래일/);
const today = context.window.GaeoRotation.todayView(fixture.sectors[0]);
assert.strictEqual(today.state, '약화');
assert.strictEqual(today.returnValue, -1.24);
assert.strictEqual(today.relativeStrength, -4.33);
assert.strictEqual(today.breadth, 25.8);
const workspaceStart = rendered.indexOf('<div class="rot-workspace">');
const primaryStart = rendered.indexOf('<div class="rot-primary">', workspaceStart);
const mapStart = rendered.indexOf('class="rot-panel rot-map-panel"', primaryStart);
const candidatesStart = rendered.indexOf('class="rot-panel rot-analysis rot-candidates"', mapStart);
const sideStart = rendered.indexOf('<aside class="rot-side">', mapStart);
assert.ok(workspaceStart >= 0 && primaryStart > workspaceStart, '데스크톱 주 열이 있어야 합니다.');
assert.ok(mapStart > primaryStart && sideStart > mapStart, '지도와 오른쪽 상세 열이 유지되어야 합니다.');
assert.match(rendered, /현재 반도체에 힘이 모입니다\./);
assert.match(rendered, /예측 화면이 아니라 현재 흐름 참고 화면입니다\./);
assert.match(rendered, /class="rot-hero-summary"[^>]*>현재 반도체에 힘이 모입니다\.<\/p>\s*<p class="rot-hero-score-note"[^>]*>종합점수 61점은 업종 간 상대 위치이며 확률이 아닙니다\.<\/p>/);
assert.doesNotMatch(rendered, /모델 rotation-shadow-v2/);
assert.match(rendered, /현재 1위 업종 · 권장 20거래일 기준/);
assert.match(rendered, /다음 관찰 후보 · 권장 20거래일 기준/);
for (const className of ['rot-card-context','rot-card-primary','rot-card-secondary','rot-card-measure','rot-meta','rot-meta-block']) {
  assert.match(rendered, new RegExp(`class="[^"]*${className}`), `${className} summary hierarchy is required`);
}
assert.match(rendered, /class="rot-card rot-card-lead"[\s\S]*?<strong class="rot-card-primary">반도체 순환 신호<\/strong>/);
assert.match(rendered, /class="rot-card rot-card-today"[\s\S]*?<strong class="rot-card-primary rot-card-subject">반도체<\/strong>[\s\S]*?-1\.2% · 약화/);
assert.match(rendered, /구성 종목 중앙값 등락 · 표본 보정/);
assert.doesNotMatch(rendered, /-1\.2% · 약화<\/strong><small>반도체/);
assert.match(rendered, /<dt>계산기간<\/dt><dd>2026\.01\.02~2026\.01\.22<\/dd>/);
assert.match(rendered, /<dt>예상 관찰기간<\/dt><dd>2026\.08\.12~2026\.09\.09/);
assert.match(rendered, /<dt>검증기간<\/dt><dd>2025\.07\.02~2026\.07\.10<\/dd>/);
assert.match(rendered, /<dt>종합 평가<\/dt><dd>251회<\/dd>/);
assert.match(rendered, /<dt>단기 참고<\/dt><dd>5거래일 1위 · 화장품·미용<small>2026\.01\.17~2026\.01\.22<\/small><\/dd>/);
assert.match(rendered, /<dt>최근 5거래일 상승 종목 비율<\/dt><dd>90\.2%<\/dd>/);
assert.match(rendered, /<dt>예상 관찰기간<\/dt><dd>2026\.08\.12~2026\.09\.09<small>20거래일 · 휴장일 제외<\/small><\/dd>/);
assert.doesNotMatch(rendered, /1위 전환 예상일/);
assert.match(rendered, /<dt>계산기간<\/dt><dd>2026\.01\.02~2026\.01\.22<\/dd>/);
assert.match(rendered, /<dt>단기 참고<\/dt><dd>5거래일 1위 · 화장품·미용/);
assert.match(rendered, /<span class="rot-card-context">시장 국면 · 최근 20거래일<\/span><strong class="rot-card-primary">하락 · 확대<\/strong>/);
assert.doesNotMatch(rendered, /시장 국면 · 방향·변동성·주도시장/);
assert.match(rendered, /<dt>최근 5거래일 상승 종목 비율<\/dt><dd>90\.2%<\/dd>/);
assert.doesNotMatch(rendered, /상승 폭/);
assert.match(rendered, /점수는 확률이 아닙니다/);
assert.match(rendered, /61\.0점은 반도체가 오를 확률 61\.0%라는 뜻이 아닙니다/);
assert.match(rendered, /왜 이 업종을 보고 있나요\?/);
assert.match(rendered, /왜 61\.0점인가요\?/);
assert.match(rendered, /매우 강함|강함|보통|약함/);
assert.match(rendered, /전일 종합점수/);
assert.match(rendered, /현재 종합점수/);
assert.match(rendered, /2026-08-09 종가 → 2026-08-10 종가/);
assert.match(rendered, /이번 점수 상승을 만든 주요 변화/);
assert.match(rendered, /종합점수는 전일 58\.6점에서 61\.0점으로 2\.4점 상승했습니다/);
assert.match(rendered, /어디에서 흐름이 이어지고 있나요\?/);
assert.match(rendered, /뚜렷한 순환 연결이 아직 없습니다/);
assert.match(rendered, /비슷한 시장에서는 어땠나요\?/);
assert.match(rendered, /성공 2회/);
assert.match(rendered, /실패 1회/);
assert.match(rendered, /성공 기준/);
assert.match(rendered, /이 업종에서 함께 볼 종목/);
assert.match(rendered, /관찰순위 84\.0/);
assert.match(rendered, /20일선 위/);
assert.match(rendered, /어떻게 볼까요\?/);
assert.match(rendered, /현재 기준 종합의견/);
assert.match(rendered, /시장 국면/);
assert.match(rendered, /관심 종목/);
assert.match(rendered, /유사사례 2\/3 성공/);
assert.match(rendered, /긍정 요인/);
assert.match(rendered, /확인할 점/);
assert.match(rendered, /기간별 과거 성과/);
assert.match(rendered, /권장 관찰 기간/);
assert.match(rendered, /신호 다음 거래일부터 약 4주/);
assert.match(rendered, /<dt>검증기간<\/dt><dd>2025\.07\.02~2026\.07\.10<\/dd>/);
assert.match(rendered, /<dt>종합 평가<\/dt><dd>251회<\/dd>/);
assert.match(rendered, /장기 추세 참고/);
assert.match(rendered, /삼성전자/);
assert.match(rendered, /실제 TARO 88/);
assert.match(rendered, /오늘 거래량 1\.40배/);
assert.match(rendered, /직전 20거래일 일평균 대비 · 2026\.01\.02~2026\.01\.21/);
assert.match(rendered, /200일선/);
assert.match(rendered, /지표 누락 2종목 제외/);
assert.match(rendered, /class="rot-help"/);
assert.match(rendered, /업종의 순환 흐름을 한눈에/);
assert.match(rendered, /오늘의 변화/);
assert.match(rendered, /오늘 -1\.2% · 약화/);
assert.match(rendered, /20거래일 종합 1위/);
assert.match(rendered, /data-horizon="20"[^>]*>20일<small>권장<\/small><\/button>/);
assert.match(rendered, /class="rot-today"/);
assert.match(rendered, /<dt>오늘 업종 등락<\/dt><dd><strong>-1\.2%<\/strong>/);
assert.match(rendered, /<dt>오늘 시장 대비<\/dt><dd><strong>-4\.3%<\/strong>/);
assert.match(rendered, /<dt>오늘 점수 변화<\/dt><dd><strong>-3\.1점<\/strong>/);
assert.match(rendered, /20거래일 흐름은[^<]*(?:강하지만|관찰이 필요하고)[^<]*오늘은[^<]*약화/);
assert.match(rendered, /data-tip="선택 기간 동안 업종 구성 종목의 가격 흐름/);
assert.match(rendered, /aria-label="상승 탄력 설명: 선택 기간 동안 업종 구성 종목의 가격 흐름/);
assert.match(rendered, /class="rot-accumulation-note"/);

/* 🔽 접이식 심화 섹션 (2026-08-20) — "박스가 너무 많다"는 지적에 대한 계약.
   ⚠️ 핵심: 접는 것이지 지우는 게 아니다. 안쪽 알맹이는 그대로 있어야 한다. */
['score', 'evidence', 'how', 'current', 'performance', 'note'].forEach(key => {
  assert.match(rendered, new RegExp(`data-fold="${key}"`), `접이식 섹션 누락: ${key}`);
});
// 기본은 접힌 상태다(state.open 없이 그린 화면에 open 속성이 붙으면 안 된다).
assert.ok(!/data-fold="[a-z]+" open/.test(rendered), '접이식 섹션은 기본이 접힘이어야 한다');
// 접었다고 내용이 사라지면 안 된다.
assert.match(rendered, /class="rot-performance-grid"/);
assert.match(rendered, /class="rot-metric-explanation"/);
// 매일 보는 정보(함께 볼 종목)는 접지 않고 심화 영역 맨 앞에 그대로 둔다.
assert.match(rendered, /class="rot-analysis-grid"><section class="rot-panel rot-analysis rot-candidates"/);
// 열어 둔 섹션은 다시 그려도 열린 채로 유지된다(기간·업종 변경 시 닫히면 안 된다).
const reopened = context.window.GaeoRotation.renderView(
  fixture, { horizon: 20, selected: '반도체', open: new Set(['performance']) });
assert.match(reopened, /data-fold="performance" open/);
assert.ok(!/data-fold="score" open/.test(reopened), '열지 않은 섹션까지 열리면 안 된다');
assert.match(rendered, /class="rot-overlap-explanation"/);
assert.match(rendered, /중첩 평가란\?/);
assert.match(rendered, /매 거래일마다 당시까지의 최근 20거래일로 1위 업종을 다시 선정한 뒤/);
assert.match(rendered, /그다음 20거래일 동안 시장 업종 중앙값보다 높은 수익을 냈는지 확인하는 방식입니다/);
assert.match(rendered, /평가를 하루씩 이동해 반복하므로 서로 겹치는 관찰기간이 포함됩니다/);
assert.match(rendered, /251회는 거래일 수나 서로 독립된 투자 횟수가 아니라, 이렇게 평가한 시작일 251개의 결과입니다/);
assert.match(rendered, /class="rot-metric-explanation"[^>]*aria-label="과거 성과 지표 설명"/);
assert.match(rendered, /<strong>지표 읽는 법<\/strong>/);
assert.match(rendered, /<dt>적중률<\/dt><dd>전체 중첩 평가 중 당시 1위 업종이 이후 관찰기간에 500종목 업종 중앙값보다 높은 수익을 낸 비율/);
assert.match(rendered, /<dt>안정성<\/dt><dd>검증기간을 앞뒤 절반으로 나눈 두 적중률의 차이를 100에서 뺀 일관성 점수/);
assert.match(rendered, /안정성 80은 적중률 80%라는 뜻이 아니며/);
assert.match(rendered, /<dt>최근 재현<\/dt><dd>가장 최근 20개 평가 시작점만 따로 계산한 적중률/);
assert.match(rendered, /<dt>평균 초과<\/dt><dd>각 평가에서 1위 업종 수익률과 500종목 업종 중앙값 수익률의 차이를 구한 뒤 전체 평균한 값/);
assert.match(rendered, /장 마감 후 저장되는 업종별 점수/);
assert.match(rendered, /보통 다음 거래일 마감 뒤부터/);
assert.match(rendered, /20거래일 성과는 약 4주/);
for (const horizon of [60, 120, 200]) {
  assert.match(rendered, new RegExp(`data-horizon="${horizon}"[^>]*>${horizon}일</button>`));
}

const mobileContext = { window: { matchMedia: () => ({ matches: true }) }, console };
vm.runInNewContext(source, mobileContext);
const mobileRendered = mobileContext.window.GaeoRotation.renderView(fixture, { horizon: 20, selected: '반도체' });
assert.match(mobileRendered, /viewBox="0 0 620 620"/);
assert.match(mobileRendered, /<circle r="34"><\/circle>/);

const desktopLayout = context.window.GaeoRotation.mapLayout();
assert.strictEqual(desktopLayout.viewBox, '0 0 720 660');
assert.ok(desktopLayout.radii.every(radius => radius.rx && radius.ry));
assert.match(rendered, /<ellipse class="rot-orbit"/);

const css = fs.readFileSync(path.join(root, 'rotation.css'), 'utf8');
assert.match(css, /\.rot-help\{/);
assert.match(css, /\.rot-accumulation-note\{/);
assert.match(css, /\.rot-metric-explanation\{/);
assert.match(css, /\.rot-summary\{[^}]*grid-template-columns:1\.3fr repeat\(5,minmax\(0,1fr\)\)/);
assert.match(css, /\.rot-card-context\{[^}]*font-size:11px[^}]*font-weight:600/);
// 2026-08-18 sweep: 굵기 단계를 400/500/600 세 가지로 통일했다(650 폐지).
assert.match(css, /\.rot-card-primary\{[^}]*font-size:20px[^}]*font-weight:600/);
assert.match(css, /\.rot-card-secondary\{[^}]*font-size:12px[^}]*font-weight:400/);
assert.match(css, /\.rot-meta-block\+\.rot-meta-block\{[^}]*margin-top:12px/);
assert.match(css, /\.rot-meta dt\{[^}]*font-size:11px[^}]*font-weight:600/);
assert.match(css, /\.rot-meta dd\{[^}]*font-size:11px[^}]*font-weight:400/);
assert.match(css, /\.rot-meta-inline\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:600px\)\{[\s\S]*?\.rot-card\{[^}]*padding:20px 16px/);
assert.doesNotMatch(css, /\.rot-(?:summary|card)[^{]*\{[^}]*(?:linear-gradient|box-shadow)/);
assert.match(css, /\.rot-map\{[^}]*min-height:620px/);

console.log('rotation UI contract passed');
