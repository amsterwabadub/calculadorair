# Wave 1 Portfolio Build Ranking & Product Blueprints

This document establishes the final operational decisions (`BUILD NOW`, `VALIDATE`, `WATCH`, `DROP`) for all 6 Wave 1 target countries and provides full product specification blueprints for surviving candidates.

---

## 1. Master Wave 1 Build Decision Summary

| Country | Country Code | Target Opportunity | Primary Keyword | Search Volume | Final Verdict | Recommended Action |
| :--- | :---: | :--- | :--- | :---: | :---: | :--- |
| **Brazil** | **BR** | Calculadora IRPF 2026 & Simulador da Reforma | `calculadora imposto de renda 2026` | 300,000 | **BUILD NOW** | **Deploy Full Product MVP Immediately** |
| **Mexico** | **MX** | Calculadora Aguinaldo Neto ISR 2026 | `calculadora aguinaldo neto 2026` | 140,000 | **VALIDATE** | **Launch 20-page Test Asset & Monitor SERP** |
| **Colombia** | **CO** | Calculadora ReteFuente DIAN 2026 | `calculadora retencion en la fuente 2026 colombia` | 125,000 | **VALIDATE** | **Launch 20-page Test Asset & Monitor SERP** |
| **Kenya** | **KE** | Kenya Net Payslip Calculator (SHIF + Housing) | `shif deduction calculator kenya 2026` | 130,000 | **VALIDATE** | **Launch 20-page Test Asset & Monitor SERP** |
| **Morocco** | **MA** | Calculateur Salaire Net & IR Maroc 2026 | `calculateur salaire net maroc 2026` | 160,000 | **VALIDATE** | **Launch 20-page Test Asset & Monitor SERP** |
| **Nigeria** | **NG** | Nigeria Tax Act & PAYE Calculator 2026 | `paye tax calculator nigeria 2026` | 95,000 | **WATCH** | **Hold Build — Re-assess Q4 2026** |

---

## 2. Product Blueprints for Surviving Opportunities

### BLUEPRINT 1: BRAZIL (BR) — BUILD NOW
**Asset**: `calculadorairpf2026.com.br`  
**Niche**: Tax / Reform Calculator  
**Target Event**: Lei nº 15.270/2025 (Reforma do Imposto de Renda 2026)  

#### 48-Hour MVP Specifications
- **Core Interactive Tool**: Client-side React/Next.js interactive tax calculator allowing users to enter gross salary, number of dependents, private pension (PGBL) contributions, and official deduction options.
- **Dynamic Reform Toggle**: Real-time slider comparing current 2025 tax liability vs. new 2026 Lei 15.270 reform rules (R$ 5.000 exemption limit and progressive table discount).
- **Tech Stack**: Next.js (App Router), Vanilla CSS Design System, Lucide Icons, Plausible/GA4 Analytics.

#### First 20 SEO Launch Pages
1. `/` — Calculadora Imposto de Renda 2026 (Main Tool)
2. `/tabela-irpf-2026` — Tabela Progressiva IRPF 2026 Atualizada
3. `/isencao-5000-irpf` — Como Funciona a Isenção de R$ 5.000 no IR 2026
4. `/simulador-reforma-tributaria-ir` — Simulador Comparativo Reforma do IR 2026
5. `/calculadora-irpf-clt` — Calculadora IR 2026 para Trabalhadores CLT
6. `/calculadora-irpf-autonomo` — Calculadora IR 2026 para Profissionais Autônomos
7. `/calculadora-irpf-aposentado` — Calculadora IR 2026 para Aposentados e Pensionistas
8. `/desconto-simplificado-vs-completo` — Simulador Desconto Simplificado vs Declaração Completa
9. `/como-calcular-irpf-folha-pagamento` — Como Calcular o Desconto de IRRF no Holerite
10. `/tabela-deducao-dependente-irpf-2026` — Valor de Dedução por Dependente IRPF 2026
11. `/deducao-pgbl-imposto-de-renda` — Como Abater PGBL no Imposto de Renda 2026
12. `/calculadora-restituicao-irpf-2026` — Simulador de Restituição do IRPF 2026
13. `/calendario-lotes-restituicao-2026` — Calendário de Lotes de Restituição Receita Federal
14. `/malha-fina-irpf-2026-como-evitar` — Como Evitar a Malha Fina no IRPF 2026
15. `/declaracao-irpf-investimentos-acoes` — Como Declarar Ações e Fundos Imobiliários em 2026
16. `/imposto-de-renda-lucro-presumido-socios` — Tributação de Dividendos e Pró-Labore 2026
17. `/isencao-irpf-molestia-grave` — Guia de Isenção de IRPF por Doença Grave
18. `/calculadora-ganho-de-capital-imoveis` — Calculadora de Imposto sobre Venda de Imóveis
19. `/darf-irpf-como-gerar-e-pagar` — Como Gerar e Pagar a SIDA / DARF IRPF 2026
20. `/perguntas-frequentes-reforma-irpf-2026` — Dúvidas Frequentes sobre a Nova Lei do IR

