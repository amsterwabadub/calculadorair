declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type GAEventName =
  | 'calculator_view'
  | 'calculator_start'
  | 'calculator_complete'
  | 'result_view'
  | 'outbound_click'
  | 'lead_click'
  | 'share_result';

export interface GAEventParams {
  country: string;
  calculator_id: string;
  page_path: string;
  calculator_type: string;
  [key: string]: any;
}

export const trackGA4Event = (eventName: GAEventName, params: GAEventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Ensure no PII or raw salary numbers are passed
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackCalculatorView = (country: string, calculatorId: string, pagePath: string) => {
  trackGA4Event('calculator_view', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
  });
};

export const trackCalculatorStart = (country: string, calculatorId: string, pagePath: string) => {
  trackGA4Event('calculator_start', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
  });
};

export const trackCalculatorComplete = (country: string, calculatorId: string, pagePath: string) => {
  trackGA4Event('calculator_complete', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
  });
};

export const trackResultView = (country: string, calculatorId: string, pagePath: string) => {
  trackGA4Event('result_view', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
  });
};

export const trackShareResult = (country: string, calculatorId: string, pagePath: string) => {
  trackGA4Event('share_result', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
  });
};

export const trackOutboundClick = (country: string, calculatorId: string, pagePath: string, destinationUrl: string) => {
  trackGA4Event('outbound_click', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
    destination_url: destinationUrl,
  });
};

export const trackLeadClick = (country: string, calculatorId: string, pagePath: string, leadType: string) => {
  trackGA4Event('lead_click', {
    country,
    calculator_id: calculatorId,
    page_path: pagePath,
    calculator_type: 'tax_payroll',
    lead_type: leadType,
  });
};
