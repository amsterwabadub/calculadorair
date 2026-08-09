# SEO-BASELINE.md — Launch Baseline State

Data de lançamento do domínio de produção: **9 de agosto de 2026**.

## 1. Origem Única de Produção
- **Repositório GitHub:** `https://github.com/amsterwabadub/calculadorair`
- **Branch:** `main`
- **Domínio Principal:** `https://calculadorair.online`
- **Variante WWW:** Redirect `https://www.calculadorair.online` -> `https://calculadorair.online`
- **Sitemap URL:** `https://calculadorair.online/sitemap.xml`
- **Robots URL:** `https://calculadorair.online/robots.txt`

---

## 2. Google Search Console Status
- **Propriedade de Domínio:** `calculadorair.online` (Domain Property)
- **Status de Verificação:** **VERIFICADO (SUCCESS)** (Verificação DNS TXT concluída em 09/08/2026)
- **Sitemap Submetido:** `https://calculadorair.online/sitemap.xml`

---

## 3. Google Analytics 4 (GA4) Status
- **Property ID:** `549208361` (Account `404042266`)
- **Measurement ID:** `G-KLNEN6LL8G`
- **Variável de Ambiente Vercel:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Production & Preview)
- **Status de Integração:** **ATIVO** (`googletagmanager.com/gtag/js?id=G-KLNEN6LL8G` renderizado no Root Layout)

---

## 4. Inventário de Páginas Indexáveis (Launch Test Set)

| Tipo de Página | Quantidade | Exemplos de Slugs |
| :--- | :---: | :--- |
| **Homepage** | 1 | `/` |
| **Calculadora / Lead** | 1 | `/contador` |
| **Guias / Informacionais** | 4 | `/nova-tabela-imposto-de-renda-2026`, `/isencao-imposto-de-renda-2026`, `/calculadora-irrf-2026`, `/quanto-vou-economizar-imposto-de-renda-2026` |
| **Salários Long-tail** | 16 | `/imposto-de-renda-salario-3000` até `/imposto-de-renda-salario-20000` |
| **TOTAL INDEXÁVEL** | **22** | Todas em `200 OK` com `robots: index, follow` |

---

## 5. Clusters de Páginas

- **Cluster A — Salary Exact:** `/imposto-de-renda-salario-*` (16 páginas)
- **Cluster B — Calculator Intent:** `/` e `/calculadora-irrf-2026`
- **Cluster C — Reform Intent:** `/nova-tabela-imposto-de-renda-2026` e `/quanto-vou-economizar-imposto-de-renda-2026`
- **Cluster D — Exemption Intent:** `/isencao-imposto-de-renda-2026`
