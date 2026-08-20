import Link from 'next/link';
import Image from 'next/image';
import Calculator from '@/components/Calculator';
import { TAX_RULES_2026 } from '@/data/tax-rules-2026';
import { COMPARISON_ROWS, FEATURED_SALARY_EXAMPLES, SALARY_BANDS, salarySlug } from '@/data/salary-pages';
import { GUIDE_PAGES, GUIDE_SLUGS } from '@/data/guide-pages';

export const metadata = {
  // Engineered against the live page-1 titles for "calculadora imposto de renda"
  // (BR/pt, 2026-08-20). Receita, DIEESE, Brasilprev, eCálculos and InvestNews all
  // lead with the tool noun; none of them promise the 2025-vs-2026 comparison or the
  // net salary, so that is what this title carries as the differentiator.
  title: 'Calculadora de Imposto de Renda 2026 — IRRF e Salário Líquido',
  description:
    'Calculadora de Imposto de Renda 2026: informe o salário bruto e veja na hora o IRRF retido, o salário líquido e quanto você paga a menos que pela tabela de 2025. Grátis, sem cadastro, com INSS e dependentes.',
  alternates: { canonical: 'https://calculadorair.online' },
  openGraph: {
    title: 'Calculadora Imposto de Renda 2026 — Veja Quanto Você Economiza',
    description:
      'Informe seu salário mensal e compare quanto pagava antes e quanto paga agora com a nova tabela do Imposto de Renda 2026.',
    url: 'https://calculadorair.online',
  },
};

/** Cards are generated from the guide data, so a card can never point at a route
    that does not exist and a new guide is reachable from the homepage the moment
    it is added. */
const GUIDES = GUIDE_SLUGS.map((slug) => ({
  href: `/${slug}`,
  title: GUIDE_PAGES[slug].h1,
  desc: GUIDE_PAGES[slug].lead,
}));

const STEPS = [
  {
    n: 'Passo 1',
    icon: '/icons/step-salario.webp',
    title: 'Informe o salário bruto',
    text: 'Descontamos o INSS progressivo de 2026 — ou o desconto simplificado de R$ 607,20, o que for maior — para chegar à base de cálculo.',
  },
  {
    n: 'Passo 2',
    icon: '/icons/step-irrf.webp',
    title: 'Aplicamos a tabela e o redutor',
    text: 'A tabela progressiva de 2026 incide sobre a base de cálculo. O redutor da Lei nº 15.270/2025 incide sobre os rendimentos tributáveis, antes das deduções.',
  },
  {
    n: 'Passo 3',
    icon: '/icons/step-economia.webp',
    title: 'Compare 2025 com 2026',
    text: 'Mostramos o imposto pelas duas regras lado a lado e a diferença que sobra no seu bolso por mês e por ano.',
  },
];

const ZONES = [
  {
    dot: 'var(--verde-nevoa)',
    k: 'Até R$ 5.000',
    v: 'O redutor anula todo o imposto apurado: não há retenção de IRRF na fonte.',
  },
  {
    dot: 'var(--amarelo-ipe)',
    k: 'R$ 5.000,01 a R$ 7.350',
    v: 'Redutor decrescente, de R$ 312,89 até zero, subtraído do imposto apurado.',
  },
  {
    dot: 'var(--azul-rio)',
    k: 'Acima de R$ 7.350',
    v: 'Sem redutor. Vale a tabela progressiva de 2026, com isenção maior que a de 2025.',
  },
];

