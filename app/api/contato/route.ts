import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { nome, email, assunto, mensagem } = body

  if (!nome || !email || !assunto) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('contatos')
    .insert({ nome, email, assunto, mensagem, created_at: new Date().toISOString() })

  if (error) {
    console.error('[contato] Supabase error:', error)
    return NextResponse.json({ error: 'Erro ao salvar mensagem.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
