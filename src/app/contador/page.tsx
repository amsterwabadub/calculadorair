'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { analytics } from '@/lib/analytics';
import { getStoredAttribution, AttributionData } from '@/lib/attribution';

export default function LeadPage() {
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    cidadeEstado: '',
    tipoAjuda: 'Declaracao_IRPF',
    consent: false,
  });

  const [attribution, setAttribution] = useState<AttributionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasStartedForm, setHasStartedForm] = useState(false);

  useEffect(() => {
    analytics.trackLeadFormView('/contador');
    setAttribution(getStoredAttribution());
  }, []);

  const handleInputFocus = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      analytics.trackLeadFormStart('/contador');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.consent) {
      setErrorMsg('Por favor, aceite os termos de consentimento para prosseguir.');
      return;
    }

    setIsSubmitting(true);

    try {
      const attr = attribution || getStoredAttribution();

      const payload = {
        name: form.nome,
        whatsapp: form.whatsapp,
        email: form.email,
        cityState: form.cidadeEstado,
        helpType: form.tipoAjuda,
        consent: form.consent,
        source: attr.source,
        medium: attr.medium,
        campaign: attr.campaign,
        landingPage: attr.landingPage,
        firstLandingPage: attr.firstLandingPage,
        referrer: attr.referrer,
        gclid: attr.gclid,
      };

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao enviar dados.');
      }

      analytics.trackLeadSubmit({
        leadType: form.tipoAjuda,
        sourcePage: '/contador',
        landingCluster: attr.landingPage,
      });

      analytics.trackAccountantCtaClick('/contador', 'lead_form_submit');

      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Error submitting lead:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Ocorreu um erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <Link href="/">Início</Link> &gt; <span>Atendimento Especializado IRPF</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-reducao" style={{ marginBottom: '0.5rem' }}>
            Atendimento Especializado IRPF 2026
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
            Precisa de suporte profissional para seu Imposto de Renda?
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Preencha os dados abaixo para solicitar contato sobre declaração, dúvidas ou retificação do IRPF.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <TrustBanner />
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-emerald-heading)', marginBottom: '0.75rem' }}>
                Solicitação registrada com sucesso!
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-brand-primary)', fontWeight: 600, marginBottom: '1rem' }}>
                Recebemos seu pedido. Um especialista poderá entrar em contato pelos dados informados.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Garantimos a privacidade de suas informações de acordo com a nossa política.
              </p>
              <Link href="/" className="btn btn-primary">
                ← Voltar para a Calculadora
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMsg && (
                <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="nome-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Nome Completo *
                </label>
                <input
                  id="nome-input"
                  type="text"
                  required
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: João da Silva"
                  value={form.nome}
                  onFocus={handleInputFocus}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="whatsapp-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  WhatsApp para Contato *
                </label>
                <input
                  id="whatsapp-input"
                  type="text"
                  required
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: (11) 99999-9999"
                  value={form.whatsapp}
                  onFocus={handleInputFocus}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  E-mail <span style={{ fontWeight: 400, color: 'var(--color-text-subtle)' }}>(opcional)</span>
                </label>
                <input
                  id="email-input"
                  type="email"
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: joao@email.com"
                  value={form.email}
                  onFocus={handleInputFocus}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="cidade-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Cidade / Estado *
                </label>
                <input
                  id="cidade-input"
                  type="text"
                  required
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: São Paulo / SP"
                  value={form.cidadeEstado}
                  onFocus={handleInputFocus}
                  onChange={(e) => setForm({ ...form, cidadeEstado: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="ajuda-select" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Tipo de ajuda necessária *
                </label>
                <select
                  id="ajuda-select"
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  value={form.tipoAjuda}
                  onFocus={handleInputFocus}
                  onChange={(e) => setForm({ ...form, tipoAjuda: e.target.value })}
                >
                  <option value="Declaracao_IRPF">Declaração IRPF (Anual)</option>
                  <option value="Duvida_Imposto">Dúvida sobre imposto de renda</option>
                  <option value="Restituicao">Restituição do Imposto de Renda</option>
                  <option value="Declaracao_Atrasada">Declaração atrasada / Regularização</option>
                  <option value="Retificacao">Retificação de declaração anterior</option>
                  <option value="Outro">Outro tipo de orientação fiscal</option>
                </select>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <input
                    type="checkbox"
                    required
                    style={{ marginTop: '0.2rem' }}
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  />
                  <span>
                    Concordo em ser contatado por especialistas em IRPF sobre a minha solicitação (Lei Geral de Proteção de Dados - LGPD). Veja nossa{' '}
                    <Link href="/politica-de-privacidade" style={{ textDecoration: 'underline', color: 'var(--color-brand-primary)' }}>
                      Política de Privacidade
                    </Link>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-emerald"
                style={{ marginTop: '0.5rem', width: '100%', padding: '0.875rem 1rem', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Enviando...' : '📩 Enviar solicitação de contato'}
              </button>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
                🔒 Seus dados são protegidos e tratados exclusivamente para o atendimento solicitado.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
