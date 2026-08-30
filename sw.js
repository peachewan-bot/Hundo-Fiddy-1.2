// Hundo & Fiddy service worker
// IMPORTANT: bump CACHE_NAME on every deployed release.
const CACHE_NAME = 'hf-v1.9';

const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=hf-v1.9',
  './app.js?v=hf-v1.9',
  './catalog.json',
  './manifest.webmanifest',
  './hundo-fiddy-logo.jpg?v=hf-v1.9',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

const APP_SHELL_URLS = new Set(
  APP_SHELL.map(path => new URL(path, self.location.href).href)
);

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.all(
      APP_SHELL.map(async path => {
        const response = await fetch(path, { cache: 'reload' });

        if (!response.ok) {
          throw new Error(`Failed to cache ${path}: ${response.status}`);
        }

        await cache.put(path, response);
      })
    );
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key.startsWith('hf-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Offline cold-launch behavior retained in V1.9:
    // Navigation is cache-first so an installed PWA can cold-launch
    // immediately with no network connection.
    if (request.mode === 'navigate') {
      const cachedPage =
        await cache.match('./index.html') ||
        await cache.match('./');

      if (cachedPage) return cachedPage;

      return fetch(request, { cache: 'no-store' });
    }

    // Versioned app-shell assets are also cache-first.
    // A new release gets a new cache/versioned URL, so this does not
    // reintroduce the old mixed/stale-assets deployment problem.
    if (APP_SHELL_URLS.has(url.href)) {
      const cachedAsset = await cache.match(request);
      if (cachedAsset) return cachedAsset;

      const response = await fetch(request, { cache: 'no-store' });
      if (response && response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    }

    // Other same-origin GETs remain network-first with cached fallback.
    try {
      const response = await fetch(request, { cache: 'no-store' });

      if (response && response.ok) {
        await cache.put(request, response.clone());
      }

      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      throw error;
    }
  })());
});
