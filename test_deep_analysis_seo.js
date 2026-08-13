const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const manifest = JSON.parse(fs.readFileSync('deep_analysis_manifest.json', 'utf8'));
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const titles = new Set();
const descriptions = new Set();

for (const record of manifest.records) {
  const relative = new URL(record.loc).pathname.replace(/^\//, '');
  const file = path.join(relative, 'index.html');
  assert.equal(fs.existsSync(file), true, `missing snapshot file: ${file}`);
  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  assert.ok(title, `missing title: ${file}`);
  assert.ok(description, `missing description: ${file}`);
  assert.equal(titles.has(title), false, `duplicate title: ${title}`);
  assert.equal(descriptions.has(description), false, `duplicate description: ${description}`);
  titles.add(title);
  descriptions.add(description);
  assert.match(html, new RegExp(`<link rel="canonical" href="${record.loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
  assert.ok(sitemap.includes(`<loc>${record.loc}</loc>`), `snapshot missing from sitemap: ${record.loc}`);
  assert.ok(sitemap.includes(`<lastmod>${record.lastmod}</lastmod>`), `lastmod missing from sitemap: ${record.loc}`);
}

for (const page of manifest.archivePages) {
  assert.ok(sitemap.includes(`<loc>${page.loc}</loc>`), `archive page missing from sitemap: ${page.loc}`);
}

console.log(`deep analysis SEO audit passed (${manifest.records.length} snapshots)`);
