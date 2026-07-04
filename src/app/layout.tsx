import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bon-Voyage \u2014 AI Travel Discovery',
  description:
    'An AI-powered travel platform that uncovers hidden cultural experiences, sensory narratives, and authentic local connections wherever you go.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Bon-Voyage \u2014 AI Travel Discovery',
    description:
      'Discover hidden cultural experiences with AI-powered travel intelligence.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
