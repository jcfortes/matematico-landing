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

// PATCH — editar contratante (nome, email, status, prazo de uso)
export async function PATCH(request: NextRequest) {
  const user = await verificarEquipe()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await request.json()
  const { id, nome, email, status, prazo_tipo, prazo_quantidade, prazo_inicio } = body
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  if (email) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  const updates: Record<string, unknown> = {}
  if (nome !== undefined) updates.nome = nome
  if (email !== undefined) updates.email = email
  if (status !== undefined) updates.status = status

  // Campos de prazo (aceita atualização parcial)
  if (prazo_tipo !== undefined) {
    if (!['dias', 'meses', 'anos', 'indeterminado'].includes(prazo_tipo)) {
      return NextResponse.json({ error: 'prazo_tipo inválido' }, { status: 400 })
    }
    updates.prazo_tipo = prazo_tipo
    // Se indeterminado, zera a quantidade
    if (prazo_tipo === 'indeterminado') {
      updates.prazo_quantidade = null
    }
  }
  if (prazo_quantidade !== undefined && prazo_tipo !== 'indeterminado') {
    updates.prazo_quantidade = prazo_quantidade === null ? null : Number(prazo_quantidade)
  }
  if (prazo_inicio !== undefined) {
    updates.prazo_inicio = prazo_inicio
  }

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
