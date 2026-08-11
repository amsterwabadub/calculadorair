import { MetadataRoute } from 'next';
import { SALARY_VALUES, salarySlug } from '@/data/salary-pages';

const LAST_MODIFIED = new Date('2026-08-11');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculadorair.online';

  const salaryEntries: MetadataRoute.Sitemap = SALARY_VALUES.map((s) => ({
    url: `${baseUrl}/${salarySlug(s)}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: s >= 5000 && s <= 8000 ? 0.9 : 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = [
    'nova-tabela-imposto-de-renda-2026',
    'isencao-imposto-de-renda-2026',
    'calculadora-irrf-2026',
    'quanto-vou-economizar-imposto-de-renda-2026',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contador`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...guideEntries,
    ...salaryEntries,
  ];
}
