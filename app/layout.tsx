import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Tracen Collectibles | ร้านขายฟิกเกอร์และของสะสม Uma Musume',
  description: 'ศูนย์รวมฟิกเกอร์และของสะสม Uma Musume: Pretty Derby ลิขสิทธิ์แท้ 100%',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="bg-stone-50 text-gray-900">{children}</body>
    </html>
  );
}
