import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { Heart, Github } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Airbnb',
  description: 'A full-featured Airbnb clone built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          <div className="pb-20 pt-28">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-8 mt-16">
            <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
              <div className="mt-3 text-sm text-muted-foreground flex items-center justify-center gap-1">
                <p>Developed with</p>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <p>by</p>
                <Link
                  href="https://github.com/ramankumar7c/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 hover:underline transition-colors flex items-center gap-1"
                >
                  Raman
                  <Github className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </footer>
          
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}