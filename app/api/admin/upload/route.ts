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

/**
 * POST — upload de imagem pro Supabase Storage.
 *
 * Body: FormData com:
 *   file   — arquivo de imagem (max 5MB, png/jpg/webp/gif)
 *   bucket — opcional, default 'landing-imagens'
 *
 * Retorna: { url: string } com URL pública da imagem
 */
export async function POST(request: NextRequest) {
  const user = await verificarAdmin()
  if (!user) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'landing-imagens'

    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 })
    }

    // Valida tipo
    const tiposAceitos = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    if (!tiposAceitos.includes(file.type)) {
      return NextResponse.json({
        error: `Tipo não suportado. Aceitos: ${tiposAceitos.join(', ')}`,
      }, { status: 400 })
    }

    // Valida tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        error: 'Arquivo maior que 5MB. Comprima ou escolha outra imagem.',
      }, { status: 400 })
    }

    // Gera nome único: timestamp + slug do nome original
    const ext = file.name.split('.').pop() ?? 'png'
    const slug = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40) || 'img'
    const nomeArquivo = `${Date.now()}-${slug}.${ext}`

    // Converte File pra ArrayBuffer
    const buffer = await file.arrayBuffer()

    // Upload
    const { error: uploadErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadErr) {
      console.error('[upload] erro:', uploadErr)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    // Pega URL pública
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(nomeArquivo)

    return NextResponse.json({ url: publicUrl, nome: nomeArquivo })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'erro desconhecido'
    console.error('[upload]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
