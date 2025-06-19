"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationPermission from "./components/NotificationPermission";

export default function HomePage() {
  const [magicLink, setMagicLink] = useState("");
  const [validatedLink, setValidatedLink] = useState("");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as { standalone?: boolean }).standalone === true) {
      setIsStandalone(true);
    }
  }, []);

  const validateAndSetLink = () => {
    try {
      const url = new URL(magicLink);
      const allowedDomains = [
        "demo3.staging.ravin-ai.com",
        "localhost:3000",
        "localhost",
      ];
      if (!allowedDomains.includes(url.hostname)) {
        alert("Domain not allowed!");
        return;
      }
      setValidatedLink(url.toString());
    } catch (error) {
      console.log(error, "error");
      alert("Invalid URL");
    }
  };

  return (
    <main className={`min-h-screen bg-gray-50 ${validatedLink ? 'p-0' : 'py-12 px-4 sm:px-6 lg:px-8'}`}>
      {validatedLink ? (
        <iframe
          src={validatedLink}
          title="Magic Link Viewer"
          allow="camera; microphone; fullscreen; display-capture"
          className="w-screen h-screen border-0"
          sandbox="allow-scripts allow-forms allow-same-origin"
        />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Magic Link PWA</h1>
            <p className="text-lg text-gray-600 mb-8">
              {isStandalone 
                ? "Running in standalone mode" 
                : "Test magic links and push notifications in your PWA"}
            </p>
            
            {/* Navigation Links */}
            <div className="flex justify-center space-x-4 mb-8">
              <Link 
                href="/notifications" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Test Notifications
              </Link>
            </div>
          </div>

          {/* Notification Permission Component */}
          <div className="mb-8">
            <NotificationPermission />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Magic Link Tester</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter magic link"
                value={magicLink}
                onChange={(e) => setMagicLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={validateAndSetLink}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Open in IFrame
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
