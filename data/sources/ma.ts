import { VerifiedRule } from './ke';

export const MOROCCO_VERIFIED_RULES: VerifiedRule[] = [
  {
    rule_name: 'Cotisation CNSS Salariale',
    value_or_rate: '4.48% sur salaire brut plafonné à 6 000 DH/mois (Max 268.80 DH/mois)',
    effective_from: '2020-01-01',
    official_source_url: 'https://www.cnss.ma',
    source_title: 'Caisse Nationale de Sécurité Sociale — Taux de Cotisations',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Cotisation AMO Salariale',
    value_or_rate: '2.26% sur salaire brut total (non plafonné)',
    effective_from: '2020-01-01',
    official_source_url: 'https://www.cnss.ma',
    source_title: 'Assurance Maladie Obligatoire (AMO) — Réglementation CNSS',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Frais Professionnels (Abattement Forfaitaire)',
    value_or_rate: '35% avec plafond annuel de 35 000 DH (2 916.67 DH/mois)',
    effective_from: '2024-01-01',
    official_source_url: 'https://www.tax.gov.ma',
    source_title: 'Code Général des Impôts (CGI) Article 59',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Barème Mensuel de l\'Impôt sur le Revenu (IR) 2026',
    value_or_rate: '0-3.3k: 0%, 3.3k-5k: 10%, 5k-6.6k: 20%, 6.6k-8.3k: 30%, 8.3k-15k: 34%, >15k: 37%',
    effective_from: '2025-01-01',
    official_source_url: 'https://www.tax.gov.ma',
    source_title: 'Direction Générale des Impôts (DGI) — Barème IR 2025/2026',
    verified_at: '2026-08-09',
  },
  {
    rule_name: 'Réductions pour Charges de Famille',
    value_or_rate: '50 DH/mois par personne à charge dans la limite de 6 personnes (Max 300 DH/mois)',
    effective_from: '2025-01-01',
    official_source_url: 'https://www.tax.gov.ma',
    source_title: 'Code Général des Impôts Article 74',
    verified_at: '2026-08-09',
  },
];
