/**
 * Official Tax Rules & Parameters for Imposto de Renda 2026 Reform (Brazil)
 * 
 * Primary Official Sources:
 * - Lei nº 15.270/2025 (Reforma do Imposto de Renda Pessoas Físicas 2026)
 * - Receita Federal do Brasil / Portal gov.br:
 *   https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/tributacao-de-2026
 *   https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/tributacao-de-2025
 * 
 * Effective Date: 2026-01-01
 * Last Reviewed Date: 2026-08-08
 */

export interface ProgressiveBracket {
  limit: number; // Upper limit of the bracket in BRL (Infinity for highest)
  rate: number;  // Tax rate (e.g., 0.075 for 7.5%)
  deduction: number; // Deduction amount in BRL for the bracket formula
}

export interface INSSBracket {
  limit: number;
  rate: number;
}

export const TAX_RULES_2026 = {
  effectiveDate: '2026-01-01',
  lastReviewedDate: '2026-08-08',
  sources: [
    {
      title: 'Lei nº 15.270/2025 - Nova Isenção do Imposto de Renda',
      url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/tributacao-de-2026',
    },
    {
      title: 'Tabelas de Tributação do IRPF - Receita Federal',
      url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas',
    },
  ],

  // 2026 Reform Specific Parameters
  reform2026: {
    exemptionLimit: 5000.00, // Rendimentos até R$ 5.000,00 tem isenção total de IRRF
    reducerUpperLimit: 7350.00, // Redutor decrescente se aplica até R$ 7.350,00
    
    // Formula for Redutor Adicional: R$ 978,62 - (0,133145 * rendimento_tributavel)
    reducerBaseAmount: 978.62,
    reducerMultiplier: 0.133145,
  },

  // 2024 / 2025 Progressive Brackets (Monthly Base de Cálculo)
  // Used for calculating pre-reform tax and as base for progressive tax in 2026
  progressiveBrackets: [
    { limit: 2259.20, rate: 0.00, deduction: 0.00 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 },
  ] as ProgressiveBracket[],

  // Standard Monthly Simplified Discount Option (Desconto Simplificado Mensal)
  // R$ 564,80 (25% of exemption threshold R$ 2.259,20 in 2024/2025)
  simplifiedMonthlyDiscount: 564.80,

  // Deduction per Dependent per month (Dedução por dependente)
  dependentDeduction: 189.59,

  // INSS Progressive Brackets (CLT 2025/2026)
  inssBrackets: [
    { limit: 1412.00, rate: 0.075 },
    { limit: 2666.68, rate: 0.09 },
    { limit: 4000.03, rate: 0.12 },
    { limit: 7786.02, rate: 0.14 }, // Teto INSS
  ] as INSSBracket[],
};
