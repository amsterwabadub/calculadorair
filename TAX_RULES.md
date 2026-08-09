# TAX_RULES.md — Metodologia e Parâmetros de Cálculo IR 2026

Este documento contém a especificação formal e as fontes primárias utilizadas no motor de cálculo do Imposto de Renda 2026.

## 1. Fonte Primária Oficial
- **Lei nº 15.270/2025**: Altera os valores da tabela progressiva mensal do Imposto sobre a Renda da Pessoa Física (IRPF).
- **Portal Receita Federal / gov.br**:
  - `https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/tributacao-de-2026`
  - `https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/tributacao-de-2025`

**Data da última revisão:** 8 de agosto de 2026.
**Data de entrada em vigor:** 1º de janeiro de 2026.

---

## 2. Parâmetros Gerais e Fórmulas

### 2.1 Desconto do INSS (Progressivo CLT 2025/2026)
Antes da apuração do IRRF, calcula-se o desconto do INSS sobre o salário bruto:
- **Até R$ 1.412,00:** 7,5%
- **De R$ 1.412,01 até R$ 2.666,68:** 9,0%
- **De R$ 2.666,69 até R$ 4.000,03:** 12,0%
- **De R$ 4.000,04 até R$ 7.786,02 (Teto INSS):** 14,0%

---

### 2.2 Tabela Progressiva Padrão (Base 2024/2025)
Aplicada sobre a base tributável (`Salário Bruto - INSS - Deduções`):

| Base de Cálculo (R$) | Alíquota | Parcela a Deduzir (R$) |
| :--- | :--- | :--- |
| Até 2.259,20 | 0,00% | R$ 0,00 |
| De 2.259,21 até 2.826,65 | 7,50% | R$ 169,44 |
| De 2.826,66 até 3.751,05 | 15,00% | R$ 381,44 |
| De 3.751,06 até 4.664,68 | 22,50% | R$ 662,77 |
| Acima de 4.664,68 | 27,50% | R$ 896,00 |

Optionally, o contribuinte pode optar pelo **Desconto Simplificado Mensal** de **R$ 564,80** se for mais vantajoso.

---

### 2.3 Regras de Isenção e Redutor Adicional 2026 (Lei nº 15.270/2025)

1. **Faixa 1 — Isenção Total (Até R$ 5.000,00 tributáveis):**
   - Imposto devido em 2026 = **R$ 0,00**.
   - Benefício: Total Isenção retida na fonte.

2. **Faixa 2 — Redução Gradual (De R$ 5.000,01 a R$ 7.350,00 tributáveis):**
   - Imposto base = `(Base Tributável * Alíquota Tabela) - Parcela a Deduzir`.
   - Redutor Adicional = `R$ 978,62 - (0,133145 * Base Tributável)`.
   - Imposto Final 2026 = `Math.max(0, Imposto Base - Redutor Adicional)`.

3. **Faixa 3 — Acima do Teto do Benefício (Acima de R$ 7.350,00 tributáveis):**
   - Imposto Final 2026 = `Imposto Base Tabela Padrão`.
   - O redutor adicional zera e o benefício não se aplica a esta faixa.

---

## 3. Simplificações e Premissas do MVP
- O cálculo considera o padrão para trabalhador assalariado CLT com 13 salários anuais.
- Deduções por dependente utilizam o valor legal fixo de R$ 189,59/mês.
- Este simulador é estritamente informativo e não substitui o programa oficial IRPF da Receita Federal.
