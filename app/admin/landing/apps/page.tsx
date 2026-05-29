import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../../AdminLayout'
import { AppsAdminClient } from './AppsAdminClient'

export const dynamic = 'force-dynamic'

export default async function AppsAdminPage() {
  const { data: apps } = await supabaseAdmin
    .from('landing_apps')
    .select('*')
    .order('ordem')

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Apps da Landing</h1>
            <p className="text-white/50 text-sm mt-1">
              Adicione, edite, reordene ou esconda os apps que aparecem na home. <Link href="/admin/landing" className="text-emerald-400 hover:text-emerald-300">← Voltar para textos</Link>
            </p>
          </div>
          <Link
            href="/admin/landing/apps/novo"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            + Novo app
          </Link>
        </div>

        <AppsAdminClient apps={apps ?? []} />
      </div>
    </AdminLayout>
  )
}
