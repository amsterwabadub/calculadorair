import Link from 'next/link';
import Image from 'next/image';
import TrustBanner from '@/components/TrustBanner';

/**
 * This page previously hosted a lead-capture form that collected name, WhatsApp
 * and e-mail under an LGPD consent notice, and promised contact from a "contador
 * parceiro". There is no signed partner and no production persistence layer, so
 * the form was removed rather than collecting personal data with nowhere to go
 * and no one to act on it.
 *
 * The page now points to the official, free channels only. No personal data is
 * collected here.
 */
export default function AjudaDeclaracaoPage() {
  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <Link href="/">Início</Link> &gt; <span>Ajuda com a declaração</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-reducao" style={{ marginBottom: '0.5rem' }}>
            Canais oficiais
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
            Onde buscar ajuda com o Imposto de Renda
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Esta calculadora é uma ferramenta independente de simulação. Não prestamos serviços de
            contabilidade e não intermediamos atendimento profissional.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <Image
            src="/graphics/guidance-desk.svg"
            alt=""
            width={900}
            height={675}
            style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--linha)' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <TrustBanner />
        </div>

        <article
          className="card"
          style={{ padding: '2rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
            O que esta ferramenta faz — e o que não faz
          </h2>
          <p>
            A Calculadora IR 2026 simula a retenção mensal de IRRF sobre um salário CLT e compara o
            resultado com a regra vigente até 2025. Ela é informativa: não transmite declaração, não
            consulta seus dados na Receita Federal e não substitui a orientação de um profissional
            habilitado.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
            Canais oficiais e gratuitos
          </h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <a
                href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meu Imposto de Renda — Receita Federal
              </a>
              : orientações oficiais, prazos, programa gerador e consulta de restituição.
            </li>
            <li>
              <a
                href="https://www.gov.br/receitafederal/pt-br/canais_atendimento"
                target="_blank"
                rel="noopener noreferrer"
              >
                Canais de atendimento da Receita Federal
              </a>
              : atendimento pelo e-CAC, agendamento presencial e Fale Conosco.
            </li>
            <li>
              Núcleos de Apoio Contábil e Fiscal (NAF) em universidades oferecem atendimento gratuito
              para declarações simples, sob supervisão docente.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
            Se você for contratar um contador
          </h2>
          <p>
            Verifique se o profissional ou escritório tem registro ativo no Conselho Regional de
            Contabilidade do seu estado. A consulta é pública e gratuita no{' '}
            <a href="https://cfc.org.br/" target="_blank" rel="noopener noreferrer">
              Conselho Federal de Contabilidade
            </a>
            . Desconfie de quem garante valor de restituição antes de analisar seus documentos.
          </p>

          <div
            style={{
              background: '#f8fafc',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-brand-accent)',
              fontSize: '0.95rem',
            }}
          >
            <strong>🔒 Privacidade:</strong> esta página não coleta nenhum dado pessoal. O cálculo da
            calculadora acontece inteiramente no seu navegador e os valores que você digita não são
            enviados nem armazenados.
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <Link href="/" className="btn btn-primary">
              ← Voltar para a calculadora
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
