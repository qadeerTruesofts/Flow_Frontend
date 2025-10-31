/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Optimize webpack configuration
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.git', '**/.next']
    }
    return config
  },
  // Disable image optimization during development
  images: {
    unoptimized: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig
