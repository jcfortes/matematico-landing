import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../../../../AdminLayout'
import { AppForm } from '../../AppForm'

export const dynamic = 'force-dynamic'

export default async function EditarAppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: app } = await supabaseAdmin
    .from('landing_apps')
    .select('*')
    .eq('id', id)
    .single()

  if (!app) notFound()

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Editar app: {app.nome}</h1>
          <p className="text-white/50 text-sm mt-1">
            <Link href="/admin/landing/apps" className="text-emerald-400 hover:text-emerald-300">← Voltar à lista</Link>
          </p>
        </div>
        <AppForm app={{
          id: app.id,
          slug: app.slug,
          ordem: app.ordem,
          status: app.status,
          emoji: app.emoji,
          tagline: app.tagline,
          nome: app.nome,
          descricao: app.descricao,
          recursos: Array.isArray(app.recursos) ? app.recursos : [],
          url: app.url,
        }} />
      </div>
    </AdminLayout>
  )
}
