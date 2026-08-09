import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MEXICO_CALCULATOR_CONFIG } from '@/config/calculators/mexico';
import CalculatorPageLayout from '@/components/CalculatorPageLayout';

const pageSlug = 'salario-neto-mexico';
const seo = MEXICO_CALCULATOR_CONFIG.pages[pageSlug];

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
  return <CalculatorPageLayout config={MEXICO_CALCULATOR_CONFIG} seo={seo} />;
}
