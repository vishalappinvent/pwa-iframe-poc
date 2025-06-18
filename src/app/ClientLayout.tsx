'use client';

import PWAInstall from './components/PWAInstall';
import { useEffect } from 'react';
import { registerServiceWorker } from './service-worker-registration';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      {children}
      <PWAInstall />
    </>
  );
} 