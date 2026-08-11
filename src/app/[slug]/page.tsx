import { notFound } from 'next/navigation';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import TrustBanner from '@/components/TrustBanner';
import { calculateTaxComparison, formatBRL } from '@/lib/tax-calculator';
import { TAX_RULES_2026 } from '@/data/tax-rules-2026';

import { SALARY_VALUES, SALARY_BY_SLUG, salarySlug } from '@/data/salary-pages';

// Guide pages data definitions
const GUIDE_PAGES: Record<string, { title: string; description: string }> = {
  'nova-tabela-imposto-de-renda-2026': {
    title: 'Nova Tabela Imposto de Renda 2026 — Alíquotas e Faixas Completas',
    description: 'Confira a nova tabela progressiva do Imposto de Renda 2026 (Lei nº 15.270/2025). Entenda a faixa de isenção até R$ 5.000,00 e a fórmula do redutor gradual.',
  },
  'isencao-imposto-de-renda-2026': {
    title: 'Isenção do Imposto de Renda 2026 até R$ 5.000 — Quem Tem Direito?',
    description: 'Entenda como funciona a isenção do Imposto de Renda para quem ganha até R$ 5.000 em 2026. Regras oficiais, critérios da Receita Federal e impactos no salário.',
  },
  'calculadora-irrf-2026': {
    title: 'Calculadora IRRF 2026 — Simulação de Imposto de Renda Retido na Fonte',
    description: 'Calcule o Imposto de Renda Retido na Fonte (IRRF) em 2026 com o desconto oficial do INSS e a nova tabela da Lei 15.270/2025.',
  },
  'quanto-vou-economizar-imposto-de-renda-2026': {
    title: 'Quanto Vou Economizar no Imposto de Renda em 2026? Guia Comparativo',
    description: 'Descubra exatamente quanto dinheiro vai sobrar no seu bolso por mês e por ano com a reforma do Imposto de Renda 2026 comparando a tabela antiga com a nova.',
  },
};

