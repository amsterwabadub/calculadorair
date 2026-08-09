/**
 * Analytics Event Abstraction Layer
 * 
 * Safely logs user engagement events without collecting or transmitting any PII
 * or exact personal financial data.
 */

export type BenefitType = 'ISENTO_TOTAL' | 'REDUCAO_PARCIAL' | 'FORA_DO_BENEFICIO';

export interface CalculatorCompleteParams {
  salaryBand: string;       // e.g. "R$ 4.000 - R$ 5.000"
  savingBand: string;       // e.g. "R$ 100 - R$ 200/mês"
  benefitType: BenefitType;
}

export interface SalaryPageViewParams {
  salarySlug: string;
  salaryValue: number;
}

export const analytics = {
  trackCalculatorStart: () => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: calculator_start');
      // Ready for Google Analytics / Plausible / PostHog hookup
      window.dispatchEvent(new CustomEvent('analytics_calculator_start'));
    }
  },

  trackCalculatorComplete: (params: CalculatorCompleteParams) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: calculator_complete', params);
      window.dispatchEvent(
        new CustomEvent('analytics_calculator_complete', { detail: params })
      );
    }
  },

  trackSalaryPageView: (params: SalaryPageViewParams) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: salary_page_view', params);
      window.dispatchEvent(
        new CustomEvent('analytics_salary_page_view', { detail: params })
      );
    }
  },

  trackAccountantCtaView: () => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: accountant_cta_view');
      window.dispatchEvent(new CustomEvent('analytics_accountant_cta_view'));
    }
  },

  trackAccountantCtaClick: (source: string) => {
    if (typeof window !== 'undefined') {
      console.log('[Analytics] event: accountant_cta_click', { source });
      window.dispatchEvent(
        new CustomEvent('analytics_accountant_cta_click', { detail: { source } })
      );
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
    dataLayer?: Record<string, unknown>[];
  }
}
