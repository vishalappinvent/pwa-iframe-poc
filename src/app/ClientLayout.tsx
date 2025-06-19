'use client';

import { useEffect } from 'react';
import { requestNotificationPermission } from './firebase/config';
import InAppNotification from './components/InAppNotification';
import PWAInstall from './components/PWAInstall';
import { registerServiceWorker } from './service-worker-registration';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerServiceWorker();

    // Initialize notifications
    const initializeNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          // Register token with server
          await fetch('/api/register-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
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
      <InAppNotification />
    </>
  );
} 