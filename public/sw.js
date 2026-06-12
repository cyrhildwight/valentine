const CACHE_NAME = 'whisper-bloom-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/images/rose.webp',
  '/images/hero-rose.webp',
  '/images/lavender.webp',
  '/images/lily.webp',
  '/images/wildflower.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Caching assets silently, ignore failures for optional resources
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('Pre-caching assets failed:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Only handle GET requests and local domains to avoid CORS/third-party API tracking conflicts
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(e.request.url);
  const isIndexPage = url.pathname === '/' || url.pathname === '/index.html';

  // For index.html and root path, use Network First strategy.
  // This ensures users always get the latest version after a deployment, preventing blank screen issues.
  if (isIndexPage) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(e.request);
        })
    );
    return;
  }

  // Cache First strategy for other static assets (images, etc.)
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // Fallback to index.html for client-side routing
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
