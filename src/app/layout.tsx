import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  // Yandex Webmaster ownership verification. The host is already registered
  // in the Operator Ventures Webmaster account; this only proves ownership.
  verification: { yandex: "0cb703a7fde4484b" },
  metadataBase: new URL('https://calculadorair.online'),
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
  alternates: {
    canonical: 'https://calculadorair.online',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://calculadorair.online',
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-KLNEN6LL8G';
  // Yandex Metrika counter for calculadorair.online. The counter already exists
  // in the Operator Ventures Metrika account; this only installs the tag.
  const ymId = process.env.NEXT_PUBLIC_YM_ID || '111448611';

  return (
    <html lang="pt-BR">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${ymId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${ymId}`}
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
