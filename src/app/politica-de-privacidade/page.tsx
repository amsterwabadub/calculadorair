import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade e LGPD | Calculadora IR 2026',
  description: 'Saiba como a Calculadora IR 2026 coleta, utiliza e protege seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).',
  alternates: {
    canonical: 'https://calculadorair.online/politica-de-privacidade',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '2.5rem 0', background: 'var(--color-bg-base)' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <Link href="/">Início</Link> &gt; <span>Política de Privacidade</span>
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1.5rem' }}>
          Política de Privacidade e Proteção de Dados (LGPD)
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Última atualização: 9 de agosto de 2026.
        </p>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              1. Compromisso com a Privacidade
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              A <strong>Calculadora Imposto de Renda 2026 (calculadorair.online)</strong> tem o compromisso de proteger a privacidade e a segurança dos dados pessoais dos seus usuários, em estrita observância à Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              2. Dados Pessoais Coletados e Finalidade
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              <strong>Não coletamos dados pessoais.</strong> Este site não possui formulários, não pede
              cadastro e não solicita nome, telefone, e-mail, CPF, documentos ou comprovantes de renda.
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              <li>
                <strong>Valores da calculadora:</strong> o salário que você digita é processado
                inteiramente no seu navegador. Ele não é enviado ao nosso servidor, não é armazenado e
                não aparece em nenhuma ferramenta de analytics.
              </li>
              <li>
                <strong>Dados de navegação agregados:</strong> utilizamos Google Analytics 4 e Yandex
                Metrika para métricas de audiência. Os eventos de uso da calculadora registram apenas
                <em> faixas</em> não identificáveis (por exemplo &ldquo;R$ 5.001 - R$ 7.350&rdquo;), nunca o
                valor exato digitado.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              3. Base Legal para Tratamento (Art. 7º da LGPD)
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              Como não coletamos dados pessoais identificáveis, não há tratamento baseado em
              consentimento. As métricas agregadas de audiência são tratadas com base no
              <strong> legítimo interesse</strong> (Art. 7º, IX da LGPD), limitado à medição de uso do
              site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              4. Compartilhamento de Dados
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              Não compartilhamos, vendemos nem intermediamos dados pessoais com contadores, escritórios
              de contabilidade ou qualquer terceiro. Os únicos terceiros com acesso a dados agregados de
              navegação são os provedores de analytics citados acima.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              5. Direitos do Titular dos Dados (Art. 18 da LGPD)
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Como titular dos dados, você tem o direito de solicitar a qualquer momento:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              <li>Confirmação da existência de tratamento e acesso aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Revogação do consentimento e eliminação dos dados pessoais salvos.</li>
            </ul>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
              Como não mantemos cadastro de titulares, normalmente não há dados a acessar, corrigir ou
              eliminar. Para qualquer dúvida sobre privacidade, escreva para{' '}
              <strong>privacidade@calculadorair.online</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
