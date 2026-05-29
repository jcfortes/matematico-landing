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

// PATCH — editar contratante (nome, email)
export async function PATCH(request: NextRequest) {
  const user = await verificarEquipe()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id, nome, email, status } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  if (email) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  const updates: Record<string, string> = {}
  if (nome) updates.nome = nome
  if (email) updates.email = email
  if (status) updates.status = status

  if (Object.keys(updates).length > 0) {
    const { error } = await supabaseAdmin.from('profiles').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE — excluir contratante
export async function DELETE(request: NextRequest) {
  const user = await verificarEquipe()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
