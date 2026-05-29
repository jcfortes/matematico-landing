import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET — lista todos os textos editáveis, agrupados por seção e ordem
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('landing_content')
    .select('*')
    .order('secao')
    .order('ordem')
    .order('key')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// PUT — atualiza valores em lote (recebe array de { key, valor })
// Permite salvar a tela inteira de uma vez sem N requisições.
export async function PUT(request: NextRequest) {
  const body = await request.json()
  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: 'items deve ser um array' }, { status: 400 })
  }

  const erros: string[] = []
  for (const item of body.items) {
    if (typeof item?.key !== 'string' || typeof item?.valor !== 'string') {
      erros.push(`Item inválido: ${JSON.stringify(item)}`)
      continue
    }
    const { error } = await supabaseAdmin
      .from('landing_content')
      .update({
        valor: item.valor,
        atualizado_em: new Date().toISOString(),
      })
      .eq('key', item.key)
    if (error) erros.push(`${item.key}: ${error.message}`)
  }

  if (erros.length > 0) {
    return NextResponse.json({ error: erros.join('\n') }, { status: 500 })
  }
  return NextResponse.json({ ok: true, atualizados: body.items.length })
}
