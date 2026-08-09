# ReguKit — Regulatory Utility Factory

ReguKit (`ReguKit.com`) is a high-speed, global regulatory calculator platform designed to deliver localized, mandatory administrative and financial utilities for instant search intent fulfillment.

---

## 🚀 Active Products & Country Engines (MVP)

1. **Kenya (`/ke/...`)** — *Kenya Net Salary Calculator 2026*
   - KRA PAYE tax bands (10% to 35%)
   - NSSF Phase III Tier I & Tier II caps
   - SHIF (Social Health Insurance Fund) 2.75% + 15% tax relief
   - Affordable Housing Levy 1.5%

2. **Mexico (`/mx/...`)** — *Calculadora Aguinaldo Neto 2026*
   - Ley Federal del Trabajo (Art. 87) minimum 15 days calculation
   - Exención de ISR de 30 UMA ($3,394.20 MXN)
   - Procedimiento de retención ISR (Art. 96 / Art. 174 LISR)

3. **Morocco (`/ma/...`)** — *Calculateur Salaire Net Maroc 2026*
   - CNSS (4.48% plafonné à 6 000 DH = max 268,80 DH)
   - AMO (2,26% non plafonné)
   - Abattement frais professionnels 35%
   - Barème IR progressif (0% à 37%) et réductions pour charges de famille

4. **Colombia (`/co/...`)** — *Calculadora Retención en la Fuente 2026*
   - UVT 2026 ($49,799 COP)
   - Aportes obligatorios Salud (4%), Pensión (4%) y Fondo de Solidaridad Pensional (FSP)
   - Deducciones Art. 387 E.T. (vivienda, dependientes, prepagada)
   - Renta Exenta 25% (Art. 206 Num. 10) y tabla Art. 383 E.T.

---

## 🛠️ Architecture & Directory Structure

```text
src/
├── app/
│   ├── layout.tsx              # Root Layout with ReguKit branding & GA script
│   ├── page.tsx                # Global Directory & Country Hub
│   ├── globals.css             # Trust design tokens & responsive CSS
│   ├── sitemap.ts              # Dynamic sitemap indexing all 20 targeted SEO URLs
│   ├── robots.ts               # Robots configuration pointing to sitemap.xml
│   ├── ke/                     # 6 Kenya SEO page routes
│   ├── mx/                     # 5 Mexico SEO page routes
│   ├── ma/                     # 4 Morocco SEO page routes
│   └── co/                     # 4 Colombia SEO page routes
├── components/
│   ├── Calculator.tsx          # Reusable interactive calculator engine
│   ├── CalculatorPageLayout.tsx# Page template (H1, Calculator, Guide, FAQ, Links)
│   ├── Header.tsx              # Top navigation & country switcher drawer
│   ├── Footer.tsx              # Directory links, legal disclaimer & trust badge
│   ├── StructuredData.tsx      # JSON-LD Schema (SoftwareApplication, FAQPage)
│   └── GoogleAnalytics.tsx     # GA4 tracking script
├── config/
│   ├── countries.ts            # Country metadata registry
│   └── calculators/
│       ├── index.ts            # Resolver registry
│       ├── kenya.ts            # Kenya 2026 tax formulas & content
│       ├── mexico.ts           # Mexico 2026 tax formulas & content
│       ├── morocco.ts          # Morocco 2026 tax formulas & content
│       └── colombia.ts         # Colombia 2026 tax formulas & content
└── types/
    └── calculator.ts           # Calculator, input, output, FAQ, and SEO interfaces
```

---

## 📖 How to Add a New Country

To launch a new country engine (e.g., Brazil `/br/` or Nigeria `/ng/`):

1. **Add Entry to `src/config/countries.ts`**:
   ```typescript
   export const COUNTRIES: Record<string, CountryConfig> = {
     // ...
     br: {
       code: 'br',
       name: 'Brazil',
       nativeName: 'Brasil',
       flag: '🇧🇷',
       currency: 'BRL',
       currencySymbol: 'R$',
       language: 'Portuguese',
       languageCode: 'pt',
       primarySlug: 'calculadora-imposto-de-renda',
       popularSearch: 'IRRF 2026',
       accentColor: '#16a34a',
     },
   };
   ```

2. **Create Config File `src/config/calculators/brazil.ts`**:
   - Implement `calculateBrazilTax(inputs)` returning `CalculationResult`.
   - Define `BRAZIL_CALCULATOR_CONFIG` with input fields and `pages` object for SEO routes.

3. **Register in `src/config/calculators/index.ts`**:
   ```typescript
   export const CALCULATOR_CONFIGS: Record<string, CalculatorConfig> = {
     // ...
     br: BRAZIL_CALCULATOR_CONFIG,
   };
   ```

4. **Create Route Folder `src/app/br/[slug]/page.tsx`**:
   ```typescript
   import { BRAZIL_CALCULATOR_CONFIG } from '@/config/calculators/brazil';
   import CalculatorPageLayout from '@/components/CalculatorPageLayout';

   export default function Page({ params }: { params: { slug: string } }) {
     const seo = BRAZIL_CALCULATOR_CONFIG.pages[params.slug];
     return <CalculatorPageLayout config={BRAZIL_CALCULATOR_CONFIG} seo={seo} />;
   }
   ```
   *The sitemap and robots.txt will automatically include the new pages!*

---

## ⚙️ Formula Configuration Guide

Each calculator formula in `src/config/calculators/<country>.ts` receives `inputs: Record<string, any>` and returns:

```typescript
export interface CalculationResult {
  heroOutput: {
    id: string;
    label: string;
    value: number;
    formattedValue: string;
    isHero: true;
    type: 'positive' | 'negative' | 'neutral' | 'highlight';
    description?: string;
  };
  breakdown: Array<{
    id: string;
    label: string;
    value: number;
    formattedValue: string;
    type?: 'positive' | 'negative' | 'neutral' | 'highlight';
    description?: string;
  }>;
  employerCost?: {
    totalCost: number;
    formattedTotal: string;
    items: Array<{ label: string; value: number; formattedValue: string }>;
  };
  notes?: string[];
}
```

---

## 📊 Analytics & Events

Google Analytics 4 tracks key user journeys via `src/lib/analytics.ts`:

- `calculator_start`: Fired when a user first modifies an input field.
- `calculator_complete`: Fired reactively when calculations complete.

To set your GA Measurement ID in Vercel / environment:
```sh
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

---

## 🧪 Verification & Local Testing

```bash
# Typecheck TypeScript
npm run typecheck

# Run calculation engine unit tests
npm run test

# Build production bundle & sitemap
npm run build

# Start local server
npm run start
```

---

## ⚡ Deploying to Vercel

1. Push your repository to GitHub / Git provider.
2. Connect to Vercel and import project.
3. Deploy! Static generation will pre-render all 20 targeted SEO pages and `/sitemap.xml` automatically.
