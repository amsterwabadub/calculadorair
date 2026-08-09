# SEO-LAUNCH-CHECKLIST.md — Post-Deploy Launch Verification

Este checklist orienta as etapas manuais pós-deploy no Vercel/Hosting para vincular o domínio ao Google Search Console e acelerar a indexação orgânica.

---

## 1. Verificação Pré-Submissão
- [x] Canonical tags configuradas em todas as páginas (`https://calculadorair2026.com.br/...`).
- [x] Dynamic Sitemap em `/sitemap.xml` incluindo a homepage, 16 salary long-tail pages, 4 guia pages e `/contador`.
- [x] Configuração em `/robots.txt` apontando para o sitemap e liberando o agente `*`.
- [x] HTML renderizado no servidor (SSR/SSG) sem dependência crítica de JS para leitura por crawlers.
- [x] Schema.org `WebApplication`, `FAQPage` e `BreadcrumbList` em JSON-LD.

---

## 2. Passo a Passo no Google Search Console

1. **Adicionar Propriedade:**
   - Acesse [Google Search Console](https://search.google.com/search-console).
   - Adicione o domínio `calculadorair2026.com.br` (via DNS TXT record ou HTML tag).

2. **Submeter Sitemap:**
   - Navegue até a aba **Sitemaps**.
   - Envie a URL: `https://calculadorair2026.com.br/sitemap.xml`.
   - Confirme o status: *Sucesso (Success)*.

3. **Inspecionar e Solicitar Indexação de URLs Chave:**
   - Inspecionar a Homepage: `https://calculadorair2026.com.br/` -> clicar em *Request Indexing*.
   - Inspecionar top salary pages:
     - `/imposto-de-renda-salario-5000`
     - `/imposto-de-renda-salario-6000`
     - `/imposto-de-renda-salario-7000`
     - `/nova-tabela-imposto-de-renda-2026`

4. **Monitorar Métricas Iniciais:**
   - Acompanhar aba *Performance*: controlar aparição de impressões orgânicas para queries em pt-BR ("quem ganha 5000 paga quanto ir 2026", "calculadora irrf 2026").
