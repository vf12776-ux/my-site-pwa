// В service-worker.js
const CACHE_VERSION = 'v2'; // ИЗМЕНИ ЭТО ЧИСЛО
const CACHE_NAME = `croissant-cache-${CACHE_VERSION}`;

self.addEventListener('install', event => {
  console.log('🔄 Установлена новая версия PWA');
  self.skipWaiting(); // Принудительная активация
});

self.addEventListener('activate', event => {
  console.log('🎯 Активирована новая версия');
  // Удаляем старые кеши
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log(`🗑️ Удаляем старый кеш: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});