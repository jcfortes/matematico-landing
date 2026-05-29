import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { PerfisClient } from './PerfisClient'

export default async function PerfisPage() {
  const { data: perfis } = await supabaseAdmin
    .from('perfis')
    .select('id, nome, label, created_at, permissoes(pagina)')
    .order('created_at')

  return (
    <AdminLayout>
      <div className="p-8">
        <PerfisClient perfis={perfis ?? []} />
      </div>
    </AdminLayout>
  )
}
