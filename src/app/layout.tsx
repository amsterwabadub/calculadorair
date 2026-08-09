import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://regulo.online'),
  title: {
    default: 'Regulo — Global Statutory & Payroll Calculators 2026',
    template: '%s | Regulo',
  },
  description:
    'Instant, accurate, and localized statutory administrative calculators for Kenya, Mexico, Morocco, and Colombia updated for 2026 tax regulations.',
  keywords: [
    'regulo',
    'regulo online',
    'kenya net salary calculator 2026',
    'aguinaldo neto calculadora mexico 2026',
    'calculateur salaire net maroc 2026',
    'retencion en la fuente calculadora colombia 2026',
    'statutory tax calculator',
  ],
  authors: [{ name: 'Regulo Regulatory Engine' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://regulo.online',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://regulo.online',
    title: 'Regulo — Global Statutory & Payroll Calculators 2026',
    description:
      'Localized statutory administrative calculators solving mandatory financial, tax, and employment questions worldwide.',
    siteName: 'Regulo',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-REGULO2026';

  return (
    <html lang="en">
      <body>
        <GoogleAnalytics gaId={gaId} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
