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
  const housingInterest = Math.min(49799 * 100, Math.max(0, Number(inputs.housingInterest) || 0));
  const hasDependents = Boolean(inputs.hasDependents);
  const prepaidHealth = Math.min(49799 * 16, Math.max(0, Number(inputs.prepaidHealth) || 0));

  const uvt2026 = 49799; // COP estimated 2026

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

  // 4. Base for 25% Exempt Income (Renta Exenta Art. 206 Num. 10)
  const preExemptBase = Math.max(
    0,
    grossSalary - healthDeduction - pensionDeduction - fspDeduction - totalAllowedDeductions
  );
  const maxExemptMonthlyUvt = 240 * uvt2026; // 11,951,760 COP max per month
  const exempt25Percent = Math.min(preExemptBase * 0.25, maxExemptMonthlyUvt);

  // 5. Taxable Base (Base Gravable)
  const taxableBaseCOP = Math.max(0, preExemptBase - exempt25Percent);
  const taxableBaseUVT = taxableBaseCOP / uvt2026;

  // 6. Retención en la Fuente Brackets (Tabla Art. 383 E.T.)
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
        description: 'Beneficio exento mensual tope 240 UVT.',
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
        label: 'Base Gravable en UVT (Valor UVT $49,799)',
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
      'Valor de la UVT 2026 estimado en $49,799 COP conforme al IPC e instrucciones de la DIAN.',
      'Recuerda aplicar el procedimiento 1 de retención en la fuente mensual.',
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
  description: 'Calcula gratis tu retención en la fuente por ingresos laborales en Colombia conforme a la tabla del Art. 383 del E.T. y UVT 2026.',
  lastUpdated: '2026-08-01',
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
      helpText: 'Deducción del 10% del ingreso bruto (máximo 32 UVT/mes) según Art. 387 E.T.',
    },
    {
      id: 'housingInterest',
      label: 'Intereses de Crédito Hipotecario ($ COP)',
      type: 'currency',
      defaultValue: 0,
      min: 0,
      step: 100000,
      prefix: '$',
      helpText: 'Deducción mensual por intereses pagados en vivienda (tope 100 UVT/mes).',
    },
    {
      id: 'prepaidHealth',
      label: 'Medicina Prepagada o PlaniSalud ($ COP)',
      type: 'currency',
      defaultValue: 0,
      min: 0,
      step: 50000,
      prefix: '$',
      helpText: 'Pagos por salud complementaria (tope 16 UVT/mes).',
    },
  ],
  calculate: calculateColombiaRetefuente,
  pages: {
    'retefuente-calculadora': {
      slug: 'retefuente-calculadora',
      title: 'Calculadora Retención en la Fuente 2026 Colombia — Art. 383 E.T. & UVT',
      h1: 'Calculadora Retención en la Fuente 2026 Colombia',
      metaDescription: 'Calcula tu retención en la fuente laboral en Colombia para 2026. Aplica deducciones de ley, renta exenta del 25% y tabla oficial del Art. 383 E.T.',
      keywords: ['retefuente calculadora 2026', 'retencion en la fuente colombia', 'tabla art 383 estatuto tributario', 'uvt 2026 colombia'],
      canonicalUrl: 'https://regulo.online/co/retefuente-calculadora',
      explanationMarkdown: `
### ¿Cómo se calcula la Retención en la Fuente por Ingresos Laborales en Colombia (2026)?

La depuración de la base de retención en la fuente para empleados en Colombia sigue estrictamente el procedimiento del **Artículo 388 y la tabla del Artículo 383 del Estatuto Tributario (E.T.)**.

#### 1. Ingresos No Constitutivos de Renta (Aportes Obligatorios)
Se restan del salario bruto los aportes obligatorios a seguridad social:
* **Salud Obligatoria**: 4%
* **Pensión Obligatoria**: 4%
* **Fondo de Solidaridad Pensional (FSP)**: 1% a 2% según el rango de ingresos.

#### 2. Deducciones Imputables (Art. 387 E.T.)
* **Dependientes económicos**: 10% del ingreso bruto (máximo 32 UVT mensuales).
* **Intereses de vivienda / Leasing habitacional**: Pagos mensuales (máximo 100 UVT mensuales).
* **Medicina prepagada / Polizas de salud**: Pagos mensuales (máximo 16 UVT mensuales).

#### 3. Renta Exenta del 25% (Art. 206 Numeral 10)
Se descuenta un **25% de Renta Exenta** sobre la base neta (después de restar aportes obligatorios y deducciones del Art. 387), con un **límite máximo de 240 UVT mensuales**.

#### 4. Tabla de Retención en la Fuente 2026 (Art. 383 E.T.)
Con la base obtenida expresada en UVT (Base en COP / Valor UVT 2026 de **$49,799 COP**), se aplica la tarifa correspondiente:

* **De 0 a 95 UVT**: 0%
* **> 95 a 150 UVT**: (Base - 95 UVT) × 19%
* **> 150 a 360 UVT**: (Base - 150 UVT) × 28% + 10.45 UVT
* **> 360 a 640 UVT**: (Base - 360 UVT) × 33% + 69.25 UVT
* **> 640 a 940 UVT**: (Base - 640 UVT) × 35% + 161.65 UVT
* **> 940 a 2,300 UVT**: (Base - 940 UVT) × 37% + 266.65 UVT
* **> 2,300 UVT en adelante**: (Base - 2,300 UVT) × 39% + 769.85 UVT
      `,
      faqs: [
        {
          question: '¿A partir de qué salario se paga retención en la fuente en Colombia en 2026?',
          answer: 'Con la UVT 2026 en $49,799 COP, la retención en la fuente laboral inicia cuando la base gravable depurada supera 95 UVT (aprox. $4.73 millones COP de base imposable).',
        },
        {
          question: '¿Cuál es el valor estimado de la UVT para 2026?',
          answer: 'La UVT estimada para el año gravable 2026 en Colombia se ubica en $49,799 COP de acuerdo con el IPC publicado por el DANE.',
        },
        {
          question: '¿Cómo benefician los dependientes en el cálculo de la retención?',
          answer: 'Permiten restar un 10% adicional del salario bruto mensual como deducción directa de la base gravable, hasta un tope de 32 UVT ($1,593,568 COP/mes).',
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
      title: 'Calculadora Retefuente 2026 — Descuento Nómina DIAN',
      h1: 'Calculadora Retefuente Nómina 2026',
      metaDescription: 'Simula el descuento de retención en la fuente que aplicará tu empleador en la nómina de 2026.',
      keywords: ['retefuente calculadora 2026', 'retencion nomina colombia', 'descuento dian nomina'],
      canonicalUrl: 'https://regulo.online/co/retefuente-calculadora-2026',
      explanationMarkdown: `
### Procedimiento 1 de Retención en la Fuente 2026

Calcula mes a mes la retención aplicando las depuraciones tributarias vigentes.
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
      title: 'UVT Calculator Colombia 2026 — Convertidor Pesos a UVT',
      h1: 'Calculadora de UVT Colombia 2026',
      metaDescription: 'Convierte montos en pesos colombianos (COP) a UVT 2026 e identifica topes y sanciones DIAN.',
      keywords: ['uvt calculator colombia', 'valor uvt 2026', 'convertir pesos a uvt'],
      canonicalUrl: 'https://regulo.online/co/uvt-calculator',
      explanationMarkdown: `
### Convertidor de Unidades de Valor Tributario (UVT)

Aprende a interpretar los topes tributarios fijados por la DIAN en UVT para el año 2026.
      `,
      faqs: [
        {
          question: '¿Qué es la UVT en Colombia?',
          answer: 'La UVT (Unidad de Valor Tributario) es la medida estandarizada por la DIAN para reajustar valores de impuestos, sanciones y topes gravables.',
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
      metaDescription: 'Descubre tu salario neto en Colombia tras restar deducciones de salud, pensión, FSP y retención en la fuente.',
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
