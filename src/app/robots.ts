import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/', '/dashboard', '/acesso'],
      },
    ],
    sitemap: 'https://carangoladigital.com.br/sitemap.xml',
  }
}
