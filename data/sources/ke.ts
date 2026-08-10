export interface VerifiedRule {
  rule_name: string;
  value_or_rate: string;
  effective_from: string;
  official_source_url: string;
  source_title: string;
  verified_at: string;
  notes?: string;
}

export const KENYA_VERIFIED_RULES: VerifiedRule[] = [
  {
    rule_name: 'KRA PAYE Monthly Tax Bands 2026',
    value_or_rate: '0-24k: 10%, 24k-32.3k: 25%, 32.3k-500k: 30%, 500k-800k: 32.5%, >800k: 35%',
    effective_from: '2023-07-01',
    official_source_url: 'https://www.kra.go.ke/en/individual/calculate-tax/paye',
    source_title: 'Kenya Revenue Authority — Pay As You Earn (PAYE) Rates',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Personal Tax Relief',
    value_or_rate: 'KES 2,400 per month (KES 28,800 per year)',
    effective_from: '2020-04-25',
    official_source_url: 'https://www.kra.go.ke/en/individual/calculate-tax/paye',
    source_title: 'KRA Resident Personal Tax Relief Schedule',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'NSSF Phase III Pension Contribution (Effective Feb 2026)',
    value_or_rate: 'Tier I 6% (max KES 540 on KES 9,000), Tier II 6% (max KES 5,940 on KES 108,000), Total max KES 6,480/mo',
    effective_from: '2026-02-01',
    official_source_url: 'https://www.nssf.or.ke',
    source_title: 'National Social Security Fund Act No. 45 of 2013 Year 3 Implementation Schedule',
    verified_at: '2026-08-10',
    notes: 'Effective February 2026 schedule: Tier I limit KES 9,000; Tier II upper limit KES 108,000.',
  },
  {
    rule_name: 'Social Health Insurance Fund (SHIF)',
    value_or_rate: '2.75% of gross salary (minimum KES 300/mo)',
    effective_from: '2024-10-01',
    official_source_url: 'https://sha.go.ke',
    source_title: 'Social Health Insurance Authority Regulations 2024',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'SHIF Tax Relief',
    value_or_rate: '15% of SHIF contribution subtracted from PAYE tax liability',
    effective_from: '2024-10-01',
    official_source_url: 'https://www.kra.go.ke',
    source_title: 'KRA Public Notice on Social Health Insurance Fund Tax Relief',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Affordable Housing Levy',
    value_or_rate: '1.5% of gross salary (Employee), 1.5% (Employer)',
    effective_from: '2024-03-19',
    official_source_url: 'https://www.housingandurban.go.ke',
    source_title: 'Affordable Housing Act 2024',
    verified_at: '2026-08-10',
  },
];
