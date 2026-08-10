import { VerifiedRule } from './ke';

export const MEXICO_VERIFIED_RULES: VerifiedRule[] = [
  {
    rule_name: 'Derecho Mínimo de Aguinaldo',
    value_or_rate: '15 días de salario diario por año laborado (LFT Art. 87)',
    effective_from: '1970-05-01',
    official_source_url: 'https://www.gob.mx/stps',
    source_title: 'Ley Federal del Trabajo — Artículo 87',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Exención de ISR sobre Aguinaldo (30 UMA 2026)',
    value_or_rate: '30 UMA Diarias ($117.31 MXN/día = $3,519.30 MXN exentos desde el 1 feb 2026; $113.14 MXN/día = $3,394.20 MXN en ene 2026)',
    effective_from: '2026-02-01',
    official_source_url: 'https://www.inegi.org.mx/temas/uma/',
    source_title: 'INEGI Valor Oficial UMA 2026 / LISR Art. 93 Frac. XIV',
    verified_at: '2026-08-10',
    notes: 'Diario $117.31 MXN, Mensual $3,566.22 MXN, Anual $42,794.64 MXN. Vigente a partir del 1 de febrero de 2026.',
  },
  {
    rule_name: 'Tarifa Mensual Retención ISR 2026',
    value_or_rate: 'Tarifa progresiva Art. 96 LISR (1.92% a 35%)',
    effective_from: '2024-01-01',
    official_source_url: 'https://www.sat.gob.mx',
    source_title: 'SAT — Anexo 8 de la Resolución Miscelánea Fiscal (Tablas ISR)',
    verified_at: '2026-08-10',
  },
];
