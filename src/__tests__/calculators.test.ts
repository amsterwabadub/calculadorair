import { describe, it, expect } from 'vitest';
import { calculateKenyaSalary } from '@/config/calculators/kenya';
import { calculateMexicoAguinaldo } from '@/config/calculators/mexico';
import { calculateMoroccoSalary } from '@/config/calculators/morocco';
import { calculateColombiaRetefuente } from '@/config/calculators/colombia';

describe('ReguKit Statutory Calculation Engines 2026', () => {
  describe('Kenya Net Salary Calculator Engine', () => {
    it('calculates net salary correctly for KES 100,000 gross monthly salary', () => {
      const result = calculateKenyaSalary({ grossSalary: 100000, payFrequency: 'monthly' });
      expect(result.heroOutput.value).toBeGreaterThan(0);
      expect(result.heroOutput.value).toBeLessThan(100000);
      
      // NSSF Year 3 schedule: Tier I up to 9k (540), Tier II 9k..100k @ 6% (5,460) = 6,000 KES
      const nssf = result.breakdown.find((b) => b.id === 'nssf');
      expect(nssf?.value).toBe(6000);

      // SHIF 2.75% of 100,000 = 2,750
      const shif = result.breakdown.find((b) => b.id === 'shif');
      expect(shif?.value).toBe(2750);

      // Housing Levy 1.5% of 100,000 = 1,500
      const housing = result.breakdown.find((b) => b.id === 'housing_levy');
      expect(housing?.value).toBe(1500);

      // Hero output value (net salary) must be positive and less than gross
      expect(result.heroOutput.value).toBeGreaterThan(0);
      expect(result.heroOutput.value).toBeLessThan(100000);
    });
  });

  describe('Mexico Aguinaldo Calculator Engine', () => {
    it('calculates net aguinaldo with 30 UMA exemption for MXN 25,000 salary', () => {
      const inputs = {
        monthlySalary: 25000,
        daysWorked: 365,
        dailyRateOverride: 0,
      };

      const result = calculateMexicoAguinaldo(inputs);

      // Gross aguinaldo for 365 days = 15 days of daily rate (25000 / 30 * 15 = 12,500 MXN)
      const gross = result.breakdown.find((b) => b.id === 'gross_aguinaldo');
      expect(gross?.value).toBeCloseTo(12500, 1);

      // Exempt 30 UMA (2026 UMA = $117.31 MXN -> $3,519.30 MXN)
      const exempt = result.breakdown.find((b) => b.id === 'exempt_amount');
      expect(exempt?.value).toBeCloseTo(3519.30, 1);

      // Net must be positive and less than gross
      expect(result.heroOutput.value).toBeGreaterThan(3394.20);
      expect(result.heroOutput.value).toBeLessThan(12500);
    });
  });

  describe('Morocco Salaire Net Calculator Engine', () => {
    it('calculates net salary for 12,000 MAD gross monthly salary', () => {
      const result = calculateMoroccoSalary({ grossSalary: 12000, dependents: 2 });
      
      // CNSS capped at 6,000 MAD gross * 4.48% = 268.80 MAD
      const cnss = result.breakdown.find((b) => b.id === 'cnss');
      expect(cnss?.value).toBeCloseTo(268.80, 2);

      // AMO 2.26% of 12,000 = 271.20 MAD
      const amo = result.breakdown.find((b) => b.id === 'amo');
      expect(amo?.value).toBeCloseTo(271.20, 2);

      // Family relief for 2 dependents = 100 MAD
      const family = result.breakdown.find((b) => b.id === 'family_relief');
      expect(family?.value).toBe(100);

      expect(result.heroOutput.value).toBeGreaterThan(0);
      expect(result.heroOutput.value).toBeLessThan(12000);
    });
  });

  describe('Colombia Retención en la Fuente Calculator Engine', () => {
    it('calculates retención en la fuente for COP 15,000,000 gross monthly salary', () => {
      const result = calculateColombiaRetefuente({
        grossSalary: 15000000,
        hasDependents: true,
        housingInterest: 1000000,
        prepaidHealth: 500000,
      });

      // Health 4% = 600,000 COP, Pension 4% = 600,000 COP
      const healthPension = result.breakdown.find((b) => b.id === 'health_pension');
      expect(healthPension?.value).toBe(1200000);

      // Retefuente hero output must be > 0 for 15M salary
      expect(result.heroOutput.value).toBeGreaterThan(0);

      // Net take-home salary must be > 0 and < 15,000,000
      const net = result.breakdown.find((b) => b.id === 'net_takehome');
      expect(net?.value).toBeGreaterThan(0);
      expect(net?.value).toBeLessThan(15000000);
    });
  });
});
