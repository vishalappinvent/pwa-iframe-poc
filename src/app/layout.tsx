import './globals.css';

export const metadata = {
  title: "MagicLink PWA",
  manifest: "/manifest.json",
  themeColor: "#317EFB",
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
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#317EFB" />
      </head>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
