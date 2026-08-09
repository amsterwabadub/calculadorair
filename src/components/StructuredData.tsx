import React from 'react';
import { PageSEO, FAQItem } from '@/types/calculator';

interface StructuredDataProps {
  seo: PageSEO;
  countryName: string;
  currencyCode: string;
}

export default function StructuredData({ seo, countryName, currencyCode }: StructuredDataProps) {
  // SoftwareApplication / FinancialProduct Schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seo.h1,
    operatingSystem: 'All',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: currencyCode,
    },
    description: seo.metaDescription,
    url: seo.canonicalUrl,
    author: {
      '@type': 'Organization',
      name: 'Regulo',
      url: 'https://regulo.online',
    },
  };

  // FAQPage Schema
  const faqSchema =
    seo.faqs && seo.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: seo.faqs.map((faq: FAQItem) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
