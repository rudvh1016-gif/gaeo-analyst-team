// ⚠️ SHELL에 tickers.js와 화면 CSS가 들어 있다. 종목 목록이나 shell asset이 바뀌면
//    버전을 올려야 오프라인 상태에서 쓰이는 precache 사본도 새 파일로 교체된다.
//    app.js/app-shell.css는 문서의 ?v= 버전과 이 CACHE 버전으로 갱신한다. 아래 '목록'은 이 두 파일을 포함한 전체 SHELL이다.
//     그래서 캐시를 매번 깨지 않고, 목록이 실제로 바뀔 때만 버전을 올린다.)
const CACHE = 'gaeo-shell-v25';
// 위 버전은 종목 목록뿐 아니라 app.js/app-shell.css를 포함한 SHELL 항목이 바뀌어도 함께 올린다.
const SHELL = [
  './',
  './index.html',
  './app-shell.css?v=20260903-p8',
  './app.js?v=20260903-p8',
  './growth_urls.js',
  './public_release_safety.js',
  './product_analytics.js',
  './insight-rail.css',
  './editorial-foundation.css',
  './editorial-accessibility.css',
  './insight-rail.js',
  './manifest.json',
  // 화면이 실제로 쓰는 축소본만 미리 받는다. 원본(910x882 · PNG 1.2MB / WebP 737KB)은
  // 마스터 파일이라 저장소에는 남아 있지만 화면에서 쓰지 않으므로 precache에서 뺐다.
  './gaeo-flower-symbol-96.png',
  './gaeo-flower-symbol-96.webp',
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

  // ?v= 버전과 CACHE 버전으로 교체되는 대형 앱 자산은 제어된 재방문에서 재사용한다.
  const versionedAppShell = url.searchParams.has('v') &&
    (url.pathname.endsWith('/app.js') || url.pathname.endsWith('/app-shell.css'));
  if (versionedAppShell) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request)
          .then(response => {
            if (!response.ok) throw new Error(`versioned asset ${response.status}`);
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
            return response;
          })
          .catch(() => caches.match(request, { ignoreSearch: true }));
      })
    );
    return;
  }

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
