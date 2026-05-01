import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'ResolvNest — Hostel Complaint System',
  description: 'Hostel Complaint & Resolution Analytics System — UCS310 DBMS Project, Thapar Institute',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
