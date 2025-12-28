// В service-worker.js ДОБАВЬ В НАЧАЛО:
const CACHE_VERSION = 'v3'; // МЕНЯЙ ЭТУ ЦИФРУ ПРИ КАЖДОМ ОБНОВЛЕНИИ
const CACHE_NAME = `croissant-cache-${CACHE_VERSION}`;

self.addEventListener('install', event => {
  console.log('🔄 Установка новой версии PWA:', CACHE_VERSION);
  self.skipWaiting(); // Принудительная активация
});

self.addEventListener('activate', event => {
  console.log('🎯 Активация новой версии');
  // УДАЛЯЕМ ВСЕ СТАРЫЕ КЕШИ
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Удаляем старый кеш:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});