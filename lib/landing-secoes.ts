// ============================================================
// Helper para ler quais seções da landing estão ocultas
// ============================================================
// Cada seção tem uma chave única (Hero, Apps, Simulador, Menu, etc).
// Quando uma seção é marcada como oculta no admin, não é renderizada
// na landing pública.
//
// SEM registro em landing_secoes_config = visível por padrão.
// ============================================================

import { supabase } from './supabase'

export type SecoesOcultas = Set<string>

export async function getSecoesOcultas(): Promise<SecoesOcultas> {
  try {
    const { data } = await supabase
      .from('landing_secoes_config')
      .select('secao')
      .eq('oculta', true)
    return new Set((data ?? []).map((d: { secao: string }) => d.secao))
  } catch {
    return new Set()
  }
}

/** Verifica se uma seção específica está oculta */
export function secaoOculta(ocultas: SecoesOcultas, secao: string): boolean {
  return ocultas.has(secao)
}
