/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // This is important for Netlify deployment
  output: 'standalone',
};

module.exports = nextConfig;
