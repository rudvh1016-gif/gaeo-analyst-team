const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

assert.match(serviceWorker, /const CACHE = 'gaeo-shell-v7'/);
assert.match(serviceWorker, /\(\?:html\|css\|js\|json\)\$/);

assert.match(html, /data-nav-mode="rotation"[^>]*>순환매</);
assert.match(html, /id="mode-rotation"/);
assert.match(html, /id="rotationView"/);
assert.match(html, /rotation:\['rotation_snapshot\.js\?v=20260811-v4','rotation-ui\.js\?v=20260812-v10'\]/);
assert.match(html, /rotation\.css\?v=20260812-v9/);
assert.match(html, /m==='rotation'/);

const source = fs.readFileSync(path.join(root, 'rotation-ui.js'), 'utf8');
const context = { window: {}, console };
vm.runInNewContext(source, context);
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
    scoreChange: { status: 'ready', value: 2.4, direction: '강화', baseDate: '2026-08-09' }
  };
}
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
    interpretation: '현재 반도체에 힘이 모입니다. 종합점수 61점은 업종 간 상대 위치이며 확률이 아닙니다.',
    disclaimer: '예측 화면이 아니라 현재 흐름 참고 화면입니다.'
  },
  componentGuide: [{ key: 'momentum', label: '상승 탄력', description: '업종 수익 흐름' }],
  horizonPerformance: {
    '5': { status: 'ready', sampleCount: 80, hitRate: 43.8, averageExcessReturn: -0.43, stability: 82, recentReproduction: 30, benchmark: '500종목 업종 중앙값', periodStart: '2025-06-11', periodEnd: '2026-08-03' },
    '20': { status: 'ready', sampleCount: 251, hitRate: 53.0, averageExcessReturn: 1.19, stability: 80.5, recentReproduction: 85, benchmark: '500종목 업종 중앙값', periodStart: '2025-07-02', periodEnd: '2026-07-10' }
  },
  recommendedHorizon: { status: 'ready', horizon: 20, reason: '표본과 안정성 비교' },
  sectors: [{ name: '반도체', periods, candidateExcludedCount: 2, candidateStocks: [{ code: '005930', name: '삼성전자', taroScore: 88, taroSource: 'auto-analysis', movingAverages: { '60': 70000, '120': 68000, '200': 65000 }, volumeRatio: 1.4, volumeBaseline: { label: '직전 20거래일 일평균 대비', periodStart: '2026-01-02', periodEnd: '2026-01-21', tradingDays: 20 }, reasons: ['거래량 확인'], source: 'existing-indicators' }] }], leadLagEdges: [], similarMarkets: {}
};
const rendered = context.window.GaeoRotation.renderView(fixture, { horizon: 20, selected: '반도체' });
const workspaceStart = rendered.indexOf('<div class="rot-workspace">');
const primaryStart = rendered.indexOf('<div class="rot-primary">', workspaceStart);
const mapStart = rendered.indexOf('class="rot-panel rot-map-panel"', primaryStart);
const candidatesStart = rendered.indexOf('class="rot-panel rot-analysis rot-candidates"', mapStart);
const sideStart = rendered.indexOf('<aside class="rot-side">', candidatesStart);
assert.ok(workspaceStart >= 0 && primaryStart > workspaceStart, '데스크톱 주 열이 있어야 합니다.');
assert.ok(mapStart > primaryStart && candidatesStart > mapStart && sideStart > candidatesStart, '지도 아래 후보 종목이 오른쪽 상세 열보다 먼저 배치되어야 합니다.');
assert.match(rendered, /현재 반도체에 힘이 모입니다\./);
assert.match(rendered, /예측 화면이 아니라 현재 흐름 참고 화면입니다\./);
assert.match(rendered, /class="rot-hero-summary"[^>]*>현재 반도체에 힘이 모입니다\.<\/p>\s*<p class="rot-hero-score-note"[^>]*>종합점수 61점은 업종 간 상대 위치이며 확률이 아닙니다\.<\/p>/);
assert.doesNotMatch(rendered, /모델 rotation-shadow-v2/);
assert.match(rendered, /현재 1위 업종 · 추천 20거래일 기준/);
assert.match(rendered, /다음 관찰 후보 · 추천 20거래일 기준/);
assert.match(rendered, /계산기간 2026\.01\.02~2026\.01\.22/);
assert.match(rendered, /단기 참고 · 5거래일 1위 화장품·미용/);
assert.match(rendered, /<span>시장 국면 · 최근 20거래일<\/span><strong>하락 · 확대<\/strong>/);
assert.doesNotMatch(rendered, /시장 국면 · 방향·변동성·주도시장/);
assert.match(rendered, /최근 5거래일 상승 종목 비율 90\.2%/);
assert.doesNotMatch(rendered, /상승 폭/);
assert.match(rendered, /점수는 확률이 아닙니다/);
assert.match(rendered, /기간별 과거 성과/);
assert.match(rendered, /추천 관찰 기간/);
assert.match(rendered, /신호 다음 거래일부터 약 4주/);
assert.match(rendered, /검증기간 2025\.07\.02~2026\.07\.10 · 중첩 평가 251회/);
assert.match(rendered, /장기 추세 참고/);
assert.match(rendered, /삼성전자/);
assert.match(rendered, /실제 TARO 88/);
assert.match(rendered, /오늘 거래량 1\.40배/);
assert.match(rendered, /직전 20거래일 일평균 대비 · 2026\.01\.02~2026\.01\.21/);
assert.match(rendered, /200일선/);
assert.match(rendered, /지표 누락 2종목 제외/);
assert.match(rendered, /class="rot-help"/);
assert.match(rendered, /data-tip="업종 수익 흐름"/);
assert.match(rendered, /aria-label="상승 탄력 설명: 업종 수익 흐름"/);
assert.match(rendered, /class="rot-accumulation-note"/);
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

const css = fs.readFileSync(path.join(root, 'rotation.css'), 'utf8');
assert.match(css, /\.rot-help\{/);
assert.match(css, /\.rot-accumulation-note\{/);
assert.match(css, /\.rot-metric-explanation\{/);
assert.match(css, /\.rot-summary\{[^}]*grid-template-columns:1\.35fr repeat\(4,minmax\(0,1fr\)\)/);

console.log('rotation UI contract passed');
