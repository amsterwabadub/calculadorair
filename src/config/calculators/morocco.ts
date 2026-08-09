import { CalculatorConfig, CalculationResult } from '@/types/calculator';

const formatMAD = (val: number) => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2,
  }).format(val);
};

export const calculateMoroccoSalary = (inputs: Record<string, any>): CalculationResult => {
  const grossSalary = Math.max(0, Number(inputs.grossSalary) || 0);
  const dependents = Math.min(6, Math.max(0, Number(inputs.dependents) || 0));

  // 1. CNSS (4.48% capped at 6,000 MAD gross)
  const cnssBase = Math.min(grossSalary, 6000);
  const cnssDeduction = cnssBase * 0.0448; // Max 268.80 MAD

  // 2. AMO (2.26% uncapped)
  const amoDeduction = grossSalary * 0.0226;

  // 3. Frais Professionnels (35% capped at 2,916.67 MAD/month)
  const fraisProMaxMonthly = 35000 / 12; // 2,916.67 MAD
  const fraisPro = Math.min(grossSalary * 0.35, fraisProMaxMonthly);

  // 4. Salaire Net Imposable (SNI)
  const netImposable = Math.max(0, grossSalary - cnssDeduction - amoDeduction - fraisPro);

  // 5. Impôt sur le Revenu (IR) Barème 2026 Mensuel
  let irRate = 0;
  let sommeADeduire = 0;

  if (netImposable > 15000) {
    irRate = 0.37;
    sommeADeduire = 2283.33;
  } else if (netImposable > 8333.33) {
    irRate = 0.34;
    sommeADeduire = 1833.33;
  } else if (netImposable > 6666.67) {
    irRate = 0.30;
    sommeADeduire = 1500.00;
  } else if (netImposable > 5000) {
    irRate = 0.20;
    sommeADeduire = 833.33;
  } else if (netImposable > 3333.33) {
    irRate = 0.10;
    sommeADeduire = 333.33;
  } else {
    irRate = 0;
    sommeADeduire = 0;
  }

  const grossIr = Math.max(0, netImposable * irRate - sommeADeduire);

  // 6. Charges de famille (50 MAD per dependent up to 6 = max 300 MAD)
  const familyRelief = dependents * 50;
  const netIr = Math.max(0, grossIr - familyRelief);

  // 7. Salaire Net en Poche
  const totalDeductions = cnssDeduction + amoDeduction + netIr;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    heroOutput: {
      id: 'net_salary',
      label: 'Salaire Net Mensuel en Poche (2026)',
      value: netSalary,
      formattedValue: formatMAD(netSalary),
      isHero: true,
      type: 'positive',
      description: 'Votre salaire net réel perçu sur votre compte bancaire après CNSS, AMO et l\'IR 2026.',
    },
    breakdown: [
      {
        id: 'gross_salary',
        label: 'Salaire Brut Mensuel',
        value: grossSalary,
        formattedValue: formatMAD(grossSalary),
        type: 'neutral',
      },
      {
        id: 'cnss',
        label: 'Cotisation CNSS (4,48% plafonné)',
        value: cnssDeduction,
        formattedValue: `- ${formatMAD(cnssDeduction)}`,
        type: 'negative',
        description: 'Sécurité Sociale calculée sur le salaire plafonné à 6 000 DH (max 268,80 DH).',
      },
      {
        id: 'amo',
        label: 'Cotisation AMO (2,26%)',
        value: amoDeduction,
        formattedValue: `- ${formatMAD(amoDeduction)}`,
        type: 'negative',
        description: 'Assurance Maladie Obligatoire non plafonnée.',
      },
      {
        id: 'frais_pro',
        label: 'Abattement pour Frais Professionnels',
        value: fraisPro,
        formattedValue: formatMAD(fraisPro),
        type: 'neutral',
        description: 'Déduction forfaitaire de 35% (plafond de 2 916,67 DH/mois).',
      },
      {
        id: 'net_imposable',
        label: 'Salaire Net Imposable (SNI)',
        value: netImposable,
        formattedValue: formatMAD(netImposable),
        type: 'neutral',
      },
      {
        id: 'gross_ir',
        label: 'Impôt sur le Revenu Brut (IR)',
        value: grossIr,
        formattedValue: formatMAD(grossIr),
        type: 'neutral',
      },
      {
        id: 'family_relief',
        label: 'Réduction pour Charges de Famille',
        value: familyRelief,
        formattedValue: `+ ${formatMAD(familyRelief)}`,
        type: 'positive',
        description: `50 DH par personne à charge (pour ${dependents} personne(s)).`,
      },
      {
        id: 'net_ir',
        label: 'Impôt IR Net Prelevé',
        value: netIr,
        formattedValue: `- ${formatMAD(netIr)}`,
        type: 'negative',
        description: 'Montant de l\'IR retenu à la source par l\'employeur.',
      },
      {
        id: 'total_deductions',
        label: 'Total des Retenues sur Salaire',
        value: totalDeductions,
        formattedValue: `- ${formatMAD(totalDeductions)}`,
        type: 'highlight',
      },
    ],
    notes: [
      'Calcul conforme à la Loi de Finances et au Code Général des Impôts (CGI) du Maroc pour 2026.',
      'Le plafond mensuel CNSS retenu est fixé à 6 000 DH (cotisation salariale maximale de 268,80 DH).',
      'Le barème progressif de l\'IR intègre la déduction pour frais professionnels révisée.',
    ],
  };
};

