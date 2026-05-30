import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

async function verificarEquipe() {
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

// POST — adicionar email
export async function POST(request: NextRequest) {
  const user = await verificarEquipe()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await request.json()
  const { email, nome, notif_prazo_expirado, notif_novo_cadastro, notif_erros } = body

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('admin_notificacoes')
    .insert({
      email: email.toLowerCase().trim(),
      nome: nome ?? null,
      notif_prazo_expirado: notif_prazo_expirado ?? true,
      notif_novo_cadastro: notif_novo_cadastro ?? false,
      notif_erros: notif_erros ?? false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Esse email já está cadastrado' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}

// PATCH — atualizar toggles
export async function PATCH(request: NextRequest) {
  const user = await verificarEquipe()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id, nome, notif_prazo_expirado, notif_novo_cadastro, notif_erros } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (nome !== undefined) updates.nome = nome
  if (notif_prazo_expirado !== undefined) updates.notif_prazo_expirado = notif_prazo_expirado
  if (notif_novo_cadastro !== undefined) updates.notif_novo_cadastro = notif_novo_cadastro
  if (notif_erros !== undefined) updates.notif_erros = notif_erros

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nada pra atualizar' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('admin_notificacoes')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — remover email
export async function DELETE(request: NextRequest) {
  const user = await verificarEquipe()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('admin_notificacoes')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
