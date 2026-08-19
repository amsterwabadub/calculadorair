import { calculateTaxComparison, formatBRL, BenefitType } from '@/lib/tax-calculator';

/**
 * Single source of truth for the salary long-tail routes.
 *
 * The homepage cards, the /[slug] pages and the sitemap all read from here, and
 * every figure shown is derived from `calculateTaxComparison` at build time.
 * Nothing about a salary's outcome is ever hardcoded.
 */
/**
 * Validated long-tail salary universe.
 *
 * Every value below was confirmed against live Google autocomplete (pt-BR/BR) on
 * 2026-08-19: the suggestion returned by Google had to contain the amount itself
 * *and* an income-tax term before the value was admitted. Amounts Google does not
 * actually suggest are not built. See LONGTAIL-EXPANSION.md for the decision rules.
 *
 * Granularity is deliberately uneven and follows where the 2026 rules make the
 * answer differ:
 *   - below R$ 5.000  -> R$ 500 steps. The redutor zeroes the IRRF for every one of
 *     them, so a finer grid would produce interchangeable pages.
 *   - R$ 5.000-10.000 -> R$ 100 steps. This is the redutor transition band, where
 *     every R$ 100 produces a materially different retention.
 *   - above R$ 10.000 -> round amounts only, matching how the queries are phrased.
 */
export const SALARY_VALUES: readonly number[] = [
  1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5100, 5200,
  5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200,
  6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200,
  7300, 7350, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100,
  8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100,
  9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900, 10000, 11000,
  12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 22000,
  25000, 30000, 35000, 40000, 50000, 100000, 200000,
];

/** Bands used by the homepage index, so all 77 routes stay one click from the root. */
export const SALARY_BANDS: readonly { label: string; hint: string; values: number[] }[] = [
  {
    label: 'Até R$ 5.000',
    hint: 'Faixa isenta de retenção na fonte em 2026',
    values: SALARY_VALUES.filter((s) => s < 5000),
  },
  {
    label: 'R$ 5.000 a R$ 7.350',
    hint: 'Faixa do redutor decrescente — muda a cada R$ 100',
    values: SALARY_VALUES.filter((s) => s >= 5000 && s <= 7350),
  },
  {
    label: 'R$ 7.400 a R$ 10.000',
    hint: 'Tabela progressiva cheia, sem redutor',
    values: SALARY_VALUES.filter((s) => s > 7350 && s <= 10000),
  },
  {
    label: 'Acima de R$ 10.000',
    hint: 'Faixas altas, alíquota efetiva crescente',
    values: SALARY_VALUES.filter((s) => s > 10000),
  },
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
  /** Badge modifier class, so the card colour matches the benefit type. */
  badgeClass: string;
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

const BADGE_CLASS_BY_BENEFIT: Record<BenefitType, string> = {
  ISENTO_TOTAL: 'ci-badge ci-badge--isento',
  REDUCAO_PARCIAL: 'ci-badge ci-badge--parcial',
  FORA_DO_BENEFICIO: 'ci-badge ci-badge--padrao',
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
    badgeClass: BADGE_CLASS_BY_BENEFIT[calc.benefitType],
    savingLine,
    monthlySaving: calc.monthlySaving,
    annualSaving12Months: calc.annualSaving12Months,
    benefitType: calc.benefitType,
  };
}

export const FEATURED_SALARY_EXAMPLES: SalaryExample[] =
  FEATURED_SALARIES.map(buildSalaryExample);
