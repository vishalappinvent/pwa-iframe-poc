'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '../firebase/config';

export default function NotificationPermission() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isChromeIOS, setIsChromeIOS] = useState(false);

  useEffect(() => {
    // Check if we're on Chrome iOS
    const chromeIOS = typeof window !== 'undefined' && 
      /CriOS/.test(navigator.userAgent) && 
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    setIsChromeIOS(chromeIOS);

    // Check if notifications are supported
    if (typeof window !== 'undefined') {
      const supported = 'Notification' in window && 'serviceWorker' in navigator && !chromeIOS;
      setIsSupported(supported);
      
      if (supported) {
        setPermissionStatus(Notification.permission);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    setMessage('');

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

        if (response.ok) {
          setMessage('Notifications enabled successfully!');
          setPermissionStatus('granted');
        } else {
          setMessage('Failed to register token with server');
        }
      } else {
        setMessage('Notification permission denied or not supported');
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setMessage('Error enabling notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChromeIOS) {
    return (
      <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Chrome on iOS Detected</h3>
        <p className="text-yellow-700 text-sm mb-3">
          Chrome on iOS has limited push notification support due to iOS restrictions.
        </p>
        <div className="text-yellow-700 text-sm space-y-1">
          <p><strong>Recommendations:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use Safari and add the app to home screen</li>
            <li>Use Firefox on iOS</li>
            <li>Use the app from your home screen</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Browser Not Supported</h3>
        <p className="text-yellow-700 text-sm">
          Your browser doesn&apos;t support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  if (permissionStatus === 'granted') {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-medium text-green-800 mb-2">✅ Notifications Enabled</h3>
        <p className="text-green-700 text-sm">
          You&apos;re all set! You&apos;ll receive push notifications when they&apos;re sent.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Enable Push Notifications</h3>
      
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Get instant updates and stay connected with our push notifications.
        </p>

        <button
          onClick={handleRequestPermission}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enabling...' : 'Enable Notifications'}
        </button>

        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes('Error') || message.includes('Failed') || message.includes('denied')
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* iOS-specific instructions */}
        <div className="p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">📱 iOS Users:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Safari on iOS doesn&apos;t support web push notifications</li>
            <li>• Add this app to your home screen for better experience</li>
            <li>• Use Chrome or Firefox on iOS for push notifications</li>
            <li>• Or use the app from your home screen</li>
          </ul>
        </div>

        {/* General instructions */}
        <div className="p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-800 mb-2">ℹ️ Instructions:</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Click &quot;Enable Notifications&quot; above</li>
            <li>• Allow notifications when prompted by your browser</li>
            <li>• You&apos;ll receive a confirmation message</li>
            <li>• Test notifications using the form below</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 