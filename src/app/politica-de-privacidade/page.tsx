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
              Utilizamos o princípio da minimização dos dados (Art. 6º, III da LGPD). Coletamos apenas os dados estritamente necessários para a prestação do serviço solicitado:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              <li><strong>Nome Completo:</strong> Para identificação do solicitante.</li>
              <li><strong>Número de WhatsApp / Telefone:</strong> Para que contadores especialistas parceiros possam entrar em contato relativo ao serviço solicitado.</li>
              <li><strong>E-mail (opcional):</strong> Para envio de confirmações ou respostas a dúvidas fiscais.</li>
              <li><strong>Cidade e Estado:</strong> Para direcionamento a parceiros com atuação na sua região.</li>
              <li><strong>Tipo de Ajuda Fiscais:</strong> Para categorizar a necessidade (Declaração IRPF, Restituição, Retificação, etc.).</li>
            </ul>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
              <strong>Não coletamos</strong> CPF, documentos de identificação, comprovantes de renda ou informações financeiras confidenciais. Os cálculos realizados no simulador ocorrem localmente no navegador e não são salvos em nosso banco de dados.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              3. Base Legal para Tratamento (Art. 7º, I da LGPD)
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              O tratamento dos dados pessoais de contato é realizado com base no seu <strong>Consentimento livre, informado e inequívoco</strong> (Art. 7º, I da LGPD), fornecido mediante o preenchimento voluntário do formulário e aceite do checkbox de contato.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              4. Compartilhamento de Dados com Parceiros
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
              Os dados de contato fornecidos poderão ser compartilhados com contadores e escritórios de contabilidade parceiros estritamente para o propósito de atendimento à sua solicitação de orçamento ou orientação para a declaração do IRPF 2026.
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
              Para exercer seus direitos de titular ou solicitar exclusão dos seus dados, envie uma mensagem para <strong>privacidade@calculadorair.online</strong> informando seu nome e número de telefone cadastrado.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
