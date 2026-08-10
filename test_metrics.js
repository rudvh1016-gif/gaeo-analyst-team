const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

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

  const calls = [];
  const fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).startsWith('guestbook_id.json')) {
      return {
        ok: true,
        status: 200,
        async json() { return { url: 'https://kvdb.io/test-bucket' }; },
      };
    }
    if (options.method === 'PATCH') {
      return {
        ok: true,
        status: 200,
        async text() { return '1'; },
      };
    }
    return { ok: false, status: 404, async text() { return ''; } };
  };

  const context = {
    window: {},
    location: { hostname: 'gaeoteam.com' },
    localStorage: storage(),
    sessionStorage: storage(),
    fetch,
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
}

main().then(
  () => console.log('metrics tests passed'),
  error => {
    console.error(error);
    process.exitCode = 1;
  },
);
