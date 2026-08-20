import { notFound } from 'next/navigation';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import TrustBanner from '@/components/TrustBanner';
import { calculateTaxComparison, formatBRL } from '@/lib/tax-calculator';
import { TAX_RULES_2026 } from '@/data/tax-rules-2026';

import { SALARY_VALUES, SALARY_BY_SLUG, salarySlug } from '@/data/salary-pages';
import { GUIDE_PAGES, GUIDE_SLUGS } from '@/data/guide-pages';


const SALARY_LIST = [...SALARY_VALUES].sort((a, b) => a - b);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const salarySlugs = SALARY_VALUES.map((s) => ({ slug: salarySlug(s) }));
  const guideSlugs = GUIDE_SLUGS.map((slug) => ({ slug }));
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
    // The title mirrors how the query is actually typed ("quem ganha X paga quanto
    // de imposto de renda") and puts the computed answer in the SERP snippet itself,
    // so the result is useful before the click.
    const pageTitle = `Quem ganha R$ ${salary.toLocaleString('pt-BR')} paga quanto de IR em 2026? ${formatBRL(calc.newTax)}/mês`;
    const pageDesc =
      calc.monthlySaving > 0
        ? `Salário de R$ ${salary.toLocaleString('pt-BR')}: o IRRF em 2026 é de ${formatBRL(calc.newTax)}/mês e o líquido fica em ${formatBRL(calc.netSalary2026)}. Pela tabela de 2025 o imposto seria ${formatBRL(calc.oldTax)} — ${formatBRL(calc.monthlySaving)} a menos por mês, ${formatBRL(calc.annualSaving12Months)} no ano.`
        : `Salário de R$ ${salary.toLocaleString('pt-BR')}: o IRRF em 2026 é de ${formatBRL(calc.newTax)}/mês, o INSS ${formatBRL(calc.inssDeduction)} e o líquido ${formatBRL(calc.netSalary2026)}. Veja o cálculo passo a passo com a base aplicada.`;

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
    const guideFaqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    const guideCrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://calculadorair.online' },
        { '@type': 'ListItem', position: 2, name: guide.h1, item: `https://calculadorair.online/${slug}` },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideCrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideFaqLd) }} />

        <div style={{ padding: '2rem 0' }}>
          <div className="container-narrow">
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <Link href="/">Início</Link> &gt; <span>{guide.h1}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--color-brand-primary)', lineHeight: 1.15 }}>
              {guide.h1}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', margin: '0.75rem 0 2rem', lineHeight: 1.6 }}>
              {guide.lead}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <TrustBanner />
            </div>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                Simule com o seu salário
              </h2>
              <Calculator initialSalary={guide.calculatorSalary} autoFocus={false} />
            </div>

            {guide.sections.map((sec) => (
              <article
                key={sec.h2}
                className="card"
                style={{ padding: '2rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}
              >
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{sec.h2}</h2>
                {sec.paragraphs.map((t) => (
                  <p key={t.slice(0, 40)} style={{ margin: 0 }}>{t}</p>
                ))}
                {sec.list ? (
                  <ol style={{ paddingLeft: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: 0 }}>
                    {sec.list.map((li) => (
                      <li key={li.term}>
                        <strong>{li.term}:</strong> {li.detail}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </article>
            ))}

            <section className="card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Perguntas frequentes</h2>
              {guide.faq.map((f) => (
                <div key={f.q}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{f.q}</h3>
                  <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{f.a}</p>
                </div>
              ))}
            </section>

            <section className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.9rem' }}>Continue o cálculo</h3>
              <ul className="ci-salindex__list">
                {guide.related.map((r) => (
                  <li key={r}>
                    <Link href={`/${r}`}>
                      {GUIDE_PAGES[r]
                        ? GUIDE_PAGES[r].h1
                        : `Salário R$ ${(SALARY_BY_SLUG[r] ?? 0).toLocaleString('pt-BR')}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </>
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

  // A wider neighbourhood, not just prev/next: someone searching for R$ 6.300 is
  // one mistyped digit away from R$ 6.200, and a two-link page leaves most of the
  // set unreachable from any single route.
  const nearby = SALARY_LIST.filter(
    (s) => s !== salary && Math.abs(SALARY_LIST.indexOf(s) - currentIndex) <= 4,
  );

  const isento = calc.newTax === 0;
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Quem ganha R$ ${salary.toLocaleString('pt-BR')} paga quanto de Imposto de Renda em 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isento
            ? `Nada. Com salário bruto de ${formatBRL(salary)}, o redutor da Lei nº 15.270/2025 anula todo o imposto apurado e o IRRF retido na fonte fica em R$ 0,00 por mês.`
            : `${formatBRL(calc.newTax)} por mês de IRRF, o que corresponde a uma alíquota efetiva de ${calc.newEffectiveRate}% sobre o salário bruto de ${formatBRL(salary)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Quanto fica o salário líquido de R$ ${salary.toLocaleString('pt-BR')} em 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${formatBRL(calc.netSalary2026)} por mês. Sobre o bruto de ${formatBRL(salary)} incidem ${formatBRL(calc.inssDeduction)} de INSS e ${formatBRL(calc.newTax)} de IRRF, sobre uma base de cálculo de ${formatBRL(calc.taxableIncome)}. Descontos que variam por empregador — plano de saúde, vale-transporte, contribuição sindical — não estão incluídos.`,
        },
      },
      {
        '@type': 'Question',
        name: `Quanto quem ganha R$ ${salary.toLocaleString('pt-BR')} economiza com a nova regra de 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            calc.monthlySaving > 0
              ? `${formatBRL(calc.monthlySaving)} por mês — pela tabela de 2025 o imposto seria ${formatBRL(calc.oldTax)} e pela de 2026 é ${formatBRL(calc.newTax)}. No ano são ${formatBRL(calc.annualSaving12Months)}.`
              : `Nesta faixa salarial as regras de 2025 e 2026 resultam no mesmo imposto de ${formatBRL(calc.newTax)} por mês.`,
        },
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
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

          {/* Quick Summary Cards. Net pay comes first: "quanto sobra" is the
              question behind the query, and it was the one number the page did
              not previously show. */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', borderColor: 'var(--color-brand-accent)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>SALÁRIO LÍQUIDO</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginTop: '0.25rem' }}>
                {formatBRL(calc.netSalary2026)} <span style={{ fontSize: '0.8rem' }}>/mês</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>após INSS e IRRF</span>
            </div>
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
                    O redutor incide sobre os <strong>rendimentos tributáveis</strong> de {formatBRL(salary)} e vale <strong>{formatBRL(calc.reducerAmount)}</strong>, limitado ao imposto apurado. O IRRF final fica em <strong>{formatBRL(calc.newTax)}</strong> (alíquota efetiva de {calc.newEffectiveRate}%).
                  </>
                ) : (
                  <>
                    Não há redutor: ele só se aplica a rendimentos tributáveis mensais de até {formatBRL(TAX_RULES_2026.rules2026.redutor.grossUpperLimit)}. O IRRF final fica em <strong>{formatBRL(calc.newTax)}</strong> (alíquota efetiva de {calc.newEffectiveRate}%).
                  </>
                )}
              </li>
              <li>
                <strong>Salário líquido em 2026:</strong> descontados o INSS de {formatBRL(calc.inssDeduction)} e o
                IRRF de {formatBRL(calc.newTax)}, restam <strong>{formatBRL(calc.netSalary2026)}</strong> por mês —
                contra {formatBRL(calc.netSalary2025)} pela regra de 2025. Não estão incluídos descontos que variam por
                empregador, como plano de saúde, vale-transporte ou contribuição sindical.
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

            <ul className="ci-salindex__list" style={{ marginTop: '1.25rem' }}>
              {nearby.map((s) => (
                <li key={s}>
                  <Link href={`/${salarySlug(s)}`}>R$ {s.toLocaleString('pt-BR')}</Link>
                </li>
              ))}
            </ul>

            {/* The three pages that explain the numbers this page just showed:
                where the base comes from, how the retention is assessed, and how
                dependents change it. */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--linha)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Entenda cada número deste cálculo
              </h4>
              <ul className="ci-salindex__list">
                {['base-de-calculo-irrf', 'imposto-de-renda-com-dependentes', 'desconto-imposto-de-renda-no-salario'].map(
                  (g) => (
                    <li key={g}>
                      <Link href={`/${g}`}>{GUIDE_PAGES[g].h1}</Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
