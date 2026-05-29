// Lista centralizada das keywords que o site mostra ao Google.
// Usada em app/layout.tsx (no <meta keywords>) e em /admin/seo
// (para o admin ver a lista completa).

export const SEO_KEYWORDS_POR_CATEGORIA = {
  'Atualização Monetária': [
    'atualização monetária',
    'correção monetária',
    'IPCA',
    'IGPM',
    'INPC',
    'INCC',
    'SELIC',
    'CDI',
    'TR',
    'calculadora de atualização monetária',
    'juros de mora',
    'multa moratória',
    'honorários advocatícios',
  ],
  'Amortização e Financiamento': [
    'amortização',
    'sistema price',
    'tabela price',
    'sistema SAC',
    'sistema de amortização constante',
    'amortização variável',
    'balões',
    'carência',
    'financiamento imobiliário',
    'financiamento de veículo',
    'CET',
    'custo efetivo total',
    'IOF',
    'calculadora de financiamento',
    'cronograma de amortização',
  ],
  'Geral / Matemática Financeira': [
    'matemática financeira',
    'ferramentas financeiras',
    'calculadora financeira profissional',
    'advogados',
    'contadores',
    'consultores financeiros',
    'perito',
    'valuation',
    'avaliação de empresas',
  ],
} as const

export const SEO_KEYWORDS_FLAT: string[] = Object.values(SEO_KEYWORDS_POR_CATEGORIA).flat()
