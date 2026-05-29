import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET — listar assuntos (filtrável por ?tipo=base|faq)
export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo')
  let query = supabaseAdmin
    .from('faq_assuntos')
    .select('id, nome, tipo')
    .order('nome')
  if (tipo === 'base' || tipo === 'faq') query = query.eq('tipo', tipo)
  const { data } = await query
  return NextResponse.json(data ?? [])
}

// POST — criar novo assunto
export async function POST(request: NextRequest) {
  const { nome, tipo } = await request.json()
  if (!nome?.trim()) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })
  const tipoNormalizado = tipo === 'faq' ? 'faq' : 'base'

  const { data, error } = await supabaseAdmin
    .from('faq_assuntos')
    .insert({ nome: nome.trim(), tipo: tipoNormalizado })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
