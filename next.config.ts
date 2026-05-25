import type { NextConfig } from 'next'

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://www.google.com https://upload-widget.cloudinary.com https://static.cloudflareinsights.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://www.google.com https://*.carangoladigital.com.br https://carangoladigital.com.br https://storage.googleapis.com https://firebasestorage.googleapis.com https://*.cloudinary.com https://*.tile.openstreetmap.org https://ui-avatars.com https://lh3.googleusercontent.com https://res.cloudinary.com`,
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://cloudflareinsights.com https://*.cloudinary.com`,
  `frame-src 'self' https://upload-widget.cloudinary.com https://www.google.com`,
  `worker-src blob:`,
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ]
  },
  transpilePackages: ['react-leaflet', 'leaflet', 'geofire-common'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
}

export default nextConfig
