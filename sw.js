// Service Worker для PWA «Кринж & Co — Здоровый сон»
const CACHE_NAME = 'krinzh-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './css/styles.css',
  './js/shared.js',
  './js/app.js',
  './js/admin.js',
  './assets/logo.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Установка Service Worker и кэширование статических ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Частичная ошибка предзагрузки кэша SW:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Активация и удаление устаревших кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия: Network-first с откатом в кэш для максимальной актуальности
self.addEventListener('fetch', (event) => {
  // Обрабатываем только GET-запросы к ресурсам нашего приложения
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Игнорируем внешние запросы (например, VK API, внешние изображения), если нет соединения
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Если запрашивается страница навигации
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Офлайн-режим: ресурс недоступен', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
          });
        });
      })
  );
});
