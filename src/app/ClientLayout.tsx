'use client';

import { useEffect } from 'react';
import { requestNotificationPermission } from './firebase/config';
import AppIconBadge from './components/AppIconBadge';
import PWAInstall from './components/PWAInstall';
import { registerServiceWorker } from './service-worker-registration';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Check if we're on iOS Chrome
    const isChromeIOS = typeof window !== 'undefined' && 
      /CriOS/.test(navigator.userAgent) && 
      /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isChromeIOS) {
      console.log('Chrome on iOS detected - skipping service worker registration');
      return;
    }

    // Register service worker with error handling
    try {
      registerServiceWorker();
    } catch (error) {
      console.error('Error registering service worker:', error);
    }

    // Initialize notifications with error handling
    const initializeNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          // Register token with server
          const response = await fetch('/api/register-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            console.error('Failed to register token with server');
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <>
      {children}
      <PWAInstall />
      <AppIconBadge />
    </>
  );
} 