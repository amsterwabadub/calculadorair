# Regulatory Audit & Statutory Verification Matrix (2026)

Independent audit of statutory formulas, contribution caps, tax brackets, and official sources for the **Regulo** engine (`https://regulo.online`).

---

## 🇰🇪 Kenya (KE) Statutory Audit

| Material Rule | Statutory Value / Rate | Official Authority & Source | Audit Status | Code Location |
| :--- | :--- | :--- | :---: | :--- |
| **PAYE Tax Bands 2026** | 10% (0-24k), 25% (24k-32.3k), 30% (32.3k-500k), 32.5% (500k-800k), 35% (>800k) | KRA Income Tax Act Cap 470 ([KRA Official](https://www.kra.go.ke/en/individual/calculate-tax/paye)) | **PASS** | [`src/config/calculators/kenya.ts:38-60`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/kenya.ts#L38-L60) |
| **Personal Tax Relief** | KES 2,400 / month (KES 28,800 / year) | KRA Resident Tax Relief Schedule ([KRA Official](https://www.kra.go.ke/en/individual/calculate-tax/paye)) | **PASS** | [`src/config/calculators/kenya.ts:63`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/kenya.ts#L63) |
| **NSSF Phase III Pension** | Tier I 6% (max 420 KES), Tier II 6% (max 1,740 KES), Total max KES 2,160/mo | NSSF Act No 45 of 2013 ([NSSF Official](https://www.nssf.or.ke)) | **PASS** | [`src/config/calculators/kenya.ts:18-21`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/kenya.ts#L18-L21) |
| **Social Health Insurance Fund (SHIF)** | 2.75% of gross salary (min KES 300/mo) | Social Health Authority Regulations ([SHA Official](https://sha.go.ke)) | **PASS** | [`src/config/calculators/kenya.ts:24-28`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/kenya.ts#L24-L28) |
| **SHIF Tax Relief** | 15% of SHIF contribution deducted from PAYE tax liability | KRA Public Notice on SHIF Relief ([KRA Official](https://www.kra.go.ke)) | **PASS** | [`src/config/calculators/kenya.ts:64`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/kenya.ts#L64) |
| **Affordable Housing Levy** | 1.5% employee contribution, 1.5% employer matching | Affordable Housing Act 2024 ([Housing Dept](https://www.housingandurban.go.ke)) | **PASS** | [`src/config/calculators/kenya.ts:31`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/kenya.ts#L31) |

---

## 🇲🇽 Mexico (MX) Statutory Audit

| Material Rule | Statutory Value / Rate | Official Authority & Source | Audit Status | Code Location |
| :--- | :--- | :--- | :---: | :--- |
| **Derecho Mínimo de Aguinaldo** | 15 días de salario por año laborado (proporcional) | Ley Federal del Trabajo Art. 87 ([STPS Official](https://www.gob.mx/stps)) | **PASS** | [`src/config/calculators/mexico.ts:16-17`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/mexico.ts#L16-L17) |
| **Exención ISR (30 UMA)** | 30 UMA Diarias ($113.14 MXN = $3,394.20 MXN exentos) | INEGI UMA 2026 / LISR Art. 93 Fracc. XIV ([INEGI Official](https://www.inegi.org.mx/temas/uma/)) | **PASS** | [`src/config/calculators/mexico.ts:20-22`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/mexico.ts#L20-L22) |
| **Retención ISR Aguinaldo** | Tabla Art. 96 LISR / Procedimiento Art. 174 RLISR (1.92% a 35%) | SAT Anexo 8 RMF ([SAT Official](https://www.sat.gob.mx)) | **PASS** | [`src/config/calculators/mexico.ts:25-45`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/mexico.ts#L25-L45) |

---

## 🇲🇦 Morocco (MA) Statutory Audit

| Material Rule | Statutory Value / Rate | Official Authority & Source | Audit Status | Code Location |
| :--- | :--- | :--- | :---: | :--- |
| **CNSS Salariale** | 4.48% plafonné à 6 000 DH/mois (Max 268.80 DH/mois) | CNSS Maroc ([CNSS Official](https://www.cnss.ma)) | **PASS** | [`src/config/calculators/morocco.ts:17-18`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/morocco.ts#L17-L18) |
| **AMO Salariale** | 2.26% non plafonné | CNSS / Code Général des Impôts ([CNSS Official](https://www.cnss.ma)) | **PASS** | [`src/config/calculators/morocco.ts:21`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/morocco.ts#L21) |
| **Frais Professionnels** | Abattement de 35% plafonné à 2 916.67 DH/mois (35k DH/an) | CGI Article 59 ([DGI Official](https://www.tax.gov.ma)) | **PASS** | [`src/config/calculators/morocco.ts:24-25`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/morocco.ts#L24-L25) |
| **Barème Mensuel IR 2026** | 0% (<3.3k), 10% (3.3k-5k), 20% (5k-6.6k), 30% (6.6k-8.3k), 34% (8.3k-15k), 37% (>15k) | DGI Barème IR 2025/2026 ([DGI Official](https://www.tax.gov.ma)) | **PASS** | [`src/config/calculators/morocco.ts:34-55`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/morocco.ts#L34-L55) |
| **Charges de Famille** | 50 DH/mois par personne à charge (max 6 personnes = 300 DH/mois) | CGI Article 74 ([DGI Official](https://www.tax.gov.ma)) | **PASS** | [`src/config/calculators/morocco.ts:59-60`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/morocco.ts#L59-L60) |

---

## 🇨🇴 Colombia (CO) Statutory Audit

| Material Rule | Statutory Value / Rate | Official Authority & Source | Audit Status | Code Location |
| :--- | :--- | :--- | :---: | :--- |
| **Valor UVT 2026** | $49,799 COP por UVT | DIAN ([DIAN Official](https://www.dian.gov.co)) | **PASS** | [`src/config/calculators/colombia.ts:19`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/colombia.ts#L19) |
| **Salud y Pensión Obligatoria** | Salud 4%, Pensión 4% sobre IBC | Ley 100 de 1993 ([MinSalud Official](https://www.minsalud.gov.co)) | **PASS** | [`src/config/calculators/colombia.ts:22-23`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/colombia.ts#L22-L23) |
| **Fondo Solidaridad Pensional (FSP)** | 1% a 2% para ingresos >= 4 SMMLV ($5.69M COP) | Ley 797 de 2003 ([MinSalud Official](https://www.minsalud.gov.co)) | **PASS** | [`src/config/calculators/colombia.ts:27-36`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/colombia.ts#L27-L36) |
| **Deducciones Art. 387 E.T.** | Vivienda (max 100 UVT), Dependientes (10% max 32 UVT), Prepagada (max 16 UVT) | Estatuto Tributario Art. 387 ([Estatuto.co](https://estatuto.co/387)) | **PASS** | [`src/config/calculators/colombia.ts:39-40`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/colombia.ts#L39-L40) |
| **Renta Exenta 25%** | 25% del salario depurado, tope 240 UVT/mes ($11,951,760 COP) | Art. 206 Num. 10 E.T. ([Estatuto.co](https://estatuto.co/206)) | **PASS** | [`src/config/calculators/colombia.ts:43-47`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/colombia.ts#L43-L47) |
| **Tabla Retención Art. 383 E.T.** | 0-95 UVT (0%), 95-150 (19%), 150-360 (28%), 360-640 (33%), 640-940 (35%), 940-2300 (37%), >2300 (39%) | Art. 383 E.T. ([Estatuto.co](https://estatuto.co/383)) | **PASS** | [`src/config/calculators/colombia.ts:54-70`](file:///Users/at/Desktop/Second%20Brain/Projects/orgproject/Brazil/src/config/calculators/colombia.ts#L54-L70) |

---

## 🗺️ Route Classification Audit (SEO QA)

Next.js statically generates 26 routes during production `next build`. Here is the classification breakdown:

| Route Path | Type | Indexable? | Description |
| :--- | :---: | :---: | :--- |
| `/` | Page | **YES** | Global Regulo Directory & Country Hub |
| `/ke/net-salary-calculator` | Page | **YES** | Kenya Primary Calculator |
| `/ke/kenya-net-salary-calculator-2026` | Page | **YES** | Kenya SEO Subpage |
| `/ke/salary-after-tax-kenya` | Page | **YES** | Kenya SEO Subpage |
| `/ke/paye-calculator-kenya` | Page | **YES** | Kenya SEO Subpage |
| `/ke/shif-calculator-kenya` | Page | **YES** | Kenya SEO Subpage |
| `/ke/housing-levy-calculator-kenya` | Page | **YES** | Kenya SEO Subpage |
| `/mx/aguinaldo-calculator` | Page | **YES** | Mexico Primary Calculator |
| `/mx/aguinaldo-neto-calculadora-2026` | Page | **YES** | Mexico SEO Subpage |
| `/mx/isr-aguinaldo-calculator` | Page | **YES** | Mexico SEO Subpage |
| `/mx/salario-neto-mexico` | Page | **YES** | Mexico SEO Subpage |
| `/mx/calculadora-isr-mexico` | Page | **YES** | Mexico SEO Subpage |
| `/ma/salaire-net-calculateur` | Page | **YES** | Morocco Primary Calculator |
| `/ma/calculateur-salaire-net-maroc` | Page | **YES** | Morocco SEO Subpage |
| `/ma/salaire-brut-net-maroc` | Page | **YES** | Morocco SEO Subpage |
| `/ma/calcul-ir-maroc` | Page | **YES** | Morocco SEO Subpage |
| `/co/retefuente-calculadora` | Page | **YES** | Colombia Primary Calculator |
| `/co/retefuente-calculadora-2026` | Page | **YES** | Colombia SEO Subpage |
| `/co/uvt-calculator` | Page | **YES** | Colombia SEO Subpage |
| `/co/salario-neto-colombia` | Page | **YES** | Colombia SEO Subpage |
| `/politica-de-privacidade` | Page | **YES** | Privacy Policy & Terms |
| `/sitemap.xml` | Utility | **YES** | Canonical XML Sitemap |
| `/robots.txt` | Utility | **YES** | Robots Configuration |
| `/_not-found` | System | **NO** | Next.js Internal 404 Handler |
| `/_next/static/...` | System | **NO** | Static JavaScript/CSS Bundles |
| `/_next/data/...` | System | **NO** | RSC Data Traces |

**Summary**: 22 Public Indexable URLs (Homepage + 20 Calculator Landing Pages + Privacy Policy) are registered in `sitemap.xml`. No internal/system routes enter the sitemap.
