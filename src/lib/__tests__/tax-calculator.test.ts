import { describe, it, expect } from 'vitest';
import {
  calculateINSS,
  calculateProgressiveTax,
  calculate2026Reducer,
  calculateNew2026Tax,
  calculateTaxComparison,
} from '../tax-calculator';

describe('Imposto de Renda 2026 Tax Rules Engine', () => {
  describe('INSS Calculations', () => {
    it('returns 0 for negative or zero salary', () => {
      expect(calculateINSS(0)).toBe(0);
      expect(calculateINSS(-100)).toBe(0);
    });

    it('calculates INSS for minimum salary range (7.5%)', () => {
      expect(calculateINSS(1412.00)).toBeCloseTo(105.90, 2);
    });

    it('caps INSS at maximum teto (R$ 7.786,02)', () => {
      const tetoInss = calculateINSS(7786.02);
      const highSalaryInss = calculateINSS(15000);
      expect(highSalaryInss).toEqual(tetoInss);
      expect(highSalaryInss).toBeGreaterThan(900);
    });
  });

  describe('2026 Reform Rules & Boundaries', () => {
    it('gives TOTAL EXEMPTION for taxable income up to R$ 5.000,00', () => {
      const res4000 = calculateNew2026Tax(4000);
      expect(res4000.finalTax).toBe(0);
      expect(res4000.benefitType).toBe('ISENTO_TOTAL');

      const res5000 = calculateNew2026Tax(5000);
      expect(res5000.finalTax).toBe(0);
      expect(res5000.benefitType).toBe('ISENTO_TOTAL');
    });

    it('applies PARTIAL REDUCTION for taxable income between R$ 5.000,01 and R$ 7.350,00', () => {
      const res6000 = calculateNew2026Tax(6000);
      expect(res6000.benefitType).toBe('REDUCAO_PARCIAL');
      expect(res6000.reducerAmount).toBeGreaterThan(0);
      expect(res6000.finalTax).toBeLessThan(calculateProgressiveTax(6000));

      const res7000 = calculateNew2026Tax(7000);
      expect(res7000.benefitType).toBe('REDUCAO_PARCIAL');
      expect(res7000.reducerAmount).toBeGreaterThan(0);
      expect(res7000.finalTax).toBeLessThan(calculateProgressiveTax(7000));
    });

    it('reaches 0 reducer at upper threshold R$ 7.350,00', () => {
      const reducerAt7350 = calculate2026Reducer(7350);
      expect(reducerAt7350).toBeCloseTo(0, 1);

      const res7350 = calculateNew2026Tax(7350);
      expect(res7350.finalTax).toBeCloseTo(calculateProgressiveTax(7350), 1);
    });

    it('does NOT apply reducer above R$ 7.350,00 (FORA_DO_BENEFICIO)', () => {
      const res8000 = calculateNew2026Tax(8000);
      expect(res8000.benefitType).toBe('FORA_DO_BENEFICIO');
      expect(res8000.reducerAmount).toBe(0);
      expect(res8000.finalTax).toEqual(calculateProgressiveTax(8000));

      const res10000 = calculateNew2026Tax(10000);
      expect(res10000.benefitType).toBe('FORA_DO_BENEFICIO');
      expect(res10000.finalTax).toEqual(calculateProgressiveTax(10000));
    });
  });

  describe('Full Tax Comparison Scenarios', () => {
    it('computes positive savings for R$ 5.000 gross salary', () => {
      const calc = calculateTaxComparison(5000);
      expect(calc.newTax).toBeLessThanOrEqual(calc.oldTax);
      expect(calc.monthlySaving).toBeGreaterThan(0);
      expect(calc.annualSaving12Months).toBeCloseTo(calc.monthlySaving * 12, 2);
      expect(calc.annualSaving13Months).toBeCloseTo(calc.monthlySaving * 13, 2);
      expect(calc.benefitType).toBe('ISENTO_TOTAL');
    });

    it('computes partial savings for R$ 6.000 gross salary', () => {
      const calc = calculateTaxComparison(6000);
      expect(calc.newTax).toBeLessThan(calc.oldTax);
      expect(calc.monthlySaving).toBeGreaterThan(0);
      expect(calc.benefitType).toBe('REDUCAO_PARCIAL');
    });

    it('returns zero savings for high income R$ 12.000 gross salary', () => {
      const calc = calculateTaxComparison(12000);
      expect(calc.newTax).toEqual(calc.oldTax);
      expect(calc.monthlySaving).toBe(0);
      expect(calc.benefitType).toBe('FORA_DO_BENEFICIO');
    });
  });
});
