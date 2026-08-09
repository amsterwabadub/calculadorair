'use client';

import { useState } from 'react';
import Link from 'next/link';
import TrustBanner from '@/components/TrustBanner';
import { analytics } from '@/lib/analytics';

export default function LeadPage() {
  const [form, setForm] = useState({
    nome: '',
    contato: '',
    cidade: '',
    tipoAjuda: 'Declaracao_Anual',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackAccountantCtaClick('lead_form_submit');
    setSubmitted(true);
    // TODO: Connect to backend lead capture CRM endpoint (e.g. Supabase, Firebase, or Webhook)
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <Link href="/">Início</Link> &gt; <span>Encontrar Contador</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-reducao" style={{ marginBottom: '0.5rem' }}>
            Atendimento Especializado
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
            Precisa de ajuda com sua declaração do Imposto de Renda?
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Preencha seus dados para entrar na lista de espera e ser conectado com contadores parceiros especialistas em IRPF 2026.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <TrustBanner />
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-emerald-heading)', marginBottom: '0.5rem' }}>
                Solicitação registrada com sucesso!
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Obrigado pelo interesse. Assim que nosso serviço de direcionamento para contadores parceiros for ativado na sua região, entraremos em contato.
              </p>
              <Link href="/" className="btn btn-primary">
                ← Voltar para a Calculadora
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="nome-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Seu Nome Completo
                </label>
                <input
                  id="nome-input"
                  type="text"
                  required
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: João da Silva"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="contato-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  WhatsApp ou E-mail para Contato
                </label>
                <input
                  id="contato-input"
                  type="text"
                  required
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: (11) 99999-9999 ou joao@email.com"
                  value={form.contato}
                  onChange={(e) => setForm({ ...form, contato: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="cidade-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Sua Cidade / Estado
                </label>
                <input
                  id="cidade-input"
                  type="text"
                  required
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  placeholder="Ex: São Paulo / SP"
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="ajuda-select" style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Do que você precisa?
                </label>
                <select
                  id="ajuda-select"
                  className="input-field"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                  value={form.tipoAjuda}
                  onChange={(e) => setForm({ ...form, tipoAjuda: e.target.value })}
                >
                  <option value="Declaracao_Anual">Fazer minha declaração anual do IRPF</option>
                  <option value="Duvida_Isencao">Tirar dúvidas sobre a isenção de R$ 5.000</option>
                  <option value="Planejamento_Tributario">Planejamento tributário / Previdência</option>
                  <option value="Outro">Outro tipo de consultoria fiscal</option>
                </select>
              </div>

              <button type="submit" className="btn btn-emerald" style={{ marginTop: '0.5rem', width: '100%' }}>
                📩 Enviar solicitação de contato
              </button>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
                🔒 Seus dados estão seguros. Não enviamos spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
