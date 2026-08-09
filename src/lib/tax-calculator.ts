import { TAX_RULES_2026 } from '@/data/tax-rules-2026';

export type BenefitType = 'ISENTO_TOTAL' | 'REDUCAO_PARCIAL' | 'FORA_DO_BENEFICIO';

export interface TaxCalculatorOptions {
  dependents?: number;
  customDeductions?: number;
  useCLTInss?: boolean; // Whether to auto-deduct INSS for CLT calculation
  useSimplifiedDiscount?: boolean;
}

export interface TaxCalculationResult {
  grossSalary: number;
  inssDeduction: number;
  dependentDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  
  // Tax before 2026 rules (2024/2025 table)
  oldTax: number;
  oldEffectiveRate: number;
  
  // Tax with 2026 rules (Lei 15.270/2025)
  newTax: number;
  newEffectiveRate: number;
  
  // Reducer applied in 2026
  reducerAmount: number;
  
  // Savings
  monthlySaving: number;
  annualSaving12Months: number;
  annualSaving13Months: number;
  
  // Metadata & messaging
  benefitType: BenefitType;
  appliedRuleLabel: string;
  explanation: string;
  disclaimer: string;
}

/**
 * Calculates progressive INSS deduction based on monthly gross salary (CLT 2025/2026)
 */
export function calculateINSS(grossSalary: number): number {
  if (grossSalary <= 0) return 0;
  
  let totalInss = 0;
  let prevLimit = 0;
  
  for (const bracket of TAX_RULES_2026.inssBrackets) {
    if (grossSalary > bracket.limit) {
      totalInss += (bracket.limit - prevLimit) * bracket.rate;
      prevLimit = bracket.limit;
    } else {
      totalInss += (grossSalary - prevLimit) * bracket.rate;
      return Number(totalInss.toFixed(2));
    }
  }
  
  return Number(totalInss.toFixed(2));
}

/**
 * Calculates standard progressive IRRF based on taxable income (2024/2025 rules)
 */
export function calculateProgressiveTax(taxableIncome: number): number {
  if (taxableIncome <= 2259.20) return 0;
  
  const brackets = TAX_RULES_2026.progressiveBrackets;
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (taxableIncome <= bracket.limit) {
      const tax = (taxableIncome * bracket.rate) - bracket.deduction;
      return Math.max(0, Number(tax.toFixed(2)));
    }
  }
  
  const topBracket = brackets[brackets.length - 1];
  const tax = (taxableIncome * topBracket.rate) - topBracket.deduction;
  return Math.max(0, Number(tax.toFixed(2)));
}

/**
 * Calculates Redutor Adicional for 2026 rules
 * Formula: R$ 978,62 - (0,133145 * rendimento_tributavel)
 */
export function calculate2026Reducer(taxableIncome: number): number {
  const { exemptionLimit, reducerUpperLimit, reducerBaseAmount, reducerMultiplier } = TAX_RULES_2026.reform2026;
  
  if (taxableIncome <= exemptionLimit || taxableIncome > reducerUpperLimit) {
    return 0;
  }
  
  const reducer = reducerBaseAmount - (reducerMultiplier * taxableIncome);
  return Math.max(0, Number(reducer.toFixed(2)));
}

/**
 * Calculates tax under 2026 rules (Lei 15.270/2025)
 */
export function calculateNew2026Tax(taxableIncome: number): { finalTax: number; reducerAmount: number; benefitType: BenefitType } {
  const { exemptionLimit, reducerUpperLimit } = TAX_RULES_2026.reform2026;
  
  if (taxableIncome <= exemptionLimit) {
    return {
      finalTax: 0,
      reducerAmount: 0,
      benefitType: 'ISENTO_TOTAL',
    };
  }
  
  const baseProgressiveTax = calculateProgressiveTax(taxableIncome);
  
  if (taxableIncome <= reducerUpperLimit) {
    const reducer = calculate2026Reducer(taxableIncome);
    const finalTax = Math.max(0, Number((baseProgressiveTax - reducer).toFixed(2)));
    return {
      finalTax,
      reducerAmount: reducer,
      benefitType: 'REDUCAO_PARCIAL',
    };
  }
  
  return {
    finalTax: baseProgressiveTax,
    reducerAmount: 0,
    benefitType: 'FORA_DO_BENEFICIO',
  };
}

