// ⚠️ SHELL에 tickers.js가 들어 있다. 종목 목록이 바뀌면(500 → 600) 이 버전을 올려야
//    오프라인 상태에서 쓰이는 precache 사본도 새 목록으로 교체된다.
//    (온라인에서는 아래 changesOften 규칙이 .js를 network-first로 받으므로 문제없다.
//     그래서 캐시를 매번 깨지 않고, 목록이 실제로 바뀔 때만 버전을 올린다.)
const CACHE = 'gaeo-shell-v13';
const SHELL = [
  './',
  './index.html',
  './insight-rail.css',
  './insight-rail.js',
  './manifest.json',
  './gaeo-flower-symbol.png',
  './gaeo-flower-symbol.webp',
  './app-icon-180.png',
  './app-icon-192.png',
  './app-icon-512.png',
  './app-icon-maskable-512.png',
  './app-icon-1024.png',
  './market_archive.js',
  './apple-touch-icon.png',
  './favicon.ico',
  './favicon-16.png',
  './favicon-32.png',
  './tickers.js',
  './stock_bios.js',
  './site_config.js',
  './snap/latest_posts.js',
  './snap/home_brief.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  const freshRequest = new Request(request, { cache: 'no-store' });

  if (request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(freshRequest)
        .then(response => {
          if (!response.ok) throw new Error(`navigation ${response.status}`);
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // HTML·스타일·데이터·기능 스크립트는 온라인일 때 항상 서버 원본을 먼저 확인한다.
  // 네트워크가 끊긴 경우에만 마지막 정상본을 사용해, 오래된 화면이 계속 남는 일을 막는다.
  const changesOften = /\.(?:html|css|js|json)$/.test(url.pathname);

  if (changesOften) {
    event.respondWith(
      fetch(freshRequest)
        .then(response => {
          if (!response.ok) throw new Error(`asset ${response.status}`);
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