#### First 100-Page Expansion Architecture
- **Programmatic Axis 1 (Salary Slugs)**: 50 pages targeting `/calculadora-irpf-salario-[amount]` (e.g., `/calculadora-irpf-salario-5000`, `/calculadora-irpf-salario-6000`, ..., `/calculadora-irpf-salario-15000`).
- **Programmatic Axis 2 (State/City Tax Guides)**: 30 pages targeting localized tax reporting guides for top Brazilian metropolitan hubs.

#### Data Source & Compliance
- **Source**: Presidência da República / Receita Federal do Brasil (Lei nº 15.270/2025 & IN RFB). All formulas client-side; zero PII saved.

#### Monetization & Conversion Trigger
- **Primary**: Display Ads (AdSense / Ezoic / Premium Header Bidding).
- **Secondary / High-Yield Conversion**: "Falar com Contador Parceiro" inline CTA triggered when tax liability exceeds R$ 1.200/year or when dividend distribution exceeds R$ 50.000/month.

---

### BLUEPRINT 2: MEXICO (MX) — VALIDATE
**Asset**: `calculadoraaguinaldonetomx.com`  
**Niche**: Payroll / Aguinaldo & Tax  
**Target Event**: CFDI Nómina 1.2 & Exención UMA Aguinaldo 2026  

#### 48-Hour MVP Specifications
- **Core Interactive Tool**: Aguinaldo Net Salary & Tax Calculator factoring in years of service, daily salary, daily UMA rate ($117.31 MXN), and 30 UMA tax exemption limit ($3,519.30 MXN).
- **Tech Stack**: Next.js, Vanilla CSS, Responsive Mobile First design.

#### First 20 SEO Launch Pages
1. `/` — Calculadora Aguinaldo Neto 2026 (Main Tool)
2. `/cuanto-me-quitan-de-isr-de-aguinaldo` — ¿Cuánto me Descuentan de ISR del Aguinaldo?
3. `/exencion-uma-aguinaldo-2026` — Límite Exento de Aguinaldo en UMAs 2026
4. `/calculo-aguinaldo-salario-minimo` — Aguinaldo para Trabajadores de Salario Mínimo
5. `/formula-oficial-calculo-aguinaldo-sat` — Fórmula Oficial del SAT para Calcular Aguinaldo
6. `/fecha-limite-pago-aguinaldo-mexico` — Fecha Límite Legal para el Pago de Aguinaldo
7. `/calculadora-aguinaldo-proporcional` — Calculadora de Aguinaldo Proporcional (Menos de 1 Año)
8. `/aguinaldo-para-trabajadores-domesticos` — Guía de Aguinaldo para Empleadas Domésticas
9. `/tablas-isr-nomina-2026` — Tablas Retención ISR Nómina SAT 2026
10. `/calculadora-finiquito-y-liquidacion` — Calculadora de Finiquito y Prima de Antigüedad
11. `/diferencia-aguinaldo-bruto-y-neto` — Diferencia entre Aguinaldo Bruto y Neto
12. `/multas-patrones-no-pago-aguinaldo` — Multas STPS para Patrones que no Pagan Aguinaldo
13. `/calculo-aguinaldo-comisionistas` — Cómo se Calcula el Aguinaldo para Comisionistas
14. `/aguinaldo-trabajadores-resico` — Tratamiento Fiscal del Aguinaldo en RESICO
15. `/como-denunciar-falta-de-pago-aguinaldo-profedet` — Cómo Denunciar Falta de Pago en PROFEDET
16. `/calculadora-ptu-reparto-de-utilidades-2026` — Calculadora Reparto de Utilidades (PTU) 2026
17. `/impuesto-estatal-sobre-nominas-isn` — Tabla Impuesto Sobre Nóminas (ISN) por Estado
18. `/calculo-horas-extras-ley-federal-del-trabajo` — Calculadora de Horas Extras LFT
19. `/prima-vacacional-calculo-y-exencion-sat` — Cálculo de Prima Vacacional y Exención UMA
20. `/preguntas-frequentes-aguinaldo-sat-2026` — Preguntas Frecuentes Aguinaldo 2026

