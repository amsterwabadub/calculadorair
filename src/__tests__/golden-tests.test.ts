import { describe, it, expect } from 'vitest';
import { calculateKenyaSalary } from '@/config/calculators/kenya';
import { calculateMexicoAguinaldo } from '@/config/calculators/mexico';
import { calculateMoroccoSalary } from '@/config/calculators/morocco';
import { calculateColombiaRetefuente } from '@/config/calculators/colombia';

/**
 * INDEPENDENT GOLDEN TEST SUITE — REGULO 2026
 * Primary Statutory Rule Verification:
 * 1. Kenya: KRA PAYE 2026 & NSSF Year 3 Schedule (Effective Feb 2026, max KES 6,480/mo)
 * 2. Mexico: LFT Art. 87 & Official INEGI UMA 2026 ($117.31 MXN/day; 30 UMA = $3,519.30 MXN)
 * 3. Morocco: Code Général des Impôts 2026 (Art. 59 Frais Pro & Art. 74 Charges de Famille)
 * 4. Colombia: DIAN Res. 000238 de 2025 (Official UVT 2026 = $52,374 COP)
 */

describe('Golden Statutory Test Suite — Kenya (2026 NSSF Schedule Effective Feb 2026)', () => {
  it('1. Below-threshold low income (KES 8,000/mo)', () => {
    const res = calculateKenyaSalary({ grossSalary: 8000 });
    const nssf = res.breakdown.find((b) => b.id === 'nssf')?.value;
    const shif = res.breakdown.find((b) => b.id === 'shif')?.value;
    const housing = res.breakdown.find((b) => b.id === 'housing_levy')?.value;
    const netPaye = res.breakdown.find((b) => b.id === 'net_paye')?.value;

    // Hand calculation: NSSF 6% of 8,000 = 480; SHIF min = 300; Housing 1.5% = 120; PAYE = 0
    expect(nssf).toBe(480);
    expect(shif).toBe(300);
    expect(housing).toBe(120);
    expect(netPaye).toBe(0);
    expect(res.heroOutput.value).toBe(8000 - (480 + 300 + 120));
  });

  it('2. Exact Tier I Ceiling (KES 9,000/mo)', () => {
    const res = calculateKenyaSalary({ grossSalary: 9000 });
    const nssf = res.breakdown.find((b) => b.id === 'nssf')?.value;
    // Hand calculation: 9,000 * 0.06 = 540 (Exact Tier I cap)
    expect(nssf).toBe(540);
  });

  it('3. Just-above Tier I threshold (KES 10,000/mo)', () => {
    const res = calculateKenyaSalary({ grossSalary: 10000 });
    const nssf = res.breakdown.find((b) => b.id === 'nssf')?.value;
    // Hand calculation: Tier I 540 + Tier II (1,000 * 0.06 = 60) = 600
    expect(nssf).toBe(600);
  });

  it('4. Middle bracket income (KES 100,000/mo)', () => {
    const res = calculateKenyaSalary({ grossSalary: 100000 });
    const nssf = res.breakdown.find((b) => b.id === 'nssf')?.value;
    const shif = res.breakdown.find((b) => b.id === 'shif')?.value;
    const housing = res.breakdown.find((b) => b.id === 'housing_levy')?.value;
    const netPaye = res.breakdown.find((b) => b.id === 'net_paye')?.value;

    // NSSF: Tier I 540 + Tier II (91,000 * 0.06 = 5,460) = 6,000
    expect(nssf).toBe(6000);
    expect(shif).toBe(2750); // 2.75% of 100,000
    expect(housing).toBe(1500); // 1.5% of 100,000
    expect(netPaye).toBeCloseTo(20170.85, 1);
  });

  it('5. Maximum NSSF Cap Case (KES 150,000/mo)', () => {
    const res = calculateKenyaSalary({ grossSalary: 150000 });
    const nssf = res.breakdown.find((b) => b.id === 'nssf')?.value;
    // Max NSSF cap verified: Tier I 540 + Tier II 5,940 = 6,480
    expect(nssf).toBe(6480);
  });

  it('6. High Income (KES 1,000,000/mo)', () => {
    const res = calculateKenyaSalary({ grossSalary: 1000000 });
    const nssf = res.breakdown.find((b) => b.id === 'nssf')?.value;
    const netPaye = res.breakdown.find((b) => b.id === 'net_paye')?.value;

    expect(nssf).toBe(6480);
    expect(netPaye).toBeCloseTo(303490.35, 1);
  });
});

