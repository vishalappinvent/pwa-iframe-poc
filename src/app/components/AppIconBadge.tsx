'use client';

import { useState, useEffect } from 'react';

export default function AppIconBadge() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Listen for push events from service worker
    const handlePushEvent = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        setNotificationCount(prev => prev + 1);
      }
    };

    // Listen for custom notification events (for testing)
    const handleCustomNotification = () => {
      setNotificationCount(prev => prev + 1);
    };

    window.addEventListener('message', handlePushEvent);
    window.addEventListener('custom-notification', handleCustomNotification as EventListener);

    return () => {
      window.removeEventListener('message', handlePushEvent);
      window.removeEventListener('custom-notification', handleCustomNotification as EventListener);
    };
  }, []);

  const clearBadge = () => {
    setNotificationCount(0);
  };

  if (notificationCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={clearBadge}
          className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
        >
          <span className="text-sm font-medium">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        </button>
      </div>
    </div>
  );
} 