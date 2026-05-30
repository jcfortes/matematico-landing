import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single()

  if (!['administrador', 'gestor'].includes(profile?.role ?? '')) return null
  return user
}

function gerarSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) || 'secao'
}

// POST — criar nova seção customizada
export async function POST(request: NextRequest) {
  const user = await verificarAdmin()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await request.json()
  const {
    titulo, subtitulo, descricao,
    imagem_url, imagem_posicao,
    cta_texto, cta_url,
    posicao_apos, ordem,
  } = body

  if (!titulo) return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })

  let slug = gerarSlug(titulo)
  // Se já existe, adiciona sufixo numérico
  const { data: existente } = await supabaseAdmin
    .from('landing_secoes_custom')
    .select('slug')
    .like('slug', `${slug}%`)
  if (existente && existente.length > 0) {
    const slugsUsados = new Set(existente.map((e: { slug: string }) => e.slug))
    if (slugsUsados.has(slug)) {
      let n = 2
      while (slugsUsados.has(`${slug}-${n}`)) n++
      slug = `${slug}-${n}`
    }
  }

  const { data, error } = await supabaseAdmin
    .from('landing_secoes_custom')
    .insert({
      slug,
      titulo,
      subtitulo: subtitulo || null,
      descricao: descricao || null,
      imagem_url: imagem_url || null,
      imagem_posicao: imagem_posicao || 'sem',
      cta_texto: cta_texto || null,
      cta_url: cta_url || null,
      posicao_apos: posicao_apos || 'cta',
      ordem: ordem ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}

// PATCH — editar seção existente
export async function PATCH(request: NextRequest) {
  const user = await verificarAdmin()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id, ...campos } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  const editaveis = [
    'titulo', 'subtitulo', 'descricao',
    'imagem_url', 'imagem_posicao',
    'cta_texto', 'cta_url',
    'posicao_apos', 'ordem', 'oculta',
  ]
  for (const k of editaveis) {
    if (campos[k] !== undefined) updates[k] = campos[k]
  }
  updates.updated_at = new Date().toISOString()

  const { error } = await supabaseAdmin
    .from('landing_secoes_custom')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — remover seção
export async function DELETE(request: NextRequest) {
  const user = await verificarAdmin()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('landing_secoes_custom')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