---

### BLUEPRINT 3: COLOMBIA (CO) — VALIDATE
**Asset**: `calculadoraretefuente.co`  
**Niche**: Income Tax / Withholding  
**Target Event**: Reforma Tributaria 2026 & UVT $52.374 COP  

#### 48-Hour MVP Specifications
- **Core Interactive Tool**: Monthly ReteFuente Withholding Calculator converting gross salary into UVT units, deducting mandatory pension/health (8%), housing interest, and voluntary AFC contributions.
- **Tech Stack**: Next.js, Vanilla CSS.

#### First 20 SEO Launch Pages
1. `/` — Calculadora Retención en la Fuente 2026 (Main Tool)
2. `/valor-uvt-2026-colombia` — Valor Oficial de la UVT 2026 y Tabla de Retención
3. `/quienes-estan-sujetos-a-retefuente-2026` — Base Mínima de Retención 95 UVT Asalariados
4. `/depuracion-renta-de-trabajo-art-388` — Guía de Depuración Renta de Trabajo Art. 388 ET
5. `/calculadora-retefuente-independientes` — Calculadora ReteFuente para Honorarios e Independientes
6. `/deduccion-por-dependientes-dian` — Deducción por Dependientes en Retención de Renta
7. `/aportes-afc-y-pension-voluntaria-exencion` — Exención de Aportes AFC y Pensión Voluntaria
8. `/calculadora-hora-ordinaria-jornada-42-horas` — Calculadora Hora Ordinaria Jornada 42 Horas
9. `/tabla-retencion-en-la-fuente-compras-y-servicios` — Tabla ReteFuente Compras y Servicios 2026
10. `/calculadora-prima-de-servicios-junio-diciembre` — Calculadora Prima de Servicios 2026
11. `/calculo-intereses-de-cesantias-12-por-ciento` — Cálculo de Intereses sobre Cesantías 12%
12. `/calendario-tributario-dian-2026` — Calendario Tributario DIAN Personas Naturales
13. `/topes-para-declarar-renta-2026` — Topes e Ingresos para Declarar Renta en 2026
14. `/calculadora-impuesto-al-patrimonio-colombia` — Calculadora Impuesto al Patrimonio
15. `/descuento-impuesto-vehiculos-bogota-2026` — Guía Impuesto de Vehículos Bogotá y SOAT
16. `/regimen-simple-de-tributacion-rst-tarifas` — Tarifas Régimen Simple de Tributación RST
17. `/factura-electronica-pos-5-uvt-limite` — Límite POS Electrónico 5 UVT DIAN
18. `/liquidacion-definitiva-de-contrato-laboral` — Calculadora Liquidación de Contrato Laboral
19. `/consultar-ruaf-sispro-afiliaciones` — Guía Consulta RUAF SISPRO EPS y Pensiones
20. `/preguntas-frecuentes-retencion-dian-2026` — Preguntas Frecuentes ReteFuente 2026

---

### BLUEPRINT 4: KENYA (KE) — VALIDATE
**Asset**: `shifpayslipcalculator.co.ke`  
**Niche**: Payroll / Deductions  
**Target Event**: SHIF 2.75% & Housing Levy 1.5% Integration  

#### 48-Hour MVP Specifications
- **Core Interactive Tool**: Kenya Net Payslip Calculator computing Gross Pay minus PAYE, SHIF (2.75%), Affordable Housing Levy (1.5%), and NSSF Tier I/II deductions.
- **Tech Stack**: Next.js, Vanilla CSS.

