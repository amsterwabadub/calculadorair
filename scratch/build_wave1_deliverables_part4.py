import os
import csv

base_dir = "/Users/at/Desktop/Second Brain/Projects/orgproject/Brazil"

# ---------------------------------------------------------
# TASK D & E: 04-wave1-serp-analysis.csv & 05-wave1-opportunities.csv
# ---------------------------------------------------------

# 04-wave1-serp-analysis.csv
serp_headers = [
    "country", "country_code", "candidate_opportunity", "head_query", 
    "top_1_domain", "top_1_type", "top_2_domain", "top_2_type", "top_3_domain", "top_3_type",
    "government_tool_exists", "commercial_tool_exists", "weak_domains_in_top_10", 
    "ai_overview_present", "zero_click_risk", "serp_gap_rating", "organic_accessibility_score"
]

serp_rows = [
    # Brazil
    ["Brazil", "BR", "Calculadora IRPF 2026 & Simulador da Reforma", "calculadora imposto de renda 2026", "gov.br/receitafederal", "GOV", "iorlando.com.br", "BLOG", "mobills.com.br", "COMMERCIAL_BLOG", "NO", "YES", "YES", "NO", "LOW", "HIGH_GAP", "92"],
    ["Brazil", "BR", "Portal Transição IBS/CBS 2026", "aliquota ibs cbs 2026", "fazenda.gov.br", "GOV", "conjur.com.br", "NEWS", "pwc.com.br", "CORPORATE", "NO", "NO", "NO", "NO", "LOW", "MEDIUM_GAP", "68"],
    ["Brazil", "BR", "Guia DAS-MEI 2026", "valor das mei 2026", "gov.br/mei", "GOV_TOOL", "sebrae.com.br", "SEMI_GOV", "contadorstat.com.br", "COMMERCIAL_TOOL", "YES", "YES", "NO", "YES", "HIGH", "NO_GAP", "40"],
    ["Brazil", "BR", "Assistente FGTS Digital eSocial", "fgts digital como pagar pix", "sistema.gov.br", "GOV_TOOL", "caixa.gov.br", "GOV", "contabeis.com.br", "FORUM", "YES", "YES", "NO", "YES", "HIGH", "NO_GAP", "45"],
    ["Brazil", "BR", "Portal Agendamento CIN Guia", "agendamento cin 2026", "gov.br/cin", "GOV_TOOL", "poupatempo.sp.gov.br", "GOV_LOCAL", "g1.globo.com", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "35"],

    # Mexico
    ["Mexico", "MX", "Calculadora Aguinaldo Neto ISR 2026", "calculadora aguinaldo neto 2026", "sat.gob.mx", "GOV", "elcontador.mx", "COMMERCIAL_BLOG", "idconline.mx", "NEWS", "NO", "YES", "YES", "NO", "LOW", "HIGH_GAP", "88"],
    ["Mexico", "MX", "Tablas ISR SAT 2026 & Calculadora", "tablas isr 2026 sat", "sat.gob.mx", "GOV_TABLE", "fiscalia.com", "FORUM", "elconta.com", "BLOG", "NO", "YES", "NO", "NO", "LOW", "MEDIUM_GAP", "74"],
    ["Mexico", "MX", "Guia Tramite CURP Biometrica", "curp biometrica requisitos citas 2026", "gob.mx/renapo", "GOV_PORTAL", "eluniversal.com.mx", "NEWS", "milenio.com", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "40"],
    ["Mexico", "MX", "Calculador de Cuotas Patronales IMSS 2026", "tabla cuotas patronales imss 2026", "imss.gob.mx", "GOV", "contadorcontado.com", "BLOG", "tax.com.mx", "BLOG", "NO", "NO", "YES", "NO", "LOW", "MEDIUM_GAP", "70"],
    ["Mexico", "MX", "Portal Citas REPUVE Guia", "regularizacion autos chocolate 2026 citas repuve", "repuve.gob.mx", "GOV_TOOL", "elsoldemexico.com.mx", "NEWS", "infobae.com", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "38"],

    # Colombia
    ["Colombia", "CO", "Calculadora ReteFuente DIAN 2026", "calculadora retencion en la fuente 2026 colombia", "dian.gov.co", "GOV", "actualicese.com", "COMMERCIAL_BLOG", "gerencie.com", "BLOG", "NO", "YES", "YES", "NO", "LOW", "HIGH_GAP", "86"],
    ["Colombia", "CO", "Calculadora Jornada Laboral 42 Horas", "calculo hora ordinaria y recargo 2026 colombia", "mintrabajo.gov.co", "GOV", "eltiempo.com", "NEWS", "laborapp.co", "TOOL", "NO", "NO", "YES", "NO", "LOW", "HIGH_GAP", "84"],
    ["Colombia", "CO", "Verificador POS Electrónico DIAN", "pos electronico 5 uvt dian 2026", "dian.gov.co", "GOV", "alegra.com", "SAAS", "siigo.com", "SAAS", "NO", "YES", "NO", "NO", "LOW", "LOW_GAP", "60"],
    ["Colombia", "CO", "Simulador Reforma Pensional 2026", "reforma pensional colombia simulador 2026", "colpensiones.gov.co", "GOV_TOOL", "porvenir.com.co", "FINANCIAL", "larepublica.co", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "42"],
    ["Colombia", "CO", "Calculadora SOAT e Impuesto Vehículos", "tarifas soat 2026 motos y carros", "superfinanciera.gov.co", "GOV", "fasecolda.com", "ASSOCIATION", "runt.gov.co", "GOV_TOOL", "YES", "YES", "NO", "YES", "HIGH", "NO_GAP", "40"],

    # Nigeria
    ["Nigeria", "NG", "Nigeria Tax Act & PAYE Calculator 2026", "paye tax calculator nigeria 2026", "nrs.gov.ng", "GOV", "myjobmag.com", "JOBS", "kudabank.com", "BANK", "NO", "NO", "YES", "NO", "LOW", "HIGH_GAP", "80"],
    ["Nigeria", "NG", "Nigeria Minimum Wage Net Pay Calculator", "70000 minimum wage salary structure calculator nigeria", "labour.gov.ng", "GOV", "punchng.com", "NEWS", "nairametrics.com", "NEWS", "NO", "NO", "YES", "NO", "LOW", "HIGH_GAP", "78"],
    ["Nigeria", "NG", "WHT Deduction Rate Lookup Tool", "wht rates in nigeria 2026 pdf", "nrs.gov.ng", "GOV_PDF", "taxaide.com.ng", "CONSULTING", "pwc.com/ng", "CORPORATE", "NO", "YES", "NO", "NO", "LOW", "MEDIUM_GAP", "66"],
    ["Nigeria", "NG", "CAC Compliance Status & Penalty Estimator", "cac annual returns filing fee 2026", "cac.gov.ng", "GOV_TOOL", "nairaland.com", "FORUM", "legalspire.ng", "BLOG", "YES", "YES", "YES", "YES", "HIGH", "NO_GAP", "45"],
    ["Nigeria", "NG", "PenCom RSA Withdrawal & Contribution Calculator", "pencom pension contribution calculator nigeria 2026", "pencom.gov.ng", "GOV_TOOL", "stanbicibtc.com", "PFA", "armpension.com", "PFA", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "42"],

    # Kenya
    ["Kenya", "KE", "Kenya Net Payslip Calculator (SHIF + Housing Levy)", "shif deduction calculator kenya 2026", "sha.go.ke", "GOV", "standardmedia.co.ke", "NEWS", "nation.africa", "NEWS", "NO", "YES", "YES", "NO", "LOW", "HIGH_GAP", "82"],
    ["Kenya", "KE", "Guia Invoicing KRA eTIMS", "etims kra registration process 2026", "etims.kra.go.ke", "GOV_TOOL", "tuko.co.ke", "NEWS", "standardmedia.co.ke", "NEWS", "YES", "YES", "NO", "YES", "HIGH", "NO_GAP", "48"],
    ["Kenya", "KE", "Calculadora NSSF Tier I/II Kenya", "nssf rates table 2026 kenya", "nssf.or.ke", "GOV", "salary24.co.ke", "BLOG", "kenyayote.com", "BLOG", "NO", "YES", "YES", "NO", "LOW", "MEDIUM_GAP", "65"],
    ["Kenya", "KE", "Portal Tracking Maisha Card eCitizen", "maisha card application on ecitizen 2026", "ecitizen.go.ke", "GOV_TOOL", "citizen.digital", "NEWS", "tuko.co.ke", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "40"],
    ["Kenya", "KE", "KRA TCC Instant Troubleshooting Guide", "how to apply for kra tcc on itax 2026", "itax.kra.go.ke", "GOV_TOOL", "tuko.co.ke", "NEWS", "kenyans.co.ke", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "42"],

    # Morocco
    ["Morocco", "MA", "Calculateur Salaire Net & IR Maroc 2026", "calculateur salaire net maroc 2026", "finances.gov.ma", "GOV", "dgi.gov.ma", "GOV", "rekrute.com", "JOBS", "NO", "YES", "YES", "NO", "LOW", "HIGH_GAP", "86"],
    ["Morocco", "MA", "Annuaire Taux TVA DGI Maroc", "taux tva maroc 2026 liste produits", "tax.gov.ma", "GOV_CODE", "lematin.ma", "NEWS", "fisc-maroc.com", "BLOG", "NO", "YES", "NO", "NO", "LOW", "MEDIUM_GAP", "66"],
    ["Morocco", "MA", "Simulateur Impôt & CNSS Auto-Entrepreneur", "declaration chiffre d affaires auto entrepreneur maroc 2026", "autoentrepreneur.ma", "GOV_TOOL", "cnss.ma", "GOV_TOOL", "mep.ma", "BLOG", "YES", "YES", "NO", "YES", "HIGH", "NO_GAP", "45"],
    ["Morocco", "MA", "Calculateur Vignette Auto Maroc 2026", "prix vignette auto maroc 2026 par puissance fiscale", "vignette.ma", "GOV_TOOL", "tgr.gov.ma", "GOV", "medi1news.com", "NEWS", "YES", "YES", "NO", "YES", "HIGH", "NO_GAP", "40"],
    ["Morocco", "MA", "Guide Consultation Indice RSU", "consultation indice rsu maroc 2026", "rsu.ma", "GOV_TOOL", "mapnews.ma", "NEWS", "snrtnews.com", "NEWS", "YES", "NO", "NO", "YES", "HIGH", "NO_GAP", "35"]
]

