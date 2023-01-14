/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
    '@heroicons/react/20/solid': {
      transform: '@heroicons/react/20/solid/{{member}}',
    },
  },
  images: {
    domains: ['images.unsplash.com', 'tailwindui.com'],
  },
}

module.exports = nextConfig
