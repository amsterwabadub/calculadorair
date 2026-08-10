import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atendimento Especializado IRPF 2026',
  description:
    'Solicite contato de um especialista para declaração, dúvidas ou retificação do Imposto de Renda 2026.',
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
