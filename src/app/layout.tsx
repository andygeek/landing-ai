import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'LandingAI - Build Amazing Landing Pages with AI',
  description: 'Create stunning, responsive landing pages using React, Vue.js, Svelte, or Vanilla JS. Real-time preview, intelligent suggestions, and seamless deployment.',
  keywords: ['landing page', 'builder', 'react', 'vue', 'svelte', 'javascript', 'ai', 'nextjs'],
  authors: [{ name: 'LandingAI Team' }],
  creator: 'LandingAI',
  publisher: 'LandingAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://landingai.dev'),
  openGraph: {
    title: 'LandingAI - Build Amazing Landing Pages with AI',
    description: 'Create stunning, responsive landing pages using your favorite framework with AI-powered assistance.',
    url: 'https://landingai.dev',
    siteName: 'LandingAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LandingAI - Multi-Framework Landing Page Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LandingAI - Build Amazing Landing Pages with AI',
    description: 'Create stunning, responsive landing pages using your favorite framework with AI-powered assistance.',
    images: ['/og-image.png'],
    creator: '@landingai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Tailwind CSS CDN */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      border: 'hsl(var(--border))',
                      input: 'hsl(var(--input))',
                      ring: 'hsl(var(--ring))',
                      background: 'hsl(var(--background))',
                      foreground: 'hsl(var(--foreground))',
                      primary: {
                        DEFAULT: 'hsl(var(--primary))',
                        foreground: 'hsl(var(--primary-foreground))',
                      },
                      secondary: {
                        DEFAULT: 'hsl(var(--secondary))',
                        foreground: 'hsl(var(--secondary-foreground))',
                      },
                      muted: {
                        DEFAULT: 'hsl(var(--muted))',
                        foreground: 'hsl(var(--muted-foreground))',
                      },
                      accent: {
                        DEFAULT: 'hsl(var(--accent))',
                        foreground: 'hsl(var(--accent-foreground))',
                      },
                      card: {
                        DEFAULT: 'hsl(var(--card))',
                        foreground: 'hsl(var(--card-foreground))',
                      },
                    },
                    fontFamily: {
                      sans: ['var(--font-inter)', 'sans-serif'],
                      mono: ['var(--font-jetbrains-mono)', 'monospace'],
                    },
                  },
                },
              }
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}