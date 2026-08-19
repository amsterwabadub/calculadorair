import {
  TAX_RULES_2026,
  RULES_2025,
  RULES_2026,
  INSS_BRACKETS_2026,
  DEPENDENT_DEDUCTION,
  ProgressiveBracket,
} from '@/data/tax-rules-2026';

export type BenefitType = 'ISENTO_TOTAL' | 'REDUCAO_PARCIAL' | 'FORA_DO_BENEFICIO';

export interface TaxCalculatorOptions {
  dependents?: number;
  customDeductions?: number;
  useCLTInss?: boolean; // Whether to auto-deduct INSS for CLT calculation
}

export interface TaxCalculationResult {
  grossSalary: number;
  inssDeduction: number;
  dependentDeduction: number;

  /** Deduction actually applied under each regime (best of legal vs simplified). */
  oldTotalDeductions: number;
  newTotalDeductions: number;
  /** Base de cálculo under each regime. */
  oldTaxableIncome: number;
  taxableIncome: number;

  // Tax under the 2025 table (pre-reform baseline)
  oldTax: number;
  oldEffectiveRate: number;

  // Tax under the 2026 rules (Lei 15.270/2025)
  newTax: number;
  newEffectiveRate: number;

  /** Tax assessed by the 2026 table before the redutor is subtracted. */
  taxBeforeRedutor: number;
  /** Redutor applied in 2026, computed on rendimentos tributáveis and capped at the tax. */
  reducerAmount: number;

  /**
   * Take-home pay after INSS and the 2026 IRRF — gross minus both withholdings.
   * It excludes anything the calculator cannot know (FGTS is not withheld from
   * the employee, and health-plan or union dues vary by employer), so it is the
   * statutory net, not the exact payslip line.
   */
  netSalary2026: number;
  /** The same figure under the 2025 rules, for the side-by-side. */
  netSalary2025: number;

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

const round2 = (v: number) => Number(v.toFixed(2));

/**
 * Progressive INSS contribution for a CLT employee (2026 table).
 * Applied band by band, capped at the teto of R$ 8.475,55.
 */
export function calculateINSS(grossSalary: number): number {
  if (grossSalary <= 0) return 0;

  let total = 0;
  let prevLimit = 0;

  for (const bracket of INSS_BRACKETS_2026) {
    if (grossSalary > bracket.limit) {
      total += (bracket.limit - prevLimit) * bracket.rate;
      prevLimit = bracket.limit;
    } else {
      total += (grossSalary - prevLimit) * bracket.rate;
      return round2(total);
    }
  }

  // Above the teto the contribution is frozen at the ceiling.
  return round2(total);
}

/** Applies a progressive monthly table to a base de cálculo. */
function applyTable(taxableIncome: number, brackets: ProgressiveBracket[]): number {
  if (taxableIncome <= 0) return 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, round2(taxableIncome * bracket.rate - bracket.deduction));
    }
  }

  const top = brackets[brackets.length - 1];
  return Math.max(0, round2(taxableIncome * top.rate - top.deduction));
}

/** IRRF by the 2025 monthly table — the pre-reform comparison baseline. */
export function calculateProgressiveTax2025(taxableIncome: number): number {
  return applyTable(taxableIncome, RULES_2025.brackets);
}

/** IRRF by the 2026 monthly table, before the redutor. */
export function calculateProgressiveTax2026(taxableIncome: number): number {
  return applyTable(taxableIncome, RULES_2026.brackets);
}

/**
 * Redutor do imposto (Lei nº 15.270/2025).
 *
 * NOTE the argument: `taxableEarnings` is the "rendimentos tributáveis sujeitos
 * à incidência mensal" — the taxable earnings BEFORE INSS/dependent deductions.
 * It is NOT the base de cálculo. The two are different bases in the same
 * calculation. See the derivation in `data/tax-rules-2026.ts`.
 *
 * The caller is responsible for capping the result at the tax assessed.
 */
export function calculate2026Reducer(taxableEarnings: number): number {
  const { grossUpperLimit, baseAmount, multiplier } = RULES_2026.redutor;

  if (taxableEarnings <= 0 || taxableEarnings > grossUpperLimit) return 0;

  return Math.max(0, round2(baseAmount - multiplier * taxableEarnings));
}

/**
 * Full 2026 assessment.
 * `taxableEarnings` = rendimentos tributáveis (pre-deduction), which drives the
 * redutor; `taxableIncome` = base de cálculo (post-deduction), which drives the
 * progressive table.
 * Returns the tax before the redutor, the redutor actually applied (capped at
 * the tax), the final tax and the resulting benefit classification.
 */
