/// <reference lib="webworker" />

/* eslint-disable @typescript-eslint/no-explicit-any */

const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cast self to ServiceWorkerGlobalScope
const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache: Cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      return Promise.all(
        cacheNames.map((cacheName: string) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

sw.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response: Response | undefined) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

sw.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || { title: 'New Notification', body: 'You have a new notification' };
  
  event.waitUntil(
    sw.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: data.data || {}
    })
  );
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  event.waitUntil(
    sw.clients.matchAll({ type: 'window' }).then((clientList: readonly WindowClient[]) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return sw.clients.openWindow('/');
    })
  );
}); 