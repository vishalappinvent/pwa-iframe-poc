'use client';

import { useState } from 'react';
import { sendNotification } from '../utils/notificationService';

export default function PushNotification() {
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test notification');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendNotification = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await sendNotification(title, body);
      setMessage(`Notification sent successfully! Sent to ${result.response.successCount} devices.`);
      
      // Also trigger in-app notification for immediate feedback
      const event = new CustomEvent('custom-notification', {
        detail: { title, body }
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to send notification'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Push Notification</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification title"
          />
        </div>
        
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification message"
          />
        </div>
        
        <button
          onClick={handleSendNotification}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Notification'}
        </button>
        
        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">📱 iOS Instructions:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Notifications will appear in the app (top-right bell icon)</li>
          <li>• Safari on iOS doesn&apos;t show system notifications</li>
          <li>• Add to home screen for better experience</li>
          <li>• Use Chrome/Firefox on iOS for system notifications</li>
        </ul>
      </div>
    </div>
  );
} 