export function calculateNew2026Tax(
  taxableEarnings: number,
  taxableIncome: number,
): {
  taxBeforeRedutor: number;
  reducerAmount: number;
  finalTax: number;
  benefitType: BenefitType;
} {
  const taxBeforeRedutor = calculateProgressiveTax2026(taxableIncome);
  const rawReducer = calculate2026Reducer(taxableEarnings);
  const reducerAmount = round2(Math.min(taxBeforeRedutor, rawReducer));
  const finalTax = Math.max(0, round2(taxBeforeRedutor - reducerAmount));

  let benefitType: BenefitType;
  if (finalTax === 0) {
    benefitType = 'ISENTO_TOTAL';
  } else if (reducerAmount > 0) {
    benefitType = 'REDUCAO_PARCIAL';
  } else {
    benefitType = 'FORA_DO_BENEFICIO';
  }

  return { taxBeforeRedutor, reducerAmount, finalTax, benefitType };
}

/**
 * Primary calculation: compares monthly IRRF under the 2025 table against the
 * 2026 rules for the same gross salary and the same personal circumstances.
 *
 * Only the IR rules vary between the two sides — INSS is held at the current
 * (2026) table on both, so the difference isolates the effect of the reform.
 */
export function calculateTaxComparison(
  grossSalary: number,
  options: TaxCalculatorOptions = {},
): TaxCalculationResult {
  const { dependents = 0, customDeductions = 0, useCLTInss = true } = options;

  const validSalary = Math.max(0, Number(grossSalary) || 0);

  const inssDeduction = useCLTInss ? calculateINSS(validSalary) : 0;
  const dependentDeduction = round2(Math.max(0, dependents) * DEPENDENT_DEDUCTION);

  // The taxpayer takes whichever is larger: itemised legal deductions or the
  // desconto simplificado. The simplified amount differs between regimes.
  const legalDeductions = round2(inssDeduction + dependentDeduction + Math.max(0, customDeductions));

  const oldTotalDeductions = Math.max(legalDeductions, RULES_2025.simplifiedMonthlyDiscount);
  const newTotalDeductions = Math.max(legalDeductions, RULES_2026.simplifiedMonthlyDiscount);

  const oldTaxableIncome = Math.max(0, round2(validSalary - oldTotalDeductions));
  const taxableIncome = Math.max(0, round2(validSalary - newTotalDeductions));

  const oldTax = calculateProgressiveTax2025(oldTaxableIncome);
  const oldEffectiveRate = validSalary > 0 ? round2((oldTax / validSalary) * 100) : 0;

  const { taxBeforeRedutor, reducerAmount, finalTax: newTax, benefitType } = calculateNew2026Tax(
    validSalary,
    taxableIncome,
  );
  const newEffectiveRate = validSalary > 0 ? round2((newTax / validSalary) * 100) : 0;

  const monthlySaving = Math.max(0, round2(oldTax - newTax));
  const annualSaving12Months = round2(monthlySaving * 12);
  const annualSaving13Months = round2(monthlySaving * 13);

  let appliedRuleLabel = '';
  let explanation = '';

  switch (benefitType) {
    case 'ISENTO_TOTAL':
      appliedRuleLabel = 'Sem imposto na fonte em 2026';
      explanation =
        'Com as regras de 2026, o imposto apurado é totalmente anulado pelo redutor: não há retenção de IRRF sobre este salário. O redutor da Lei nº 15.270/2025 zera o imposto para rendimentos tributáveis mensais de até R$ 5.000,00.';
      break;

    case 'REDUCAO_PARCIAL':
      appliedRuleLabel = 'Redutor parcial 2026';
      explanation = `O redutor da Lei nº 15.270/2025 incide sobre os rendimentos tributáveis mensais, antes das deduções, e diminui à medida que o salário se aproxima de R$ 7.350,00. Neste caso o redutor aplicado é de R$ ${reducerAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês.`;
      break;

    case 'FORA_DO_BENEFICIO':
    default:
      appliedRuleLabel = 'Tabela progressiva 2026';
      explanation =
        'Acima de R$ 7.350,00 de rendimentos tributáveis mensais o redutor deixa de ser aplicado. O imposto segue a tabela progressiva de 2026, que ainda assim é um pouco mais branda que a de 2025 por causa da faixa de isenção maior.';
      break;
  }

  const disclaimer =
    'Esta calculadora tem caráter informativo e fornece uma estimativa com base nas regras públicas vigentes. O cálculo real pode variar conforme deduções, outras fontes de renda e sua situação fiscal.';

  return {
    grossSalary: validSalary,
    inssDeduction,
    dependentDeduction,
    oldTotalDeductions,
    newTotalDeductions,
    oldTaxableIncome,
    taxableIncome,
    oldTax,
    oldEffectiveRate,
    newTax,
    newEffectiveRate,
    taxBeforeRedutor,
    reducerAmount,
    netSalary2026: round2(validSalary - inssDeduction - newTax),
    netSalary2025: round2(validSalary - inssDeduction - oldTax),
    monthlySaving,
    annualSaving12Months,
    annualSaving13Months,
    benefitType,
    appliedRuleLabel,
    explanation,
    disclaimer,
  };
}

/** Format currency in Brazilian Real (pt-BR) */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export { TAX_RULES_2026 };
