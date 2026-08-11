const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const shareImageUrl = 'https://gaeoteam.com/gaeo-share-v3.jpg';
const shareTitle = 'GAEO · 달라진 흐름만 빠르게';
const shareDescription = '시장 요약 / 종목 판단 / 흐름 분석';

function content(html, key, attribute = 'property') {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta\\s+${attribute}="${escaped}"\\s+content="([^"]*)"\\s*\\/?>(?:\\r?\\n)?`, 'i'));
  return match && match[1];
}

function jpegSize(buffer) {
  assert.strictEqual(buffer.readUInt16BE(0), 0xffd8, 'share image must be a JPEG');
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = buffer.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  throw new Error('JPEG dimensions not found');
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.strictEqual(content(home, 'og:title'), shareTitle);
assert.strictEqual(content(home, 'og:description'), shareDescription);
assert.strictEqual(content(home, 'og:type'), 'website');
assert.strictEqual(content(home, 'og:url'), 'https://gaeoteam.com/');
assert.strictEqual(content(home, 'og:site_name'), 'GAEO');
assert.strictEqual(content(home, 'og:locale'), 'ko_KR');
assert.strictEqual(content(home, 'og:image'), shareImageUrl);
assert.strictEqual(content(home, 'og:image:type'), 'image/jpeg');
assert.strictEqual(content(home, 'og:image:width'), '1200');
assert.strictEqual(content(home, 'og:image:height'), '630');
assert.strictEqual(content(home, 'og:image:alt'), 'GAEO');
assert.strictEqual(content(home, 'twitter:card', 'name'), 'summary_large_image');
assert.strictEqual(content(home, 'twitter:title', 'name'), shareTitle);
assert.strictEqual(content(home, 'twitter:description', 'name'), shareDescription);
assert.strictEqual(content(home, 'twitter:image', 'name'), shareImageUrl);

const image = fs.readFileSync(path.join(root, 'gaeo-share-v3.jpg'));
assert.deepStrictEqual(jpegSize(image), { width: 1200, height: 630 });
assert.ok(image.length < 800 * 1024, `share image is too large: ${image.length} bytes`);

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(absolute);
    return entry.name.endsWith('.html') ? [absolute] : [];
  });
}

const snapshots = htmlFiles(path.join(root, 'snap'));
assert.ok(snapshots.length >= 680, `expected all generated snapshots, found ${snapshots.length}`);
for (const absolute of snapshots) {
  const relative = path.relative(root, absolute).replace(/\\/g, '/');
  const html = fs.readFileSync(absolute, 'utf8');
  assert.strictEqual(content(html, 'og:image'), shareImageUrl, `${relative} og:image`);
  assert.strictEqual(content(html, 'og:image:type'), 'image/jpeg', `${relative} image type`);
  assert.strictEqual(content(html, 'og:image:width'), '1200', `${relative} image width`);
  assert.strictEqual(content(html, 'og:image:height'), '630', `${relative} image height`);
  assert.strictEqual(content(html, 'og:image:alt'), 'GAEO', `${relative} image alt`);
  assert.strictEqual(content(html, 'og:site_name'), 'GAEO', `${relative} site name`);
  assert.strictEqual(content(html, 'og:locale'), 'ko_KR', `${relative} locale`);
  assert.strictEqual(content(html, 'twitter:card', 'name'), 'summary_large_image', `${relative} twitter card`);
  assert.strictEqual(content(html, 'twitter:image', 'name'), shareImageUrl, `${relative} twitter image`);
}

console.log('OG share preview contract passed');
