# Calculadora Imposto de Renda 2026 — Brazil IR Validation MVP

Aplicação web mobile-first de alta performance construída em **Next.js (App Router)** e **TypeScript** para calcular a economia de Imposto de Renda (IRRF) trazida pela reforma tributária da **Lei nº 15.270/2025** em 2026.

---

## 🚀 Tecnologias

- **Framework:** Next.js 15 (App Router, SSG/SSR)
- **Linguagem:** TypeScript
- **Estilização:** Vanilla CSS Design System (High-contrast financial utility)
- **Testes:** Vitest
- **SEO & Metadados:** Dynamic Sitemap, Robots.txt, JSON-LD (WebApplication, FAQPage, BreadcrumbList)
- **Analytics:** Abstração de eventos sem PII (`calculator_start`, `calculator_complete`, `accountant_cta_click`)

---

## 📁 Estrutura do Projeto

```text
├── src/
│   ├── app/
│   │   ├── [slug]/page.tsx       # Páginas estáticas de salários (16 long-tails) e guias (4 artigos)
│   │   ├── contador/page.tsx     # Página de captura de leads para contadores
│   │   ├── globals.css           # Design system e temas CSS
│   │   ├── layout.tsx            # Root layout com metadados e navegação
│   │   ├── page.tsx              # Homepage com Calculadora principal e FAQ
│   │   ├── robots.ts             # Configuração robots.txt
│   │   └── sitemap.ts            # Dynamic sitemap generator
│   ├── components/
│   │   ├── Calculator.tsx        # Calculadora interativa client-side
│   │   ├── Footer.tsx            # Rodapé institucional com links legais
│   │   ├── Header.tsx            # Cabecalho e marca
│   │   └── TrustBanner.tsx       # Transparência e fontes oficiais
│   ├── data/
│   │   └── tax-rules-2026.ts     # Parâmetros e fontes da Receita Federal
│   └── lib/
│       ├── analytics.ts          # Abstração de métricas de uso
│       └── tax-calculator.ts     # Motor de cálculo tributário 2026 vs 2025
├── TAX_RULES.md                  # Documentação das regras fiscais
├── SEO-LAUNCH-CHECKLIST.md       # Checklist pós-deploy no Search Console
├── VALIDATION.md                 # Critérios de validação e métricas
└── README.md
```

---

## 🧪 Comandos Disponíveis

- **Desenvolvimento:** `npm run dev`
- **Testes Unitários:** `npm test`
- **Checagem de Tipos:** `npm run typecheck`
- **Linting:** `npm run lint`
- **Build de Produção:** `npm run build`
- **Executar Produção:** `npm start`
