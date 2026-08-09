# UNIT-ECONOMICS.md — Modelo de Unit Economics & CPL Máximo por Lead

Modelagem financeira e cenários de valor por lead (Cost Per Lead - CPL) para os serviços de declaração do Imposto de Renda 2026.

---

## 1. Cenários de Preço do Serviço (Average Order Value - AOV)

- **Ticket Baixo (Preço R$ 200,00):** Declaração simplificada IRPF para assalariados CLT.
- **Ticket Médio (Preço R$ 300,00):** Declaração padrão com dependentes, despesas médicas e educação.
- **Ticket Alto (Preço R$ 500,00):** Declaração complexa com investimentos em bolsa, imóveis, criptoativos ou malha fina.

---

## 2. Cenários de Margem do Parceiro (Partner Gross Margin / Lead Budget)

- **LOW (30% Margem destinada a marketing/leads):** O parceiro aceita investir 30% do ticket bruto em aquisição de clientes.
- **BASE (50% Margem destinada a marketing/leads):** O parceiro aceita investir 50% do ticket bruto em aquisição de clientes.
- **HIGH (70% Margem destinada a marketing/leads):** O parceiro aceita investir 70% do ticket bruto para ganhar escala.

---

## 3. Matriz de CPL Máximo por Lead Qualificado (R$)

O CPL máximo que o parceiro pode pagar por lead é calculado por:
$$\text{CPL Máximo} = \text{Preço do Serviço (AOV)} \times \text{Margem de Aquisição (\%)} \times \text{Taxa de Conversão Lead } \to \text{ Venda (\%)}$$

### Tabela 1 — Ticket R$ 200,00 (Declaração Simplificada)

| Taxa de Conversão Lead → Venda | LOW (30% Margem / R$ 60 por Venda) | BASE (50% Margem / R$ 100 por Venda) | HIGH (70% Margem / R$ 140 por Venda) |
| :-: | :-: | :-: | :-: |
| **5% Conversão** (1 venda a cada 20 leads) | **R$ 3,00** / lead | **R$ 5,00** / lead | **R$ 7,00** / lead |
| **10% Conversão** (1 venda a cada 10 leads) | **R$ 6,00** / lead | **R$ 10,00** / lead | **R$ 14,00** / lead |
| **20% Conversão** (1 venda a cada 5 leads) | **R$ 12,00** / lead | **R$ 20,00** / lead | **R$ 28,00** / lead |
| **30% Conversão** (1 venda a cada 3,3 leads) | **R$ 18,00** / lead | **R$ 30,00** / lead | **R$ 42,00** / lead |

---

### Tabela 2 — Ticket R$ 300,00 (Declaração Padrão / Recomendada)

| Taxa de Conversão Lead → Venda | LOW (30% Margem / R$ 90 por Venda) | BASE (50% Margem / R$ 150 por Venda) | HIGH (70% Margem / R$ 210 por Venda) |
| :-: | :-: | :-: | :-: |
| **5% Conversão** (1 venda a cada 20 leads) | **R$ 4,50** / lead | **R$ 7,50** / lead | **R$ 10,50** / lead |
| **10% Conversão** (1 venda a cada 10 leads) | **R$ 9,00** / lead | **R$ 15,00** / lead | **R$ 21,00** / lead |
| **20% Conversão** (1 venda a cada 5 leads) | **R$ 18,00** / lead | **R$ 30,00** / lead | **R$ 42,00** / lead |
| **30% Conversão** (1 venda a cada 3,3 leads) | **R$ 27,00** / lead | **R$ 45,00** / lead | **R$ 63,00** / lead |

---

### Tabela 3 — Ticket R$ 500,00 (Declaração Complexa / Investimentos)

| Taxa de Conversão Lead → Venda | LOW (30% Margem / R$ 150 por Venda) | BASE (50% Margem / R$ 250 por Venda) | HIGH (70% Margem / R$ 350 por Venda) |
| :-: | :-: | :-: | :-: |
| **5% Conversão** (1 venda a cada 20 leads) | **R$ 7,50** / lead | **R$ 12,50** / lead | **R$ 17,50** / lead |
| **10% Conversão** (1 venda a cada 10 leads) | **R$ 15,00** / lead | **R$ 25,00** / lead | **R$ 35,00** / lead |
| **20% Conversão** (1 venda a cada 5 leads) | **R$ 30,00** / lead | **R$ 50,00** / lead | **R$ 70,00** / lead |
| **30% Conversão** (1 venda a cada 3,3 leads) | **R$ 45,00** / lead | **R$ 75,00** / lead | **R$ 105,00** / lead |

---

## 4. Projeção de Valor por Visitante Orgânico (Revenue Per Organic Visitor - RPOV)

Considerando o funil orgânico do `calculadorair.online`:
- **CTR de Conversão da Página Orgânica → Lead Form Submit:** `1,5%`
- **Ticket Médio:** `R$ 300,00`
- **Comissão do Plataforma (CPA 30%):** `R$ 90,00` por venda realizada
- **Taxa de Conversão Lead → Venda do Parceiro:** `15%`

$$\text{RPOV} = 1 \text{ visitante orgânico} \times 1,5\% \text{ (taxa de lead)} \times 15\% \text{ (taxa de venda)} \times \text{R\$ } 90,00 = \text{R\$ } 0,2025 \text{ por visitante orgânico}$$

Para **10.000 visitantes orgânicos/mês**:
- **Leads Gerados:** 150 leads/mês
- **Vendas Concluídas:** 22,5 vendas/mês
- **Receita Bruta Gerada (Gross):** R$ 6.750,00/mês
- **Receita Líquida Plataforma (Net):** **R$ 2.025,00/mês**
