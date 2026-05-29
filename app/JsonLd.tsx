// Structured Data (JSON-LD) — ajuda o Google a mostrar rich results
// (logo, sitelinks, descrição estruturada) ao indexar a landing.

interface AppData {
  nome: string
  descricao: string | null
  url: string | null
  status: string
}

export function JsonLd({ apps }: { apps: AppData[] }) {
  const organizacao = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Matemático.com.br',
    url: 'https://matematico.com.br',
    logo: 'https://matematico.com.br/og-image.png',
    description: 'Plataforma de calculadoras financeiras profissionais para atualização monetária, financiamentos e avaliação.',
    sameAs: [],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Matemático.com.br',
    url: 'https://matematico.com.br',
    inLanguage: 'pt-BR',
  }

  const aplicativos = apps
    .filter((a) => a.status === 'ativo' && a.url)
    .map((a) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: a.nome,
      description: a.descricao ?? undefined,
      url: a.url ?? undefined,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: 'pt-BR',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
      },
    }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacao) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      {aplicativos.map((app) => (
        <script
          key={app.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }}
        />
      ))}
    </>
  )
}
