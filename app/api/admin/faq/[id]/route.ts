import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo } = body

  const payload: Record<string, unknown> = {
    categoria, pergunta, resposta, ordem, ativo,
    assunto_id: assunto_id || null,
  }
  if (tipo === 'base' || tipo === 'faq') payload.tipo = tipo

  const { data, error } = await supabaseAdmin
    .from('faq')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('faq').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
