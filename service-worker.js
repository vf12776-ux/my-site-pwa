// Минимальный Service Worker для PWA
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('PWA установлен');
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('PWA активирован');
});