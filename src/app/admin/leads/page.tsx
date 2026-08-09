'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeadRecord {
  id: string;
  createdAt: string;
  name: string;
  whatsapp: string;
  email?: string;
  cityState: string;
  helpType: string;
  consent: boolean;
  source: string;
  medium: string;
  campaign: string;
  landingPage: string;
  referrer: string;
  status: 'new' | 'contacted' | 'qualified' | 'sent' | 'won' | 'lost';
  partner?: string | null;
  revenue?: number;
  commissionRevenue?: number;
  currency: string;
}

interface Metrics {
  totalLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  totalRevenue: number;
  totalCommission: number;
  qualificationRate: string;
  winRate: string;
  avgRevenuePerLead: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: 'new',
    partner: '',
    revenue: 0,
    commissionRevenue: 0,
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar.');
      setLeads(data.leads || []);
      setMetrics(data.metrics || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleEditClick = (lead: LeadRecord) => {
    setEditingId(lead.id);
    setEditForm({
      status: lead.status,
      partner: lead.partner || '',
      revenue: lead.revenue || 0,
      commissionRevenue: lead.commissionRevenue || 0,
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: editForm.status,
          partner: editForm.partner,
          revenue: editForm.revenue,
          commissionRevenue: editForm.commissionRevenue,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar.');

      setEditingId(null);
      fetchLeads();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar edições.');
    }
  };

  const filteredLeads = statusFilter === 'all'
    ? leads
    : leads.filter((l) => l.status === statusFilter);

  return (
    <div style={{ padding: '2rem 0', background: 'var(--color-bg-base)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
              Painel de Leads & Revenue Attribution
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Acompanhamento de conversão SEO organic → Lead → Partner Monetization
            </p>
          </div>
          <Link href="/contador" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
            + Novo Lead Form
          </Link>
        </div>

        {/* METRICS DASHBOARD CARDS */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Leads</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>{metrics.totalLeads}</div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Leads Qualificados</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-emerald-heading)' }}>
                {metrics.qualifiedLeads} <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>({metrics.qualificationRate})</span>
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Vendas Confirmadas</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-accent)' }}>
                {metrics.wonLeads} <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>({metrics.winRate})</span>
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Receita Total (Gross)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                R$ {metrics.totalRevenue.toFixed(2)}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Comissão (Net Revenue)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-emerald-heading)' }}>
                R$ {metrics.totalCommission.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['all', 'new', 'contacted', 'qualified', 'sent', 'won', 'lost'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {st === 'all' ? 'Todos' : st.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LEADS TABLE */}
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando dados...</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Nenhum lead encontrado para este filtro.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Data</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Cliente</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contato</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Cidade/UF</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Tipo Ajuda</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Origem SEO</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Parceiro / Receita</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const isEditing = editingId === lead.id;

                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{lead.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div>📱 {lead.whatsapp}</div>
                        {lead.email && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>✉️ {lead.email}</div>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{lead.cityState}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge badge-isento">{lead.helpType}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{lead.source} / {lead.medium}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lead.landingPage}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {isEditing ? (
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as LeadRecord['status'] })}
                            style={{ padding: '0.25rem', borderRadius: '4px', fontSize: '0.8rem' }}
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="qualified">QUALIFIED</option>
                            <option value="sent">SENT</option>
                            <option value="won">WON</option>
                            <option value="lost">LOST</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              background:
                                lead.status === 'won' ? '#dcfce7' :
                                lead.status === 'qualified' ? '#dbeafe' :
                                lead.status === 'sent' ? '#fef3c7' :
                                lead.status === 'lost' ? '#fee2e2' : '#f3f4f6',
                              color:
                                lead.status === 'won' ? '#166534' :
                                lead.status === 'qualified' ? '#1e40af' :
                                lead.status === 'sent' ? '#92400e' :
                                lead.status === 'lost' ? '#991b1b' : '#374151',
                            }}
                          >
                            {lead.status}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <input
                              type="text"
                              placeholder="Parceiro"
                              value={editForm.partner}
                              onChange={(e) => setEditForm({ ...editForm, partner: e.target.value })}
                              style={{ padding: '0.2rem', fontSize: '0.75rem' }}
                            />
                            <input
                              type="number"
                              placeholder="Receita Gross"
                              value={editForm.revenue}
                              onChange={(e) => setEditForm({ ...editForm, revenue: Number(e.target.value) })}
                              style={{ padding: '0.2rem', fontSize: '0.75rem' }}
                            />
                            <input
                              type="number"
                              placeholder="Comissão"
                              value={editForm.commissionRevenue}
                              onChange={(e) => setEditForm({ ...editForm, commissionRevenue: Number(e.target.value) })}
                              style={{ padding: '0.2rem', fontSize: '0.75rem' }}
                            />
                          </div>
                        ) : (
                          <div>
                            <div>{lead.partner || '—'}</div>
                            {lead.revenue ? (
                              <div style={{ fontWeight: 700, color: 'var(--color-emerald-heading)' }}>
                                R$ {lead.revenue} (Comissão: R$ {lead.commissionRevenue || 0})
                              </div>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(lead.id)}
                            className="btn btn-emerald"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          >
                            Salvar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(lead)}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