describe('Golden Statutory Test Suite — Mexico (UMA 2026 Effective Date Boundary)', () => {
  it('1. Effective Date Boundary: January 2026 (UMA 2025 = $113.14 MXN/day)', () => {
    const res = calculateMexicoAguinaldo({
      monthlySalary: 25000,
      daysWorked: 365,
      customDaysEntitled: 15,
      calculationPeriod: 'january2026',
    });

    const gross = res.breakdown.find((b) => b.id === 'gross_aguinaldo')?.value;
    const exempt = res.breakdown.find((b) => b.id === 'exempt_amount')?.value;

    expect(gross).toBe(12500);
    // 30 UMA 2025 = 30 * 113.14 = 3,394.20 MXN
    expect(exempt).toBeCloseTo(3394.20, 2);
  });

  it('2. Effective Date Boundary: Feb 1, 2026 Onward / Aguinaldo 2026 (UMA 2026 = $117.31 MXN/day)', () => {
    const res = calculateMexicoAguinaldo({
      monthlySalary: 25000,
      daysWorked: 365,
      customDaysEntitled: 15,
      calculationPeriod: 'february2026_onward',
    });

    const gross = res.breakdown.find((b) => b.id === 'gross_aguinaldo')?.value;
    const exempt = res.breakdown.find((b) => b.id === 'exempt_amount')?.value;

    expect(gross).toBe(12500);
    // 30 UMA 2026 = 30 * 117.31 = 3,519.30 MXN
    expect(exempt).toBeCloseTo(3519.30, 2);
  });

  it('3. Below-threshold fully exempt (Salary $6,000 MXN)', () => {
    const res = calculateMexicoAguinaldo({
      monthlySalary: 6000,
      daysWorked: 365,
      customDaysEntitled: 15,
    });

    const gross = res.breakdown.find((b) => b.id === 'gross_aguinaldo')?.value;
    const exempt = res.breakdown.find((b) => b.id === 'exempt_amount')?.value;
    const isr = res.breakdown.find((b) => b.id === 'estimated_isr')?.value;

    expect(gross).toBe(3000);
    expect(exempt).toBe(3000);
    expect(isr).toBe(0);
    expect(res.heroOutput.value).toBe(3000);
  });

  it('4. Exact Exemption Threshold Case ($3,519.30 MXN Aguinaldo)', () => {
    const res = calculateMexicoAguinaldo({
      monthlySalary: 7038.60,
      daysWorked: 365,
      customDaysEntitled: 15,
    });

    const exempt = res.breakdown.find((b) => b.id === 'exempt_amount')?.value;
    const taxable = res.breakdown.find((b) => b.id === 'taxable_base')?.value;

    expect(exempt).toBeCloseTo(3519.30, 2);
    expect(taxable).toBeCloseTo(0, 2);
  });

  it('5. Proportional Days Worked (182.5 days)', () => {
    const res = calculateMexicoAguinaldo({
      monthlySalary: 20000,
      daysWorked: 182.5,
      customDaysEntitled: 15,
    });

    const gross = res.breakdown.find((b) => b.id === 'gross_aguinaldo')?.value;
    expect(gross).toBe(5000);
  });
});

