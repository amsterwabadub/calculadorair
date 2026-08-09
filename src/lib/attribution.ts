'use client';

export interface AttributionData {
  source: string;
  medium: string;
  campaign: string;
  landingPage: string;
  firstLandingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
}

const ATTRIBUTION_STORAGE_KEY = 'calculadorair_attribution_v1';

export function captureAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      source: 'direct',
      medium: 'none',
      campaign: '(not set)',
      landingPage: '/',
      firstLandingPage: '/',
      referrer: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      gclid: '',
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source') || '';
  const utmMedium = urlParams.get('utm_medium') || '';
  const utmCampaign = urlParams.get('utm_campaign') || '';
  const utmContent = urlParams.get('utm_content') || '';
  const utmTerm = urlParams.get('utm_term') || '';
  const gclid = urlParams.get('gclid') || '';

  const rawReferrer = document.referrer || '';
  let source = 'direct';
  let medium = 'none';

  if (utmSource) {
    source = utmSource;
    medium = utmMedium || 'cpc';
  } else if (gclid) {
    source = 'google';
    medium = 'cpc';
  } else if (rawReferrer) {
    try {
      const refUrl = new URL(rawReferrer);
      const host = refUrl.hostname.toLowerCase();
      if (host.includes('google.')) {
        source = 'google';
        medium = 'organic';
      } else if (host.includes('bing.') || host.includes('yahoo.') || host.includes('duckduckgo.')) {
        source = host.split('.')[1] || host;
        medium = 'organic';
      } else if (host.includes('facebook.') || host.includes('instagram.') || host.includes('t.co') || host.includes('linkedin.')) {
        source = host;
        medium = 'social';
      } else {
        source = host;
        medium = 'referral';
      }
    } catch {
      source = 'referral';
      medium = 'referral';
    }
  }

  const currentPath = window.location.pathname;

  // Retrieve previous stored first landing page if available
  let firstLandingPage = currentPath;
  try {
    const storedStr = localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (storedStr) {
      const parsed = JSON.parse(storedStr);
      if (parsed.firstLandingPage) {
        firstLandingPage = parsed.firstLandingPage;
      }
    }
  } catch {
    // Ignore storage errors
  }

  const data: AttributionData = {
    source,
    medium,
    campaign: utmCampaign || '(not set)',
    landingPage: currentPath,
    firstLandingPage,
    referrer: rawReferrer,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    gclid,
  };

  try {
    const payload = JSON.stringify(data);
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, payload);
    if (!localStorage.getItem(ATTRIBUTION_STORAGE_KEY)) {
      localStorage.setItem(ATTRIBUTION_STORAGE_KEY, payload);
    }
  } catch {
    // Storage quota or privacy mode
  }

  return data;
}

export function getStoredAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return captureAttribution();
  }

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to capture
  }

  return captureAttribution();
}
