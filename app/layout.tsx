import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import ConditionalLayout from '@/components/ConditionalLayout';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "EasyBuyStore - Shop Smart, Shop Easy",
  description: "Your destination for easy online shopping in Sri Lanka. Discover great products at amazing prices with fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`antialiased ${inter.className}`} suppressHydrationWarning>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
