// Canonical-only sitemap generator. Dates come from stored production/content data or Git.
// There is deliberately no "today" fallback: a missing date is either omitted or an error.
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { contentUrl } = require('./growth_urls.js');

const BASE = 'https://gaeoteam.com/';
const HUMAN_SOURCES = [
  { file: 'news_analysis.js', variable: 'NEWS_ANALYSIS', mode: 'news', priority: '0.7' },
  { file: 'stock_study.js', variable: 'STOCK_STUDY', mode: 'study', priority: '0.6' },
  { file: 'stock_lessons.js', variable: 'STOCK_LESSONS', mode: 'lesson', priority: '0.6' },
  { file: 'estate_lessons.js', variable: 'ESTATE_LESSONS', mode: 'estate', priority: '0.6' },
  { file: 'calculators.js', variable: 'CALCULATORS', mode: 'calc', priority: '0.5' },
];

function requireDate(value, label) {
  const text = String(value == null ? '' : value);
  if (!text) throw new Error(`${label}: missing lastmod date`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(`${label}: invalid lastmod date "${text}"`);
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new Error(`${label}: invalid lastmod date "${text}"`);
  }
  return text;
}

function humanLastmod(item, label) {
  return requireDate(item.updated || item.date, label);
}

function productionDate(value, label) {
  const match = /^(\d{4}-\d{2}-\d{2})(?:\s|$)/.exec(String(value == null ? '' : value));
  if (!match) throw new Error(`${label}: invalid production date "${value || ''}"`);
  return requireDate(match[1], label);
}

function loadValue(root, file, variable) {
  const full = path.join(root, file);
  try {
    return new Function(`${fs.readFileSync(full, 'utf8')}; return ${variable};`)();
  } catch (error) {
    throw new Error(`${file}: could not load ${variable}: ${error.message}`);
  }
}

function loadArray(root, source) {
  const value = loadValue(root, source.file, source.variable);
  if (!Array.isArray(value)) throw new Error(`${source.file}: ${source.variable} must be an array`);
  return value;
}

function readManifest(root) {
  const file = path.join(root, 'deep_analysis_manifest.json');
  let value;
  try { value = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error(`deep_analysis_manifest.json: ${error.message}`); }
  if (!value || typeof value !== 'object') throw new Error('deep_analysis_manifest.json: expected an object');
  return { records: [], archivePages: [], stockHubs: [], ...value };
}

function gitLastmod(root, file, warn) {
  try {
    const value = childProcess.execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (value) return requireDate(value, file);
  } catch (_) {}
  warn(`${file}: reliable Git modified date unavailable; omitting lastmod`);
  return null;
}

function maxDate(values) {
  const present = values.filter(Boolean);
  return present.length ? present.sort().at(-1) : null;
}

function validateUrls(urls) {
  const seen = new Set();
  for (const entry of urls) {
    let parsed;
    try { parsed = new URL(entry.loc); } catch (_) { throw new Error(`invalid URL: ${entry.loc}`); }
    if (parsed.origin !== 'https://gaeoteam.com') throw new Error(`off-site URL: ${entry.loc}`);
    if (parsed.search) throw new Error(`query URL is not allowed in sitemap: ${entry.loc}`);
    if (parsed.pathname.startsWith('/snap/stock/')) throw new Error(`noindex URL is not allowed in sitemap: ${entry.loc}`);
    if (seen.has(entry.loc)) throw new Error(`duplicate URL in sitemap: ${entry.loc}`);
    seen.add(entry.loc);
  }
  return urls;
}

function validateLocalFiles(root, urls) {
  for (const entry of urls) {
    const parsed = new URL(entry.loc);
    let relative = decodeURIComponent(parsed.pathname).replace(/^\//, '') || 'index.html';
    if (relative.endsWith('/')) relative += 'index.html';
    if (!fs.existsSync(path.join(root, relative))) throw new Error(`missing sitemap target: ${entry.loc}`);
  }
}

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderSitemap(urls) {
  const body = urls.map((entry) => {
    const lastmod = entry.mod ? `\n    <lastmod>${requireDate(entry.mod, entry.loc)}</lastmod>` : '';
    return `  <url>\n    <loc>${xmlEscape(entry.loc)}</loc>${lastmod}\n    <priority>${entry.prio}</priority>\n  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildUrls(root, warn = console.warn) {
  const live = loadValue(root, 'data.js', 'LIVE_DATA') || {};
  const homeDate = productionDate(live.date, 'data.js LIVE_DATA.date');
  const urls = [{ loc: BASE, prio: '1.0', mod: homeDate }];
  const humanDates = [];

  for (const source of HUMAN_SOURCES) {
    for (const item of loadArray(root, source)) {
      const label = `${source.mode}#${item.id}`;
      const mod = humanLastmod(item, label);
      const loc = contentUrl(source.mode, item.id);
      if (!loc) throw new Error(`${label}: invalid content id`);
      humanDates.push(mod);
      urls.push({ loc, prio: source.priority, mod });
    }
  }

  const deepManifest = readManifest(root);
  const deepDates = [];
  const deepGroups = [
    ['archivePages', deepManifest.archivePages, '0.7'],
    ['stockHubs', deepManifest.stockHubs, '0.9'],
    ['records', deepManifest.records, '0.8'],
  ];
  for (const [group, items, priority] of deepGroups) {
    for (const item of items) {
      const mod = requireDate(item.lastmod, `deep ${group} ${item.loc || '(missing URL)'}`);
      deepDates.push(mod);
      urls.push({ loc: item.loc, prio: priority, mod });
    }
  }

  urls.splice(1, 0, {
    loc: `${BASE}snap/index.html`, prio: '0.5', mod: maxDate([...humanDates, ...deepDates]),
  });
  for (const [file, priority] of [
    ['about.html', '0.4'], ['contact.html', '0.3'], ['privacy.html', '0.3'], ['disclaimer.html', '0.3'],
  ]) {
    urls.push({ loc: `${BASE}${file}`, prio: priority, mod: gitLastmod(root, file, warn) });
  }
  validateUrls(urls);
  validateLocalFiles(root, urls);
  return urls;
}

function main() {
  try {
    const root = __dirname;
    const urls = buildUrls(root, (message) => console.warn(`sitemap warning: ${message}`));
    fs.writeFileSync(path.join(root, 'sitemap.xml'), renderSitemap(urls));
    console.log('sitemap.xml 갱신 완료:', urls.length, 'canonical URL');
    return 0;
  } catch (error) {
    console.error(`sitemap generation failed: ${error.message}`);
    return 1;
  }
}

module.exports = { requireDate, productionDate, humanLastmod, gitLastmod, maxDate, validateUrls, validateLocalFiles, renderSitemap, buildUrls };
if (require.main === module) process.exitCode = main();
