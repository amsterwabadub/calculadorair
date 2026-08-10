import { CalculatorConfig, CalculationResult } from '@/types/calculator';

const formatCOP = (val: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);
};

export const calculateColombiaRetefuente = (inputs: Record<string, any>): CalculationResult => {
  const grossSalary = Math.max(0, Number(inputs.grossSalary) || 0);
  const uvt2026 = 52374; // COP official 2026 (DIAN Res. 000238 del 15 dic 2025)

  const housingInterest = Math.min(uvt2026 * 100, Math.max(0, Number(inputs.housingInterest) || 0));
  const hasDependents = Boolean(inputs.hasDependents);
  const prepaidHealth = Math.min(uvt2026 * 16, Math.max(0, Number(inputs.prepaidHealth) || 0));

  // 1. Mandatory Aportes (4% Health + 4% Pension)
  const healthDeduction = grossSalary * 0.04;
  const pensionDeduction = grossSalary * 0.04;

  // 2. Fondo de Solidaridad Pensional (FSP)
  // SMMLV 2026 approx $1,423,500 COP -> 4 SMMLV = $5,694,000 COP
  const smmlv = 1423500;
  let fspRate = 0;
  if (grossSalary >= 20 * smmlv) fspRate = 0.02;
  else if (grossSalary >= 19 * smmlv) fspRate = 0.018;
  else if (grossSalary >= 18 * smmlv) fspRate = 0.016;
  else if (grossSalary >= 17 * smmlv) fspRate = 0.014;
  else if (grossSalary >= 16 * smmlv) fspRate = 0.012;
  else if (grossSalary >= 4 * smmlv) fspRate = 0.01;

  const fspDeduction = grossSalary * fspRate;

  // 3. Allowed Deductions (Art. 387 E.T.)
  const dependentsDeduction = hasDependents ? Math.min(grossSalary * 0.1, 32 * uvt2026) : 0;
  const totalAllowedDeductions = housingInterest + dependentsDeduction + prepaidHealth;

  // 4. Base for 25% Exempt Income (Renta Exenta Art. 206 Num. 10 - Ley 2277 de 2022: 790 UVT/year = 65.833 UVT/month)
  const preExemptBase = Math.max(
    0,
    grossSalary - healthDeduction - pensionDeduction - fspDeduction - totalAllowedDeductions
  );
  const maxExemptMonthlyUvt = (790 / 12) * uvt2026; // 3,447,961 COP max per month
  const exempt25Percent = Math.min(preExemptBase * 0.25, maxExemptMonthlyUvt);

  // 5. Combined Exemption Limit Check (Art. 336 E.T.: 40% of net base or 1,340 UVT/yr = 111.667 UVT/mo)
  const combinedExemptionCapMonthly = (1340 / 12) * uvt2026; // 5,848,430 COP/mo
  const totalExemptionsAndDeductions = Math.min(
    totalAllowedDeductions + exempt25Percent,
    Math.min(preExemptBase * 0.40, combinedExemptionCapMonthly) + totalAllowedDeductions
  );

  // 6. Taxable Base (Base Gravable)
  const taxableBaseCOP = Math.max(0, grossSalary - healthDeduction - pensionDeduction - fspDeduction - totalExemptionsAndDeductions);
  const taxableBaseUVT = taxableBaseCOP / uvt2026;

  // 7. Retención en la Fuente Brackets (Tabla Art. 383 E.T.)
  let retefuenteUVT = 0;
  if (taxableBaseUVT > 2300) {
    retefuenteUVT = (taxableBaseUVT - 2300) * 0.39 + 769.85;
  } else if (taxableBaseUVT > 940) {
    retefuenteUVT = (taxableBaseUVT - 940) * 0.37 + 266.65;
  } else if (taxableBaseUVT > 640) {
    retefuenteUVT = (taxableBaseUVT - 640) * 0.35 + 161.65;
  } else if (taxableBaseUVT > 360) {
    retefuenteUVT = (taxableBaseUVT - 360) * 0.33 + 69.25;
  } else if (taxableBaseUVT > 150) {
    retefuenteUVT = (taxableBaseUVT - 150) * 0.28 + 10.45;
  } else if (taxableBaseUVT > 95) {
    retefuenteUVT = (taxableBaseUVT - 95) * 0.19;
  } else {
    retefuenteUVT = 0;
  }

  const retefuenteCOP = Math.max(0, retefuenteUVT * uvt2026);
  const effectiveRate = grossSalary > 0 ? (retefuenteCOP / grossSalary) * 100 : 0;

  const totalDeductions = healthDeduction + pensionDeduction + fspDeduction + retefuenteCOP;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    heroOutput: {
      id: 'retefuente_cop',
      label: 'Retención en la Fuente Mensual (2026)',
      value: retefuenteCOP,
      formattedValue: formatCOP(retefuenteCOP),
      isHero: true,
      type: 'positive',
      description: `Equivalente a ${retefuenteUVT.toFixed(2)} UVT (Tasa efectiva sobre bruto: ${effectiveRate.toFixed(2)}%).`,
    },
    breakdown: [
      {
        id: 'gross_salary',
        label: 'Salario Mensual Bruto',
        value: grossSalary,
        formattedValue: formatCOP(grossSalary),
        type: 'neutral',
      },
      {
        id: 'health_pension',
        label: 'Aportes Salud + Pensión (8% ley)',
        value: healthDeduction + pensionDeduction,
        formattedValue: `- ${formatCOP(healthDeduction + pensionDeduction)}`,
        type: 'negative',
        description: '4% Salud obligatoria + 4% Pensión obligatoria.',
      },
      {
        id: 'fsp',
        label: 'Fondo de Solidaridad Pensional (FSP)',
        value: fspDeduction,
        formattedValue: fspDeduction > 0 ? `- ${formatCOP(fspDeduction)}` : '$0',
        type: 'negative',
        description: `Aporte del ${(fspRate * 100).toFixed(1)}% por superar 4 SMMLV.`,
      },
      {
        id: 'deductions_387',
        label: 'Deducciones Autorizadas (Art. 387 E.T.)',
        value: totalAllowedDeductions,
        formattedValue: formatCOP(totalAllowedDeductions),
        type: 'neutral',
        description: 'Intereses de vivienda, dependientes y medicina prepagada.',
      },
      {
        id: 'exempt_25',
        label: 'Renta Exenta del 25% (Art. 206 Num. 10)',
        value: exempt25Percent,
        formattedValue: `+ ${formatCOP(exempt25Percent)}`,
        type: 'positive',
        description: 'Beneficio exento mensual tope 65.83 UVT ($3,447,961 COP).',
      },
      {
        id: 'taxable_base_cop',
        label: 'Base Gravable en Pesos',
        value: taxableBaseCOP,
        formattedValue: formatCOP(taxableBaseCOP),
        type: 'neutral',
      },
      {
        id: 'taxable_base_uvt',
        label: 'Base Gravable en UVT (Valor UVT $52,374)',
        value: taxableBaseUVT,
        formattedValue: `${taxableBaseUVT.toFixed(2)} UVT`,
        type: 'neutral',
      },
      {
        id: 'retefuente_total',
        label: 'Retención en la Fuente a Descontar',
        value: retefuenteCOP,
        formattedValue: `- ${formatCOP(retefuenteCOP)}`,
        type: 'highlight',
      },
      {
        id: 'net_takehome',
        label: 'Salario Neto Aproximado en Banco',
        value: netSalary,
        formattedValue: formatCOP(netSalary),
        type: 'positive',
        description: 'Salario bruto menos Salud, Pensión, FSP y Retención en la Fuente.',
      },
    ],
    notes: [
      'Cálculo elaborado bajo la tabla oficial del Artículo 383 del Estatuto Tributario para el año gravable 2026.',
      'Valor oficial de la UVT 2026 fijado en $52,374 COP según la Resolución 000238 de la DIAN del 15 de diciembre de 2025.',
      'Aplica el procedimiento 1 de retención en la fuente laboral mensual.',
    ],
  };
};

