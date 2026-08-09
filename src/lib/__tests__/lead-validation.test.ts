import { describe, it, expect } from 'vitest';
import { saveLead, getAllLeads } from '../leads-store';

describe('Lead Store & Validation', () => {
  it('saves lead record and assigns id, timestamp, status and BRL currency', () => {
    const lead = saveLead({
      name: 'Maria Santos',
      whatsapp: '(11) 98888-7777',
      email: 'maria@example.com',
      cityState: 'São Paulo / SP',
      helpType: 'Declaracao_IRPF',
      consent: true,
      source: 'google',
      medium: 'organic',
      campaign: '(not set)',
      landingPage: '/imposto-de-renda-salario-6000',
      firstLandingPage: '/imposto-de-renda-salario-6000',
      referrer: 'https://www.google.com',
      gclid: '',
    });

    expect(lead.id).toBeDefined();
    expect(lead.id).toContain('lead_');
    expect(lead.name).toBe('Maria Santos');
    expect(lead.whatsapp).toBe('(11) 98888-7777');
    expect(lead.status).toBe('new');
    expect(lead.currency).toBe('BRL');
    expect(lead.source).toBe('google');
    expect(lead.medium).toBe('organic');

    const all = getAllLeads();
    expect(all.length).toBeGreaterThan(0);
    expect(all.some((l) => l.id === lead.id)).toBe(true);
  });
});
