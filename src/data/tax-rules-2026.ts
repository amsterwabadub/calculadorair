/**
 * Official Tax Rules & Parameters — IRRF Brazil, 2025 baseline vs 2026 reform
 *
 * Primary official sources:
 * - Lei nº 15.270/2025 (Reforma do IRPF, vigência 01/01/2026)
 * - Receita Federal — Tributação de 2026:
 *   https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
 * - Receita Federal — orientação sobre o cálculo do redutor (dez/2025)
 * - Portaria Interministerial MPS/MF — tabela de contribuição do INSS 2026
 *
 * Effective date: 2026-01-01
 * Last reviewed:  2026-08-11
 *
 * IMPORTANT — basis of the redutor
 * -------------------------------
 * There are TWO different bases in this calculation, and mixing them up changes
 * the answer:
 *
 *   1. "rendimentos tributáveis sujeitos à incidência mensal" — the taxable
 *      earnings BEFORE deductions. This is what the REDUTOR is computed on, and
 *      what the R$ 5.000,00 / R$ 7.350,00 thresholds refer to.
 *   2. "base de cálculo" — those same earnings AFTER INSS, dependants and other
 *      legal deductions (or after the desconto simplificado, whichever is
 *      larger). This is what the PROGRESSIVE TABLE is applied to.
 *
 * The redutor uses (1), not (2). Confirmed arithmetically by the two anchor
 * points the law is built around:
 *
 *   redutor(5.000,00) = 978,62 - 0,133145 × 5.000,00 = 312,89
 *   ...which is exactly the tax due on a R$ 5.000 salary using the simplified
 *      discount: (5.000 - 607,20) × 22,5% - 675,49 = 312,89  →  imposto zero.
 *
 *   redutor(7.350,00) = 978,62 - 0,133145 × 7.350,00 = 0,00
 *   ...the exact point where the benefit is exhausted.
 *
 * Neither identity holds if the redutor is applied to the post-deduction base.
 */

export interface ProgressiveBracket {
  limit: number; // Upper limit of the bracket (base de cálculo), Infinity for the top
  rate: number; // e.g. 0.075 for 7,5%
  deduction: number; // Parcela a deduzir
}

export interface INSSBracket {
  limit: number;
  rate: number;
}

/** Shared across both regimes — unchanged by the reform. */
export const DEPENDENT_DEDUCTION = 189.59;

/**
 * 2025 regime — used only as the "antes da reforma" comparison baseline.
 * Tabela progressiva mensal vigente de maio/2024 até 31/12/2025.
 */
export const RULES_2025 = {
  label: 'Tabela progressiva mensal 2025',
  exemptionCeiling: 2259.2,
  simplifiedMonthlyDiscount: 564.8, // 25% de 2.259,20
  brackets: [
    { limit: 2259.2, rate: 0.0, deduction: 0.0 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.0 },
  ] as ProgressiveBracket[],
};

/**
 * 2026 regime — Lei nº 15.270/2025, vigente a partir de 01/01/2026.
 */
export const RULES_2026 = {
  label: 'Tabela progressiva mensal 2026 (Lei nº 15.270/2025)',
  exemptionCeiling: 2428.8,
  simplifiedMonthlyDiscount: 607.2, // 25% de 2.428,80
  brackets: [
    { limit: 2428.8, rate: 0.0, deduction: 0.0 },
    { limit: 2826.65, rate: 0.075, deduction: 182.16 },
    { limit: 3751.05, rate: 0.15, deduction: 394.16 },
    { limit: 4664.68, rate: 0.225, deduction: 675.49 },
    { limit: Infinity, rate: 0.275, deduction: 908.73 },
  ] as ProgressiveBracket[],

  /**
   * Redutor do imposto — applied to the gross monthly income.
   * Always capped at the tax actually assessed (never generates a credit).
   */
  redutor: {
    /** Gross income at or below which the redutor zeroes the tax entirely. */
    fullExemptionGrossLimit: 5000.0,
    /** Gross income above which no redutor applies at all. */
    grossUpperLimit: 7350.0,
    baseAmount: 978.62,
    multiplier: 0.133145,
    /** redutor(5.000,00) — the largest value the formula can yield in range. */
    maxRedutor: 312.89,
  },
};

/**
 * INSS — contribuição do segurado empregado (CLT), 2026.
 * Salário mínimo R$ 1.621,00; teto contributivo R$ 8.475,55.
 * Progressive by band; total contribution at the teto is R$ 988,09.
 */
export const INSS_BRACKETS_2026: INSSBracket[] = [
  { limit: 1621.0, rate: 0.075 },
  { limit: 2902.84, rate: 0.09 },
  { limit: 4354.27, rate: 0.12 },
  { limit: 8475.55, rate: 0.14 }, // Teto
];

export const TAX_RULES_2026 = {
  effectiveDate: '2026-01-01',
  lastReviewedDate: '2026-08-11',
  sources: [
    {
      title: 'Tabelas de Tributação do IRPF 2026 — Receita Federal',
      url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026',
    },
    {
      title: 'Tabelas de Tributação do IRPF — Receita Federal',
      url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas',
    },
  ],

  dependentDeduction: DEPENDENT_DEDUCTION,
  rules2025: RULES_2025,
  rules2026: RULES_2026,
  inssBrackets: INSS_BRACKETS_2026,
};
