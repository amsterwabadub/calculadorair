# VALIDATION.md — Estratégia de Validação da Hipótese SEO

Documento de acompanhamento dos sinais primários e critérios de decisão (Decision Gates) para a validação orgânica da reforma do Imposto de Renda 2026 no Brasil.

---

## 1. Hipótese Principal
> Trabalhadores brasileiros que buscam no Google pelo valor exato da sua economia no Imposto de Renda 2026 converterão via páginas long-tail salariais e utilizarão a calculadora interativa mobile-first.

---

## 2. Sinais Primários (NÃO medir receita imediata)

1. **Indexação Orgânica:** Taxa de páginas indexadas pelo Google (Sitemap indexation rate).
2. **Impressões no Search Console:** Aparição inicial de impressões para buscas salariais em pt-BR.
3. **Descoberta de Consultas:** Queries de cauda longa ("quem ganha 6000 paga quanto irrf 2026").
4. **Trajetória de Ranking:** Posição média das páginas salariais no SERP (evolução para top 30-50).
5. **Engajamento da Calculadora:** Razão `calculator_complete / calculator_start`.
6. **Intenção de Monetização:** Cliques no CTA do contador (`accountant_cta_click / calculator_complete`).

---

## 3. Decision Gates (Portões de Decisão)

### 🟢 Strong Positive (Avançar e Expandir)
- As páginas entram no índice do Google em menos de 7-14 dias.
- O Search Console registra impressões crescentes para termos salariais específicos.
- O engajamento com a calculadora (`calculator_complete`) supera 60%.
- Há taxa relevante de clique no CTA para contador parceiro (`> 2-5%`).

### 🟡 Weak (Ajustar SEO / Re-otimizar)
- As páginas são indexadas, mas recebem pouca impressão orgânica.
- Ação: Ajustar H1s, acrescentar FAQ interno e criar links adicionais entre faixas.

### 🔴 Kill (Interromper o Experimento)
- Nenhum sinal de impressão orgânica após período razoável de indexação.
- SERP dominada 100% por portais governamentais com zero-click SERP features.
- Nenhuma busca por "quanto economizo no imposto de renda 2026".
