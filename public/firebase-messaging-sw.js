importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration will be injected by the client
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

// Handle background messages
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (event.data) {
    const payload = event.data.json();
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/icon-192x192.png',
      badge: '/badge-96x96.png',
      data: payload.data,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      tag: 'notification-' + Date.now()
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
}); 