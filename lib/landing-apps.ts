// ============================================================
// Helper para ler apps editáveis da landing (CMS Fase 2)
// ============================================================
// Busca os apps da tabela `landing_apps`. Filtra automaticamente
// os de status 'oculto'. Se a query falhar (banco offline, RLS
// bloqueando, etc.), retorna um array de fallback com os apps
// hardcoded.
// ============================================================

import { supabase } from './supabase'

export type LandingAppStatus = 'ativo' | 'breve' | 'oculto'

export interface LandingApp {
  id: string
  slug: string
  ordem: number
  status: LandingAppStatus
  emoji: string | null
  tagline: string | null
  nome: string
  descricao: string | null
  recursos: string[]
  url: string | null
}

// Fallback caso o banco esteja inacessível
const APPS_FALLBACK: LandingApp[] = [
  {
    id: 'fallback-1', slug: 'atualizacao', ordem: 10, status: 'ativo', emoji: '📈',
    tagline: 'ATUALIZAÇÃO DE VALORES',
    nome: 'Sistema de Atualização Monetária',
    descricao: 'Atualize valores pela inflação com IPCA, IGPM, INPC e outros índices. Calcule juros, multas e correções monetárias com precisão.',
    recursos: ['IPCA, IGPM, INPC', 'Juros e multas', 'Série histórica', 'Exportar laudo'],
    url: 'https://atualizacao.matematico.com.br',
  },
  {
    id: 'fallback-2', slug: 'amortizacao', ordem: 20, status: 'ativo', emoji: '📊',
    tagline: 'SISTEMA DE FINANCIAMENTOS',
    nome: 'Sistema de Amortização e Financiamento',
    descricao: 'Calcule cronogramas completos de amortização pelo sistema Price, SAC ou Variável. Simule carência, balões e veja o custo efetivo total.',
    recursos: ['Price, SAC e Variável', 'Pagamentos balão', 'Carência', 'Exportar PDF e Excel'],
    url: 'https://amortizacao.matematico.com.br',
  },
  {
    id: 'fallback-3', slug: 'avaliacao', ordem: 30, status: 'breve', emoji: '🏢',
    tagline: 'AVALIAÇÃO DE EMPRESAS',
    nome: 'Avaliação',
    descricao: 'Valuation completo pelo método do fluxo de caixa descontado, múltiplos de mercado e patrimônio líquido ajustado.',
    recursos: ['Fluxo de caixa descontado', 'Múltiplos de mercado', 'Relatório executivo', 'Comparativo setorial'],
    url: null,
  },
]

export async function getLandingApps(opts?: { incluirOcultos?: boolean }): Promise<LandingApp[]> {
  try {
    let query = supabase
      .from('landing_apps')
      .select('*')
      .order('ordem')
    if (!opts?.incluirOcultos) {
      query = query.in('status', ['ativo', 'breve'])
    }
    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return APPS_FALLBACK
    }
    // Normalizar tipos
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      ordem: row.ordem,
      status: row.status as LandingAppStatus,
      emoji: row.emoji,
      tagline: row.tagline,
      nome: row.nome,
      descricao: row.descricao,
      recursos: Array.isArray(row.recursos) ? row.recursos : [],
      url: row.url,
    }))
  } catch {
    return APPS_FALLBACK
  }
}

// ============================================================
// Estilo derivado do status (NÃO armazenado no banco)
// ============================================================
// Por consistência de design, as classes visuais são geradas
// no código a partir do status. Admin só edita conteúdo.
// ============================================================

export function appCorPorStatus(status: LandingAppStatus) {
  if (status === 'ativo') {
    return {
      corBorda: 'border-emerald-500/30',
      corGrad: 'from-emerald-500/15 to-emerald-500/3',
      corCheck: 'text-emerald-400',
      corBtn: 'bg-emerald-600 hover:bg-emerald-500',
      corTag: 'text-emerald-400',
    }
  }
  return {
    corBorda: 'border-white/10',
    corGrad: 'from-white/3 to-white/1',
    corCheck: 'text-white/40',
    corBtn: '',
    corTag: 'text-white/40',
  }
}
