// WODTRAIN service worker: offline app shell. Data lives in localStorage, not here.
const CACHE = 'wod-nexa-1.4.2-1793290221377';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-mini.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png', ...["./assets/app-L2XL3M47.js","./assets/Inter-Regular-P7PJ4J2Z.woff","./assets/Inter-Medium-SG22KBJG.woff","./assets/Inter-SemiBold-OC62LRAJ.woff","./assets/Inter-Bold-NDAUGL3P.woff","./assets/Inter-ExtraBold-JNMWWQNZ.woff","./assets/ArchivoExpanded-Light-TZLH4G33.woff","./assets/ArchivoExpanded-Bold-RBR5DLLD.woff","./assets/ArchivoExpanded-Black-RRBVZTXQ.woff","./assets/app-Z5TQFLGN.css"]])),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never from the cache: the version check and the Android app download must always be current.
  if (url.pathname.endsWith('/version.json') || url.pathname.includes('/descargas/')) return;
  // Network first for navigations (fresh app), cache first for hashed assets.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
