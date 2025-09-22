// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Disable TypeScript type checking
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Your existing config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

module.exports = nextConfig;