#### First 20 SEO Launch Pages
1. `/` — Kenya Net Payslip Calculator 2026 (SHIF + Housing Levy + PAYE)
2. `/shif-deduction-calculator-kenya` — SHIF 2.75% Deduction Calculator & Rates
3. `/housing-levy-calculator-kenya-1-5-percent` — Affordable Housing Levy 1.5% Calculator
4. `/nssf-rates-2026-tier-1-tier-2-table` — NSSF Tier I & Tier II Deduction Scale 2026
5. `/kra-paye-tax-bands-calculator` — KRA PAYE Income Tax Brackets 2026
6. `/how-to-file-sha-shif-employer-monthly-return` — How to File SHA/SHIF Employer Returns
7. `/kra-personal-relief-calculation` — Personal Relief KES 2,400 Claim Guide
8. `/insurance-relief-shif-kra-itax` — How to Claim SHIF Insurance Relief on iTax
9. `/gross-to-net-salary-calculator-kenya` — Gross to Net Salary Calculator Kenya
10. `/etims-kra-registration-guide-smes` — KRA eTIMS Registration Guide for Small Businesses
11. `/how-to-file-nil-return-itax-2026` — How to File KRA Nil Return on iTax
12. `/kra-tcc-application-status-check` — KRA Tax Compliance Certificate Status Check
13. `/turnover-tax-rate-kenya-3-percent` — Turnover Tax (TOT 3%) Calculation Guide
14. `/ntsa-smart-driving-license-renewal-fee` — NTSA Smart DL Renewal Fee & eCitizen Guide
15. `/ardhisasa-land-rates-check-online` — How to Check Land Rates on ArdhiSasa
16. `/customs-duty-calculator-imported-cars-kenya` — KRA Duty Calculator for Imported Vehicles
17. `/maisha-card-application-ecitizen` — Maisha Card Application & Tracking Guide
18. `/kenya-minimum-wage-rates-2026` — Official Gazette Minimum Wage Scale Kenya
19. `/net-pay-after-tax-kes-50000-salary` — Payslip Breakdown for KES 50,000 Gross Salary
20. `/frequently-asked-questions-shif-kra-payroll` — Frequently Asked Questions SHIF & PAYE

---

### BLUEPRINT 5: MOROCCO (MA) — VALIDATE
**Asset**: `calculateursalairemaroc2026.ma`  
**Niche**: Income Tax / Net Salary  
**Target Event**: Réforme IR LF 2025/2026 & Bareme 40.000 MAD  

#### 48-Hour MVP Specifications
- **Core Interactive Tool**: Morocco Net Salary & IR Calculator computing Gross Salary minus CNSS (4.48% capped at 6.000 MAD), AMO (2.26%), Professional Expense Abatement (35%/25%), and IR progressive tax brackets (0% to 37%).
- **Tech Stack**: Next.js, Vanilla CSS.

#### First 20 SEO Launch Pages
1. `/` — Calculateur Salaire Net Maroc 2026 (Main Tool)
2. `/nouveau-bareme-ir-maroc-2026` — Nouveau Barème de l'IR Loi de Finances 2025/2026
3. `/exoneration-40000-dh-ir-maroc` — Seuil d'Exonération IR 40.000 DH par An
4. `/calcul-cotisation-cnss-et-amo-salaire` — Calcul Cotisation CNSS et AMO sur Fiche de Paie
5. `/frais-professionnels-deduction-ir` — Taux de Déduction des Frais Professionnels 2026
6. `/deduction-charges-de-famille-ir-500-dh` — Déduction pour Charges de Famille 500 DH/An
7. `/calculateur-salaire-brut-en-net-maroc` — Convertisseur Salaire Brut en Net Maroc
8. `/cotisation-cnss-auto-entrepreneur-2026` — Cotisation CNSS et Impôt Auto-Entrepreneur
9. `/declaration-chiffre-d-affaires-auto-entrepreneur` — Guide Déclaration Trimestrielle Auto-Entrepreneur
10. `/prix-vignette-auto-maroc-2026` — Tarifs Vignette Automobile 2026 par Puissance Fiscale
11. `/consultation-indice-rsu-maroc-2026` — Guide Consultation Indice Registre Social Unifié (RSU)
12. `/aide-sociale-directe-asd-eligibilite` — Conditions d'Éligibilité Aide Sociale Directe
13. `/taux-tva-maroc-2026-liste-produits` — Liste des Taux de TVA Harmonisés 2026
14. `/calcul-pension-de-retraite-cnss-maroc` — Estimation Pension de Retraite CNSS & CIMR
15. `/teledeclaration-dgi-simpl-ir-guide` — Guide Télé-déclaration DGI SIMPL-IR
16. `/mutations-carte-grise-narsa-tarifs` — Tarifs Mutation Carte Grise et Permis à Points NARSA
17. `/demande-passeport-biometrique-en-ligne` — Demande et Timbre Passeport Biométrique Maroc
18. `/exonération-ir-jeunes-recrues-premier-emploi` — Exonération IR Premier Emploi 36 Mois
19. `/frais-de-douane-achat-en-ligne-maroc` — Calcul Frais de Douane Colis E-commerce
20. `/questions-frequentes-impot-sur-le-revenu-maroc` — FAQ Impôt sur le Revenu Maroc 2026
