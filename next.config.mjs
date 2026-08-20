/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.calculadorair.online' }],
        destination: 'https://calculadorair.online/:path*',
        permanent: true,
      },
      // ---------------------------------------------------------------- 2026-08-20
      // Page-1 sprint. Three URLs were competing for one intent: the homepage
      // calculator, /calculadora-irrf-2026 and /calculo-ir-mensal. Search Console
      // showed the homepage — not the dedicated guides — taking the impressions for
      // "calculo ir mensal" (pos 46) and "calculadora do ir" (pos 48), which is what
      // cannibalisation looks like from the outside. The homepage is the tool, so it
      // keeps the intent and the two guides fold into it.
      {
        source: '/calculadora-irrf-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/calculo-ir-mensal',
        destination: '/',
        permanent: true,
      },
      // Salary amounts retired on 2026-08-19. Google autocomplete suggests all of
      // them, but running the 2026 engine across the range shows they resolve to
      // an answer a kept page already gives: R$ 0,00 below the exemption, and an
      // identical R$ 12,73 saving everywhere above the redutor ceiling. None had
      // been crawled, so they are folded into their nearest surviving neighbour
      // rather than left as a near-duplicate set for Google to wade through.
      {
        source: '/imposto-de-renda-salario-1500',
        destination: '/imposto-de-renda-salario-3000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-2000',
        destination: '/imposto-de-renda-salario-3000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-2500',
        destination: '/imposto-de-renda-salario-3000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-7400',
        destination: '/imposto-de-renda-salario-7350',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-7500',
        destination: '/imposto-de-renda-salario-7350',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-7600',
        destination: '/imposto-de-renda-salario-7350',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-7700',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-7800',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-7900',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8100',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8200',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8300',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8400',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8500',
        destination: '/imposto-de-renda-salario-8000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8600',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8700',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8800',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-8900',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9100',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9200',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9300',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9400',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9500',
        destination: '/imposto-de-renda-salario-9000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9600',
        destination: '/imposto-de-renda-salario-10000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9700',
        destination: '/imposto-de-renda-salario-10000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9800',
        destination: '/imposto-de-renda-salario-10000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-9900',
        destination: '/imposto-de-renda-salario-10000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-11000',
        destination: '/imposto-de-renda-salario-10000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-13000',
        destination: '/imposto-de-renda-salario-12000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-14000',
        destination: '/imposto-de-renda-salario-15000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-16000',
        destination: '/imposto-de-renda-salario-15000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-17000',
        destination: '/imposto-de-renda-salario-15000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-18000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-19000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-22000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-25000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-30000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-35000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-40000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-50000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-100000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
      {
        source: '/imposto-de-renda-salario-200000',
        destination: '/imposto-de-renda-salario-20000',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