const SALARY_LIST = [...SALARY_VALUES].sort((a, b) => a - b);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const salarySlugs = SALARY_VALUES.map((s) => ({ slug: salarySlug(s) }));
  const guideSlugs = Object.keys(GUIDE_PAGES).map((slug) => ({ slug }));
  return [...salarySlugs, ...guideSlugs];
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Check guide page
  if (GUIDE_PAGES[slug]) {
    const guide = GUIDE_PAGES[slug];
    return {
      title: guide.title,
      description: guide.description,
      alternates: { canonical: `https://calculadorair.online/${slug}` },
      openGraph: {
        title: guide.title,
        description: guide.description,
        url: `https://calculadorair.online/${slug}`,
      },
    };
  }

  // Check salary page
  const salaryFromSlug = SALARY_BY_SLUG[slug];
  if (salaryFromSlug !== undefined) {
    const salary = salaryFromSlug;
    const calc = calculateTaxComparison(salary);
    const savingText = calc.monthlySaving > 0 ? `Economia de ${formatBRL(calc.monthlySaving)}/mês` : 'Cálculo completo 2026';

    const pageTitle = `Imposto de Renda para Salário de R$ ${salary.toLocaleString('pt-BR')} em 2026 — ${savingText}`;
    const pageDesc = `Quem ganha R$ ${salary.toLocaleString('pt-BR')} paga quanto de Imposto de Renda em 2026? Imposto anterior: ${formatBRL(calc.oldTax)}. Novo imposto: ${formatBRL(calc.newTax)}. Economia anual: ${formatBRL(calc.annualSaving12Months)}.`;

    return {
      title: pageTitle,
      description: pageDesc,
      alternates: { canonical: `https://calculadorair.online/${slug}` },
      openGraph: {
        title: pageTitle,
        description: pageDesc,
        url: `https://calculadorair.online/${slug}`,
      },
    };
  }

  return { title: 'Página Não Encontrada' };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Render Guide Page
  if (GUIDE_PAGES[slug]) {
    const guide = GUIDE_PAGES[slug];
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container-narrow">
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <Link href="/">Início</Link> &gt; <span>{guide.title}</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1rem' }}>
            {guide.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            {guide.description}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <TrustBanner />
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              Simular seu salário na nova lei de 2026
            </h2>
            <Calculator autoFocus={false} />
          </div>

          <article className="card" style={{ padding: '2rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2>Como funciona a reforma do Imposto de Renda em 2026</h2>
            <p>
              A Lei nº 15.270/2025 reformulou o Imposto de Renda Retido na Fonte (IRRF) a partir de 1º de janeiro de 2026. O objetivo principal foi zerar a retenção para quem recebe até R$ 5.000,00 brutos por mês e criar uma transição suave para as faixas seguintes.
            </p>
            <h3>Como o cálculo funciona</h3>
            <ol>
              <li>
                <strong>Base de cálculo:</strong> salário bruto menos INSS, dependentes e demais deduções legais — ou menos o desconto simplificado de R$ 607,20, quando este for maior.
              </li>
              <li>
                <strong>Imposto pela tabela de 2026:</strong> a tabela progressiva incide sobre essa base, com isenção até R$ 2.428,80 e alíquotas de 7,5% a 27,5%.
              </li>
              <li>
                <strong>Redutor:</strong> calculado sobre o <strong>rendimento bruto mensal</strong>, e não sobre a base de cálculo, pela fórmula `R$ 978,62 - (0,133145 x rendimento bruto)`. Ele é subtraído do imposto apurado e nunca o ultrapassa.
              </li>
            </ol>
            <h3>Faixas do redutor (sobre o salário bruto)</h3>
            <ul>
              <li><strong>Até R$ 5.000,00:</strong> o redutor anula todo o imposto apurado — retenção de R$ 0,00.</li>
              <li><strong>De R$ 5.000,01 a R$ 7.350,00:</strong> redutor decrescente, de R$ 312,89 até zero.</li>
              <li><strong>Acima de R$ 7.350,00:</strong> sem redutor; vale apenas a tabela progressiva de 2026.</li>
            </ul>

            <div style={{ background: 'var(--color-emerald-bg)', border: '1px solid var(--color-emerald-border)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
              <strong>Dica de Economia:</strong> Para saber exatamente o efeito no seu contracheque, utilize nossa calculadora interativa no topo desta página.
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Render Salary Page
  const salaryFromSlug = SALARY_BY_SLUG[slug];
  if (salaryFromSlug === undefined) {
    notFound();
  }

  const salary = salaryFromSlug;
  const calc = calculateTaxComparison(salary);

  // Find adjacent salary pages
  const currentIndex = SALARY_LIST.indexOf(salary);
  const prevSalary = currentIndex > 0 ? SALARY_LIST[currentIndex - 1] : null;
  const nextSalary = currentIndex < SALARY_LIST.length - 1 ? SALARY_LIST[currentIndex + 1] : null;

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://calculadorair.online' },
      { '@type': 'ListItem', position: 2, name: `Salário R$ ${salary.toLocaleString('pt-BR')}`, item: `https://calculadorair.online/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div style={{ padding: '2rem 0' }}>
        <div className="container-narrow">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <Link href="/">Início</Link> &gt; <span>Salário R$ {salary.toLocaleString('pt-BR')}</span>
          </div>

          {/* Main Title & Hero */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-reducao" style={{ marginBottom: '0.5rem' }}>
              Simulação Salarial IRRF 2026
            </span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-brand-primary)', lineHeight: '1.2' }}>
              Quanto paga de Imposto de Renda quem ganha R$ {salary.toLocaleString('pt-BR')} em 2026?
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Veja a comparação exata entre a regra antiga e a nova lei de isenção/redutor do Imposto de Renda.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <TrustBanner />
          </div>

          {/* Quick Summary Cards */}
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>IMPOSTO ANTERIOR</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
                {formatBRL(calc.oldTax)} <span style={{ fontSize: '0.8rem' }}>/mês</span>
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center', borderColor: 'var(--color-emerald-border)', backgroundColor: 'var(--color-emerald-bg)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald-text)', fontWeight: 700 }}>NOVO IMPOSTO (2026)</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-emerald-heading)', marginTop: '0.25rem' }}>
                {formatBRL(calc.newTax)} <span style={{ fontSize: '0.8rem' }}>/mês</span>
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>SUA ECONOMIA MENSAL</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand-accent)', marginTop: '0.25rem' }}>
                {formatBRL(calc.monthlySaving)} <span style={{ fontSize: '0.8rem' }}>/mês</span>
              </div>
            </div>
          </div>

          {/* Pre-filled Interactive Calculator */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-brand-primary)' }}>
              Simulador Interativo para R$ {salary.toLocaleString('pt-BR')}
            </h2>
            <Calculator initialSalary={salary} />
          </div>

          {/* Step by Step Breakdown Article */}
          <article className="card" style={{ padding: '2rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
            <h2>Demonstrativo do Cálculo para Salário de R$ {salary.toLocaleString('pt-BR')}</h2>
            <p>
              Para um trabalhador registrado sob o regime CLT com salário bruto mensal de <strong>{formatBRL(salary)}</strong>, o cálculo do Imposto de Renda Retido na Fonte (IRRF) em 2026 segue os seguintes passos formais:
            </p>

            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <strong>Desconto do INSS:</strong> Sobre o salário bruto de {formatBRL(salary)}, o desconto progressivo do INSS de 2026 é de <strong>{formatBRL(calc.inssDeduction)}</strong>.
              </li>
              <li>
                <strong>Base de cálculo em 2026:</strong> Aplicando a maior dedução entre o INSS e o desconto simplificado de {formatBRL(TAX_RULES_2026.rules2026.simplifiedMonthlyDiscount)}, a base de cálculo é de <strong>{formatBRL(calc.taxableIncome)}</strong>.
              </li>
              <li>
                <strong>Imposto pela tabela de 2025:</strong> Pela regra anterior, com base de cálculo de {formatBRL(calc.oldTaxableIncome)}, o imposto seria de <strong>{formatBRL(calc.oldTax)}</strong> (alíquota efetiva de {calc.oldEffectiveRate}%).
              </li>
              <li>
                <strong>Imposto pela tabela de 2026:</strong> Antes do redutor, a tabela de 2026 apura <strong>{formatBRL(calc.taxBeforeRedutor)}</strong>.
              </li>
              <li>
                <strong>Redutor da Lei nº 15.270/2025:</strong>{' '}
                {calc.reducerAmount > 0 ? (
                  <>
                    O redutor incide sobre o <strong>rendimento bruto</strong> de {formatBRL(salary)} e vale <strong>{formatBRL(calc.reducerAmount)}</strong>, limitado ao imposto apurado. O IRRF final fica em <strong>{formatBRL(calc.newTax)}</strong> (alíquota efetiva de {calc.newEffectiveRate}%).
                  </>
                ) : (
                  <>
                    Não há redutor: ele só se aplica a rendimentos brutos mensais de até {formatBRL(TAX_RULES_2026.rules2026.redutor.grossUpperLimit)}. O IRRF final fica em <strong>{formatBRL(calc.newTax)}</strong> (alíquota efetiva de {calc.newEffectiveRate}%).
                  </>
                )}
              </li>
              <li>
                <strong>Diferença no bolso:</strong>{' '}
                {calc.monthlySaving > 0 ? (
                  <>
                    Você paga <strong>{formatBRL(calc.monthlySaving)} a menos por mês</strong>, o que representa <strong>{formatBRL(calc.annualSaving12Months)} no ano</strong> (ou {formatBRL(calc.annualSaving13Months)} considerando o 13º salário).
                  </>
                ) : (
                  <>Neste salário as regras de 2026 resultam no mesmo imposto de 2025.</>
                )}
              </li>
            </ol>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-brand-accent)' }}>
              <strong>📌 Resumo da Faixa Salarial:</strong> {calc.explanation}
            </div>
          </article>

          {/* Internal Links Navigation */}
          <section className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Navegue por outras faixas salariais próximas
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              {prevSalary ? (
                <Link href={`/${salarySlug(prevSalary)}`} className="btn btn-outline">
                  ← Salário R$ {prevSalary.toLocaleString('pt-BR')}
                </Link>
              ) : (
                <span />
              )}
              <Link href="/" className="btn btn-primary">
                📊 Calculadora Principal
              </Link>
              {nextSalary ? (
                <Link href={`/${salarySlug(nextSalary)}`} className="btn btn-outline">
                  Salário R$ {nextSalary.toLocaleString('pt-BR')} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
