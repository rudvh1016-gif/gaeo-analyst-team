const assert = require('node:assert/strict');

const {
  isPublishableSnapshot,
  normalizePublishedRecords,
  snapshotSlug,
  snapshotPath,
} = require('./deep_analysis_publish');

function completeSnapshot(updated, overrides = {}) {
  return {
    updated,
    base: 14370,
    baseAt: '2026-08-13 종가',
    taro: { score: 45, stance: 'bear', findings: ['기술 근거'] },
    diana: { score: 50, stance: 'neu', findings: ['재무 근거'] },
    nova: { score: 35, stance: 'bear', findings: ['확률통계 근거'] },
    flow: { score: 42, stance: 'bear', findings: ['수급 근거'] },
    chief: {
      call: 'SELL',
      total: 34,
      confidence: 65,
      reason: '종합 판단 근거입니다.',
      target: '당시 확인 구간',
      report: '공개 가능한 정밀분석 본문입니다.',
    },
    ...overrides,
  };
}

const valid = completeSnapshot('2026-08-13 21:37');
assert.equal(isPublishableSnapshot(valid), true, '완료된 정밀분석은 발행한다');
assert.equal(
  isPublishableSnapshot({ ...valid, tier: 'auto' }),
  false,
  '자동분석은 정밀분석 발행 대상이 아니다',
);
assert.equal(
  isPublishableSnapshot({ ...valid, flow: { score: 42, stance: 'bear', findings: [] } }),
  false,
  '한 축이라도 공개 근거가 없으면 발행하지 않는다',
);
assert.equal(
  isPublishableSnapshot({ ...valid, chief: { ...valid.chief, call: 'WAIT' } }),
  false,
  '기존 판단 체계 밖의 결과는 발행하지 않는다',
);

assert.equal(snapshotSlug(valid), '2026-08-13-2137');
assert.equal(
  snapshotPath({ ticker: '002990', ...valid }),
  '/research/deep-analysis/002990/2026-08-13-2137/',
);

const archive = {
  '002990': [
    completeSnapshot('2026-08-13 09:10'),
    completeSnapshot('2026-08-13 21:37'),
    completeSnapshot('2026-08-13 21:37'),
  ],
  '005930': [completeSnapshot('2026-08-12 12:15', { base: 251750 })],
  '035420': [completeSnapshot('2026-08-11 16:05', { chief: null })],
};
const tickers = [
  { code: '002990', name: '금호건설', sector: '건설·건자재' },
  { code: '005930', name: '삼성전자', sector: '반도체' },
  { code: '035420', name: 'NAVER', sector: '인터넷·IT' },
];
const records = normalizePublishedRecords(archive, tickers);

assert.equal(records.length, 3, '동일 이벤트 재시도는 하나로 합치고 완료 기록만 남긴다');
assert.deepEqual(
  records.map((record) => record.analysisCreatedAt),
  ['2026-08-13 21:37', '2026-08-13 09:10', '2026-08-12 12:15'],
  '분석 생성 시각 내림차순으로 정렬한다',
);
assert.deepEqual(
  records.filter((record) => record.ticker === '002990').map((record) => record.snapshotId),
  ['002990-2026-08-13-2137', '002990-2026-08-13-0910'],
  '같은 종목을 하루에 여러 번 분석해도 서로 다른 기록이다',
);
assert.equal(records[0].stockName, '금호건설', '기존 기록은 현재 ticker 이름으로 안전하게 보강한다');
assert.equal(records[0].sector, '건설·건자재');
assert.equal(records[0].permalink, '/research/deep-analysis/002990/2026-08-13-2137/');

const historicalIdentity = normalizePublishedRecords(
  { '002990': [completeSnapshot('2026-08-10 10:00', { stockName: '당시회사명', sector: '당시업종' })] },
  tickers,
)[0];
assert.equal(historicalIdentity.stockName, '당시회사명', 'Snapshot에 저장된 당시 종목명을 우선한다');
assert.equal(historicalIdentity.sector, '당시업종', 'Snapshot에 저장된 당시 업종을 우선한다');

console.log('deep analysis publication core tests passed');
