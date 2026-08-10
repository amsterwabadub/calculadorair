import { VerifiedRule } from './ke';

export const MOROCCO_VERIFIED_RULES: VerifiedRule[] = [
  {
    rule_name: 'Cotisation CNSS Salariale',
    value_or_rate: '4.48% sur salaire brut plafonné à 6 000 DH/mois (Max 268.80 DH/mois)',
    effective_from: '2020-01-01',
    official_source_url: 'https://www.cnss.ma',
    source_title: 'Caisse Nationale de Sécurité Sociale — Taux de Cotisations',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Cotisation AMO Salariale',
    value_or_rate: '2.26% sur salaire brut total (non plafonné)',
    effective_from: '2020-01-01',
    official_source_url: 'https://www.cnss.ma',
    source_title: 'Assurance Maladie Obligatoire (AMO) — Réglementation CNSS',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Frais Professionnels (Abattement Forfaitaire CGI Art. 59)',
    value_or_rate: '35% pour salaire brut imposable <= 78 000 DH/an (6 500 DH/mois); 25% pour salaire brut imposable > 78 000 DH/an (6 500 DH/mois); Plafond annuel 35 000 DH (2 916.67 DH/mois)',
    effective_from: '2024-01-01',
    official_source_url: 'https://www.tax.gov.ma',
    source_title: 'Code Général des Impôts (CGI) Article 59 / Loi de Finances 2024-2026',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Barème Mensuel de l\'Impôt sur le Revenu (IR) 2026',
    value_or_rate: '0-3.33k: 0%, 3.33k-5k: 10% (déd. 333.33), 5k-6.67k: 20% (déd. 833.33), 6.67k-8.33k: 30% (déd. 1500), 8.33k-15k: 34% (déd. 1833.33), >15k: 37% (déd. 2283.33)',
    effective_from: '2025-01-01',
    official_source_url: 'https://www.tax.gov.ma',
    source_title: 'Direction Générale des Impôts (DGI) — Barème IR 2025/2026 (Loi 55-23)',
    verified_at: '2026-08-10',
  },
  {
    rule_name: 'Réductions pour Charges de Famille (CGI Art. 74)',
    value_or_rate: '50 DH/mois par personne à charge dans la limite de 6 personnes (Max 300 DH/mois)',
    effective_from: '2025-01-01',
    official_source_url: 'https://www.tax.gov.ma',
    source_title: 'Code Général des Impôts Article 74',
    verified_at: '2026-08-10',
  },
];
