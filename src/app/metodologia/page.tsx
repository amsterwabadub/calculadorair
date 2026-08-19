import type { Metadata } from 'next';
import Link from 'next/link';
import { TAX_RULES_2026, INSS_BRACKETS_2026 } from '@/data/tax-rules-2026';
import { calculateTaxComparison, formatBRL } from '@/lib/tax-calculator';

/**
 * The citable asset.
 *
 * A brand-new calculator domain has nothing a publisher would link to — the
 * calculator itself is not a reference, it is a tool. What a journalist or an
 * accountant can cite is the tables, the formula, the sources and a worked
 * example they can check. That is what this page is, and it is also where the
 * embed snippet lives, so a link back arrives with every embed.
 */
export const metadata: Metadata = {
  title: 'Metodologia e Tabelas do Cálculo IRRF 2026 — Fontes e Fórmulas',
  description:
    'Tabela progressiva do IRRF 2026, tabela do INSS 2026, fórmula do redutor da Lei nº 15.270/2025 e exemplo conferível passo a passo. Livre para citar e incorporar.',
  alternates: { canonical: 'https://calculadorair.online/metodologia' },
};

const EMBED = `<iframe src="https://calculadorair.online/embed" width="100%" height="620"
  style="border:1px solid #e2e8f0;border-radius:12px" loading="lazy"
  title="Calculadora de Imposto de Renda 2026"></iframe>`;

export default function MetodologiaPage() {
  const r26 = TAX_RULES_2026.rules2026;
  const r25 = TAX_RULES_2026.rules2025;
  const example = calculateTaxComparison(6000);
  const pct = (n: number) => `${(n * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
  const lim = (n: number) => (n === Infinity ? 'acima' : formatBRL(n));

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <Link href="/">Início</Link> &gt; <span>Metodologia</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
          Metodologia do cálculo
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', margin: '0.75rem 0 2rem', lineHeight: 1.6 }}>
          Todas as tabelas, a fórmula do redutor, as fontes oficiais e um exemplo que você pode conferir na mão. Se
          alguma coisa aqui estiver errada, o erro está na calculadora também — ela lê exatamente estes valores.
        </p>

        <article className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
            Tabela progressiva mensal — 2026
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--linha)' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Base de cálculo até</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Alíquota</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Parcela a deduzir</th>
                </tr>
              </thead>
              <tbody>
                {r26.brackets.map((b) => (
                  <tr key={String(b.limit)} style={{ borderBottom: '1px solid var(--linha)' }}>
                    <td style={{ padding: '0.55rem 0.5rem', fontVariantNumeric: 'tabular-nums' }}>{lim(b.limit)}</td>
                    <td style={{ padding: '0.55rem 0.5rem' }}>{pct(b.rate)}</td>
                    <td style={{ padding: '0.55rem 0.5rem', fontVariantNumeric: 'tabular-nums' }}>{formatBRL(b.deduction)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '0.9rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Desconto simplificado mensal: <strong>{formatBRL(r26.simplifiedMonthlyDiscount)}</strong> · dedução por
            dependente: <strong>{formatBRL(TAX_RULES_2026.dependentDeduction)}</strong> · tabela de 2025, para
            comparação, tinha isenção até {formatBRL(r25.exemptionCeiling)} e simplificado de{' '}
            {formatBRL(r25.simplifiedMonthlyDiscount)}.
          </p>
        </article>

        <article className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>Tabela do INSS — 2026</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--linha)' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Faixa até</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Alíquota</th>
                </tr>
              </thead>
              <tbody>
                {INSS_BRACKETS_2026.map((b) => (
                  <tr key={String(b.limit)} style={{ borderBottom: '1px solid var(--linha)' }}>
                    <td style={{ padding: '0.55rem 0.5rem', fontVariantNumeric: 'tabular-nums' }}>{lim(b.limit)}</td>
                    <td style={{ padding: '0.55rem 0.5rem' }}>{pct(b.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '0.9rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Aplicada faixa a faixa, não sobre o total. O desconto é limitado pelo teto do salário de contribuição.
          </p>
        </article>

        <article className="card" style={{ padding: '2rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
            O redutor da Lei nº 15.270/2025
          </h2>
          <p style={{ margin: 0 }}>
            <code>redutor = {formatBRL(r26.redutor.baseAmount)} − ({r26.redutor.multiplier} × rendimentos tributáveis)</code>
          </p>
          <p style={{ marginTop: '0.9rem' }}>
            Duas observações que decidem o resultado. Primeira: a base do redutor são os{' '}
            <strong>rendimentos tributáveis</strong> — o salário antes das deduções — e não a base de cálculo já
            deduzida, que é o que a tabela usa. Segunda: o redutor é limitado ao imposto apurado, então nunca gera
            crédito. Ele zera o imposto até {formatBRL(r26.redutor.fullExemptionGrossLimit)} e chega a zero em{' '}
            {formatBRL(r26.redutor.grossUpperLimit)}.
          </p>
        </article>

        <article className="card" style={{ padding: '2rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
            Exemplo conferível — salário de {formatBRL(6000)}
          </h2>
          <ol style={{ paddingLeft: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>INSS progressivo sobre {formatBRL(6000)}: <strong>{formatBRL(example.inssDeduction)}</strong></li>
            <li>Base de cálculo (maior dedução entre completa e simplificada): <strong>{formatBRL(example.taxableIncome)}</strong></li>
            <li>Imposto pela tabela de 2026, antes do redutor: <strong>{formatBRL(example.taxBeforeRedutor)}</strong></li>
            <li>Redutor sobre rendimentos tributáveis de {formatBRL(6000)}: <strong>{formatBRL(example.reducerAmount)}</strong></li>
            <li>IRRF final: <strong>{formatBRL(example.newTax)}</strong> (alíquota efetiva {example.newEffectiveRate}%)</li>
            <li>Salário líquido: <strong>{formatBRL(example.netSalary2026)}</strong></li>
            <li>Pela tabela de 2025 o imposto seria {formatBRL(example.oldTax)} — diferença de <strong>{formatBRL(example.monthlySaving)}</strong>/mês</li>
          </ol>
        </article>

        <article className="card" style={{ padding: '2rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>Incorporar a calculadora</h2>
          <p style={{ marginTop: 0 }}>
            A calculadora pode ser usada livremente em outras páginas. Copie o trecho abaixo; o único pedido é manter o
            link de crédito que já vem incluído.
          </p>
          <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem' }}>
            <code>{EMBED}</code>
          </pre>
        </article>

        <article className="card" style={{ padding: '2rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>Fontes</h2>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TAX_RULES_2026.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            {example.disclaimer}
          </p>
        </article>
      </div>
    </div>
  );
}
