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

// 🐛 2026-08-21: 34px로 보이는 헤더 심볼이 910x882 원본(WebP 737KB)을 받고 있었다.
//    모바일 첫 화면 전송량의 3분의 1이 로고 하나였다. 화면에는 축소본만 쓴다.
//    원본은 마스터 파일로 남긴다(위 decodePng 검사가 계속 지킨다).
assert.match(index, /<source srcset="gaeo-flower-symbol-96\.webp" type="image\/webp">/);
assert.match(index, /<img src="gaeo-flower-symbol-96\.png" alt="GAEO" width="96" height="93">/);
assert.doesNotMatch(index, /srcset="gaeo-flower-symbol\.webp"|src="gaeo-flower-symbol\.png"/,
  '헤더에 원본(737KB)을 다시 걸지 않는다');
assert.match(index, /<span class="global-brand-word">Gaeo<\/span>/);
assert.match(index, /rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16\.png"/);
assert.match(index, /rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32\.png"/);
assert.match(index, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
assert.match(index, /og:image" content="https:\/\/gaeoteam\.com\/gaeo-share-v3\.jpg"/);

assert.doesNotMatch(about, /id="gaeo-symbol"|원과 반원으로 이루어진 GAEO 심볼/);
// about은 148px로 보이므로 320px 축소본을 쓴다(원본 PNG는 1.2MB).
assert.match(about, /<source srcset="gaeo-flower-symbol-320\.webp" type="image\/webp">/);
assert.match(about, /<img class="brand-symbol" src="gaeo-flower-symbol-320\.png" alt="GAEO" width="320" height="310">/);
assert.match(about, /<img src="app-icon-1024\.png" srcset="app-icon-512\.png 512w, app-icon-1024\.png 1024w" sizes="[^\"]+" alt="GAEO 앱 아이콘" width="1024" height="1024"/);
assert.doesNotMatch(about, />Black<|>White<|>Gray</);

const maskable = manifest.icons.find(icon => icon.purpose === 'maskable');
assert.equal(maskable.src, '/app-icon-maskable-512.png');
// precache도 화면이 실제로 쓰는 축소본만 받는다. 원본을 미리 받으면 첫 방문에 737KB를 더 쓴다.
assert.match(serviceWorker, /'\.\/gaeo-flower-symbol-96\.png'/);
assert.match(serviceWorker, /'\.\/gaeo-flower-symbol-96\.webp'/);
assert.doesNotMatch(serviceWorker, /'\.\/gaeo-flower-symbol\.(png|webp)'/,
  'precache에 원본을 넣지 않는다');
assert.match(serviceWorker, /\.\/favicon-16\.png/);
assert.match(serviceWorker, /\.\/favicon-32\.png/);

console.log('global flower brand asset contract passed');
