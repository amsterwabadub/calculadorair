import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms | ReguKit',
  description: 'Learn how ReguKit protects user privacy, minimal data processing, and compliance standards.',
  alternates: {
    canonical: 'https://regukit.com/politica-de-privacidade',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <Link href="/">Home</Link> &gt; <span>Privacy Policy</span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1.5rem' }}>
          Privacy Policy & Terms of Service
        </h1>

        <div className="content-section">
          <h2>1. Zero Data Logging Policy</h2>
          <p>
            ReguKit processes all statutory calculations (PAYE, NSSF, SHIF, ISR, CNSS, UVT, Retención en la Fuente) 
            locally in your browser. No income data, financial parameters, or personal identifiers are stored on our servers.
          </p>

          <h2>2. Analytics</h2>
          <p>
            We use privacy-compliant Google Analytics 4 (GA4) to collect aggregated usage metrics (e.g. calculator start and completion events) to improve application performance. No personal financial data is sent to analytics.
          </p>

          <h2>3. Disclaimers</h2>
          <p>
            ReguKit provides statutory estimates based on public tax legislation. For official legal or tax advice, consult qualified professional counsel.
          </p>
        </div>
      </div>
    </div>
  );
}
