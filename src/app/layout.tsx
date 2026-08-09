import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Calculadora Imposto de Renda 2026 — Veja Quanto Você Economiza',
    template: '%s | Calculadora IR 2026',
  },
  description: 'Simulador gratuito e atualizado do Imposto de Renda 2026 (Lei nº 15.270/2025). Descubra quanto vai economizar por mês e por ano com a nova tabela e isenção até R$ 5.000.',
  keywords: [
    'calculadora imposto de renda 2026',
    'nova tabela imposto de renda 2026',
    'isencao imposto de renda 5000',
    'quanto vou economizar imposto de renda',
    'simulador irrf 2026',
  ],
  authors: [{ name: 'Calculadora Imposto de Renda Brasil' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://calculadorair2026.com.br',
    title: 'Calculadora Imposto de Renda 2026 — Veja Quanto Você Economiza',
    description: 'Informe seu salário e descubra instantaneamente sua economia mensal e anual com as novas regras da Lei nº 15.270/2025.',
    siteName: 'Calculadora Imposto de Renda 2026',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
