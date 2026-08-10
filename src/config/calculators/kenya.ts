import { CalculatorConfig, CalculationResult } from '@/types/calculator';

const formatKES = (val: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 2,
  }).format(val);
};

export const calculateKenyaSalary = (inputs: Record<string, any>): CalculationResult => {
  const grossSalary = Math.max(0, Number(inputs.grossSalary) || 0);
  const payFrequency = inputs.payFrequency || 'monthly';
  const multiplier = payFrequency === 'annual' ? 1 / 12 : 1;
  const monthlyGross = grossSalary * multiplier;

  const voluntaryPension = Math.min(20000, Math.max(0, Number(inputs.pension) || 0));
  const otherDeductions = Math.max(0, Number(inputs.otherDeductions) || 0);

  // 1. NSSF Calculation (Official 2026 Schedule - Effective February 2026)
  // Tier I: 6% of earnings up to KES 9,000 (Max KES 540)
  // Tier II: 6% of earnings from KES 9,001 to KES 108,000 (Max KES 5,940)
  const tier1 = Math.min(monthlyGross, 9000) * 0.06;
  const tier2 = Math.max(0, Math.min(monthlyGross - 9000, 99000)) * 0.06;
  const nssfDeduction = tier1 + tier2; // Max KES 6,480/mo

  // 2. SHIF Calculation (Social Health Insurance Fund 2.75%, minimum KES 300)
  let shifDeduction = 0;
  if (monthlyGross > 0) {
    shifDeduction = Math.max(300, monthlyGross * 0.0275);
  }

  // 3. Affordable Housing Levy (1.5% of Gross)
  const housingLevy = monthlyGross * 0.015;

  // 4. Taxable Pay
  const totalAllowableDeductions = nssfDeduction + voluntaryPension;
  const taxablePay = Math.max(0, monthlyGross - totalAllowableDeductions);

  // 5. PAYE Tax Brackets (Monthly 2026)
  // 1 - 24,000: 10%
  // 24,001 - 32,333: 25%
  // 32,334 - 500,000: 30%
  // 500,001 - 800,000: 32.5%
  // Above 800,000: 35%
  let grossPaye = 0;
  if (taxablePay > 800000) {
    grossPaye += (taxablePay - 800000) * 0.35;
    grossPaye += (800000 - 500000) * 0.325;
    grossPaye += (500000 - 32333) * 0.3;
    grossPaye += (32333 - 24000) * 0.25;
    grossPaye += 24000 * 0.1;
  } else if (taxablePay > 500000) {
    grossPaye += (taxablePay - 500000) * 0.325;
    grossPaye += (500000 - 32333) * 0.3;
    grossPaye += (32333 - 24000) * 0.25;
    grossPaye += 24000 * 0.1;
  } else if (taxablePay > 32333) {
    grossPaye += (taxablePay - 32333) * 0.3;
    grossPaye += (32333 - 24000) * 0.25;
    grossPaye += 24000 * 0.1;
  } else if (taxablePay > 24000) {
    grossPaye += (taxablePay - 24000) * 0.25;
    grossPaye += 24000 * 0.1;
  } else {
    grossPaye += taxablePay * 0.1;
  }

  // 6. Tax Reliefs
  const personalRelief = 2400; // KES per month
  const shifRelief = shifDeduction * 0.15; // 15% SHIF Relief
  const totalRelief = personalRelief + shifRelief;

  const netPaye = Math.max(0, grossPaye - totalRelief);

  // 7. Net Monthly Salary
  const totalEmployeeDeductions =
    nssfDeduction + shifDeduction + housingLevy + voluntaryPension + netPaye + otherDeductions;
  const netMonthlySalary = Math.max(0, monthlyGross - totalEmployeeDeductions);

  // 8. Employer Costs
  const employerNssf = nssfDeduction;
  const employerHousingLevy = housingLevy;
  const totalEmployerCost = monthlyGross + employerNssf + employerHousingLevy;

  return {
    heroOutput: {
      id: 'net_salary',
      label: payFrequency === 'annual' ? 'Net Annual Salary' : 'Net Monthly Take-Home Pay',
      value: payFrequency === 'annual' ? netMonthlySalary * 12 : netMonthlySalary,
      formattedValue: formatKES(payFrequency === 'annual' ? netMonthlySalary * 12 : netMonthlySalary),
      isHero: true,
      type: 'positive',
      description: 'Your actual take-home income after all mandatory statutory deductions and tax reliefs.',
    },
    breakdown: [
      {
        id: 'gross_salary',
        label: 'Gross Salary',
        value: monthlyGross,
        formattedValue: formatKES(monthlyGross),
        type: 'neutral',
      },
      {
        id: 'nssf',
        label: 'NSSF Pension Contribution',
        value: nssfDeduction,
        formattedValue: `- ${formatKES(nssfDeduction)}`,
        type: 'negative',
        description: 'Tier I & Tier II compulsory NSSF retirement contribution (max KES 6,480/mo).',
      },
      {
        id: 'shif',
        label: 'SHIF (Social Health Insurance)',
        value: shifDeduction,
        formattedValue: `- ${formatKES(shifDeduction)}`,
        type: 'negative',
        description: 'Statutory 2.75% contribution replacing NHIF.',
      },
      {
        id: 'housing_levy',
        label: 'Affordable Housing Levy',
        value: housingLevy,
        formattedValue: `- ${formatKES(housingLevy)}`,
        type: 'negative',
        description: 'Mandatory 1.5% employee contribution.',
      },
      {
        id: 'taxable_pay',
        label: 'Taxable Salary Base',
        value: taxablePay,
        formattedValue: formatKES(taxablePay),
        type: 'neutral',
      },
      {
        id: 'gross_paye',
        label: 'Gross PAYE Tax',
        value: grossPaye,
        formattedValue: formatKES(grossPaye),
        type: 'neutral',
      },
      {
        id: 'tax_relief',
        label: 'Total Tax Reliefs (Personal + SHIF)',
        value: totalRelief,
        formattedValue: `+ ${formatKES(totalRelief)}`,
        type: 'positive',
        description: 'KES 2,400 Personal Relief + 15% SHIF Relief.',
      },
      {
        id: 'net_paye',
        label: 'Net PAYE Tax Payable',
        value: netPaye,
        formattedValue: `- ${formatKES(netPaye)}`,
        type: 'negative',
        description: 'Final PAYE remitted to Kenya Revenue Authority (KRA).',
      },
      {
        id: 'total_deductions',
        label: 'Total Statutory Deductions',
        value: totalEmployeeDeductions,
        formattedValue: `- ${formatKES(totalEmployeeDeductions)}`,
        type: 'highlight',
      },
    ],
    employerCost: {
      totalCost: totalEmployerCost,
      formattedTotal: formatKES(totalEmployerCost),
      items: [
        { label: 'Gross Salary', value: monthlyGross, formattedValue: formatKES(monthlyGross) },
        { label: 'Employer NSSF Matching', value: employerNssf, formattedValue: formatKES(employerNssf) },
        { label: 'Employer Housing Levy (1.5%)', value: employerHousingLevy, formattedValue: formatKES(employerHousingLevy) },
      ],
    },
    notes: [
      'Updated for Kenya Finance Act 2024/2026 regulations and KRA P9 statutory tables.',
      'SHIF contribution is calculated at 2.75% of gross income with 15% tax relief applied automatically.',
      'NSSF contributions follow the Year 3 statutory schedule effective February 2026 (Tier I limit KES 9,000; Tier II upper limit KES 108,000; total max KES 6,480/mo).',
    ],
  };
};

