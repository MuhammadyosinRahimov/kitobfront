import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ScienceHub | Мировой Архив Научных Знаний',
    template: '%s | ScienceHub'
  },
  description: 'ScienceHub — премиальная образовательная платформа для доступа к научным книгам и публикациям. Более 20,000 материалов в высоком качестве.',
  keywords: ['наука', 'книги', 'образование', 'архив', 'библиотека', 'PDF', 'ScienceHub'],
  authors: [{ name: 'ScienceHub Team' }],
  openGraph: {
    title: 'ScienceHub | Мировой Архив Научных Знаний',
    description: 'Доступ к элитным научным материалам в высоком качестве.',
    url: 'https://science-hub.pro', // Replace with your actual domain
    siteName: 'ScienceHub',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScienceHub | Мировой Архив Научных Знаний',
    description: 'Доступ к элитным научным материалам в высоком качестве.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased relative overflow-x-hidden")}>
        {/* Master Layers */}
        <div className="noise-overlay" />
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
           <div className="mesh-blob w-[500px] h-[500px] bg-blue-400/20 top-[-10%] left-[-10%]" />
           <div className="mesh-blob w-[600px] h-[600px] bg-indigo-400/10 bottom-[-20%] right-[-10%] animate-[mesh-float_30s_infinite_alternate-reverse]" />
           <div className="mesh-blob w-[400px] h-[400px] bg-purple-400/10 top-[40%] right-[10%] animate-[mesh-float_20s_infinite_alternate]" />
        </div>

        <Providers>
          <Header />
          <main className="min-h-screen relative z-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
