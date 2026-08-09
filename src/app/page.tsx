import React from 'react';
import Link from 'next/link';
import { COUNTRIES } from '@/config/countries';
import { CALCULATOR_CONFIGS } from '@/config/calculators';

export default function HomePage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Homepage Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="trust-badge" style={{ marginBottom: '1rem' }}>
          <span className="badge-dot"></span> Regulo Regulatory Engine — 2026 Statutory Rules
        </div>
        <h1 className="page-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
          Localized Statutory & Payroll Calculators Built for Instant Answers
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.2rem', maxWidth: '720px' }}>
          Regulo provides verified administrative and financial utilities for mandatory questions people search for every day — updated for 2026 tax & payroll laws.
        </p>
      </div>

      {/* Country Cards Directory Grid */}
      <div className="calc-section-title">Active Country Calculator Hubs</div>
      <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '4rem' }}>
        {Object.values(COUNTRIES).map((country) => {
          const config = CALCULATOR_CONFIGS[country.code];
          if (!config) return null;

          return (
            <div
              key={country.code}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: 'var(--color-border-subtle)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.25rem' }}>{country.flag}</span>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                      {country.name}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-brand-accent)', fontWeight: 700 }}>
                      Primary Domain: /{country.code}/
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  {config.description}
                </p>

                {/* Satellite SEO Links Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>
                    Available Statutory Tools:
                  </span>
                  {Object.values(config.pages).map((pg) => (
                    <Link
                      key={pg.slug}
                      href={`/${country.code}/${pg.slug}`}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-brand-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0.6rem',
                        background: 'var(--color-bg-main)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                      }}
                    >
                      <span>{pg.title.split('—')[0]}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/${country.code}/${country.primarySlug}`}
                className="btn btn-primary"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                Open {country.name} Calculator Engine →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Trust & Architecture Principles Section */}
      <div className="content-section">
        <h2 className="section-heading">Why Regulo?</h2>
        <div className="grid-3">
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>⚡ High Speed Utility</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Zero account creation, no login popups, and 100% reactive client calculations for instantaneous output.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📜 Statutory Accuracy</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Formulas are stored in version-controlled configuration files updated against current statutory tax acts.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📱 Mobile-First Design</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Clean typography and government-grade trust interfaces engineered for phone and desktop screens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
