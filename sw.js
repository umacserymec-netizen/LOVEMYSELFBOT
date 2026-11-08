/* ============================================================
   Love Myself — service worker
   Shell caching so the app opens offline once it has been used.
   ============================================================ */

const VERSION = 'love-myself-v3';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/utils.js',
  './js/data.js',
  './js/store.js',
  './js/core.js',
  './js/home.js',
  './js/track.js',
  './js/move.js',
  './js/settings.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(SHELL).catch(() => {
        /* If one optional file is missing, still install the rest. */
        return Promise.all(SHELL.map((url) => cache.add(url).catch(() => null)));
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Navigations: try the network, fall back to the cached shell. */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put('./index.html', copy)).catch(() => null);
          return response;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./')))
    );
    return;
  }

  /* Fonts: stale-while-revalidate so the app still looks soft offline. */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then((hit) => {
        const network = fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy)).catch(() => null);
          return response;
        }).catch(() => hit);
        return hit || network;
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  /* Local assets: cache first, refresh quietly in the background. */
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) {
        fetch(request).then((response) => {
          if (response && response.ok) {
            caches.open(VERSION).then((cache) => cache.put(request, response)).catch(() => null);
          }
        }).catch(() => null);
        return hit;
      }
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy)).catch(() => null);
        }
        return response;
      });
    })
  );
});

/* Tapping a reminder notification opens the right screen. */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.tag === 'treat-unlock'
    ? new URL('./index.html#/treat', self.location.href).href
    : new URL('./index.html#/home', self.location.href).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          if ('navigate' in client) {
            return client.navigate(target)
              .then((next) => (next && next.focus ? next.focus() : next))
              .catch(() => client.focus());
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
      return null;
    })
  );
});
