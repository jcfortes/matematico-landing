import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'administrador') return null
  return user
}

// GET — listar todos os perfis com suas permissões
export async function GET() {
  const { data: perfis } = await supabaseAdmin
    .from('perfis')
    .select('id, nome, label, created_at, permissoes(pagina)')
    .order('created_at')

  return NextResponse.json(perfis ?? [])
}

// POST — criar novo perfil
export async function POST(request: NextRequest) {
  const admin = await verificarAdmin()
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { nome, label, paginas } = await request.json()

  if (!nome || !label) {
    return NextResponse.json({ error: 'Nome e label são obrigatórios' }, { status: 400 })
  }

  const { data: perfil, error } = await supabaseAdmin
    .from('perfis')
    .insert({ nome: nome.toLowerCase().replace(/\s+/g, '_'), label })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (paginas?.length > 0) {
    await supabaseAdmin.from('permissoes').insert(
      paginas.map((p: string) => ({ perfil_id: perfil.id, pagina: p }))
    )
  }

  return NextResponse.json({ ok: true, id: perfil.id })
}

// PATCH — editar perfil (label e permissões)
export async function PATCH(request: NextRequest) {
  const admin = await verificarAdmin()
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id, label, paginas } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  if (label) {
    const { error } = await supabaseAdmin.from('perfis').update({ label }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (paginas !== undefined) {
    // Remove permissões antigas e insere as novas
    await supabaseAdmin.from('permissoes').delete().eq('perfil_id', id)
    if (paginas.length > 0) {
      await supabaseAdmin.from('permissoes').insert(
        paginas.map((p: string) => ({ perfil_id: id, pagina: p }))
      )
    }
  }

  return NextResponse.json({ ok: true })
}

// DELETE — excluir perfil
export async function DELETE(request: NextRequest) {
  const admin = await verificarAdmin()
  if (!admin) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })

  // Não permite excluir o perfil administrador
  const { data: perfil } = await supabaseAdmin.from('perfis').select('nome').eq('id', id).single()
  if (perfil?.nome === 'administrador') {
    return NextResponse.json({ error: 'O perfil Administrador não pode ser excluído' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('perfis').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
