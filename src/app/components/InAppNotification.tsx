'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
}

export default function InAppNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for custom notification events
    const handleCustomNotification = (event: CustomEvent) => {
      const { title, body } = event.detail;
      const newNotification: Notification = {
        id: Date.now().toString(),
        title,
        body,
        timestamp: new Date(),
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Listen for push events from service worker
    const handlePushEvent = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        const { title, body } = event.data;
        const newNotification: Notification = {
          id: Date.now().toString(),
          title,
          body,
          timestamp: new Date(),
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setIsVisible(true);
        
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    };

    window.addEventListener('custom-notification', handleCustomNotification as EventListener);
    window.addEventListener('message', handlePushEvent);

    return () => {
      window.removeEventListener('custom-notification', handleCustomNotification as EventListener);
      window.removeEventListener('message', handlePushEvent);
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {/* Notification Bell Icon with Badge */}
      <div className="relative">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isVisible && (
        <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={clearNotifications}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Clear all
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.body}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 