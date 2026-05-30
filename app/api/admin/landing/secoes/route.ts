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

// PATCH — alterar visibilidade (oculta/visível)
export async function PATCH(request: NextRequest) {
  const user = await verificarAdmin()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { secao, oculta } = await request.json()
  if (!secao) return NextResponse.json({ error: 'secao é obrigatória' }, { status: 400 })
  if (typeof oculta !== 'boolean') return NextResponse.json({ error: 'oculta deve ser boolean' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('landing_secoes_config')
    .upsert({ secao, oculta, updated_at: new Date().toISOString() }, { onConflict: 'secao' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — exclui TODOS os campos de uma seção (irreversível)
// Body: { secao, confirmacao }
//   confirmacao deve ser exatamente o nome da seção (proteção contra clique acidental)
export async function DELETE(request: NextRequest) {
  const user = await verificarAdmin()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { secao, confirmacao } = await request.json()
  if (!secao) return NextResponse.json({ error: 'secao é obrigatória' }, { status: 400 })
  if (confirmacao !== secao) {
    return NextResponse.json({
      error: 'Confirmação não bate com o nome da seção',
    }, { status: 400 })
  }

  // 1) Apaga os textos da seção
  const { error: errTexto, count } = await supabaseAdmin
    .from('landing_content')
    .delete({ count: 'exact' })
    .eq('secao', secao)

  if (errTexto) return NextResponse.json({ error: errTexto.message }, { status: 500 })

  // 2) Remove a config (se existia)
  await supabaseAdmin
    .from('landing_secoes_config')
    .delete()
    .eq('secao', secao)

  return NextResponse.json({ ok: true, removidos: count ?? 0 })
}
