const CACHE = 'gaeo-shell-v3';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
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

  // HTML·데이터·기능 스크립트는 온라인일 때 항상 서버 원본을 먼저 확인한다.
  // 네트워크가 끊긴 경우에만 마지막 정상본을 사용해, 오래된 화면이 계속 남는 일을 막는다.
  const changesOften = /\.(?:html|js|json)$/.test(url.pathname);

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
