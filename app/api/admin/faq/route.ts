import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo')   // 'base' | 'faq' | null
  let query = supabaseAdmin
    .from('faq')
    .select('*, faq_assuntos(id, nome)')
    .order('categoria')
    .order('ordem')
    .order('created_at')

  if (tipo === 'base' || tipo === 'faq') {
    query = query.eq('tipo', tipo)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo } = body

  if (!categoria || !pergunta || !resposta) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }
  const tipoNormalizado = tipo === 'faq' ? 'faq' : 'base'

  const { data, error } = await supabaseAdmin
    .from('faq')
    .insert({
      categoria, pergunta, resposta,
      ordem: ordem ?? 0,
      ativo: ativo ?? true,
      assunto_id: assunto_id || null,
      tipo: tipoNormalizado,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
