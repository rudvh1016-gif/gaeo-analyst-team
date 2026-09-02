const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const releaseSafety = require('./public_release_safety.js');

function storage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

async function main() {
  const html = fs.readFileSync('index.html', 'utf8');
  const source = html.match(/<script>\s*([\s\S]*?window\.GaeoMetrics[\s\S]*?\n\s*\}\)\(\);)/);
  assert.ok(source, 'GaeoMetrics inline script should exist');

  // kvdb를 흉내내는 가짜 버킷. mode로 실패 상황을 갈아끼운다.
  //   'patch'   - PATCH +1이 정상 동작 (원래 가정)
  //   'no-patch'- PATCH가 막혀 있고 PUT만 된다 (실제 증상으로 의심되는 상황)
  //   'read-only' - 쓰기가 전부 막혀 있다
  function makeFetch(mode, seed) {
    const calls = [];
    const store = new Map(Object.entries(seed || {}));
    const fetch = async (url, options = {}) => {
      calls.push({ url: String(url), options });
      if (String(url).startsWith('guestbook_id.json')) {
        return { ok: true, status: 200, async json() { return { url: 'https://kvdb.io/test-bucket' }; } };
      }
      const key = decodeURIComponent(String(url).replace('https://kvdb.io/test-bucket/', ''));
      const method = options.method || 'GET';
      if (method === 'PATCH') {
        if (mode !== 'patch') return { ok: false, status: 405, async text() { return ''; } };
        store.set(key, String((Number(store.get(key)) || 0) + 1));
        return { ok: true, status: 200, async text() { return store.get(key); } };
      }
      if (method === 'PUT') {
        if (mode === 'read-only') return { ok: false, status: 403, async text() { return ''; } };
        store.set(key, String(options.body));
        return { ok: true, status: 200, async text() { return store.get(key); } };
      }
      if (!store.has(key)) return { ok: false, status: 404, async text() { return ''; } };
      return { ok: true, status: 200, async text() { return store.get(key); } };
    };
    return { fetch, calls, store };
  }

  const primary = makeFetch('patch');
  const calls = primary.calls;
  const fetch = primary.fetch;

  const makeContext = (f, consent = 'granted') => {
    const local = storage();
    if (consent) local.setItem(releaseSafety.CONSENT_KEY, consent);
    return {
      window: { GaeoReleaseSafety: releaseSafety },
      location: { hostname: 'gaeoteam.com' },
      localStorage: local,
      sessionStorage: storage(),
      fetch: f,
      Date,
      Map,
      Math,
      JSON,
      Number,
      Promise,
      String,
      setTimeout,
      clearTimeout,
    };
  };
  const context = makeContext(fetch);
  vm.runInNewContext(source[1], context, { filename: 'index.html' });

  const visit = await context.window.GaeoMetrics.startVisit();
  assert.equal(visit.total, 940, 'the first migrated visit should build on the verified 939 total');
  assert.equal(visit.today, 1, 'the first visit of the day should be counted');

  const totalCall = calls.find(call => call.url === 'https://kvdb.io/test-bucket/metrics%3Asite-visits');
  assert.ok(totalCall, 'the total counter should use the shared KVdb bucket');
  assert.equal(totalCall.options.method, 'PATCH');
  assert.equal(totalCall.options.body, '+1');

  const newDeviceCalls = calls.filter(call => call.url.includes('-new-device'));
  assert.equal(
    newDeviceCalls.length,
    1,
    'a first visit should not start a read that is immediately abandoned'
  );
  assert.equal(newDeviceCalls[0].options.method, 'PATCH');

  /* ⭐ 회귀 방지 (2026-08-20): 예전 테스트는 PATCH가 성공하는 경우만 모의해서,
     "쓰기가 실패하면 읽기까지 같이 죽어 화면이 939+ 폴백에 갇힌다"는 구조적 약점을
     전혀 건드리지 못했다. 실패 모드를 넣어 그 경로를 덮는다. */

  // ① PATCH가 막혀 있어도 PUT 폴백으로 실제 증가해야 한다.
  {
    const m = makeFetch('no-patch');
    const ctx = makeContext(m.fetch);
    vm.runInNewContext(source[1], ctx, { filename: 'index.html' });
    const v = await ctx.window.GaeoMetrics.startVisit();
    assert.equal(v.total, 940, 'PATCH가 막혀도 PUT 폴백으로 증가해야 한다');
    assert.equal(v.exactTotal, true, '폴백으로 성공했으면 정확한 값으로 표시해야 한다');
    assert.equal(m.store.get('metrics:site-visits'), '1', '키가 실제로 만들어져야 한다');
    assert.ok(
      m.calls.some(c => (c.options.method || 'GET') === 'PUT'),
      'PATCH 실패 시 PUT으로 폴백해야 한다'
    );
  }

  // ② 이미 값이 쌓여 있으면 그 위에 이어서 올라가야 한다.
  {
    const m = makeFetch('no-patch', { 'metrics:site-visits': '41' });
    const ctx = makeContext(m.fetch);
    vm.runInNewContext(source[1], ctx, { filename: 'index.html' });
    const v = await ctx.window.GaeoMetrics.startVisit();
    assert.equal(v.total, 981, '939 + (41 + 1) 이어야 한다');
    assert.equal(m.store.get('metrics:site-visits'), '42');
  }

  // ③ 쓰기가 전부 막혀도 "읽기"는 살아야 한다. 예전에는 쓰기가 실패하면
  //    읽기까지 같이 죽어, 저장값이 있어도 화면이 939+ 폴백으로 떨어졌다.
  {
    const m = makeFetch('read-only', { 'metrics:site-visits': '41' });
    const ctx = makeContext(m.fetch);
    vm.runInNewContext(source[1], ctx, { filename: 'index.html' });
    const v = await ctx.window.GaeoMetrics.startVisit();
    assert.equal(v.total, 980, '증가에 실패해도 저장된 값(939+41)은 읽어야 한다');
    assert.equal(v.exactTotal, true, '읽기에 성공했으면 939+ 폴백으로 떨어지면 안 된다');
  }

  // ④ 명시적 동의가 없으면 기존 합계를 읽을 수는 있어도 증가 요청은 보내지 않는다.
  {
    const m = makeFetch('patch', { 'metrics:site-visits': '41' });
    const ctx = makeContext(m.fetch, null);
    vm.runInNewContext(source[1], ctx, { filename: 'index.html' });
    const v = await ctx.window.GaeoMetrics.startVisit();
    assert.equal(v.total, 980, '동의 전에도 공개된 기존 합계는 읽어 표시한다');
    assert.equal(
      m.calls.filter(c => ['PATCH', 'PUT', 'POST', 'DELETE'].includes(c.options.method || 'GET')).length,
      0,
      '동의 전에는 KVdb 쓰기 요청이 없어야 한다'
    );
    assert.equal(ctx.localStorage.getItem('gaeo_first_seen'), null,
      '동의 전에 새 기기 식별용 로컬 상태를 만들지 않는다');
  }
}

main().then(
  () => console.log('metrics tests passed'),
  error => {
    console.error(error);
    process.exitCode = 1;
  },
);
