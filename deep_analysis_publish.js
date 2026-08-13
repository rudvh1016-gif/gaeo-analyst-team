const BASE_PATH = '/research/deep-analysis';
const AXES = ['taro', 'diana', 'nova', 'flow'];
const CALLS = new Set(['BUY', 'HOLD', 'SELL']);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizedMinute(value) {
  const match = text(value).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
  return match ? `${match[1]} ${match[2]}:${match[3]}` : '';
}

function snapshotSlug(snapshot) {
  const minute = normalizedMinute(snapshot && (snapshot.analysisCreatedAt || snapshot.updated));
  if (!minute) return '';
  return minute.replace(' ', '-').replace(':', '');
}

function snapshotPath(record) {
  const ticker = text(record && (record.ticker || record.code));
  const slug = snapshotSlug(record);
  return /^\d{6}$/.test(ticker) && slug ? `${BASE_PATH}/${ticker}/${slug}/` : '';
}

function validAxis(axis) {
  return axis && Number.isFinite(Number(axis.score)) &&
    ['bull', 'neu', 'bear'].includes(axis.stance) &&
    Array.isArray(axis.findings) && axis.findings.some((finding) => text(finding));
}

function isPublishableSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return false;
  if (snapshot.tier === 'auto' || snapshot.mock || snapshot.fixture || snapshot.test ||
      snapshot.incomplete || snapshot.corrupted || snapshot.status === 'failed') return false;
  if (!normalizedMinute(snapshot.analysisCreatedAt || snapshot.updated)) return false;
  if (!Number.isFinite(Number(snapshot.base)) || Number(snapshot.base) <= 0 || !text(snapshot.baseAt)) return false;
  if (!AXES.every((key) => validAxis(snapshot[key]))) return false;
  const chief = snapshot.chief;
  return Boolean(chief && CALLS.has(chief.call) &&
    Number.isFinite(Number(chief.total)) && Number.isFinite(Number(chief.confidence)) &&
    text(chief.reason || chief.report));
}

function tickerLookup(tickers) {
  const map = new Map();
  const list = Array.isArray(tickers) ? tickers : Object.values(tickers || {});
  list.forEach((ticker) => {
    const code = text(ticker && (ticker.code || ticker.ticker));
    if (code) map.set(code, ticker);
  });
  return map;
}

function publicAxis(axis) {
  const result = {
    score: Number(axis.score),
    stance: axis.stance,
    findings: axis.findings.map(text).filter(Boolean),
  };
  if (Array.isArray(axis.sources)) {
    result.sources = axis.sources.map((source) => ({
      t: text(source && source.t),
      p: text(source && source.p),
      d: text(source && source.d),
      u: text(source && source.u),
    })).filter((source) => source.t || source.u);
  }
  return result;
}

function publicChief(chief) {
  return {
    call: chief.call,
    total: Number(chief.total),
    confidence: Number(chief.confidence),
    reason: text(chief.reason),
    target: text(chief.target),
    report: text(chief.report),
    modelVersion: text(chief.modelVersion),
  };
}

function normalizePublishedRecords(archive, tickers) {
  const tickerMap = tickerLookup(tickers);
  const records = new Map();
  Object.entries(archive || {}).forEach(([ticker, snapshots]) => {
    if (!/^\d{6}$/.test(ticker) || !Array.isArray(snapshots)) return;
    const current = tickerMap.get(ticker) || {};
    snapshots.forEach((snapshot) => {
      if (!isPublishableSnapshot(snapshot)) return;
      const analysisCreatedAt = normalizedMinute(snapshot.analysisCreatedAt || snapshot.updated);
      const snapshotId = `${ticker}-${snapshotSlug({ analysisCreatedAt })}`;
      const normalized = {
        snapshotId,
        ticker,
        stockName: text(snapshot.stockName) || text(current.name) || ticker,
        sector: text(snapshot.sector) || text(current.sector),
        analysisCreatedAt,
        updated: text(snapshot.updated) || analysisCreatedAt,
        dateModified: text(snapshot.dateModified) || analysisCreatedAt,
        base: Number(snapshot.base),
        baseAt: text(snapshot.baseAt),
        taro: publicAxis(snapshot.taro),
        diana: publicAxis(snapshot.diana),
        nova: publicAxis(snapshot.nova),
        flow: publicAxis(snapshot.flow),
        chief: publicChief(snapshot.chief),
      };
      normalized.permalink = snapshotPath(normalized);
      records.set(snapshotId, normalized);
    });
  });
  return [...records.values()].sort((a, b) =>
    b.analysisCreatedAt.localeCompare(a.analysisCreatedAt) || a.ticker.localeCompare(b.ticker));
}

module.exports = {
  BASE_PATH,
  AXES,
  isPublishableSnapshot,
  normalizePublishedRecords,
  snapshotSlug,
  snapshotPath,
};