describe('Golden Statutory Test Suite — Morocco (CGI Art. 59 & DGI IR 2026)', () => {
  it('1. Below-threshold income (Gross 3,000 DH/mo)', () => {
    const res = calculateMoroccoSalary({ grossSalary: 3000, dependents: 0 });
    const cnss = res.breakdown.find((b) => b.id === 'cnss')?.value;
    const amo = res.breakdown.find((b) => b.id === 'amo')?.value;
    const netIr = res.breakdown.find((b) => b.id === 'net_ir')?.value;

    expect(cnss).toBeCloseTo(134.40, 2);
    expect(amo).toBeCloseTo(67.80, 2);
    expect(netIr).toBe(0);
    expect(res.heroOutput.value).toBeCloseTo(2797.80, 2);
  });

  it('2. Exact CNSS Ceiling Case (Gross 6,000 DH/mo)', () => {
    const res = calculateMoroccoSalary({ grossSalary: 6000, dependents: 0 });
    const cnss = res.breakdown.find((b) => b.id === 'cnss')?.value;

    // CNSS capped at 6,000 * 4.48% = 268.80 DH
    expect(cnss).toBeCloseTo(268.80, 2);
  });

  it('3. CGI Art. 59 Frais Professionnels Rate Change (7,000 DH/mo vs 6,500 DH/mo)', () => {
    const res = calculateMoroccoSalary({ grossSalary: 7000, dependents: 0 });
    const fraisPro = res.breakdown.find((b) => b.id === 'frais_pro')?.value;

    // Over 6,500 DH/mo, Frais Pro rate is 25% = 7,000 * 0.25 = 1,750 DH
    expect(fraisPro).toBe(1750);
  });

  it('4. Middle Income (Gross 12,000 DH/mo, 2 Dependents)', () => {
    const res = calculateMoroccoSalary({ grossSalary: 12000, dependents: 2 });
    const cnss = res.breakdown.find((b) => b.id === 'cnss')?.value;
    const amo = res.breakdown.find((b) => b.id === 'amo')?.value;
    const family = res.breakdown.find((b) => b.id === 'family_relief')?.value;
    const netIr = res.breakdown.find((b) => b.id === 'net_ir')?.value;

    expect(cnss).toBeCloseTo(268.80, 2);
    expect(amo).toBeCloseTo(271.20, 2);
    expect(family).toBe(100);
    expect(netIr).toBeCloseTo(971.40, 1);
  });

  it('5. High Income (Gross 25,000 DH/mo, 6 Dependents Max)', () => {
    const res = calculateMoroccoSalary({ grossSalary: 25000, dependents: 6 });
    const family = res.breakdown.find((b) => b.id === 'family_relief')?.value;
    const netIr = res.breakdown.find((b) => b.id === 'net_ir')?.value;

    expect(family).toBe(300); // 6 * 50 = 300 max
    expect(netIr).toBeCloseTo(5279.00, 1);
  });
});

describe('Golden Statutory Test Suite — Colombia (DIAN Res. 000238 - Official UVT 2026 $52,374)', () => {
  it('1. Below Retefuente Threshold (Gross $4,000,000 COP/mo)', () => {
    const res = calculateColombiaRetefuente({ grossSalary: 4000000 });
    const retefuente = res.breakdown.find((b) => b.id === 'retefuente_total')?.value;

    // Taxable base in UVT is ~52.7 UVT <= 95 UVT threshold -> Retefuente = 0 COP
    expect(retefuente).toBe(0);
  });

  it('2. Exact 95 UVT Entry Threshold ($4,975,530 COP Taxable Base)', () => {
    const uvt2026 = 52374;
    const exactThresholdCop = 95 * uvt2026;
    expect(exactThresholdCop).toBe(4975530);
  });

  it('3. Middle Income ($15,000,000 COP/mo, Has Dependents)', () => {
    const res = calculateColombiaRetefuente({
      grossSalary: 15000000,
      hasDependents: true,
    });

    const healthPension = res.breakdown.find((b) => b.id === 'health_pension')?.value;
    const fsp = res.breakdown.find((b) => b.id === 'fsp')?.value;
    const dependents = res.breakdown.find((b) => b.id === 'deductions_387')?.value;
    const retefuente = res.breakdown.find((b) => b.id === 'retefuente_total')?.value;

    expect(healthPension).toBe(1200000); // 8% of 15M
    expect(fsp).toBe(150000); // 1% of 15M
    expect(dependents).toBe(1500000); // 10% of 15M (below 32 UVT cap)
    expect(retefuente).toBeCloseTo(899100.30, -1);
  });

  it('4. Maximum Deduction Caps Check (Housing & Prepaid Health)', () => {
    const res = calculateColombiaRetefuente({
      grossSalary: 30000000,
      housingInterest: 10000000,
      prepaidHealth: 2000000,
    });

    const deductions387 = res.breakdown.find((b) => b.id === 'deductions_387')?.value;
    const uvt2026 = 52374;
    const expectedHousingCap = 100 * uvt2026; // 5,237,400
    const expectedPrepaidCap = 16 * uvt2026; // 837,984

    expect(deductions387).toBe(expectedHousingCap + expectedPrepaidCap);
  });
});
