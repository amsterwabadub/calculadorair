import { CalculatorConfig } from '@/types/calculator';
import { KENYA_CALCULATOR_CONFIG } from './kenya';
import { MEXICO_CALCULATOR_CONFIG } from './mexico';
import { MOROCCO_CALCULATOR_CONFIG } from './morocco';
import { COLOMBIA_CALCULATOR_CONFIG } from './colombia';

export const CALCULATOR_CONFIGS: Record<string, CalculatorConfig> = {
  ke: KENYA_CALCULATOR_CONFIG,
  mx: MEXICO_CALCULATOR_CONFIG,
  ma: MOROCCO_CALCULATOR_CONFIG,
  co: COLOMBIA_CALCULATOR_CONFIG,
};

export const getCalculatorConfigByCountry = (countryCode: string): CalculatorConfig | undefined => {
  return CALCULATOR_CONFIGS[countryCode.toLowerCase()];
};

export const getPageSEO = (countryCode: string, slug: string) => {
  const calc = getCalculatorConfigByCountry(countryCode);
  if (!calc) return undefined;
  return calc.pages[slug];
};
