import type { Metadata } from 'next';
import Calculator from '@/components/Calculator';

/**
 * Bare calculator for embedding in third-party pages.
 *
 * A calculator is a linkable asset only if someone can put it on their own page.
 * This route renders the tool with no header, footer or navigation, so a
 * publisher can iframe it; the attribution link back is part of the embed and is
 * the only thing this page adds around the tool.
 *
 * noindex on purpose: it duplicates the homepage calculator and exists for
 * embedding, not for ranking.
 */
export const metadata: Metadata = {
  title: 'Calculadora IRRF 2026 — versão incorporável',
  robots: { index: false, follow: true },
};

export default function EmbedPage() {
  return (
    <div style={{ padding: '1rem', background: '#fff' }}>
      <Calculator autoFocus={false} />
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
        Cálculo por{' '}
        <a href="https://calculadorair.online" target="_blank" rel="noopener">
          calculadorair.online
        </a>{' '}
        · regras da Lei nº 15.270/2025 ·{' '}
        <a href="https://calculadorair.online/metodologia" target="_blank" rel="noopener">
          metodologia
        </a>
      </p>
    </div>
  );
}
