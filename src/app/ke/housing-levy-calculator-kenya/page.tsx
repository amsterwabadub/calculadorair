import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KENYA_CALCULATOR_CONFIG } from '@/config/calculators/kenya';
import CalculatorPageLayout from '@/components/CalculatorPageLayout';

const pageSlug = 'housing-levy-calculator-kenya';
const seo = KENYA_CALCULATOR_CONFIG.pages[pageSlug];

export const metadata: Metadata = {
  title: seo?.title,
  description: seo?.metaDescription,
  keywords: seo?.keywords,
  alternates: { canonical: seo?.canonicalUrl },
  openGraph: {
    title: seo?.title,
    description: seo?.metaDescription,
    url: seo?.canonicalUrl,
  },
};

export default function Page() {
  if (!seo) notFound();
  return <CalculatorPageLayout config={KENYA_CALCULATOR_CONFIG} seo={seo} />;
}
