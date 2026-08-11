import { describe, it, expect } from 'vitest';
import {
  calculateINSS,
  calculateProgressiveTax2025,
  calculateProgressiveTax2026,
  calculate2026Reducer,
  calculateNew2026Tax,
  calculateTaxComparison,
} from '../tax-calculator';
import { RULES_2026, INSS_BRACKETS_2026 } from '@/data/tax-rules-2026';
import { FEATURED_SALARY_EXAMPLES, SALARY_VALUES, buildSalaryExample } from '@/data/salary-pages';

/**
 * Golden statutory suite — Brazil IRRF 2026 (Lei nº 15.270/2025).
 *
 * The anchors below are taken from Receita Federal's own published worked
 * example and from the two fixed points the law is constructed around.
 */
describe('INSS 2026 (contribuição do segurado empregado)', () => {
  it('returns 0 for zero or negative salary', () => {
    expect(calculateINSS(0)).toBe(0);
    expect(calculateINSS(-100)).toBe(0);
  });

  it('applies 7,5% up to the salário mínimo of R$ 1.621,00', () => {
    // 1.621,00 x 7,5% = 121,575 → 121,57 after currency rounding
    expect(calculateINSS(1621.0)).toBeCloseTo(121.57, 2);
  });

  it('GOLDEN: contribution at the teto of R$ 8.475,55 is exactly R$ 988,09', () => {
    expect(calculateINSS(8475.55)).toBeCloseTo(988.09, 2);
  });

  it('freezes the contribution above the teto', () => {
    const atTeto = calculateINSS(8475.55);
    expect(calculateINSS(15000)).toBeCloseTo(atTeto, 2);
    expect(calculateINSS(50000)).toBeCloseTo(atTeto, 2);
  });

  it('uses the 2026 band boundaries', () => {
    expect(INSS_BRACKETS_2026.map((b) => b.limit)).toEqual([1621.0, 2902.84, 4354.27, 8475.55]);
  });
});

describe('Redutor do IRRF 2026 — computed on GROSS income', () => {
  it('GOLDEN: redutor at R$ 5.000,00 gross is exactly R$ 312,89', () => {
    expect(calculate2026Reducer(5000)).toBeCloseTo(312.89, 2);
    expect(calculate2026Reducer(5000)).toBeCloseTo(RULES_2026.redutor.maxRedutor, 2);
  });

  it('GOLDEN: redutor reaches exactly zero at R$ 7.350,00 gross', () => {
    expect(calculate2026Reducer(7350)).toBeCloseTo(0, 2);
  });

  it('GOLDEN: redutor at R$ 6.000,00 gross is R$ 179,75 (Receita Federal example)', () => {
    expect(calculate2026Reducer(6000)).toBeCloseTo(179.75, 2);
  });

  it('does not apply above R$ 7.350,00 gross', () => {
    expect(calculate2026Reducer(7350.01)).toBe(0);
    expect(calculate2026Reducer(8000)).toBe(0);
    expect(calculate2026Reducer(20000)).toBe(0);
  });

  it('is a function of gross income, NOT of the base de cálculo', () => {
    // If the redutor were applied to the post-deduction base, a R$ 6.000 salary
    // (base 5.392,80 under the simplified discount) would yield 260,60 — which
    // would break Receita Federal's published result of 394,54.
    expect(calculate2026Reducer(5392.8)).toBeCloseTo(260.6, 2);
    expect(calculate2026Reducer(6000)).not.toBeCloseTo(260.6, 2);
  });
});

describe('Tabela progressiva mensal', () => {
  it('GOLDEN: 2026 table on a base of R$ 5.392,80 yields R$ 574,29 (Receita Federal example)', () => {
    expect(calculateProgressiveTax2026(5392.8)).toBeCloseTo(574.29, 2);
  });

  it('GOLDEN: 2026 tax on a R$ 5.000 salary using the simplified discount equals the max redutor', () => {
    // (5.000,00 - 607,20) x 22,5% - 675,49 = 312,89 — exactly cancelled by the redutor.
    expect(calculateProgressiveTax2026(5000 - RULES_2026.simplifiedMonthlyDiscount)).toBeCloseTo(
      312.89,
      2,
    );
  });

  it('exempts up to the 2026 threshold of R$ 2.428,80', () => {
    expect(calculateProgressiveTax2026(2428.8)).toBe(0);
    expect(calculateProgressiveTax2026(2000)).toBe(0);
    // The parcela a deduzir is calibrated so the tax is continuous at the
    // threshold — it starts at ~0 there and only becomes material above it.
    expect(calculateProgressiveTax2026(2500)).toBeCloseTo(5.34, 2);
    expect(calculateProgressiveTax2026(2800)).toBeGreaterThan(0);
  });

  it('2025 baseline table exempts only up to R$ 2.259,20', () => {
    expect(calculateProgressiveTax2025(2259.2)).toBe(0);
    expect(calculateProgressiveTax2025(2400)).toBeGreaterThan(0);
  });

  it('2026 table is never harsher than the 2025 table on the same base', () => {
    for (let base = 0; base <= 20000; base += 250) {
      expect(calculateProgressiveTax2026(base)).toBeLessThanOrEqual(
        calculateProgressiveTax2025(base) + 0.01,
      );
    }
  });
});

