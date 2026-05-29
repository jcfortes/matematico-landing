// ============================================================
// Helper para ler conteúdo editável da LP
// ============================================================
// Busca os textos da landing armazenados em `landing_content`.
// Se a query falhar (ex.: tabela não existe ainda, banco offline),
// retorna o `valor_padrao` ou um fallback hardcoded.
//
// Uso típico (Server Component):
//   const c = await getLandingContent()
//   <h1>{c('hero.tagline', 'Clareza Financeira.')}</h1>
// ============================================================

import { supabase } from './supabase'

export interface LandingContentRow {
  key: string
  secao: string
  ordem: number
  tipo: string
  valor: string
  valor_padrao: string
  descricao: string | null
}

export async function getLandingContent(): Promise<(key: string, fallback?: string) => string> {
  try {
    const { data, error } = await supabase
      .from('landing_content')
      .select('key, valor, valor_padrao')
    if (error || !data) {
      // Falha silenciosa — retorna função que usa só fallback hardcoded
      return (_, fallback) => fallback ?? ''
    }
    const mapa = new Map<string, { valor: string; valor_padrao: string }>()
    for (const row of data) {
      mapa.set(row.key, { valor: row.valor, valor_padrao: row.valor_padrao })
    }
    return (key: string, fallback?: string) => {
      const r = mapa.get(key)
      if (r && r.valor) return r.valor
      if (r && r.valor_padrao) return r.valor_padrao
      return fallback ?? ''
    }
  } catch {
    return (_, fallback) => fallback ?? ''
  }
}
