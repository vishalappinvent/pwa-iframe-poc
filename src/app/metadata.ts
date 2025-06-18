import type { Metadata } from 'next';

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