/**
 * Primary calculation function comparing old IRRF vs 2026 IRRF rules
 */
export function calculateTaxComparison(
  grossSalary: number,
  options: TaxCalculatorOptions = {}
): TaxCalculationResult {
  const {
    dependents = 0,
    customDeductions = 0,
    useCLTInss = true,
  } = options;

  const validSalary = Math.max(0, Number(grossSalary) || 0);
  
  // 1. Calculate INSS
  const inssDeduction = useCLTInss ? calculateINSS(validSalary) : 0;
  
  // 2. Dependent Deduction
  const dependentDeduction = Math.max(0, dependents) * TAX_RULES_2026.dependentDeduction;
  
  // 3. Determine best taxable income base (Legal Deductions vs Simplified Discount)
  const legalDeductions = inssDeduction + dependentDeduction + Math.max(0, customDeductions);
  const simplifiedDeduction = TAX_RULES_2026.simplifiedMonthlyDiscount;
  
  const bestDeduction = Math.max(legalDeductions, simplifiedDeduction);
  const taxableIncome = Math.max(0, Number((validSalary - bestDeduction).toFixed(2)));
  
  // 4. Calculate Old Tax (2024/2025 rules)
  const oldTax = calculateProgressiveTax(taxableIncome);
  const oldEffectiveRate = validSalary > 0 ? Number(((oldTax / validSalary) * 100).toFixed(2)) : 0;
  
  // 5. Calculate New Tax (2026 rules)
  const { finalTax: newTax, reducerAmount, benefitType } = calculateNew2026Tax(taxableIncome);
  const newEffectiveRate = validSalary > 0 ? Number(((newTax / validSalary) * 100).toFixed(2)) : 0;
  
  // 6. Savings
  const monthlySaving = Math.max(0, Number((oldTax - newTax).toFixed(2)));
  const annualSaving12Months = Number((monthlySaving * 12).toFixed(2));
  const annualSaving13Months = Number((monthlySaving * 13).toFixed(2));
  
  // 7. Explanations & Labels
  let appliedRuleLabel = '';
  let explanation = '';

  switch (benefitType) {
    case 'ISENTO_TOTAL':
      appliedRuleLabel = 'Isenção Total 2026';
      explanation = 'Com as novas regras do Imposto de Renda 2026, rendimentos tributáveis de até R$ 5.000,00 ficam totalmente isentos de IRRF.';
      break;

    case 'REDUCAO_PARCIAL':
      appliedRuleLabel = 'Redução Gradual 2026';
      explanation = `Para salários entre R$ 5.000,01 e R$ 7.350,00, aplica-se a tabela progressiva com um redutor adicional de R$ ${reducerAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês.`;
      break;

    case 'FORA_DO_BENEFICIO':
    default:
      appliedRuleLabel = 'Tabela Progressiva Padrão';
      explanation = 'Nesta faixa de renda, o benefício da nova regra é reduzido ou não se aplica. O cálculo segue a tabela progressiva padrão.';
      break;
  }

  const disclaimer = 'Esta calculadora tem caráter informativo e fornece uma estimativa com base nas regras públicas vigentes. O cálculo real pode variar conforme deduções, outras fontes de renda e sua situação fiscal.';

  return {
    grossSalary: validSalary,
    inssDeduction,
    dependentDeduction,
    totalDeductions: bestDeduction,
    taxableIncome,
    oldTax,
    oldEffectiveRate,
    newTax,
    newEffectiveRate,
    reducerAmount,
    monthlySaving,
    annualSaving12Months,
    annualSaving13Months,
    benefitType,
    appliedRuleLabel,
    explanation,
    disclaimer,
  };
}

/**
 * Format currency in Brazilian Real (pt-BR)
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
