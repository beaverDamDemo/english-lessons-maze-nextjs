const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/english-lessons-maze/' : '',
  basePath: isProd ? '/english-lessons-maze' : '',
  output: 'export'
};

export default nextConfig;