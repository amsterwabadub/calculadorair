# LONGTAIL-EXPANSION.md — Regras de Expansão de Cauda Longa

Diretrizes automáticas baseadas em evidências de busca para expansão controlada de páginas salariais sem criação de conteúdo ralo (*thin content*).

---

## 1. Conjunto Inicial de Teste (16 Páginas)
As 16 páginas atuais servem como amostra de calibração para identificar quais faixas salariais atram demanda orgânica real no Google.

---

## 2. Critérios de Decisão (Decision Rules)

### 🟢 Regra de EXPANSÃO (Expand)
Expandir apenas quando uma página salarial existente no Search Console apresentar:
1. **Impressões Reais:** `> 50 impressões/semana` em consultas com intenção salarial explícita.
2. **Consultas Relevantes:** Aparecimento de variação exata (ex: *"quem ganha 7200 paga quanto ir 2026"*).
3. **Posicionamento Médio:** Posição média **Top 50** ou superior.
4. **Trajetória Positiva:** Tendência de subida nas posições semanais.

**Ação ao Expandir:**
Gerar páginas intermediárias nos arredores da faixa comprovada.
*Exemplo:* Se `/imposto-de-renda-salario-7000` recebe buscas por 6.800 ou 7.200, criar `/imposto-de-renda-salario-6800`, `/imposto-de-renda-salario-7200`.

---

### 🔴 Regra de NÃO EXPANSÃO (Do Not Expand)
NÃO criar novas páginas se o padrão salarial apresentar:
- Impressões aproximadas a zero após 30 dias de indexação.
- Consultas irrelevantes ou ausência de termos numéricos no Search Console.
- Páginas não indexadas por falta de utilidade única.

*Princípio:* Nunca gerar dezenas de páginas genéricas sem sinal prévio de demanda no Search Console.
