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
    ];
  },
};

export default nextConfig;
