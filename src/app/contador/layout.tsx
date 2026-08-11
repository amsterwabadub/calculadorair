import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onde Buscar Ajuda com o Imposto de Renda 2026 — Canais Oficiais',
  description:
    'Canais oficiais e gratuitos da Receita Federal para tirar dúvidas e declarar o Imposto de Renda 2026, e como verificar o registro de um contador no CRC.',
  alternates: {
    canonical: 'https://calculadorair.online/contador',
  },
};

export default function ContadorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
