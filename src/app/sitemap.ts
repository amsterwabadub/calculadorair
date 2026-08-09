import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculadorair2026.com.br';

  const salaries = [3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7350, 8000, 9000, 10000, 12000, 15000, 20000];

  const salaryEntries: MetadataRoute.Sitemap = salaries.map((s) => ({
    url: `${baseUrl}/imposto-de-renda-salario-${s}`,
    lastModified: new Date('2026-08-08'),
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
    lastModified: new Date('2026-08-08'),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-08-08'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contador`,
      lastModified: new Date('2026-08-08'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...guideEntries,
    ...salaryEntries,
  ];
}
