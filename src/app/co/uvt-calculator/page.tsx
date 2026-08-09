import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COLOMBIA_CALCULATOR_CONFIG } from '@/config/calculators/colombia';
import CalculatorPageLayout from '@/components/CalculatorPageLayout';

const pageSlug = 'uvt-calculator';
const seo = COLOMBIA_CALCULATOR_CONFIG.pages[pageSlug];

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
  return <CalculatorPageLayout config={COLOMBIA_CALCULATOR_CONFIG} seo={seo} />;
}
