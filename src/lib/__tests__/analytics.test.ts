/**
 * Regression tests for the GA4 transmission layer.
 *
 * The defect these lock down: events were pushed to window.dataLayer via
 * `arguments` of a rest-parameter function. After SWC transpiled it for
 * production the arguments object was empty, so every event arrived as `[]` and
 * GA4 recorded nothing — silently, with no console error and no failed request.
 * A unit test that only asserted "something was pushed" would have passed, so
 * these assert the delivered event NAME and PARAMS.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analytics, getSalaryBand, getSavingBand } from '../analytics';

declare const globalThis: any;

function installWindow(withGtag: boolean) {
  const calls: any[] = [];
  const w: any = {
    dataLayer: [],
    dispatchEvent: () => true,
    CustomEvent: class { constructor(public type: string, public init?: any) {} },
  };
  if (withGtag) w.gtag = (...args: any[]) => calls.push(args);
  globalThis.window = w;
  globalThis.CustomEvent = w.CustomEvent;
  return { w, calls };
}

afterEach(() => {
  delete globalThis.window;
  delete globalThis.CustomEvent;
  vi.restoreAllMocks();
});

describe('GA4 transmission', () => {
  it('delivers event name and params through window.gtag', () => {
    const { calls } = installWindow(true);
    analytics.trackCalculatorStart();
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe('event');
    expect(calls[0][1]).toBe('calculator_start');
    expect(calls[0][2]).toMatchObject({ market: 'BR', country: 'br' });
  });

  it('queues a NON-EMPTY dataLayer entry when gtag is not yet defined', () => {
    const { w } = installWindow(false);
    analytics.trackCalculatorStart();
    expect(w.dataLayer).toHaveLength(1);
    const entry = Array.from(w.dataLayer[0] as ArrayLike<unknown>);
    // The exact failure mode in production was entry.length === 0.
    expect(entry.length).toBe(3);
    expect(entry[0]).toBe('event');
    expect(entry[1]).toBe('calculator_start');
  });

  it('sends calculator_complete with banded values and never raw amounts', () => {
    const { calls } = installWindow(true);
    analytics.trackCalculatorComplete({
      salaryBand: getSalaryBand(7500),
      savingBand: getSavingBand(250),
      benefitType: 'REDUCAO_PARCIAL',
    });
    const params = calls[0][2];
    expect(calls[0][1]).toBe('calculator_complete');
    expect(params.salary_band).toBe('R$ 7.351 - R$ 10.000');
    expect(params.monthly_saving_band).toBe('R$ 101 - R$ 300/mês');
    // No raw salary, tax or saving figure may appear in any parameter value.
    const flat = JSON.stringify(params);
    expect(flat).not.toContain('7500');
    expect(flat).not.toContain('250');
  });

  it('emits commercial_cta_click and adds affiliate_redirect only with a destination', () => {
    const a = installWindow(true);
    analytics.trackCommercialCtaClick({
      offerState: 'waiting_for_offer', landingPage: '/',
    });
    expect(a.calls.map((c) => c[1])).toEqual(['commercial_cta_click']);

    const b = installWindow(true);
    analytics.trackCommercialCtaClick({
      offerState: 'live', landingPage: '/', destinationHost: 'partner.example',
    });
    expect(b.calls.map((c) => c[1]))
      .toEqual(['commercial_cta_click', 'affiliate_redirect']);
  });

  it('carries market/country/calculator_type on every funnel event', () => {
    const { calls } = installWindow(true);
    const p = { salaryBand: 'x', savingBand: 'y', benefitType: 'ISENTO_TOTAL' as const };
    analytics.trackCalculatorStart();
    analytics.trackCalculatorComplete(p);
    analytics.trackResultView(p);
    analytics.trackCommercialCtaView({ offerState: 'live', landingPage: '/' });
    expect(calls).toHaveLength(4);
    for (const c of calls) {
      expect(c[2]).toMatchObject({
        market: 'BR', country: 'br', calculator_type: 'irrf_monthly',
      });
    }
  });
});
