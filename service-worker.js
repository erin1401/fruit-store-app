const CACHE_NAME = 'fruitstore-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/dashboard.html',
  '/styles.css',
  '/utils.js',
  '/data.js',
  '/manifest.json',
  // add other pages you created
  '/items.html',
  '/buyers.html',
  '/stock-in.html',
  '/stock-out.html',
  '/opname.html',
  '/sales.html',
  '/report-sales.html',
  '/report-stock.html',
  '/report-profit.html',
  '/users.html',
  '/invoice.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).catch(()=>caches.match('/offline.html')))
  );
});
