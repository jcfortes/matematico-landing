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

  if (profile?.role !== 'administrador') return null
  return user
}

// POST — criar novo membro
export async function POST(request: NextRequest) {
  const admin = await verificarAdmin()
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { email, role } = await request.json()

  if (!email || !role) {
    return NextResponse.json({ error: 'Email e perfil são obrigatórios' }, { status: 400 })
  }

  if (!['administrador', 'gestor'].includes(role)) {
    return NextResponse.json({ error: 'Perfil inválido' }, { status: 400 })
  }

  const senhaTemp = Math.random().toString(36).slice(-10) + 'Aa1!'
  const { data: novoUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senhaTemp,
    email_confirm: true,
  })

  if (createError || !novoUser.user) {
    return NextResponse.json({ error: createError?.message ?? 'Erro ao criar usuário' }, { status: 400 })
  }

  await new Promise((r) => setTimeout(r, 600))

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', novoUser.user.id)

  if (updateError) {
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: novoUser.user.id, nome: email, email, role }, { onConflict: 'id' })

    if (upsertError) {
      return NextResponse.json({ error: 'Usuário criado, mas erro ao definir perfil: ' + upsertError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, id: novoUser.user.id, senhaTemp })
}

// PATCH — editar membro (nome, email, role)
export async function PATCH(request: NextRequest) {
  const admin = await verificarAdmin()
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id, nome, email, role } = await request.json()

  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  // Valida role se fornecido
  if (role && !['administrador', 'gestor'].includes(role)) {
    return NextResponse.json({ error: 'Role inválido' }, { status: 400 })
  }

  // Não deixa alterar o próprio role
  if (role && id === admin.id) {
    return NextResponse.json({ error: 'Você não pode alterar seu próprio perfil' }, { status: 400 })
  }

  // Atualiza email no Auth se fornecido
  if (email) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Atualiza profile
  const updates: Record<string, string> = {}
  if (nome) updates.nome = nome
  if (email) updates.email = email
  if (role) updates.role = role

  if (Object.keys(updates).length > 0) {
    const { error } = await supabaseAdmin.from('profiles').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE — excluir membro
export async function DELETE(request: NextRequest) {
  const admin = await verificarAdmin()
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await request.json()

  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  // Não deixa excluir a si mesmo
  if (id === admin.id) {
    return NextResponse.json({ error: 'Você não pode excluir sua própria conta' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