with open(os.path.join(base_dir, "04-wave1-serp-analysis.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(serp_headers)
    writer.writerows(serp_rows)

print("Created 04-wave1-serp-analysis.csv.")

# 05-wave1-opportunities.csv
opp_rank_headers = [
    "country", "country_code", "rank", "opportunity_name", "product_type", 
    "target_head_query", "estimated_monthly_volume", "mvp_build_hours", 
    "primary_monetization", "estimated_revenue_per_100k", "score", "final_verdict"
]

opp_rank_rows = [
    # BR
    ["Brazil", "BR", "1", "Calculadora IRPF 2026 & Simulador da Reforma", "Interactive Web Calculator & Tax Table", "calculadora imposto de renda 2026", "300000", "36", "Display Ads + Accountant Lead Gen", "$850", "94", "BUILD NOW"],
    ["Brazil", "BR", "2", "Portal Transição IBS/CBS 2026", "Informational Portal & B2B Calculator", "aliquota ibs cbs 2026", "45000", "48", "B2B Lead Gen", "$1,200", "68", "WATCH"],
    ["Brazil", "BR", "3", "Guia DAS-MEI 2026", "Informational Table & Calculator", "valor das mei 2026", "120000", "24", "Display Ads", "$450", "52", "DROP"],
    ["Brazil", "BR", "4", "Assistente FGTS Digital eSocial", "Guide & Template Generator", "fgts digital como pagar pix", "65000", "40", "Display Ads", "$500", "55", "DROP"],
    ["Brazil", "BR", "5", "Portal Agendamento CIN Guia", "State Portal Directory", "agendamento cin 2026", "210000", "24", "Display Ads", "$250", "48", "DROP"],

    # MX
    ["Mexico", "MX", "1", "Calculadora Aguinaldo Neto ISR 2026", "Interactive Payroll Calculator", "calculadora aguinaldo neto 2026", "140000", "36", "Display Ads + HR Software Affiliates", "$650", "88", "VALIDATE"],
    ["Mexico", "MX", "2", "Tablas ISR SAT 2026 & Calculadora", "Tax Table Lookup & Calculator", "tablas isr 2026 sat", "180000", "30", "Display Ads", "$550", "74", "WATCH"],
    ["Mexico", "MX", "3", "Calculador de Cuotas Patronales IMSS 2026", "Employer Cost Matrix Calculator", "tabla cuotas patronales imss 2026", "55000", "40", "B2B Payroll Leads", "$750", "70", "WATCH"],
    ["Mexico", "MX", "4", "Guia Tramite CURP Biometrica", "Module Locator Guide", "curp biometrica requisitos citas 2026", "95000", "24", "Display Ads", "$300", "50", "DROP"],
    ["Mexico", "MX", "5", "Portal Citas REPUVE Guia", "VIN Verification Guide", "regularizacion autos chocolate 2026 citas repuve", "85000", "36", "Display Ads", "$400", "52", "DROP"],

    # CO
    ["Colombia", "CO", "1", "Calculadora ReteFuente DIAN 2026", "Tax Withholding Estimator", "calculadora retencion en la fuente 2026 colombia", "125000", "32", "Display Ads + Accounting Tools", "$600", "86", "VALIDATE"],
    ["Colombia", "CO", "2", "Calculadora Jornada Laboral 42 Horas", "Overtime & Hourly Rate Calculator", "calculo hora ordinaria y recargo 2026 colombia", "110000", "36", "Display Ads + HR Legal Leads", "$550", "84", "WATCH"],
    ["Colombia", "CO", "3", "Verificador POS Electrónico DIAN", "SME Invoicing Compliance Tool", "pos electronico 5 uvt dian 2026", "40000", "48", "B2B POS Affiliates", "$900", "60", "DROP"],
    ["Colombia", "CO", "4", "Simulador Reforma Pensional 2026", "Pension Transition Calculator", "reforma pensional colombia simulador 2026", "90000", "40", "Display Ads", "$500", "60", "DROP"],
    ["Colombia", "CO", "5", "Calculadora SOAT e Impuesto Vehículos", "Rate Lookup & Directory", "tarifas soat 2026 motos y carros", "160000", "24", "Display Ads", "$400", "52", "DROP"],

    # NG
    ["Nigeria", "NG", "1", "Nigeria Tax Act & PAYE Calculator 2026", "Tax & Exemption Estimator", "paye tax calculator nigeria 2026", "95000", "40", "Display Ads + SaaS Referral", "$450", "80", "WATCH"],
    ["Nigeria", "NG", "2", "Nigeria Minimum Wage Net Pay Calculator", "Interactive Payslip Breakdown", "70000 minimum wage salary structure calculator nigeria", "75000", "24", "Display Ads", "$400", "78", "WATCH"],
    ["Nigeria", "NG", "3", "WHT Deduction Rate Lookup Tool", "B2B Rate Calculator", "wht rates in nigeria 2026 pdf", "50000", "30", "Display Ads", "$500", "66", "DROP"],
    ["Nigeria", "NG", "4", "CAC Compliance Status & Penalty Estimator", "Status Guide & Calculator", "cac annual returns filing fee 2026", "80000", "24", "Display Ads", "$350", "54", "DROP"],
    ["Nigeria", "NG", "5", "PenCom RSA Withdrawal & Contribution Calculator", "Pension Estimator", "pencom pension contribution calculator nigeria 2026", "60000", "32", "Display Ads", "$450", "52", "DROP"],

    # KE
    ["Kenya", "KE", "1", "Kenya Net Payslip Calculator (SHIF + Housing Levy)", "Interactive Payroll Deductions Calculator", "shif deduction calculator kenya 2026", "130000", "36", "Display Ads + HR Affiliates", "$600", "82", "VALIDATE"],
    ["Kenya", "KE", "2", "Calculadora NSSF Tier I/II Kenya", "Pension Contribution Scale Tool", "nssf rates table 2026 kenya", "70000", "30", "Display Ads", "$450", "65", "DROP"],
    ["Kenya", "KE", "3", "Guia Invoicing KRA eTIMS", "Step-by-Step Guide", "etims kra registration process 2026", "110000", "24", "Display Ads", "$500", "58", "DROP"],
    ["Kenya", "KE", "4", "KRA TCC Instant Troubleshooting Guide", "iTax TCC Guide", "how to apply for kra tcc on itax 2026", "95000", "24", "Display Ads", "$350", "52", "DROP"],
    ["Kenya", "KE", "5", "Portal Tracking Maisha Card eCitizen", "eCitizen Portal Guide", "maisha card application on ecitizen 2026", "85000", "24", "Display Ads", "$250", "50", "DROP"],

    # MA
    ["Morocco", "MA", "1", "Calculateur Salaire Net & IR Maroc 2026", "Interactive Net Salary & Tax Calculator", "calculateur salaire net maroc 2026", "160000", "36", "Display Ads + HR Software Ads", "$700", "86", "VALIDATE"],
    ["Morocco", "MA", "2", "Annuaire Taux TVA DGI Maroc", "Product Classification & Rate Finder", "taux tva maroc 2026 liste produits", "45000", "32", "Display Ads", "$500", "66", "DROP"],
    ["Morocco", "MA", "3", "Simulateur Impôt & CNSS Auto-Entrepreneur", "Turnover & Healthcare Calculator", "declaration chiffre d affaires auto entrepreneur maroc 2026", "70000", "24", "Display Ads", "$400", "56", "DROP"],
    ["Morocco", "MA", "4", "Calculateur Vignette Auto Maroc 2026", "Fiscal HP Rate Tool", "prix vignette auto maroc 2026 par puissance fiscale", "130000", "24", "Display Ads", "$350", "50", "DROP"],
    ["Morocco", "MA", "5", "Guide Consultation Indice RSU", "Eligibility Score Guide", "consultation indice rsu maroc 2026", "180000", "24", "Display Ads", "$200", "45", "DROP"]
]

with open(os.path.join(base_dir, "05-wave1-opportunities.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(opp_rank_headers)
    writer.writerows(opp_rank_rows)

print("Created 05-wave1-opportunities.csv.")
