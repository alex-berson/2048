const cacheName = 'cache-v2';
const files = [
  'https://alex-berson.github.io/2048/',
  'index.html',
  'css/style.css',
  'js/2048.js',
  'js/ui.js',
  'js/ai.js',
  'fonts/roboto-regular-webfont.woff',
  'fonts/roboto-bold-webfont.woff'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
      cache.addAll(files);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      )
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
