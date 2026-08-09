import Link from 'next/link';
import Calculator from '@/components/Calculator';
import TrustBanner from '@/components/TrustBanner';
import { TAX_RULES_2026 } from '@/data/tax-rules-2026';

export const metadata = {
  title: 'Calculadora Imposto de Renda 2026 — Veja Quanto Você Economiza',
  description: 'Informe seu salário mensal e compare quanto pagava antes e quanto paga agora com a nova tabela do Imposto de Renda 2026 (Lei nº 15.270/2025). Isenção até R$ 5.000.',
  alternates: {
    canonical: 'https://calculadorair.online',
  },
  openGraph: {
    title: 'Calculadora Imposto de Renda 2026 — Veja Quanto Você Economiza',
    description: 'Informe seu salário mensal e compare quanto pagava antes e quanto paga agora com a nova tabela do Imposto de Renda 2026.',
    url: 'https://calculadorair.online',
  },
};

export default function HomePage() {
  const salaryExamples = [
    { salary: 4000, label: 'R$ 4.000', badge: 'Isento 2026', saving: 'Até R$ 263/mês' },
    { salary: 5000, label: 'R$ 5.000', badge: 'Isenção Máxima', saving: 'R$ 479/mês (R$ 5.748/ano)' },
    { salary: 6000, label: 'R$ 6.000', badge: 'Redução Gradual', saving: 'R$ 179/mês (R$ 2.157/ano)' },
    { salary: 7000, label: 'R$ 7.000', badge: 'Redução Parcial', saving: 'R$ 46/mês (R$ 559/ano)' },
    { salary: 8000, label: 'R$ 8.000', badge: 'Tabela Padrão', saving: 'Sem redução adicional' },
    { salary: 10000, label: 'R$ 10.000', badge: 'Tabela Padrão', saving: 'Sem redução adicional' },
  ];

  const faqs = [
    {
      q: 'Quem ganha R$ 5.000 vai pagar Imposto de Renda em 2026?',
      a: 'Não. Com as novas regras aprovadas na Lei nº 15.270/2025, os rendimentos tributáveis mensais de até R$ 5.000,00 passam a ser 100% isentos de imposto de renda retido na fonte.',
    },
    {
      q: 'Como funciona a redução para quem ganha entre R$ 5.000,01 e R$ 7.350,00?',
      a: 'Quem recebe nessa faixa tem direito a um redutor decrescente calculado pela fórmula: R$ 978,62 - (0,133145 x rendimento tributável). Esse desconto reduz gradualmente o imposto apurado pela tabela progressiva tradicional até zerar em R$ 7.350,00.',
    },
    {
      q: 'Quem ganha acima de R$ 7.350,00 tem algum desconto na nova lei?',
      a: 'Para rendimentos tributáveis acima de R$ 7.350,00, o benefício do redutor adicional deixa de ser aplicado. O imposto é calculado normalmente de acordo com a tabela progressiva padrão de 27,5%.',
    },
    {
      q: 'Se eu ficar isento na fonte, ainda preciso fazer a declaração anual?',
      a: 'Ficar isento de retenção mensal não dispensa automaticamente a declaração anual. A obrigatoriedade de entregar a Declaração de Ajuste Anual depende de regras adicionais da Receita Federal (como patrimônio acumulado, ganhos em bolsa, rendimentos isentos acima do teto ou atividade rural).',
    },
    {
      q: 'O cálculo desta ferramenta considera o desconto do INSS?',
      a: 'Sim. A calculadora calcula automaticamente o desconto progressivo do INSS oficial do trabalhador CLT antes de aplicar a tabela progressiva do Imposto de Renda.',
    },
    {
      q: 'Qual é a fonte oficial dos dados utilizados neste simulador?',
      a: 'Nossa calculadora utiliza estritamente as regras e parâmetros divulgados pela Receita Federal do Brasil e estabelecidos pela Lei nº 15.270/2025.',
    },
  ];

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
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          {/* Hero Section */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
            <span className="badge badge-isento" style={{ marginBottom: '0.75rem' }}>
              Reformulação IRRF 2026
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                fontWeight: 800,
                color: 'var(--color-brand-primary)',
                lineHeight: '1.2',
                marginBottom: '1rem',
              }}
            >
              Veja quanto você economiza com o novo Imposto de Renda em 2026
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Informe seu salário mensal bruto e compare quanto pagava antes e quanto paga agora com as novas regras da Lei nº 15.270/2025.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <TrustBanner />
          </div>

          {/* Interactive Core Calculator */}
          <div style={{ marginBottom: '4rem' }}>
            <Calculator autoFocus />
          </div>

          {/* How it works (Como funciona) */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)', textAlign: 'center', marginBottom: '2rem' }}>
              Como funciona o cálculo da nova regra em 3 passos
            </h2>

            <div className="grid-3">
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>1️⃣</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Digita seu Salário</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  A ferramenta calcula automaticamente o desconto progressivo do INSS para obter a base tributável real.
                </p>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>2️⃣</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aplica a Nova Isenção/Redutor</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Aplica isenção total até R$ 5.000 ou o redutor gradual `R$ 978,62 - (0,133145 x Renda)` até R$ 7.350.
                </p>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>3️⃣</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Descobre a Economia</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Compara o imposto retido antes vs depois e exibe seu saldo livre no bolso por mês e por ano.
                </p>
              </div>
            </div>
          </section>

          {/* O que mudou em 2026? */}
          <section className="card" style={{ marginBottom: '4rem', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1rem' }}>
              O que mudou no Imposto de Renda em 2026?
            </h2>
            <div style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                A reforma do IRPF (Lei nº 15.270/2025) trouxe alterações significativas no cálculo do imposto retido na fonte para os trabalhadores brasileiros:
              </p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  🟢 <strong>Isenção Total até R$ 5.000:</strong> Quem recebe rendimento tributável de até R$ 5.000,00 mensais não tem qualquer desconto de Imposto de Renda na fonte.
                </li>
                <li>
                  🔵 <strong>Redução Gradual até R$ 7.350:</strong> Para quem ganha entre R$ 5.000,01 e R$ 7.350,00, a cobrança do imposto diminui gradativamente com a aplicação de um redutor mensal.
                </li>
                <li>
                  ⚪ <strong>Faixas Acima de R$ 7.350:</strong> Para quem ganha acima deste teto, o imposto continua sendo calculado com base na tabela progressiva mensal de 27,5%.
                </li>
              </ul>
            </div>
          </section>

          {/* Exemplos de Salários (Salary Pages Links Grid) */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1.5rem' }}>
              Simulações por faixa salarial
            </h2>
            <div className="grid-3">
              {salaryExamples.map((item) => (
                <Link
                  key={item.salary}
                  href={`/imposto-de-renda-salario-${item.salary}`}
                  className="card"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-brand-primary)' }}>{item.label}</strong>
                    <span className="badge badge-reducao">{item.badge}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-emerald-heading)', fontWeight: 700 }}>
                    Economia: {item.saving}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-brand-accent)', marginTop: '0.5rem', fontWeight: 600 }}>
                    Ver cálculo completo →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Perguntas Frequentes sobre o IR 2026
            </h2>
            <div className="card" style={{ padding: '1.5rem 2rem' }}>
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">❓ {faq.q}</h3>
                  <p className="faq-answer">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sources Section */}
          <section style={{ textAlign: 'center', background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-brand-primary)' }}>
              Transparência e Fontes Primárias
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto 1rem auto' }}>
              Os parâmetros de cálculo deste simulador são atualizados diretamente das tabelas publicadas no portal oficial do Governo Federal e pela Receita Federal do Brasil.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
              {TAX_RULES_2026.sources.map((src, idx) => (
                <a key={idx} href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                  📄 {src.title}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
