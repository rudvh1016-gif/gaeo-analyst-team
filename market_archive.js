(function attachMarketArchive(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GaeoMarketArchive = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createMarketArchive() {
  function hasAnalysis(market) {
    return !!(market && (
      String(market.text || '').trim() ||
      (Array.isArray(market.points) && market.points.length)
    ));
  }

  function copyEntry(day, market) {
    return {
      day,
      updated: market.updated || '',
      kospi: market.kospi || null,
      kosdaq: market.kosdaq || null,
      text: market.text || '',
      points: Array.isArray(market.points) ? market.points.slice() : [],
    };
  }

  function mergeMarketEntries(history, liveMarket) {
    const merged = {};
    Object.keys(history || {}).forEach(day => {
      const market = history[day];
      if (market && typeof market === 'object') merged[day] = copyEntry(day, market);
    });

    const liveDay = String((liveMarket && liveMarket.updated) || '').slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(liveDay) && hasAnalysis(liveMarket)) {
      merged[liveDay] = copyEntry(liveDay, liveMarket);
    }

    return Object.keys(merged).sort().reverse().map(day => merged[day]);
  }

  function paginateMarketEntries(entries, requestedPage, requestedPageSize) {
    const list = Array.isArray(entries) ? entries : [];
    const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
      ? requestedPageSize
      : 4;
    const total = list.length;
    const totalPages = Math.ceil(total / pageSize);
    const numericPage = Number.isFinite(Number(requestedPage)) ? Math.floor(Number(requestedPage)) : 1;
    const page = totalPages ? Math.min(Math.max(numericPage, 1), totalPages) : 1;
    const start = (page - 1) * pageSize;
    return { items: list.slice(start, start + pageSize), page, pageSize, total, totalPages };
  }

  return { mergeMarketEntries, paginateMarketEntries };
});
