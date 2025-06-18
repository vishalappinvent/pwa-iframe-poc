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

if (typeof window !== 'undefined') {
  // Log config (without sensitive values)
  console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : undefined,
  });

  // Initialize Firebase if not already initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } else {
    app = getApps()[0];
    messaging = getMessaging(app);
  }
}

export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined') {
    console.log('Running on server side, skipping notification permission request');
    return null;
  }

  if (!messaging) {
    console.error('Firebase messaging is not initialized');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      console.log('Notification permission granted. Token:', token);
      return token;
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