export const MOROCCO_CALCULATOR_CONFIG: CalculatorConfig = {
  id: 'morocco-net-salary',
  countryCode: 'ma',
  countryName: 'Morocco',
  flagEmoji: '🇲🇦',
  language: 'fr',
  currencyCode: 'MAD',
  currencySymbol: 'DH',
  name: 'Calculateur Salaire Net Maroc 2026',
  description: 'Calculez gratuitement votre salaire net mensuel au Maroc après cotisations CNSS, AMO et retenue d\'Impôt sur le Revenu (IR) 2026.',
  lastUpdated: '2026-08-01',
  inputs: [
    {
      id: 'grossSalary',
      label: 'Salaire Brut Mensuel (DH)',
      type: 'currency',
      defaultValue: 12000,
      min: 0,
      step: 500,
      prefix: 'DH',
      helpText: 'Votre rémunération brute mensuelle avant toute retenue légale.',
    },
    {
      id: 'dependents',
      label: 'Nombre de Personnes à Charge',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 6,
      step: 1,
      helpText: 'Époux(se) sans revenu et enfants à charge (max 6 personnes = 300 DH de réduction).',
    },
  ],
  calculate: calculateMoroccoSalary,
  pages: {
    'salaire-net-calculateur': {
      slug: 'salaire-net-calculateur',
      title: 'Calculateur Salaire Net Maroc 2026 — CNSS, AMO & Impôt IR',
      h1: 'Calculateur Salaire Net Maroc 2026',
      metaDescription: 'Simulateur officiel du salaire net au Maroc mis à jour pour 2026. Calculez votre salaire net imposable, cotisations CNSS, AMO et retenue IR.',
      keywords: ['calculateur salaire net maroc 2026', 'calcul salaire net brut maroc', 'cnss amo ir maroc 2026', 'bareme ir maroc'],
      canonicalUrl: 'https://regulo.online/ma/salaire-net-calculateur',
      explanationMarkdown: `
### Comment est calculé le Salaire Net au Maroc en 2026 ?

Le calcul du salaire net au Maroc s'effectue en déduisant du salaire brut mensuel les cotisations sociales obligatoires (**CNSS** et **AMO**) ainsi que l'Impôt sur le Revenu (**IR**).

#### 1. Cotisations Sociales Obligatoires
* **CNSS (Sécurité Sociale)** : 4,48% de la tranche de salaire plafonnée à **6 000 DH par mois** (soit un montant maximal retenu de **268,80 DH/mois**).
* **AMO (Assurance Maladie Obligatoire)** : 2,26% appliqué sur la totalité du salaire brut sans aucun plafond.

#### 2. Déduction pour Frais Professionnels
Pour déterminer le Salaire Net Imposable (SNI), un abattement forfaitaire pour frais professionnels de **35%** est appliqué sur le salaire brut, plafonné à **2 916,67 DH par mois** (soit 35 000 DH/an).

#### 3. Barème Mensuel de l'IR 2026
L'Impôt sur le Revenu (IR) s'applique selon le barème progressif ci-dessous :

$$\\text{Barème IR Mensuel 2026}$$
* **De 0 à 3 333,33 DH** : 0%
* **De 3 333,34 à 5 000,00 DH** : 10% (Somme à déduire : 333,33 DH)
* **De 5 000,01 à 6 666,67 DH** : 20% (Somme à déduire : 833,33 DH)
* **De 6 666,68 à 8 333,33 DH** : 30% (Somme à déduire : 1 500,00 DH)
* **De 8 333,34 à 15 000,00 DH** : 34% (Somme à déduire : 1 833,33 DH)
* **Au-delà de 15 000,00 DH** : 37% (Somme à déduire : 2 283,33 DH)

#### 4. Réduction pour Charges de Famille
Une déduction d'impôt de **50 DH par mois et par personne à charge** (conjoint sans emploi et enfants légitimes) est accordée dans la limite de 6 personnes (maximum 300 DH/mois).
      `,
      faqs: [
        {
          question: 'Quel est le plafond de la cotisation CNSS au Maroc ?',
          answer: 'La cotisation CNSS de la part salariale (4,48%) est plafonnée à un salaire de 6 000 DH par mois. La retenue maximale est donc de 268,80 DH par mois.',
        },
        {
          question: 'Comment fonctionnent les réductions pour charges de famille au Maroc ?',
          answer: 'Chaque personne à charge (conjoint et enfants de moins de 27 ans sans revenu) donne droit à une déduction d\'impôt directe de 50 DH par mois, plafonnée à 6 personnes (300 DH/mois).',
        },
        {
          question: 'Quelle est la différence entre Salaire Brut et Salaire Net Imposable ?',
          answer: 'Le Salaire Net Imposable est le résultat du Salaire Brut diminué des cotisations sociales (CNSS, AMO) et de l\'abattement forfaitaire pour frais professionnels (35%). C\'est sur cette base que s\'applique le barème de l\'IR.',
        },
      ],
      relatedPages: [
        { title: 'Calculateur Salaire Net Maroc 2026', href: '/ma/calculateur-salaire-net-maroc' },
        { title: 'Passer du Salaire Brut au Net Maroc', href: '/ma/salaire-brut-net-maroc' },
        { title: 'Simulateur IR Maroc', href: '/ma/calcul-ir-maroc' },
      ],
    },
    'calculateur-salaire-net-maroc': {
      slug: 'calculateur-salaire-net-maroc',
      title: 'Calculateur Salaire Net Maroc 2026 — Simulation Rapide',
      h1: 'Calculateur de Salaire Net au Maroc 2026',
      metaDescription: 'Calculez instantanément votre bulletin de paie net au Maroc selon les textes de lois 2026.',
      keywords: ['calculateur salaire net maroc', 'salaire net maroc 2026', 'calcul salaire maroc'],
      canonicalUrl: 'https://regulo.online/ma/calculateur-salaire-net-maroc',
      explanationMarkdown: `
### Simulation Rapide de Paie au Maroc

Accédez à un simulateur de fiche de paie interactif conçu pour les salariés et gestionnaires RH au Maroc.
      `,
      faqs: [
        {
          question: 'L\'AMO est-elle plafonnée ?',
          answer: 'Non, contrairement à la CNSS, la cotisation AMO (2,26%) s\'applique sur la totalité du salaire brut sans aucun plafond.',
        },
      ],
      relatedPages: [
        { title: 'Calculateur Principal', href: '/ma/salaire-net-calculateur' },
      ],
    },
    'salaire-brut-net-maroc': {
      slug: 'salaire-brut-net-maroc',
      title: 'Salaire Brut en Net Maroc — Convertisseur de Salaire',
      h1: 'Convertisseur Salaire Brut en Net Maroc',
      metaDescription: 'Convertissez facilement votre salaire brut en salaire net au Maroc. Tableau et formules détaillées.',
      keywords: ['salaire brut en net maroc', 'conversion brut net maroc', 'bulletin de paie maroc'],
      canonicalUrl: 'https://regulo.online/ma/salaire-brut-net-maroc',
      explanationMarkdown: `
### Comprendre la Conversion Brut / Net au Maroc

Découvrez les pourcentages exacts prélevés sur votre salaire brut et l'impact des cotisations sur vos revenus nets.
      `,
      faqs: [
        {
          question: 'Quel est le taux de retenue moyen sur un salaire au Maroc ?',
          answer: 'Selon le niveau de salaire, le taux global de retenue (CNSS + AMO + IR) varie généralement entre 7% et 28% du salaire brut.',
        },
      ],
      relatedPages: [
        { title: 'Calculateur Principal', href: '/ma/salaire-net-calculateur' },
      ],
    },
    'calcul-ir-maroc': {
      slug: 'calcul-ir-maroc',
      title: 'Calcul IR Maroc 2026 — Barème Impôt sur le Revenu',
      h1: 'Calculateur d\'Impôt sur le Revenu (IR) Maroc 2026',
      metaDescription: 'Calculez la retenue d\'IR sur salaire au Maroc selon les tranches d\'imposition 2026 de la DGI.',
      keywords: ['calcul ir maroc', 'bareme ir 2026 dgi maroc', 'impot sur le revenu maroc'],
      canonicalUrl: 'https://regulo.online/ma/calcul-ir-maroc',
      explanationMarkdown: `
### Barème Officiel de l'Impôt sur le Revenu (IR)

Explication complète des tranches marginales d'imposition et de la méthode des sommes à déduire.
      `,
      faqs: [
        {
          question: 'À partir de quel salaire est-on imposable à l\'IR au Maroc ?',
          answer: 'Les salaires nets imposables inférieurs ou égaux à 3 333,33 DH par mois (40 000 DH par an) sont totalement exonérés d\'IR (taux de 0%).',
        },
      ],
      relatedPages: [
        { title: 'Calculateur Principal', href: '/ma/salaire-net-calculateur' },
      ],
    },
  },
};
