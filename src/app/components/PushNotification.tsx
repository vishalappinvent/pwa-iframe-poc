'use client';

import { useEffect, useState } from 'react';
import { requestNotificationPermission } from '../firebase/config';
import { sendNotification } from '../utils/notificationService';

export default function PushNotification() {
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if the browser supports required APIs
    const checkSupport = () => {
      const isSupported = 
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      
      setIsSupported(isSupported);
      
      if (!isSupported) {
        setStatus({
          type: 'error',
          message: 'Your browser does not support push notifications. Please try a different browser.'
        });
      }
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const initializeNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          setTokenFound(true);
          console.log('Notification token:', token);
          
          try {
            const response = await fetch('/api/register-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            if (!response.ok) {
              throw new Error('Failed to register token with server');
            }

            setStatus({ type: 'success', message: 'Notifications enabled successfully!' });
            console.log('Token registered with server successfully');
          } catch (error) {
            console.error('Error registering token with server:', error);
            setStatus({ type: 'error', message: 'Failed to enable notifications. Please try again.' });
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setStatus({ type: 'error', message: 'Failed to initialize notifications. Please try again.' });
      }
    };

    initializeNotifications();
  }, [isSupported]);

  const onSendNotification = async () => {
    if (!notification.title || !notification.body) {
      setStatus({ type: 'error', message: 'Please fill in both title and message' });
      return;
    }

    try {
      await sendNotification(notification.title, notification.body);
      setStatus({ type: 'success', message: 'Notification sent successfully!' });
      setNotification({ title: '', body: '' }); // Clear form after successful send
    } catch (error) {
      console.error('Error sending notification:', error);
      setStatus({ type: 'error', message: 'Failed to send notification. Please try again.' });
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-[400px] max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Browser Not Supported</h3>
          <p className="text-gray-600">
            Your browser does not support push notifications. Please try using a modern browser like Chrome, Firefox, or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Push Notification Demo
        </h2>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>
      
      {/* Status Message */}
      {status.type && (
        <div className={`mb-6 p-4 rounded-lg border ${
          status.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            {status.type === 'success' ? (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        </div>
      )}

      {isTokenFound ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Notification Title
            </label>
            <input
              type="text"
              value={notification.title}
              onChange={(e) => setNotification({ ...notification, title: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter notification title"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Notification Message
            </label>
            <textarea
              value={notification.body}
              onChange={(e) => setNotification({ ...notification, body: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
              placeholder="Enter notification message"
              rows={3}
            />
          </div>
          <button
            onClick={onSendNotification}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Send Notification
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Enable Notifications</h3>
          <p className="text-gray-600 mb-6">Get instant updates and stay connected with our push notifications</p>
          <button
            onClick={() => requestNotificationPermission()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Enable Notifications
          </button>
        </div>
      )}
    </div>
  );
} 