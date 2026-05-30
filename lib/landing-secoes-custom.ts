// ============================================================
// Helper para ler seções customizadas da landing
// ============================================================
// Seções criadas pelo admin via /admin/landing/secoes-custom.
// São renderizadas na landing dinamicamente, ao redor das seções
// hardcoded (Hero, Apps, Diferenciais, etc).
//
// Sem registros = nenhuma seção custom (default).
// ============================================================

import { supabase } from './supabase'

export interface SecaoCustom {
  id: string
  slug: string
  titulo: string
  subtitulo: string | null
  descricao: string | null
  imagem_url: string | null
  imagem_posicao: 'sem' | 'topo' | 'esquerda' | 'direita'
  cta_texto: string | null
  cta_url: string | null
  posicao_apos: string
  ordem: number
  oculta: boolean
}

export type SecoesPorPosicao = Record<string, SecaoCustom[]>

/**
 * Retorna todas as seções customizadas agrupadas pela posição onde devem renderizar.
 * Já filtra ocultas e ordena por `ordem`.
 *
 * Posições válidas: 'hero', 'simulador', 'apps', 'diferenciais', 'cta', 'base_faq', 'contato', 'fim'
 */
export async function getSecoesCustomPorPosicao(): Promise<SecoesPorPosicao> {
  try {
    const { data, error } = await supabase
      .from('landing_secoes_custom')
      .select('*')
      .eq('oculta', false)
      .order('posicao_apos')
      .order('ordem')

    if (error || !data) return {}

    const grupos: SecoesPorPosicao = {}
    for (const s of data as SecaoCustom[]) {
      if (!grupos[s.posicao_apos]) grupos[s.posicao_apos] = []
      grupos[s.posicao_apos].push(s)
    }
    return grupos
  } catch {
    return {}
  }
}
