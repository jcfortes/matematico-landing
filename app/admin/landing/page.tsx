import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { LandingAdminClient } from './LandingAdminClient'

export default async function LandingAdminPage() {
  const { data: itens } = await supabaseAdmin
    .from('landing_content')
    .select('*')
    .order('secao')
    .order('ordem')
    .order('key')

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Textos da Landing</h1>
          <p className="text-white/50 text-sm mt-1">
            Edite os textos da página inicial. As alterações aparecem imediatamente após salvar.
          </p>
        </div>
        <LandingAdminClient itens={itens ?? []} />
      </div>
    </AdminLayout>
  )
}
