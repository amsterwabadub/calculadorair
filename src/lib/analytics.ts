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

/** Yandex Metrika counter — the same expression src/app/layout.tsx uses for
    `ym(<id>, "init", …)`. */
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID || '111448611');

/**
 * Send one product event to BOTH analytics stacks.
 *
 * Until now this file reached GA4 only, so Metrika counter 111448611 recorded
 * page traffic but could never record a product event — it had zero goals and
 * zero goal reaches. One user action now reaches both stacks from this single
 * call site, so no business logic is duplicated and no caller changes.
 *
 * The previous implementation pushed `arguments` from a function declared with
 * a rest parameter (`function f(..._args) { dataLayer.push(arguments) }`). Once
 * SWC transpiled that for production the `arguments` object no longer held the
 * call's values, so every event reached `window.dataLayer` as an EMPTY entry and
 * GA4 received nothing. Verified on production 2026-08-11: dataLayer held
 * `["js",…]`, `["config","G-KLNEN6LL8G"]` and then `[]`, `[]`.
 *
 * `window.gtag` is defined by the inline GA4 snippet in <head>, so the direct
 * call is the reliable path. The fallback builds a genuine `arguments` object
 * from a plain (non-rest) function expression, which is the shape gtag.js reads,
 * so an event fired before the snippet runs is still queued rather than lost.
 */
function sendEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  // Yandex Metrika. Same counter expression as the init snippet in
  // src/app/layout.tsx; NEXT_PUBLIC_* is inlined at build time.
  if (YM_ID) window.ym?.(YM_ID, 'reachGoal', eventName, eventParams);

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  const queue = window.dataLayer as unknown[];
  // Named (simple) parameters on purpose: a rest parameter makes the parameter
  // list "non-simple", which is what broke `arguments` here in the first place.
  // eslint-disable-next-line func-names
  const enqueue = function (
    _command: string,
    _name: string,
    _params?: Record<string, unknown>,
  ) {
    // eslint-disable-next-line prefer-rest-params
    queue.push(arguments);
  };
  enqueue('event', eventName, eventParams);
}

export const analytics = {
  trackCalculatorStart: () => {
    if (typeof window !== 'undefined') {
      sendEvent('calculator_start', { ...BASE });
      window.dispatchEvent(new CustomEvent('analytics_calculator_start'));
    }
  },

  trackCalculatorComplete: (params: CalculatorCompleteParams) => {
    if (typeof window !== 'undefined') {
      sendEvent('calculator_complete', {
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
      sendEvent('result_view', {
        ...BASE,
        salary_band: params.salaryBand,
        monthly_saving_band: params.savingBand,
        benefit_type: params.benefitType,
      });
    }
  },

  trackCommercialCtaView: (p: CommercialCtaParams) => {
    if (typeof window !== 'undefined') {
      sendEvent('commercial_cta_view', {
        ...BASE, offer_state: p.offerState, landing_page: p.landingPage,
      });
    }
  },

  trackCommercialCtaClick: (p: CommercialCtaParams) => {
    if (typeof window !== 'undefined') {
      sendEvent('commercial_cta_click', {
        ...BASE, offer_state: p.offerState, landing_page: p.landingPage,
      });
      if (p.destinationHost) {
        sendEvent('affiliate_redirect', {
          ...BASE, landing_page: p.landingPage, destination_host: p.destinationHost,
        });
      }
    }
  },

  trackSalaryPageView: (params: SalaryPageViewParams) => {
    if (typeof window !== 'undefined') {
      const salaryBand = getSalaryBand(params.salaryValue);
      sendEvent('salary_page_view', {
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
    ym?: (...args: unknown[]) => void;
  }
}
