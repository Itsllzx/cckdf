import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Glass Platform',
  description: 'Production-ready AI-powered glassmorphism web platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
