import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config options
  images: {
    qualities: [25, 50, 75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'ordering.eatx.pk',
      },
    ],
  },
};

export default withNextIntl(nextConfig);