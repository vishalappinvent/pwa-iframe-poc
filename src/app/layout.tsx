import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Push Notification PWA',
  description: 'A Progressive Web App for Push Notifications',
  manifest: '/manifest.json',
  themeColor: '#317EFB',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PushPWA',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        <meta name="theme-color" content="#317EFB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PushPWA" />
        <meta name="description" content="A Progressive Web App for Push Notifications" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="PushPWA" />
        <meta name="msapplication-TileColor" content="#317EFB" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 