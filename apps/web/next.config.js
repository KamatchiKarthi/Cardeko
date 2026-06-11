/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cardeko/types'],
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
