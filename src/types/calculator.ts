export type InputType = 'currency' | 'number' | 'select' | 'boolean';

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputFieldConfig {
  id: string;
  label: string;
  type: InputType;
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  helpText?: string;
  suffix?: string;
  prefix?: string;
}

export interface FormulaOutputItem {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  isHero?: boolean;
  type?: 'positive' | 'negative' | 'neutral' | 'highlight';
  description?: string;
}

export interface EmployerCostItem {
  label: string;
  value: number;
  formattedValue: string;
}

export interface CalculationResult {
  heroOutput: FormulaOutputItem;
  breakdown: FormulaOutputItem[];
  employerCost?: {
    totalCost: number;
    formattedTotal: string;
    items: EmployerCostItem[];
  };
  notes?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PageSEO {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  explanationMarkdown: string;
  faqs: FAQItem[];
  relatedPages: { title: string; href: string }[];
}

export interface CalculatorConfig {
  id: string;
  countryCode: 'ke' | 'mx' | 'ma' | 'co';
  countryName: string;
  flagEmoji: string;
  language: 'en' | 'es' | 'fr';
  currencyCode: string;
  currencySymbol: string;
  name: string;
  description: string;
  lastUpdated: string;
  inputs: InputFieldConfig[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
  pages: Record<string, PageSEO>;
}