export const COLOMBIA_CALCULATOR_CONFIG: CalculatorConfig = {
  id: 'colombia-retefuente',
  countryCode: 'co',
  countryName: 'Colombia',
  flagEmoji: '🇨🇴',
  language: 'es',
  currencyCode: 'COP',
  currencySymbol: '$',
  name: 'Calculadora Retención en la Fuente Colombia 2026',
  description: 'Calcula gratis tu retención en la fuente por ingresos laborales en Colombia conforme a la tabla del Art. 383 del E.T. y UVT oficial 2026 ($52,374 COP).',
  lastUpdated: '2026-08-10',
  inputs: [
    {
      id: 'grossSalary',
      label: 'Salario Mensual Bruto ($ COP)',
      type: 'currency',
      defaultValue: 15000000,
      min: 0,
      step: 500000,
      prefix: '$',
      helpText: 'Sueldo bruto mensual antes de descuentos legales.',
    },
    {
      id: 'hasDependents',
      label: '¿Tienes Dependientes a Cargo?',
      type: 'boolean',
      defaultValue: false,
      helpText: 'Deducción del 10% del ingreso bruto (máximo 32 UVT/mes = $1,675,968 COP) según Art. 387 E.T.',
    },
    {
      id: 'housingInterest',
      label: 'Intereses de Crédito Hipotecario ($ COP)',
      type: 'currency',
      defaultValue: 0,
      min: 0,
      step: 100000,
      prefix: '$',
      helpText: 'Deducción mensual por intereses pagados en vivienda (tope 100 UVT/mes = $5,237,400 COP).',
    },
    {
      id: 'prepaidHealth',
      label: 'Medicina Prepagada o PlaniSalud ($ COP)',
      type: 'currency',
      defaultValue: 0,
      min: 0,
      step: 50000,
      prefix: '$',
      helpText: 'Pagos por salud complementaria (tope 16 UVT/mes = $837,984 COP).',
    },
  ],
  calculate: calculateColombiaRetefuente,
  pages: {
    'retefuente-calculadora': {
      slug: 'retefuente-calculadora',
      title: 'Calculadora Retención en la Fuente 2026 Colombia — Art. 383 E.T. & UVT $52,374',
      h1: 'Calculadora Retención en la Fuente 2026 Colombia',
      metaDescription: 'Calcula tu retención en la fuente laboral en Colombia para 2026 con la UVT oficial de $52,374 COP. Aplica deducciones de ley, renta exenta del 25% y tabla del Art. 383 E.T.',
      keywords: ['retefuente calculadora 2026', 'retencion en la fuente colombia', 'tabla art 383 estatuto tributario', 'uvt 2026 colombia 52374'],
      canonicalUrl: 'https://regulo.online/co/retefuente-calculadora',
      explanationMarkdown: `
### ¿Cómo se calcula la Retención en la Fuente por Ingresos Laborales en Colombia (2026)?

La depuración de la base de retención en la fuente para empleados en Colombia sigue estrictamente el procedimiento del **Artículo 388 y la tabla del Artículo 383 del Estatuto Tributario (E.T.)** ajustados a la UVT oficial 2026 (**$52,374 COP**, DIAN Res. 000238 del 15/12/2025).

#### 1. Ingresos No Constitutivos de Renta (Aportes Obligatorios)
Se restan del salario bruto los aportes obligatorios a seguridad social:
* **Salud Obligatoria**: 4%
* **Pensión Obligatoria**: 4%
* **Fondo de Solidaridad Pensional (FSP)**: 1% a 2% según el rango de ingresos (a partir de 4 SMMLV).

#### 2. Deducciones Imputables (Art. 387 E.T.)
* **Dependientes económicos**: 10% del ingreso bruto (máximo 32 UVT mensuales = **$1,675,968 COP**).
* **Intereses de vivienda / Leasing habitacional**: Pagos mensuales (máximo 100 UVT mensuales = **$5,237,400 COP**).
* **Medicina prepagada / Pólizas de salud**: Pagos mensuales (máximo 16 UVT mensuales = **$837,984 COP**).

#### 3. Renta Exenta del 25% (Art. 206 Numeral 10)
Se descuenta un **25% de Renta Exenta** sobre la base neta, con un **límite máximo de 790 UVT anuales (65.833 UVT/mes = $3,447,961 COP/mes)**.

#### 4. Tabla de Retención en la Fuente 2026 (Art. 383 E.T.)
Con la base gravable expresada en UVT (Base en COP / Valor UVT 2026 de **$52,374 COP**), se aplica la tarifa correspondiente:

* **De 0 a 95 UVT ($4,975,530 COP)**: 0%
* **> 95 a 150 UVT ($7,856,100 COP)**: (Base - 95 UVT) × 19%
* **> 150 a 360 UVT ($18,854,640 COP)**: (Base - 150 UVT) × 28% + 10.45 UVT
* **> 360 a 640 UVT ($33,519,360 COP)**: (Base - 360 UVT) × 33% + 69.25 UVT
* **> 640 a 940 UVT ($49,231,560 COP)**: (Base - 640 UVT) × 35% + 161.65 UVT
* **> 940 a 2,300 UVT ($120,460,200 COP)**: (Base - 940 UVT) × 37% + 266.65 UVT
* **> 2,300 UVT en adelante**: (Base - 2,300 UVT) × 39% + 769.85 UVT
      `,
      faqs: [
        {
          question: '¿A partir de qué salario se paga retención en la fuente en Colombia en 2026?',
          answer: 'Con la UVT oficial 2026 en $52,374 COP, la retención en la fuente laboral inicia cuando la base gravable depurada supera 95 UVT (aprox. $4,975,530 COP de base imponible).',
        },
        {
          question: '¿Cuál es el valor oficial de la UVT para 2026?',
          answer: 'El valor oficial de la UVT para el año gravable 2026 en Colombia es de $52,374 COP, fijado por la DIAN mediante la Resolución 000238 del 15 de diciembre de 2025.',
        },
        {
          question: '¿Cómo benefician los dependientes en el cálculo de la retención?',
          answer: 'Permiten restar un 10% adicional del salario bruto mensual como deducción directa de la base gravable, hasta un tope de 32 UVT ($1,675,968 COP/mes).',
        },
      ],
      relatedPages: [
        { title: 'Calculadora Retefuente 2026', href: '/co/retefuente-calculadora-2026' },
        { title: 'Calculadora UVT Colombia', href: '/co/uvt-calculator' },
        { title: 'Salario Neto Colombia 2026', href: '/co/salario-neto-colombia' },
      ],
    },
    'retefuente-calculadora-2026': {
      slug: 'retefuente-calculadora-2026',
      title: 'Calculadora Retefuente 2026 — Descuento Nómina DIAN (UVT $52,374)',
      h1: 'Calculadora Retefuente Nómina 2026',
      metaDescription: 'Simula el descuento de retención en la fuente que aplicará tu empleador en la nómina de 2026 ajustado a la UVT de $52,374 COP.',
      keywords: ['retefuente calculadora 2026', 'retencion nomina colombia', 'descuento dian nomina'],
      canonicalUrl: 'https://regulo.online/co/retefuente-calculadora-2026',
      explanationMarkdown: `
### Procedimiento 1 de Retención en la Fuente 2026

Calcula mes a mes la retención aplicando la UVT oficial 2026 ($52,374 COP) y las depuraciones tributarias del Artículo 388 del E.T.
      `,
      faqs: [
        {
          question: '¿Qué es el procedimiento 1 de retención en la fuente?',
          answer: 'Es la metodología de cálculo mensual fija donde se depuran los ingresos del mes respectivo conforme al Art. 385 y 388 del E.T.',
        },
      ],
      relatedPages: [
        { title: 'Calculadora Principal', href: '/co/retefuente-calculadora' },
      ],
    },
    'uvt-calculator': {
      slug: 'uvt-calculator',
      title: 'UVT Calculator Colombia 2026 — Convertidor Pesos a UVT ($52,374)',
      h1: 'Calculadora de UVT Colombia 2026',
      metaDescription: 'Convierte montos en pesos colombianos (COP) a UVT 2026 ($52,374 COP) e identifica topes y sanciones DIAN.',
      keywords: ['uvt calculator colombia', 'valor uvt 2026 52374', 'convertir pesos a uvt'],
      canonicalUrl: 'https://regulo.online/co/uvt-calculator',
      explanationMarkdown: `
### Convertidor de Unidades de Valor Tributario (UVT) 2026

Fijado en **$52,374 COP** por la DIAN (Resolución 000238 del 15 de diciembre de 2025).
      `,
      faqs: [
        {
          question: '¿Qué es la UVT en Colombia?',
          answer: 'La UVT (Unidad de Valor Tributario) es la medida estandarizada por la DIAN para reajustar valores de impuestos, sanciones y topes gravables. En 2026 equivale a $52,374 COP.',
        },
      ],
      relatedPages: [
        { title: 'Calculadora Principal', href: '/co/retefuente-calculadora' },
      ],
    },
    'salario-neto-colombia': {
      slug: 'salario-neto-colombia',
      title: 'Salario Neto Colombia 2026 — Cuánto Recibes en Banco',
      h1: 'Calculadora de Salario Neto Colombia 2026',
      metaDescription: 'Descubre tu salario neto en Colombia tras restar deducciones de salud, pensión, FSP y retención en la fuente con UVT de $52,374 COP.',
      keywords: ['salario neto colombia', 'sueldo liquido colombia', 'cuanto me descuentan del salario'],
      canonicalUrl: 'https://regulo.online/co/salario-neto-colombia',
      explanationMarkdown: `
### Salario Bruto vs Salario Líquido en Colombia

Conoce exactamente qué porcentaje de tu sueldo bruto se destina a seguridad social y retenciones fiscales.
      `,
      faqs: [
        {
          question: '¿Cuánto me descuentan por salud y pensión en Colombia?',
          answer: 'Como trabajador dependiente se te descuenta el 4% para salud y el 4% para pensión sobre tu ingreso base de cotización (IBC).',
        },
      ],
      relatedPages: [
        { title: 'Calculadora Principal', href: '/co/retefuente-calculadora' },
      ],
    },
  },
};
