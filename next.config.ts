/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export', // 👈 replaces next export
  basePath: isProd ? '/english-lessons-maze' : '',
  assetPrefix: isProd ? '/english-lessons-maze/' : '',
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true, // 👈 required for static export
  },
};

export default nextConfig;
