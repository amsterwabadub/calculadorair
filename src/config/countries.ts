export interface CountryConfig {
  code: 'ke' | 'mx' | 'ma' | 'co';
  name: string;
  nativeName: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  language: string;
  languageCode: 'en' | 'es' | 'fr';
  primarySlug: string;
  popularSearch: string;
  accentColor: string;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  ke: {
    code: 'ke',
    name: 'Kenya',
    nativeName: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    currencySymbol: 'KSh',
    language: 'English',
    languageCode: 'en',
    primarySlug: 'net-salary-calculator',
    popularSearch: 'PAYE & Net Salary 2026',
    accentColor: '#16a34a',
  },
  mx: {
    code: 'mx',
    name: 'Mexico',
    nativeName: 'México',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: '$',
    language: 'Spanish',
    languageCode: 'es',
    primarySlug: 'aguinaldo-calculator',
    popularSearch: 'Aguinaldo Neto 2026',
    accentColor: '#dc2626',
  },
  ma: {
    code: 'ma',
    name: 'Morocco',
    nativeName: 'Maroc',
    flag: '🇲🇦',
    currency: 'MAD',
    currencySymbol: 'DH',
    language: 'French',
    languageCode: 'fr',
    primarySlug: 'salaire-net-calculateur',
    popularSearch: 'Salaire Net & IR 2026',
    accentColor: '#c026d3',
  },
  co: {
    code: 'co',
    name: 'Colombia',
    nativeName: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    currencySymbol: '$',
    language: 'Spanish',
    languageCode: 'es',
    primarySlug: 'retefuente-calculadora',
    popularSearch: 'Retención en la Fuente 2026',
    accentColor: '#ca8a04',
  },
};
