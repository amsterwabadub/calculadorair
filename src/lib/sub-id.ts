/**
 * Sub-id attribution for the commercial CTA.
 *
 * A CPL or affiliate deal is only settleable if both sides can point at the same
 * identifier for a conversion. Without one, the partner reports "we closed 4
 * clients this month" and we have no way to check that against our own click
 * log — which is how referral disputes start and how a good deal quietly
 * becomes an unpaid one.
 *
 * The id is deliberately free of personal data. It carries only what a partner
 * needs to price and verify traffic: which page sent the visitor, which salary
 * band they were looking at, and when. No cookie, no fingerprint, no identifier
 * that survives beyond the click.
 *
 * Format: cai-<page>-<band>-<yyyymmdd>-<nonce>
 *   cai       fixed source tag (calculadorair) so a partner can separate our
 *             traffic from their other channels
 *   page      the landing slug, normalised
 *   band      salary band, or "na" on pages with no salary context
 *   yyyymmdd  click date, so a partner's monthly settlement can be reconciled
 *   nonce     6 chars, so two clicks from the same page on the same day stay
 *             distinguishable
 */

const MAX_PAGE_SEGMENT = 32;

/** Salary bands mirror the ones the 2026 rules actually create. */
export function salaryBandFor(salary?: number): string {
  if (salary === undefined || Number.isNaN(salary)) return 'na';
  if (salary < 5000) return 'isento';
  if (salary <= 7350) return 'redutor';
  if (salary <= 20000) return 'tabela';
  return 'alta';
}

function normalisePage(landingPage: string): string {
  const slug = landingPage.replace(/^\/+|\/+$/g, '') || 'home';
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, MAX_PAGE_SEGMENT)
    .replace(/-$/, '');
}

function nonce(): string {
  // Not security-sensitive: it only has to keep two clicks apart.
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function buildSubId(
  landingPage: string,
  salary?: number,
  now: Date = new Date(),
): string {
  const yyyymmdd =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, '0')}` +
    `${String(now.getDate()).padStart(2, '0')}`;
  return ['cai', normalisePage(landingPage), salaryBandFor(salary), yyyymmdd, nonce()].join('-');
}

/**
 * Appends the sub-id under whatever parameter name the partner uses. Networks
 * disagree — subid, sub_id, aff_sub, utm_content — so the name is configuration,
 * not a constant, and an unknown partner should not require a code change.
 */
export function withSubId(url: string, paramName: string, subId: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set(paramName, subId);
    return parsed.toString();
  } catch {
    // A malformed offer URL should surface as an unmodified link rather than a
    // thrown error inside a click handler.
    return url;
  }
}
