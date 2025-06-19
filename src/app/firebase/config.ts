'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on the client side
let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

// Check if we're on Chrome iOS
const isChromeIOS = typeof window !== 'undefined' && 
  /CriOS/.test(navigator.userAgent) && 
  /iPad|iPhone|iPod/.test(navigator.userAgent);

if (typeof window !== 'undefined') {
  // Log config (without sensitive values)
  console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : undefined,
  });

  // Initialize Firebase if not already initialized
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  } else {
    app = getApps()[0];
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.error('Error getting messaging:', error);
    }
  }
}

export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined') {
    console.log('Running on server side, skipping notification permission request');
    return null;
  }

  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('Notifications not supported in this browser');
    return null;
  }

  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in this browser');
    return null;
  }

  // Special handling for iOS Chrome
  if (isChromeIOS) {
    console.log('Chrome on iOS detected - limited push notification support');
    // Chrome on iOS has limited push notification support
    return null;
  }

  if (!messaging) {
    console.error('Firebase messaging is not initialized');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        console.log('Notification permission granted. Token:', token);
        return token;
      } catch (tokenError) {
        console.error('Error getting token:', tokenError);
        return null;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

export { app, messaging }; 