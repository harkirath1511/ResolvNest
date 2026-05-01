import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ResolvNest — Hostel Complaint System',
  description: 'Hostel Complaint & Resolution Analytics System — UCS310 DBMS Project, Thapar Institute',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
