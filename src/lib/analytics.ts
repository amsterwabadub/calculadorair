/**
 * Analytics Event Abstraction Layer
 * 
 * Transmits real Google Analytics 4 (GA4) events when `window.gtag` is present.
 * Safely logs user engagement without transmitting any PII (names, emails, exact salary values).
 */

export type BenefitType = 'ISENTO_TOTAL' | 'REDUCAO_PARCIAL' | 'FORA_DO_BENEFICIO';

export interface CalculatorCompleteParams {
  salaryBand: string;       // e.g. "R$ 4.001 - R$ 5.000"
  savingBand: string;       // e.g. "R$ 101 - R$ 300/mês"
  benefitType: BenefitType;
}

export interface SalaryPageViewParams {
  salarySlug: string;
  salaryValue: number;
}

export interface AccountantCtaClickParams {
  sourcePage: string;
  salaryBand?: string;
}

export interface LeadEventParams {
  leadType: string;
  sourcePage: string;
  landingCluster?: string;
  partner?: string;
}

// Helper to safely send GA4 events
function sendGAEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}

export const analytics = {
  trackCalculatorStart: () => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: calculator_start');
      sendGAEvent('calculator_start');
      window.dispatchEvent(new CustomEvent('analytics_calculator_start'));
    }
  },

  trackCalculatorComplete: (params: CalculatorCompleteParams) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: calculator_complete', params);
      sendGAEvent('calculator_complete', {
        salary_band: params.salaryBand,
        monthly_saving_band: params.savingBand,
        benefit_type: params.benefitType,
      });
      window.dispatchEvent(
        new CustomEvent('analytics_calculator_complete', { detail: params })
      );
    }
  },

  trackSalaryPageView: (params: SalaryPageViewParams) => {
    if (typeof window !== 'undefined') {
      const salaryBand = getSalaryBand(params.salaryValue);
      console.log('[Analytics] event: salary_page_view', { ...params, salaryBand });
      sendGAEvent('salary_page_view', {
        salary_band: salaryBand,
        page_slug: params.salarySlug,
      });
      window.dispatchEvent(
        new CustomEvent('analytics_salary_page_view', { detail: params })
      );
    }
  },

  trackAccountantCtaView: () => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: accountant_cta_view');
      sendGAEvent('accountant_cta_view');
      window.dispatchEvent(new CustomEvent('analytics_accountant_cta_view'));
    }
  },

  trackAccountantCtaClick: (sourcePage: string, salaryBand?: string) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: accountant_cta_click', { sourcePage, salaryBand });
      sendGAEvent('accountant_cta_click', {
        source_page: sourcePage,
        salary_band: salaryBand || 'not_specified',
      });
      window.dispatchEvent(
        new CustomEvent('analytics_accountant_cta_click', { detail: { sourcePage, salaryBand } })
      );
    }
  },

  trackLeadFormView: (sourcePage: string) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: lead_form_view', { sourcePage });
      sendGAEvent('lead_form_view', { source_page: sourcePage });
      window.dispatchEvent(new CustomEvent('analytics_lead_form_view', { detail: { sourcePage } }));
    }
  },

  trackLeadFormStart: (sourcePage: string) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: lead_form_start', { sourcePage });
      sendGAEvent('lead_form_start', { source_page: sourcePage });
      window.dispatchEvent(new CustomEvent('analytics_lead_form_start', { detail: { sourcePage } }));
    }
  },

  trackLeadSubmit: (params: LeadEventParams) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: lead_submit', params);
      sendGAEvent('lead_submit', {
        lead_type: params.leadType,
        source_page: params.sourcePage,
        landing_cluster: params.landingCluster || 'general',
      });
      window.dispatchEvent(new CustomEvent('analytics_lead_submit', { detail: params }));
    }
  },

  trackQualifiedLead: (params: LeadEventParams) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: qualified_lead', params);
      sendGAEvent('qualified_lead', {
        lead_type: params.leadType,
        source_page: params.sourcePage,
      });
      window.dispatchEvent(new CustomEvent('analytics_qualified_lead', { detail: params }));
    }
  },

  trackLeadSent: (params: LeadEventParams) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: lead_sent', params);
      sendGAEvent('lead_sent', {
        lead_type: params.leadType,
        partner: params.partner || 'unassigned',
      });
      window.dispatchEvent(new CustomEvent('analytics_lead_sent', { detail: params }));
    }
  },
};

/**
 * Helper to categorize exact salary into safe non-PII privacy bands for analytics
 */
export function getSalaryBand(salary: number): string {
  if (salary <= 3000) return 'Até R$ 3.000';
  if (salary <= 5000) return 'R$ 3.001 - R$ 5.000';
  if (salary <= 7350) return 'R$ 5.001 - R$ 7.350';
  if (salary <= 10000) return 'R$ 7.351 - R$ 10.000';
  return 'Acima de R$ 10.000';
}

/**
 * Helper to categorize monthly savings into non-PII privacy bands
 */
export function getSavingBand(saving: number): string {
  if (saving === 0) return 'Sem economia';
  if (saving <= 100) return 'Até R$ 100/mês';
  if (saving <= 300) return 'R$ 101 - R$ 300/mês';
  if (saving <= 500) return 'R$ 301 - R$ 500/mês';
  return 'Acima de R$ 500/mês';
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}
