import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medical Reports Portal',
  description: 'Medical Reports Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#004a7c]/10`}>
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
