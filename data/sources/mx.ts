import { VerifiedRule } from './ke';

export const MEXICO_VERIFIED_RULES: VerifiedRule[] = [
  {
    rule_name: 'Derecho Mínimo de Aguinaldo',
    value_or_rate: '15 días de salario diario por año laborado (LFT Art. 87)',
    effective_from: '1970-05-01',
    official_source_url: 'https://www.gob.mx/stps',
    source_title: 'Ley Federal del Trabajo — Artículo 87',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Exención de ISR sobre Aguinaldo (30 UMA)',
    value_or_rate: '30 UMA Diarias ($113.14 MXN/día = $3,394.20 MXN exentos)',
    effective_from: '2026-02-01',
    official_source_url: 'https://www.inegi.org.mx/temas/uma/',
    source_title: 'INEGI Valor Diario UMA 2026 / LISR Art. 93 Frac. XIV',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Tarifa Mensual Retención ISR 2026',
    value_or_rate: 'Tarifa progresiva Art. 96 LISR (1.92% a 35%)',
    effective_from: '2024-01-01',
    official_source_url: 'https://www.sat.gob.mx',
    source_title: 'SAT — Anexo 8 de la Resolución Miscelánea Fiscal (Tablas ISR)',
    verified_at: '2026-08-09',
  },
];
