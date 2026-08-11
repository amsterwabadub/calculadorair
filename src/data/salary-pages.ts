import { calculateTaxComparison, formatBRL, BenefitType } from '@/lib/tax-calculator';

/**
 * Single source of truth for the salary long-tail routes.
 *
 * The homepage cards, the /[slug] pages and the sitemap all read from here, and
 * every figure shown is derived from `calculateTaxComparison` at build time.
 * Nothing about a salary's outcome is ever hardcoded.
 */
export const SALARY_VALUES: readonly number[] = [
  3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7350, 8000, 9000, 10000, 12000, 15000,
  20000,
];

export const salarySlug = (salary: number) => `imposto-de-renda-salario-${salary}`;

export const SALARY_BY_SLUG: Record<string, number> = Object.fromEntries(
  SALARY_VALUES.map((s) => [salarySlug(s), s]),
);

/** Salaries featured as cards on the homepage. Must be a subset of SALARY_VALUES. */
export const FEATURED_SALARIES: readonly number[] = [4000, 5000, 6000, 7000, 8000, 10000];

export interface SalaryExample {
  salary: number;
  slug: string;
  label: string;
  badge: string;
  /** Human-readable savings line, derived from the engine. */
  savingLine: string;
  monthlySaving: number;
  annualSaving12Months: number;
  benefitType: BenefitType;
}

const BADGE_BY_BENEFIT: Record<BenefitType, string> = {
  ISENTO_TOTAL: 'Sem IRRF em 2026',
  REDUCAO_PARCIAL: 'Redutor parcial',
  FORA_DO_BENEFICIO: 'Tabela progressiva',
};

/**
 * Builds a homepage/example card straight from the production engine.
 * Same engine, same inputs, same numbers as the destination page.
 */
export function buildSalaryExample(salary: number): SalaryExample {
  const calc = calculateTaxComparison(salary);

  const savingLine =
    calc.monthlySaving > 0
      ? `Economia de ${formatBRL(calc.monthlySaving)}/mês (${formatBRL(calc.annualSaving12Months)}/ano)`
      : 'Sem alteração em relação a 2025';

  return {
    salary,
    slug: salarySlug(salary),
    label: `R$ ${salary.toLocaleString('pt-BR')}`,
    badge: BADGE_BY_BENEFIT[calc.benefitType],
    savingLine,
    monthlySaving: calc.monthlySaving,
    annualSaving12Months: calc.annualSaving12Months,
    benefitType: calc.benefitType,
  };
}

export const FEATURED_SALARY_EXAMPLES: SalaryExample[] =
  FEATURED_SALARIES.map(buildSalaryExample);
