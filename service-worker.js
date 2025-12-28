const CACHE_NAME = 'my-site-pwa-v1';
const OFFLINE_URL = 'offline.html';

// Файлы для кеширования
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  // Добавьте сюда пути к вашим иконкам
  // '/icons/icon-192.png',
  // '/icons/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Установка');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Кеширование файлов');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Активация
self.addEventListener('activate', event => {
  console.log('[Service Worker] Активация');
  
  // Очистка старых кешей
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Удаление старого кеша:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  // Пропускаем не-GET запросы и chrome-extension
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) return;
  
  // Для навигационных запросов используем стратегию "network first"
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // Для остальных запросов - "cache first"
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Не кешируем неподходящие ответы
            if (!response || response.status !== 200 || 
                response.type !== 'basic') {
              return response;
            }
            
            // Клонируем ответ для кеширования
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Для картинок и стилей можно вернуть fallback
            if (event.request.destination === 'image') {
              // Можно вернуть заглушку для изображений
            }
          });
      })
  );
});