/// <reference lib="webworker" />

declare global {
  interface ServiceWorkerGlobalScope {
    registration: ServiceWorkerRegistration;
    clients: Clients;
    caches: CacheStorage;
  }

  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }

  interface FetchEvent extends ExtendableEvent {
    request: Request;
    respondWith(response: Promise<Response> | Response): void;
  }

  interface PushEvent extends ExtendableEvent {
    data: PushMessageData;
  }

  interface NotificationEvent extends ExtendableEvent {
    notification: Notification;
  }

  interface PushMessageData {
    json(): any;
    text(): string;
    arrayBuffer(): ArrayBuffer;
    blob(): Blob;
  }
}

// This is the actual service worker scope
declare const self: ServiceWorkerGlobalScope; 