const FAQS = [
  {
    q: 'Quem ganha R$ 5.000 vai pagar Imposto de Renda em 2026?',
    a: 'Não. Pela Lei nº 15.270/2025, quem tem rendimentos tributáveis mensais de até R$ 5.000,00 fica sem retenção de IRRF: o imposto apurado pela tabela progressiva é integralmente anulado pelo redutor. Na prática o resultado é imposto zero na fonte.',
  },
  {
    q: 'Como funciona a redução para quem ganha entre R$ 5.000,01 e R$ 7.350,00?',
    a: 'O redutor é calculado sobre os rendimentos tributáveis sujeitos à incidência mensal — ou seja, o salário tributável antes das deduções — pela fórmula R$ 978,62 - (0,133145 x rendimentos tributáveis). O resultado é subtraído do imposto apurado pela tabela progressiva de 2026, que por sua vez incide sobre a base de cálculo, já descontados o INSS e as demais deduções. São duas bases diferentes no mesmo cálculo. O redutor diminui conforme o salário sobe, chega a zero em R$ 7.350,00 e nunca ultrapassa o imposto apurado.',
  },
  {
    q: 'Quem ganha acima de R$ 7.350,00 tem algum desconto na nova lei?',
    a: 'Acima de R$ 7.350,00 de rendimentos tributáveis mensais o redutor não se aplica. Ainda assim há uma pequena diferença em relação a 2025, porque a tabela progressiva de 2026 tem faixa de isenção maior (R$ 2.428,80) e desconto simplificado maior (R$ 607,20).',
  },
  {
    q: 'Se eu ficar isento na fonte, ainda preciso fazer a declaração anual?',
    a: 'Ficar isento de retenção mensal não dispensa automaticamente a declaração anual. A obrigatoriedade de entregar a Declaração de Ajuste Anual depende de regras adicionais da Receita Federal (como patrimônio acumulado, ganhos em bolsa, rendimentos isentos acima do teto ou atividade rural).',
  },
  {
    q: 'O cálculo desta ferramenta considera o desconto do INSS?',
    a: 'Sim. A calculadora aplica a tabela progressiva do INSS de 2026 do trabalhador CLT (teto de R$ 8.475,55) e usa o resultado como dedução, sempre comparando com o desconto simplificado para adotar o que for mais vantajoso.',
  },
  {
    q: 'Esta calculadora serve para a declaração anual ou para a restituição?',
    a: 'Não. Esta ferramenta simula exclusivamente o Imposto de Renda Retido na Fonte mensal sobre um salário CLT e o compara com a regra vigente até 2025. Ela não calcula a Declaração de Ajuste Anual, imposto devido anual nem valor de restituição.',
  },
  /* The three questions below are not invented: they are the phrasings this page
     already receives impressions for in Search Console (2026-08-12 → 2026-08-18),
     written out as questions. "como calcular o desconto de imposto de renda",
     "base de calculo do ir" and "quanto pagar de imposto de renda" were all live
     queries against this URL, so answering them here is answering real demand. */
  {
    q: 'Como calcular o desconto do Imposto de Renda no salário?',
    a: 'Em quatro passos. Primeiro desconte o INSS do salário bruto. Depois compare a soma das deduções legais (INSS mais R$ 189,59 por dependente) com o desconto simplificado de R$ 607,20 e use o maior dos dois: o que sobra é a base de cálculo. Aplique a tabela progressiva de 2026 sobre essa base para achar o imposto apurado. Por fim, se os rendimentos tributáveis forem de até R$ 7.350,00, subtraia o redutor da Lei nº 15.270/2025. O resultado é o IRRF descontado na folha. A calculadora no topo desta página executa exatamente esses quatro passos.',
  },
  {
    q: 'O que é a base de cálculo do IR e como ela é encontrada?',
    a: 'A base de cálculo é o valor sobre o qual a tabela progressiva incide — não é o salário bruto. Ela é o salário bruto menos a maior destas duas opções: as deduções legais (INSS do mês mais R$ 189,59 por dependente) ou o desconto simplificado de R$ 607,20. Atenção a um detalhe que confunde: o redutor de 2026 não usa a base de cálculo, e sim os rendimentos tributáveis, ou seja o salário tributável antes das deduções. São duas bases diferentes dentro do mesmo cálculo.',
  },
  {
    q: 'Quanto se paga de Imposto de Renda por salário em 2026?',
    a: `A tabela desta página traz o valor para nove salários. Como referência rápida: até R$ 5.000,00 não há retenção; em R$ ${(6000).toLocaleString('pt-BR')},00 o IRRF é ${COMPARISON_ROWS.find((r) => r.salary === 6000)?.newTax ?? '—'} contra ${COMPARISON_ROWS.find((r) => r.salary === 6000)?.oldTax ?? '—'} pela regra de 2025; e a partir de R$ 7.350,00 o redutor deixa de existir e vale a tabela progressiva de 2026. Para o seu valor exato, use a calculadora no topo da página.`,
  },
];

