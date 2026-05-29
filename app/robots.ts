import { MetadataRoute } from 'next'

const SITE_URL = 'https://matematico.com.br'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',         // Painel administrativo
          '/api/',           // Endpoints internos
          '/auth/',          // Telas de login/cadastro
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
