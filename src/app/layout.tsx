import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import Navbar from '@/components/layout/navbar';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Agio Store',
  description: 'A modern e-commerce store built with Next.js and Shopify.',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '700'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Suspense>
          <Navbar />
        </Suspense>
        <main>{children}</main>
      </body>
    </html>
  );
}
