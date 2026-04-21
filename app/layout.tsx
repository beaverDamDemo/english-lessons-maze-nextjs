import type { Metadata } from 'next';
import { Fredoka, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeToggle from './_components/ThemeToggle';
import AppFooter from './_components/AppFooter';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: `Thai English Playland`,
  description: 'Generated to help learning english grammar through maze games.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeToggle />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
