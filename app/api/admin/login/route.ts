import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 })
  }

  // Autenticar via Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.session) {
    return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
  }

  // Verificar se o usuário tem role de administrador
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !['administrador', 'gestor'].includes(profile?.role ?? '')) {
    return NextResponse.json({ error: 'Acesso restrito à equipe da plataforma' }, { status: 403 })
  }

  // Salvar access_token em cookie httpOnly
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_token', authData.session.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/',
  })

  return response
}
