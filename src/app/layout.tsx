import './globals.css';
import type { Metadata } from 'next';
import PWAInstall from './components/PWAInstall';

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
        <link rel="apple-touch-icon" href="/pwa-icon-192.png" />
        <meta name="theme-color" content="#317EFB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PushPWA" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
        <PWAInstall />
      </body>
    </html>
  );
}
