# SEO-BASELINE.md — Launch Baseline State

Data de lançamento do domíno de produção: **9 de agosto de 2026**.

## 1. Origem Única de Produção
- **Domínio Principal:** `https://calculadorair.online`
- **Variante WWW:** Redirect `https://www.calculadorair.online` -> `https://calculadorair.online`
- **Sitemap URL:** `https://calculadorair.online/sitemap.xml`
- **Robots URL:** `https://calculadorair.online/robots.txt`

---

## 2. Inventário de Páginas Indexáveis (Launch Test Set)

| Tipo de Página | Quantidade | Exemplos de Slugs |
| :--- | :---: | :--- |
| **Homepage** | 1 | `/` |
| **Calculadora / Lead** | 1 | `/contador` |
| **Guias / Informacionais** | 4 | `/nova-tabela-imposto-de-renda-2026`, `/isencao-imposto-de-renda-2026`, `/calculadora-irrf-2026`, `/quanto-vou-economizar-imposto-de-renda-2026` |
| **Salários Long-tail** | 16 | `/imposto-de-renda-salario-3000` até `/imposto-de-renda-salario-20000` |
| **TOTAL INDEXÁVEL** | **22** | Todas em `200 OK` com `robots: index, follow` |

---

## 3. Clusters de Páginas

- **Cluster A — Salary Exact:** `/imposto-de-renda-salario-*` (16 páginas)
- **Cluster B — Calculator Intent:** `/` e `/calculadora-irrf-2026`
- **Cluster C — Reform Intent:** `/nova-tabela-imposto-de-renda-2026` e `/quanto-vou-economizar-imposto-de-renda-2026`
- **Cluster D — Exemption Intent:** `/isencao-imposto-de-renda-2026`

---

## 4. Status de Integrações

- **Google Analytics 4:** Código de integração ativo via `@next/third-parties/google` ou Google Tag script em `src/components/GoogleAnalytics.tsx`. Ativado dinamicamente quando a variável `NEXT_PUBLIC_GA_MEASUREMENT_ID` é configurada.
- **Search Console:** Propriedade configurada para o domínio `calculadorair.online` com sitemap enviado.
