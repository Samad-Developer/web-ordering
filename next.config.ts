import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'ordering.eatx.pk',
      },
    ],
  },
};

export default withNextIntl(nextConfig);