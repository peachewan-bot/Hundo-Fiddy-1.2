// Hundo & Fiddy service worker
// IMPORTANT: bump CACHE_NAME on every deployed release.
const CACHE_NAME = 'hf-v1.5-ui-b2';

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './catalog.json',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('hf-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const response = await fetch(request, { cache: 'no-store' });

      if (response && response.ok) {
        await cache.put(request, response.clone());
      }

      return response;
    } catch (error) {
      const cached = await cache.match(request);

      if (cached) return cached;

      if (request.mode === 'navigate') {
        return (
          await cache.match('./index.html') ||
          await cache.match('./')
        );
      }

      throw error;
    }
  })());
});
