// ============================================================
// Helper para ler conteúdo editável da LP (Fase 1 + estilo)
// ============================================================
// Busca textos da landing armazenados em `landing_content`.
// Cada texto pode ter um `estilo` JSON com:
//   { tamanho, peso, cor, estilo, alinhamento }
// que é convertido em classes Tailwind no momento da renderização.
//
// Se a query falhar (banco offline, RLS bloqueando, etc.), retorna
// função que usa apenas o `fallback` hardcoded passado na chamada.
//
// Uso típico (Server Component):
//   const c = await getLandingContent()
//   <h1 className={`text-3xl ${c.classes('hero.tagline')}`}>
//     {c('hero.tagline', 'Clareza Financeira.')}
//   </h1>
// ============================================================

import { supabase } from './supabase'

// Mapas de opções → classes Tailwind
// IMPORTANTE: estas classes precisam aparecer como string literal
// em arquivos TS para serem detectadas pelo content scan do Tailwind.

export const ESTILO_TAMANHOS = {
  pequeno:    'text-sm',
  padrao:     '',
  grande:     'text-lg',
  grandeplus: 'text-xl',
  imenso:     'text-2xl',
} as const

export const ESTILO_PESOS = {
  normal:        'font-normal',
  medio:         'font-medium',
  negrito:       'font-semibold',
  extranegrito:  'font-bold',
} as const

export const ESTILO_CORES = {
  padrao: '',
  branca: 'text-white',
  verde:  'text-emerald-400',
  cinza:  'text-white/55',
  ambar:  'text-amber-400',
} as const

export const ESTILO_ESTILOS = {
  normal:  '',
  italico: 'italic',
} as const

export const ESTILO_ALINHAMENTOS = {
  padrao:   '',
  esquerda: 'text-left',
  centro:   'text-center',
  direita:  'text-right',
} as const

// Tipo do JSON `estilo` no banco
export interface EstiloConfig {
  tamanho?: keyof typeof ESTILO_TAMANHOS
  peso?: keyof typeof ESTILO_PESOS
  cor?: keyof typeof ESTILO_CORES
  estilo?: keyof typeof ESTILO_ESTILOS
  alinhamento?: keyof typeof ESTILO_ALINHAMENTOS
}

export function estiloParaClasses(estilo: unknown): string {
  if (!estilo || typeof estilo !== 'object') return ''
  const e = estilo as EstiloConfig
  const classes: string[] = []
  if (e.tamanho && ESTILO_TAMANHOS[e.tamanho]) classes.push(ESTILO_TAMANHOS[e.tamanho])
  if (e.peso && ESTILO_PESOS[e.peso]) classes.push(ESTILO_PESOS[e.peso])
  if (e.cor && ESTILO_CORES[e.cor]) classes.push(ESTILO_CORES[e.cor])
  if (e.estilo && ESTILO_ESTILOS[e.estilo]) classes.push(ESTILO_ESTILOS[e.estilo])
  if (e.alinhamento && ESTILO_ALINHAMENTOS[e.alinhamento]) classes.push(ESTILO_ALINHAMENTOS[e.alinhamento])
  return classes.filter(Boolean).join(' ')
}

export interface LandingContentRow {
  key: string
  secao: string
  ordem: number
  tipo: string
  valor: string
  valor_padrao: string
  estilo: unknown
  descricao: string | null
}

// Helper retornado: chamável como função + propriedade .classes()
export interface ContentHelper {
  (key: string, fallback?: string): string
  classes: (key: string) => string
}

export async function getLandingContent(): Promise<ContentHelper> {
  let mapa = new Map<string, { valor: string; valor_padrao: string; estilo: unknown }>()
  try {
    const { data, error } = await supabase
      .from('landing_content')
      .select('key, valor, valor_padrao, estilo')
    if (!error && data) {
      for (const row of data) {
        mapa.set(row.key, {
          valor: row.valor,
          valor_padrao: row.valor_padrao,
          estilo: row.estilo,
        })
      }
    }
  } catch {
    // Falha silenciosa — vai usar só fallback
    mapa = new Map()
  }

  const fn = ((key: string, fallback?: string) => {
    const r = mapa.get(key)
    if (r && r.valor) return r.valor
    if (r && r.valor_padrao) return r.valor_padrao
    return fallback ?? ''
  }) as ContentHelper

  fn.classes = (key: string) => {
    const r = mapa.get(key)
    return estiloParaClasses(r?.estilo)
  }

  return fn
}
