import { describe, it, expect } from 'vitest';
import { buildSubId, salaryBandFor, withSubId } from '../sub-id';

describe('salaryBandFor', () => {
  it('maps to the bands the 2026 rules actually create', () => {
    expect(salaryBandFor(4000)).toBe('isento');
    expect(salaryBandFor(4999)).toBe('isento');
    expect(salaryBandFor(5000)).toBe('redutor');
    expect(salaryBandFor(7350)).toBe('redutor');
    expect(salaryBandFor(7351)).toBe('tabela');
    expect(salaryBandFor(20000)).toBe('tabela');
    expect(salaryBandFor(20001)).toBe('alta');
  });

  it('returns na where there is no salary context', () => {
    expect(salaryBandFor(undefined)).toBe('na');
    expect(salaryBandFor(Number.NaN)).toBe('na');
  });
});

describe('buildSubId', () => {
  const at = new Date(2026, 7, 19);

  it('encodes source, page, band and date', () => {
    const id = buildSubId('/imposto-de-renda-salario-6300', 6300, at);
    expect(id).toMatch(/^cai-imposto-de-renda-salario-6300-redutor-20260819-[a-z0-9]{6}$/);
  });

  it('calls the root home', () => {
    expect(buildSubId('/', undefined, at)).toMatch(/^cai-home-na-20260819-/);
  });

  it('carries no personal data and stays short enough for a query string', () => {
    const id = buildSubId('/quanto-vou-economizar-imposto-de-renda-2026', undefined, at);
    expect(id.length).toBeLessThan(80);
    expect(id).not.toMatch(/[^a-z0-9-]/);
  });

  it('distinguishes two clicks from the same page on the same day', () => {
    const a = buildSubId('/', 5000, at);
    const b = buildSubId('/', 5000, at);
    expect(a).not.toBe(b);
  });
});

describe('withSubId', () => {
  it('uses whatever parameter name the partner requires', () => {
    expect(withSubId('https://p.example/x', 'subid', 'cai-home-na-20260819-abc123'))
      .toBe('https://p.example/x?subid=cai-home-na-20260819-abc123');
    expect(withSubId('https://p.example/x?a=1', 'aff_sub', 'cai-home-na-20260819-abc123'))
      .toBe('https://p.example/x?a=1&aff_sub=cai-home-na-20260819-abc123');
  });

  it('overwrites rather than duplicating an existing value', () => {
    expect(withSubId('https://p.example/x?subid=old', 'subid', 'new'))
      .toBe('https://p.example/x?subid=new');
  });

  it('returns a malformed url untouched instead of throwing inside a click handler', () => {
    expect(withSubId('not a url', 'subid', 'x')).toBe('not a url');
  });
});
