'use client';

import { useEffect, useState } from 'react';
import PushNotification from '../components/PushNotification';
import NotificationPermission from '../components/NotificationPermission';

export default function NotificationsPage() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-[400px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Push Notifications Demo</h1>
        
        {/* Notification Permission Component */}
        <NotificationPermission />
        
        {/* Push Notification Component */}
        <PushNotification />
      </div>
    </main>
  );
} 