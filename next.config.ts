import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'i.redd.it' },
      { hostname: 'preview.redd.it' },
      { hostname: 'i.ytimg.com' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
