const assert = require('assert');
const fs = require('fs');
const zlib = require('zlib');

function read(name) {
  return fs.readFileSync(name);
}

function decodePng(name) {
  const data = read(name);
  assert.equal(data.subarray(1, 4).toString('ascii'), 'PNG', `${name} must be PNG`);
  let offset = 8;
  let width;
  let height;
  let colorType;
  const idat = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString('ascii');
    const body = data.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      assert.equal(body[8], 8, `${name} must use 8-bit channels`);
      colorType = body[9];
      assert.ok(colorType === 2 || colorType === 6, `${name} must be RGB or RGBA`);
      assert.equal(body[12], 0, `${name} must not be interlaced`);
    } else if (type === 'IDAT') {
      idat.push(body);
    }
    offset += length + 12;
  }
  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? pixels[y * stride + x - channels] : 0;
      const up = y ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft = y && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      const value = filter === 0 ? row[x]
        : filter === 1 ? row[x] + left
          : filter === 2 ? row[x] + up
            : filter === 3 ? row[x] + Math.floor((left + up) / 2)
              : filter === 4 ? row[x] + paeth(left, up, upperLeft)
                : NaN;
      assert.ok(Number.isFinite(value), `${name} has unsupported PNG filter ${filter}`);
      pixels[y * stride + x] = value & 255;
    }
  }
  const pixel = (x, y) => {
    const i = y * stride + x * channels;
    return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: channels === 4 ? pixels[i + 3] : 255 };
  };
  return { width, height, colorType, pixel };
}

function assertWhiteIcon(name, size) {
  const png = decodePng(name);
  assert.deepEqual([png.width, png.height], [size, size], `${name} dimensions`);
  for (const [x, y] of [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]) {
    const p = png.pixel(x, y);
    assert.deepEqual([p.r, p.g, p.b, p.a], [255, 255, 255, 255], `${name} corners must be opaque white`);
  }
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const p = png.pixel(x, y);
      if (Math.max(255 - p.r, 255 - p.g, 255 - p.b) > 5) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  assert.ok(maxX >= 0, `${name} must contain the flower`);
  const extent = Math.max(maxX - minX + 1, maxY - minY + 1) / size;
  assert.ok(extent >= 0.62 && extent <= 0.70, `${name} flower extent ${(extent * 100).toFixed(1)}% must be 62-70%`);
  assert.ok(Math.abs((minX + maxX) / 2 - (size - 1) / 2) <= 2, `${name} flower must be horizontally centered`);
  assert.ok(Math.abs((minY + maxY) / 2 - (size - 1) / 2) <= 2, `${name} flower must be vertically centered`);
}

const symbol = decodePng('gaeo-flower-symbol.png');
assert.equal(symbol.colorType, 6);
assert.ok(symbol.width >= 850 && symbol.width <= 1000, `cropped symbol width ${symbol.width}`);
assert.ok(symbol.height >= 850 && symbol.height <= 1000, `cropped symbol height ${symbol.height}`);
assert.equal(symbol.pixel(0, 0).a, 0, 'Header symbol must retain a transparent exterior');
assert.ok(fs.statSync('gaeo-flower-symbol.webp').size > 1000, 'WebP symbol must exist');

for (const [name, size] of [
  ['app-icon-180.png', 180],
  ['apple-touch-icon.png', 180],
  ['app-icon-192.png', 192],
  ['app-icon-512.png', 512],
  ['app-icon-maskable-512.png', 512],
  ['app-icon-1024.png', 1024],
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
]) assertWhiteIcon(name, size);

const index = fs.readFileSync('index.html', 'utf8');
const about = fs.readFileSync('about.html', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

assert.match(index, /<source srcset="gaeo-flower-symbol\.webp" type="image\/webp">/);
assert.match(index, /<img src="gaeo-flower-symbol\.png" alt="GAEO"/);
assert.match(index, /gaeo-flower-symbol\.png" alt="GAEO" width="910" height="882"/);
assert.match(index, /<span class="global-brand-word">Gaeo<\/span>/);
assert.match(index, /rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16\.png"/);
assert.match(index, /rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32\.png"/);
assert.match(index, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
assert.match(index, /og:image" content="https:\/\/gaeoteam\.com\/gaeo-share-v3\.jpg"/);

assert.doesNotMatch(about, /id="gaeo-symbol"|원과 반원으로 이루어진 GAEO 심볼/);
assert.match(about, /<img class="brand-symbol" src="gaeo-flower-symbol\.png" alt="GAEO"/);
assert.match(about, /gaeo-flower-symbol\.png" alt="GAEO" width="910" height="882"/);
assert.match(about, /<img src="app-icon-192\.png" alt="GAEO 앱 아이콘"/);
assert.doesNotMatch(about, />Black<|>White<|>Gray</);

const maskable = manifest.icons.find(icon => icon.purpose === 'maskable');
assert.equal(maskable.src, '/app-icon-maskable-512.png');
assert.match(serviceWorker, /\.\/gaeo-flower-symbol\.png/);
assert.match(serviceWorker, /\.\/gaeo-flower-symbol\.webp/);
assert.match(serviceWorker, /\.\/favicon-16\.png/);
assert.match(serviceWorker, /\.\/favicon-32\.png/);

console.log('global flower brand asset contract passed');
