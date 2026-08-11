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

export interface CommercialCtaParams {
  offerState: 'live' | 'waiting_for_offer';
  landingPage: string;
  destinationHost?: string;
}

const BASE = { market: 'BR', country: 'br', calculator_type: 'irrf_monthly' };

/**
 * Events go onto `window.dataLayer` in the standard gtag shim shape rather than
 * requiring `window.gtag` to already exist. The GA4 config script is inline in
 * <head>, so gtag is normally ready — but queueing means an event fired during
 * hydration can never be silently discarded.
 */
function dataLayerPush(..._args: unknown[]) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer as unknown[]).push(arguments);
}

function sendGAEvent(eventName: string, eventParams?: Record<string, unknown>) {
  dataLayerPush('event', eventName, eventParams);
}

export const analytics = {
  trackCalculatorStart: () => {
    if (typeof window !== 'undefined') {
      sendGAEvent('calculator_start', { ...BASE });
      window.dispatchEvent(new CustomEvent('analytics_calculator_start'));
    }
  },

  trackCalculatorComplete: (params: CalculatorCompleteParams) => {
    if (typeof window !== 'undefined') {
      sendGAEvent('calculator_complete', {
        ...BASE,
        salary_band: params.salaryBand,
        monthly_saving_band: params.savingBand,
        benefit_type: params.benefitType,
      });
      window.dispatchEvent(
        new CustomEvent('analytics_calculator_complete', { detail: params })
      );
    }
  },

  trackResultView: (params: CalculatorCompleteParams) => {
    if (typeof window !== 'undefined') {
      sendGAEvent('result_view', {
        ...BASE,
        salary_band: params.salaryBand,
        monthly_saving_band: params.savingBand,
        benefit_type: params.benefitType,
      });
    }
  },

  trackCommercialCtaView: (p: CommercialCtaParams) => {
    if (typeof window !== 'undefined') {
      sendGAEvent('commercial_cta_view', {
        ...BASE, offer_state: p.offerState, landing_page: p.landingPage,
      });
    }
  },

  trackCommercialCtaClick: (p: CommercialCtaParams) => {
    if (typeof window !== 'undefined') {
      sendGAEvent('commercial_cta_click', {
        ...BASE, offer_state: p.offerState, landing_page: p.landingPage,
      });
      if (p.destinationHost) {
        sendGAEvent('affiliate_redirect', {
          ...BASE, landing_page: p.landingPage, destination_host: p.destinationHost,
        });
      }
    }
  },

  trackSalaryPageView: (params: SalaryPageViewParams) => {
    if (typeof window !== 'undefined') {
      const salaryBand = getSalaryBand(params.salaryValue);
      sendGAEvent('salary_page_view', {
        salary_band: salaryBand,
        page_slug: params.salarySlug,
      });
      window.dispatchEvent(
        new CustomEvent('analytics_salary_page_view', { detail: params })
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
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
