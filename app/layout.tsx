import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Desa Jadimulya',
  description: 'Website resmi Desa Jadimulya',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
