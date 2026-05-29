import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (typeof body.slug === 'string') payload.slug = body.slug.trim()
  if (Number.isFinite(body.ordem)) payload.ordem = body.ordem
  if (['ativo', 'breve', 'oculto'].includes(body.status)) payload.status = body.status
  if (body.emoji !== undefined) payload.emoji = body.emoji
  if (body.tagline !== undefined) payload.tagline = body.tagline
  if (typeof body.nome === 'string') payload.nome = body.nome.trim()
  if (body.descricao !== undefined) payload.descricao = body.descricao
  if (Array.isArray(body.recursos)) payload.recursos = body.recursos
  if (body.url !== undefined) payload.url = body.url

  const { data, error } = await supabaseAdmin
    .from('landing_apps')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabaseAdmin
    .from('landing_apps')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