describe('calculateNew2026Tax — redutor capped at the tax assessed', () => {
  it('never produces a negative tax or a credit', () => {
    for (let gross = 0; gross <= 12000; gross += 100) {
      const r = calculateNew2026Tax(gross, Math.max(0, gross - RULES_2026.simplifiedMonthlyDiscount));
      expect(r.finalTax).toBeGreaterThanOrEqual(0);
      expect(r.reducerAmount).toBeLessThanOrEqual(r.taxBeforeRedutor + 0.01);
    }
  });

  it('GOLDEN: R$ 6.000 gross on the simplified path gives R$ 394,54 (Receita Federal example)', () => {
    const r = calculateNew2026Tax(6000, 6000 - RULES_2026.simplifiedMonthlyDiscount);
    expect(r.taxBeforeRedutor).toBeCloseTo(574.29, 2);
    expect(r.reducerAmount).toBeCloseTo(179.75, 2);
    expect(r.finalTax).toBeCloseTo(394.54, 2);
  });
});

describe('calculateTaxComparison — end-to-end', () => {
  it('produces zero IRRF for every gross salary up to R$ 5.000,00', () => {
    for (let gross = 500; gross <= 5000; gross += 100) {
      const calc = calculateTaxComparison(gross);
      expect(calc.newTax).toBe(0);
      expect(calc.benefitType).toBe('ISENTO_TOTAL');
    }
  });

  it('applies a partial redutor between R$ 5.000,01 and R$ 7.350,00', () => {
    const calc = calculateTaxComparison(6000);
    expect(calc.reducerAmount).toBeGreaterThan(0);
    expect(calc.newTax).toBeGreaterThan(0);
    expect(calc.newTax).toBeLessThan(calc.oldTax);
    expect(calc.benefitType).toBe('REDUCAO_PARCIAL');
  });

  it('applies no redutor above R$ 7.350,00 gross', () => {
    const calc = calculateTaxComparison(8000);
    expect(calc.reducerAmount).toBe(0);
    expect(calc.benefitType).toBe('FORA_DO_BENEFICIO');
  });

  it('never reports a negative saving, and 2026 is never worse than 2025', () => {
    for (let gross = 0; gross <= 25000; gross += 250) {
      const calc = calculateTaxComparison(gross);
      expect(calc.monthlySaving).toBeGreaterThanOrEqual(0);
      expect(calc.newTax).toBeLessThanOrEqual(calc.oldTax + 0.01);
    }
  });

  it('scales the annual savings consistently', () => {
    const calc = calculateTaxComparison(6000);
    expect(calc.annualSaving12Months).toBeCloseTo(calc.monthlySaving * 12, 2);
    expect(calc.annualSaving13Months).toBeCloseTo(calc.monthlySaving * 13, 2);
  });

  it('lets dependents lower the base de cálculo and the tax', () => {
    const none = calculateTaxComparison(9000, { dependents: 0 });
    const three = calculateTaxComparison(9000, { dependents: 3 });
    expect(three.taxableIncome).toBeLessThan(none.taxableIncome);
    expect(three.newTax).toBeLessThan(none.newTax);
  });

  it('takes the larger of legal deductions and the desconto simplificado', () => {
    // At a low salary INSS is smaller than the simplified discount.
    const low = calculateTaxComparison(2000);
    expect(low.newTotalDeductions).toBe(RULES_2026.simplifiedMonthlyDiscount);
    // At a high salary INSS alone exceeds it.
    const high = calculateTaxComparison(9000);
    expect(high.newTotalDeductions).toBeCloseTo(high.inssDeduction, 2);
  });
});

/**
 * Regression guard for the homepage cards.
 *
 * These previously carried hardcoded savings that contradicted the engine.
 * The cards must now be derived from `calculateTaxComparison` and agree exactly
 * with the salary page they link to.
 */
describe('Homepage salary cards — single source of truth', () => {
  it('every featured salary has a real long-tail route', () => {
    for (const ex of FEATURED_SALARY_EXAMPLES) {
      expect(SALARY_VALUES).toContain(ex.salary);
      expect(ex.slug).toBe(`imposto-de-renda-salario-${ex.salary}`);
    }
  });

  it('card figures match the engine exactly for every featured salary', () => {
    for (const ex of FEATURED_SALARY_EXAMPLES) {
      const calc = calculateTaxComparison(ex.salary);
      expect(ex.monthlySaving).toBe(calc.monthlySaving);
      expect(ex.annualSaving12Months).toBe(calc.annualSaving12Months);
      expect(ex.benefitType).toBe(calc.benefitType);
    }
  });

  it('card copy states a saving only when there actually is one', () => {
    for (const ex of FEATURED_SALARY_EXAMPLES) {
      if (ex.monthlySaving > 0) {
        expect(ex.savingLine).toContain('Economia de');
      } else {
        expect(ex.savingLine).not.toContain('Economia de');
      }
    }
  });

  it('holds for every salary route, not just the featured ones', () => {
    for (const salary of SALARY_VALUES) {
      const ex = buildSalaryExample(salary);
      const calc = calculateTaxComparison(salary);
      expect(ex.monthlySaving).toBe(calc.monthlySaving);
      expect(ex.annualSaving12Months).toBe(calc.annualSaving12Months);
    }
  });
});