export default function HomePage() {
  // Every figure comes from the same engine as the salary pages. Nothing hardcoded.
  const salaryExamples = FEATURED_SALARY_EXAMPLES;

  const jsonLdWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora Imposto de Renda 2026',
    url: 'https://calculadorair.online',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    description: 'Simulador gratuito do Imposto de Renda 2026 com comparação de economia.',
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ------------------------------------------------------------- hero */}
      <section className="ci-hero">
        <div className="ci-hero__art" aria-hidden="true">
          <Image src="/graphics/hero-ipe.svg" alt="" fill priority sizes="60vw" />
        </div>

        <div className="ci-shell ci-hero__grid">
          <div className="ci-hero__copy">
            <p className="ci-eyebrow">Lei nº 15.270/2025 · vigente desde 1º/01/2026</p>

            {/* The previous H1 ("Veja quanto o novo Imposto de Renda de 2026 deixa no
                seu bolso") named neither the tool nor the tax. It framed the page as a
                reform explainer while the query it needs to win — "calculadora imposto
                de renda", 9.900/mês — is a tool query, and every page-1 result leads
                with the tool noun. The benefit line moves to the lead, where it still
                does its job without costing the page its topic. */}
            <h1 className="ci-h1">
              Calculadora de Imposto de&nbsp;Renda <em>2026</em>
            </h1>

            <p className="ci-lead">
              Informe o salário bruto e veja na hora o IRRF retido, o salário líquido e quanto o
              novo Imposto de Renda deixa no seu bolso em relação à tabela de 2025. Sem cadastro.
            </p>
          </div>

          {/* On mobile the calculator comes before the context chips, so the
              result panel stays inside the first screen. */}
          <div className="ci-hero__calc">
            <Calculator autoFocus />
          </div>

          <ul className="ci-facts">
            <li>
              Isenção da tabela <b>R$ 2.428,80</b>
            </li>
            <li>
              Desconto simplificado <b>R$ 607,20</b>
            </li>
            <li>
              Teto do INSS <b>R$ 8.475,55</b>
            </li>
            <li>
              Sem cadastro · <b>cálculo no navegador</b>
            </li>
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------- o que mudou (deep) */}
      <section className="ci-section ci-section--deep">
        <div className="ci-shell">
          <div className="ci-head">
            <h2 className="ci-h2">O que mudou de 2025 para 2026</h2>
            <p className="ci-sub">
              As faixas abaixo referem-se aos <strong>rendimentos tributáveis sujeitos à incidência
              mensal</strong> — o salário tributável antes das deduções. A tabela progressiva, por
              sua vez, continua incidindo sobre a base de cálculo, já descontados o INSS e os
              dependentes.
            </p>
          </div>

          <div className="ci-zones">
            {ZONES.map((z) => (
              <div className="ci-zone" key={z.k}>
                <span className="ci-zone__dot" style={{ background: z.dot }} />
                <div className="ci-zone__k">{z.k}</div>
                <p className="ci-zone__v">{z.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- 2025 vs 2026 table */}
      <section className="ci-section" id="tabela-comparativa">
        <div className="ci-shell">
          <div className="ci-head">
            <h2 className="ci-h2">Quanto se paga de IRRF por salário: 2025 x 2026</h2>
            <p className="ci-sub">
              O imposto retido na fonte pelas duas regras, lado a lado, com o INSS já descontado e o
              salário líquido que sobra em 2026. Todos os valores são calculados pelo mesmo motor da
              calculadora acima, para um trabalhador CLT sem dependentes.
            </p>
          </div>

          <div className="ci-tablewrap">
            <table className="ci-table">
              <caption className="ci-table__caption">
                IRRF mensal por faixa de salário bruto — tabela de 2025 comparada com a tabela e o
                redutor de 2026 (Lei nº 15.270/2025).
              </caption>
              <thead>
                <tr>
                  <th scope="col">Salário bruto</th>
                  <th scope="col">INSS</th>
                  <th scope="col">IRRF 2025</th>
                  <th scope="col">IRRF 2026</th>
                  <th scope="col">Diferença/mês</th>
                  <th scope="col">Líquido 2026</th>
                  <th scope="col">Regra aplicada</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.salary}>
                    <th scope="row">
                      <Link href={`/${row.slug}`}>{row.label}</Link>
                    </th>
                    <td>{row.inss}</td>
                    <td>{row.oldTax}</td>
                    <td>
                      <strong>{row.newTax}</strong>
                    </td>
                    <td className={row.saving === '—' ? undefined : 'ci-table__save'}>{row.saving}</td>
                    <td>{row.netSalary}</td>
                    <td>{row.ruleLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="ci-tablenote">
            O INSS de 2026 é mantido nos dois lados da comparação, de modo que a coluna
            &ldquo;Diferença/mês&rdquo; isole o efeito da reforma e não misture mudanças de
            contribuição previdenciária. Parâmetros e fontes em{' '}
            <Link href="/metodologia">metodologia</Link>.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ como funciona */}
      <section className="ci-section ci-section--tint" id="como-funciona">
        <div className="ci-shell">
          <div className="ci-head">
            <h2 className="ci-h2">Como o cálculo funciona</h2>
            <p className="ci-sub">
              Três passos, exatamente os mesmos que a fonte pagadora aplica na folha.
            </p>
          </div>

          <div className="ci-grid-3">
            {STEPS.map((s) => (
              <div className="ci-step" key={s.title}>
                <Image className="ci-step__icon" src={s.icon} alt="" width={176} height={176} />
                <span className="ci-step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- salary long-tail */}
      <section className="ci-section">
        <div className="ci-shell">
          <div className="ci-head">
            <h2 className="ci-h2">Simulações por faixa salarial</h2>
            <p className="ci-sub">
              Cada valor abaixo é calculado pelo mesmo motor da calculadora acima.
            </p>
          </div>

          <div className="ci-grid-3">
            {salaryExamples.map((item) => (
              <Link key={item.salary} href={`/${item.slug}`} className="ci-sal">
                <span className="ci-sal__top">
                  <span className="ci-sal__amt">{item.label}</span>
                  <span className={item.badgeClass}>{item.badge}</span>
                </span>
                <span
                  className={
                    item.monthlySaving > 0 ? 'ci-sal__save' : 'ci-sal__save ci-sal__save--none'
                  }
                  style={{ display: 'block' }}
                >
                  {item.savingLine}
                </span>
                <span className="ci-sal__go" style={{ display: 'block' }}>
                  Ver cálculo completo →
                </span>
              </Link>
            ))}
          </div>

          {/* Full index. Google reaches every salary route from the root in one
              hop — the six cards above only ever exposed six of them, and the
              rest were sitting in the sitemap uncrawled. */}
          <div className="ci-salindex">
            <h3 className="ci-salindex__title">Todas as faixas simuladas</h3>
            <p className="ci-salindex__sub">
              Cada link abre o cálculo completo daquele salário: INSS, base de cálculo, redutor da
              Lei nº 15.270/2025 e a diferença mensal em relação à tabela de 2025.
            </p>

            {SALARY_BANDS.map((band) => (
              <div className="ci-salindex__band" key={band.label}>
                <div className="ci-salindex__head">
                  <strong>{band.label}</strong>
                  <span>{band.hint}</span>
                </div>
                <ul className="ci-salindex__list">
                  {band.values.map((v) => (
                    <li key={v}>
                      <Link href={`/${salarySlug(v)}`}>R$ {v.toLocaleString('pt-BR')}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- guias */}
      <section className="ci-section ci-section--tint">
        <div className="ci-shell">
          <div className="ci-head">
            <h2 className="ci-h2">Entenda a reforma</h2>
            <p className="ci-sub">As regras que a calculadora aplica, e os cálculos vizinhos ao IRRF mensal.</p>
          </div>

          <div className="ci-grid-2">
            {GUIDES.map((g) => (
              <Link key={g.href} href={g.href} className="ci-tool">
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <span className="ci-tool__go">Ler o guia →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- faq */}
      <section className="ci-section" id="perguntas">
        <div className="ci-shell">
          <div className="ci-head">
            <h2 className="ci-h2">Perguntas frequentes</h2>
          </div>

          <div className="card" style={{ padding: '0.5rem 1.75rem' }}>
            {FAQS.map((faq) => (
              <div key={faq.q} className="faq-item">
                <h3 className="faq-question">{faq.q}</h3>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- fontes */}
      <section className="ci-section ci-section--tint">
        <div className="ci-shell">
          <div className="ci-src">
            <h2 className="ci-h2" style={{ fontSize: '1.25rem' }}>
              Metodologia e fontes
            </h2>
            <p className="ci-sub" style={{ marginTop: 10 }}>
              A calculadora aplica a tabela progressiva mensal de 2026, o desconto simplificado de
              R$ 607,20, a dedução de R$ 189,59 por dependente, a tabela do INSS de 2026 e o redutor
              da Lei nº 15.270/2025, limitado ao imposto apurado. A comparação mantém o INSS de 2026
              nos dois lados, de modo que a diferença isole o efeito da reforma. Parâmetros
              verificados em 11 de agosto de 2026.
            </p>
            <ul>
              {TAX_RULES_2026.sources.map((src) => (
                <li key={src.url}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">
                    {src.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="ci-sticky">
        <a href="#calculadora">Calcular meu IRRF de 2026</a>
      </div>
    </>
  );
}
