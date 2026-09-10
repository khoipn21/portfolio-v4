import type { Metadata } from 'next';
import { Cormorant_Garamond, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/components/lenis-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { FaviconSwitcher } from '@/components/favicon-switcher';
import { TopNavbar } from '@/components/layout/top-navbar';
import { userData } from '@/data/user-data';

const displayFont = Cormorant_Garamond({
  variable: '--font-display',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const bodyFont = Hanken_Grotesk({
  variable: '--font-body',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const SITE_URL = 'https://portfolio.khoipn.com';
const TITLE = 'Pham Ngoc Khoi | Software Engineer & Full-Stack Developer';
const DESCRIPTION =
  'Software engineer building web applications from interface to API with React, Next.js, TypeScript, and Go. Explore projects, implementation decisions, experience, and source code.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — Pham Ngoc Khoi',
  },
  description: DESCRIPTION,
  applicationName: 'Pham Ngoc Khoi Portfolio',
  authors: [{ name: 'Pham Ngoc Khoi', url: SITE_URL }],
  creator: 'Pham Ngoc Khoi',
  keywords: [
    'Pham Ngoc Khoi',
    'khoipn21',
    'Full-Stack Developer',
    'React',
    'Next.js',
    'React Native',
    'TypeScript',
    'Go',
    'Software Engineer',
    'Web Developer',
    'Portfolio',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Pham Ngoc Khoi',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pham Ngoc Khoi, Software Engineer & Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body>
        <LenisProvider>
          <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
            <FaviconSwitcher />
            <a className="skip-link" href="#main-content">
              Skip to content
            </a>
            <TopNavbar />
            <div className="site-content">{children}</div>
            <footer className="site-footer page-shell">
              <p>
                © {new Date().getFullYear()} {userData.name}
              </p>
              <div className="footer-links">
                <a href={userData.github}>GitHub</a>
                <a href={userData.linkedin}>LinkedIn</a>
                <a href={`mailto:${userData.email}`}>Email</a>
              </div>
            </footer>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
