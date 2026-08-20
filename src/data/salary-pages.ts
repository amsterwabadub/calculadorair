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
 * Two filters, applied in this order.
 *
 * 1. Does anyone search it? Every amount was confirmed against live Google
 *    autocomplete (pt-BR/BR, 2026-08-19): the returned suggestion had to contain
 *    the amount itself and an income-tax term. 107 amounts passed that test.
 *
 * 2. Does the page have a different answer? This is the filter that matters, and
 *    it cuts far harder than the first. Running the 2026 engine across the whole
 *    range shows:
 *      - below R$ 5.000  -> IRRF is R$ 0,00 for every amount. Eight pages would
 *        give one answer, so only the amounts that already rank are kept.
 *      - R$ 5.000-7.350  -> the redutor decays across this band and every R$ 100
 *        step changes both the tax (~R$ 37) and the saving (~R$ 13). This is the
 *        only range where fine granularity produces genuinely distinct pages, and
 *        it is built out in full.
 *      - above R$ 7.350  -> the redutor is gone, so the saving versus 2025 is
 *        R$ 12,73 at R$ 7.400 and R$ 12,73 at R$ 200.000. The tax differs but the
 *        reform angle this site is built on does not, so only round amounts that
 *        already have Search Console impressions are kept.
 *
 * 42 amounts that passed filter 1 and failed filter 2 were removed on 2026-08-19
 * and 301 to their nearest kept neighbour; none had been crawled by Google.
 * The intent those amounts do have ("salario liquido" above the redutor ceiling)
 * is a different page type, and is gated on this band producing clicks first.
 */
export const SALARY_VALUES: readonly number[] = [
  3000, 3500, 4000, 4500, 5000, 5100, 5200, 5300, 5400, 5500,
  5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500,
  6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7350, 8000,
  9000, 10000, 12000, 15000, 20000,
];

/** Bands used by the homepage index, so all 35 routes stay one click from the root. */
export const SALARY_BANDS: readonly { label: string; hint: string; values: number[] }[] = [
  {
    label: 'Até R$ 5.000',
    hint: 'IRRF de R$ 0,00 — o redutor anula todo o imposto',
    values: SALARY_VALUES.filter((s) => s < 5000),
  },
  {
    label: 'R$ 5.000 a R$ 7.350',
    hint: 'Faixa do redutor decrescente — muda a cada R$ 100',
    values: SALARY_VALUES.filter((s) => s >= 5000 && s <= 7350),
  },
  {
    label: 'Acima de R$ 7.350',
    hint: 'Sem redutor — vale a tabela progressiva de 2026',
    values: SALARY_VALUES.filter((s) => s > 7350),
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

/* ------------------------------------------------------------------ page-1 sprint

   A side-by-side 2025 vs 2026 table for the homepage.

   None of the pages currently holding page 1 for "calculadora imposto de renda"
   (Receita, DIEESE, Brasilprev, eCálculos, InvestNews, Contábeis, Siprovel,
   UNIFEBE, TranspNet, Poder360) publishes the two regimes next to each other with
   the net salary. They return a single number for a single salary. This table is
   the one thing on the page a visitor cannot get from any of them, and it is the
   reason to prefer this result over the ten above it.

   Every cell is produced by the same engine that powers the calculator, so the
   table cannot drift away from what the tool computes. */
export interface ComparisonRow {
  salary: number;
  label: string;
  slug: string;
  inss: string;
  oldTax: string;
  newTax: string;
  saving: string;
  netSalary: string;
  ruleLabel: string;
}

/** Rounded, recognisable salaries that span the three benefit zones. */
const COMPARISON_SALARIES: readonly number[] = [3000, 4000, 5000, 6000, 7000, 7350, 8000, 10000, 15000];

export const COMPARISON_ROWS: ComparisonRow[] = COMPARISON_SALARIES.map((salary) => {
  const c = calculateTaxComparison(salary);
  const zone =
    c.benefitType === 'ISENTO_TOTAL'
      ? 'Isento na fonte'
      : c.benefitType === 'REDUCAO_PARCIAL'
        ? 'Redutor parcial'
        : 'Tabela progressiva';
  return {
    salary,
    label: `R$ ${salary.toLocaleString('pt-BR')}`,
    slug: salarySlug(salary),
    inss: formatBRL(c.inssDeduction),
    oldTax: formatBRL(c.oldTax),
    newTax: formatBRL(c.newTax),
    saving: c.monthlySaving > 0 ? `+ ${formatBRL(c.monthlySaving)}` : '—',
    netSalary: formatBRL(c.netSalary2026),
    ruleLabel: zone,
  };
});
