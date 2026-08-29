// Hundo & Fiddy service worker
// IMPORTANT: bump CACHE_NAME on every deployed release.
const CACHE_NAME = 'hf-v1.6';

const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=hf-v1.6',
  './app.js?v=hf-v1.6',
  './catalog.json',
  './manifest.webmanifest',
  './hundo-fiddy-logo.jpg?v=hf-v1.6'
];

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
