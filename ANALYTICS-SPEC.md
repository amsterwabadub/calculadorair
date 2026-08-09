# ANALYTICS-SPEC.md — Especificação do Funil de Conversão e Métricas

Matriz de acompanhamento do funil de conversão end-to-end e atribuição de receita do `calculadorair.online`.

---

## 1. Tabela de Métricas por Camada

| Camada | Métrica / Evento | Fonte dos Dados | Descrição / Propriedades |
| :--- | :--- | :--- | :--- |
| **Aquisição** | `Organic Users` | GA4 / Atribuição | Usuários vindos de `google / organic`. |
| | `Search Console Clicks` | Google Search Console | Cliques orgânicos nos resultados da busca. |
| | `Search Console Impressions` | Google Search Console | Exibições no SERP. |
| **SEO** | `Indexed Pages` | Search Console | Páginas no índice do Google (Sitemap). |
| | `Average Position & CTR` | Search Console | Posição média por consulta salarial. |
| **Engajamento** | `calculator_start` | GA4 Event | Primeiro input válido do usuário no simulador. |
| | `calculator_complete` | GA4 Secondary Key Event | Cálculo concluído (`salary_band`, `monthly_saving_band`, `benefit_type`). |
| | `Completion Rate` | Calculado no GA4 | `calculator_complete / calculator_start`. |
| **Interesse** | `accountant_cta_view` | GA4 Event | Visualização do card/oferta de contador especialista. |
| | `accountant_cta_click` | GA4 Primary Key Event | Clique para saber mais / ir para o formulário (`source_page`, `salary_band`). |
| **Monetização**| `lead_form_view` | GA4 Event | Visualização da página `/contador` com o formulário de cadastro. |
| | `lead_form_start` | GA4 Event | Primeiro foco/preenchimento nos campos do formulário. |
| | `lead_submit` | GA4 Primary Key Event | Formulário enviado com sucesso (`lead_type`, `source_page`, `landing_cluster`). |
| | `qualified_lead` | GA4 Event / Backend | Lead validado que atende aos critérios do parceiro. |
| | `lead_sent` | GA4 Event / Backend | Lead encaminhado para o escritório parceiro (`partner`). |
| | `purchase / revenue` | Backend / Painel | Venda confirmada pelo parceiro com valor e comissão (`revenue`, `commission_revenue`). |

---

## 2. Funil Skewed (End-to-End Funnel)

```text
Google Organic Search
  └── Landing Page (Homepage ou Salary Long-tail)
        └── calculator_start (Primeira interação no input)
              └── calculator_complete (Resultado exibido com economia)
                    └── accountant_cta_view (Oferta exibida)
                          └── accountant_cta_click (Clique no CTA)
                                └── lead_form_start (Início do preenchimento)
                                      └── lead_submit (Envio do formulário + Atribuição)
                                            └── qualified_lead (Qualificação pelo painel/API)
                                                  └── lead_sent (Encaminhamento para o parceiro)
                                                        └── sale / revenue (Fechamento e receita)
```

---

## 3. Configuração de Key Events no GA4 UI (Manual Step)

Para configurar os **Key Events (Eventos Principais / Conversões)** no Google Analytics 4:

### Key Events Primários (Monetização)
1. **`lead_submit`** — Envio do formulário de solicitação de contato.
2. **`accountant_cta_click`** — Clique no botão de CTA para atendimento com contador.

### Key Event Secundário (Engajamento)
3. **`calculator_complete`** — Conclusão da simulação do Imposto de Renda.

#### Passo a passo no painel do GA4:
1. Acesse **Administrador (Admin)** > **Exibição de Dados (Data Display)** > **Eventos (Events)**.
2. Na lista de eventos, localize `lead_submit`, `accountant_cta_click` e `calculator_complete`.
3. Ative a opção **"Marcar como evento principal" (Mark as Key Event)** para cada um deles.
