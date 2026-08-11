import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Defence in depth: no admin or API surface should ever be crawled or
      // indexed, whether or not one currently exists.
      disallow: ['/admin', '/admin/', '/api', '/api/'],
    },
    sitemap: 'https://calculadorair.online/sitemap.xml',
  };
}
