import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET — lista TODOS os apps (incluindo ocultos)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('landing_apps')
    .select('*')
    .order('ordem')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST — cria novo app
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { slug, ordem, status, emoji, tagline, nome, descricao, recursos, url } = body

  if (!slug?.trim() || !nome?.trim()) {
    return NextResponse.json({ error: 'slug e nome são obrigatórios' }, { status: 400 })
  }
  const statusNorm = ['ativo', 'breve', 'oculto'].includes(status) ? status : 'ativo'

  const { data, error } = await supabaseAdmin
    .from('landing_apps')
    .insert({
      slug: slug.trim(),
      ordem: Number.isFinite(ordem) ? ordem : 0,
      status: statusNorm,
      emoji: emoji ?? null,
      tagline: tagline ?? null,
      nome: nome.trim(),
      descricao: descricao ?? null,
      recursos: Array.isArray(recursos) ? recursos : [],
      url: url ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
