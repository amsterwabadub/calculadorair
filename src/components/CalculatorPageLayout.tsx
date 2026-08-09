import React from 'react';
import Link from 'next/link';
import { CalculatorConfig, PageSEO } from '@/types/calculator';
import Calculator from '@/components/Calculator';
import StructuredData from '@/components/StructuredData';

interface CalculatorPageLayoutProps {
  config: CalculatorConfig;
  seo: PageSEO;
}

export default function CalculatorPageLayout({ config, seo }: CalculatorPageLayoutProps) {
  return (
    <>
      <StructuredData seo={seo} countryName={config.countryName} currencyCode={config.currencyCode} />

      <div className="container">
        {/* Page Hero */}
        <section className="page-hero">
          <h1 className="page-title">{seo.h1}</h1>
          <p className="page-subtitle">{seo.metaDescription}</p>
        </section>

        {/* Interactive Calculator Engine (passes countryCode string to satisfy RSC serialization) */}
        <Calculator countryCode={config.countryCode} />

        {/* Statutory Explanation Content Section */}
        {seo.explanationMarkdown && (
          <section className="content-section">
            <h2 className="section-heading">Regulatory Guide & Statutory Rules</h2>
            <div className="markdown-content">
              {seo.explanationMarkdown.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('### ')) {
                  return <h3 key={idx}>{trimmed.replace('### ', '')}</h3>;
                }
                if (trimmed.startsWith('#### ')) {
                  return <h4 key={idx}>{trimmed.replace('#### ', '')}</h4>;
                }
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n').map((item) => item.replace(/^[*|-]\s+/, ''));
                  return (
                    <ul key={idx}>
                      {items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{trimmed}</p>;
              })}
            </div>
          </section>
        )}

        {/* Frequently Asked Questions */}
        {seo.faqs && seo.faqs.length > 0 && (
          <section className="content-section">
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <div className="faq-grid">
              {seo.faqs.map((faq, idx) => (
                <div key={idx} className="faq-card">
                  <h3 className="faq-q">Q: {faq.question}</h3>
                  <p className="faq-a">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Pages Internal Linking */}
        {seo.relatedPages && seo.relatedPages.length > 0 && (
          <section className="content-section">
            <h2 className="section-heading">Related {config.countryName} Regulatory Tools</h2>
            <div className="related-grid">
              {seo.relatedPages.map((rel, idx) => (
                <Link key={idx} href={rel.href} className="related-card">
                  <span>{rel.title}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
