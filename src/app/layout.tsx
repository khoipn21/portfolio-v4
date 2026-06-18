import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { FaviconSwitcher } from "@/components/favicon-switcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://portfolio.khoipn.id.vn";
const TITLE = "Pham Ngoc Khoi — Full-Stack Developer";
const DESCRIPTION =
  "Full-stack developer focused on React, Next.js, React Native, TypeScript, and Go. Building scalable e-commerce, proptech, and ed-tech products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Pham Ngoc Khoi",
  },
  description: DESCRIPTION,
  applicationName: "Pham Ngoc Khoi Portfolio",
  authors: [{ name: "Pham Ngoc Khoi", url: SITE_URL }],
  creator: "Pham Ngoc Khoi",
  keywords: [
    "Pham Ngoc Khoi",
    "khoipn21",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "React Native",
    "TypeScript",
    "Go",
    "Software Engineer",
    "Web Developer",
    "Portfolio",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Pham Ngoc Khoi",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pham Ngoc Khoi — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Theme initialization script to prevent FOUC
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('portfolio-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        className="min-h-full flex flex-col transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]"
      >
        <LenisProvider>
          <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
            <FaviconSwitcher />
            {children}
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