export const KENYA_CALCULATOR_CONFIG: CalculatorConfig = {
  id: 'kenya-net-salary',
  countryCode: 'ke',
  countryName: 'Kenya',
  flagEmoji: '🇰🇪',
  language: 'en',
  currencyCode: 'KES',
  currencySymbol: 'KSh',
  name: 'Kenya Net Salary Calculator 2026',
  description: 'Calculate your exact net take-home salary in Kenya after KRA PAYE tax, NSSF Phase III (max KES 6,480), SHIF health insurance, and Housing Levy deductions.',
  lastUpdated: '2026-08-10',
  inputs: [
    {
      id: 'grossSalary',
      label: 'Gross Monthly Salary (KES)',
      type: 'currency',
      defaultValue: 100000,
      min: 0,
      step: 1000,
      prefix: 'KSh',
      helpText: 'Enter your total monthly earnings before any deductions.',
    },
    {
      id: 'payFrequency',
      label: 'Pay Frequency',
      type: 'select',
      defaultValue: 'monthly',
      options: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'annual', label: 'Annual' },
      ],
    },
    {
      id: 'pension',
      label: 'Voluntary Pension Contribution (KES)',
      type: 'currency',
      defaultValue: 0,
      min: 0,
      max: 20000,
      step: 500,
      prefix: 'KSh',
      helpText: 'Tax-exempt voluntary pension scheme (up to KES 20,000/month limit).',
    },
    {
      id: 'otherDeductions',
      label: 'Other Voluntary Deductions (KES)',
      type: 'currency',
      defaultValue: 0,
      min: 0,
      step: 500,
      prefix: 'KSh',
      helpText: 'Sacco loans, staff advances, or optional insurance premiums.',
    },
  ],
  calculate: calculateKenyaSalary,
  pages: {
    'net-salary-calculator': {
      slug: 'net-salary-calculator',
      title: 'Kenya Net Salary Calculator 2026 — Official KRA PAYE, SHIF & NSSF Utility',
      h1: 'Kenya Net Salary Calculator 2026',
      metaDescription: 'Free online Kenya Net Salary Calculator updated for 2026 KRA tax bands, SHIF 2.75%, NSSF 2026 schedule (max KES 6,480), and 1.5% Housing Levy.',
      keywords: ['kenya net salary calculator 2026', 'kra paye calculator kenya', 'shif calculator kenya', 'housing levy calculator', 'take home salary kenya'],
      canonicalUrl: 'https://regulo.online/ke/net-salary-calculator',
      explanationMarkdown: `
### How Your Kenya Salary is Taxed in 2026

Under current Kenya Revenue Authority (KRA) guidelines and the Ministry of Health regulations, employment income in Kenya is subject to statutory payroll deductions.

#### 1. NSSF Pension Contributions (2026 Schedule Effective Feb 2026)
Compulsory retirement contributions under the NSSF Act Year 3 implementation schedule are split into two tiers:
* **Tier I**: 6% of earnings up to KES 9,000 (Maximum KES 540 per month).
* **Tier II**: 6% of earnings between KES 9,001 and KES 108,000 (Maximum KES 5,940 per month).
* **Total Max NSSF Contribution**: KES 6,480 per month (employee) + KES 6,480 (employer).

#### 2. Social Health Insurance Fund (SHIF)
Replacing the former NHIF system, SHIF requires a flat **2.75% contribution** of gross income (minimum KES 300/month). Contributors enjoy a **15% SHIF tax relief** on their monthly contribution.

#### 3. Affordable Housing Levy
All formal employees in Kenya contribute **1.5% of gross monthly income** toward the National Housing Development Fund, matched equally by employers.

#### 4. KRA PAYE Tax Bands (2026 Statutory Rate)
PAYE is charged on Taxable Base (Gross Salary minus allowable NSSF and pension deductions):
* **Up to KES 24,000**: 10%
* **KES 24,001 – KES 32,333**: 25%
* **KES 32,334 – KES 500,000**: 30%
* **KES 500,001 – KES 800,000**: 32.5%
* **Above KES 800,000**: 35%

**Personal Tax Relief**: KES 2,400 per month (KES 28,800 annually) is subtracted directly from gross PAYE liability.
      `,
      faqs: [
        {
          question: 'What is the SHIF deduction rate in Kenya for 2026?',
          answer: 'SHIF is calculated at 2.75% of your total gross monthly salary with a minimum contribution of KES 300 per month. Employees receive a 15% SHIF tax relief applied against PAYE tax.',
        },
        {
          question: 'What is the maximum NSSF contribution in Kenya in 2026?',
          answer: 'Under the official 2026 schedule effective February 2026, the maximum total employee NSSF contribution is KES 6,480 per month (KES 540 for Tier I plus KES 5,940 for Tier II). Employers provide an equal matching amount.',
        },
        {
          question: 'How is Personal Relief applied in Kenya PAYE?',
          answer: 'Every resident employee receives a resident personal tax relief of KES 2,400 per month (KES 28,800 per year) which reduces final KRA PAYE tax owed dollar-for-dollar.',
        },
      ],
      relatedPages: [
        { title: 'Kenya Net Salary Calculator 2026', href: '/ke/kenya-net-salary-calculator-2026' },
        { title: 'Salary After Tax Kenya', href: '/ke/salary-after-tax-kenya' },
        { title: 'PAYE Tax Calculator Kenya', href: '/ke/paye-calculator-kenya' },
        { title: 'SHIF Calculator Kenya 2026', href: '/ke/shif-calculator-kenya' },
        { title: 'Housing Levy Calculator Kenya', href: '/ke/housing-levy-calculator-kenya' },
      ],
    },
    'kenya-net-salary-calculator-2026': {
      slug: 'kenya-net-salary-calculator-2026',
      title: 'Kenya Net Salary Calculator 2026 — Latest KRA & NSSF Rules',
      h1: 'Kenya Net Salary Calculator 2026 (Updated Rules)',
      metaDescription: 'Calculate your updated 2026 net salary in Kenya including new KRA income tax brackets, SHIF health rates, and 2026 NSSF schedule (max KES 6,480).',
      keywords: ['kenya net salary 2026', 'kra tax bands 2026', 'salary after tax kenya 2026'],
      canonicalUrl: 'https://regulo.online/ke/kenya-net-salary-calculator-2026',
      explanationMarkdown: `
### Updated 2026 Kenya Net Salary Rules

Calculations on this page reflect all statutory amendments passed in the latest Kenya Finance Acts, NSSF 2026 schedule, and Ministry of Health directives.
      `,
      faqs: [
        {
          question: 'Are voluntary pension contributions tax deductible in Kenya?',
          answer: 'Yes, voluntary contributions to a registered pension scheme are tax-exempt up to KES 20,000 per month (KES 240,000 per year).',
        },
      ],
      relatedPages: [
        { title: 'Main Net Salary Calculator', href: '/ke/net-salary-calculator' },
        { title: 'PAYE Calculator Kenya', href: '/ke/paye-calculator-kenya' },
      ],
    },
    'salary-after-tax-kenya': {
      slug: 'salary-after-tax-kenya',
      title: 'Salary After Tax Kenya — How Much Do You Take Home?',
      h1: 'Salary After Tax Calculator Kenya',
      metaDescription: 'Discover how much of your gross salary remains after KRA PAYE tax, SHIF, NSSF pension (max KES 6,480), and Housing Levy.',
      keywords: ['salary after tax kenya', 'take home pay kenya', 'kra deduction breakdown'],
      canonicalUrl: 'https://regulo.online/ke/salary-after-tax-kenya',
      explanationMarkdown: `
### Take-Home Pay Breakdown in Kenya

Your salary after tax is your final disposable income after all legal statutory deductions have been paid to KRA, NSSF, and the Social Health Authority.
      `,
      faqs: [
        {
          question: 'How do I calculate take home salary in Kenya?',
          answer: 'Take home salary = Gross Salary - NSSF - SHIF - Housing Levy - Net PAYE Tax.',
        },
      ],
      relatedPages: [
        { title: 'Main Net Salary Calculator', href: '/ke/net-salary-calculator' },
        { title: 'SHIF Calculator Kenya', href: '/ke/shif-calculator-kenya' },
      ],
    },
    'paye-calculator-kenya': {
      slug: 'paye-calculator-kenya',
      title: 'PAYE Calculator Kenya 2026 — Official KRA Tax Brackets',
      h1: 'KRA PAYE Tax Calculator 2026',
      metaDescription: 'Calculate KRA Pay As You Earn (PAYE) tax liability for Kenyan employees. Includes tax brackets, personal relief, and SHIF tax relief.',
      keywords: ['paye calculator kenya', 'kra tax calculator', 'paye tax bands kenya'],
      canonicalUrl: 'https://regulo.online/ke/paye-calculator-kenya',
      explanationMarkdown: `
### KRA PAYE Tax Computation Guide

PAYE (Pay As You Earn) is calculated progressively on Taxable Base (Gross Salary minus allowable NSSF and pension deductions).
      `,
      faqs: [
        {
          question: 'What is the top PAYE tax rate in Kenya?',
          answer: 'The maximum statutory PAYE bracket rate in Kenya is 35% on monthly taxable earnings exceeding KES 800,000.',
        },
      ],
      relatedPages: [
        { title: 'Main Net Salary Calculator', href: '/ke/net-salary-calculator' },
        { title: 'Housing Levy Calculator', href: '/ke/housing-levy-calculator-kenya' },
      ],
    },
    'shif-calculator-kenya': {
      slug: 'shif-calculator-kenya',
      title: 'SHIF Calculator Kenya 2026 — Social Health Insurance Fund Rates',
      h1: 'SHIF Contribution Calculator 2026',
      metaDescription: 'Calculate mandatory SHIF (Social Health Insurance Fund) deductions and 15% SHIF tax relief for Kenya employees under 2026 regulations.',
      keywords: ['shif calculator kenya', 'shif rate 2026', 'social health insurance fund kenya'],
      canonicalUrl: 'https://regulo.online/ke/shif-calculator-kenya',
      explanationMarkdown: `
### SHIF Regulations in Kenya

SHIF replaced NHIF under the Social Health Insurance Act. It imposes a 2.75% gross salary contribution for formal employees.
      `,
      faqs: [
        {
          question: 'Is SHIF compulsory for all formal employees in Kenya?',
          answer: 'Yes, SHIF is mandatory for all formal sector workers in Kenya at a 2.75% rate of gross earnings.',
        },
      ],
      relatedPages: [
        { title: 'Main Net Salary Calculator', href: '/ke/net-salary-calculator' },
      ],
    },
    'housing-levy-calculator-kenya': {
      slug: 'housing-levy-calculator-kenya',
      title: 'Housing Levy Calculator Kenya 2026 — 1.5% Contribution Rule',
      h1: 'Affordable Housing Levy Calculator Kenya',
      metaDescription: 'Calculate mandatory 1.5% Affordable Housing Levy deduction for Kenyan workers and employer matching costs under statutory rules.',
      keywords: ['housing levy calculator kenya', 'housing levy 1.5 kenya', 'affordable housing deduction'],
      canonicalUrl: 'https://regulo.online/ke/housing-levy-calculator-kenya',
      explanationMarkdown: `
### Affordable Housing Levy Calculation

The Housing Levy is charged at **1.5% of gross monthly salary** for employees, matched by a 1.5% employer contribution.
      `,
      faqs: [
        {
          question: 'Does the employer also pay the Housing Levy in Kenya?',
          answer: 'Yes, employers match the employee contribution with an equal 1.5% of gross monthly earnings.',
        },
      ],
      relatedPages: [
        { title: 'Main Net Salary Calculator', href: '/ke/net-salary-calculator' },
      ],
    },
  },
};
