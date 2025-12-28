// Простой Service Worker для PWA
const CACHE_NAME = 'croissant77-pwa-v1';

self.addEventListener('install', event => {
    console.log('[PWA Croissant77] Установлен');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[PWA Croissant77] Активирован');
    event.waitUntil(self.clients.claim());
});

// Для PWA не кешируем, только редирект
self.addEventListener('fetch', event => {
    // Можно добавить кеширование статики позже
    return;
});
