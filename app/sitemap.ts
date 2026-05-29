import { MetadataRoute } from 'next'
import { getLandingApps } from '@/lib/landing-apps'

const SITE_URL = 'https://matematico.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas da landing
  const paginasFixas: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Subdomínios dos apps ativos (pegos do banco)
  let appsUrls: MetadataRoute.Sitemap = []
  try {
    const apps = await getLandingApps()
    appsUrls = apps
      .filter((a) => a.status === 'ativo' && a.url)
      .map((a) => ({
        url: a.url!,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  } catch {
    // Se o banco falhar, segue só com as fixas
  }

  return [...paginasFixas, ...appsUrls]
}
