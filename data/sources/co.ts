import { VerifiedRule } from './ke';

export const COLOMBIA_VERIFIED_RULES: VerifiedRule[] = [
  {
    rule_name: 'Valor UVT 2026 Estimado',
    value_or_rate: '$49,799 COP por UVT',
    effective_from: '2026-01-01',
    official_source_url: 'https://www.dian.gov.co',
    source_title: 'DIAN — Unidad de Valor Tributario (UVT)',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Aportes Obligatorios a Salud y Pensión (Empleado)',
    value_or_rate: 'Salud 4%, Pensión 4% sobre IBC',
    effective_from: '1993-12-23',
    official_source_url: 'https://www.minsalud.gov.co',
    source_title: 'Ley 100 de 1993 — Sistema de Seguridad Social Integral',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Fondo de Solidaridad Pensional (FSP)',
    value_or_rate: '1% a 2% para ingresos >= 4 SMMLV ($5.69M COP)',
    effective_from: '2003-01-01',
    official_source_url: 'https://www.minsalud.gov.co',
    source_title: 'Ley 797 de 2003 — Modificaciones al Sistema General de Pensiones',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Deducciones Imputables Art. 387 E.T.',
    value_or_rate: 'Intereses vivienda (max 100 UVT/mes), Dependientes (10% max 32 UVT/mes), Prepagada (max 16 UVT/mes)',
    effective_from: '2012-12-26',
    official_source_url: 'https://estatuto.co/387',
    source_title: 'Estatuto Tributario — Artículo 387',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Renta Exenta del 25% (Art. 206 Num. 10)',
    value_or_rate: '25% del ingreso laboral mensual depurado, tope 240 UVT/mes ($11,951,760 COP)',
    effective_from: '2022-12-13',
    official_source_url: 'https://estatuto.co/206',
    source_title: 'Estatuto Tributario — Artículo 206 Numeral 10 / Reforma Tributaria Ley 2277',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Tabla de Retención en la Fuente Art. 383 E.T.',
    value_or_rate: '0-95 UVT: 0%, 95-150: 19%, 150-360: 28%, 360-640: 33%, 640-940: 35%, 940-2300: 37%, >2300: 39%',
    effective_from: '2019-12-27',
    official_source_url: 'https://estatuto.co/383',
    source_title: 'Estatuto Tributario — Artículo 383 Tabla de Retención',
    verified_at: '2026-08-09',
  },
];
