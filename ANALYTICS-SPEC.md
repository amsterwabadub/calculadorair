# ANALYTICS-SPEC.md — Especificação do Funil de Conversão e Métricas

Matriz de acompanhamento do funil de conversão e eventos da aplicação.

---

## 1. Tabela de Métricas por Camada

| Camada | Métrica / Evento | Fonte dos Dados | Descrição / Propriedades |
| :--- | :--- | :--- | :--- |
| **Aquisição** | `Organic Users` | GA4 | Usuários vindos de `google / organic`. |
| | `Search Console Clicks` | Google Search Console | Cliques orgânicos nos resultados da busca. |
| | `Search Console Impressions` | Google Search Console | Exibições no SERP. |
| **SEO** | `Indexed Pages` | Search Console | Páginas no índice do Google (Sitemap). |
| | `Average Position & CTR` | Search Console | Posição média por consulta salarial. |
| **Produto** | `calculator_start` | GA4 Event | Primeiro input válido do usuário no simulador. |
| | `calculator_complete` | GA4 Event | Cálculo concluído (`salary_band`, `monthly_saving_band`, `benefit_type`). |
| | `Completion Rate` | Calculado no GA4 | `calculator_complete / calculator_start`. |
| **Monetização**| `accountant_cta_view` | GA4 Event | Visualização da oferta de contador parceiro. |
| | `accountant_cta_click` | GA4 Key Event (Conversão)| Clique no botão *"Encontrar um contador"* (`source_page`, `salary_band`). |

---

## 2. Funil Skewed (End-to-End Funnel)

```text
Google Organic Search
  └── Landing Page (Homepage ou Salary Long-tail)
        └── calculator_start (Primeira interação no input)
              └── calculator_complete (Resultado exibido com economia)
                    └── accountant_cta_click (Intenção de contratação de contador)
```

---

## 3. Configuração de Key Event no GA4 (Manual Step)

Para marcar `accountant_cta_click` como **Key Event (Conversão)** no Google Analytics 4:
1. Acesse o painel do **Google Analytics 4**.
2. Vá em **Administrador (Admin)** > **Exibição de Dados (Data Display)** > **Eventos (Events)**.
3. Localize o evento `accountant_cta_click` na lista.
4. Ative a chave **"Marcar como evento principal" (Mark as Key Event)**.
